import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { generateProductPageJsonLd } from "@/lib/seo";
import { ProductContent } from "@/app/(client)/produkter/produkt/[slug]/product-content";
import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { CACHE_TAGS, DEFAULT_REVALIDATE } from "@/lib/revalidation";
import type { ApiResponse, ProductType } from "@/types";

/**
 * Product Detail Page
 *
 * URL: /klinikutrustning/[category]/[slug]/
 * Shows detailed product information
 */

interface ProductPageProps {
	params: Promise<{
		category: string;
		slug: string;
	}>;
}

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new products to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all published products at build time
 */
export async function generateStaticParams() {
	try {
		const { data: products } = await productRepository.findPublished({
			limit: 1000,
		});

		return products.map((product) => {
			// Use primaryCategory first, then first category, or 'uncategorized' as fallback
			const primaryCat = product.primaryCategory as unknown as { slug?: string } | null;
			const categories = product.categories as unknown as Array<{
				slug?: string;
			}>;
			const categorySlug = primaryCat?.slug || categories?.[0]?.slug || "uncategorized";

			return {
				category: categorySlug,
				slug: product.slug,
			};
		});
	} catch (error) {
		console.error("Error generating static params for products:", error);
		return [];
	}
}

/**
 * Fetch product data server-side
 */
async function getProduct(slug: string): Promise<ProductType | null> {
	try {
		const response = await fetch(
			`${process.env.BETTER_AUTH_URL}/api/products/client/${slug}`,
			{
				next: {
					revalidate: DEFAULT_REVALIDATE,
					tags: [CACHE_TAGS.PRODUCT(slug), CACHE_TAGS.PRODUCTS],
				},
			}
		);

		if (!response.ok) {
			return null;
		}

		const data: ApiResponse<ProductType> = await response.json();
		return data.data || null;
	} catch (error) {
		console.error(`Error fetching product ${slug}:`, error);
		return null;
	}
}

/**
 * Fallback data for uncategorized products
 */
const UNCATEGORIZED_FALLBACK = {
	slug: "uncategorized",
	name: "Okategoriserad",
} as const;

/**
 * Get category by slug
 * Returns a fallback object for "uncategorized" products
 */
async function getCategory(categorySlug: string) {
	// Handle uncategorized products
	if (categorySlug === "uncategorized") {
		return UNCATEGORIZED_FALLBACK;
	}

	try {
		return await categoryRepository.findBySlug(categorySlug);
	} catch {
		return null;
	}
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { category: categorySlug, slug } = await params;
	const product = await getProduct(slug);

	if (!product) {
		return {
			title: `Produkt hittades inte | ${siteConfig.name}`,
			description: "Den begärda produkten kunde inte hittas.",
			robots: { index: false, follow: false },
		};
	}

	const productUrl = `${siteConfig.url}/klinikutrustning/${categorySlug}/${product.slug}`;

	const ogImage =
		product.seo?.ogImage ||
		product.overviewImage ||
		product.productImages?.[0] ||
		siteConfig.ogImage;

	const absoluteOgImage = ogImage?.startsWith("http")
		? ogImage
		: `${siteConfig.url}${ogImage}`;

	const title = product.seo?.title || `${product.title} | ${siteConfig.name}`;
	const description =
		product.seo?.description ||
		product.shortDescription ||
		product.description;

	const canonicalUrl = product.seo?.canonicalUrl || productUrl;

	return {
		title,
		description,
		alternates: {
			canonical: canonicalUrl,
		},
		robots: {
			index: !product.seo?.noindex,
			follow: !product.seo?.noindex,
			googleBot: {
				index: !product.seo?.noindex,
				follow: !product.seo?.noindex,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		openGraph: {
			type: "website",
			locale: "sv_SE",
			url: productUrl,
			siteName: siteConfig.name,
			title: product.seo?.title || product.title,
			description,
			images: [
				{
					url: absoluteOgImage,
					width: 1200,
					height: 630,
					alt: product.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: product.seo?.title || product.title,
			description,
			images: [absoluteOgImage],
		},
	};
}

/**
 * Product Page - Server Component
 */
export default async function ProductPage({ params }: ProductPageProps) {
	const { category: categorySlug, slug } = await params;

	// Get category
	const category = await getCategory(categorySlug);
	if (!category) {
		notFound();
	}

	const product = await getProduct(slug);

	if (!product) {
		notFound();
	}

	// Generate JSON-LD schemas
	const jsonLdSchemas = generateProductPageJsonLd(product);

	return (
		<>
			{/* JSON-LD Structured Data */}
			{jsonLdSchemas.map((schema, index) => (
				<script
					key={`jsonld-${index}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}

			{/* Product Content with klinikutrustning navigation */}
			<ProductContent
				product={product}
				basePath={`/klinikutrustning/${category.slug}`}
				baseLabel={category.name}
			/>
		</>
	);
}
