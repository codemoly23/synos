import {
	varforValjaSynosPageRepository,
	type VarforValjaSynosPageData,
} from "@/lib/repositories/varfor-valja-synos-page.repository";

class VarforValjaSynosPageService {
	/**
	 * Get the Varför Välja Synos page data
	 */
	async getVarforValjaSynosPage(): Promise<VarforValjaSynosPageData> {
		return varforValjaSynosPageRepository.get();
	}

	/**
	 * Update the Varför Välja Synos page data
	 */
	async updateVarforValjaSynosPage(
		data: Partial<VarforValjaSynosPageData>
	): Promise<VarforValjaSynosPageData> {
		return varforValjaSynosPageRepository.update(data);
	}
}

export const varforValjaSynosPageService = new VarforValjaSynosPageService();
