import { z } from "zod";

/**
 * CTA Button schema
 */
export const aboutCtaButtonSchema = z.object({
	text: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
	variant: z.enum(["primary", "outline", "secondary", "ghost"]).optional(),
});

/**
 * Hero Section schema
 */
export const aboutHeroSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
});

/**
 * Content Section schema
 */
export const aboutContentSectionSchema = z.object({
	title: z.string().max(200).optional(),
	content: z.string().max(5000).optional(),
	highlighted: z.boolean().optional(),
});

/**
 * Feature Card schema
 */
export const aboutFeatureCardSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
	ctaText: z.string().max(50).optional(),
	ctaHref: z.string().max(500).optional(),
});

/**
 * Contact Section schema
 */
export const aboutContactSectionSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	primaryCta: aboutCtaButtonSchema.optional(),
	secondaryCta: aboutCtaButtonSchema.optional(),
});

/**
 * Company Info schema
 */
export const aboutCompanyInfoSchema = z.object({
	companyName: z.string().max(200).optional(),
	organizationNumber: z.string().max(50).optional(),
	addresses: z.array(z.string().max(200)).optional(),
});

/**
 * Section Visibility schema
 */
export const aboutSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	contentSections: z.boolean(),
	contactSection: z.boolean(),
	featureCards: z.boolean(),
	companyInfo: z.boolean(),
	richContent: z.boolean().default(false),
});

/**
 * SEO schema
 */
export const aboutPageSeoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

/**
 * Update About Page schema
 */
export const updateAboutPageSchema = z.object({
	sectionVisibility: aboutSectionVisibilitySchema.optional(),
	hero: aboutHeroSectionSchema.optional(),
	richContent: z.string().optional(), // HTML content from text editor
	contentSections: z.array(aboutContentSectionSchema).optional(),
	contactSection: aboutContactSectionSchema.optional(),
	featureCards: z.array(aboutFeatureCardSchema).optional(),
	companyInfo: aboutCompanyInfoSchema.optional(),
	seo: aboutPageSeoSchema.optional(),
});

// Type exports
export type AboutCtaButtonInput = z.infer<typeof aboutCtaButtonSchema>;
export type AboutHeroSectionInput = z.infer<typeof aboutHeroSectionSchema>;
export type AboutContentSectionInput = z.infer<typeof aboutContentSectionSchema>;
export type AboutFeatureCardInput = z.infer<typeof aboutFeatureCardSchema>;
export type AboutContactSectionInput = z.infer<typeof aboutContactSectionSchema>;
export type AboutCompanyInfoInput = z.infer<typeof aboutCompanyInfoSchema>;
export type AboutSectionVisibilityInput = z.infer<typeof aboutSectionVisibilitySchema>;
export type AboutPageSeoInput = z.infer<typeof aboutPageSeoSchema>;
export type UpdateAboutPageInput = z.infer<typeof updateAboutPageSchema>;
