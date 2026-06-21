import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import { generateSlug } from "@/lib/utils/product-helpers";

export interface ITechnologyGroupSeo {
	title?: string;
	description?: string;
	ogImage?: string | null;
	noindex?: boolean;
}

export interface ITechnologyGroupFaq {
	_id?: mongoose.Types.ObjectId;
	question: string;
	answer: string;
	visible: boolean;
}

export interface ITechnologyGroup extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	imageWidth?: number;
	imageHeight?: number;
	heroTitle?: string;
	heroSubtitle?: string;
	heroBulletPoints?: string[];
	heroBgMobile?: string | null;
	heroBgDesktop?: string | null;
	heroBgMobileWidth?: number;
	heroBgMobileHeight?: number;
	heroBgDesktopWidth?: number;
	heroBgDesktopHeight?: number;
	inquiryBgMobile?: string | null;
	inquiryBgDesktop?: string | null;
	inquiryBgMobileWidth?: number;
	inquiryBgMobileHeight?: number;
	inquiryBgDesktopWidth?: number;
	inquiryBgDesktopHeight?: number;
	isActive: boolean;
	order: number;
	faqTitle?: string;
	faqs: ITechnologyGroupFaq[];
	seo?: ITechnologyGroupSeo;
	createdAt: Date;
	updatedAt: Date;
}

const TechnologyGroupFaqSchema = new Schema<ITechnologyGroupFaq>(
	{
		question: {
			type: String,
			required: [true, "Question is required"],
			trim: true,
		},
		answer: {
			type: String,
			required: [true, "Answer is required"],
			trim: true,
		},
		visible: {
			type: Boolean,
			default: true,
		},
	},
	{ _id: true }
);

const TechnologyGroupSchema = new Schema<ITechnologyGroup>(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			maxlength: [100, "Name cannot exceed 100 characters"],
		},
		slug: {
			type: String,
			trim: true,
			lowercase: true,
			maxlength: [120, "Slug cannot exceed 120 characters"],
		},
		description: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: null,
		},
		imageWidth: { type: Number },
		imageHeight: { type: Number },
		heroTitle: {
			type: String,
			default: "",
		},
		heroSubtitle: {
			type: String,
			default: "",
		},
		heroBulletPoints: {
			type: [String],
			default: [],
		},
		heroBgMobile: {
			type: String,
			default: null,
		},
		heroBgDesktop: {
			type: String,
			default: null,
		},
		heroBgMobileWidth: { type: Number },
		heroBgMobileHeight: { type: Number },
		heroBgDesktopWidth: { type: Number },
		heroBgDesktopHeight: { type: Number },
		inquiryBgMobile: {
			type: String,
			default: null,
		},
		inquiryBgDesktop: {
			type: String,
			default: null,
		},
		inquiryBgMobileWidth: { type: Number },
		inquiryBgMobileHeight: { type: Number },
		inquiryBgDesktopWidth: { type: Number },
		inquiryBgDesktopHeight: { type: Number },
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			default: 0,
		},
		faqTitle: {
			type: String,
			trim: true,
			default: "",
		},
		faqs: {
			type: [TechnologyGroupFaqSchema],
			default: [],
		},
		seo: {
			title: { type: String, default: "", maxlength: 70 },
			description: { type: String, default: "", maxlength: 200 },
			ogImage: { type: String, default: null },
			noindex: { type: Boolean, default: false },
		},
	},
	{
		timestamps: true,
		collection: "technology_groups",
	}
);

TechnologyGroupSchema.index({ isActive: 1, order: 1 });
TechnologyGroupSchema.index({ name: 1 }, { unique: true });
TechnologyGroupSchema.index(
	{ slug: 1 },
	{ unique: true, partialFilterExpression: { slug: { $type: "string" } } }
);

// Auto-generate slug from name if missing before save
TechnologyGroupSchema.pre("save", async function () {
	if (!this.slug && this.name) {
		this.slug = generateSlug(this.name);
	}
});

TechnologyGroupSchema.set("toJSON", {
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

/**
 * Resolve the TechnologyGroup model.
 *
 * In Next.js dev (HMR), `mongoose.models` persists across code reloads, so a
 * stale schema (missing newly added fields like description/image/seo) can
 * silently drop those fields on save. We detect a stale cache by checking for
 * required paths and re-register the model when needed.
 */
function resolveTechnologyGroupModel(): Model<ITechnologyGroup> {
	const cached = mongoose.models.TechnologyGroup as Model<ITechnologyGroup> | undefined;
	if (cached) {
		const hasDescription = !!cached.schema.path("description");
		const hasImage = !!cached.schema.path("image");
		const hasSeo = !!cached.schema.path("seo");
		const hasFaqs = !!cached.schema.path("faqs");
		const hasFaqTitle = !!cached.schema.path("faqTitle");
		const hasHeroTitle = !!cached.schema.path("heroTitle");
		const hasHeroBgDesktop = !!cached.schema.path("heroBgDesktop");
		const hasInquiryBgDesktop = !!cached.schema.path("inquiryBgDesktop");
		const hasImageWidth = !!cached.schema.path("imageWidth");
		if (hasDescription && hasImage && hasSeo && hasFaqs && hasFaqTitle && hasHeroTitle && hasHeroBgDesktop && hasInquiryBgDesktop && hasImageWidth) {
			return cached;
		}
		// Stale cache — drop and re-register
		mongoose.deleteModel("TechnologyGroup");
	}
	return mongoose.model<ITechnologyGroup>("TechnologyGroup", TechnologyGroupSchema);
}

export const getTechnologyGroupModel = async (): Promise<Model<ITechnologyGroup>> => {
	await connectMongoose();
	return resolveTechnologyGroupModel();
};

export function getTechnologyGroupModelSync(): Model<ITechnologyGroup> {
	return resolveTechnologyGroupModel();
}
