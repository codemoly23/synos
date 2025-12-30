import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Office address interface
 */
export interface IOffice {
	name: string; // "Stockholm", "Linköping"
	street: string; // "Turebergsvägen 5"
	postalCode: string; // "191 47"
	city: string; // "Sollentuna"
	country: string; // "Sverige"
	isHeadquarters: boolean;
	isVisible: boolean; // Show/hide office on frontend
	// Google Maps embed URL - user-friendly input
	mapEmbedUrl?: string;
}

/**
 * Social media links interface
 */
export interface ISocialMedia {
	facebook?: string;
	instagram?: string;
	linkedin?: string;
	twitter?: string;
	youtube?: string;
}

/**
 * SEO settings interface
 */
export interface ISeoSettings {
	siteName: string; // "Synos Medical"
	siteDescription: string; // Default meta description
	ogImage?: string; // Default OG image URL
	keywords?: string[]; // Default keywords
	twitterHandle?: string; // @synosmedical
}

/**
 * Branding settings interface
 */
export interface IBrandingSettings {
	logoUrl: string; // "/storage/synos-logo-beige-glow.svg"
	faviconUrl?: string; // "/storage/favicon.ico"
}

/**
 * Footer link interface
 */
export interface IFooterLink {
	label: string;
	href: string;
	isExternal?: boolean;
}

/**
 * Footer settings interface
 */
export interface IFooterSettings {
	quickLinksTitle: string; // "Snabblänkar"
	contactTitle: string; // "Kontakta oss"
	newsletterTitle: string; // "Håll dig uppdaterad"
	quickLinks: IFooterLink[];
	newsletterDescription: string;
	newsletterPlaceholder: string; // "Din e-postadress"
	newsletterButtonText: string; // "Prenumerera"
	bottomLinks: IFooterLink[];
}

/**
 * SiteSettings interface extending Mongoose Document
 * Singleton model for site-wide configuration
 */
export interface ISiteSettings extends Document {
	_id: mongoose.Types.ObjectId;

	// Company Information
	companyName: string; // "Synos Medical AB"
	orgNumber: string; // "556871-8075"
	vatNumber?: string; // "SE556871807501"

	// Contact Information
	phone: string; // "010-205 15 01"
	email: string; // "info@synos.se"
	noreplyEmail?: string; // "noreply@synos.se"

	// Office Locations
	offices: IOffice[];

	// Social Media
	socialMedia: ISocialMedia;

	// SEO Defaults
	seo: ISeoSettings;

	// Branding (logo, favicon)
	branding: IBrandingSettings;

	// Footer settings
	footer: IFooterSettings;

	// Timestamps
	updatedAt: Date;
	createdAt: Date;
}

/**
 * Office sub-schema
 */
const OfficeSchema = new Schema<IOffice>(
	{
		name: {
			type: String,
			required: [true, "Office name is required"],
			trim: true,
		},
		street: {
			type: String,
			required: [true, "Street address is required"],
			trim: true,
		},
		postalCode: {
			type: String,
			required: [true, "Postal code is required"],
			trim: true,
		},
		city: {
			type: String,
			required: [true, "City is required"],
			trim: true,
		},
		country: {
			type: String,
			default: "Sverige",
			trim: true,
		},
		isHeadquarters: {
			type: Boolean,
			default: false,
		},
		isVisible: {
			type: Boolean,
			default: true,
		},
		mapEmbedUrl: {
			type: String,
			trim: true,
		},
	},
	{ _id: false }
);

/**
 * Social Media sub-schema
 */
