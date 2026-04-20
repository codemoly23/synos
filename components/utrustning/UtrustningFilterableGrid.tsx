"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageComponent } from "@/components/common/image-component";
import { Package, ArrowRight } from "lucide-react";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { technologyMap } from "@/config/technology-map";

export interface SerializedProduct {
	id: string;
	title: string;
	slug: string;
	shortDescription: string;
	treatments: string[];
	overviewImage: string | null;
	firstProductImage: string | null;
	primaryCategorySlug: string;
	primaryCategoryName: string;
	categorySlugs: string[];
}

const hrefToSlug = (href: string) =>
	href.split("/").filter(Boolean).pop() || "";

function EquipmentCard({ product }: { product: SerializedProduct }) {
	const primaryImage = product.overviewImage || product.firstProductImage;

	return (
		<Link
			href={`/klinikutrustning/${product.primaryCategorySlug}/${product.slug}`}
		>
			<Card className="group h-full overflow-hidden border-0 bg-white hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-3xl">
				<div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-slate-100 to-primary/10">
					<ImageComponent
						src={primaryImage}
						alt={product.title}
						height={0}
						width={0}
						sizes="100vw"
						showLoader
						wrapperClasses="w-full h-full"
						className="object-cover transition-transform h-full w-full duration-500 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-secondary/80 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

					<div className="absolute top-4 left-4">
						<Badge className="bg-white/90 text-secondary hover:bg-white backdrop-blur-sm">
							{product.primaryCategoryName}
						</Badge>
					</div>

					<div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
						<Button
							size="sm"
							className="w-full bg-white text-secondary hover:bg-primary hover:text-white"
						>
							Visa produkt
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>

				<CardHeader className="pb-2">
					<h3 className="text-xl font-bold text-secondary transition-colors group-hover:text-primary line-clamp-1">
						{product.title}
					</h3>
				</CardHeader>

				<CardContent className="pt-0">
					<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
						{product.shortDescription}
					</p>

					{product.treatments.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{product.treatments.slice(0, 3).map((t) => (
								<Badge
									key={t}
									variant="outline"
									className="text-xs border-primary/30 text-primary/80"
								>
									{t}
								</Badge>
							))}
							{product.treatments.length > 3 && (
								<Badge
									variant="outline"
									className="text-xs border-primary/30 text-primary/80"
								>
									+{product.treatments.length - 3}
								</Badge>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}

export function UtrustningFilterableGrid({
	products,
}: {
	products: SerializedProduct[];
}) {
	const [selectedCategoryHref, setSelectedCategoryHref] = useState<
		string | null
	>(null);
	const [selectedTech, setSelectedTech] = useState<string | null>(null);

	const techProductSlugs = useMemo(() => {
		if (!selectedTech) return null;
		const group = technologyMap.find((t) => t.name === selectedTech);
		if (!group) return null;
		return new Set(group.machines.map((m) => hrefToSlug(m.href)));
	}, [selectedTech]);

	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			if (selectedCategoryHref) {
				const slug = hrefToSlug(selectedCategoryHref);
				if (!p.categorySlugs.includes(slug)) return false;
			}
			if (techProductSlugs && !techProductSlugs.has(p.slug)) {
				return false;
			}
			return true;
		});
	}, [products, selectedCategoryHref, techProductSlugs]);

	return (
		<>
			<CategoryFilterBar
				selectedCategoryHref={selectedCategoryHref}
				selectedTech={selectedTech}
				onSelectCategory={setSelectedCategoryHref}
				onSelectTech={setSelectedTech}
			/>

			<div className="mb-4 text-sm text-muted-foreground">
				Visar{" "}
				<span className="font-medium text-foreground">
					{filteredProducts.length}
				</span>{" "}
				av {products.length} produkter
			</div>

			{filteredProducts.length > 0 ? (
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{filteredProducts.map((p) => (
						<EquipmentCard key={p.id} product={p} />
					))}
				</div>
			) : (
				<div className="py-24 text-center">
					<Package className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
					<p className="text-lg text-muted-foreground">
						Inga produkter matchar valda filter.
					</p>
				</div>
			)}
		</>
	);
}
