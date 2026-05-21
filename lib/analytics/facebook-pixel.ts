// Facebook Pixel event helpers.
// Tracking IDs are managed via the admin panel (Settings → Tracking).
// These helpers are safe to call from any client component — they are no-ops
// if the Pixel script has not yet loaded.

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fbq?: (...args: any[]) => void;
	}
}

const fbq = (...args: unknown[]) => {
	if (typeof window === "undefined" || !window.fbq) return;
	window.fbq(...args);
};

export const trackPageView = () => fbq("track", "PageView");

export const trackLead = (data?: Record<string, unknown>) =>
	fbq("track", "Lead", data);

export const trackContact = (data?: Record<string, unknown>) =>
	fbq("track", "Contact", data);

export const trackViewContent = (contentName: string, data?: Record<string, unknown>) =>
	fbq("track", "ViewContent", { content_name: contentName, ...data });
