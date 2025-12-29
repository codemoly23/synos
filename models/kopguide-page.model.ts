import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IKopguideSectionVisibility {
	hero: boolean;
	guideSteps: boolean;
	checklist: boolean;
	cta: boolean;
	contactForm: boolean;
	richContent: boolean;
}

const KopguideSectionVisibilitySchema =
	new Schema<IKopguideSectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			guideSteps: { type: Boolean, default: true },
			checklist: { type: Boolean, default: true },
			cta: { type: Boolean, default: true },
			contactForm: { type: Boolean, default: true },
			richContent: { type: Boolean, default: false },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IKopguideHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
}

const KopguideHeroSectionSchema = new Schema<IKopguideHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// GUIDE STEP
// ============================================================================
export interface IKopguideStep {
	number?: string;
	icon?: string;
	title?: string;
	description?: string;
}

const KopguideStepSchema = new Schema<IKopguideStep>(
	{
		number: { type: String, trim: true },
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// GUIDE STEPS SECTION
// ============================================================================
export interface IKopguideStepsSection {
	title?: string;
	subtitle?: string;
	steps?: IKopguideStep[];
}

const KopguideStepsSectionSchema = new Schema<IKopguideStepsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		steps: { type: [KopguideStepSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CHECKLIST SECTION
// ============================================================================
export interface IKopguideChecklistSection {
	title?: string;
	subtitle?: string;
	items?: string[];
}

const KopguideChecklistSectionSchema = new Schema<IKopguideChecklistSection>(
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
export interface IKopguideCtaSection {
	title?: string;
	subtitle?: string;
	primaryButtonText?: string;
	primaryButtonHref?: string;
	secondaryButtonText?: string;
	secondaryButtonHref?: string;
}

const KopguideCtaSectionSchema = new Schema<IKopguideCtaSection>(
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
export interface IKopguidePageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const KopguidePageSeoSchema = new Schema<IKopguidePageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN KOPGUIDE PAGE
// ============================================================================
export interface IKopguidePage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IKopguideSectionVisibility;
	hero: IKopguideHeroSection;
	stepsSection: IKopguideStepsSection;
	checklistSection: IKopguideChecklistSection;
	ctaSection: IKopguideCtaSection;
	richContent?: string;
	seo: IKopguidePageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const KopguidePageSchema = new Schema<IKopguidePage>(
	{
		sectionVisibility: {
			type: KopguideSectionVisibilitySchema,
			default: {
				hero: true,
				guideSteps: true,
				checklist: true,
				cta: true,
				contactForm: true,
				richContent: false,
			},
		},
		hero: { type: KopguideHeroSectionSchema, default: {} },
		stepsSection: { type: KopguideStepsSectionSchema, default: {} },
		checklistSection: { type: KopguideChecklistSectionSchema, default: {} },
		ctaSection: { type: KopguideCtaSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: KopguidePageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "kopguide_page",
	}
);

// Ensure virtuals are included in JSON
KopguidePageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

KopguidePageSchema.set("toObject", { virtuals: true });

/**
 * Get KopguidePage Model
 */
export const getKopguidePageModel =
	async (): Promise<Model<IKopguidePage>> => {
		await connectMongoose();

		return (
			(mongoose.models.KopguidePage as Model<IKopguidePage>) ||
			mongoose.model<IKopguidePage>("KopguidePage", KopguidePageSchema)
		);
	};

/**
 * Export synchronous model getter for use in repositories
 */
export function getKopguidePageModelSync(): Model<IKopguidePage> {
	return (
		(mongoose.models.KopguidePage as Model<IKopguidePage>) ||
		mongoose.model<IKopguidePage>("KopguidePage", KopguidePageSchema)
	);
}
