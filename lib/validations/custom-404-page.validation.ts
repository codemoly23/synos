import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const custom404SectionVisibilitySchema = z.object({
	hero: z.boolean(),
	suggestedPages: z.boolean(),
	cta: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const custom404HeroSchema = z.object({
	title: z.string().max(50).optional(),
	subtitle: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	backgroundImage: z.string().max(500).optional(),
	backgroundStyle: z.enum(["gradient", "solid", "image"]).optional(),
	backgroundColor: z.string().max(20).optional(),
});

// ============================================================================
// SUGGESTED PAGE
// ============================================================================
export const custom404SuggestedPageSchema = z.object({
	label: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
	description: z.string().max(300).optional(),
	icon: z.string().max(50).optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const custom404CtaSchema = z.object({
	primaryButtonText: z.string().max(100).optional(),
	primaryButtonHref: z.string().max(500).optional(),
	secondaryButtonText: z.string().max(100).optional(),
	secondaryButtonHref: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateCustom404PageSchema = z.object({
	sectionVisibility: custom404SectionVisibilitySchema.optional(),
	hero: custom404HeroSchema.optional(),
	suggestedPages: z.array(custom404SuggestedPageSchema).optional(),
	cta: custom404CtaSchema.optional(),
});

// Type exports
export type UpdateCustom404PageInput = z.infer<
	typeof updateCustom404PageSchema
>;
