import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const kopguideSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	guideSteps: z.boolean(),
	checklist: z.boolean(),
	cta: z.boolean(),
	contactForm: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const kopguideHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
});

// ============================================================================
// GUIDE STEP
// ============================================================================
export const kopguideStepSchema = z.object({
	number: z.string().max(10).optional(),
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// GUIDE STEPS SECTION
// ============================================================================
export const kopguideStepsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	steps: z.array(kopguideStepSchema).optional(),
});

// ============================================================================
// CHECKLIST SECTION
// ============================================================================
export const kopguideChecklistSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	items: z.array(z.string().max(300)).optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const kopguideCtaSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	primaryButtonText: z.string().max(100).optional(),
	primaryButtonHref: z.string().max(500).optional(),
	secondaryButtonText: z.string().max(100).optional(),
	secondaryButtonHref: z.string().max(500).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const kopguidePageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE KOPGUIDE PAGE SCHEMA
// ============================================================================
export const updateKopguidePageSchema = z.object({
	sectionVisibility: kopguideSectionVisibilitySchema.optional(),
	hero: kopguideHeroSectionSchema.optional(),
	stepsSection: kopguideStepsSectionSchema.optional(),
	checklistSection: kopguideChecklistSectionSchema.optional(),
	ctaSection: kopguideCtaSectionSchema.optional(),
	richContent: z.string().optional(),
	seo: kopguidePageSeoSchema.optional(),
});

// Type exports
export type KopguideSectionVisibilityInput = z.infer<
	typeof kopguideSectionVisibilitySchema
>;
export type KopguideHeroSectionInput = z.infer<typeof kopguideHeroSectionSchema>;
export type KopguideStepInput = z.infer<typeof kopguideStepSchema>;
export type KopguideStepsSectionInput = z.infer<
	typeof kopguideStepsSectionSchema
>;
export type KopguideChecklistSectionInput = z.infer<
	typeof kopguideChecklistSectionSchema
>;
export type KopguideCtaSectionInput = z.infer<typeof kopguideCtaSectionSchema>;
export type KopguidePageSeoInput = z.infer<typeof kopguidePageSeoSchema>;
export type UpdateKopguidePageInput = z.infer<typeof updateKopguidePageSchema>;
