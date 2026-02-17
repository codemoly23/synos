"use client";

import * as React from "react";
import {
	CheckCircle2,
	XCircle,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Search,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * SEO Analysis Data
 */
export interface SeoAnalysisData {
	title: string;
	description: string;
	slug: string;
	focusKeyphrase?: string;
	productTitle?: string;
	hasOgImage?: boolean;
	/** Page content (HTML) for comprehensive analysis */
	pageContent?: string;
}

/**
 * SEO Check Result
 */
interface SeoCheck {
	id: string;
	label: string;
	status: "good" | "improvement" | "problem";
	message: string;
}

/**
 * Strip HTML tags and get plain text
 */
function stripHtml(html: string): string {
	if (!html) return "";
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Get words from text
 */
function getWords(text: string): string[] {
	if (!text) return [];
	return text.split(/\s+/).filter((w) => w.length > 0);
}

/**
 * Count occurrences of a phrase in text
 */
function countOccurrences(text: string, phrase: string): number {
	if (!text || !phrase) return 0;
	const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
	const matches = text.match(regex);
	return matches ? matches.length : 0;
}

/**
 * Get the first paragraph text from HTML
 */
function getFirstParagraph(html: string): string {
	if (!html) return "";
	// Try to find first <p> tag content
	const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
	if (match) return stripHtml(match[1]);
	// Fallback: get first 200 chars of plain text
	const plain = stripHtml(html);
	const firstSentenceEnd = plain.indexOf(".");
	if (firstSentenceEnd > 0 && firstSentenceEnd < 300) {
		return plain.substring(0, firstSentenceEnd + 1);
	}
	return plain.substring(0, 200);
}

/**
 * Check for images in HTML content
 */
function getImages(html: string): { count: number; withAlt: number; withoutAlt: number } {
	if (!html) return { count: 0, withAlt: 0, withoutAlt: 0 };
	const imgTags = html.match(/<img[^>]*>/gi) || [];
	let withAlt = 0;
	let withoutAlt = 0;
	for (const img of imgTags) {
		if (/alt=["'][^"']+["']/i.test(img)) {
			withAlt++;
		} else {
			withoutAlt++;
		}
	}
	return { count: imgTags.length, withAlt, withoutAlt };
}

/**
 * Check for internal links in HTML
 */
function countInternalLinks(html: string): number {
	if (!html) return 0;
	const links = html.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
	let internal = 0;
	for (const link of links) {
		const href = link.match(/href=["']([^"']*)["']/i)?.[1] || "";
		if (
			href.startsWith("/") ||
			href.startsWith("#") ||
			href.includes("synos.se") ||
			href.includes("localhost")
		) {
			internal++;
		}
	}
	return internal;
}

/**
 * Check for outbound links in HTML
 */
function countOutboundLinks(html: string): number {
	if (!html) return 0;
	const links = html.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
	let outbound = 0;
	for (const link of links) {
		const href = link.match(/href=["']([^"']*)["']/i)?.[1] || "";
		if (
			href.startsWith("http") &&
			!href.includes("synos.se") &&
			!href.includes("localhost")
		) {
			outbound++;
		}
	}
	return outbound;
}

/**
 * Progress bar with color gradient based on value
 */
function ProgressBar({
	value,
	min,
	max,
	optimal,
}: {
	value: number;
	min: number;
	max: number;
	optimal: { min: number; max: number };
}) {
	const percentage = Math.min(100, (value / max) * 100);

	let colorClass = "bg-green-500";
	if (value < optimal.min) {
		colorClass = value < min ? "bg-red-500" : "bg-orange-500";
	} else if (value > optimal.max) {
		colorClass = value > max ? "bg-red-500" : "bg-orange-500";
	}

	return (
		<div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
			<div
				className={cn(
					"h-full rounded-full transition-all duration-300",
					colorClass
				)}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}

/**
 * Individual SEO check item
 */
function SeoCheckItem({ check }: { check: SeoCheck }) {
	const Icon =
		check.status === "good"
			? CheckCircle2
			: check.status === "improvement"
			? AlertCircle
			: XCircle;

	const iconColor =
		check.status === "good"
			? "text-green-500"
			: check.status === "improvement"
			? "text-orange-500"
			: "text-red-500";

	return (
		<div className="flex items-start gap-3 py-2">
			<Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
			<div className="min-w-0">
				<p className="text-sm font-medium text-slate-700">{check.label}</p>
				<p className="text-xs text-slate-500 mt-0.5">{check.message}</p>
			</div>
		</div>
	);
}

/**
 * Analyze SEO data and return checks (comprehensive Yoast-style)
 */
function analyzeSeo(data: SeoAnalysisData): {
	score: number;
	checks: SeoCheck[];
} {
	const checks: SeoCheck[] = [];
	const titleDisplay = data.title || data.productTitle || "";
	const titleLength = data.title?.length || 0;
	const descLength = data.description?.length || 0;
	const pageContent = data.pageContent || "";
	const plainContent = stripHtml(pageContent);
	const wordCount = getWords(plainContent).length;

	// --- Title checks ---
	if (titleLength === 0) {
		checks.push({
			id: "title-missing",
			label: "SEO title",
			status: "problem",
			message: "No SEO title set. Add a title between 50-60 characters.",
		});
	} else if (titleLength < 30) {
		checks.push({
			id: "title-short",
			label: "SEO title",
			status: "improvement",
			message: `Title is too short (${titleLength} characters). Aim for 50-60 characters.`,
		});
	} else if (titleLength > 60) {
		checks.push({
			id: "title-long",
			label: "SEO title",
			status: "improvement",
			message: `Title is too long (${titleLength} characters). It may be truncated in search results.`,
		});
	} else {
		checks.push({
			id: "title-good",
			label: "SEO title",
			status: "good",
			message: `Good title length (${titleLength} characters).`,
		});
	}

	// Single title check (no multiple H1s)
	if (pageContent) {
		const h1Count = (pageContent.match(/<h1[^>]*>/gi) || []).length;
		if (h1Count > 1) {
			checks.push({
				id: "single-title",
				label: "Single title",
				status: "problem",
				message: `Multiple H1 headings found (${h1Count}). Use only one H1 heading per page.`,
			});
		} else {
			checks.push({
				id: "single-title",
				label: "Single title",
				status: "good",
				message: "You don't have multiple H1 headings, well done!",
			});
		}
	}

	// --- Description checks ---
	if (descLength === 0) {
		checks.push({
			id: "desc-missing",
			label: "Meta description length",
			status: "problem",
			message:
				"No meta description has been specified. Search engines will display copy from the page instead. Make sure to write one!",
		});
	} else if (descLength < 120) {
		checks.push({
			id: "desc-short",
			label: "Meta description length",
			status: "improvement",
			message: `The meta description is too short (${descLength} characters). Aim for 120-160 characters for optimal display.`,
		});
	} else if (descLength > 160) {
		checks.push({
			id: "desc-long",
			label: "Meta description length",
			status: "improvement",
			message: `The meta description is over 160 characters (${descLength}). It may be truncated in search results.`,
		});
	} else {
		checks.push({
			id: "desc-good",
			label: "Meta description length",
			status: "good",
			message: `Good meta description length (${descLength} characters).`,
		});
	}

	// --- Slug checks ---
	if (!data.slug || data.slug.trim() === "") {
		// Home page doesn't have a slug, so this is info only
		checks.push({
			id: "slug-good",
			label: "URL slug",
			status: "good",
			message: "Home page uses the root URL.",
		});
	} else if (data.slug.length > 75) {
		checks.push({
			id: "slug-long",
			label: "URL slug",
			status: "improvement",
			message:
				"Slug is quite long. Consider shortening it for better readability.",
		});
	} else {
		checks.push({
			id: "slug-good",
			label: "URL slug",
			status: "good",
			message: `Good slug: /${data.slug}`,
		});
	}

	// --- OG Image check ---
	if (!data.hasOgImage) {
		checks.push({
			id: "og-missing",
			label: "Social image",
			status: "improvement",
			message:
				"No Open Graph image set. Add an image for better social sharing.",
		});
	} else {
		checks.push({
			id: "og-good",
			label: "Social image",
			status: "good",
			message: "Open Graph image is set for social sharing.",
		});
	}

	// --- Content-based checks (only if pageContent is provided) ---
	if (pageContent) {
		// Text length check (word count)
		if (wordCount < 300) {
			checks.push({
				id: "text-length",
				label: "Text length",
				status: "problem",
				message: `The text contains ${wordCount} words. This is far below the recommended minimum of 300 words. Add more content.`,
			});
		} else {
			checks.push({
				id: "text-length",
				label: "Text length",
				status: "good",
				message: `The text contains ${wordCount} words. Good job!`,
			});
		}

		// Images check
		const images = getImages(pageContent);
		if (images.count === 0) {
			checks.push({
				id: "images",
				label: "Images",
				status: "problem",
				message: "No images appear on this page. Add some!",
			});
		} else {
			checks.push({
				id: "images",
				label: "Images",
				status: "good",
				message: `${images.count} image(s) found on the page.`,
			});
		}

		// Image alt attributes check
		if (images.count > 0 && images.withoutAlt > 0) {
			checks.push({
				id: "image-alt",
				label: "Image alt attributes",
				status: "problem",
				message: `${images.withoutAlt} image(s) are missing alt attributes. Add descriptive alt text for accessibility and SEO.`,
			});
		} else if (images.count > 0) {
			checks.push({
				id: "image-alt",
				label: "Image alt attributes",
				status: "good",
				message: "All images have alt attributes. Good job!",
			});
		}

		// Internal links check
		const internalLinks = countInternalLinks(pageContent);
		if (internalLinks === 0) {
			checks.push({
				id: "internal-links",
				label: "Internal links",
				status: "problem",
				message: "No internal links appear in this page, make sure to add some!",
			});
		} else {
			checks.push({
				id: "internal-links",
				label: "Internal links",
				status: "good",
				message: `${internalLinks} internal link(s) found. Good job!`,
			});
		}

		// Outbound links check
		const outboundLinks = countOutboundLinks(pageContent);
		if (outboundLinks === 0) {
			checks.push({
				id: "outbound-links",
				label: "Outbound links",
				status: "problem",
				message: "No outbound links appear in this page. Add some!",
			});
		} else {
			checks.push({
				id: "outbound-links",
				label: "Outbound links",
				status: "good",
				message: `${outboundLinks} outbound link(s) found.`,
			});
		}
	}

	// --- Focus keyphrase checks (comprehensive) ---
	if (data.focusKeyphrase && data.focusKeyphrase.trim()) {
		const keyphrase = data.focusKeyphrase.toLowerCase().trim();
		const titleLower = titleDisplay.toLowerCase();
		const descLower = (data.description || "").toLowerCase();
		const slugLower = (data.slug || "").toLowerCase();

		// Keyphrase length check
		const keyphraseWords = getWords(keyphrase);
		if (keyphraseWords.length > 4) {
			checks.push({
				id: "keyphrase-length",
				label: "Keyphrase length",
				status: "improvement",
				message: "The keyphrase is over 4 words. Consider using a shorter, more focused keyphrase.",
			});
		} else {
			checks.push({
				id: "keyphrase-length",
				label: "Keyphrase length",
				status: "good",
				message: "Good job!",
			});
		}

		// Keyphrase in SEO title
		if (titleLower.includes(keyphrase)) {
			const titleStart = titleLower.indexOf(keyphrase);
			if (titleStart <= 5) {
				checks.push({
					id: "keyphrase-title",
					label: "Keyphrase in SEO title",
					status: "good",
					message: "The focus keyphrase appears at the beginning of the SEO title. Good job!",
				});
			} else {
				checks.push({
					id: "keyphrase-title",
					label: "Keyphrase in SEO title",
					status: "good",
					message: "Focus keyphrase appears in the SEO title.",
				});
			}
		} else {
			checks.push({
				id: "keyphrase-title",
				label: "Keyphrase in SEO title",
				status: "problem",
				message:
					"Not all the words from your keyphrase appear in the SEO title. For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title.",
			});
		}

		// Keyphrase in meta description
		if (descLower.includes(keyphrase)) {
			checks.push({
				id: "keyphrase-desc",
				label: "Keyphrase in meta description",
				status: "good",
				message: "Focus keyphrase appears in the meta description. Good job!",
			});
		} else {
			checks.push({
				id: "keyphrase-desc",
				label: "Keyphrase in meta description",
				status: "problem",
				message:
					"Please add both a keyphrase and a meta description containing the keyphrase.",
			});
		}

		// Keyphrase in slug
		const keyphraseSlug = keyphrase.replace(/\s+/g, "-");
		if (data.slug && (slugLower.includes(keyphrase.replace(/\s+/g, "-")) || slugLower.includes(keyphrase.replace(/\s+/g, "")))) {
			checks.push({
				id: "keyphrase-slug",
				label: "Keyphrase in slug",
				status: "good",
				message: "Your keyphrase appears in the URL slug.",
			});
		} else if (data.slug) {
			checks.push({
				id: "keyphrase-slug",
				label: "Keyphrase in slug",
				status: "improvement",
				message: `(Part of) your keyphrase does not appear in the slug. Change that!`,
			});
		}

		// Content-specific keyphrase checks
		if (pageContent) {
			const plainContentLower = plainContent.toLowerCase();

			// Keyphrase in introduction
			const firstParagraph = getFirstParagraph(pageContent).toLowerCase();
			if (firstParagraph.includes(keyphrase)) {
				checks.push({
					id: "keyphrase-intro",
					label: "Keyphrase in introduction",
					status: "good",
					message: "The keyphrase appears in the first paragraph. Good job!",
				});
			} else {
				checks.push({
					id: "keyphrase-intro",
					label: "Keyphrase in introduction",
					status: "problem",
					message:
						"Your keyphrase or its synonyms do not appear in the first paragraph. Make sure the topic is clear immediately.",
				});
			}

			// Keyphrase density
			if (wordCount > 0) {
				const keyphraseCount = countOccurrences(plainContentLower, keyphrase);
				const density = (keyphraseCount * keyphraseWords.length / wordCount) * 100;

				if (keyphraseCount === 0) {
					checks.push({
						id: "keyphrase-density",
						label: "Keyphrase density",
						status: "problem",
						message: `The keyphrase was found 0 times. That's less than the recommended minimum of 1 time for a text of this length. Focus on your keyphrase!`,
					});
				} else if (density < 0.5) {
					checks.push({
						id: "keyphrase-density",
						label: "Keyphrase density",
						status: "improvement",
						message: `The keyphrase was found ${keyphraseCount} time(s). The keyphrase density is ${density.toFixed(1)}%, which is below the recommended 0.5-3%. Use the keyphrase a bit more.`,
					});
				} else if (density > 3) {
					checks.push({
						id: "keyphrase-density",
						label: "Keyphrase density",
						status: "problem",
						message: `The keyphrase density is ${density.toFixed(1)}%, which is over the recommended 3% maximum. Don't overoptimize!`,
					});
				} else {
					checks.push({
						id: "keyphrase-density",
						label: "Keyphrase density",
						status: "good",
						message: `The keyphrase was found ${keyphraseCount} time(s). The keyphrase density is ${density.toFixed(1)}%. Good job!`,
					});
				}
			}

			// Keyphrase in image alt attributes
			if (pageContent) {
				const imgTags = pageContent.match(/<img[^>]*>/gi) || [];
				let keyphraseInAlt = false;
				for (const img of imgTags) {
					const alt = img.match(/alt=["']([^"']*)["']/i)?.[1] || "";
					if (alt.toLowerCase().includes(keyphrase)) {
						keyphraseInAlt = true;
						break;
					}
				}

				if (imgTags.length === 0) {
					checks.push({
						id: "keyphrase-image-alt",
						label: "Keyphrase in image alt attributes",
						status: "problem",
						message:
							"This page does not have images, a keyphrase, or both. Add some images with alt attributes that include the keyphrase or synonyms!",
					});
				} else if (keyphraseInAlt) {
					checks.push({
						id: "keyphrase-image-alt",
						label: "Keyphrase in image alt attributes",
						status: "good",
						message: "An image with the focus keyphrase in its alt attribute was found.",
					});
				} else {
					checks.push({
						id: "keyphrase-image-alt",
						label: "Keyphrase in image alt attributes",
						status: "improvement",
						message:
							"None of the images have an alt attribute with the focus keyphrase. Add images with alt attributes that include the keyphrase.",
					});
				}
			}

			// Keyphrase in subheading
			const subheadings = pageContent.match(/<h[2-4][^>]*>.*?<\/h[2-4]>/gi) || [];
			if (subheadings.length > 0) {
				const keyphraseInSubheading = subheadings.some((h) =>
					stripHtml(h).toLowerCase().includes(keyphrase)
				);
				if (keyphraseInSubheading) {
					checks.push({
						id: "keyphrase-subheading",
						label: "Keyphrase in subheading",
						status: "good",
						message: "Your keyphrase appears in a subheading. Good job!",
					});
				} else {
					checks.push({
						id: "keyphrase-subheading",
						label: "Keyphrase in subheading",
						status: "improvement",
						message:
							"You are not using any higher-level subheadings containing the keyphrase or its synonyms.",
					});
				}
			} else if (wordCount < 300) {
				checks.push({
					id: "keyphrase-subheading",
					label: "Keyphrase in subheading",
					status: "good",
					message: "Your text is short enough and probably doesn't need subheadings.",
				});
			}
		}

		// Function words in keyphrase check
		const functionWords = [
			"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
			"of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
			"be", "have", "has", "had", "do", "does", "did", "will", "would",
			"could", "should", "may", "might", "shall", "can", "it", "its", "this",
			"that", "these", "those", "my", "your", "his", "her", "our", "their",
			// Swedish
			"och", "i", "på", "att", "en", "ett", "den", "det", "av", "för",
			"med", "till", "om", "som", "är", "var", "har", "kan", "ska", "vi",
			"de", "du", "jag", "han", "hon", "sin", "sitt", "sina",
		];
		const allFunctionWords = keyphraseWords.every((w) =>
			functionWords.includes(w.toLowerCase())
		);
		if (allFunctionWords && keyphraseWords.length > 0) {
			checks.push({
				id: "function-words",
				label: "Function words in keyphrase",
				status: "improvement",
				message: `Your keyphrase "${data.focusKeyphrase}" contains function words only. Consider using a more descriptive keyphrase.`,
			});
		}
	}

	// SEO title width check (approximate pixel width)
	if (titleLength > 0) {
		// Rough estimation: avg char ~8px, max display ~580px
		const estimatedWidth = titleLength * 8;
		if (estimatedWidth <= 580) {
			checks.push({
				id: "seo-title-width",
				label: "SEO title width",
				status: "good",
				message: "Good job!",
			});
		} else {
			checks.push({
				id: "seo-title-width",
				label: "SEO title width",
				status: "improvement",
				message: "The SEO title is wider than the viewable limit. Try to make it shorter.",
			});
		}
	}

	// Calculate score
	const goodCount = checks.filter((c) => c.status === "good").length;
	const totalChecks = checks.length;
	const score = totalChecks > 0 ? Math.round((goodCount / totalChecks) * 100) : 0;

	return { score, checks };
}

interface SeoAnalysisProps {
	data: SeoAnalysisData;
	className?: string;
}

/**
 * SEO Analysis Component
 * Shows SEO score and detailed checks (Yoast-style)
 */
export function SeoAnalysis({ data, className }: SeoAnalysisProps) {
	const [isExpanded, setIsExpanded] = React.useState(true);
	const { score, checks } = analyzeSeo(data);

	const goodChecks = checks.filter((c) => c.status === "good");
	const improvementChecks = checks.filter((c) => c.status === "improvement");
	const problemChecks = checks.filter((c) => c.status === "problem");

	// Score color
	let scoreColor = "text-green-600 bg-green-50 border-green-200";
	if (score < 50) {
		scoreColor = "text-red-600 bg-red-50 border-red-200";
	} else if (score < 80) {
		scoreColor = "text-orange-600 bg-orange-50 border-orange-200";
	}

	return (
		<div
			className={cn(
				"rounded-lg border border-slate-200 bg-white",
				className
			)}
		>
			{/* Header with score */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
			>
				<div className="flex items-center gap-4">
					<div
						className={cn(
							"w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-lg",
							scoreColor
						)}
					>
						{score}
					</div>
					<div className="text-left">
						<h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
							<Search className="w-4 h-4" />
							SEO Analysis
						</h4>
						<p className="text-xs text-slate-500">
							{goodChecks.length} good • {improvementChecks.length}{" "}
							improvements • {problemChecks.length} problems
						</p>
					</div>
				</div>
				{isExpanded ? (
					<ChevronUp className="w-5 h-5 text-slate-400" />
				) : (
					<ChevronDown className="w-5 h-5 text-slate-400" />
				)}
			</button>

			{/* Expandable content */}
			{isExpanded && (
				<div className="border-t border-slate-200 p-4 space-y-4">
					{/* Problems */}
					{problemChecks.length > 0 && (
						<div>
							<h5 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
								Problems ({problemChecks.length})
							</h5>
							<div className="divide-y divide-slate-100">
								{problemChecks.map((check) => (
									<SeoCheckItem key={check.id} check={check} />
								))}
							</div>
						</div>
					)}

					{/* Improvements */}
					{improvementChecks.length > 0 && (
						<div>
							<h5 className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
								Improvements ({improvementChecks.length})
							</h5>
							<div className="divide-y divide-slate-100">
								{improvementChecks.map((check) => (
									<SeoCheckItem key={check.id} check={check} />
								))}
							</div>
						</div>
					)}

					{/* Good Results */}
					{goodChecks.length > 0 && (
						<div>
							<h5 className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
								Good results ({goodChecks.length})
							</h5>
							<div className="divide-y divide-slate-100">
								{goodChecks.map((check) => (
									<SeoCheckItem key={check.id} check={check} />
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

/**
 * Character count indicator with progress bar
 */
interface CharacterCountProps {
	value: string;
	min: number;
	max: number;
	optimal: { min: number; max: number };
	label: string;
}

export function CharacterCount({
	value,
	min,
	max,
	optimal,
	label,
}: CharacterCountProps) {
	const length = value?.length || 0;

	let statusColor = "text-green-600";
	let statusText = "Good";

	if (length === 0) {
		statusColor = "text-slate-400";
		statusText = "Empty";
	} else if (length < optimal.min) {
		statusColor = length < min ? "text-red-600" : "text-orange-600";
		statusText = "Too short";
	} else if (length > optimal.max) {
		statusColor = length > max ? "text-red-600" : "text-orange-600";
		statusText = "Too long";
	}

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-xs">
				<span className="text-slate-500">{label}</span>
				<span className={cn("font-medium", statusColor)}>
					{length}/{max} • {statusText}
				</span>
			</div>
			<ProgressBar value={length} min={min} max={max} optimal={optimal} />
		</div>
	);
}
