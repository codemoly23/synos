import { Metadata } from "next";
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
} from "@/components/ui/card";
import { ImageComponent } from "@/components/common/image-component";
import { Package, ArrowRight, Sparkles } from "lucide-react";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Utrustning (Equipment) Overview Page
 *
 * URL: /utrustning/
 * Shows all individual equipment/products in a portfolio-style layout
 * Products link to their category-based URLs: /kategori/[category]/[slug]
 */

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();

	return {
		title: `Utrustning | ${siteConfig.name}`,
		description:
			"Utforska vårt kompletta sortiment av professionell klinikutrustning. MOTUS PRO, Again PRO PLUS, TORO Pico Laser och fler MDR-certifierade lasermaskiner.",
		keywords: [
			"utrustning",
			"lasermaskiner",
			"klinikutrustning",
			"MOTUS PRO",
			"DEKA",
			"hårborttagning",
			"tatueringsborttagning",
		],
		openGraph: {
			title: `Utrustning | ${siteConfig.name}`,
			description:
				"Utforska vårt kompletta sortiment av professionell klinikutrustning.",
			url: `${siteConfig.url}/utrustning`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/utrustning`,
		},
	};
}

// Revalidate every hour
export const revalidate = 3600;

async function getCategories() {
	try {
		return await categoryRepository.findActiveCategories();
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

async function getProducts() {
	try {
		const { data } = await productRepository.findPublished({ limit: 100 });
		return data;
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

// Equipment Card Component - Portfolio style
function EquipmentCard({
	product,
	categorySlug,
	categoryName,
}: {
	product: IProduct;
	categorySlug: string;
	categoryName: string;
}) {
	const primaryImage = product.overviewImage || product.productImages?.[0];

	return (
		<Link href={`/kategori/${categorySlug}/${product.slug}`}>
			<Card className="group h-full overflow-hidden border-0 bg-white hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-3xl">
				{/* Image */}
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
					{/* Overlay on hover */}
					<div className="absolute inset-0 bg-linear-to-t from-secondary/80 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

					{/* Category Badge */}
					<div className="absolute top-4 left-4">
						<Badge className="bg-white/90 text-secondary hover:bg-white backdrop-blur-sm">
							{categoryName}
						</Badge>
					</div>

					{/* Quick action on hover */}
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

				{/* Content */}
				<CardHeader className="pb-2">
					<h3 className="text-xl font-bold text-secondary transition-colors group-hover:text-primary line-clamp-1">
						{product.title}
					</h3>
				</CardHeader>

				<CardContent className="pt-0">
					<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
						{product.shortDescription}
					</p>

					{/* Treatment Tags */}
					{product.treatments && product.treatments.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{product.treatments.slice(0, 3).map((treatment) => (
								<Badge
									key={treatment}
									variant="outline"
									className="text-xs border-primary/30 text-primary/80"
								>
									{treatment}
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

export default async function UtrustningPage() {
	const [categories, products] = await Promise.all([
		getCategories(),
		getProducts(),
	]);

	// Create maps for category lookups
	const categorySlugMap = new Map<string, string>();
	const categoryNameMap = new Map<string, string>();
	categories.forEach((cat) => {
		categorySlugMap.set(cat._id.toString(), cat.slug);
		categoryNameMap.set(cat._id.toString(), cat.name);
	});

	// Get category info for each product
	function getCategoryInfoForProduct(product: IProduct): {
		slug: string;
		name: string;
	} {
		if (product.categories && product.categories.length > 0) {
			const firstCategory = product.categories[0] as unknown as {
				_id?: { toString(): string };
				slug?: string;
				name?: string;
			};
			// If populated, use directly
			if (firstCategory?.slug && firstCategory?.name) {
				return { slug: firstCategory.slug, name: firstCategory.name };
			}
			// Otherwise look up from map
			const catId = firstCategory?._id?.toString();
			if (catId) {
				return {
					slug: categorySlugMap.get(catId) || "uncategorized",
					name: categoryNameMap.get(catId) || "Okategoriserad",
				};
			}
		}
		return { slug: "uncategorized", name: "Okategoriserad" };
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-linear-to-br from-slate-100 via-primary/5 to-slate-50 pt-32 pb-16">
				{/* Background decoration */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
				</div>

				<div className="_container relative">
					<Breadcrumb items={[{ label: "Utrustning" }]} />

					<div className="mt-8 max-w-4xl">
						{/* Badge */}
						<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
							<Package className="h-4 w-4 text-primary" />
							<span className="text-sm font-semibold text-primary">
								Professionell Utrustning
							</span>
						</div>

						{/* Title */}
						<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
							Vår{" "}
							<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								Utrustning
							</span>
						</h1>

						{/* Description */}
						<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
							Utforska vårt kompletta sortiment av MDR-certifierade
							lasermaskiner och medicinsk utrustning. Alla produkter
							levereras med utbildning och livstids support.
						</p>

						{/* Stats */}
						<div className="mt-8 flex flex-wrap gap-8">
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
									<Sparkles className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-2xl font-bold text-secondary">
										{products.length}
									</p>
									<p className="text-sm text-muted-foreground">
										Produkter
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
									<Package className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-2xl font-bold text-secondary">
										{categories.length}
									</p>
									<p className="text-sm text-muted-foreground">
										Kategorier
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Products Grid Section */}
			<section className="py-16">
				<div className="_container">
					{/* Category Filter Pills */}
					<div className="mb-12 flex flex-wrap gap-3">
						<Link href="/utrustning">
							<Badge
								variant="default"
								className="px-4 py-2 text-sm cursor-pointer bg-primary text-white hover:bg-primary/90"
							>
								Alla produkter
							</Badge>
						</Link>
						{categories.map((category) => (
							<Link
								key={category._id.toString()}
								href={`/kategori/${category.slug}`}
							>
								<Badge
									variant="outline"
									className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:border-primary"
								>
									{category.name}
								</Badge>
							</Link>
						))}
					</div>

					{/* Products Grid */}
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{products.map((product) => {
							const categoryInfo = getCategoryInfoForProduct(product);
							return (
								<EquipmentCard
									key={product._id.toString()}
									product={product}
									categorySlug={categoryInfo.slug}
									categoryName={categoryInfo.name}
								/>
							);
						})}
					</div>

					{/* Empty State */}
					{products.length === 0 && (
						<div className="py-24 text-center">
							<Package className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
							<p className="text-lg text-muted-foreground">
								Inga produkter tillgängliga för tillfället.
							</p>
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-linear-to-br from-secondary to-secondary/90">
				<div className="_container">
					<div className="text-center max-w-2xl mx-auto">
						<h2 className="text-3xl font-bold text-white mb-4">
							Behöver du hjälp att välja?
						</h2>
						<p className="text-white/80 mb-8">
							Våra experter hjälper dig att hitta rätt utrustning för din
							verksamhet. Kontakta oss för en kostnadsfri konsultation.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary/90 text-white"
							>
								<Link href="/kontakt">Kontakta oss</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="border-white text-white hover:bg-white hover:text-secondary"
							>
								<Link href="/starta-eget">Starta eget</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
