import {
	homePageRepository,
	type HomePageData,
} from "@/lib/repositories/home-page.repository";
import type {
	IHeroSection,
	IFeatureHighlight,
	IProcessStepsSection,
	IAboutSection,
	ICtaSection,
	IHomePageSeo,
	IProductShowcaseSection,
	IImageGallerySection,
} from "@/models/home-page.model";

/**
 * Cache tag for home page
 * Use this to revalidate when content changes
 */
export const HOME_PAGE_CACHE_TAG = "home-page";

/**
 * Get home page content
 * Caching is handled at the page level via ISR (revalidate = 86400)
 * On-demand revalidation via revalidatePath("/", "page") in the API route
 */
export const getHomePage = async (): Promise<HomePageData> => {
	return homePageRepository.get();
};

/**
 * Get hero section only
 */
export const getHeroSection = async (): Promise<IHeroSection> => {
	return homePageRepository.getHero();
};

/**
 * Get feature highlights only
 */
export const getFeatureHighlights = async (): Promise<IFeatureHighlight[]> => {
	return homePageRepository.getFeatures();
};

/**
 * Get product showcase section only
 */
export const getProductShowcaseSection =
	async (): Promise<IProductShowcaseSection> => {
		return homePageRepository.getProductShowcase();
	};

/**
 * Get image gallery section only
 */
export const getImageGallerySection =
	async (): Promise<IImageGallerySection> => {
		return homePageRepository.getImageGallery();
	};

/**
 * Get process steps section only
 */
export const getProcessStepsSection =
	async (): Promise<IProcessStepsSection> => {
		return homePageRepository.getProcessStepsSection();
	};

/**
 * Get about section only
 */
export const getAboutSection = async (): Promise<IAboutSection> => {
	return homePageRepository.getAboutSection();
};

/**
 * Get CTA section only
 */
export const getCtaSection = async (): Promise<ICtaSection> => {
	return homePageRepository.getCtaSection();
};

/**
 * Get SEO settings only
 */
export const getHomePageSeo = async (): Promise<IHomePageSeo> => {
	return homePageRepository.getSeo();
};
