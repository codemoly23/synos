import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

/**
 * Next.js 16 Proxy (Middleware)
 * Protects routes that require authentication
 *
 * Better Auth stores session cookies automatically.
 * Cookie name: "better-auth.session_token" (Better Auth default)
 */

/**
 * Define which routes should be protected
 * These routes require authentication
 */
export const config = {
	matcher: [
		// Protected page routes
		"/dashboard/:path*",
		"/profile/:path*",
		"/settings/:path*",
		"/admin/:path*",

		// Protected API routes (optional - APIs can also handle auth inline)
		// "/api/user/:path*",
	],
};

/**
 * Proxy function - runs before routes are rendered
 * Checks authentication status and redirects/blocks if needed
 */
export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	// Log the request (helpful for debugging)
	logger.debug("Proxy checking route", { pathname });

	// Check for Better Auth session cookie
	// Better Auth uses "better-auth.session_token" by default
	const sessionToken =
		request.cookies.get("synos.session_token")?.value ||
		request.cookies.get("__Secure-synos.session_token")?.value;

	// Alternative: Check for custom session cookie if you configured one
	// const sessionToken = request.cookies.get("synos_session")?.value;
	// Determine if user is authenticated
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

		// Allow authenticated API requests to proceed
		return NextResponse.next();
	}

	// Handle page routes - redirect to login if not authenticated
	if (!isAuthenticated) {
		logger.info("Redirecting unauthenticated user to login", { pathname });

		// Build login URL with callback
		const loginUrl = new URL("/login", request.url);

		// Preserve the original path for post-login redirect
		loginUrl.searchParams.set("callbackUrl", pathname);

		return NextResponse.redirect(loginUrl);
	}

	// User is authenticated, allow access
	logger.debug("Authenticated user accessing protected route", { pathname });

	return NextResponse.next();
}
