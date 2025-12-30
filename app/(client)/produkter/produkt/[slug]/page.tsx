import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteConfig } from "@/config/site";
import { generateProductPageJsonLd } from "@/lib/seo";
import { ProductContent } from "./product-content";
import { productRepository } from "@/lib/repositories/product.repository";
import type { ProductType } from "@/types";

interface ProductPageProps {
	params: Promise<{
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
		return products.map((product) => ({ slug: product.slug }));
	} catch (error) {
		console.error("Error generating static params for products:", error);
		return [];
	}
}

/**
 * Fetch product data server-side using repository directly
 * This avoids fetch calls during SSG which would fail (server not running)
 */
async function getProduct(slug: string): Promise<ProductType | null> {
	try {
		const product = await productRepository.findPublicBySlug(slug);
		if (!product) {
			return null;
		}
		// Convert Mongoose document to plain object for client component
		return JSON.parse(JSON.stringify(product)) as ProductType;
	} catch (error) {
		console.error(`Error fetching product ${slug}:`, error);
		return null;
	}
}

/**
 * Generate dynamic metadata for SEO
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [product, siteConfig] = await Promise.all([
		getProduct(slug),
		getSiteConfig(),
	]);

	if (!product) {
		return {
			title: `Produkt hittades inte | ${siteConfig.name}`,
			description: "Den begärda produkten kunde inte hittas.",
			robots: { index: false, follow: false },
		};
	}

	const productUrl = `${siteConfig.url}/produkter/produkt/${product.slug}`;

	// Determine the best image for OG
	const ogImage =
		product.seo?.ogImage ||
		product.overviewImage ||
		product.productImages?.[0] ||
		siteConfig.ogImage;

	// Ensure image URL is absolute
	const absoluteOgImage = ogImage?.startsWith("http")
		? ogImage
		: `${siteConfig.url}${ogImage}`;

	// Use SEO fields with fallbacks
	const title = product.seo?.title || `${product.title} | ${siteConfig.name}`;
	const description =
		product.seo?.description ||
		product.shortDescription ||
		product.description;

	// Determine canonical URL
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
 *
 * This is a server component that:
 * 1. Fetches product data server-side (no client fetch needed)
 * 2. Generates comprehensive JSON-LD structured data
 * 3. Passes data to client component as props
 *
 * SEO Benefits:
 * - Search engines receive complete HTML with all metadata
 * - Faster initial page load (no client-side data fetching)
 * - Better Core Web Vitals (LCP, FID)
 */
export default async function ProductPage({ params }: ProductPageProps) {
	const { slug } = await params;
	const product = await getProduct(slug);

	if (!product) {
		notFound();
	}

	// Generate all JSON-LD schemas for this product
	const jsonLdSchemas = await generateProductPageJsonLd(product);

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

			{/* Client Component with all product data */}
			<ProductContent product={product} />
		</>
	);
}
