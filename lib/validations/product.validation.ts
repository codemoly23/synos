import { z } from "zod";
import {
	isLocalPath,
	isValidExternalUrl,
	isValidUrl,
	imageUrlSchema,
	optionalImageUrlSchema,
	productImagesSchema,
	optionalNumber,
} from "./media.validation";

/**
 * URL validation helper - accepts both local paths and external URLs
 */
const urlSchema = z.string().refine(
	(url) => {
		if (!url || url.trim() === "") return false;
		return isLocalPath(url) || isValidExternalUrl(url);
	},
	{
		message:
			"Must be a valid local path (starting with /) or URL (http/https)",
	}
);

/**
 * Optional URL schema - accepts local paths, external URLs, or empty
 */
const optionalUrlSchema = z
	.string()
	.optional()
	.refine(
		(url) => {
			if (!url || url.trim() === "") return true;
			return isValidUrl(url);
		},
		{
			message:
				"Must be a valid local path (starting with /) or URL (http/https)",
		}
	);

/**
 * Slug validation
 */
const slugSchema = z
	.string()
	.min(1, "Slug is required")
	.max(120, "Slug cannot exceed 120 characters")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug must be lowercase, alphanumeric with hyphens only"
	);

/**
 * QnA Schema
 */
const qnaSchema = z.object({
	question: z.string().min(1, "Question is required").max(500),
	answer: z.string().min(1, "Answer is required").max(5000),
	visible: z.boolean().optional(),
});

/**
 * Tech Specification Schema
 */
const techSpecSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().min(1, "Description is required").max(2000),
});

/**
 * Document Entry Schema
 */
const documentEntrySchema = z.object({
	title: z.string().min(1, "Document title is required").max(200),
	url: z.string({
		message: "Documentation file is required",
	}),
});

/**
 * Before/After Image Schema
 */
const beforeAfterImageSchema = z.object({
	beforeImage: z.string().min(1, "Before image is required"),
	afterImage: z.string().min(1, "After image is required"),
	label: z.string().max(200).optional(),
});

/**
 * Purchase Info Schema
 */
const purchaseInfoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().optional(), // Rich HTML
	formSubtitle: z.string().max(300).optional(),
	buttonText: z.string().max(100).optional(),
});

/**
 * SEO Accordion Schema
 */
const seoAccordionSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	content: z.string().min(1, "Content is required"),
	order: z.number().default(0),
});

/**
 * SEO Schema
 */
const seoSchema = z.object({
	title: z
		.string()
		.max(70, "SEO title should not exceed 70 characters")
		.optional(),
	description: z
		.string()
		.max(160, "SEO description should not exceed 160 characters")
		.optional(),
	ogImage: optionalUrlSchema,
	canonicalUrl: optionalUrlSchema,
	noindex: z.boolean().optional(),
});

/**
 * Feature Section Item Schema
 */
const featureSectionItemSchema = z.object({
	iconName: z.string().max(100).optional().default(""),
	title: z.string().max(200).optional().default(""),
	description: z.string().max(500).optional().default(""),
});

const featureSectionsSchema = z.object({
	section1: z.object({
		eyebrow: z.string().max(100).optional().default(""),
		heading: z.string().max(200).optional().default(""),
		paragraph1: z.string().max(1000).optional().default(""),
		paragraph2: z.string().max(1000).optional().default(""),
		numberedFeatures: z.array(featureSectionItemSchema).max(3).optional().default([]),
		benefits: z.array(featureSectionItemSchema).max(6).optional().default([]),
	}).optional(),
	section2: z.object({
		eyebrow: z.string().max(100).optional().default(""),
		heading: z.string().max(200).optional().default(""),
		description: z.string().max(500).optional().default(""),
		topItems: z.array(featureSectionItemSchema).max(4).optional().default([]),
		bottomTitle: z.string().max(200).optional().default(""),
		bottomDescription: z.string().max(500).optional().default(""),
		bottomItems: z.array(featureSectionItemSchema).max(3).optional().default([]),
	}).optional(),
	section3: z.object({
		eyebrow: z.string().max(100).optional().default(""),
		heading: z.string().max(200).optional().default(""),
		description: z.string().max(500).optional().default(""),
		gridFeatures: z.array(featureSectionItemSchema).max(4).optional().default([]),
		bottomTitle: z.string().max(200).optional().default(""),
		bottomDescription: z.string().max(500).optional().default(""),
		bottomItems: z.array(featureSectionItemSchema).max(3).optional().default([]),
	}).optional(),
}).optional();

