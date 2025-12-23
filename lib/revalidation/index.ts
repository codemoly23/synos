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

	// Pages
	HOME_PAGE: "home-page",

	// Sitemaps
	SITEMAPS: "sitemaps",
} as const;

// Revalidation paths
export const PATHS = {
	HOME: "/",
	PRODUCTS: "/produkter",
	KATEGORI: "/kategori",
	KLINIKUTRUSTNING: "/klinikutrustning",
	BLOG: "/blogg",
	NEWS: "/nyheter",
} as const;

// Default revalidation time in seconds (24 hours)
export const DEFAULT_REVALIDATE = 86400;
