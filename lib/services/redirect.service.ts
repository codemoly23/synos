import {
	redirectRepository,
	type PaginatedRedirects,
	type RedirectData,
	type CreateRedirectInput,
	type UpdateRedirectInput,
} from "@/lib/repositories/redirect.repository";
import { logger } from "@/lib/utils/logger";

class RedirectService {
	/**
	 * Create a redirect (manual, via the admin UI)
	 */
	async createRedirect(input: CreateRedirectInput): Promise<RedirectData> {
		return redirectRepository.create(input);
	}

	/**
	 * Get paginated redirects
	 */
	async getRedirects(query: {
		page: number;
		limit: number;
		search?: string;
		sort?: string;
	}): Promise<PaginatedRedirects> {
		return redirectRepository.findPaginated(query);
	}

	/**
	 * Update a redirect
	 */
	async updateRedirect(
		id: string,
		input: UpdateRedirectInput
	): Promise<RedirectData | null> {
		return redirectRepository.update(id, input);
	}

	/**
	 * Delete a redirect
	 */
	async deleteRedirect(id: string): Promise<void> {
		return redirectRepository.deleteById(id);
	}

	/**
	 * Get all active redirects (for the proxy)
	 */
	async getActiveRedirects(): Promise<
		Array<{ fromUrl: string; toUrl: string }>
	> {
		return redirectRepository.getActiveRedirects();
	}

	/**
	 * Create or update an auto-generated redirect for a slug change.
	 * Called from content PUT handlers (products, blog posts, categories, ...)
	 * whenever a slug changes. Never overwrites a manually-created redirect.
	 */
	async createAutoRedirect(fromUrl: string, toUrl: string): Promise<void> {
		if (fromUrl === toUrl) return;

		// Break simple back-and-forth loops: if a slug was changed and then
		// changed back, an auto-redirect may already exist pointing the new
		// destination back at our source (toUrl -> fromUrl). That mapping is
		// now stale and would form a 2-hop redirect loop, so remove it first.
		const reverse = await redirectRepository.findByFromUrl(toUrl);
		if (reverse && reverse.source === "auto" && reverse.toUrl === fromUrl) {
			await redirectRepository.deleteById(String(reverse._id));
		}

		const existing = await redirectRepository.findByFromUrl(fromUrl);

		if (!existing) {
			await redirectRepository.create({ fromUrl, toUrl, source: "auto" });
			return;
		}

		if (existing.toUrl === toUrl) return;

		if (existing.source === "manual") {
			logger.warn(
				"Skipped auto-redirect: a manual redirect already exists for this URL",
				{ fromUrl, attemptedToUrl: toUrl, existingToUrl: existing.toUrl }
			);
			return;
		}

		await redirectRepository.update(String(existing._id), { toUrl });
	}
}

export const redirectService = new RedirectService();