/**
 * Base Product Schema (for drafts - minimal validation)
 */
export const createProductDraftSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	slug: slugSchema.optional(),
	description: z.string().optional().default(""),
	shortDescription: z.string().max(1500).optional(),
	heroSubtitle: z.string().max(300).optional(),
	heroFeatures: z.array(z.string().max(100)).max(6).optional().default([]),
	productDescription: z.string().optional(),
	additionalDescription: z.string().optional(),
	additionalDescriptionTitle: z.string().max(200).optional(),
	hiddenDescription: z.string().optional(),
	benefits: z.array(z.string().max(500)).optional().default([]),
	certifications: z.array(z.string().max(100)).optional().default([]),
	treatments: z.array(z.string().max(100)).optional().default([]),
	productImages: z.array(z.string()).optional().default([]), // Draft allows any images
	overviewImage: z.string().optional(),
	imageWidth: optionalNumber,
	imageHeight: optionalNumber,
	beforeAfterImages: z.array(beforeAfterImageSchema).optional().default([]),
	techSpecifications: z.array(techSpecSchema).optional().default([]),
	documentation: z.array(documentEntrySchema).optional().default([]),
	purchaseInfo: purchaseInfoSchema.optional(),
	seo: seoSchema.optional(),
	categories: z.array(z.string()).optional().default([]),
	primaryCategory: z.string().optional(),
	faqTitle: z.string().max(200).optional(),
	qa: z.array(qnaSchema).optional().default([]),
	seoAccordions: z.array(seoAccordionSchema).optional().default([]),
	heroBackgroundMobile: z.string().optional(),
	heroBackgroundDesktop: z.string().optional(),
	heroBackgroundMobileWidth: optionalNumber,
	heroBackgroundMobileHeight: optionalNumber,
	heroBackgroundDesktopWidth: optionalNumber,
	heroBackgroundDesktopHeight: optionalNumber,
	inquiryBgMobile: z.string().optional(),
	inquiryBgDesktop: z.string().optional(),
	inquiryBgMobileWidth: optionalNumber,
	inquiryBgMobileHeight: optionalNumber,
	inquiryBgDesktopWidth: optionalNumber,
	inquiryBgDesktopHeight: optionalNumber,
	youtubeUrl: optionalUrlSchema,
	videoThumbnail: z.string().optional(),
	videoThumbnailWidth: optionalNumber,
	videoThumbnailHeight: optionalNumber,
	section1Image: z.string().optional(),
	section1ImageWidth: optionalNumber,
	section1ImageHeight: optionalNumber,
	section2TopImage: z.string().optional(),
	section2TopImageWidth: optionalNumber,
	section2TopImageHeight: optionalNumber,
	section2BottomImage: z.string().optional(),
	section2BottomImageWidth: optionalNumber,
	section2BottomImageHeight: optionalNumber,
	section3Image: z.string().optional(),
	section3ImageWidth: optionalNumber,
	section3ImageHeight: optionalNumber,
	rubric: z.string().max(1000).optional(),
	technologyGroups: z.array(z.string().max(100)).optional().default([]),
	featureSections: featureSectionsSchema,
	publishType: z.enum(["publish", "draft", "pending", "private"]).default("draft"),
	visibility: z.enum(["public", "hidden"]).default("public"),
});

/**
 * Update Product Schema (all fields optional except what's being updated)
 */
