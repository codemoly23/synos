"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
		<div className="fixed top-3 sm:top-6 left-0 z-50 w-full">
			<header className={"_container"}>
				<nav
					className={`py-2 sm:py-3 transition-all backdrop-blur-md duration-300 rounded-full border ${
						isScrolled
							? "bg-slate-100/60 border-primary/10 shadow-lg px-3 pl-4 sm:px-4 sm:pl-6!"
							: "border-transparent"
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
													<NavigationMenuTrigger className="bg-transparent! text-secondary! hover:text-secondary! hover:bg-secondary/10! focus:bg-secondary/10! focus:text-secondary! active:bg-secondary/20! active:text-primary! data-[state=open]:bg-secondary/10! data-[state=open]:text-secondary! text-sm font-medium transition-colors">
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
																			className="block text-sm font-bold text-secondary hover:text-secondary hover:underline transition-colors"
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
																								className="block text-sm text-slate-400 hover:text-secondary transition-colors line-clamp-1 hover:underline"
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
							<div className="space-y-2">
								<a
									href="mailto:info@synos.se"
									className="flex items-center gap-2 text-xs font-medium text-secondary hover:text-primary hover:underline transition-colors whitespace-nowrap"
								>
									<Mail className="h-4 w-4" />
									<span>info@synos.se</span>
								</a>
								<a
									href="tel:+1234567890"
									className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary hover:underline transition-colors whitespace-nowrap"
								>
									<Phone className="h-4 w-4" />
									<span>(800) 555-0123</span>
								</a>
							</div>
							<Button className="bg-primary hover:bg-primary text-white rounded-full px-6 shadow-md shadow-secondary/20">
								Get Quote
							</Button>
						</div>

						{/* Mobile Menu */}
						<MobileNavbar />
					</div>
				</nav>
			</header>
		</div>
	);
}
