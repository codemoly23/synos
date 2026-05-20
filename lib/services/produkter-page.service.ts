import { unstable_cache } from "next/cache";
import {
	produkterPageRepository,
	type ProdukterPageData,
} from "@/lib/repositories/produkter-page.repository";
import type { IProdukterFaqSection } from "@/models/produkter-page.model";

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
