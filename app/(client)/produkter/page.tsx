import { treatmentCategories } from "@/data/categories/treatment-categories";
import { featuredProducts } from "@/data/products/featured-products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductSidebar } from "@/components/products/ProductSidebar";
// import { ViewToggle } from "@/components/products/ViewToggle";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";

import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ListFilter } from "lucide-react";

const MobileDrawer = () => {
	return (
		<div className="flex justify-end">
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="primary" size="sm" className="block sm:hidden">
						<ListFilter className="h-4 w-4" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="p-0! rounded-t-sm">
					<DrawerTitle className="sr-only">Filter</DrawerTitle>
					<div className="max-h-[90vh] p-3 overflow-y-auto">
						<ProductSidebar categories={treatmentCategories} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default function ProductsPage() {
	// const [view, setView] = useState<"grid" | "list">("grid");

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-100 to-primary/10">
			<div className="_container mx-auto px-4 py-8 padding-top">
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
						<div className="lg:sticky lg:top-28 hidden sm:block">
							<ProductSidebar categories={treatmentCategories} />
						</div>
						<MobileDrawer />
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
							{/* <ViewToggle view={view} onViewChange={setView} /> */}
						</div>

						{/* Products Grid/List */}
						<div
							className={
								// view === "grid" ?
								"grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
								// : "space-y-6"
							}
						>
							{[...featuredProducts, ...featuredProducts].map(
								(product, index) => (
									<ProductCard
										key={product.id + index}
										product={product}
										variant={"grid"}
									/>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
