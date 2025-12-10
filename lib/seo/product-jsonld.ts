import { ProductType } from "@/types";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;

/**
 * Generate Product JSON-LD structured data
 * @see https://schema.org/Product
 */
export function generateProductJsonLd(product: ProductType) {
	const productUrl = `${BASE_URL}/produkter/produkt/${product.slug}`;
	const images = product.productImages?.length
		? product.productImages.map((img) =>
				img.startsWith("http") ? img : `${BASE_URL}${img}`
		  )
		: product.overviewImage
		? [
				product.overviewImage.startsWith("http")
					? product.overviewImage
					: `${BASE_URL}${product.overviewImage}`,
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
export function generateBreadcrumbJsonLd(
	product: ProductType,
	categoryName?: string
) {
	const items = [
		{
			"@type": "ListItem" as const,
			position: 1,
			name: "Hem",
			item: BASE_URL,
		},
		{
			"@type": "ListItem" as const,
			position: 2,
			name: "Produkter",
			item: `${BASE_URL}/produkter`,
		},
	];

	// Add category if available
	if (categoryName && product.categories?.[0]) {
		items.push({
			"@type": "ListItem" as const,
			position: 3,
			name: categoryName,
			item: `${BASE_URL}/produkter/kategori/${product.categories[0].slug}`,
		});
		items.push({
			"@type": "ListItem" as const,
			position: 4,
			name: product.title,
			item: `${BASE_URL}/produkter/produkt/${product.slug}`,
		});
	} else {
		items.push({
			"@type": "ListItem" as const,
			position: 3,
			name: product.title,
			item: `${BASE_URL}/produkter/produkt/${product.slug}`,
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
export function generateOrganizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.company.name,
		url: BASE_URL,
		logo: `${BASE_URL}/logo.png`,
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
			addressCountry: addr.country,
		})),
		sameAs: [
			siteConfig.links.facebook,
			siteConfig.links.instagram,
			siteConfig.links.linkedin,
		],
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLdSchema = Record<string, any>;

/**
 * Generate all product page JSON-LD schemas combined
 */
export function generateProductPageJsonLd(
	product: ProductType
): JsonLdSchema[] {
	const schemas: JsonLdSchema[] = [
		generateProductJsonLd(product),
		generateBreadcrumbJsonLd(product, product.categories?.[0]?.name),
	];

	// Add FAQ schema if product has Q&A
	if (product.qa && product.qa.length > 0) {
		const faqSchema = generateFaqJsonLd(product.qa);
		if (faqSchema) {
			schemas.push(faqSchema);
		}
	}

	return schemas;
}
