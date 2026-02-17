import {
	custom404PageRepository,
	type Custom404PageData,
} from "@/lib/repositories/custom-404-page.repository";
import type { UpdateCustom404PageInput } from "@/lib/validations/custom-404-page.validation";

class Custom404PageService {
	async getCustom404Page(): Promise<Custom404PageData> {
		return custom404PageRepository.get();
	}

	async updateCustom404Page(
		data: UpdateCustom404PageInput
	): Promise<Custom404PageData> {
		return custom404PageRepository.update(data);
	}
}

export const custom404PageService = new Custom404PageService();
