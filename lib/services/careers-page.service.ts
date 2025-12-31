import {
	careersPageRepository,
	type CareersPageData,
	type JobOpeningData,
} from "@/lib/repositories/careers-page.repository";

class CareersPageService {
	/**
	 * Get the careers page data (admin - all jobs)
	 */
	async getCareersPage(): Promise<CareersPageData> {
		return careersPageRepository.get();
	}

	/**
	 * Get the careers page data (public - only active jobs)
	 */
	async getPublicCareersPage(): Promise<CareersPageData> {
		return careersPageRepository.getPublic();
	}

	/**
	 * Update the careers page data
	 */
	async updateCareersPage(
		data: Partial<CareersPageData>
	): Promise<CareersPageData> {
		return careersPageRepository.update(data);
	}

	/**
	 * Get a single job opening by slug
	 */
	async getJobBySlug(slug: string): Promise<JobOpeningData | null> {
		return careersPageRepository.getJobBySlug(slug);
	}

	/**
	 * Get all active job openings
	 */
	async getActiveJobs(): Promise<JobOpeningData[]> {
		return careersPageRepository.getActiveJobs();
	}
}

export const careersPageService = new CareersPageService();