const SocialMediaSchema = new Schema<ISocialMedia>(
	{
		facebook: { type: String, trim: true },
		instagram: { type: String, trim: true },
		linkedin: { type: String, trim: true },
		twitter: { type: String, trim: true },
		youtube: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * SEO sub-schema
 */
const SeoSettingsSchema = new Schema<ISeoSettings>(
	{
		siteName: {
			type: String,
			required: [true, "Site name is required"],
			trim: true,
			default: "Synos Medical",
		},
		siteDescription: {
			type: String,
			trim: true,
			default:
				"Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.",
		},
		ogImage: { type: String, trim: true },
		keywords: [{ type: String, trim: true }],
		twitterHandle: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Branding sub-schema
 */
const BrandingSettingsSchema = new Schema<IBrandingSettings>(
	{
		logoUrl: {
			type: String,
			trim: true,
			default: "/storage/synos-logo-beige-glow.svg",
		},
		faviconUrl: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Footer link sub-schema
 */
const FooterLinkSchema = new Schema<IFooterLink>(
	{
		label: {
			type: String,
			required: [true, "Link label is required"],
			trim: true,
		},
		href: {
			type: String,
			required: [true, "Link URL is required"],
			trim: true,
		},
		isExternal: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

/**
 * Footer settings sub-schema
 */
const FooterSettingsSchema = new Schema<IFooterSettings>(
	{
		quickLinksTitle: {
			type: String,
			trim: true,
			default: "Snabblänkar",
		},
		contactTitle: {
			type: String,
			trim: true,
			default: "Kontakta oss",
		},
		newsletterTitle: {
			type: String,
			trim: true,
			default: "Håll dig uppdaterad",
		},
		quickLinks: {
			type: [FooterLinkSchema],
			default: [
				{ label: "Om oss", href: "/om-oss" },
				{ label: "Produkter", href: "/produkter" },
				{ label: "Tjänster", href: "/service" },
				{ label: "Utbildningar", href: "/utbildningar" },
				{ label: "Nyheter", href: "/nyheter" },
				{ label: "Kontakt", href: "/kontakt" },
			],
		},
		newsletterDescription: {
			type: String,
			trim: true,
			default:
				"Prenumerera på vårt nyhetsbrev för de senaste produktuppdateringarna och branschnyheter.",
		},
		newsletterPlaceholder: {
			type: String,
			trim: true,
			default: "Din e-postadress",
		},
		newsletterButtonText: {
			type: String,
			trim: true,
			default: "Prenumerera",
		},
		bottomLinks: {
			type: [FooterLinkSchema],
			default: [
				{ label: "Integritetspolicy", href: "/integritetspolicy" },
				{ label: "Villkor", href: "/villkor" },
				{ label: "Sitemap", href: "/sitemap.xml" },
			],
		},
	},
	{ _id: false }
);

/**
 * SiteSettings Schema
 * Singleton model - only one document should exist
 */
const SiteSettingsSchema = new Schema<ISiteSettings>(
	{
		companyName: {
			type: String,
			required: [true, "Company name is required"],
			trim: true,
			default: "Synos Medical AB",
		},
		orgNumber: {
			type: String,
			required: [true, "Organization number is required"],
			trim: true,
			default: "556871-8075",
		},
		vatNumber: {
			type: String,
			trim: true,
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			trim: true,
			default: "010-205 15 01",
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			default: "info@synos.se",
		},
		noreplyEmail: {
			type: String,
			trim: true,
			lowercase: true,
		},
		offices: {
			type: [OfficeSchema],
			default: [
				{
					name: "Stockholm",
					street: "Turebergsvägen 5",
					postalCode: "191 47",
					city: "Sollentuna",
					country: "Sverige",
					isHeadquarters: true,
					isVisible: true,
				},
				{
					name: "Linköping",
					street: "Datalinjen 5",
					postalCode: "583 30",
					city: "Linköping",
					country: "Sverige",
					isHeadquarters: false,
					isVisible: true,
				},
			],
		},
		socialMedia: {
			type: SocialMediaSchema,
			default: {
				facebook: "https://www.facebook.com/synosmedical",
				instagram: "https://www.instagram.com/synosmedical",
				linkedin: "https://www.linkedin.com/company/synos-medical",
			},
		},
		seo: {
			type: SeoSettingsSchema,
			default: {
				siteName: "Synos Medical",
				siteDescription:
					"Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.",
			},
		},
		branding: {
			type: BrandingSettingsSchema,
			default: {
				logoUrl: "/storage/synos-logo-beige-glow.svg",
			},
		},
		footer: {
			type: FooterSettingsSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "site_settings",
	}
);

// Ensure virtuals are included in JSON
SiteSettingsSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

SiteSettingsSchema.set("toObject", { virtuals: true });

/**
 * Get SiteSettings Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getSiteSettingsModel = async (): Promise<Model<ISiteSettings>> => {
	await connectMongoose();

	return (
		(mongoose.models.SiteSettings as Model<ISiteSettings>) ||
		mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getSiteSettingsModelSync(): Model<ISiteSettings> {
	return (
		(mongoose.models.SiteSettings as Model<ISiteSettings>) ||
		mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema)
	);
}
