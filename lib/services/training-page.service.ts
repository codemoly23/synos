import {
	trainingPageRepository,
	type TrainingPageData,
} from "@/lib/repositories/training-page.repository";

class TrainingPageService {
	/**
	 * Get the training page data
	 */
	async getTrainingPage(): Promise<TrainingPageData> {
		return trainingPageRepository.get();
	}

	/**
	 * Update the training page data
	 */
	async updateTrainingPage(
		data: Partial<TrainingPageData>
	): Promise<TrainingPageData> {
		return trainingPageRepository.update(data);
	}
}

export const trainingPageService = new TrainingPageService();
