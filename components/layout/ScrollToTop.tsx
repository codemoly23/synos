"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
	const pathname = usePathname();

	useEffect(() => {
		if (!window.location.hash) {
			window.scrollTo({ top: 0, behavior: "instant" });
		}
	}, [pathname]);

	return null;
}
