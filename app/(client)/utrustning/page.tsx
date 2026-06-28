import { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Package, Sparkles } from "lucide-react";
import type { IProduct } from "@/models/product.model";
import {
	UtrustningFilterableGrid,
	type SerializedProduct,
} from "@/components/utrustning/UtrustningFilterableGrid";

/**
 * Utrustning (Equipment) Overview Page
 *
 * URL: /utrustning/
 * Shows all individual equipment/products in a portfolio-style layout
 * Products link to their category-based URLs: /klinikutrustning/[category]/[slug]
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
export const revalidate = 60;

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
			if (firstCategory?.slug && firstCategory?.name) {
				return { slug: firstCategory.slug, name: firstCategory.name };
			}
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

	function getAllCategorySlugs(product: IProduct): string[] {
		const slugs: string[] = [];
		if (product.categories) {
			for (const c of product.categories) {
				const cat = c as unknown as {
					_id?: { toString(): string };
					slug?: string;
				};
				if (cat?.slug) {
					slugs.push(cat.slug);
				} else if (cat?._id) {
					const s = categorySlugMap.get(cat._id.toString());
					if (s) slugs.push(s);
				}
			}
		}
		return slugs;
	}

	const serializedProducts: SerializedProduct[] = products.map((product) => {
		const info = getCategoryInfoForProduct(product);
		const allSlugs = getAllCategorySlugs(product);
		return {
			id: product._id.toString(),
			title: product.title,
			slug: product.slug,
			shortDescription: product.shortDescription || "",
			treatments: product.treatments || [],
			overviewImage: product.overviewImage || null,
			firstProductImage: product.productImages?.[0] || null,
			primaryCategorySlug: info.slug,
			primaryCategoryName: info.name,
			categorySlugs: allSlugs.length ? allSlugs : [info.slug],
		};
	});

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-linear-to-br from-slate-100 via-primary/5 to-slate-50 pt-20 pb-8 sm:pt-32 sm:pb-16">
				{/* Background decoration */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
				</div>

				<div className="_container relative">
					<div className="hidden sm:block">
						<Breadcrumb items={[{ label: "Utrustning" }]} />
					</div>

					<div className="mt-3 sm:mt-8 max-w-4xl">
						{/* Badge */}
						<div className="hidden sm:inline-flex mb-6 items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
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
						<div className="hidden sm:flex mt-8 flex-wrap gap-8">
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
			<section className="pt-6 pb-16">
				<div className="_container">
					{products.length > 0 ? (
						<UtrustningFilterableGrid products={serializedProducts} />
					) : (
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
								className="btn-copper-gradient"
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
