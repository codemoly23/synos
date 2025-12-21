import {
	startaEgetPageRepository,
	type StartaEgetPageData,
} from "@/lib/repositories/starta-eget-page.repository";

class StartaEgetPageService {
	/**
	 * Get the starta eget page data
	 */
	async getStartaEgetPage(): Promise<StartaEgetPageData> {
		return startaEgetPageRepository.get();
	}

	/**
	 * Update the starta eget page data
	 */
	async updateStartaEgetPage(
		data: Partial<StartaEgetPageData>
	): Promise<StartaEgetPageData> {
		return startaEgetPageRepository.update(data);
	}
}

export const startaEgetPageService = new StartaEgetPageService();
