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
import Logo from "../common/logo";
import MobileNavbar from "./MobileNavbar";

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
		<div className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 bg-">
			<header
				className={`transition-all backdrop-blur-md duration-300 rounded-full border ${
					isScrolled
						? "bg-slate-100/60 border-primary/10 shadow-lg py-1.5 pl-5 sm:pl-6 sm:py-3 px-2 sm:px-6 w-full max-w-7xl"
						: "bg-slate-100/40 border-white/20 py-1.5 sm:py-4 px-2 sm:px-6 pl-5 sm:pl-6 w-full max-w-7xl"
				}`}
			>
				<div className="flex items-center justify-between gap-4">
					{/* Logo */}
					<Logo />

					{/* Desktop Nav */}
					<div className="hidden lg:flex items-center justify-center flex-1">
						<NavigationMenu>
							<NavigationMenuList>
								{mainNav.map((item) => (
									<NavigationMenuItem key={item.title}>
										{item.items ? (
											<>
												<NavigationMenuTrigger className="bg-transparent! text-secondary! hover:text-[#00949E]! hover:bg-[#00949E]/10! focus:bg-[#00949E]/10! focus:text-[#00949E]! active:bg-secondary/20! active:text-[#007A82]! data-[state=open]:bg-[#00949E]/10! data-[state=open]:text-[#00949E]! text-sm font-medium transition-colors">
													<Link href={item.href}>
														{item.title}
													</Link>
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
													"bg-transparent! text-secondary! hover:text-primary! hover:bg-secondary/10! focus:bg-secondary/10! focus:text-primary! active:bg-secondary/20! active:text-primary! transition-colors"
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
					<MobileNavbar />
				</div>
			</header>
		</div>
	);
}
