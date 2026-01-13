"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, PATHS } from "./index";

/**
 * Revalidate product-related caches
 * Call this when a product is created, updated, published, unpublished, or deleted
 */
export async function revalidateProduct(
	slug: string,
	categorySlug?: string
): Promise<void> {
	// Revalidate product-specific tag (Next.js 16 requires second argument)
	revalidateTag(CACHE_TAGS.PRODUCT(slug), "default");

	// Revalidate products list
	revalidateTag(CACHE_TAGS.PRODUCTS, "default");

	// Revalidate product detail pages for the specific category
	if (categorySlug) {
		revalidatePath(`${PATHS.KATEGORI}/${categorySlug}/${slug}`);
		revalidatePath(`${PATHS.KLINIKUTRUSTNING}/${categorySlug}/${slug}`);
		revalidatePath(`${PATHS.KATEGORI}/${categorySlug}`);
		revalidatePath(`${PATHS.KLINIKUTRUSTNING}/${categorySlug}`);
	}

	// Always revalidate uncategorized paths (product might have been moved)
	revalidatePath(`${PATHS.KATEGORI}/uncategorized/${slug}`);
	revalidatePath(`${PATHS.KLINIKUTRUSTNING}/uncategorized/${slug}`);

	// Revalidate the direct product page
	revalidatePath(`${PATHS.PRODUCTS}/produkt/${slug}`);

	// Revalidate listing pages
	revalidatePath(PATHS.PRODUCTS);
	revalidatePath(PATHS.KATEGORI);
	revalidatePath(PATHS.KLINIKUTRUSTNING);

	// Revalidate sitemaps
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate all products (use sparingly)
 * Call this when bulk operations are performed
 */
export async function revalidateAllProducts(): Promise<void> {
	revalidateTag(CACHE_TAGS.PRODUCTS, "default");
	revalidatePath(PATHS.PRODUCTS);
	revalidatePath(PATHS.KATEGORI);
	revalidatePath(PATHS.KLINIKUTRUSTNING);
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate category-related caches
 * Call this when a category is created, updated, or deleted
 */
export async function revalidateCategory(slug?: string): Promise<void> {
	if (slug) {
		revalidateTag(CACHE_TAGS.CATEGORY(slug), "default");
		revalidatePath(`${PATHS.KATEGORI}/${slug}`);
		revalidatePath(`${PATHS.KLINIKUTRUSTNING}/${slug}`);
	}
	revalidateTag(CACHE_TAGS.CATEGORIES, "default");
	revalidatePath(PATHS.KATEGORI);
	revalidatePath(PATHS.KLINIKUTRUSTNING);
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate blog post-related caches
 * Call this when a blog post is created, updated, published, or deleted
 */
export async function revalidateBlogPost(slug: string): Promise<void> {
	// Revalidate post-specific tag
	revalidateTag(CACHE_TAGS.BLOG_POST(slug), "default");

	// Revalidate blog posts list
	revalidateTag(CACHE_TAGS.BLOG_POSTS, "default");

	// Revalidate blog detail pages (both /blogg and /nyheter use same content)
	revalidatePath(`${PATHS.BLOG}/${slug}`);
	revalidatePath(`${PATHS.NEWS}/${slug}`);

	// Revalidate listing pages
	revalidatePath(PATHS.BLOG);
	revalidatePath(PATHS.NEWS);

	// Revalidate sitemaps
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate all blog posts (use sparingly)
 * Call this when bulk operations are performed
 */
export async function revalidateAllBlogPosts(): Promise<void> {
	revalidateTag(CACHE_TAGS.BLOG_POSTS, "default");
	revalidatePath(PATHS.BLOG);
	revalidatePath(PATHS.NEWS);
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate blog category-related caches
 * Call this when a blog category is created, updated, or deleted
 */
export async function revalidateBlogCategory(slug: string): Promise<void> {
	revalidateTag(CACHE_TAGS.BLOG_CATEGORY(slug), "default");
	revalidateTag(CACHE_TAGS.BLOG_CATEGORIES, "default");
	revalidatePath(`${PATHS.BLOG}/category/${slug}`);
	revalidatePath(`${PATHS.NEWS}/category/${slug}`);
	revalidatePath(PATHS.BLOG);
	revalidatePath(PATHS.NEWS);
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate blog tags
 * Call this when posts with tags are created/updated/deleted
 */
export async function revalidateBlogTags(): Promise<void> {
	revalidateTag(CACHE_TAGS.BLOG_TAGS, "default");
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

/**
 * Revalidate author-related caches
 * Call this when author info changes or posts by author change
 */
export async function revalidateAuthor(authorId: string): Promise<void> {
	revalidateTag(CACHE_TAGS.AUTHOR(authorId), "default");
	revalidateTag(CACHE_TAGS.AUTHORS, "default");
	revalidatePath(`${PATHS.BLOG}/author/${authorId}`);
	revalidatePath(`${PATHS.NEWS}/author/${authorId}`);
}

/**
 * Revalidate homepage
 * Call this when homepage content is updated
 */
export async function revalidateHomePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.HOME_PAGE, "default");
	revalidatePath(PATHS.HOME);
}

/**
 * Revalidate sitemaps
 * Call this when any content that affects sitemaps changes
 */
export async function revalidateSitemaps(): Promise<void> {
	revalidateTag(CACHE_TAGS.SITEMAPS, "default");
}

// ============ Static Page Revalidation Functions ============

/**
 * Revalidate about page
 * Call this when about page content is updated
 */
export async function revalidateAboutPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.ABOUT_PAGE, "default");
	revalidatePath(PATHS.ABOUT);
}

/**
 * Revalidate team page
 * Call this when team page content is updated
 */
export async function revalidateTeamPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.TEAM_PAGE, "default");
	revalidatePath(PATHS.TEAM);
}

/**
 * Revalidate legal page
 * Call this when legal page content is updated
 */
export async function revalidateLegalPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.LEGAL_PAGE, "default");
	revalidatePath(PATHS.LEGAL);
}

