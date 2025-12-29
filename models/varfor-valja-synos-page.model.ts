import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IVarforValjaSynosSectionVisibility {
	hero: boolean;
	reasons: boolean;
	benefits: boolean;
	cta: boolean;
	contactForm: boolean;
	richContent: boolean;
}

const VarforValjaSynosSectionVisibilitySchema =
	new Schema<IVarforValjaSynosSectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			reasons: { type: Boolean, default: true },
			benefits: { type: Boolean, default: true },
			cta: { type: Boolean, default: true },
			contactForm: { type: Boolean, default: true },
			richContent: { type: Boolean, default: false },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IVarforValjaSynosHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
}

const VarforValjaSynosHeroSectionSchema =
	new Schema<IVarforValjaSynosHeroSection>(
		{
			badge: { type: String, trim: true },
			title: { type: String, trim: true },
			titleHighlight: { type: String, trim: true },
			subtitle: { type: String, trim: true },
		},
		{ _id: false }
	);

// ============================================================================
// REASON CARD
// ============================================================================
export interface IVarforValjaSynosReasonCard {
	icon?: string;
	title?: string;
	description?: string;
}

const VarforValjaSynosReasonCardSchema =
	new Schema<IVarforValjaSynosReasonCard>(
		{
			icon: { type: String, trim: true },
			title: { type: String, trim: true },
			description: { type: String, trim: true },
		},
		{ _id: false }
	);

// ============================================================================
// BENEFITS SECTION
// ============================================================================
export interface IVarforValjaSynosBenefitsSection {
	title?: string;
	subtitle?: string;
	items?: string[];
}

const VarforValjaSynosBenefitsSectionSchema =
	new Schema<IVarforValjaSynosBenefitsSection>(
		{
			title: { type: String, trim: true },
			subtitle: { type: String, trim: true },
			items: { type: [String], default: [] },
		},
		{ _id: false }
	);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface IVarforValjaSynosCtaSection {
	title?: string;
	subtitle?: string;
	primaryButtonText?: string;
	primaryButtonHref?: string;
	secondaryButtonText?: string;
	secondaryButtonHref?: string;
}

const VarforValjaSynosCtaSectionSchema =
	new Schema<IVarforValjaSynosCtaSection>(
		{
			title: { type: String, trim: true },
			subtitle: { type: String, trim: true },
			primaryButtonText: { type: String, trim: true },
			primaryButtonHref: { type: String, trim: true },
			secondaryButtonText: { type: String, trim: true },
			secondaryButtonHref: { type: String, trim: true },
		},
		{ _id: false }
	);

// ============================================================================
// SEO
// ============================================================================
export interface IVarforValjaSynosPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const VarforValjaSynosPageSeoSchema = new Schema<IVarforValjaSynosPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN VARFOR VALJA SYNOS PAGE
// ============================================================================
export interface IVarforValjaSynosPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IVarforValjaSynosSectionVisibility;
	hero: IVarforValjaSynosHeroSection;
	reasons: IVarforValjaSynosReasonCard[];
	benefitsSection: IVarforValjaSynosBenefitsSection;
	ctaSection: IVarforValjaSynosCtaSection;
	richContent?: string;
	seo: IVarforValjaSynosPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const VarforValjaSynosPageSchema = new Schema<IVarforValjaSynosPage>(
	{
		sectionVisibility: {
			type: VarforValjaSynosSectionVisibilitySchema,
			default: {
				hero: true,
				reasons: true,
				benefits: true,
				cta: true,
				contactForm: true,
				richContent: false,
			},
		},
		hero: { type: VarforValjaSynosHeroSectionSchema, default: {} },
		reasons: { type: [VarforValjaSynosReasonCardSchema], default: [] },
		benefitsSection: {
			type: VarforValjaSynosBenefitsSectionSchema,
			default: {},
		},
		ctaSection: { type: VarforValjaSynosCtaSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: VarforValjaSynosPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "varfor_valja_synos_page",
	}
);

// Ensure virtuals are included in JSON
VarforValjaSynosPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

VarforValjaSynosPageSchema.set("toObject", { virtuals: true });

/**
 * Get VarforValjaSynosPage Model
 */
export const getVarforValjaSynosPageModel =
	async (): Promise<Model<IVarforValjaSynosPage>> => {
		await connectMongoose();

		return (
			(mongoose.models.VarforValjaSynosPage as Model<IVarforValjaSynosPage>) ||
			mongoose.model<IVarforValjaSynosPage>(
				"VarforValjaSynosPage",
				VarforValjaSynosPageSchema
			)
		);
	};

/**
 * Export synchronous model getter for use in repositories
 */
export function getVarforValjaSynosPageModelSync(): Model<IVarforValjaSynosPage> {
	return (
		(mongoose.models.VarforValjaSynosPage as Model<IVarforValjaSynosPage>) ||
		mongoose.model<IVarforValjaSynosPage>(
			"VarforValjaSynosPage",
			VarforValjaSynosPageSchema
		)
	);
}
