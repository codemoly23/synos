import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface ICustom404SectionVisibility {
	hero: boolean;
	suggestedPages: boolean;
	cta: boolean;
}

const Custom404SectionVisibilitySchema =
	new Schema<ICustom404SectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			suggestedPages: { type: Boolean, default: true },
			cta: { type: Boolean, default: true },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ICustom404Hero {
	title?: string;
	subtitle?: string;
	description?: string;
	backgroundImage?: string;
	backgroundStyle?: "gradient" | "solid" | "image";
	backgroundColor?: string;
}

const Custom404HeroSchema = new Schema<ICustom404Hero>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		description: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
		backgroundStyle: {
			type: String,
			enum: ["gradient", "solid", "image"],
			default: "gradient",
		},
		backgroundColor: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SUGGESTED PAGE
// ============================================================================
export interface ICustom404SuggestedPage {
	label?: string;
	href?: string;
	description?: string;
	icon?: string;
}

const Custom404SuggestedPageSchema = new Schema<ICustom404SuggestedPage>(
	{
		label: { type: String, trim: true },
		href: { type: String, trim: true },
		description: { type: String, trim: true },
		icon: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface ICustom404Cta {
	primaryButtonText?: string;
	primaryButtonHref?: string;
	secondaryButtonText?: string;
	secondaryButtonHref?: string;
}

const Custom404CtaSchema = new Schema<ICustom404Cta>(
	{
		primaryButtonText: { type: String, trim: true },
		primaryButtonHref: { type: String, trim: true },
		secondaryButtonText: { type: String, trim: true },
		secondaryButtonHref: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN CUSTOM 404 PAGE
// ============================================================================
export interface ICustom404Page extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: ICustom404SectionVisibility;
	hero: ICustom404Hero;
	suggestedPages: ICustom404SuggestedPage[];
	cta: ICustom404Cta;
	updatedAt: Date;
	createdAt: Date;
}

const Custom404PageSchema = new Schema<ICustom404Page>(
	{
		sectionVisibility: {
			type: Custom404SectionVisibilitySchema,
			default: {
				hero: true,
				suggestedPages: true,
				cta: true,
			},
		},
		hero: {
			type: Custom404HeroSchema,
			default: {
				title: "404",
				subtitle: "Sidan kunde inte hittas",
				description:
					"Tyvärr kunde vi inte hitta sidan du letar efter.",
				backgroundStyle: "gradient",
			},
		},
		suggestedPages: { type: [Custom404SuggestedPageSchema], default: [] },
		cta: {
			type: Custom404CtaSchema,
			default: {
				primaryButtonText: "Tillbaka till startsidan",
				primaryButtonHref: "/",
				secondaryButtonText: "Kontakta oss",
				secondaryButtonHref: "/kontakt",
			},
		},
	},
	{
		timestamps: true,
		collection: "custom_404_page",
	}
);

Custom404PageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

Custom404PageSchema.set("toObject", { virtuals: true });

/**
 * Get Custom404Page Model
 */
export const getCustom404PageModel =
	async (): Promise<Model<ICustom404Page>> => {
		await connectMongoose();

		return (
			(mongoose.models.Custom404Page as Model<ICustom404Page>) ||
			mongoose.model<ICustom404Page>("Custom404Page", Custom404PageSchema)
		);
	};

/**
 * Export synchronous model getter for use in repositories
 */
export function getCustom404PageModelSync(): Model<ICustom404Page> {
	if (
		process.env.NODE_ENV === "development" &&
		mongoose.models.Custom404Page
	) {
		delete mongoose.models.Custom404Page;
	}
	return (
		(mongoose.models.Custom404Page as Model<ICustom404Page>) ||
		mongoose.model<ICustom404Page>("Custom404Page", Custom404PageSchema)
	);
}
