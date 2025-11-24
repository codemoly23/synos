"use client";

import { useState, useEffect } from "react";
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
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 bg-">
			<header
				className={`transition-all duration-300 rounded-xl border ${
					isScrolled
						? "bg-white/90 backdrop-blur-md border-primary/10 shadow-lg py-3 px-6 w-full max-w-7xl"
						: "bg-white/70 backdrop-blur-md border-white/20 py-4 px-8 w-full max-w-7xl"
				}`}
			>
				<div className="flex items-center justify-between gap-4">
					{/* Logo */}
					<Link href="/" className="shrink-0">
						<Image
							src="https://www.synos.se/wp-content/themes/synos/assets/design/assets/images/logotype.svg"
							alt="Synos Medical"
							width={150}
							height={50}
							className="bg-accent p-1 rounded-md"
						/>
					</Link>

					{/* Desktop Nav */}
					<div className="hidden lg:flex items-center justify-center flex-1">
						<NavigationMenu>
							<NavigationMenuList>
								{mainNav.map((item) => (
									<NavigationMenuItem key={item.title}>
										{item.items ? (
											<>
												<NavigationMenuTrigger className="bg-transparent! text-secondary! hover:text-[#00949E]! hover:bg-[#00949E]/10! focus:bg-[#00949E]/10! focus:text-[#00949E]! active:bg-secondary/20! active:text-[#007A82]! data-[state=open]:bg-[#00949E]/10! data-[state=open]:text-[#00949E]! text-sm font-medium transition-colors">
													{item.title}
												</NavigationMenuTrigger>
												<NavigationMenuContent className="bg-slate-100/80! border! border-slate-200! ring-0! outline-none! backdrop-blur-xl">
													<div className="w-[800px] p-6 md:w-[600px] lg:w-[900px] bg-slate-100/80 backdrop-blur-xl border border-white/20 shadow-sm rounded-sm">
														<div className="grid grid-cols-3 gap-6">
															{item.items.map((subItem) => (
																<div
																	key={subItem.title}
																	className="space-y-3"
																>
																	<Link
																		href={subItem.href}
																		className="block text-sm font-bold text-[#0C2C46] hover:text-[#00949E] hover:underline transition-colors"
																	>
																		{subItem.title}
																	</Link>
																	{subItem.items && (
																		<ul className="space-y-2">
																			{subItem.items.map(
																				(childItem) => (
																					<li
																						key={
																							childItem.title
																						}
																					>
																						<Link
																							href={
																								childItem.href
																							}
																							className="block text-sm text-[#64748B] hover:text-[#00949E] transition-colors line-clamp-1 hover:underline"
																						>
																							{
																								childItem.title
																							}
																						</Link>
																					</li>
																				)
																			)}
																		</ul>
																	)}
																</div>
															))}
														</div>
													</div>
												</NavigationMenuContent>
											</>
										) : (
											<NavigationMenuLink
												href={item.href}
												className={cn(
													navigationMenuTriggerStyle(),
													"bg-transparent! text-secondary! hover:text-accent! hover:bg-secondary/10! focus:bg-secondary/10! focus:text-accent! active:bg-secondary/20! active:text-accent! transition-colors"
												)}
											>
												{item.title}
											</NavigationMenuLink>
										)}
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Actions */}
					<div className="hidden md:flex items-center gap-6 shrink-0">
						<a
							href="tel:+1234567890"
							className="flex items-center gap-2 text-sm font-medium text-[#00949E] hover:text-[#007A82] hover:underline transition-colors whitespace-nowrap"
						>
							<Phone className="h-4 w-4" />
							<span>(800) 555-0123</span>
						</a>
						<Button className="bg-[#00949E] hover:bg-[#007A82] text-white rounded-full px-6 shadow-md shadow-[#00949E]/20">
							Get Quote
						</Button>
					</div>

					{/* Mobile Menu */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="lg:hidden">
								<Menu className="h-6 w-6 text-[#0C2C46]" />
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
									<Link href="/" className="block">
										<Image
											src="https://www.synos.se/wp-content/themes/synos/assets/design/assets/images/logotype.svg"
											alt="Synos Medical"
											width={150}
											height={50}
											className="bg-accent p-1 rounded-md"
										/>
									</Link>
								</div>

								{/* Scrollable Content - Navigation */}
								<div className="flex-1 overflow-y-auto px-6 py-4">
									<Accordion
										type="single"
										collapsible
										className="w-full"
									>
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
																							{
																								childItem.title
																							}
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
				</div>
			</header>
		</div>
	);
}
