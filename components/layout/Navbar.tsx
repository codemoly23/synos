"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteRequestModal } from "./QuoteRequestModal";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { mainNavNew } from "@/config/navigation-new";
import { useNavigation } from "@/lib/hooks/use-navigation";
import { useNavbarVariant } from "@/lib/context/navbar-variant-context";
import { cn } from "@/lib/utils";
import type { SiteConfigType } from "@/config/site";
import Logo from "../common/logo";
import MobileNavbar from "./MobileNavbar";

interface NavbarProps {
	config: SiteConfigType;
	logoUrl?: string;
}

export function Navbar({ config, logoUrl }: NavbarProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const lastScrollY = useRef(0);
	const router = useRouter();
	const pathname = usePathname();
	const [menuValue, setMenuValue] = useState("");
	const { data: navigationData } = useNavigation();
	const { variant } = useNavbarVariant();

	// Always use light text since navbar is always dark
	const useLightText = true;

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;
			setIsScrolled(currentY > 20);

			if (currentY > 60) {
				setIsHidden(currentY > lastScrollY.current);
			} else {
				setIsHidden(false);
			}
			lastScrollY.current = currentY;
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setMenuValue("");
	}, [pathname]);

	if (!isMounted) {
		return (
			<div>
				<div className="fixed top-3 sm:top-6 left-0 z-50 w-full">
					<header className={"_container"}>
						<nav
							className={`py-1.5 sm:py-2 transition-all backdrop-blur-md duration-300 rounded-full border px-2 sm:px-3 border-transparent`}
						>
							<div className="flex bg-none items-center justify-between gap-1 lg:gap-2">
								<div className="ml-1.5 lg:ml-0">
									<Logo logoUrl={logoUrl} />
								</div>
								<div className="hidden lg:flex items-center justify-center flex-1" />
								<div className="hidden xl:flex items-center gap-2 shrink-0" />
								<div className="mr-1.5 lg:mr-0 flex items-center">
									<MobileNavbar useLightText={false} />
								</div>
							</div>
						</nav>
					</header>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className={`fixed top-3 sm:top-6 left-0 z-50 w-full transition-transform duration-300 ${isHidden ? "-translate-y-[calc(100%+12px)] lg:translate-y-0" : "translate-y-0"}`}>
				<header className={"_container"}>
					<nav
						className={`py-1.5 sm:py-2 transition-all backdrop-blur-xl duration-300 rounded-full border px-2 sm:px-3 bg-secondary/70 shadow-lg ${
							isScrolled
								? "border-secondary/80"
								: "border-secondary/50"
						}`}
					>
						<div className="flex bg-none items-center justify-between gap-1 lg:gap-2">
							{/* Logo */}
							<div className="ml-1.5 lg:ml-0">
								<Logo logoUrl={logoUrl} />
							</div>

							{/* Desktop Nav */}
							<div className="hidden lg:flex items-center justify-center flex-1">
								<NavigationMenu value={menuValue} onValueChange={setMenuValue}>
									<NavigationMenuList>
										{mainNavNew.map((item) => (
											<NavigationMenuItem key={item.title}>
												{/* Dynamic Produkter mega-menu */}
												{item.isDynamic ? (
													<>
														<NavigationMenuTrigger
															className={cn(
																"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! data-[state=open]:bg-secondary/10! text-base font-medium transition-colors h-8 px-2",
																useLightText
																	? "text-white/90! hover:text-white! focus:text-white! active:text-white! data-[state=open]:text-white!"
																	: "text-secondary! hover:text-secondary! focus:text-secondary! active:text-primary! data-[state=open]:text-secondary!"
															)}
																onClick={() => router.push(item.href)}
														>
																{item.title}
														</NavigationMenuTrigger>
														<NavigationMenuContent className="bg-slate-100/80! border! border-slate-200! ring-0! outline-none! backdrop-blur-xl fixed! left-1/2! -translate-x-1/2! top-[72px]! rounded-2xl! overflow-hidden!">
															<div className="w-[calc(100vw-6rem)] max-w-[1150px] p-4 bg-slate-100/80 backdrop-blur-xl border border-white/20 shadow-sm rounded-2xl max-h-[60vh] overflow-y-auto nav-dropdown-scroll">
																{item.isTechnologyMenu ? (
																	/* UTRUSTNING: DB technology groups */
																	<div className="grid grid-cols-4 gap-x-6 gap-y-5">
																		{(navigationData?.technologyGroups || []).map((tech) => (
																			<div key={tech.name} className="space-y-1">
																				<Link
																					href={`/produkter?technology=${encodeURIComponent(tech.name)}`}
																					className="text-sm font-bold text-primary hover:underline"
																					onClick={() => setMenuValue("")}
																				>
																					{tech.name}
																				</Link>
																				<ul className="space-y-0">
																					{tech.products.map((product) => (
																						<li key={`${tech.name}:${product.slug}`}>
																							<Link
																								href={`/klinikutrustning/${product.primaryCategorySlug}/${product.slug}`}
																								className="block text-sm text-slate-600 hover:text-secondary transition-colors line-clamp-1 hover:underline"
																								onClick={() => setMenuValue("")}
																							>
																								{product.title}
																							</Link>
																						</li>
																					))}
																				</ul>
																			</div>
																		))}
																		{!navigationData && (
																			<div className="col-span-4 py-8 text-center text-slate-400 text-sm">Laddar...</div>
																		)}
																		{navigationData && navigationData.technologyGroups.length === 0 && (
																			<div className="col-span-4 py-8 text-center text-slate-400 text-sm">Inga teknologier</div>
																		)}
																	</div>
																) : item.isCategoryMenu ? (
																	/* KATEGORI: categories with products from DB */
																	<div className="grid grid-cols-4 gap-x-6 gap-y-5">
																		{navigationData?.categories.map((category) => (
																			<div key={category._id} className="space-y-1">
																				<Link
																					href={`/klinikutrustning/${category.slug}`}
																					className="text-sm font-bold text-primary hover:underline"
																					onClick={() => setMenuValue("")}
																				>
																					{category.name}
																				</Link>
																				{category.products.length > 0 && (
																					<ul className="space-y-0">
																						{category.products.map((product) => (
																							<li key={product._id}>
																								<Link
																									href={`/klinikutrustning/${product.primaryCategorySlug}/${product.slug}`}
																									className="block text-sm text-slate-600 hover:text-secondary transition-colors line-clamp-1 hover:underline"
																									onClick={() => setMenuValue("")}
																								>
																									{product.title}
																								</Link>
																							</li>
																						))}
																					</ul>
																				)}
																			</div>
																		))}
																		{!navigationData && (
																			<div className="col-span-4 py-8 text-center text-slate-400 text-sm">
																				Laddar...
																			</div>
																		)}
																		{navigationData && navigationData.categories.length === 0 && (
																			<div className="col-span-4 py-8 text-center text-slate-400 text-sm">
																				Inga kategorier tillgängliga
																			</div>
																		)}
																	</div>
																) : null}
															</div>
														</NavigationMenuContent>
													</>
												) : item.items ? (
													// Static menu items with subitems (Starta Eget, Om Oss)
													<>
														<NavigationMenuTrigger
															className={cn(
																"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! data-[state=open]:bg-secondary/10! text-base font-medium transition-colors h-8 px-2",
																useLightText
																	? "text-white/90! hover:text-white! focus:text-white! active:text-white! data-[state=open]:text-white!"
																	: "text-secondary! hover:text-secondary! focus:text-secondary! active:text-primary! data-[state=open]:text-secondary!"
															)}
														>
																{item.title}
														</NavigationMenuTrigger>
														<NavigationMenuContent className="bg-slate-100/80! border! border-slate-200! ring-0! outline-none! backdrop-blur-xl">
															<div className="min-w-[180px] p-3 bg-slate-100/80 backdrop-blur-xl border border-white/20 shadow-sm rounded-sm">
																<div className="space-y-1">
																	{item.items.map(
																		(subItem) => (
																			<Link
																				key={subItem.title}
																				href={subItem.href}
																				className="block text-sm text-slate-600 hover:text-secondary transition-colors hover:underline py-1.5 px-2 rounded hover:bg-secondary/5"
																			>
																				{subItem.title}
																			</Link>
																		)
																	)}
																</div>
															</div>
														</NavigationMenuContent>
													</>
												) : (
													// Simple link items (Nyheter, Utbildningar, Kontakt)
													<NavigationMenuLink asChild className={cn(
															navigationMenuTriggerStyle(),
															"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! transition-colors text-base h-8 px-2",
															useLightText
																? "text-white/90! hover:text-white! focus:text-white! active:text-white!"
																: "text-secondary! hover:text-primary! focus:text-primary! active:text-primary!"
														)}>
														<Link href={item.href}>{item.title}</Link>
													</NavigationMenuLink>
												)}
											</NavigationMenuItem>
										))}
									</NavigationMenuList>
								</NavigationMenu>
							</div>

							{/* Actions */}
							<div className="hidden xl:flex items-center gap-2 shrink-0">
								<div className="space-y-0.5">
									<a
										href={`mailto:${config.company.email}`}
										className={cn(
											"flex items-center gap-1.5 text-[10px] font-medium hover:underline transition-colors whitespace-nowrap",
											useLightText
												? "text-white/90 hover:text-white"
												: "text-primary"
										)}
									>
										<Mail className="h-3 w-3" />
										<span>{config.company.email}</span>
									</a>
									<a
										href={`tel:${config.company.phone.replace(
											/\s/g,
											""
										)}`}
										className={cn(
											"flex items-center gap-1.5 text-[10px] font-medium hover:underline transition-colors whitespace-nowrap",
											useLightText
												? "text-white/90 hover:text-white"
												: "text-primary hover:text-primary"
										)}
									>
										<Phone className="h-3 w-3" />
										<span>{config.company.phone}</span>
									</a>
								</div>
								<Button
									size="sm"
									className={cn(
										"rounded-full px-3 py-1 h-7 text-xs shadow-sm",
										useLightText
											? "bg-white text-secondary hover:bg-white/90 shadow-black/10"
											: "bg-primary hover:bg-primary text-white shadow-secondary/20"
									)}
									onClick={() => setIsQuoteModalOpen(true)}
								>
									Begär offert
								</Button>
							</div>
							{/* Mobile Menu */}
							<div className="mr-1.5 lg:mr-0 flex items-center">
								<MobileNavbar useLightText={useLightText} />
							</div>
						</div>
					</nav>
				</header>
			</div>

			{/* Quote Request Modal */}
			<QuoteRequestModal
				open={isQuoteModalOpen}
				onOpenChange={setIsQuoteModalOpen}
			/>
		</div>
	);
}
