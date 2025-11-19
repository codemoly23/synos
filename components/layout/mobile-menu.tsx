"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	const toggleExpanded = (title: string) => {
		setExpandedItems((prev) =>
			prev.includes(title)
				? prev.filter((item) => item !== title)
				: [...prev, title]
		);
	};

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<div className="lg:hidden">
			{/* Hamburger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-background-soft transition-colors"
				aria-label="Toggle menu"
				aria-expanded={isOpen}
			>
				<svg
					className="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					{isOpen ? (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					) : (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					)}
				</svg>
			</button>

			{/* Mobile Menu Overlay */}
			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>
					<div className="fixed inset-y-0 right-0 z-110 w-full max-w-sm flex flex-col bg-white border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
						{/* Header - Fixed at top */}
						<div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-white">
							<span className="text-lg font-bold text-primary">
								Menu
							</span>
							<button
								onClick={() => setIsOpen(false)}
								className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-background-soft transition-colors"
								aria-label="Close menu"
							>
								<svg
									className="h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Navigation - Scrollable content */}
						<nav className="flex-1 overflow-y-auto bg-white">
							<div className="flex flex-col px-4 py-2">
								{mainNav.map((item) => (
									<div
										key={item.href}
										className="border-b border-border last:border-0 py-1"
									>
										<div className="flex items-center justify-between">
											<Link
												href={item.href}
												className="flex-1 py-2 font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide text-xs"
												onClick={() =>
													!item.items && setIsOpen(false)
												}
											>
												{item.title}
											</Link>
											{item.items && (
												<button
													onClick={() =>
														toggleExpanded(item.title)
													}
													className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
													aria-label={`Toggle ${item.title} submenu`}
												>
													<svg
														className={cn(
															"h-4 w-4 transition-transform duration-200",
															expandedItems.includes(
																item.title
															) && "rotate-180"
														)}
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
												</button>
											)}
										</div>

										{item.items &&
											expandedItems.includes(item.title) && (
												<div className="ml-3 flex flex-col border-l-2 border-primary/20 pl-3 mt-1 mb-2 animate-in slide-in-from-top duration-200">
													{item.items.map((subItem) => (
														<div key={subItem.href}>
															<Link
																href={subItem.href}
																className="block py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
																onClick={() =>
																	!subItem.items &&
																	setIsOpen(false)
																}
															>
																{subItem.title}
															</Link>
															{subItem.items && (
																<div className="ml-3 mt-0.5 flex flex-col">
																	{subItem.items.map(
																		(subSubItem) => (
																			<Link
																				key={
																					subSubItem.href
																				}
																				href={
																					subSubItem.href
																				}
																				className="block py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
																				onClick={() =>
																					setIsOpen(false)
																				}
																			>
																				{subSubItem.title}
																			</Link>
																		)
																	)}
																</div>
															)}
														</div>
													))}
												</div>
											)}
									</div>
								))}
							</div>
						</nav>
					</div>
				</>
			)}
		</div>
	);
}
