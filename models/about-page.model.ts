import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * CTA Button interface
 */
export interface ICtaButton {
	text?: string;
	href?: string;
	variant?: "primary" | "outline" | "secondary" | "ghost";
}

/**
 * Hero Section interface
 */
export interface IAboutHeroSection {
	title?: string;
	subtitle?: string;
}

/**
 * Content Section interface (for the main text sections)
 */
export interface IAboutContentSection {
	title?: string;
	content?: string; // Can contain multiple paragraphs separated by newlines
	highlighted?: boolean; // If true, shows with background
}

/**
 * Feature Card interface
 */
export interface IAboutFeatureCard {
	icon?: string; // Lucide icon name
	title?: string;
	description?: string;
	ctaText?: string;
	ctaHref?: string;
}

/**
 * Contact Section interface
 */
export interface IAboutContactSection {
	title?: string;
	description?: string;
	primaryCta?: ICtaButton;
	secondaryCta?: ICtaButton;
}

/**
 * Company Info interface
 */
export interface IAboutCompanyInfo {
	companyName?: string;
	organizationNumber?: string;
	addresses?: string[];
}

/**
 * Section Visibility interface
 */
export interface IAboutSectionVisibility {
	hero: boolean;
	contentSections: boolean;
	contactSection: boolean;
	featureCards: boolean;
	companyInfo: boolean;
	richContent: boolean;
}

/**
 * SEO Settings interface
 */
export interface IAboutPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

/**
 * AboutPage interface extending Mongoose Document
 */
export interface IAboutPage extends Document {
	_id: mongoose.Types.ObjectId;

	// Section Visibility
	sectionVisibility: IAboutSectionVisibility;

	// Hero Section
	hero: IAboutHeroSection;

	// Rich Content (HTML from text editor - optional flexible content)
	richContent?: string;

	// Content Sections (array of text sections)
	contentSections: IAboutContentSection[];

	// Contact Section
	contactSection: IAboutContactSection;

	// Feature Cards
	featureCards: IAboutFeatureCard[];

	// Company Info
	companyInfo: IAboutCompanyInfo;

	// SEO
	seo: IAboutPageSeo;

	// Timestamps
	updatedAt: Date;
	createdAt: Date;
}

/**
 * CTA Button sub-schema
 */
const CtaButtonSchema = new Schema<ICtaButton>(
	{
		text: { type: String, trim: true },
		href: { type: String, trim: true },
		variant: {
			type: String,
			enum: ["primary", "outline", "secondary", "ghost"],
			default: "primary",
		},
	},
	{ _id: false }
);

/**
 * Hero Section sub-schema
 */
const AboutHeroSectionSchema = new Schema<IAboutHeroSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Content Section sub-schema
 */
const AboutContentSectionSchema = new Schema<IAboutContentSection>(
	{
		title: { type: String, trim: true },
		content: { type: String, trim: true },
		highlighted: { type: Boolean, default: false },
	},
	{ _id: false }
);

/**
 * Feature Card sub-schema
 */
const AboutFeatureCardSchema = new Schema<IAboutFeatureCard>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ctaText: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Contact Section sub-schema
 */
const AboutContactSectionSchema = new Schema<IAboutContactSection>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		primaryCta: { type: CtaButtonSchema },
		secondaryCta: { type: CtaButtonSchema },
	},
	{ _id: false }
);

/**
 * Company Info sub-schema
 */
const AboutCompanyInfoSchema = new Schema<IAboutCompanyInfo>(
	{
		companyName: { type: String, trim: true },
		organizationNumber: { type: String, trim: true },
		addresses: [{ type: String, trim: true }],
	},
	{ _id: false }
);

/**
 * Section Visibility sub-schema
 */
const AboutSectionVisibilitySchema = new Schema<IAboutSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		contentSections: { type: Boolean, default: true },
		contactSection: { type: Boolean, default: true },
		featureCards: { type: Boolean, default: true },
		companyInfo: { type: Boolean, default: true },
		richContent: { type: Boolean, default: true },
	},
	{ _id: false }
);

/**
 * SEO sub-schema
 */
const AboutPageSeoSchema = new Schema<IAboutPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * AboutPage Schema - Singleton model
 */
const AboutPageSchema = new Schema<IAboutPage>(
	{
		sectionVisibility: {
			type: AboutSectionVisibilitySchema,
			default: {
				hero: true,
				contentSections: true,
				contactSection: true,
				featureCards: true,
				companyInfo: true,
				richContent: true,
			},
		},
		hero: {
			type: AboutHeroSectionSchema,
			default: {},
		},
		// Rich Content - HTML from text editor for flexible content
		richContent: {
			type: String,
			default: "",
		},
		contentSections: {
			type: [AboutContentSectionSchema],
			default: [],
		},
		contactSection: {
			type: AboutContactSectionSchema,
			default: {},
		},
		featureCards: {
			type: [AboutFeatureCardSchema],
			default: [],
		},
		companyInfo: {
			type: AboutCompanyInfoSchema,
			default: {},
		},
		seo: {
			type: AboutPageSeoSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "about_page",
	}
);

// Ensure virtuals are included in JSON
AboutPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

AboutPageSchema.set("toObject", { virtuals: true });

/**
 * Get AboutPage Model
 */
export const getAboutPageModel = async (): Promise<Model<IAboutPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.AboutPage as Model<IAboutPage>) ||
		mongoose.model<IAboutPage>("AboutPage", AboutPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getAboutPageModelSync(): Model<IAboutPage> {
	return (
		(mongoose.models.AboutPage as Model<IAboutPage>) ||
		mongoose.model<IAboutPage>("AboutPage", AboutPageSchema)
	);
}
