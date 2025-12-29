import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const miniutbildningSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	benefits: z.boolean(),
	learnings: z.boolean(),
	process: z.boolean(),
	contactForm: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const miniutbildningHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
	buttonText: z.string().max(100).optional(),
	buttonHref: z.string().max(500).optional(),
});

// ============================================================================
// BENEFIT CARD
// ============================================================================
export const miniutbildningBenefitCardSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// LEARNINGS SECTION
// ============================================================================
export const miniutbildningLearningSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	items: z.array(z.string().max(300)).optional(),
});

// ============================================================================
// PROCESS STEP
// ============================================================================
export const miniutbildningProcessStepSchema = z.object({
	number: z.string().max(10).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// PROCESS SECTION
// ============================================================================
export const miniutbildningProcessSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	steps: z.array(miniutbildningProcessStepSchema).optional(),
	highlightTitle: z.string().max(200).optional(),
	highlightSubtitle: z.string().max(500).optional(),
	highlightButtonText: z.string().max(100).optional(),
	highlightButtonHref: z.string().max(500).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const miniutbildningPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE MINIUTBILDNING PAGE SCHEMA
// ============================================================================
export const updateMiniutbildningPageSchema = z.object({
	sectionVisibility: miniutbildningSectionVisibilitySchema.optional(),
	hero: miniutbildningHeroSectionSchema.optional(),
	benefits: z.array(miniutbildningBenefitCardSchema).optional(),
	learningsSection: miniutbildningLearningSectionSchema.optional(),
	processSection: miniutbildningProcessSectionSchema.optional(),
	richContent: z.string().optional(),
	seo: miniutbildningPageSeoSchema.optional(),
});

// Type exports
export type MiniutbildningSectionVisibilityInput = z.infer<
	typeof miniutbildningSectionVisibilitySchema
>;
export type MiniutbildningHeroSectionInput = z.infer<
	typeof miniutbildningHeroSectionSchema
>;
export type MiniutbildningBenefitCardInput = z.infer<
	typeof miniutbildningBenefitCardSchema
>;
export type MiniutbildningLearningSectionInput = z.infer<
	typeof miniutbildningLearningSectionSchema
>;
export type MiniutbildningProcessStepInput = z.infer<
	typeof miniutbildningProcessStepSchema
>;
export type MiniutbildningProcessSectionInput = z.infer<
	typeof miniutbildningProcessSectionSchema
>;
export type MiniutbildningPageSeoInput = z.infer<
	typeof miniutbildningPageSeoSchema
>;
export type UpdateMiniutbildningPageInput = z.infer<
	typeof updateMiniutbildningPageSchema
>;
