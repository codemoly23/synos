"use client";

import { useEffect } from "react";

export function NotFoundLogger() {
	useEffect(() => {
		const url = window.location.pathname;
		const referrer = document.referrer || "";

		fetch("/api/404-logs", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ url, referrer }),
		}).catch(() => {
			// Silently ignore - logging should never break the 404 page
		});
	}, []);

	return null;
}
