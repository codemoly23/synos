"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
		}, 200); // 200ms delay for smoother UX
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
		<nav className="hidden lg:flex lg:gap-6 xl:gap-8 items-center z-20">
			{mainNav.map((item) => (
				<div
					key={item.href}
					className="relative z-10"
					onMouseEnter={() => item.items && handleMouseEnter(item.title)}
					onMouseLeave={handleMouseLeave}
				>
					<Link
						href={item.href}
						className={cn(
							"nav-item-hover flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide py-2 transition-colors duration-300",
							activeMenu === item.title
								? "text-primary"
								: "text-secondary-dark"
						)}
					>
						{item.title}
						{item.items && (
							<motion.div
								animate={{
									rotate: activeMenu === item.title ? 180 : 0,
								}}
								transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
							>
								<ChevronDown className="h-4 w-4" />
							</motion.div>
						)}
					</Link>

					{/* Dropdown Menu */}
					<AnimatePresence>
						{item.items && activeMenu === item.title && (
							<motion.div
								className="absolute left-0 top-full z-50 mt-2 min-w-[280px] max-w-[320px]"
								initial={{ opacity: 0, y: -8, scale: 0.96 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -8, scale: 0.96 }}
								transition={{
									duration: 0.3,
									ease: [0.16, 1, 0.3, 1],
								}}
								onMouseEnter={() => handleMouseEnter(item.title)}
								onMouseLeave={handleMouseLeave}
							>
								<div className="nav-dropdown-glass rounded-xl p-4 shadow-2xl max-h-[calc(100vh-10rem)] overflow-y-auto">
									<div className="grid gap-3">
										{item.items.map((subItem, index) => (
											<motion.div
												key={subItem.href}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{
													delay: index * 0.05,
													duration: 0.3,
													ease: [0.4, 0, 0.2, 1],
												}}
											>
												<Link
													href={subItem.href}
													className="block font-semibold text-foreground hover:text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-primary/5"
												>
													{subItem.title}
												</Link>
												{subItem.items && (
													<div className="ml-3 mt-2 grid gap-1.5 border-l-2 border-primary/20 pl-3">
														{subItem.items.map((subSubItem) => (
															<Link
																key={subSubItem.href}
																href={subSubItem.href}
																className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300 py-1.5 px-2 rounded-md hover:bg-primary/5"
															>
																{subSubItem.title}
															</Link>
														))}
													</div>
												)}
											</motion.div>
										))}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			))}
		</nav>
	);
}
