import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IMiniutbildningSectionVisibility {
	hero: boolean;
	benefits: boolean;
	learnings: boolean;
	process: boolean;
	contactForm: boolean;
	richContent: boolean;
}

const MiniutbildningSectionVisibilitySchema =
	new Schema<IMiniutbildningSectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			benefits: { type: Boolean, default: true },
			learnings: { type: Boolean, default: true },
			process: { type: Boolean, default: true },
			contactForm: { type: Boolean, default: true },
			richContent: { type: Boolean, default: false },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IMiniutbildningHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
}

const MiniutbildningHeroSectionSchema = new Schema<IMiniutbildningHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		buttonText: { type: String, trim: true },
		buttonHref: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// BENEFIT CARD
// ============================================================================
export interface IMiniutbildningBenefitCard {
	icon?: string;
	title?: string;
	description?: string;
}

const MiniutbildningBenefitCardSchema = new Schema<IMiniutbildningBenefitCard>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// LEARNINGS SECTION
// ============================================================================
export interface IMiniutbildningLearningsSection {
	title?: string;
	subtitle?: string;
	items?: string[];
}

const MiniutbildningLearningSectionSchema =
	new Schema<IMiniutbildningLearningsSection>(
		{
			title: { type: String, trim: true },
			subtitle: { type: String, trim: true },
			items: { type: [String], default: [] },
		},
		{ _id: false }
	);

// ============================================================================
// PROCESS STEP
// ============================================================================
export interface IMiniutbildningProcessStep {
	number?: string;
	title?: string;
	description?: string;
}

const MiniutbildningProcessStepSchema = new Schema<IMiniutbildningProcessStep>(
	{
		number: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// PROCESS SECTION
// ============================================================================
export interface IMiniutbildningProcessSection {
	badge?: string;
	title?: string;
	subtitle?: string;
	steps?: IMiniutbildningProcessStep[];
	highlightTitle?: string;
	highlightSubtitle?: string;
	highlightButtonText?: string;
	highlightButtonHref?: string;
}

const MiniutbildningProcessSectionSchema =
	new Schema<IMiniutbildningProcessSection>(
		{
			badge: { type: String, trim: true },
			title: { type: String, trim: true },
			subtitle: { type: String, trim: true },
			steps: { type: [MiniutbildningProcessStepSchema], default: [] },
			highlightTitle: { type: String, trim: true },
			highlightSubtitle: { type: String, trim: true },
			highlightButtonText: { type: String, trim: true },
			highlightButtonHref: { type: String, trim: true },
		},
		{ _id: false }
	);

// ============================================================================
// SEO
// ============================================================================
export interface IMiniutbildningPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const MiniutbildningPageSeoSchema = new Schema<IMiniutbildningPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN MINIUTBILDNING PAGE
// ============================================================================
export interface IMiniutbildningPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IMiniutbildningSectionVisibility;
	hero: IMiniutbildningHeroSection;
	benefits: IMiniutbildningBenefitCard[];
	learningsSection: IMiniutbildningLearningsSection;
	processSection: IMiniutbildningProcessSection;
	richContent?: string;
	seo: IMiniutbildningPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const MiniutbildningPageSchema = new Schema<IMiniutbildningPage>(
	{
		sectionVisibility: {
			type: MiniutbildningSectionVisibilitySchema,
			default: {
				hero: true,
				benefits: true,
				learnings: true,
				process: true,
				contactForm: true,
				richContent: false,
			},
		},
		hero: { type: MiniutbildningHeroSectionSchema, default: {} },
		benefits: { type: [MiniutbildningBenefitCardSchema], default: [] },
		learningsSection: {
			type: MiniutbildningLearningSectionSchema,
			default: {},
		},
		processSection: { type: MiniutbildningProcessSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: MiniutbildningPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "miniutbildning_page",
	}
);

// Ensure virtuals are included in JSON
MiniutbildningPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

MiniutbildningPageSchema.set("toObject", { virtuals: true });

/**
 * Get MiniutbildningPage Model
 */
export const getMiniutbildningPageModel =
	async (): Promise<Model<IMiniutbildningPage>> => {
		await connectMongoose();

		return (
			(mongoose.models.MiniutbildningPage as Model<IMiniutbildningPage>) ||
			mongoose.model<IMiniutbildningPage>(
				"MiniutbildningPage",
				MiniutbildningPageSchema
			)
		);
	};

/**
 * Export synchronous model getter for use in repositories
 */
export function getMiniutbildningPageModelSync(): Model<IMiniutbildningPage> {
	return (
		(mongoose.models.MiniutbildningPage as Model<IMiniutbildningPage>) ||
		mongoose.model<IMiniutbildningPage>(
			"MiniutbildningPage",
			MiniutbildningPageSchema
		)
	);
}
