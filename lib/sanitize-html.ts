/**
 * Sanitize HTML content by removing unwanted attributes
 *
 * Removes WordPress-specific attributes and classes from HTML content
 * to ensure clean rendering on the new site.
 */

const WP_CLASSES_TO_REMOVE = [
	"alignnone",
	"aligncenter",
	"alignleft",
	"alignright",
	"size-full",
	"size-medium",
	"size-large",
	"size-thumbnail",
	"wp-caption",
	"wp-caption-text",
];

function cleanClassAttr(classes: string): string {
	let result = classes;
	WP_CLASSES_TO_REMOVE.forEach((cls) => {
		result = result.replace(new RegExp(`\\b${cls}\\b`, "g"), "");
	});
	// Remove wp-image-XXXX
	result = result.replace(/\bwp-image-\d+\b/g, "");
	return result.trim().replace(/\s+/g, " ");
}

function convertCaptionShortcodes(html: string): string {
	return html.replace(
		/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi,
		(_match, inner) => {
			const imgMatch = inner.match(/<img[^>]*>/i);
			const img = imgMatch ? imgMatch[0] : "";
			const captionText = inner.replace(/<img[^>]*>/i, "").trim();
			return `<figure>${img}${captionText ? `<figcaption>${captionText}</figcaption>` : ""}</figure>`;
		}
	);
}

export function sanitizeHtmlContent(html: string): string {
	if (!html) return "";

	let cleaned = html;

	// Convert WordPress [caption] shortcodes to semantic HTML
	cleaned = convertCaptionShortcodes(cleaned);

	// Remove remaining shortcode tags (e.g. [gallery], [embed])
	cleaned = cleaned.replace(/\[[a-z_]+[^\]]*\]/gi, "");
	cleaned = cleaned.replace(/\[\/[a-z_]+\]/gi, "");

	// Remove WordPress data attributes
	cleaned = cleaned.replace(/\s+data-start="[^"]*"/g, "");
	cleaned = cleaned.replace(/\s+data-end="[^"]*"/g, "");
	cleaned = cleaned.replace(/\s+data-col-size="[^"]*"/g, "");
	cleaned = cleaned.replace(/\s+data-sentry[^=]*="[^"]*"/g, "");

	// Strip all inline style attributes — WordPress adds font-size, color, font-weight
	// etc. that override our Tailwind prose styles
	cleaned = cleaned.replace(/\s+style="[^"]*"/g, "");
	cleaned = cleaned.replace(/\s+style='[^']*'/g, "");

	// Clean class attributes — match any class="..." and strip WP-specific class names
	cleaned = cleaned.replace(/class="([^"]*)"/g, (_match, classes) => {
		const result = cleanClassAttr(classes);
		return result ? `class="${result}"` : "";
	});

	// Remove leftover empty class attributes
	cleaned = cleaned.replace(/\s+class=""\s*/g, " ");
	cleaned = cleaned.replace(/class=""\s*/g, "");

	// Remove empty paragraphs WordPress uses as spacers: <p></p>, <p> </p>, <p>&nbsp;</p>
	cleaned = cleaned.replace(/<p>\s*(&nbsp;|\s)*\s*<\/p>/gi, "");

	// Collapse extra whitespace
	cleaned = cleaned.replace(/\s{2,}/g, " ");

	return cleaned.trim();
}
