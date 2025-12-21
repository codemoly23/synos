import {
	careersPageRepository,
	type CareersPageData,
} from "@/lib/repositories/careers-page.repository";

class CareersPageService {
	/**
	 * Get the careers page data
	 */
	async getCareersPage(): Promise<CareersPageData> {
		return careersPageRepository.get();
	}

	/**
	 * Update the careers page data
	 */
	async updateCareersPage(
		data: Partial<CareersPageData>
	): Promise<CareersPageData> {
		return careersPageRepository.update(data);
	}
}

export const careersPageService = new CareersPageService();
