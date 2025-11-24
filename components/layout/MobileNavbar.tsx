"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Phone } from "lucide-react";
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
const MobileNavbar = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden bg-none!">
					<Menu className="h-6 w-6 text-secondary" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[300px] sm:w-[400px] p-0 bg-white/95 backdrop-blur-md border border-white/20"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex flex-col h-full">
					{/* Fixed Header - Logo */}
					<div className="shrink-0 p-6 pb-4 border-b border-white/20">
						{/* <Link href="/" className="block">
							<Image
								src="https://www.synos.se/wp-content/themes/synos/assets/design/assets/images/logotype.svg"
								alt="Synos Medical"
								width={150}
								height={50}
								className="bg-accent p-1 rounded-md"
							/>
						</Link> */}
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
											<AccordionTrigger className="text-lg font-medium text-[#0C2C46] hover:text-[#00949E] hover:no-underline py-3 transition-colors">
												{item.title}
											</AccordionTrigger>
											<AccordionContent>
												<div className="flex flex-col gap-4 pl-4 border-l-2 border-[#0C2C46]/10 ml-1">
													{item.items.map((subItem) => (
														<div
															key={subItem.title}
															className="flex flex-col gap-2"
														>
															<Link
																href={subItem.href}
																className="text-base font-semibold text-[#0C2C46] hover:text-[#00949E] transition-colors"
															>
																{subItem.title}
															</Link>
															{subItem.items && (
																<div className="flex flex-col gap-2 pl-2">
																	{subItem.items.map(
																		(childItem) => (
																			<Link
																				key={
																					childItem.title
																				}
																				href={
																					childItem.href
																				}
																				className="text-sm text-[#64748B] hover:text-[#00949E] transition-colors"
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
												className="text-lg font-medium text-[#0C2C46] hover:text-[#00949E] transition-colors block"
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
							<Button className="w-full bg-[#00949E] hover:bg-[#007A82] text-white h-12">
								Get Quote
							</Button>
							{/* <Button
											variant="outline"
											className="w-full h-12 border-[#0C2C46]/20 text-[#0C2C46] hover:bg-[#00949E]/10 hover:text-[#00949E] hover:border-[#00949E]/30"
										>
											Client Login
										</Button> */}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNavbar;
