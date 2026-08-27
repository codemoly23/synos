"use client";

import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
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
import { mainNavNew } from "@/config/navigation-new";
import { useNavigation } from "@/lib/hooks/use-navigation";
import Logo from "../common/logo";
import { useState } from "react";
import { QuoteRequestModal } from "./QuoteRequestModal";
import { cn } from "@/lib/utils";

interface MobileNavbarProps {
	useLightText?: boolean;
}

const MobileNavbar = ({ useLightText = false }: MobileNavbarProps) => {
const [open, setOpen] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
	const [expandedDynamic, setExpandedDynamic] = useState<string | null>(null);
	const [expandedTech, setExpandedTech] = useState<string | null>(null);

	const toggleTech = (techName: string) => {
		setExpandedTech(expandedTech === techName ? null : techName);
	};
	const toggleDynamic = (title: string) => {
		setExpandedDynamic(expandedDynamic === title ? null : title);
	};
	const { data: navigationData, isLoading } = useNavigation();

	const handleQuoteClick = () => {
		setOpen(false);
		setIsQuoteModalOpen(true);
	};

const toggleCategory = (categoryId: string) => {
		setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden bg-none! hover:bg-transparent! p-0! w-auto! h-auto!"
				>
					<Menu
						className={`h-6 w-6 ${useLightText ? "text-white" : "text-secondary"}`}
					/>
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

{/* Scrollable Navigation */}
					<div className="flex-1 overflow-y-auto nav-dropdown-scroll">
						<div className="px-2 py-2 pb-4">
							<div className="w-full space-y-0.5">
								{mainNavNew.map((item, index) => (
									<div key={item.title}>
										{item.isDynamic ? (
											/* Dynamic items: Link + expand button */
											<>
												<div className="flex items-center rounded-lg hover:bg-secondary/5 transition-all">
													{item.isTechnologyMenu || item.isCategoryMenu ? (
														<span
															className="flex-1 px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary cursor-pointer"
															onClick={() => toggleDynamic(item.title)}
														>
															{item.title}
														</span>
													) : (
														<Link
															href={item.href}
															className="flex-1 px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary"
															onClick={() => setOpen(false)}
														>
															{item.title}
														</Link>
													)}
													<button
														onClick={() => toggleDynamic(item.title)}
														className="px-3 py-2 text-muted-foreground hover:text-secondary transition-colors"
													>
														<ChevronDown
															className={cn(
																"h-4 w-4 transition-transform duration-200",
																expandedDynamic === item.title && "rotate-180"
															)}
														/>
													</button>
												</div>
												{expandedDynamic === item.title && (
													<div className="ml-3 pl-3 border-l-2 border-secondary/20 space-y-0.5 pb-1 pt-0.5">
														{item.isTechnologyMenu ? (
										<>
											{(navigationData?.technologyGroups || []).map((tech) => (
												<div key={tech.name}>
													<div className="flex items-center rounded-lg hover:bg-secondary/5 transition-all">
														<span
														className="flex-1 px-3 py-1.5 text-sm font-medium text-primary uppercase tracking-wide cursor-pointer"
														onClick={() => toggleTech(tech.name)}
													>
															{tech.name}
														</span>
														<button
															onClick={() => toggleTech(tech.name)}
															className="px-2 py-2 text-muted-foreground hover:text-secondary transition-colors"
														>
															<ChevronDown
																className={cn(
																	"h-4 w-4 transition-transform duration-200",
																	expandedTech === tech.name && "rotate-180"
																)}
															/>
														</button>
													</div>
													{expandedTech === tech.name && (
														<div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
															{tech.products.map((product) => (
																<Link
																	key={`${tech.name}:${product.slug}`}
																	href={`/klinikutrustning/${product.primaryCategorySlug}/${product.slug}`}
																	className="block px-3 py-1.5 text-sm text-secondary/90 hover:text-secondary hover:bg-secondary/5 rounded-md transition-all"
																	onClick={() => setOpen(false)}
																>
																	{product.title}
																</Link>
															))}
															<Link
																href={`/klinikutrustning/teknologi/${tech.slug}`}
																className="block px-3 py-1.5 text-sm text-secondary font-medium hover:underline"
																onClick={() => setOpen(false)}
															>
																Visa alla →
															</Link>
														</div>
													)}
												</div>
											))}
											{isLoading && (
												<div className="px-3 py-2 text-sm text-gray-400">Laddar...</div>
											)}
											<Link
												href={item.href}
												className="block px-3 py-1.5 text-sm text-secondary font-semibold hover:underline"
												onClick={() => setOpen(false)}
											>
												Visa alla →
											</Link>
										</>
									) : item.isCategoryMenu ? (
															<>
																{isLoading && (
																	<div className="px-3 py-2 text-sm text-gray-400">Laddar...</div>
																)}
																{navigationData?.categories.map((category) => (
																	<div key={category._id}>
																		{category.products.length > 0 ? (
																			<>
																				<div className="flex items-center rounded-lg hover:bg-secondary/5 transition-all">
																					<span
																						className="flex-1 px-3 py-2 text-sm font-medium text-primary cursor-pointer"
																						onClick={() => toggleCategory(category._id)}
																					>
																						{category.name}
																					</span>
																					<button
																						onClick={() => toggleCategory(category._id)}
																						className="px-2 py-2 text-muted-foreground hover:text-secondary transition-colors"
																					>
																						<ChevronDown
																							className={cn(
																								"h-4 w-4 transition-transform duration-200",
																								expandedCategory === category._id && "rotate-180"
																							)}
																						/>
																					</button>
																				</div>
																				{expandedCategory === category._id && (
																					<div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5 animate-in slide-in-from-top-1 duration-200 max-h-[200px] overflow-y-auto nav-dropdown-scroll">
																						{category.products.map((product) => (
																							<Link
																								key={product._id}
																								href={`/klinikutrustning/${product.primaryCategorySlug}/${product.slug}`}
																								className="block px-3 py-1.5 text-xs text-secondary/90 hover:text-secondary hover:bg-secondary/5 rounded-md transition-all"
																								onClick={() => setOpen(false)}
																							>
																								{product.title}
																							</Link>
																						))}
																						<Link
																							href={`/klinikutrustning/${category.slug}`}
																							className="block px-3 py-1.5 text-xs text-secondary font-medium hover:underline"
																							onClick={() => setOpen(false)}
																						>
																							Visa alla →
																						</Link>
																					</div>
																				)}
																			</>
																		) : (
																			<span className="flex items-center px-3 py-2 text-sm font-medium text-primary">
																				{category.name}
																			</span>
																		)}
																	</div>
																))}
																{navigationData && navigationData.categories.length === 0 && (
																	<div className="px-3 py-2 text-sm text-gray-400">
																		Inga kategorier tillgängliga
																	</div>
																)}
																<Link
																	href={item.href}
																	className="block px-3 py-1.5 text-xs text-secondary font-semibold hover:underline"
																	onClick={() => setOpen(false)}
																>
																	Visa alla →
																</Link>
															</>
														) : null}
													</div>
												)}
											</>
										) : item.items ? (
											/* Static subitems (Starta Eget, Om Oss) */
											<Accordion type="single" collapsible className="w-full">
												<AccordionItem value={`item-${index}`} className="border-0">
													<AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 hover:no-underline rounded-lg transition-all data-[state=open]:bg-secondary/5 data-[state=open]:text-secondary">
														<span className="flex-1 text-left">{item.title}</span>
													</AccordionTrigger>
													<AccordionContent className="pb-1 pt-0.5">
														<div className="ml-3 pl-3 border-l-2 border-secondary/20 space-y-0.5">
															<Link
																href={item.href}
																className="block px-3 py-2 text-sm font-medium text-primary hover:underline rounded-lg transition-all"
																onClick={() => setOpen(false)}
															>
																Översikt →
															</Link>
															{item.items.map((subItem) => (
																<Link
																	key={subItem.title}
																	href={subItem.href}
																	className="block px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
																	onClick={() => setOpen(false)}
																>
																	{subItem.title}
																</Link>
															))}
														</div>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										) : (
											/* Simple link items */
											<Link
												href={item.href}
												className="flex items-center px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
												onClick={() => setOpen(false)}
											>
												{item.title}
											</Link>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Compact Footer */}
					<div className="shrink-0 p-3 border-t border-gray-100 bg-gray-50/80">
						<Button
							className="w-full bg-primary hover:bg-primary-hover text-white h-10 text-sm font-medium rounded-xl shadow-sm"
							onClick={handleQuoteClick}
						>
							Begär offert
						</Button>
					</div>
				</div>
			</SheetContent>

			{/* Quote Request Modal */}
			<QuoteRequestModal
				open={isQuoteModalOpen}
				onOpenChange={setIsQuoteModalOpen}
			/>
		</Sheet>
	);
};

export default MobileNavbar;
