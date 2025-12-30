import { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import {
	getPublishedProducts,
	getActiveCategories,
} from "@/lib/services/product-cache.service";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ListFilter, ShieldCheck, BookOpen, Settings } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Kategori (Category) Main Listing Page
 *
 * URL: /kategori/
 * Shows all products with category sidebar filter
 * This is an alias for /klinikutrustning with "Kategori" branding
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();

	return {
		title: `Kategori | ${siteConfig.name}`,
		description:
			"Professionell klinikutrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer. MDR-certifierade lasermaskiner från DEKA.",
		openGraph: {
			title: `Kategori | ${siteConfig.name}`,
			description:
				"Professionell klinikutrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer.",
			url: `${siteConfig.url}/kategori`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/kategori`,
		},
	};
}

// Product Card Component for Database Products
function ProductCardDB({
	product,
	categorySlug,
}: {
	product: IProduct;
	categorySlug: string;
}) {
	const primaryImage = product.overviewImage || product.productImages?.[0];

	return (
		<Link href={`/kategori/${categorySlug}/${product.slug}`}>
			<Card className="group h-full overflow-hidden border-primary/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 p-0!">
				{/* Image */}
				<div className="relative h-56 overflow-hidden bg-primary/50">
					<ImageComponent
						src={primaryImage}
						alt={product.title}
						height={0}
						width={0}
						sizes="100vw"
						showLoader
						wrapperClasses="w-full h-full"
						className="object-cover transition-transform h-full w-full duration-300 group-hover:scale-105"
					/>
				</div>

				<CardHeader className="px-2 py-1">
					<h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
						{product.title}
					</h3>
				</CardHeader>

				<CardContent className="px-2 py-1">
					<p className="mb-2 text-xs text-muted-foreground line-clamp-2">
						{product.shortDescription}
					</p>

					{/* Treatment Tags */}
					{product.treatments && product.treatments.length > 0 && (
						<div className="flex flex-wrap gap-0.5">
							{product.treatments.slice(0, 3).map((treatment) => (
								<Badge
									key={treatment}
									variant="secondary"
									className="bg-primary/5 text-primary/80 text-[10px] hover:bg-primary/5"
								>
									{treatment}
								</Badge>
							))}
						</div>
					)}
				</CardContent>

				<CardFooter className="p-2!">
					<Button
						size="sm"
						className="w-full bg-primary text-primary-foreground transition-colors p-0!"
					>
						Läs mer
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
}

// Sidebar Component for Database Categories
function KategoriSidebar({
	categories,
	activeCategory,
}: {
	categories: ICategory[];
	activeCategory?: string;
}) {
	return (
		<aside className="space-y-6">
			{/* Categories Filter */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">
						Behandlingskategorier
					</CardTitle>
					<Link
						href="/kategori"
						className={`block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
							!activeCategory
								? "bg-primary text-primary-foreground"
								: "text-foreground hover:bg-primary/50"
						}`}
					>
						Alla Produkter
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="space-y-2 pb-2! p-0">
					<div className="max-h-[200px] overflow-y-auto px-3">
						{categories.map((category) => (
							<Link
								key={category._id.toString()}
								href={`/kategori/${category.slug}`}
								className={`block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
									activeCategory === category.slug
										? "bg-primary text-primary-foreground"
										: "text-foreground hover:bg-primary/20"
								}`}
							>
								{category.name}
							</Link>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Quick Info Card */}
			<Card className="border-primary/50 bg-linear-to-br from-primary/20 to-slate-100">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">
						Behöver du hjälp?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-foreground">
						Våra experter hjälper dig att hitta rätt utrustning för din
						verksamhet.
					</p>
					<Link
						href="/kontakt"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary border border-transparent"
					>
						Kontakta oss
					</Link>
				</CardContent>
			</Card>

			{/* Features Card */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">
						Varför välja Synos?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<ShieldCheck className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								MDR-certifierade
							</h4>
							<p className="text-xs text-muted-foreground">
								Alla produkter är certifierade enligt EU-förordningar
							</p>
						</div>
					</div>

					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<BookOpen className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								Utbildning ingår
							</h4>
							<p className="text-xs text-muted-foreground">
								Komplett utbildning och support vid köp
							</p>
						</div>
					</div>

					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<Settings className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								Snabb service
							</h4>
							<p className="text-xs text-muted-foreground">
								Reparation inom 48 arbetstimmar
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</aside>
	);
}

// Mobile Drawer Component
function MobileDrawer({ categories }: { categories: ICategory[] }) {
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
						<KategoriSidebar categories={categories} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default async function KategoriPage() {
	const [categories, products] = await Promise.all([
		getActiveCategories(),
		getPublishedProducts({ limit: 100 }),
	]);

	// Create a map of category ID to slug for product cards
	const categorySlugMap = new Map<string, string>();
	categories.forEach((cat) => {
		categorySlugMap.set(cat._id.toString(), cat.slug);
	});

	// Get category slug for each product
	function getCategorySlugForProduct(product: IProduct): string {
		if (product.categories && product.categories.length > 0) {
			const firstCategory = product.categories[0] as unknown as {
				_id?: { toString(): string };
				slug?: string;
			};
			// If populated, use slug directly
			if (firstCategory?.slug) {
				return firstCategory.slug;
			}
			// Otherwise look up from map
			const catId = firstCategory?._id?.toString();
			if (catId) {
				return categorySlugMap.get(catId) || "uncategorized";
			}
		}
		return "uncategorized";
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-100 to-primary/10">
			<div className="_container mx-auto px-4 py-8 padding-top">
				{/* Breadcrumb */}
				<Breadcrumb items={[{ label: "Kategori" }]} />

				{/* Page Header */}
				<div className="mb-8">
					<h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
						Kategori
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
							<KategoriSidebar categories={categories} />
						</div>
						<MobileDrawer categories={categories} />
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									Visar{" "}
									<span className="font-medium text-foreground">
										{products.length}
									</span>{" "}
									produkter
								</p>
							</div>
						</div>

						{/* Products Grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{products.map((product) => (
								<ProductCardDB
									key={product._id.toString()}
									product={product}
									categorySlug={getCategorySlugForProduct(product)}
								/>
							))}
						</div>

						{/* Empty State */}
						{products.length === 0 && (
							<div className="py-16 text-center">
								<p className="text-lg text-muted-foreground">
									Inga produkter tillgängliga för tillfället.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
