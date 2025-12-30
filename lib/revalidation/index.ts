/**
 * Cache Tags and Revalidation Constants
 *
 * Centralized configuration for ISR cache tags and revalidation paths.
 * Used for on-demand revalidation when content is created/updated/deleted.
 */

// Cache tags for granular revalidation
export const CACHE_TAGS = {
	// Products
	PRODUCTS: "products",
	PRODUCT: (slug: string) => `product-${slug}`,

	// Categories
	CATEGORIES: "categories",
	CATEGORY: (slug: string) => `category-${slug}`,

	// Blog posts
	BLOG_POSTS: "blog-posts",
	BLOG_POST: (slug: string) => `blog-post-${slug}`,

	// Blog categories and tags
	BLOG_CATEGORIES: "blog-categories",
	BLOG_CATEGORY: (slug: string) => `blog-category-${slug}`,
	BLOG_TAGS: "blog-tags",

	// Authors
	AUTHORS: "authors",
	AUTHOR: (id: string) => `author-${id}`,

	// Static Pages
	HOME_PAGE: "home-page",
	ABOUT_PAGE: "about-page",
	TEAM_PAGE: "team-page",
	LEGAL_PAGE: "legal-page",
	PRIVACY_PAGE: "privacy-page",
	CAREERS_PAGE: "careers-page",
	STARTA_EGET_PAGE: "starta-eget-page",
	VARFOR_VALJA_SYNOS_PAGE: "varfor-valja-synos-page",
	KOPGUIDE_PAGE: "kopguide-page",
	MINIUTBILDNING_PAGE: "miniutbildning-page",
	TRAINING_PAGE: "training-page",
	FAQ_PAGE: "faq-page",
	CONTACT_PAGE: "contact-page",

	// Sitemaps
	SITEMAPS: "sitemaps",

	// Site Settings (global settings affecting layout)
	SITE_SETTINGS: "site-settings",
} as const;

// Revalidation paths
export const PATHS = {
	HOME: "/",
	PRODUCTS: "/produkter",
	KATEGORI: "/kategori",
	KLINIKUTRUSTNING: "/klinikutrustning",
	BLOG: "/blogg",
	NEWS: "/nyheter",
	// Static pages
	ABOUT: "/om-oss",
	TEAM: "/om-oss/team",
	LEGAL: "/om-oss/juridisk-information",
	PRIVACY: "/integritetspolicy",
	CAREERS: "/om-oss/lediga-tjanster",
	STARTA_EGET: "/starta-eget",
	VARFOR_VALJA_SYNOS: "/starta-eget/varfor-valja-synos",
	KOPGUIDE: "/starta-eget/kopguide",
	MINIUTBILDNING: "/starta-eget/miniutbildning",
	TRAINING: "/utbildningar",
	FAQ: "/faq",
	CONTACT: "/kontakt",
} as const;

// Default revalidation time in seconds (24 hours)
export const DEFAULT_REVALIDATE = 86400;
