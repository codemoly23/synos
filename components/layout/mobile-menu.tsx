"use client";

import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
	DrawerClose,
	DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { mainNav } from "@/config/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export function MobileMenu() {
	const [openItem, setOpenItem] = useState<string | null>(null);
	const [openSubItem, setOpenSubItem] = useState<string | null>(null);

	const toggleItem = (title: string) => {
		setOpenItem(openItem === title ? null : title);
		setOpenSubItem(null); // Close sub-items when toggling main item
	};

	const toggleSubItem = (title: string) => {
		setOpenSubItem(openSubItem === title ? null : title);
	};

	return (
		<Drawer direction="right">
			{/* Trigger / Menu Icon */}
			<DrawerTrigger asChild>
				<Button
					variant="ghost"
					className="lg:hidden focus:outline-none hover:bg-secondary-dark/10 transition-colors"
					aria-label="Open menu"
				>
					<Menu className="h-6 w-6 text-secondary-dark" />
				</Button>
			</DrawerTrigger>

			{/* Drawer Content */}
			<DrawerContent className="lg:hidden px-0 border-none mobile-menu-glass bg-accent!">
				<DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
				<div className="h-full flex flex-col">
					{/* Header */}
					<div className="mobile-menu-header-glass flex items-center justify-between px-6 py-5">
						<motion.h2
							className="text-2xl font-bold text-secondary-dark uppercase tracking-wide"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3 }}
						>
							{siteConfig.name}
						</motion.h2>
						<DrawerClose asChild>
							<Button
								variant="ghost"
								className="text-secondary-dark/80 hover:text-secondary-dark hover:bg-secondary-dark/10 transition-colors"
								aria-label="Close menu"
							>
								<X className="h-6 w-6" />
							</Button>
						</DrawerClose>
					</div>

					{/* Navigation */}
					<nav className="flex-1 overflow-y-auto">
						<div className="px-4 py-6 space-y-2">
							{mainNav.map((item, index) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										delay: index * 0.05,
										duration: 0.3,
										ease: [0.4, 0, 0.2, 1],
									}}
								>
									{/* Main Menu Item */}
									<div className="mobile-menu-item rounded-lg overflow-hidden">
										<div className="flex items-center justify-between">
											{item.items ? (
												<button
													onClick={() => toggleItem(item.title)}
													className="flex-1 py-3.5 px-4 text-left text-secondary-dark font-medium uppercase tracking-wide text-sm flex items-center gap-2"
													aria-expanded={openItem === item.title}
												>
													<span>{item.title}</span>
												</button>
											) : (
												<Link
													href={item.href}
													className="flex-1 py-3.5 px-4 text-secondary-dark font-medium uppercase tracking-wide text-sm"
												>
													{item.title}
												</Link>
											)}

											{/* Dropdown arrow */}
											{item.items && (
												<button
													onClick={() => toggleItem(item.title)}
													className="p-4 text-secondary-dark/80 hover:text-secondary-dark transition-colors"
													aria-label={`Toggle ${item.title} submenu`}
												>
													<ChevronDown
														className={cn(
															"h-5 w-5 chevron-rotate",
															openItem === item.title && "open"
														)}
													/>
												</button>
											)}
										</div>

										{/* Submenu Level 1 */}
										<AnimatePresence>
											{item.items && openItem === item.title && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1],
													}}
													className="overflow-hidden"
												>
													<div className="pl-4 pr-2 pb-2 space-y-1">
														{item.items.map((subItem) => (
															<div key={subItem.href}>
																{/* Sub Menu Item */}
																<div className="mobile-submenu-item rounded-md overflow-hidden">
																	<div className="flex items-center justify-between">
																		{subItem.items ? (
																			<button
																				onClick={() =>
																					toggleSubItem(
																						subItem.title
																					)
																				}
																				className="flex-1 py-2.5 px-3 text-left text-secondary-dark/90 text-sm flex items-center gap-2"
																				aria-expanded={
																					openSubItem ===
																					subItem.title
																				}
																			>
																				<ChevronRight className="h-3.5 w-3.5 text-secondary-dark/60" />
																				<span>
																					{subItem.title}
																				</span>
																			</button>
																		) : (
																			<Link
																				href={subItem.href}
																				className="flex-1 py-2.5 px-3 text-secondary-dark/90 text-sm flex items-center gap-2 hover:text-secondary-dark transition-colors"
																			>
																				<ChevronRight className="h-3.5 w-3.5 text-secondary-dark/60" />
																				<span>
																					{subItem.title}
																				</span>
																			</Link>
																		)}

																		{/* Sub-dropdown arrow */}
																		{subItem.items && (
																			<button
																				onClick={() =>
																					toggleSubItem(
																						subItem.title
																					)
																				}
																				className="p-2 text-secondary-dark/60 hover:text-secondary-dark transition-colors"
																				aria-label={`Toggle ${subItem.title} submenu`}
																			>
																				<ChevronDown
																					className={cn(
																						"h-4 w-4 chevron-rotate",
																						openSubItem ===
																							subItem.title &&
																							"open"
																					)}
																				/>
																			</button>
																		)}
																	</div>

																	{/* Submenu Level 2 */}
																	<AnimatePresence>
																		{subItem.items &&
																			openSubItem ===
																				subItem.title && (
																				<motion.div
																					initial={{
																						height: 0,
																						opacity: 0,
																					}}
																					animate={{
																						height:
																							"auto",
																						opacity: 1,
																					}}
																					exit={{
																						height: 0,
																						opacity: 0,
																					}}
																					transition={{
																						duration: 0.3,
																						ease: [
																							0.4, 0,
																							0.2, 1,
																						],
																					}}
																					className="overflow-hidden"
																				>
																					<div className="pl-6 pr-2 pb-2 space-y-1">
																						{subItem.items.map(
																							(
																								subSubItem
																							) => (
																								<Link
																									key={
																										subSubItem.href
																									}
																									href={
																										subSubItem.href
																									}
																									className="block py-2 px-3 text-secondary-dark/80 text-xs hover:text-secondary-dark hover:bg-secondary-dark/5 rounded-md transition-all"
																								>
																									{
																										subSubItem.title
																									}
																								</Link>
																							)
																						)}
																					</div>
																				</motion.div>
																			)}
																	</AnimatePresence>
																</div>
															</div>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</motion.div>
							))}
						</div>
					</nav>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
