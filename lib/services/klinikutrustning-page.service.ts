import { unstable_cache } from "next/cache";
import {
	klinikutrustningPageRepository,
	type KlinikutrustningPageData,
} from "@/lib/repositories/klinikutrustning-page.repository";
import type { IKlinikFaqSection, IKlinikHeroSection } from "@/models/klinikutrustning-page.model";

export const KLINIKUTRUSTNING_PAGE_CACHE_TAG = "klinikutrustning-page";

export const getKlinikutrustningPage = unstable_cache(
	async (): Promise<KlinikutrustningPageData> => {
		return klinikutrustningPageRepository.get();
	},
	["klinikutrustning-page"],
	{
		tags: [KLINIKUTRUSTNING_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

export const getKlinikutrustningFaqSection = unstable_cache(
	async (): Promise<IKlinikFaqSection> => {
		return klinikutrustningPageRepository.getFaqSection();
	},
	["klinikutrustning-page-faq"],
	{
		tags: [KLINIKUTRUSTNING_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

export const getKlinikutrustningHeroSection = unstable_cache(
	async (): Promise<IKlinikHeroSection> => {
		return klinikutrustningPageRepository.getHeroSection();
	},
	["klinikutrustning-page-hero"],
	{
		tags: [KLINIKUTRUSTNING_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
