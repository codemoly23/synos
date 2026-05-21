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
 * Branding settings schema
 */
export const brandingSettingsSchema = z.object({
	logoUrl: z
		.string()
		.max(500, "Logo URL cannot exceed 500 characters")
		.optional(),
	faviconUrl: z
		.string()
		.max(500, "Favicon URL cannot exceed 500 characters")
		.optional(),
});

/**
 * Footer link schema
 */
export const footerLinkSchema = z.object({
	label: z
		.string()
		.min(1, "Link label is required")
		.max(50, "Link label cannot exceed 50 characters"),
	href: z
		.string()
		.min(1, "Link URL is required")
		.max(200, "Link URL cannot exceed 200 characters"),
	isExternal: z.boolean().default(false),
});

/**
 * Footer settings schema
 */
export const footerSettingsSchema = z.object({
	quickLinksTitle: z
		.string()
		.max(50, "Quick links title cannot exceed 50 characters")
		.optional(),
	contactTitle: z
		.string()
		.max(50, "Contact title cannot exceed 50 characters")
		.optional(),
	newsletterTitle: z
		.string()
		.max(50, "Newsletter title cannot exceed 50 characters")
		.optional(),
	quickLinks: z.array(footerLinkSchema).optional(),
	newsletterDescription: z
		.string()
		.max(300, "Newsletter description cannot exceed 300 characters")
		.optional(),
	newsletterPlaceholder: z
		.string()
		.max(50, "Newsletter placeholder cannot exceed 50 characters")
		.optional(),
	newsletterButtonText: z
		.string()
		.max(30, "Newsletter button text cannot exceed 30 characters")
		.optional(),
	bottomLinks: z.array(footerLinkSchema).optional(),
});

/**
 * Brightcall settings schema
 */
export const brightcallSettingsSchema = z.object({
	enabled: z.boolean().optional(),
	widgetKey: z
		.string()
		.max(100, "Widget key cannot exceed 100 characters")
		.optional()
		.or(z.literal("")),
	apiKey: z
		.string()
		.max(200, "API key cannot exceed 200 characters")
		.optional()
		.or(z.literal("")),
	apiBaseUrl: z
		.string()
		.max(300, "API base URL cannot exceed 300 characters")
		.optional()
		.or(z.literal("")),
});

/**
 * SMTP settings schema
 */
export const smtpSettingsSchema = z.object({
	enabled: z.boolean().optional(),
	host: z.string().max(200).optional(),
	port: z.number().int().min(1).max(65535).optional(),
	encryption: z.enum(["none", "ssl", "tls"]).optional(),
	username: z.string().max(200).optional(),
	password: z.string().max(500).optional(),
	fromName: z.string().max(100).optional(),
	fromEmail: z.string().email().optional().or(z.literal("")),
	adminNotificationEmail: z.string().email().optional().or(z.literal("")),
});

/**
 * Tracking / analytics settings schema
 */
export const trackingSettingsSchema = z.object({
	gtmId: z
		.string()
		.max(30)
		.regex(/^(GTM-[A-Z0-9]+)?$/, "Must be a valid GTM container ID (e.g. GTM-PQ42DDZ)")
		.optional()
		.or(z.literal("")),
	ga4Id: z
		.string()
		.max(30)
		.regex(/^(G-[A-Z0-9]+)?$/, "Must be a valid GA4 measurement ID (e.g. G-XXXXXXXXXX)")
		.optional()
		.or(z.literal("")),
	googleAdsId: z
		.string()
		.max(30)
		.regex(/^(AW-[0-9]+)?$/, "Must be a valid Google Ads ID (e.g. AW-123456789)")
		.optional()
		.or(z.literal("")),
	facebookPixelId: z
		.string()
		.max(30)
		.regex(/^[0-9]*$/, "Must be a numeric Facebook Pixel ID")
		.optional()
		.or(z.literal("")),
	cookiebotId: z
		.string()
		.max(40)
		.regex(
			/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/i,
			"Must be a valid Cookiebot ID (UUID format)"
		)
		.optional()
		.or(z.literal("")),
});

/**
 * Reviews settings schema
 */
export const reviewsSettingsSchema = z.object({
	recoWidgetUrl: z
		.string()
		.max(500, "Widget URL cannot exceed 500 characters")
		.optional()
		.or(z.literal("")),
	title: z
		.string()
		.max(100, "Title cannot exceed 100 characters")
		.optional(),
	subtitle: z
		.string()
		.max(300, "Subtitle cannot exceed 300 characters")
		.optional(),
	isVisible: z.boolean().optional(),
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

	// Branding
	branding: brandingSettingsSchema.partial().optional(),

	// Footer
	footer: footerSettingsSchema.partial().optional(),

	// Reviews (Reco widget)
	reviews: reviewsSettingsSchema.partial().optional(),

	// Brightcall (Convolo.ai)
	brightcall: brightcallSettingsSchema.partial().optional(),

	// SMTP email settings
	smtp: smtpSettingsSchema.partial().optional(),

	// Tracking / analytics
	tracking: trackingSettingsSchema.partial().optional(),
});

// Type exports
export type OfficeInput = z.infer<typeof officeSchema>;
export type SocialMediaInput = z.infer<typeof socialMediaSchema>;
export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;
export type BrandingSettingsInput = z.infer<typeof brandingSettingsSchema>;
export type FooterLinkInput = z.infer<typeof footerLinkSchema>;
export type FooterSettingsInput = z.infer<typeof footerSettingsSchema>;
export type ReviewsSettingsInput = z.infer<typeof reviewsSettingsSchema>;
export type BrightcallSettingsInput = z.infer<typeof brightcallSettingsSchema>;
export type SmtpSettingsInput = z.infer<typeof smtpSettingsSchema>;
export type TrackingSettingsInput = z.infer<typeof trackingSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
