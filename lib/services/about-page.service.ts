import { unstable_cache } from "next/cache";
import {
	aboutPageRepository,
	type AboutPageData,
	type UpdateAboutPageInput,
} from "@/lib/repositories/about-page.repository";
import type { IAboutPageSeo } from "@/models/about-page.model";

/**
 * Cache tag for about page
 * Use this to revalidate when content changes
 */
export const ABOUT_PAGE_CACHE_TAG = "about-page";

/**
 * Get full about page content
 * Cached for 1 hour, revalidated on-demand when content is updated
 */
export const getAboutPage = unstable_cache(
	async (): Promise<AboutPageData> => {
		return aboutPageRepository.get();
	},
	["about-page"],
	{
		tags: [ABOUT_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Update about page content
 */
export async function updateAboutPage(
	data: UpdateAboutPageInput
): Promise<AboutPageData> {
	return aboutPageRepository.update(data);
}

/**
 * Get about page SEO settings
 */
export const getAboutPageSeo = unstable_cache(
	async (): Promise<IAboutPageSeo> => {
		return aboutPageRepository.getSeo();
	},
	["about-page-seo"],
	{
		tags: [ABOUT_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
