"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/lib/hooks/use-navigation";

export function CategoryFilterBar() {
	const [openCategory, setOpenCategory] = useState<string | null>(null);
	const [dropdownPos, setDropdownPos] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
	const { data: navigationData, isLoading } = useNavigation();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleCategory = (id: string) => {
		if (openCategory === id) {
			setOpenCategory(null);
			setDropdownPos(null);
			return;
		}
		const btn = buttonRefs.current.get(id);
		if (btn) {
			const rect = btn.getBoundingClientRect();
			setDropdownPos({
				top: rect.bottom + 8,
				left: rect.left,
			});
		}
		setOpenCategory(id);
	};

	const openCat = navigationData?.categories.find(
		(c) => c._id === openCategory
	);

	return (
		<div className="mb-6 relative">
			{/* Horizontal scrollable category pills */}
			<div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
				{/* All Products pill */}
				<Link href="/utrustning" className="shrink-0">
					<Badge
						variant="default"
						className="px-5 py-2.5 text-sm cursor-pointer bg-primary text-white hover:bg-primary/90 whitespace-nowrap rounded-full"
					>
						Alla produkter
					</Badge>
				</Link>

				{/* Loading state */}
				{isLoading && (
					<div className="flex items-center gap-2 px-4 text-sm text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						Laddar...
					</div>
				)}

				{/* Category dropdown pills */}
				{navigationData?.categories.map((category) => (
					<div key={category._id} className="relative shrink-0">
						<button
							ref={(el) => {
								if (el) buttonRefs.current.set(category._id, el);
							}}
							onClick={() => toggleCategory(category._id)}
							className={cn(
								"flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200 whitespace-nowrap",
								openCategory === category._id
									? "bg-secondary text-white border-secondary"
									: "bg-white text-secondary border-slate-200 hover:border-primary hover:bg-primary/5"
							)}
						>
							{category.name}
							<ChevronDown
								className={cn(
									"h-3.5 w-3.5 transition-transform duration-200",
									openCategory === category._id && "rotate-180"
								)}
							/>
						</button>
					</div>
				))}
			</div>

			{/* Dropdown portal - rendered outside overflow container */}
			{mounted &&
				createPortal(
					<>
						{/* Click outside to close */}
						{openCategory && (
							<div
								className="fixed inset-0 z-998"
								onClick={() => {
									setOpenCategory(null);
									setDropdownPos(null);
								}}
							/>
						)}

						<AnimatePresence>
							{openCategory &&
								openCat &&
								openCat.products.length > 0 &&
								dropdownPos && (
									<motion.div
										initial={{ opacity: 0, y: -8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -8 }}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 25,
										}}
										className="fixed z-999 min-w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
										style={{
											top: dropdownPos.top,
											left: dropdownPos.left,
										}}
									>
										<div className="py-2 max-h-[250px] overflow-y-auto">
											{openCat.products.map((product) => (
												<Link
													key={product._id}
													href={`/kategori/${product.primaryCategorySlug}/${product.slug}`}
													className="block px-4 py-2.5 text-sm text-secondary hover:bg-primary/5 hover:text-primary transition-colors"
													onClick={() => {
														setOpenCategory(null);
														setDropdownPos(null);
													}}
												>
													{product.title}
												</Link>
											))}
											<Link
												href={`/kategori/${openCat.slug}`}
												className="block px-4 py-2.5 text-sm font-medium text-primary hover:underline border-t border-slate-100 mt-1 pt-2.5"
												onClick={() => {
													setOpenCategory(null);
													setDropdownPos(null);
												}}
											>
												Visa alla →
											</Link>
										</div>
									</motion.div>
								)}
						</AnimatePresence>
					</>,
					document.body
				)}
		</div>
	);
}
