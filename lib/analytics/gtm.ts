// GTM / dataLayer event helpers.
// Tracking IDs are managed via the admin panel (Settings → Tracking).
// These helpers are safe to call from any client component — they are no-ops
// if the dataLayer is not yet initialised.

declare global {
	interface Window {
		dataLayer: Record<string, unknown>[];
	}
}

export const pushEvent = (eventName: string, data?: Record<string, unknown>) => {
	if (typeof window === "undefined") return;
	// Initialise dataLayer eagerly so events are queued even before GTM loads
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event: eventName, ...data });
};

export const pushPageview = (path: string) => {
	pushEvent("pageview", { page_path: path, page_title: document.title });
};
