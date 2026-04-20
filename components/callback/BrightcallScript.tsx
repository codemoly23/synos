"use client";

import { useEffect } from "react";

interface BrightcallScriptProps {
	widgetKey: string;
	apiBaseUrl?: string;
}

/**
 * Loads the Brightcall (Convolo.ai) callback widget.
 * Mirrors the official embed snippet:
 *
 * <script>
 *   window.leadCM = { widget_key };
 *   const em = document.createElement('script');
 *   em.src = `${apiBaseUrl}/js/icallback.js?v=${random}&key=${widget_key}&uri=${currentUrl}`;
 *   em.async = true;
 *   // inserted before the first <script> on the page
 * </script>
 *
 * Mounted once via the client layout. When the widget key or base URL changes
 * (e.g. admin toggles settings) the previously injected script + any widget
 * DOM are torn down before reinjecting.
 */
export function BrightcallScript({
	widgetKey,
	apiBaseUrl = "https://app.convolo.ai",
}: BrightcallScriptProps) {
	useEffect(() => {
		if (!widgetKey) return;

		const base = apiBaseUrl.replace(/\/+$/, "");
		const src = `${base}/js/icallback.js?v=${Math.random()}&key=${encodeURIComponent(
			widgetKey
		)}&uri=${encodeURIComponent(window.location.href)}`;

		(window as unknown as { leadCM?: Record<string, unknown> }).leadCM = {
			widget_key: widgetKey,
		};

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.async = true;
		script.src = src;
		script.dataset.brightcall = "1";

		const firstScript = document.getElementsByTagName("script")[0];
		if (firstScript?.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		} else {
			document.head.appendChild(script);
		}

		return () => {
			script.remove();
			document
				.querySelectorAll('[id^="convolo"], [class*="convolo"], [id^="leadCM"]')
				.forEach((el) => el.remove());
			delete (window as unknown as { leadCM?: Record<string, unknown> }).leadCM;
		};
	}, [widgetKey, apiBaseUrl]);

	return null;
}
