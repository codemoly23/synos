import { ProductType } from "@/types";
import { getSiteConfig, getSiteUrl, type SiteConfigType } from "@/config/site";

/**
 * Generate Product JSON-LD structured data
 * @see https://schema.org/Product
 */
export async function generateProductJsonLd(product: ProductType) {
	const siteConfig = await getSiteConfig();
	const baseUrl = siteConfig.url;
	const categorySlug = product.primaryCategory?.slug || product.categories?.[0]?.slug;
	const productUrl = categorySlug
		? `${baseUrl}/klinikutrustning/${categorySlug}/${product.slug}`
		: `${baseUrl}/klinikutrustning/${product.slug}`;
	const images = product.productImages?.length
		? product.productImages.map((img) =>
				img.startsWith("http") ? img : `${baseUrl}${img}`
			)
		: product.overviewImage
			? [
					product.overviewImage.startsWith("http")
						? product.overviewImage
						: `${baseUrl}${product.overviewImage}`,
				]
			: [];

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.title,
		description: product.shortDescription || product.description,
		image: images,
		sku: product.slug,
		brand: {
			"@type": "Brand",
			name: siteConfig.name,
		},
		category:
			product.categories?.map((cat) => cat.name).join(", ") ||
			"Medical Equipment",
		url: productUrl,
		...(product.certifications &&
			product.certifications.length > 0 && {
				additionalProperty: product.certifications.map((cert) => ({
					"@type": "PropertyValue",
					name: "Certification",
					value: cert,
				})),
			}),
	};
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 * @see https://schema.org/BreadcrumbList
 */
export async function generateBreadcrumbJsonLd(
	product: ProductType,
	categoryName?: string
) {
	const baseUrl = getSiteUrl();
	const catSlug = product.primaryCategory?.slug || product.categories?.[0]?.slug;
	const items = [
		{
			"@type": "ListItem" as const,
			position: 1,
			name: "Hem",
			item: baseUrl,
		},
		{
			"@type": "ListItem" as const,
			position: 2,
			name: "Klinikutrustning",
			item: `${baseUrl}/klinikutrustning`,
		},
	];

	// Add category if available
	if (categoryName && catSlug) {
		items.push({
			"@type": "ListItem" as const,
			position: 3,
			name: categoryName,
			item: `${baseUrl}/klinikutrustning/${catSlug}`,
		});
		items.push({
			"@type": "ListItem" as const,
			position: 4,
			name: product.title,
			item: `${baseUrl}/klinikutrustning/${catSlug}/${product.slug}`,
		});
	} else {
		items.push({
			"@type": "ListItem" as const,
			position: 3,
			name: product.title,
			item: catSlug
				? `${baseUrl}/klinikutrustning/${catSlug}/${product.slug}`
				: `${baseUrl}/klinikutrustning/${product.slug}`,
		});
	}

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items,
	};
}

/**
 * Generate FAQPage JSON-LD structured data
 * @see https://schema.org/FAQPage
 */
export function generateFaqJsonLd(
	faqs: Array<{ question: string; answer: string; visible?: boolean }>
) {
	const visibleFaqs = faqs.filter((faq) => faq.visible !== false);

	if (visibleFaqs.length === 0) return null;

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: visibleFaqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * Generate Organization JSON-LD structured data
 * @see https://schema.org/Organization
 */
const COUNTRY_ISO_CODES: Record<string, string> = {
	Sverige: "SE",
};

function toIsoCountryCode(country: string) {
	return COUNTRY_ISO_CODES[country] ?? country;
}

export async function generateOrganizationJsonLd() {
	const siteConfig = await getSiteConfig();
	const baseUrl = siteConfig.url;

	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.company.name,
		url: baseUrl,
		logo: `${baseUrl}/logo.png`,
		description:
			"Synos Medical AB är en svensk leverantör av professionell MDR-certifierad klinikutrustning för estetiska och medicinska behandlingar. Företaget erbjuder klinikutrustning, utbildning, service och support till sjukhus, kliniker och skönhetssalonger i Sverige.",
		contactPoint: {
			"@type": "ContactPoint",
			telephone: siteConfig.company.phone,
			contactType: "customer service",
			email: siteConfig.company.email,
			availableLanguage: ["Swedish", "English"],
		},
		address: siteConfig.company.addresses.map((addr) => ({
			"@type": "PostalAddress",
			streetAddress: addr.street,
			addressLocality: addr.city,
			postalCode: addr.postalCode,
			addressCountry: toIsoCountryCode(addr.country),
		})),
		sameAs: [
			siteConfig.links.facebook,
			siteConfig.links.instagram,
			siteConfig.links.linkedin,
		].filter(Boolean),
	};
}

/**
 * Generate WebSite JSON-LD structured data
 * @see https://schema.org/WebSite
 */
export async function generateWebSiteJsonLd() {
	const siteConfig = await getSiteConfig();
	const baseUrl = siteConfig.url;

	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		url: baseUrl,
		potentialAction: {
			"@type": "SearchAction",
			target: `${baseUrl}/?s={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};
}

/**
 * Generate a generic BreadcrumbList JSON-LD from a simple list of
 * { name, url } crumbs, for non-product pages (category listings, etc.)
 * @see https://schema.org/BreadcrumbList
 */
export function generateSimpleBreadcrumbJsonLd(
	crumbs: Array<{ name: string; url: string }>
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem" as const,
			position: index + 1,
			name: crumb.name,
			item: crumb.url,
		})),
	};
}

/**
 * Generate CollectionPage JSON-LD for category/listing pages
 * @see https://schema.org/CollectionPage
 */
export function generateCollectionPageJsonLd(params: {
	name: string;
	description?: string;
	url: string;
	items: Array<{ name: string; url: string }>;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: params.name,
		description: params.description,
		url: params.url,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: params.items.map((item, index) => ({
				"@type": "ListItem" as const,
				position: index + 1,
				name: item.name,
				url: item.url,
			})),
		},
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLdSchema = Record<string, any>;

/**
 * Generate all product page JSON-LD schemas combined
 */
export async function generateProductPageJsonLd(
	product: ProductType
): Promise<JsonLdSchema[]> {
	const [productSchema, breadcrumbSchema] = await Promise.all([
		generateProductJsonLd(product),
		generateBreadcrumbJsonLd(product, product.categories?.[0]?.name),
	]);

	const schemas: JsonLdSchema[] = [productSchema, breadcrumbSchema];

	// Add FAQ schema if product has Q&A
	if (product.qa && product.qa.length > 0) {
		const faqSchema = generateFaqJsonLd(product.qa);
		if (faqSchema) {
			schemas.push(faqSchema);
		}
	}

	return schemas;
}
