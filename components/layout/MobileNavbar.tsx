"use client";

import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { mainNav } from "@/config/navigation";
import Logo from "../common/logo";
import { useState } from "react";
import ProtectedNavbar from "./ProtectedNavbar";

const MobileNavbar = () => {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden bg-none! hover:bg-transparent! p-0! w-auto! h-auto!"
				>
					<Menu className="h-6 w-6 text-secondary" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[280px] p-0 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex flex-col h-full">
					{/* Compact Header */}
					<div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
						<div onClick={() => setOpen(false)}>
							<Logo />
						</div>
						<SheetClose asChild>
							<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<X className="h-5 w-5 text-gray-800" />
							</button>
						</SheetClose>
					</div>

					{/* User Profile Section */}
					<div className="shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
						<div className="flex items-center gap-3">
							<ProtectedNavbar />
						</div>
					</div>

					{/* Scrollable Navigation */}
					<div className="flex-1 overflow-y-auto">
						<div className="px-2 py-2">
							<Accordion
								type="single"
								collapsible
								className="w-full space-y-0.5"
							>
								{mainNav.map((item, index) => (
									<AccordionItem
										key={item.title}
										value={`item-${index}`}
										className="border-0"
									>
										{item.items ? (
											<>
												<AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-secondary hover:text-primary hover:bg-primary/5 hover:no-underline rounded-lg transition-all data-[state=open]:bg-primary/5 data-[state=open]:text-primary">
													<Link
														href={item.href}
														className="flex-1 text-left"
														onClick={() => setOpen(false)}
													>
														{item.title}
													</Link>
												</AccordionTrigger>
												<AccordionContent className="pb-1 pt-0.5">
													<div className="ml-3 pl-3 border-l-2 border-primary/20 space-y-0.5">
														{item.items.map((subItem) => (
															<div key={subItem.title}>
																<Link
																	href={subItem.href}
																	className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
																	onClick={() =>
																		setOpen(false)
																	}
																>
																	{subItem.title}
																	{subItem.items && (
																		<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
																	)}
																</Link>
																{subItem.items && (
																	<div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5">
																		{subItem.items
																			.slice(0, 3)
																			.map((childItem) => (
																				<Link
																					key={
																						childItem.title
																					}
																					href={
																						childItem.href
																					}
																					className="block px-3 py-1.5 text-xs text-gray-500 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
																					onClick={() =>
																						setOpen(false)
																					}
																				>
																					{childItem.title}
																				</Link>
																			))}
																		{subItem.items.length >
																			3 && (
																			<Link
																				href={subItem.href}
																				className="block px-3 py-1.5 text-xs text-primary font-medium hover:underline"
																				onClick={() =>
																					setOpen(false)
																				}
																			>
																				+
																				{subItem.items
																					.length - 3}{" "}
																				more
																			</Link>
																		)}
																	</div>
																)}
															</div>
														))}
													</div>
												</AccordionContent>
											</>
										) : (
											<Link
												href={item.href}
												className="flex items-center px-3 py-2.5 text-sm font-medium text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
												onClick={() => setOpen(false)}
											>
												{item.title}
											</Link>
										)}
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</div>

					{/* Compact Footer */}
					<div className="shrink-0 p-3 border-t border-gray-100 bg-gray-50/80">
						<Button
							className="w-full bg-primary hover:bg-primary-hover text-white h-10 text-sm font-medium rounded-xl shadow-sm"
							onClick={() => setOpen(false)}
						>
							Begär offert
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNavbar;
