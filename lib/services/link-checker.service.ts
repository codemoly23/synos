import type { IAuditedLink } from "@/models/link-audit.model";
import type { ExtractedLink } from "./link-extractor.service";

const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_REDIRECTS = 10;
const CONCURRENCY = 5;

export interface LinkCheckResult {
	url: string;
	statusCode?: number;
	status: IAuditedLink["status"];
	redirectChain: string[];
	responseTime: number;
	error?: string;
}

/**
 * Check a single URL by following redirects manually
 */
async function checkUrl(url: string): Promise<LinkCheckResult> {
	const startTime = Date.now();
	const redirectChain: string[] = [];
	let currentUrl = url;

	for (let i = 0; i < MAX_REDIRECTS; i++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

			const response = await fetch(currentUrl, {
				method: "HEAD",
				redirect: "manual",
				signal: controller.signal,
				headers: {
					"User-Agent": "SynosLinkChecker/1.0",
					Accept: "*/*",
				},
			});

			clearTimeout(timeoutId);
			const responseTime = Date.now() - startTime;

			// Handle redirects
			if ([301, 302, 303, 307, 308].includes(response.status)) {
				const location = response.headers.get("location");
				if (location) {
					redirectChain.push(currentUrl);
					// Handle relative redirect URLs
					try {
						currentUrl = new URL(location, currentUrl).toString();
					} catch {
						currentUrl = location;
					}
					continue;
				}
			}

			// Final status
			const statusCode = response.status;

			if (statusCode >= 200 && statusCode < 400) {
				return {
					url,
					statusCode,
					status: redirectChain.length > 0 ? "redirect" : "ok",
					redirectChain,
					responseTime,
				};
			}

			if (statusCode === 404 || statusCode === 410) {
				return {
					url,
					statusCode,
					status: "broken",
					redirectChain,
					responseTime,
				};
			}

			// Other error statuses
			return {
				url,
				statusCode,
				status: "broken",
				redirectChain,
				responseTime,
				error: `HTTP ${statusCode}`,
			};
		} catch (err) {
			const responseTime = Date.now() - startTime;

			if (err instanceof DOMException && err.name === "AbortError") {
				return {
					url,
					status: "timeout",
					redirectChain,
					responseTime,
					error: "Request timed out",
				};
			}

			// Try GET as fallback (some servers reject HEAD)
			if (i === 0) {
				try {
					const controller2 = new AbortController();
					const timeoutId2 = setTimeout(() => controller2.abort(), REQUEST_TIMEOUT);

					const getResponse = await fetch(currentUrl, {
						method: "GET",
						redirect: "follow",
						signal: controller2.signal,
						headers: {
							"User-Agent": "SynosLinkChecker/1.0",
							Accept: "*/*",
						},
					});

					clearTimeout(timeoutId2);
					const getResponseTime = Date.now() - startTime;
					const statusCode = getResponse.status;

					if (statusCode >= 200 && statusCode < 400) {
						return {
							url,
							statusCode,
							status: getResponse.redirected ? "redirect" : "ok",
							redirectChain: getResponse.redirected ? [url] : [],
							responseTime: getResponseTime,
						};
					}

					return {
						url,
						statusCode,
						status: "broken",
						redirectChain: [],
						responseTime: getResponseTime,
						error: `HTTP ${statusCode}`,
					};
				} catch (getErr) {
					const errMessage = getErr instanceof Error ? getErr.message : "Unknown error";
					return {
						url,
						status: "error",
						redirectChain,
						responseTime: Date.now() - startTime,
						error: errMessage,
					};
				}
			}

			const errMessage = err instanceof Error ? err.message : "Unknown error";
			return {
				url,
				status: "error",
				redirectChain,
				responseTime,
				error: errMessage,
			};
		}
	}

	// Too many redirects
	return {
		url,
		status: "redirect",
		redirectChain,
		responseTime: Date.now() - startTime,
		error: `Too many redirects (${MAX_REDIRECTS})`,
	};
}

/**
 * Process a batch of URLs with concurrency limiting
 */
async function processWithConcurrency<T, R>(
	items: T[],
	processor: (item: T) => Promise<R>,
	concurrency: number,
	onProgress?: (completed: number, total: number) => void,
	signal?: AbortSignal
): Promise<R[]> {
	const results: R[] = [];
	let completed = 0;
	let index = 0;

	async function runNext(): Promise<void> {
		while (index < items.length) {
			if (signal?.aborted) return;
			const currentIndex = index++;
			const result = await processor(items[currentIndex]);
			results[currentIndex] = result;
			completed++;
			onProgress?.(completed, items.length);
		}
	}

	const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runNext());
	await Promise.all(workers);

	return results;
}

/**
 * Check all extracted links with concurrency pool
 */
export async function checkLinks(
	extractedLinks: ExtractedLink[],
	onProgress?: (completed: number, total: number, result?: IAuditedLink) => void,
	signal?: AbortSignal
): Promise<IAuditedLink[]> {
	// Deduplicate URLs to avoid checking the same URL multiple times
	const urlMap = new Map<string, ExtractedLink[]>();
	for (const link of extractedLinks) {
		const existing = urlMap.get(link.url);
		if (existing) {
			existing.push(link);
		} else {
			urlMap.set(link.url, [link]);
		}
	}

	const uniqueUrls = Array.from(urlMap.keys());
	const checkResults = new Map<string, LinkCheckResult>();

	// Check unique URLs with concurrency
	await processWithConcurrency(
		uniqueUrls,
		async (url) => {
			const result = await checkUrl(url);
			checkResults.set(url, result);
			return result;
		},
		CONCURRENCY,
		(completed, total) => {
			onProgress?.(completed, total);
		},
		signal
	);

	// Map results back to all extracted links
	const auditedLinks: IAuditedLink[] = [];
	for (const link of extractedLinks) {
		const result = checkResults.get(link.url);
		if (!result) continue;

		// Override status for mixed content
		let finalStatus = result.status;
		if (link.isMixedContent && finalStatus === "ok") {
			finalStatus = "mixed-content";
		}

		const auditedLink: IAuditedLink = {
			url: link.url,
			sourceModel: link.sourceModel,
			sourceField: link.sourceField,
			sourceId: link.sourceId,
			sourceTitle: link.sourceTitle,
			statusCode: result.statusCode,
			status: finalStatus,
			redirectChain: result.redirectChain,
			isExternal: link.isExternal,
			isMixedContent: link.isMixedContent,
			responseTime: result.responseTime,
			error: result.error,
			rel: link.rel,
		};

		auditedLinks.push(auditedLink);
	}

	return auditedLinks;
}
