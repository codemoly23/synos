"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function Navigation() {
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = (title: string) => {
		// Clear any pending close timeout
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
		setActiveMenu(title);
	};

	const handleMouseLeave = () => {
		// Add delay before closing dropdown
		closeTimeoutRef.current = setTimeout(() => {
			setActiveMenu(null);
		}, 300); // 300ms delay
	};

	// Clear timeout on unmount
	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, []);

	return (
		<nav className="hidden lg:flex lg:gap-8">
			{mainNav.map((item) => (
				<div
					key={item.href}
					className="relative"
					onMouseEnter={() => item.items && handleMouseEnter(item.title)}
					onMouseLeave={handleMouseLeave}
				>
					<Link
						href={item.href}
						className={cn(
							"flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary uppercase tracking-wide",
							activeMenu === item.title && "text-primary"
						)}
					>
						{item.title}
						{item.items && (
							<svg
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						)}
					</Link>

					{/* Dropdown Menu */}
					{item.items && activeMenu === item.title && (
						<div
							className="absolute max-h-[calc(100vh-10rem)] w-full min-w-min overflow-y-auto left-0 bg-white top-full z-50 mt-1 rounded-lg border border-border p-6 shadow-lg"
							onMouseEnter={() => handleMouseEnter(item.title)}
							onMouseLeave={handleMouseLeave}
						>
							<div className="grid gap-4">
								{item.items.map((subItem) => (
									<div key={subItem.href}>
										<Link
											href={subItem.href}
											className="block font-medium text-foreground hover:text-primary transition-colors"
										>
											{subItem.title}
										</Link>
										{subItem.items && (
											<div className="ml-4 mt-2 grid gap-2">
												{subItem.items.map((subSubItem) => (
													<Link
														key={subSubItem.href}
														href={subSubItem.href}
														className="block text-sm text-muted-foreground hover:text-primary transition-colors"
													>
														{subSubItem.title}
													</Link>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			))}
		</nav>
	);
}