export const updateProductSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	slug: slugSchema.optional(),
	description: z.string().optional(),
	shortDescription: z.string().max(1500).optional(),
	heroSubtitle: z.string().max(300).optional(),
	heroFeatures: z.array(z.string().max(100)).max(6).optional(),
	productDescription: z.string().optional(),
	additionalDescription: z.string().optional(),
	additionalDescriptionTitle: z.string().max(200).optional(),
	hiddenDescription: z.string().optional(),
	benefits: z.array(z.string().max(500)).optional(),
	certifications: z.array(z.string().max(100)).optional(),
	treatments: z.array(z.string().max(100)).optional(),
	productImages: z.array(z.string()).optional(),
	overviewImage: z.string().optional(),
	imageWidth: optionalNumber,
	imageHeight: optionalNumber,
	beforeAfterImages: z.array(beforeAfterImageSchema).optional(),
	techSpecifications: z.array(techSpecSchema).optional(),
	documentation: z.array(documentEntrySchema).optional(),
	purchaseInfo: purchaseInfoSchema.optional(),
	seo: seoSchema.optional(),
	categories: z.array(z.string()).optional(),
	primaryCategory: z.string().optional(),
	faqTitle: z.string().max(200).optional(),
	qa: z.array(qnaSchema).optional(),
	seoAccordions: z.array(seoAccordionSchema).optional(),
	heroBackgroundMobile: z.string().optional(),
	heroBackgroundDesktop: z.string().optional(),
	heroBackgroundMobileWidth: optionalNumber,
	heroBackgroundMobileHeight: optionalNumber,
	heroBackgroundDesktopWidth: optionalNumber,
	heroBackgroundDesktopHeight: optionalNumber,
	inquiryBgMobile: z.string().optional(),
	inquiryBgDesktop: z.string().optional(),
	inquiryBgMobileWidth: optionalNumber,
	inquiryBgMobileHeight: optionalNumber,
	inquiryBgDesktopWidth: optionalNumber,
	inquiryBgDesktopHeight: optionalNumber,
	youtubeUrl: optionalUrlSchema,
	videoThumbnail: z.string().optional(),
	videoThumbnailWidth: optionalNumber,
	videoThumbnailHeight: optionalNumber,
	section1Image: z.string().optional(),
	section1ImageWidth: optionalNumber,
	section1ImageHeight: optionalNumber,
	section2TopImage: z.string().optional(),
	section2TopImageWidth: optionalNumber,
	section2TopImageHeight: optionalNumber,
	section2BottomImage: z.string().optional(),
	section2BottomImageWidth: optionalNumber,
	section2BottomImageHeight: optionalNumber,
	section3Image: z.string().optional(),
	section3ImageWidth: optionalNumber,
	section3ImageHeight: optionalNumber,
	rubric: z.string().max(1000).optional(),
	technologyGroups: z.array(z.string().max(100)).optional().default([]),
	featureSections: featureSectionsSchema,
	publishType: z.enum(["publish", "draft", "pending", "private"]).optional(),
	visibility: z.enum(["public", "hidden"]).optional(),
});

/**
 * Publish Validation Schema (strict validation for publishing)
 * Returns all validation errors at once
 */
export const publishProductSchema = z.object({
	title: z.string().min(1, "Title is required for publishing").max(200),
	slug: slugSchema,
	description: z.string().min(1, "Description is required for publishing"),
	productImages: productImagesSchema, // At least 1, max 10 images
	techSpecifications: z.array(
		z.object({
			title: z.string().min(1, "Tech spec title is required"),
			description: z.string().min(1, "Tech spec description is required"),
		})
	),
	documentation: z.array(
		z.object({
			title: z.string().min(1, "Document title is required"),
			url: z.string({
				message: "Documentation file is required",
			}),
		})
	),
	qa: z.array(
		z.object({
			question: z.string().min(1, "Question is required"),
			answer: z.string().min(1, "Answer is required"),
			visible: z.boolean(),
		})
	),
	seo: z.object({
		title: z
			.string()
			.min(1, "SEO title is recommended for publishing")
			.optional(),
		description: z
			.string()
			.min(1, "SEO description is recommended for publishing")
			.optional(),
		ogImage: optionalImageUrlSchema,
		canonicalUrl: optionalUrlSchema,
		noindex: z.boolean().optional(),
	}),
});

/**
 * Product list query params
 * Note: Using nullable().transform() to handle null from searchParams.get()
 */
export const productListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
	search: z
		.string()
		.nullable()
		.optional()
		.transform((val) => val || undefined),
	category: z
		.string()
		.nullable()
		.optional()
		.transform((val) => val || undefined),
	publishType: z
		.enum(["publish", "draft", "private"])
		.nullable()
		.optional()
		.transform((val) => val || undefined),
	visibility: z
		.enum(["public", "hidden"])
		.nullable()
		.optional()
		.transform((val) => val || undefined),
	sort: z
		.enum([
			"createdAt",
			"-createdAt",
			"title",
			"-title",
			"publishedAt",
			"-publishedAt",
		])
		.nullable()
		.default("-createdAt")
		.transform((val) => val || "-createdAt"),
});

// Type exports
export type CreateProductDraftInput = z.infer<typeof createProductDraftSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type PublishProductInput = z.infer<typeof publishProductSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
