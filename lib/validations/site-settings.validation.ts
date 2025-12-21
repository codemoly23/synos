import { z } from "zod";

/**
 * Optional URL validation
 */
const optionalUrlSchema = z.string().url().optional().or(z.literal(""));

/**
 * Office schema
 */
export const officeSchema = z.object({
	name: z
		.string()
		.min(1, "Office name is required")
		.max(100, "Office name cannot exceed 100 characters"),
	street: z
		.string()
		.min(1, "Street address is required")
		.max(200, "Street address cannot exceed 200 characters"),
	postalCode: z
		.string()
		.min(1, "Postal code is required")
		.max(20, "Postal code cannot exceed 20 characters"),
	city: z
		.string()
		.min(1, "City is required")
		.max(100, "City cannot exceed 100 characters"),
	country: z.string().max(100).default("Sverige"),
	isHeadquarters: z.boolean().default(false),
	isVisible: z.boolean().default(true),
	mapEmbedUrl: z.string().optional(),
});

/**
 * Social media schema
 */
export const socialMediaSchema = z.object({
	facebook: optionalUrlSchema,
	instagram: optionalUrlSchema,
	linkedin: optionalUrlSchema,
	twitter: optionalUrlSchema,
	youtube: optionalUrlSchema,
});

/**
 * SEO settings schema
 */
export const seoSettingsSchema = z.object({
	siteName: z
		.string()
		.min(1, "Site name is required")
		.max(100, "Site name cannot exceed 100 characters"),
	siteDescription: z
		.string()
		.max(500, "Site description cannot exceed 500 characters")
		.optional(),
	ogImage: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	twitterHandle: z
		.string()
		.max(50, "Twitter handle cannot exceed 50 characters")
		.optional(),
});

/**
 * Update site settings schema
 */
export const updateSiteSettingsSchema = z.object({
	// Company info
	companyName: z
		.string()
		.min(1, "Company name is required")
		.max(200, "Company name cannot exceed 200 characters")
		.optional(),
	orgNumber: z
		.string()
		.min(1, "Organization number is required")
		.max(50, "Organization number cannot exceed 50 characters")
		.optional(),
	vatNumber: z.string().max(50, "VAT number cannot exceed 50 characters").optional(),

	// Contact info
	phone: z
		.string()
		.min(1, "Phone number is required")
		.max(50, "Phone number cannot exceed 50 characters")
		.optional(),
	email: z
		.string()
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),
	noreplyEmail: z
		.string()
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),

	// Offices
	offices: z.array(officeSchema).optional(),

	// Social media
	socialMedia: socialMediaSchema.partial().optional(),

	// SEO
	seo: seoSettingsSchema.partial().optional(),
});

// Type exports
export type OfficeInput = z.infer<typeof officeSchema>;
export type SocialMediaInput = z.infer<typeof socialMediaSchema>;
export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
