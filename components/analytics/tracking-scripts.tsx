"use client";

import { useEffect, useRef, useCallback } from "react";

interface TrackingScriptsProps {
	gtmId: string;
	fbPixelId: string;
	ga4Id: string;
	googleAdsId: string;
	cookiebotId: string;
}

declare global {
	interface Window {
		dataLayer: Record<string, unknown>[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		gtag: (...args: any[]) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fbq?: (...args: any[]) => void;
		_fbq?: unknown;
		Cookiebot?: {
			consent: {
				marketing: boolean;
				statistics: boolean;
				preferences: boolean;
				necessary: boolean;
			};
		};
	}
}

// Module-level flag: prevents double-patching history in React Strict Mode
// (Strict Mode mounts → cleanup → remount, so the effect runs twice in dev).
let historyPatched = false;

export function TrackingScripts({
	gtmId,
	fbPixelId,
	ga4Id,
	googleAdsId,
	cookiebotId,
}: TrackingScriptsProps) {
	const gtmIdRef = useRef(gtmId);

	// ── Loaders (fallback path used only when GTM isn't configured) ──────────

	const loadGA4 = useCallback((gId: string, adsId: string) => {
		if (document.getElementById("gtag-runtime")) return;
		const primaryId = gId || adsId;
		if (!primaryId) return;
		// Initialise dataLayer eagerly so pushEvent() callers never drop events
		window.dataLayer = window.dataLayer || [];
		// Must be a regular function (not arrow) so `arguments` is captured for gtag
		window.gtag = function () {
			// eslint-disable-next-line prefer-rest-params
			window.dataLayer.push(arguments as unknown as Record<string, unknown>);
		};
		window.gtag("js", new Date());
		if (gId) window.gtag("config", gId);
		if (adsId) window.gtag("config", adsId);
		const s = document.createElement("script");
		s.id = "gtag-runtime";
		s.async = true;
		s.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
		document.head.appendChild(s);
	}, []);

	const loadPixel = useCallback((id: string) => {
		if (typeof window.fbq === "function") return;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const n: any = function (...args: unknown[]) {
			if (n.callMethod) n.callMethod.apply(n, args);
			else n.queue.push(args);
		};
		if (!window._fbq) window._fbq = n;
		window.fbq = n;
		n.push = n;
		n.loaded = true;
		n.version = "2.0";
		n.queue = [];
		const s = document.createElement("script");
		s.async = true;
		s.src = "https://connect.facebook.net/en_US/fbevents.js";
		const x = document.getElementsByTagName("script")[0];
		x.parentNode?.insertBefore(s, x);
		window.fbq?.("init", id);
		window.fbq?.("track", "PageView");
	}, []);

	// ── Consent Mode v2: relay Cookiebot's real choice into gtag('consent', ──
	// 'update', ...). GTM itself is already loaded in <head> (see app/layout.tsx)
	// with everything defaulted to "denied" — this just updates that signal.
	// Whether tags actually fire on "granted" depends on each tag's own
	// consent-check configuration inside the GTM container (not this code).

	const updateConsent = useCallback(() => {
		const consent = window.Cookiebot?.consent;
		if (!consent || !window.gtag) return;
		window.gtag("consent", "update", {
			ad_storage: consent.marketing ? "granted" : "denied",
			analytics_storage: consent.statistics ? "granted" : "denied",
			ad_user_data: consent.marketing ? "granted" : "denied",
			ad_personalization: consent.marketing ? "granted" : "denied",
		});
	}, []);

	// ── Trigger all configured tracking ──────────────────────────────────────

	const triggerTracking = useCallback(() => {
		if (gtmId) {
			// GTM already loaded via the beforeInteractive script in <head>.
			return;
		}
		// No GTM — load GA4, Google Ads, and/or Pixel directly.
		if (ga4Id || googleAdsId) loadGA4(ga4Id, googleAdsId);
		if (fbPixelId) loadPixel(fbPixelId);
	}, [gtmId, fbPixelId, ga4Id, googleAdsId, loadGA4, loadPixel]);

	// ── Initial load / consent wiring ─────────────────────────────────────────

	useEffect(() => {
		if (!cookiebotId) {
			triggerTracking();
			return;
		}

		const checkAndLoad = () => {
			if (gtmId) {
				// Relay whatever Cookiebot reports (granted or denied) as a
				// Consent Mode update — GTM is never blocked from loading.
				updateConsent();
			} else if (window.Cookiebot?.consent?.marketing) {
				// No GTM: fall back to the old gate-until-consent behavior.
				triggerTracking();
			}
		};

		// CookiebotOnLoad: fires on every page load and reads the stored consent
		window.addEventListener("CookiebotOnLoad", checkAndLoad);
		// CookiebotOnAccept: fires when the user actively accepts via the banner
		window.addEventListener("CookiebotOnAccept", checkAndLoad);
		// Immediate check in case Cookiebot already ran before this effect
		checkAndLoad();

		return () => {
			window.removeEventListener("CookiebotOnLoad", checkAndLoad);
			window.removeEventListener("CookiebotOnAccept", checkAndLoad);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── SPA route-change pageviews via History API ────────────────────────────
	// Avoids usePathname() which caused hydration mismatches in the root layout.
	// Guards:
	//   1. Only fire when the pathname actually changes (not on search-param
	//      updates from NuqsAdapter, filters, pagination, etc.)
	//   2. Module-level historyPatched flag prevents double-patching in
	//      React Strict Mode dev double-invoke.
	//   3. setTimeout(0) defers the title read so React has rendered the new
	//      page before we capture document.title.

	useEffect(() => {
		if (historyPatched) return;
		historyPatched = true;

		let lastPath = window.location.pathname;

		const trackNav = () => {
			const path = window.location.pathname;
			// Ignore URL changes that only modify search params / hash
			if (path === lastPath) return;
			lastPath = path;

			// Defer one tick so React finishes rendering and document.title is updated
			setTimeout(() => {
				const currentPath = window.location.pathname;

				if (window.dataLayer) {
					window.dataLayer.push({
						event: "pageview",
						page_path: currentPath,
						page_title: document.title,
					});
				}
				// GA4 direct (no GTM)
				if (!gtmIdRef.current && window.gtag) {
					window.gtag("event", "page_view", {
						page_path: currentPath,
						page_title: document.title,
					});
				}
				// FB Pixel direct (no GTM)
				if (!gtmIdRef.current && window.fbq) {
					window.fbq("track", "PageView");
				}
			}, 0);
		};

		const origPush = history.pushState.bind(history);
		const origReplace = history.replaceState.bind(history);

		history.pushState = (...args: Parameters<typeof history.pushState>) => {
			origPush(...args);
			trackNav();
		};
		history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
			origReplace(...args);
			trackNav();
		};
		window.addEventListener("popstate", trackNav);

		return () => {
			// Only clean up if we were the ones who patched
			history.pushState = origPush;
			history.replaceState = origReplace;
			window.removeEventListener("popstate", trackNav);
			historyPatched = false;
		};
	}, []); // mount-only — gtmId accessed via ref

	return null;
}
