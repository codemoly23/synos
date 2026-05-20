import { unstable_cache } from "next/cache";
import {
	produkterPageRepository,
	type ProdukterPageData,
} from "@/lib/repositories/produkter-page.repository";
import type { IProdukterFaqSection, IProdukterHeroSection } from "@/models/produkter-page.model";

export const PRODUKTER_PAGE_CACHE_TAG = "produkter-page";

export const getProdukterPage = unstable_cache(
	async (): Promise<ProdukterPageData> => {
		return produkterPageRepository.get();
	},
	["produkter-page"],
	{
		tags: [PRODUKTER_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

export const getProdukterFaqSection = unstable_cache(
	async (): Promise<IProdukterFaqSection> => {
		return produkterPageRepository.getFaqSection();
	},
	["produkter-page-faq"],
	{
		tags: [PRODUKTER_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

export const getProdukterHeroSection = unstable_cache(
	async (): Promise<IProdukterHeroSection> => {
		return produkterPageRepository.getHeroSection();
	},
	["produkter-page-hero"],
	{
		tags: [PRODUKTER_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
