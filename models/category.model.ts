import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * SEO settings interface for categories
 */
export interface ICategorySeo {
	title?: string;
	description?: string;
	ogImage?: string | null;
	noindex?: boolean;
}

/**
 * FAQ item interface for categories
 */
export interface ICategoryFaq {
	_id?: mongoose.Types.ObjectId;
	question: string;
	answer: string;
	visible: boolean;
}

/**
 * Category interface extending Mongoose Document
 * Supports infinite nesting via parent reference
 */
export interface ICategory extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	slug: string;
	description?: string; // Rich HTML content from TextEditor
	parent: mongoose.Types.ObjectId | null;
	image?: string | null; // URL
	order: number; // For sorting siblings
	isActive: boolean;
	faqTitle?: string;
	faqs: ICategoryFaq[];
	seo?: ICategorySeo;
	inquiryBgMobile?: string;
	inquiryBgDesktop?: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Category tree node for frontend consumption
 */
export interface ICategoryTreeNode {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	order: number;
	isActive: boolean;
	parent: string | null;
	children: ICategoryTreeNode[];
	depth: number;
	path: string; // Full path like "parent/child/grandchild"
}

/**
 * FAQ Sub-schema for categories
 */
const CategoryFaqSchema = new Schema<ICategoryFaq>(
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

/**
 * Category Schema
 * Supports hierarchical structure with parent reference
 */
const CategorySchema = new Schema<ICategory>(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			trim: true,
			maxlength: [100, "Category name cannot exceed 100 characters"],
		},
		slug: {
			type: String,
			required: [true, "Category slug is required"],
			trim: true,
			lowercase: true,
			maxlength: [120, "Category slug cannot exceed 120 characters"],
		},
		description: {
			type: String,
			default: "",
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			default: null,
		},
		image: {
			type: String,
			default: null,
		},
		order: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		faqTitle: {
			type: String,
			trim: true,
			default: "",
		},
		faqs: {
			type: [CategoryFaqSchema],
			default: [],
		},
		inquiryBgMobile: {
			type: String,
			default: "",
		},
		inquiryBgDesktop: {
			type: String,
			default: "",
		},
		seo: {
			title: {
				type: String,
				default: "",
				maxlength: [70, "SEO title cannot exceed 70 characters"],
			},
			description: {
				type: String,
				default: "",
				maxlength: [200, "SEO description cannot exceed 200 characters"],
			},
			ogImage: {
				type: String,
				default: null,
			},
			noindex: {
				type: Boolean,
				default: false,
			},
		},
	},
	{
		timestamps: true,
		collection: "categories",
	}
);

// Compound index for efficient tree queries and sorting
CategorySchema.index({ parent: 1, order: 1, createdAt: 1 });
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ order: 1, createdAt: 1 });
CategorySchema.index({ isActive: 1, order: 1, createdAt: 1 });

// Virtual for children (populated on demand)
CategorySchema.virtual("children", {
	ref: "Category",
	localField: "_id",
	foreignField: "parent",
});

// Ensure virtuals are included in JSON
CategorySchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

CategorySchema.set("toObject", { virtuals: true });

/**
 * Build (or return) the Category model with current schema.
 * In dev (HMR), if a stale model is cached without our latest schema fields
 * (e.g. faqs/faqTitle were added later), we recompile so saves don't silently
 * drop unknown fields under Mongoose's default `strict: true`.
 */
function buildCategoryModel(): Model<ICategory> {
	const cached = mongoose.models.Category as Model<ICategory> | undefined;
	if (cached) {
		const hasFaqsPath = !!cached.schema.path("faqs");
		const hasFaqTitlePath = !!cached.schema.path("faqTitle");
		if (hasFaqsPath && hasFaqTitlePath) {
			return cached;
		}
		// Stale cached model — recompile with latest schema
		delete mongoose.models.Category;
		delete (mongoose as unknown as { modelSchemas?: Record<string, unknown> })
			.modelSchemas?.Category;
	}
	return mongoose.model<ICategory>("Category", CategorySchema);
}

/**
 * Get Category Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getCategoryModel = async (): Promise<Model<ICategory>> => {
	await connectMongoose();
	return buildCategoryModel();
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getCategoryModelSync(): Model<ICategory> {
	return buildCategoryModel();
}
