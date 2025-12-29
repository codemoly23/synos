import {
	kopguidePageRepository,
	type KopguidePageData,
} from "@/lib/repositories/kopguide-page.repository";

class KopguidePageService {
	/**
	 * Get the Köpguide page data
	 */
	async getKopguidePage(): Promise<KopguidePageData> {
		return kopguidePageRepository.get();
	}

	/**
	 * Update the Köpguide page data
	 */
	async updateKopguidePage(
		data: Partial<KopguidePageData>
	): Promise<KopguidePageData> {
		return kopguidePageRepository.update(data);
	}
}

export const kopguidePageService = new KopguidePageService();
