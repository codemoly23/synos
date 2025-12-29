import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IStartaEgetSectionVisibility {
	hero: boolean;
	mainContent: boolean;
	benefits: boolean;
	features: boolean;
	contactForm: boolean;
	resources: boolean;
	richContent: boolean;
}

const StartaEgetSectionVisibilitySchema =
	new Schema<IStartaEgetSectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			mainContent: { type: Boolean, default: true },
			benefits: { type: Boolean, default: true },
			features: { type: Boolean, default: true },
			contactForm: { type: Boolean, default: true },
			resources: { type: Boolean, default: true },
			richContent: { type: Boolean, default: false },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IStartaEgetHeroSection {
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	callout?: string;
}

const StartaEgetHeroSectionSchema = new Schema<IStartaEgetHeroSection>(
	{
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		callout: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN CONTENT SECTION
// ============================================================================
export interface IStartaEgetMainContentSection {
	title?: string;
	subtitle?: string;
	paragraphs?: string[];
}

const StartaEgetMainContentSectionSchema =
	new Schema<IStartaEgetMainContentSection>(
		{
			title: { type: String, trim: true },
			subtitle: { type: String, trim: true },
			paragraphs: { type: [String], default: [] },
		},
		{ _id: false }
	);

// ============================================================================
// BENEFIT CARD
// ============================================================================
export interface IStartaEgetBenefitCard {
	title?: string;
	description?: string;
	icon?: string;
}

const StartaEgetBenefitCardSchema = new Schema<IStartaEgetBenefitCard>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		icon: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// FEATURE ITEM
// ============================================================================
export interface IStartaEgetFeatureItem {
	title?: string;
	description?: string;
}

const StartaEgetFeatureItemSchema = new Schema<IStartaEgetFeatureItem>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// FEATURES SECTION
// ============================================================================
export interface IStartaEgetFeaturesSection {
	title?: string;
	intro?: string;
	features?: IStartaEgetFeatureItem[];
}

const StartaEgetFeaturesSectionSchema = new Schema<IStartaEgetFeaturesSection>(
	{
		title: { type: String, trim: true },
		intro: { type: String, trim: true },
		features: { type: [StartaEgetFeatureItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// RESOURCE CARD
// ============================================================================
export interface IStartaEgetResourceCard {
	title?: string;
	description?: string;
	href?: string;
	buttonText?: string;
}

const StartaEgetResourceCardSchema = new Schema<IStartaEgetResourceCard>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		href: { type: String, trim: true },
		buttonText: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// RESOURCES SECTION
// ============================================================================
export interface IStartaEgetResourcesSection {
	title?: string;
	subtitle?: string;
	resources?: IStartaEgetResourceCard[];
}

const StartaEgetResourcesSectionSchema =
	new Schema<IStartaEgetResourcesSection>(
		{
			title: { type: String, trim: true },
			subtitle: { type: String, trim: true },
			resources: { type: [StartaEgetResourceCardSchema], default: [] },
		},
		{ _id: false }
	);

// ============================================================================
// SEO
// ============================================================================
export interface IStartaEgetPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const StartaEgetPageSeoSchema = new Schema<IStartaEgetPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN STARTA EGET PAGE
// ============================================================================
export interface IStartaEgetPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IStartaEgetSectionVisibility;
	hero: IStartaEgetHeroSection;
	mainContent: IStartaEgetMainContentSection;
	benefits: IStartaEgetBenefitCard[];
	featuresSection: IStartaEgetFeaturesSection;
	resourcesSection: IStartaEgetResourcesSection;
	richContent?: string;
	seo: IStartaEgetPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const StartaEgetPageSchema = new Schema<IStartaEgetPage>(
	{
		sectionVisibility: {
			type: StartaEgetSectionVisibilitySchema,
			default: {
				hero: true,
				mainContent: true,
				benefits: true,
				features: true,
				contactForm: true,
				resources: true,
				richContent: false,
			},
		},
		hero: { type: StartaEgetHeroSectionSchema, default: {} },
		mainContent: { type: StartaEgetMainContentSectionSchema, default: {} },
		benefits: { type: [StartaEgetBenefitCardSchema], default: [] },
		featuresSection: { type: StartaEgetFeaturesSectionSchema, default: {} },
		resourcesSection: { type: StartaEgetResourcesSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: StartaEgetPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "starta_eget_page",
	}
);

// Ensure virtuals are included in JSON
StartaEgetPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

StartaEgetPageSchema.set("toObject", { virtuals: true });

/**
 * Get StartaEgetPage Model
 */
export const getStartaEgetPageModel =
	async (): Promise<Model<IStartaEgetPage>> => {
		await connectMongoose();

		return (
			(mongoose.models.StartaEgetPage as Model<IStartaEgetPage>) ||
			mongoose.model<IStartaEgetPage>("StartaEgetPage", StartaEgetPageSchema)
		);
	};

/**
 * Export synchronous model getter for use in repositories
 */
export function getStartaEgetPageModelSync(): Model<IStartaEgetPage> {
	return (
		(mongoose.models.StartaEgetPage as Model<IStartaEgetPage>) ||
		mongoose.model<IStartaEgetPage>("StartaEgetPage", StartaEgetPageSchema)
	);
}
