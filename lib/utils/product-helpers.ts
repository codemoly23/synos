/**
 * Product & Category Helper Utilities
 * Slug generation, URL validation, and other helpers
 */

/**
 * Generate a URL-safe slug from text
 * - Normalizes unicode characters
 * - Converts to lowercase
 * - Replaces non-alphanumeric with hyphens
 * - Removes leading/trailing hyphens
 * - Limits to 120 characters
 */
export function generateSlug(text: string): string {
	if (!text || typeof text !== "string") {
		return "";
	}

	return text
		.toString()
		.normalize("NFKD") // Normalize unicode
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
		.replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single
		.slice(0, 120);
}

/**
 * Validate if a string is a valid slug format
 */
export function isValidSlug(slug: string): boolean {
	if (!slug || typeof slug !== "string") {
		return false;
	}
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Validate if a string is a valid URL (http/https)
 */
export function isValidUrl(url: string): boolean {
	if (!url || typeof url !== "string") {
		return false;
	}
	try {
		const parsed = new URL(url);
		return ["http:", "https:"].includes(parsed.protocol);
	} catch {
		return false;
	}
}

/**
 * Validate YouTube URL format
 */
export function isValidYoutubeUrl(url: string): boolean {
	if (!url || typeof url !== "string") {
		return false;
	}
	const youtubeRegex =
		/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
	return youtubeRegex.test(url);
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYoutubeId(url: string): string | null {
	if (!url) return null;

	const regexPatterns = [
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
	];

	for (const pattern of regexPatterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Generate YouTube embed URL from video ID
 */
export function getYoutubeEmbedUrl(videoId: string): string {
	return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Sanitize HTML content (basic - use a proper library like sanitize-html in production)
 * This is a placeholder - in production, use DOMPurify or sanitize-html
 */
export function sanitizeHtml(html: string): string {
	if (!html || typeof html !== "string") {
		return "";
	}

	// Basic script tag removal - use a proper library in production
	return html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/javascript:/gi, "")
		.replace(/on\w+\s*=/gi, "");
}

/**
 * Generate unique slug by appending number if slug exists
 */
export async function generateUniqueSlug(
	baseSlug: string,
	checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
	let slug = baseSlug;
	let counter = 1;

	while (await checkExists(slug)) {
		slug = `${baseSlug}-${counter}`;
		counter++;

		// Safety limit
		if (counter > 100) {
			slug = `${baseSlug}-${Date.now()}`;
			break;
		}
	}

	return slug;
}

/**
 * Parse sort string into MongoDB sort object
 */
export function parseSortString(sortString: string): Record<string, 1 | -1> {
	const sortMap: Record<string, Record<string, 1 | -1>> = {
		createdAt: { createdAt: 1 },
		"-createdAt": { createdAt: -1 },
		title: { title: 1 },
		"-title": { title: -1 },
		publishedAt: { publishedAt: 1 },
		"-publishedAt": { publishedAt: -1 },
		name: { name: 1 },
		"-name": { name: -1 },
		order: { order: 1 },
		"-order": { order: -1 },
	};

	return sortMap[sortString] || { createdAt: -1 };
}

/**
 * Build category path string from array of category names
 */
export function buildCategoryPath(names: string[]): string {
	return names.join(" / ");
}

/**
 * Calculate reading time for HTML content
 */
export function calculateReadingTime(html: string): number {
	if (!html) return 0;

	// Strip HTML tags
	const text = html.replace(/<[^>]*>/g, "");
	// Count words
	const words = text.trim().split(/\s+/).length;
	// Average reading speed: 200 words per minute
	return Math.ceil(words / 200);
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
	if (!text || text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + "...";
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleDateString("sv-SE", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Check if ObjectId string is valid
 */
export function isValidObjectId(id: string): boolean {
	return /^[0-9a-fA-F]{24}$/.test(id);
}
