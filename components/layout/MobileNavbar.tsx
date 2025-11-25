"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
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
const MobileNavbar = () => {
	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden bg-none!">
					<Menu className="h-6 w-6 text-secondary" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[300px] sm:w-[400px] p-0 bg-gray-500/50 backdrop-blur-md border border-white/20"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex flex-col h-full">
					{/* Fixed Header - Logo */}
					<div
						className="shrink-0 p-6 pb-4 border-b border-white/20"
						onClick={() => setOpen(false)}
					>
						<Logo />
					</div>

					{/* Scrollable Content - Navigation */}
					<div className="flex-1 overflow-y-auto px-6 py-4">
						<Accordion type="single" collapsible className="w-full">
							{mainNav.map((item, index) => (
								<AccordionItem
									key={item.title}
									value={`item-${index}`}
									className="border-b-0"
								>
									{item.items ? (
										<>
											<AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-3 transition-colors">
												<Link
													href={item.href}
													className="w-full block text-slate-100"
													onClick={() => setOpen(false)}
												>
													{item.title}
												</Link>
											</AccordionTrigger>
											<AccordionContent>
												<div className="flex flex-col gap-4 pl-4 border-l-2 border-slate-50/10 ml-1">
													{item.items.map((subItem) => (
														<div
															key={subItem.title}
															className="flex flex-col gap-2"
														>
															<Link
																href={subItem.href}
																className="text-base font-semibold text-slate-200 hover:text-primary transition-colors"
																onClick={() => setOpen(false)}
															>
																{subItem.title}
															</Link>
															{subItem.items && (
																<div className="flex flex-col gap-2 pl-2 border-l-2 border-slate-50/10 ml-1">
																	{subItem.items.map(
																		(childItem) => (
																			<Link
																				key={
																					childItem.title
																				}
																				href={
																					childItem.href
																				}
																				className="text-sm text-slate-300 hover:text-primary transition-colors "
																				onClick={() =>
																					setOpen(false)
																				}
																			>
																				{childItem.title}
																			</Link>
																		)
																	)}
																</div>
															)}
														</div>
													))}
												</div>
											</AccordionContent>
										</>
									) : (
										<div className="py-3">
											<Link
												href={item.href}
												className="text-lg font-medium text-slate-100 hover:text-primary transition-colors block"
												onClick={() => setOpen(false)}
											>
												{item.title}
											</Link>
										</div>
									)}
								</AccordionItem>
							))}
						</Accordion>
					</div>

					{/* Fixed Footer - Action Buttons */}
					<div className="shrink-0 p-6 pt-4 border-t border-white/20 bg-white/50 backdrop-blur-sm">
						<div className="flex flex-col gap-4">
							<Button className="w-full bg-[#00949E] hover:bg-primary text-white h-12">
								Get Quote
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNavbar;
