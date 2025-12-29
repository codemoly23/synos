import {
	miniutbildningPageRepository,
	type MiniutbildningPageData,
} from "@/lib/repositories/miniutbildning-page.repository";

class MiniutbildningPageService {
	/**
	 * Get the Miniutbildning page data
	 */
	async getMiniutbildningPage(): Promise<MiniutbildningPageData> {
		return miniutbildningPageRepository.get();
	}

	/**
	 * Update the Miniutbildning page data
	 */
	async updateMiniutbildningPage(
		data: Partial<MiniutbildningPageData>
	): Promise<MiniutbildningPageData> {
		return miniutbildningPageRepository.update(data);
	}
}

export const miniutbildningPageService = new MiniutbildningPageService();
