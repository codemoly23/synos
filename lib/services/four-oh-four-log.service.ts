import {
	fourOhFourLogRepository,
	type PaginatedFourOhFourLogs,
	type FourOhFourLogData,
	type FourOhFourLogStats,
} from "@/lib/repositories/four-oh-four-log.repository";

const IGNORED_EXTENSIONS = [
	".js",
	".css",
	".ico",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".svg",
	".woff",
	".woff2",
	".ttf",
	".map",
	".webp",
	".avif",
];

class FourOhFourLogService {
	/**
	 * Log a 404 hit with URL normalization and filtering
	 */
	async logHit(
		url: string,
		referrer?: string,
		userAgent?: string
	): Promise<void> {
		// Normalize URL
		const normalized = url.trim().toLowerCase().replace(/\/+$/, "") || "/";

		// Skip logging for static assets, API routes, Next.js internals
		if (
			normalized.startsWith("/_next/") ||
			normalized.startsWith("/api/") ||
			normalized.startsWith("/dashboard") ||
			IGNORED_EXTENSIONS.some((ext) => normalized.endsWith(ext))
		) {
			return;
		}

		await fourOhFourLogRepository.logHit(normalized, referrer, userAgent);
	}

	/**
	 * Get paginated 404 logs
	 */
	async getLogs(query: {
		page: number;
		limit: number;
		search?: string;
		sort?: string;
	}): Promise<PaginatedFourOhFourLogs> {
		return fourOhFourLogRepository.findPaginated(query);
	}

	/**
	 * Add a redirect URL to a log entry
	 */
	async addRedirect(
		id: string,
		redirectUrl: string
	): Promise<FourOhFourLogData | null> {
		return fourOhFourLogRepository.updateRedirect(id, redirectUrl);
	}

	/**
	 * Remove a redirect from a log entry
	 */
	async removeRedirect(id: string): Promise<FourOhFourLogData | null> {
		return fourOhFourLogRepository.removeRedirect(id);
	}

	/**
	 * Delete a single log entry
	 */
	async deleteLog(id: string): Promise<void> {
		return fourOhFourLogRepository.deleteById(id);
	}

	/**
	 * Delete multiple log entries
	 */
	async deleteLogs(ids: string[]): Promise<number> {
		return fourOhFourLogRepository.deleteMany(ids);
	}

	/**
	 * Get all active redirects (for middleware)
	 */
	async getActiveRedirects(): Promise<
		Array<{ url: string; redirectUrl: string }>
	> {
		return fourOhFourLogRepository.getActiveRedirects();
	}

	/**
	 * Get statistics
	 */
	async getStats(): Promise<FourOhFourLogStats> {
		return fourOhFourLogRepository.getStats();
	}
}

export const fourOhFourLogService = new FourOhFourLogService();
