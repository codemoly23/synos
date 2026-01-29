import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const legalSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	legalCards: z.boolean(),
	companyInfo: z.boolean(),
	terms: z.boolean(),
	gdprRights: z.boolean(),
	cta: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const legalHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
});

// ============================================================================
// LEGAL CARD
// ============================================================================
export const legalCardSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	href: z.string().max(500).optional(),
	highlights: z.array(z.string().max(200)).optional(),
});

// ============================================================================
// OFFICE ADDRESS
// ============================================================================
export const legalOfficeAddressSchema = z.object({
	name: z.string().max(200).optional(),
	address: z.string().max(500).optional(),
});

// ============================================================================
// COMPANY INFO
// ============================================================================
export const legalCompanyInfoSchema = z.object({
	companyName: z.string().max(200).optional(),
	organizationNumber: z.string().max(50).optional(),
	vatNumber: z.string().max(50).optional(),
	registeredSeat: z.string().max(200).optional(),
	offices: z.array(legalOfficeAddressSchema).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
	phone: z.string().max(50).optional(),
});

// ============================================================================
// TERM
// ============================================================================
export const legalTermSchema = z.object({
	title: z.string().max(200).optional(),
	content: z.string().max(5000).optional(),
});

// ============================================================================
// TERMS SECTION
// ============================================================================
export const legalTermsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	terms: z.array(legalTermSchema).optional(),
});

// ============================================================================
// GDPR RIGHT
// ============================================================================
export const legalGdprRightSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// CTA BUTTON
// ============================================================================
export const legalCtaButtonSchema = z.object({
	text: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

// ============================================================================
// GDPR SECTION
// ============================================================================
export const legalGdprSectionSchema = z.object({
	title: z.string().max(200).optional(),
	rights: z.array(legalGdprRightSchema).optional(),
	primaryCta: legalCtaButtonSchema.optional(),
	secondaryCta: legalCtaButtonSchema.optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const legalCtaSectionSchema = z.object({
	text: z.string().max(500).optional(),
	primaryCta: legalCtaButtonSchema.optional(),
	secondaryCta: legalCtaButtonSchema.optional(),
});

// ============================================================================
// FEATURED IMAGE
// ============================================================================
export const legalFeaturedImageSchema = z.object({
	url: z.string().max(500).optional(),
	mobileUrl: z.string().max(500).optional(),
	alt: z.string().max(200).optional(),
});

// ============================================================================
// IMAGE SCHEMA (reusable)
// ============================================================================
export const legalImageSchema = z.object({
	url: z.string().max(500).optional(),
	mobileUrl: z.string().max(500).optional(),
	alt: z.string().max(200).optional(),
});

// ============================================================================
// STAT (for Stats Section)
// ============================================================================
export const legalStatSchema = z.object({
	value: z.string().max(50).optional(),
	label: z.string().max(200).optional(),
});

// ============================================================================
// STATS SECTION (Purus Est Efficitur Laoreet)
// ============================================================================
export const legalStatsSectionSchema = z.object({
	image: legalImageSchema.optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	stats: z.array(legalStatSchema).optional(),
	bottomText: z.string().max(500).optional(),
});

// ============================================================================
// FEATURE (for Features Section)
// ============================================================================
export const legalFeatureSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// FEATURES SECTION (Arcu Dignissim Velit Aliquam)
// ============================================================================
export const legalFeaturesSectionSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	features: z.array(legalFeatureSchema).optional(),
	image: legalImageSchema.optional(),
	bottomText: z.string().max(500).optional(),
});

// ============================================================================
// VIDEO SECTION
// ============================================================================
export const legalVideoSectionSchema = z.object({
	thumbnail: legalImageSchema.optional(),
	videoUrl: z.string().max(500).optional(),
	bottomText: z.string().max(500).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const legalPageSeoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

// ============================================================================
// UPDATE LEGAL PAGE SCHEMA
// ============================================================================
export const updateLegalPageSchema = z.object({
	sectionVisibility: legalSectionVisibilitySchema.optional(),
	hero: legalHeroSectionSchema.optional(),
	featuredImage: legalFeaturedImageSchema.optional(),
	statsSection: legalStatsSectionSchema.optional(),
	featuresSection: legalFeaturesSectionSchema.optional(),
	videoSection: legalVideoSectionSchema.optional(),
	legalCards: z.array(legalCardSchema).optional(),
	companyInfo: legalCompanyInfoSchema.optional(),
	termsSection: legalTermsSectionSchema.optional(),
	gdprSection: legalGdprSectionSchema.optional(),
	ctaSection: legalCtaSectionSchema.optional(),
	seo: legalPageSeoSchema.optional(),
});

// Type exports
export type LegalSectionVisibilityInput = z.infer<typeof legalSectionVisibilitySchema>;
export type LegalHeroSectionInput = z.infer<typeof legalHeroSectionSchema>;
export type LegalCardInput = z.infer<typeof legalCardSchema>;
export type LegalOfficeAddressInput = z.infer<typeof legalOfficeAddressSchema>;
export type LegalCompanyInfoInput = z.infer<typeof legalCompanyInfoSchema>;
export type LegalTermInput = z.infer<typeof legalTermSchema>;
export type LegalTermsSectionInput = z.infer<typeof legalTermsSectionSchema>;
export type LegalGdprRightInput = z.infer<typeof legalGdprRightSchema>;
export type LegalGdprSectionInput = z.infer<typeof legalGdprSectionSchema>;
export type LegalCtaSectionInput = z.infer<typeof legalCtaSectionSchema>;
export type LegalFeaturedImageInput = z.infer<typeof legalFeaturedImageSchema>;
export type LegalImageInput = z.infer<typeof legalImageSchema>;
export type LegalStatInput = z.infer<typeof legalStatSchema>;
export type LegalStatsSectionInput = z.infer<typeof legalStatsSectionSchema>;
export type LegalFeatureInput = z.infer<typeof legalFeatureSchema>;
export type LegalFeaturesSectionInput = z.infer<typeof legalFeaturesSectionSchema>;
export type LegalVideoSectionInput = z.infer<typeof legalVideoSectionSchema>;
export type LegalPageSeoInput = z.infer<typeof legalPageSeoSchema>;
export type UpdateLegalPageInput = z.infer<typeof updateLegalPageSchema>;
