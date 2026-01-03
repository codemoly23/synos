import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const aboutSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	mission: z.boolean(),
	stats: z.boolean(),
	imageGallery: z.boolean(),
	faq: z.boolean(),
	testimonials: z.boolean(),
	partners: z.boolean(),
	cta: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const aboutHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
});

// ============================================================================
// MISSION SECTION
// ============================================================================
export const aboutFeatureSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
});

export const aboutMissionSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(2000).optional(),
	image: z.string().optional(),
	features: z.array(aboutFeatureSchema).optional(),
});

// ============================================================================
// STATS SECTION
// ============================================================================
export const aboutStatSchema = z.object({
	value: z.string().max(20).optional(),
	label: z.string().max(100).optional(),
	suffix: z.string().max(10).optional(),
});

// ============================================================================
// IMAGE GALLERY SECTION
// ============================================================================
export const aboutGalleryImageSchema = z.object({
	src: z.string().optional(),
	alt: z.string().max(200).optional(),
});

export const aboutImageGallerySectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	images: z.array(aboutGalleryImageSchema).optional(),
});

// ============================================================================
// FAQ SECTION
// ============================================================================
export const aboutFaqItemSchema = z.object({
	question: z.string().max(300).optional(),
	answer: z.string().max(2000).optional(),
});

export const aboutFaqSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	items: z.array(aboutFaqItemSchema).optional(),
});

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
export const aboutTestimonialSchema = z.object({
	quote: z.string().max(1000).optional(),
	author: z.string().max(100).optional(),
	role: z.string().max(100).optional(),
	company: z.string().max(100).optional(),
	image: z.string().optional(),
	rating: z.number().min(1).max(5).optional(),
});

export const aboutTestimonialsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	testimonials: z.array(aboutTestimonialSchema).optional(),
});

// ============================================================================
// PARTNERS SECTION
// ============================================================================
export const aboutPartnerSchema = z.object({
	name: z.string().max(100).optional(),
	logo: z.string().optional(),
	url: z.string().optional(),
});

export const aboutPartnersSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	partners: z.array(aboutPartnerSchema).optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const aboutCtaButtonSchema = z.object({
	text: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

export const aboutCtaSectionSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	primaryCta: aboutCtaButtonSchema.optional(),
	secondaryCta: aboutCtaButtonSchema.optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const aboutPageSeoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateAboutPageSchema = z.object({
	sectionVisibility: aboutSectionVisibilitySchema.optional(),
	hero: aboutHeroSectionSchema.optional(),
	mission: aboutMissionSectionSchema.optional(),
	stats: z.array(aboutStatSchema).optional(),
	imageGallery: aboutImageGallerySectionSchema.optional(),
	faq: aboutFaqSectionSchema.optional(),
	testimonials: aboutTestimonialsSectionSchema.optional(),
	partners: aboutPartnersSectionSchema.optional(),
	cta: aboutCtaSectionSchema.optional(),
	seo: aboutPageSeoSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type AboutSectionVisibilityInput = z.infer<typeof aboutSectionVisibilitySchema>;
export type AboutHeroSectionInput = z.infer<typeof aboutHeroSectionSchema>;
export type AboutFeatureInput = z.infer<typeof aboutFeatureSchema>;
export type AboutMissionSectionInput = z.infer<typeof aboutMissionSectionSchema>;
export type AboutStatInput = z.infer<typeof aboutStatSchema>;
export type AboutGalleryImageInput = z.infer<typeof aboutGalleryImageSchema>;
export type AboutImageGallerySectionInput = z.infer<typeof aboutImageGallerySectionSchema>;
export type AboutFaqItemInput = z.infer<typeof aboutFaqItemSchema>;
export type AboutFaqSectionInput = z.infer<typeof aboutFaqSectionSchema>;
export type AboutTestimonialInput = z.infer<typeof aboutTestimonialSchema>;
export type AboutTestimonialsSectionInput = z.infer<typeof aboutTestimonialsSectionSchema>;
export type AboutPartnerInput = z.infer<typeof aboutPartnerSchema>;
export type AboutPartnersSectionInput = z.infer<typeof aboutPartnersSectionSchema>;
export type AboutCtaButtonInput = z.infer<typeof aboutCtaButtonSchema>;
export type AboutCtaSectionInput = z.infer<typeof aboutCtaSectionSchema>;
export type AboutPageSeoInput = z.infer<typeof aboutPageSeoSchema>;
export type UpdateAboutPageInput = z.infer<typeof updateAboutPageSchema>;
