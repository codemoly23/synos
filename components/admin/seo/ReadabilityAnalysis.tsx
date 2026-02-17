"use client";

import * as React from "react";
import {
	CheckCircle2,
	XCircle,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Readability Analysis Data
 */
export interface ReadabilityAnalysisData {
	/** The page content text (plain text or HTML - HTML tags will be stripped) */
	content: string;
	/** The page title */
	title?: string;
}

/**
 * Readability Check Result
 */
interface ReadabilityCheck {
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
 * Get sentences from text
 */
function getSentences(text: string): string[] {
	if (!text) return [];
	return text
		.split(/[.!?]+/)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
}

/**
 * Get words from text
 */
function getWords(text: string): string[] {
	if (!text) return [];
	return text
		.split(/\s+/)
		.filter((w) => w.length > 0);
}

/**
 * Get paragraphs from HTML content
 */
function getParagraphs(html: string): string[] {
	if (!html) return [];
	// Split by paragraph tags or double newlines
	const paragraphs = html
		.split(/<\/p>|<br\s*\/?>\s*<br\s*\/?>|\n\n/)
		.map((p) => stripHtml(p).trim())
		.filter((p) => p.length > 0);
	return paragraphs.length > 0 ? paragraphs : [stripHtml(html)].filter(Boolean);
}

/**
 * Check for transition words (Swedish + English)
 */
const TRANSITION_WORDS = [
	// Swedish
	"dessutom", "därför", "dock", "emellertid", "exempelvis", "följaktligen",
	"för det första", "för det andra", "för det tredje", "framför allt",
	"i synnerhet", "istället", "likaså", "likväl", "med andra ord",
	"nämligen", "således", "sammanfattningsvis", "slutligen", "till exempel",
	"trots det", "å andra sidan", "även", "på samma sätt", "vidare",
	"snarare", "däremot", "ändå", "i alla fall", "med tanke på",
	// English
	"however", "therefore", "furthermore", "moreover", "additionally",
	"consequently", "nevertheless", "meanwhile", "similarly", "likewise",
	"for example", "for instance", "in addition", "on the other hand",
	"in contrast", "as a result", "in conclusion", "finally", "first",
	"second", "third", "also", "besides", "yet", "although", "because",
	"since", "while", "instead", "rather", "accordingly",
];

function countTransitionWords(text: string): number {
	const lowerText = text.toLowerCase();
	let count = 0;
	for (const word of TRANSITION_WORDS) {
		const regex = new RegExp(`\\b${word}\\b`, "gi");
		const matches = lowerText.match(regex);
		if (matches) count += matches.length;
	}
	return count;
}

/**
 * Check for passive voice (simple heuristic for Swedish + English)
 */
function countPassiveVoice(sentences: string[]): number {
	let passiveCount = 0;
	for (const sentence of sentences) {
		const lower = sentence.toLowerCase();
		// English passive: "is/was/were/been/being + past participle"
		if (/\b(is|was|were|are|been|being|be)\s+\w+ed\b/.test(lower)) {
			passiveCount++;
		}
		// Swedish passive: words ending in -s (common passive form)
		if (/\b\w+(ades|ades|ades)\b/.test(lower)) {
			passiveCount++;
		}
	}
	return passiveCount;
}

/**
 * Check for consecutive sentences starting with the same word
 */
function hasConsecutiveSameStart(sentences: string[]): {
	found: boolean;
	word?: string;
	count: number;
} {
	if (sentences.length < 3) return { found: false, count: 0 };

	let maxConsecutive = 1;
	let currentConsecutive = 1;
	let consecutiveWord = "";

	for (let i = 1; i < sentences.length; i++) {
		const prevFirst = getWords(sentences[i - 1])[0]?.toLowerCase();
		const currFirst = getWords(sentences[i])[0]?.toLowerCase();

		if (prevFirst && currFirst && prevFirst === currFirst) {
			currentConsecutive++;
			if (currentConsecutive > maxConsecutive) {
				maxConsecutive = currentConsecutive;
				consecutiveWord = currFirst;
			}
		} else {
			currentConsecutive = 1;
		}
	}

	return {
		found: maxConsecutive >= 3,
		word: consecutiveWord,
		count: maxConsecutive,
	};
}

/**
 * Check if content has subheadings (h2, h3, h4)
 */
function hasSubheadings(html: string): boolean {
	return /<h[2-4][^>]*>/i.test(html);
}

/**
 * Count subheadings in HTML
 */
function countSubheadings(html: string): number {
	const matches = html.match(/<h[2-4][^>]*>/gi);
	return matches ? matches.length : 0;
}

/**
 * Analyze readability and return checks
 */
function analyzeReadability(data: ReadabilityAnalysisData): {
	score: number;
	checks: ReadabilityCheck[];
} {
	const checks: ReadabilityCheck[] = [];
	const plainText = stripHtml(data.content);
	const words = getWords(plainText);
	const sentences = getSentences(plainText);
	const paragraphs = getParagraphs(data.content);
	const wordCount = words.length;
	const sentenceCount = sentences.length;

	// 1. Text length check
	if (wordCount === 0) {
		checks.push({
			id: "text-length",
			label: "Text length",
			status: "problem",
			message: "No content found. Add text content for better SEO and readability.",
		});
	} else if (wordCount < 300) {
		checks.push({
			id: "text-length",
			label: "Text length",
			status: "problem",
			message: `The text contains ${wordCount} words. This is far below the recommended minimum of 300 words. Add more content.`,
		});
	} else if (wordCount < 600) {
		checks.push({
			id: "text-length",
			label: "Text length",
			status: "improvement",
			message: `The text contains ${wordCount} words. Consider adding more content for a more comprehensive page (600+ words recommended).`,
		});
	} else {
		checks.push({
			id: "text-length",
			label: "Text length",
			status: "good",
			message: `The text contains ${wordCount} words. Good job!`,
		});
	}

	// 2. Paragraph length check
	if (paragraphs.length > 0 && wordCount > 0) {
		const longParagraphs = paragraphs.filter(
			(p) => getWords(p).length > 150
		);
		if (longParagraphs.length > 0) {
			checks.push({
				id: "paragraph-length",
				label: "Paragraph length",
				status: "problem",
				message: `${longParagraphs.length} paragraph(s) are too long (over 150 words). Try to keep paragraphs under 150 words for better readability.`,
			});
		} else {
			const mediumParagraphs = paragraphs.filter(
				(p) => getWords(p).length > 100
			);
			if (mediumParagraphs.length > 0) {
				checks.push({
					id: "paragraph-length",
					label: "Paragraph length",
					status: "improvement",
					message: `${mediumParagraphs.length} paragraph(s) are slightly long. Consider breaking them into smaller paragraphs.`,
				});
			} else {
				checks.push({
					id: "paragraph-length",
					label: "Paragraph length",
					status: "good",
					message: "None of the paragraphs are too long. Good job!",
				});
			}
		}
	}

	// 3. Sentence length check
	if (sentenceCount > 0) {
		const longSentences = sentences.filter(
			(s) => getWords(s).length > 20
		);
		const longPercentage = (longSentences.length / sentenceCount) * 100;

		if (longPercentage > 25) {
			checks.push({
				id: "sentence-length",
				label: "Sentence length",
				status: "problem",
				message: `${Math.round(longPercentage)}% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%. Try to shorten your sentences.`,
			});
		} else if (longPercentage > 15) {
			checks.push({
				id: "sentence-length",
				label: "Sentence length",
				status: "improvement",
				message: `${Math.round(longPercentage)}% of the sentences contain more than 20 words. Try to shorten some sentences.`,
			});
		} else {
			checks.push({
				id: "sentence-length",
				label: "Sentence length",
				status: "good",
				message: "Sentence length looks great. Good job!",
			});
		}
	}

	// 4. Transition words check
	if (sentenceCount > 0) {
		const transitionCount = countTransitionWords(plainText);
		const transitionPercentage = (transitionCount / sentenceCount) * 100;

		if (transitionPercentage < 20) {
			checks.push({
				id: "transition-words",
				label: "Transition words",
				status: "problem",
				message: `Only ${Math.round(transitionPercentage)}% of the sentences contain transition words, which is not enough. Use more transition words.`,
			});
		} else if (transitionPercentage < 30) {
			checks.push({
				id: "transition-words",
				label: "Transition words",
				status: "improvement",
				message: `${Math.round(transitionPercentage)}% of the sentences contain transition words. Try to use a few more.`,
			});
		} else {
			checks.push({
				id: "transition-words",
				label: "Transition words",
				status: "good",
				message: `${Math.round(transitionPercentage)}% of the sentences contain transition words. Well done!`,
			});
		}
	}

	// 5. Passive voice check
	if (sentenceCount > 0) {
		const passiveCount = countPassiveVoice(sentences);
		const passivePercentage = (passiveCount / sentenceCount) * 100;

		if (passivePercentage > 15) {
			checks.push({
				id: "passive-voice",
				label: "Passive voice",
				status: "problem",
				message: `${Math.round(passivePercentage)}% of the sentences contain passive voice, which is more than the recommended maximum of 10%. Try to use their active counterparts.`,
			});
		} else if (passivePercentage > 10) {
			checks.push({
				id: "passive-voice",
				label: "Passive voice",
				status: "improvement",
				message: `${Math.round(passivePercentage)}% of the sentences contain passive voice. Try to reduce this.`,
			});
		} else {
			checks.push({
				id: "passive-voice",
				label: "Passive voice",
				status: "good",
				message: passiveCount === 0
					? "No passive voice detected. Well done!"
					: `Only ${Math.round(passivePercentage)}% passive voice. Good job!`,
			});
		}
	}

	// 6. Consecutive sentences check
	if (sentences.length >= 3) {
		const consecutive = hasConsecutiveSameStart(sentences);
		if (consecutive.found) {
			checks.push({
				id: "consecutive-sentences",
				label: "Consecutive sentences",
				status: "problem",
				message: `${consecutive.count} consecutive sentences start with the same word "${consecutive.word}". Try to vary sentence beginnings.`,
			});
		} else {
			checks.push({
				id: "consecutive-sentences",
				label: "Consecutive sentences",
				status: "good",
				message: "There is enough variety in your sentences. Good job!",
			});
		}
	}

	// 7. Subheading distribution check
	if (wordCount > 300) {
		const subheadingCount = countSubheadings(data.content);
		if (subheadingCount === 0) {
			checks.push({
				id: "subheading-distribution",
				label: "Subheading distribution",
				status: "problem",
				message: "The text does not contain any subheadings. Add subheadings to improve readability.",
			});
		} else {
			const wordsPerSubheading = wordCount / subheadingCount;
			if (wordsPerSubheading > 300) {
				checks.push({
					id: "subheading-distribution",
					label: "Subheading distribution",
					status: "improvement",
					message: "Some sections of text are long and could benefit from more subheadings.",
				});
			} else {
				checks.push({
					id: "subheading-distribution",
					label: "Subheading distribution",
					status: "good",
					message: "Great use of subheadings to structure the content!",
				});
			}
		}
	}

	// Calculate score
	const goodCount = checks.filter((c) => c.status === "good").length;
	const totalChecks = checks.length;
	const score = totalChecks > 0 ? Math.round((goodCount / totalChecks) * 100) : 0;

	return { score, checks };
}

/**
 * Individual readability check item
 */
function ReadabilityCheckItem({ check }: { check: ReadabilityCheck }) {
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

interface ReadabilityAnalysisProps {
	data: ReadabilityAnalysisData;
	className?: string;
}

/**
 * Readability Analysis Component
 * Shows readability score and detailed checks (Yoast-style)
 */
export function ReadabilityAnalysis({
	data,
	className,
}: ReadabilityAnalysisProps) {
	const [isExpanded, setIsExpanded] = React.useState(true);
	const { score, checks } = analyzeReadability(data);

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
							<BookOpen className="w-4 h-4" />
							Readability
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
									<ReadabilityCheckItem
										key={check.id}
										check={check}
									/>
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
									<ReadabilityCheckItem
										key={check.id}
										check={check}
									/>
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
									<ReadabilityCheckItem
										key={check.id}
										check={check}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
