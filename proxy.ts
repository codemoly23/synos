import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

/**
 * Next.js 16 Proxy
 * Handles:
 * 1. Authentication protection for dashboard/admin routes
 * 2. 404 redirect checking for public routes
 *
 * Better Auth stores session cookies automatically.
 * Cookie name: "synos.session_token" (Better Auth configured)
 */

// In-memory cache for 404 redirects
let redirectCache: Map<string, string> | null = null;
let cacheExpiry = 0;
const CACHE_TTL = 60_000; // 60 seconds

async function fetchRedirectSource(
	url: string,
	headers: Record<string, string>
): Promise<Array<{ url?: string; redirectUrl?: string; fromUrl?: string; toUrl?: string }>> {
	try {
		const res = await fetch(url, {
			headers,
			signal: AbortSignal.timeout(3000),
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data.redirects || [];
	} catch {
		return [];
	}
}

async function getRedirects(
	request: NextRequest
): Promise<Map<string, string>> {
	const now = Date.now();
	if (redirectCache && now < cacheExpiry) {
		return redirectCache;
	}

	const baseUrl = request.nextUrl.origin;
	const headers = {
		"x-middleware-secret": process.env.MIDDLEWARE_SECRET || "",
	};

	const [legacyEntries, redirectEntries] = await Promise.all([
		fetchRedirectSource(`${baseUrl}/api/404-logs/redirects`, headers),
		fetchRedirectSource(`${baseUrl}/api/redirects/active`, headers),
	]);

	if (legacyEntries.length === 0 && redirectEntries.length === 0) {
		return redirectCache || new Map();
	}

	const map = new Map<string, string>();
	// Legacy 404-log redirects first, then the dedicated Redirect model
	// overrides on conflict (source of truth for anything created going forward).
	for (const entry of legacyEntries) {
		if (entry.url && entry.redirectUrl) map.set(entry.url, entry.redirectUrl);
	}
	for (const entry of redirectEntries) {
		if (entry.fromUrl && entry.toUrl) map.set(entry.fromUrl, entry.toUrl);
	}

	redirectCache = map;
	cacheExpiry = now + CACHE_TTL;
	return map;
}

/**
 * Define which routes the proxy should handle
 */
export const config = {
	matcher: [
		// Protected page routes (auth check)
		"/dashboard/:path*",
		"/profile/:path*",
		"/settings/:path*",
		"/admin/:path*",

		// Public page routes (redirect check only)
		"/((?!_next/static|_next/image|favicon.ico|api/).*)",
	],
};

/**
 * Proxy function - runs before routes are rendered
 */
export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Skip static files
	if (pathname.includes(".")) {
		return NextResponse.next();
	}

	// ================================================================
	// 1. AUTH PROTECTION for dashboard/admin routes
	// ================================================================
	const isProtectedRoute =
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/profile") ||
		pathname.startsWith("/settings") ||
		pathname.startsWith("/admin");

	if (isProtectedRoute) {
		logger.debug("Proxy checking route", { pathname });

		const sessionToken =
			request.cookies.get("synos.session_token")?.value ||
			request.cookies.get("__Secure-synos.session_token")?.value;

		const isAuthenticated = !!sessionToken;

		// Handle API routes - return 401 JSON instead of redirect
		if (pathname.startsWith("/api/")) {
			if (!isAuthenticated) {
				logger.warn("Unauthorized API access attempt", { pathname });
				return NextResponse.json(
					{
						success: false,
						message: "Unauthorized - Authentication required",
						error: "UNAUTHORIZED",
					},
					{ status: 401 }
				);
			}
			return NextResponse.next();
		}

		// Handle page routes - redirect to login if not authenticated
		if (!isAuthenticated) {
			logger.info("Redirecting unauthenticated user to login", {
				pathname,
			});
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}

		logger.debug("Authenticated user accessing protected route", {
			pathname,
		});
		return NextResponse.next();
	}

	// ================================================================
	// 2. 404 REDIRECT CHECK for public routes
	// ================================================================
	// Skip Next.js internals, API routes, auth pages
	if (
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/api/") ||
		pathname.startsWith("/auth") ||
		pathname.startsWith("/login") ||
		pathname.startsWith("/register")
	) {
		return NextResponse.next();
	}

	try {
		const redirects = await getRedirects(request);
		const normalizedPath =
			pathname.toLowerCase().replace(/\/+$/, "") || "/";
		const redirectUrl = redirects.get(normalizedPath);

		if (redirectUrl) {
			const destination = redirectUrl.startsWith("http")
				? redirectUrl
				: new URL(redirectUrl, request.nextUrl.origin).toString();
			return NextResponse.redirect(destination, 301);
		}
	} catch {
		// Never block page rendering due to redirect check failure
	}

	// ================================================================
	// 3. TRAILING SLASH ENFORCEMENT for public page routes
	// ================================================================
	// Handled here instead of Next's built-in trailingSlash redirect
	// (next.config.mjs keeps skipTrailingSlashRedirect: true) because that
	// built-in redirect was found to also fire on /api/** routes, including
	// POST requests — a real regression risk for form submissions. This
	// block only runs for routes that already passed the /api/ exclusion
	// above, so API routes are never affected.
	if (pathname !== "/" && !pathname.endsWith("/")) {
		const destination = `${request.nextUrl.origin}${pathname}/${request.nextUrl.search}`;
		return NextResponse.redirect(destination, 308);
	}

	return NextResponse.next();
}
