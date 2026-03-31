"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Package, GraduationCap, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface NavItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
	{
		label: "Hem",
		href: "/",
		icon: Home,
	},
	{
		label: "Utrustning",
		href: "/utrustning",
		icon: Package,
	},
	{
		label: "Utbildning",
		href: "/utbildningar",
		icon: GraduationCap,
	},
	{
		label: "Kontakt",
		href: "/kontakt",
		icon: Phone,
	},
];

export function MobileBottomNav() {
	const pathname = usePathname();
	const [nearFooter, setNearFooter] = useState(false);

	useEffect(() => {
		const footer = document.querySelector("footer");
		if (!footer) return;
		const observer = new IntersectionObserver(
			([entry]) => setNearFooter(entry.isIntersecting),
			{ threshold: 0 }
		);
		observer.observe(footer);
		return () => observer.disconnect();
	}, []);

	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	// Find active index for indicator positioning
	const activeIndex = navItems.findIndex((item) => isActive(item.href));

	return (
		<>
			{/* Floating Bottom Navigation - Mobile Only */}
			<nav
				className="fixed bottom-4 w-full left-0 px-3  z-50 md:hidden"
				aria-label="Mobile navigation"
			>
				{/* Outer container with dark bg matching top navbar */}
				<div className={cn(
					"relative backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden transition-colors duration-300",
					nearFooter
						? "bg-white/90 border border-slate-200"
						: "bg-secondary/70 border border-secondary/50"
				)}>
					{/* Subtle gradient overlay for depth */}
					<div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />

					{/* Navigation items container */}
					<div className="relative flex items-center justify-evenly px-1 py-2">
						{/* Animated active indicator - slides smoothly */}
						<motion.div
							className="absolute top-2 bottom-2 bg-white/10 rounded-xl"
							animate={{
								width: `calc(${100 / navItems.length}% - 8px)`,
								left: `calc(${(activeIndex * 100) / navItems.length}% + 4px)`,
								opacity: activeIndex >= 0 ? 1 : 0,
							}}
							transition={{
								type: "spring",
								stiffness: 350,
								damping: 30,
							}}
						/>

						{navItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);

							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"relative flex flex-col items-center justify-center flex-1 py-2.5 px-1 rounded-xl group",
										active ? "text-primary" : nearFooter ? "text-secondary/70" : "text-white/70"
									)}
									aria-current={active ? "page" : undefined}
								>
									{/* Icon with spring scale animation */}
									<motion.div
										className="relative flex items-center justify-center"
										animate={{
											scale: active ? 1.2 : 1,
										}}
										whileTap={{ scale: 1.3 }}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 17,
										}}
									>
										<Icon
											className={cn(
												"w-5 h-5 transition-colors duration-200",
												active
													? "text-primary"
													: nearFooter ? "text-secondary/70" : "text-white/70"
											)}
											strokeWidth={active ? 2.5 : 1.5}
											aria-hidden="true"
										/>

										{/* Glow effect behind active icon */}
										<AnimatePresence>
											{active && (
												<motion.div
													className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10"
													initial={{ opacity: 0, scale: 0 }}
													animate={{ opacity: 1, scale: 2.5 }}
													exit={{ opacity: 0, scale: 0 }}
													transition={{
														type: "spring",
														stiffness: 300,
														damping: 20,
													}}
												/>
											)}
										</AnimatePresence>
									</motion.div>

									{/* Label with smooth fade + slide */}
									<motion.span
										className={cn(
											"text-[11px] mt-1 font-medium truncate max-w-full",
											active
												? "text-primary font-semibold"
												: nearFooter ? "text-secondary/70" : "text-white/70"
										)}
										animate={{
											opacity: active ? 1 : 0.7,
										}}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 20,
										}}
									>
										{item.label}
									</motion.span>
								</Link>
							);
						})}
					</div>

					{/* Bottom accent line */}
					<div className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
				</div>
			</nav>
		</>
	);
}
