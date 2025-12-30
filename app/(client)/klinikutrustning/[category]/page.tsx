import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
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
import { PreviewEditor } from "@/components/common/TextEditor";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Product Category Page
 *
 * URL: /klinikutrustning/[category]/
 * Shows all products in a specific category with sidebar filter
 */

interface CategoryPageProps {
	params: Promise<{
		category: string;
	}>;
}

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new categories to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all active categories at build time
 */
export async function generateStaticParams() {
	try {
		const categories = await categoryRepository.findActiveCategories();
		return categories
			.filter((cat) => cat.slug)
			.map((cat) => ({ category: cat.slug }));
	} catch (error) {
		console.error("Error generating static params for categories:", error);
		return [];
	}
}

/**
 * Fallback data for uncategorized products
 */
const UNCATEGORIZED_FALLBACK = {
	_id: { toString: () => "uncategorized" },
	slug: "uncategorized",
	name: "Okategoriserad",
	description: "Produkter som inte tillhör någon specifik kategori.",
	image: null,
	isActive: true,
	seo: undefined,
} as const;

async function getCategory(slug: string) {
	// Handle uncategorized products
	if (slug === "uncategorized") {
		return UNCATEGORIZED_FALLBACK;
	}

	try {
		return await categoryRepository.findBySlug(slug);
	} catch (error) {
		console.error("Error fetching category:", error);
		return null;
	}
}

async function getCategories() {
	try {
		return await categoryRepository.findActiveCategories();
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

async function getProductsByCategory(categoryId: string) {
	try {
		// Handle uncategorized products
		if (categoryId === "uncategorized") {
			const { data } = await productRepository.findUncategorized({
				limit: 100,
				publishedOnly: true,
			});
			return data;
		}

		const { data } = await productRepository.findByCategory(categoryId, {
			limit: 100,
			publishedOnly: true,
		});
		return data;
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

// Strip HTML tags for meta description
function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { category: categorySlug } = await params;
	const [category, siteConfig] = await Promise.all([
		getCategory(categorySlug),
		getSiteConfig(),
	]);

	if (!category) {
		return {
			title: `Kategori hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	// Use SEO fields if available, otherwise fallback to defaults
	const seoTitle =
		category.seo?.title ||
		`${category.name} | Klinikutrustning | ${siteConfig.name}`;
	const seoDescription =
		category.seo?.description ||
		(category.description
			? stripHtml(category.description).slice(0, 160)
			: `Utforska vårt sortiment av ${category.name.toLowerCase()}. MDR-certifierad utrustning från DEKA.`);

	// OG image priority: seo.ogImage > category.image
	const ogImage = category.seo?.ogImage || category.image;

	return {
		title: seoTitle,
		description: seoDescription,
		openGraph: {
			title: category.seo?.title || `${category.name} | ${siteConfig.name}`,
			description: seoDescription,
			url: `${siteConfig.url}/klinikutrustning/${category.slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
			images: ogImage
				? [
						{
							url: ogImage.startsWith("http")
								? ogImage
								: `${siteConfig.url}${ogImage}`,
							alt: category.name,
						},
				  ]
				: [],
		},
		alternates: {
			canonical: `${siteConfig.url}/klinikutrustning/${category.slug}`,
		},
		robots: category.seo?.noindex
			? { index: false, follow: true }
			: undefined,
	};
}

// Product Card Component
function ProductCardDB({
	product,
	categorySlug,
}: {
	product: IProduct;
	categorySlug: string;
}) {
	const primaryImage = product.overviewImage || product.productImages?.[0];

	return (
		<Link href={`/klinikutrustning/${categorySlug}/${product.slug}`}>
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

// Sidebar Component
function KlinikutrustningaSidebar({
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
						href="/klinikutrustning"
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
								href={`/klinikutrustning/${category.slug}`}
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
function MobileDrawer({
	categories,
	activeCategory,
}: {
	categories: ICategory[];
	activeCategory: string;
}) {
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
						<KlinikutrustningaSidebar
							categories={categories}
							activeCategory={activeCategory}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { category: categorySlug } = await params;

	const [category, categories] = await Promise.all([
		getCategory(categorySlug),
		getCategories(),
	]);

	if (!category) {
		notFound();
	}

	const products = await getProductsByCategory(category._id.toString());

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-100 to-primary/10">
			<div className="_container mx-auto px-4 py-8 padding-top">
				{/* Breadcrumb */}
				<Breadcrumb
					items={[
						{ label: "Klinikutrustning", href: "/klinikutrustning" },
						{ label: category.name },
					]}
				/>

				{/* Page Header */}
				<div className="mb-8">
					<h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
						{category.name}
					</h1>
					{category.description && (
						<div className="prose prose-slate max-w-3xl text-muted-foreground">
							<PreviewEditor>{category.description}</PreviewEditor>
						</div>
					)}
				</div>

				{/* Main Layout with Sidebar */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="w-full lg:w-80 lg:shrink-0">
						<div className="lg:sticky lg:top-28 hidden sm:block">
							<KlinikutrustningaSidebar
								categories={categories}
								activeCategory={categorySlug}
							/>
						</div>
						<MobileDrawer
							categories={categories}
							activeCategory={categorySlug}
						/>
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
									produkter i {category.name}
								</p>
							</div>
						</div>

						{/* Products Grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{products.map((product) => (
								<ProductCardDB
									key={product._id.toString()}
									product={product}
									categorySlug={categorySlug}
								/>
							))}
						</div>

						{/* Empty State */}
						{products.length === 0 && (
							<div className="py-16 text-center">
								<p className="text-lg text-muted-foreground">
									Inga produkter tillgängliga i denna kategori för
									tillfället.
								</p>
								<Link
									href="/klinikutrustning"
									className="mt-4 inline-block text-primary hover:underline"
								>
									← Tillbaka till alla kategorier
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
