import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Type definitions for Product sub-documents
 */
export type PublishType = "publish" | "draft" | "private";
export type Visibility = "public" | "hidden";

export interface IQnA {
	_id?: mongoose.Types.ObjectId;
	question: string;
	answer: string;
	visible: boolean;
}

export interface ITechSpec {
	_id?: mongoose.Types.ObjectId;
	title: string;
	description: string;
}

export interface IDocumentEntry {
	_id?: mongoose.Types.ObjectId;
	title: string;
	url: string;
}

export interface IPurchaseInfo {
	title?: string;
	description?: string; // Rich HTML
}

export interface ISeo {
	title?: string;
	description?: string;
	ogImage?: string;
	canonicalUrl?: string;
	noindex?: boolean;
}

/**
 * Product interface extending Mongoose Document
 */
export interface IProduct extends Document {
	_id: mongoose.Types.ObjectId;
	title: string;
	slug: string;
	description: string; // Rich HTML
	shortDescription?: string;
	productDescription?: string; // Second rich HTML block
	benefits: string[]; // Array of paragraphs or simple text blocks
	certifications: string[]; // Tags
	treatments: string[]; // Tags
	productImages: string[]; // URLs
	overviewImage?: string; // URL
	techSpecifications: ITechSpec[];
	documentation: IDocumentEntry[];
	purchaseInfo?: IPurchaseInfo;
	seo: ISeo;
	categories: mongoose.Types.ObjectId[];
	qa: IQnA[];
	youtubeUrl?: string;
	rubric?: string;
	publishType: PublishType;
	visibility: Visibility;
	lastEditedBy?: mongoose.Types.ObjectId;
	publishedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Sub-schemas for nested documents
 */
const QnASchema = new Schema<IQnA>(
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

const TechSpecSchema = new Schema<ITechSpec>(
	{
		title: {
			type: String,
			required: [true, "Tech spec title is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Tech spec description is required"],
			trim: true,
		},
	},
	{ _id: true }
);

const DocumentEntrySchema = new Schema<IDocumentEntry>(
	{
		title: {
			type: String,
			required: [true, "Document title is required"],
			trim: true,
		},
		url: {
			type: String,
			required: [true, "Document URL is required"],
			trim: true,
		},
	},
	{ _id: true }
);

const PurchaseInfoSchema = new Schema<IPurchaseInfo>(
	{
		title: {
			type: String,
			default: "",
			trim: true,
		},
		description: {
			type: String,
			default: "",
		},
	},
	{ _id: false }
);

const SeoSchema = new Schema<ISeo>(
	{
		title: {
			type: String,
			default: "",
			maxlength: [70, "SEO title should not exceed 70 characters"],
		},
		description: {
			type: String,
			default: "",
			maxlength: [160, "SEO description should not exceed 160 characters"],
		},
		ogImage: {
			type: String,
			default: "",
		},
		canonicalUrl: {
			type: String,
			default: "",
		},
		noindex: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

/**
 * Product Schema
 */
const ProductSchema = new Schema<IProduct>(
	{
		title: {
			type: String,
			required: [true, "Product title is required"],
			trim: true,
			maxlength: [200, "Product title cannot exceed 200 characters"],
		},
		slug: {
			type: String,
			required: [true, "Product slug is required"],
			trim: true,
			lowercase: true,
			unique: true,
			index: true,
			maxlength: [120, "Product slug cannot exceed 120 characters"],
		},
		description: {
			type: String,
			default: "",
		},
		shortDescription: {
			type: String,
			default: "",
			maxlength: [300, "Short description cannot exceed 300 characters"],
		},
		productDescription: {
			type: String,
			default: "",
		},
		benefits: [
			{
				type: String,
				trim: true,
			},
		],
		certifications: [
			{
				type: String,
				trim: true,
			},
		],
		treatments: [
			{
				type: String,
				trim: true,
			},
		],
		productImages: [
			{
				type: String,
			},
		],
		overviewImage: {
			type: String,
			default: "",
		},
		techSpecifications: [TechSpecSchema],
		documentation: [DocumentEntrySchema],
		purchaseInfo: {
			type: PurchaseInfoSchema,
			default: () => ({}),
		},
		seo: {
			type: SeoSchema,
			default: () => ({}),
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		qa: [QnASchema],
		youtubeUrl: {
			type: String,
			default: "",
		},
		rubric: {
			type: String,
			default: "",
		},
		publishType: {
			type: String,
			enum: ["publish", "draft", "private"],
			default: "draft",
			index: true,
		},
		visibility: {
			type: String,
			enum: ["public", "hidden"],
			default: "public",
		},
		lastEditedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		publishedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: "products",
	}
);

// Indexes for performance
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ publishType: 1, visibility: 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ treatments: 1 });
ProductSchema.index({ certifications: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ publishedAt: -1 });

// Text index for search
ProductSchema.index(
	{
		title: "text",
		description: "text",
		shortDescription: "text",
	},
	{
		weights: {
			title: 10,
			shortDescription: 5,
			description: 1,
		},
		name: "product_text_search",
	}
);

// Ensure virtuals are included in JSON
ProductSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

ProductSchema.set("toObject", { virtuals: true });

/**
 * Get Product Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getProductModel = async (): Promise<Model<IProduct>> => {
	await connectMongoose();

	return (
		(mongoose.models.Product as Model<IProduct>) ||
		mongoose.model<IProduct>("Product", ProductSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getProductModelSync(): Model<IProduct> {
	return (
		(mongoose.models.Product as Model<IProduct>) ||
		mongoose.model<IProduct>("Product", ProductSchema)
	);
}
