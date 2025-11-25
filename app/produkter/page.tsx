"use client";

import { useState } from "react";
import { treatmentCategories } from "@/data/categories/treatment-categories";
import { featuredProducts } from "@/data/products/featured-products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductSidebar } from "@/components/products/ProductSidebar";
import { ViewToggle } from "@/components/products/ViewToggle";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

export default function ProductsPage() {
	const [view, setView] = useState<"grid" | "list">("grid");

	return (
		<div className="min-h-screen bg-linear-to-b from-muted to-primary/10">
			<div className="container mx-auto px-4 py-8 page-padding-top">
				{/* Breadcrumb */}
				<Breadcrumb items={[{ label: "Produkter" }]} />

				{/* Page Header */}
				<div className="mb-8">
					<h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
						Våra Produkter
					</h1>
					<p className="max-w-3xl text-lg text-muted-foreground">
						Professionella lasermaskiner och medicinsk utrustning av
						högsta kvalitet. Alla våra produkter är MDR-certifierade och
						testade för bästa funktionalitet.
					</p>
				</div>

				{/* Main Layout with Sidebar */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="w-full lg:w-80 lg:shrink-0">
						<div className="lg:sticky lg:top-24">
							<ProductSidebar categories={treatmentCategories} />
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									Visar{" "}
									<span className="font-medium text-foreground">
										{featuredProducts.length}
									</span>{" "}
									produkter
								</p>
							</div>
							<ViewToggle view={view} onViewChange={setView} />
						</div>

						{/* Products Grid/List */}
						<div
							className={
								view === "grid"
									? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
									: "space-y-6"
							}
						>
							{featuredProducts.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									variant={view}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
