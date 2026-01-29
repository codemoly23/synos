import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface ILegalSectionVisibility {
	hero: boolean;
	legalCards: boolean;
	companyInfo: boolean;
	terms: boolean;
	gdprRights: boolean;
	cta: boolean;
}

const LegalSectionVisibilitySchema = new Schema<ILegalSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		legalCards: { type: Boolean, default: true },
		companyInfo: { type: Boolean, default: true },
		terms: { type: Boolean, default: true },
		gdprRights: { type: Boolean, default: true },
		cta: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ILegalHeroSection {
	badge?: string;
	title?: string;
	subtitle?: string;
}

const LegalHeroSectionSchema = new Schema<ILegalHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// LEGAL CARD
// ============================================================================
export interface ILegalCard {
	icon?: string;
	title?: string;
	description?: string;
	href?: string;
	highlights?: string[];
}

const LegalCardSchema = new Schema<ILegalCard>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		href: { type: String, trim: true },
		highlights: [{ type: String, trim: true }],
	},
	{ _id: false }
);

// ============================================================================
// COMPANY INFO
// ============================================================================
export interface ILegalOfficeAddress {
	name?: string;
	address?: string;
}

const LegalOfficeAddressSchema = new Schema<ILegalOfficeAddress>(
	{
		name: { type: String, trim: true },
		address: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalCompanyInfo {
	companyName?: string;
	organizationNumber?: string;
	vatNumber?: string;
	registeredSeat?: string;
	offices?: ILegalOfficeAddress[];
	email?: string;
	phone?: string;
}

const LegalCompanyInfoSchema = new Schema<ILegalCompanyInfo>(
	{
		companyName: { type: String, trim: true },
		organizationNumber: { type: String, trim: true },
		vatNumber: { type: String, trim: true },
		registeredSeat: { type: String, trim: true },
		offices: { type: [LegalOfficeAddressSchema], default: [] },
		email: { type: String, trim: true },
		phone: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// TERMS SECTION
// ============================================================================
export interface ILegalTerm {
	title?: string;
	content?: string;
}

const LegalTermSchema = new Schema<ILegalTerm>(
	{
		title: { type: String, trim: true },
		content: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalTermsSection {
	title?: string;
	terms?: ILegalTerm[];
}

const LegalTermsSectionSchema = new Schema<ILegalTermsSection>(
	{
		title: { type: String, trim: true },
		terms: { type: [LegalTermSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// GDPR RIGHTS SECTION
// ============================================================================
export interface ILegalGdprRight {
	title?: string;
	description?: string;
}

const LegalGdprRightSchema = new Schema<ILegalGdprRight>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalGdprSection {
	title?: string;
	rights?: ILegalGdprRight[];
	primaryCta?: {
		text?: string;
		href?: string;
	};
	secondaryCta?: {
		text?: string;
		href?: string;
	};
}

const LegalGdprSectionSchema = new Schema<ILegalGdprSection>(
	{
		title: { type: String, trim: true },
		rights: { type: [LegalGdprRightSchema], default: [] },
		primaryCta: {
			type: new Schema(
				{
					text: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		secondaryCta: {
			type: new Schema(
				{
					text: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
	},
	{ _id: false }
);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface ILegalCtaSection {
	text?: string;
	primaryCta?: {
		text?: string;
		href?: string;
	};
	secondaryCta?: {
		text?: string;
		href?: string;
	};
}

const LegalCtaSectionSchema = new Schema<ILegalCtaSection>(
	{
		text: { type: String, trim: true },
		primaryCta: {
			type: new Schema(
				{
					text: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		secondaryCta: {
			type: new Schema(
				{
					text: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
	},
	{ _id: false }
);

// ============================================================================
// FEATURED IMAGE
// ============================================================================
export interface ILegalFeaturedImage {
	url?: string;
	mobileUrl?: string;
	alt?: string;
}

const LegalFeaturedImageSchema = new Schema<ILegalFeaturedImage>(
	{
		url: { type: String, trim: true },
		mobileUrl: { type: String, trim: true },
		alt: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// STATS SECTION (Purus Est Efficitur Laoreet)
// ============================================================================
export interface ILegalStat {
	value?: string;
	label?: string;
}

const LegalStatSchema = new Schema<ILegalStat>(
	{
		value: { type: String, trim: true },
		label: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalStatsSection {
	image?: { url?: string; mobileUrl?: string; alt?: string };
	title?: string;
	description?: string;
	stats?: ILegalStat[];
	bottomText?: string;
}

const LegalStatsSectionSchema = new Schema<ILegalStatsSection>(
	{
		image: {
			type: new Schema(
				{
					url: { type: String, trim: true },
					mobileUrl: { type: String, trim: true },
					alt: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		stats: { type: [LegalStatSchema], default: [] },
		bottomText: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// FEATURES SECTION (Arcu Dignissim Velit Aliquam)
// ============================================================================
export interface ILegalFeature {
	icon?: string;
	title?: string;
	description?: string;
}

const LegalFeatureSchema = new Schema<ILegalFeature>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalFeaturesSection {
	title?: string;
	description?: string;
	features?: ILegalFeature[];
	image?: { url?: string; mobileUrl?: string; alt?: string };
	bottomText?: string;
}

const LegalFeaturesSectionSchema = new Schema<ILegalFeaturesSection>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		features: { type: [LegalFeatureSchema], default: [] },
		image: {
			type: new Schema(
				{
					url: { type: String, trim: true },
					mobileUrl: { type: String, trim: true },
					alt: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		bottomText: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// VIDEO SECTION
// ============================================================================
export interface ILegalVideoSection {
	thumbnail?: { url?: string; alt?: string };
	videoUrl?: string;
	bottomText?: string;
}

const LegalVideoSectionSchema = new Schema<ILegalVideoSection>(
	{
		thumbnail: {
			type: new Schema(
				{
					url: { type: String, trim: true },
					alt: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		videoUrl: { type: String, trim: true },
		bottomText: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface ILegalPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const LegalPageSeoSchema = new Schema<ILegalPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN LEGAL PAGE
// ============================================================================
export interface ILegalPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: ILegalSectionVisibility;
	hero: ILegalHeroSection;
	featuredImage?: ILegalFeaturedImage;
	statsSection?: ILegalStatsSection;
	featuresSection?: ILegalFeaturesSection;
	videoSection?: ILegalVideoSection;
	legalCards: ILegalCard[];
	companyInfo: ILegalCompanyInfo;
	termsSection: ILegalTermsSection;
	gdprSection: ILegalGdprSection;
	ctaSection: ILegalCtaSection;
	seo: ILegalPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const LegalPageSchema = new Schema<ILegalPage>(
	{
		sectionVisibility: {
			type: LegalSectionVisibilitySchema,
			default: {
				hero: true,
				legalCards: true,
				companyInfo: true,
				terms: true,
				gdprRights: true,
				cta: true,
			},
		},
		hero: { type: LegalHeroSectionSchema, default: {} },
		featuredImage: { type: LegalFeaturedImageSchema },
		statsSection: { type: LegalStatsSectionSchema },
		featuresSection: { type: LegalFeaturesSectionSchema },
		videoSection: { type: LegalVideoSectionSchema },
		legalCards: { type: [LegalCardSchema], default: [] },
		companyInfo: { type: LegalCompanyInfoSchema, default: {} },
		termsSection: { type: LegalTermsSectionSchema, default: {} },
		gdprSection: { type: LegalGdprSectionSchema, default: {} },
		ctaSection: { type: LegalCtaSectionSchema, default: {} },
		seo: { type: LegalPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "legal_page",
	}
);

// Ensure virtuals are included in JSON
LegalPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

LegalPageSchema.set("toObject", { virtuals: true });

/**
 * Get LegalPage Model
 */
export const getLegalPageModel = async (): Promise<Model<ILegalPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.LegalPage as Model<ILegalPage>) ||
		mongoose.model<ILegalPage>("LegalPage", LegalPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Delete cached model in development to pick up schema changes
 */
export function getLegalPageModelSync(): Model<ILegalPage> {
	// In development, delete cached model to ensure schema changes are picked up
	if (process.env.NODE_ENV === "development" && mongoose.models.LegalPage) {
		delete mongoose.models.LegalPage;
	}
	return (
		(mongoose.models.LegalPage as Model<ILegalPage>) ||
		mongoose.model<ILegalPage>("LegalPage", LegalPageSchema)
	);
}