/**
 * Revalidate privacy page
 * Call this when privacy policy content is updated
 */
export async function revalidatePrivacyPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.PRIVACY_PAGE, "default");
	revalidatePath(PATHS.PRIVACY);
}

/**
 * Revalidate careers page
 * Call this when careers page content is updated
 */
export async function revalidateCareersPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.CAREERS_PAGE, "default");
	revalidatePath(PATHS.CAREERS);
}

/**
 * Revalidate starta eget page
 * Call this when start business page content is updated
 */
export async function revalidateStartaEgetPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.STARTA_EGET_PAGE, "default");
	revalidatePath(PATHS.STARTA_EGET);
	// Also revalidate sub-pages
	revalidatePath(PATHS.KOPGUIDE);
	revalidatePath(PATHS.MINIUTBILDNING);
	revalidatePath(PATHS.VARFOR_VALJA_SYNOS);
}

/**
 * Revalidate Varför Välja Synos page
 * Call this when the page content is updated
 */
export async function revalidateVarforValjaSynosPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.VARFOR_VALJA_SYNOS_PAGE, "default");
	revalidatePath(PATHS.VARFOR_VALJA_SYNOS);
}

/**
 * Revalidate Köpguide page
 * Call this when the page content is updated
 */
export async function revalidateKopguidePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.KOPGUIDE_PAGE, "default");
	revalidatePath(PATHS.KOPGUIDE);
}

/**
 * Revalidate Miniutbildning page
 * Call this when the page content is updated
 */
export async function revalidateMiniutbildningPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.MINIUTBILDNING_PAGE, "default");
	revalidatePath(PATHS.MINIUTBILDNING);
}

/**
 * Revalidate training page
 * Call this when training/education page content is updated
 */
export async function revalidateTrainingPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.TRAINING_PAGE, "default");
	revalidatePath(PATHS.TRAINING);
}

/**
 * Revalidate FAQ page
 * Call this when FAQ page content is updated
 */
export async function revalidateFaqPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.FAQ_PAGE, "default");
	revalidatePath(PATHS.FAQ);
}

/**
 * Revalidate contact page
 * Call this when contact page content is updated
 */
export async function revalidateContactPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.CONTACT_PAGE, "default");
	revalidatePath(PATHS.CONTACT);
}
