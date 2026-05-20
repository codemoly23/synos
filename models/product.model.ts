import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Type definitions for Product sub-documents
 */
export type PublishType = "publish" | "draft" | "pending" | "private";
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

export interface IBeforeAfterImage {
	_id?: mongoose.Types.ObjectId;
	beforeImage: string;
	afterImage: string;
	label?: string;
}

export interface IPurchaseInfo {
	title?: string;
	description?: string; // Rich HTML
	formSubtitle?: string;
	buttonText?: string;
}

export interface ISeo {
	title?: string;
	description?: string;
	ogImage?: string;
	canonicalUrl?: string;
	noindex?: boolean;
}

export interface ISeoAccordion {
	_id?: mongoose.Types.ObjectId;
	title: string;
	content: string;
	order: number;
}

export interface IFeatureSectionItem {
	iconName: string;
	title: string;
	description: string;
}

export interface IFeatureSectionSection1 {
	eyebrow?: string;
	heading?: string;
	paragraph1?: string;
	paragraph2?: string;
	numberedFeatures?: IFeatureSectionItem[];
	benefits?: IFeatureSectionItem[];
}

export interface IFeatureSectionSection2 {
	eyebrow?: string;
	heading?: string;
	description?: string;
	topItems?: IFeatureSectionItem[];
	bottomTitle?: string;
	bottomDescription?: string;
	bottomItems?: IFeatureSectionItem[];
}

export interface IFeatureSectionSection3 {
	eyebrow?: string;
	heading?: string;
	description?: string;
	gridFeatures?: IFeatureSectionItem[];
	bottomTitle?: string;
	bottomDescription?: string;
	bottomItems?: IFeatureSectionItem[];
}

export interface IFeatureSections {
	section1?: IFeatureSectionSection1;
	section2?: IFeatureSectionSection2;
	section3?: IFeatureSectionSection3;
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
	heroSubtitle?: string; // Short tagline shown in the product hero section
	heroFeatures?: string[]; // Bullet point list shown in mobile hero
	productDescription?: string; // Second rich HTML block
	additionalDescription?: string; // Third rich HTML block, shown between About and FAQ
	additionalDescriptionTitle?: string; // Optional heading for additional description
	hiddenDescription?: string; // Hidden description (not shown on product page)
	benefits: string[]; // Array of paragraphs or simple text blocks
	certifications: string[]; // Tags
	treatments: string[]; // Tags
	productImages: string[]; // URLs
	overviewImage?: string; // URL
	beforeAfterImages: IBeforeAfterImage[]; // Before/after image pairs
	techSpecifications: ITechSpec[];
	documentation: IDocumentEntry[];
	purchaseInfo?: IPurchaseInfo;
	seo: ISeo;
	categories: mongoose.Types.ObjectId[];
	primaryCategory?: mongoose.Types.ObjectId; // Primary category for URL generation
	faqTitle?: string;
	qa: IQnA[];
	seoAccordions: ISeoAccordion[];
	heroBackgroundMobile?: string;
	heroBackgroundDesktop?: string;
	inquiryBgMobile?: string;
	inquiryBgDesktop?: string;
	youtubeUrl?: string;
	videoThumbnail?: string;
	rubric?: string;
	technologyGroups?: string[];
	featureSections?: IFeatureSections;
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

const BeforeAfterImageSchema = new Schema<IBeforeAfterImage>(
	{
		beforeImage: {
			type: String,
			required: [true, "Before image is required"],
		},
		afterImage: {
			type: String,
			required: [true, "After image is required"],
		},
		label: {
			type: String,
			default: "",
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
		formSubtitle: {
			type: String,
			default: "",
			trim: true,
		},
		buttonText: {
			type: String,
			default: "",
			trim: true,
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

const SeoAccordionSchema = new Schema<ISeoAccordion>(
	{
		title: {
			type: String,
			required: [true, "SEO accordion title is required"],
			trim: true,
		},
		content: {
			type: String,
			required: [true, "SEO accordion content is required"],
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{ _id: true }
);

const FeatureSectionItemSchema = new Schema<IFeatureSectionItem>(
	{
		iconName: { type: String, trim: true, default: "" },
		title: { type: String, trim: true, default: "" },
		description: { type: String, trim: true, default: "" },
	},
	{ _id: false }
);

const FeatureSectionSection1Schema = new Schema<IFeatureSectionSection1>(
	{
		eyebrow: { type: String, trim: true, default: "" },
		heading: { type: String, trim: true, default: "" },
		paragraph1: { type: String, trim: true, default: "" },
		paragraph2: { type: String, trim: true, default: "" },
		numberedFeatures: { type: [FeatureSectionItemSchema], default: [] },
		benefits: { type: [FeatureSectionItemSchema], default: [] },
	},
	{ _id: false }
);

const FeatureSectionSection2Schema = new Schema<IFeatureSectionSection2>(
	{
		eyebrow: { type: String, trim: true, default: "" },
		heading: { type: String, trim: true, default: "" },
		description: { type: String, trim: true, default: "" },
		topItems: { type: [FeatureSectionItemSchema], default: [] },
		bottomTitle: { type: String, trim: true, default: "" },
		bottomDescription: { type: String, trim: true, default: "" },
		bottomItems: { type: [FeatureSectionItemSchema], default: [] },
	},
	{ _id: false }
);

const FeatureSectionSection3Schema = new Schema<IFeatureSectionSection3>(
	{
		eyebrow: { type: String, trim: true, default: "" },
		heading: { type: String, trim: true, default: "" },
		description: { type: String, trim: true, default: "" },
		gridFeatures: { type: [FeatureSectionItemSchema], default: [] },
		bottomTitle: { type: String, trim: true, default: "" },
		bottomDescription: { type: String, trim: true, default: "" },
		bottomItems: { type: [FeatureSectionItemSchema], default: [] },
	},
	{ _id: false }
);

const FeatureSectionsSchema = new Schema<IFeatureSections>(
	{
		section1: { type: FeatureSectionSection1Schema, default: () => ({}) },
		section2: { type: FeatureSectionSection2Schema, default: () => ({}) },
		section3: { type: FeatureSectionSection3Schema, default: () => ({}) },
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
			maxlength: [120, "Product slug cannot exceed 120 characters"],
		},
		description: {
			type: String,
			default: "",
		},
		shortDescription: {
			type: String,
			default: "",
			maxlength: [1500, "Short description cannot exceed 1500 characters"],
		},
		heroSubtitle: {
			type: String,
			default: "",
			maxlength: [300, "Hero subtitle cannot exceed 300 characters"],
		},
		heroFeatures: {
			type: [String],
			default: [],
		},
		productDescription: {
			type: String,
			default: "",
		},
		additionalDescription: {
			type: String,
			default: "",
		},
		additionalDescriptionTitle: {
			type: String,
			default: "",
			trim: true,
			maxlength: [200, "Additional description title cannot exceed 200 characters"],
		},
		hiddenDescription: {
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
		beforeAfterImages: {
			type: [BeforeAfterImageSchema],
			default: [],
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
		primaryCategory: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			default: null,
			index: true,
		},
		faqTitle: { type: String, trim: true },
		qa: [QnASchema],
		seoAccordions: {
			type: [SeoAccordionSchema],
			default: [],
		},
		heroBackgroundMobile: {
			type: String,
			default: "",
		},
		heroBackgroundDesktop: {
			type: String,
			default: "",
		},
		inquiryBgMobile: {
			type: String,
			default: "",
		},
		inquiryBgDesktop: {
			type: String,
			default: "",
		},
		youtubeUrl: {
			type: String,
			default: "",
		},
		videoThumbnail: {
			type: String,
			default: "",
		},
		rubric: {
			type: String,
			default: "",
		},
		technologyGroups: {
			type: [String],
			default: [],
		},
		featureSections: {
			type: FeatureSectionsSchema,
			default: () => ({}),
		},
		publishType: {
			type: String,
			enum: ["publish", "draft", "pending", "private"],
			default: "draft",
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
ProductSchema.index({ technologyGroups: 1 });
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
 * In development, deletes cached model on each call so schema changes
 * from hot-reload are picked up. In production, caches for performance.
 */
export const getProductModel = async (): Promise<Model<IProduct>> => {
	await connectMongoose();

	if (process.env.NODE_ENV !== "production" && mongoose.models.Product) {
		delete mongoose.models["Product"];
	}

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
	if (process.env.NODE_ENV !== "production" && mongoose.models.Product) {
		delete mongoose.models["Product"];
	}

	return (
		(mongoose.models.Product as Model<IProduct>) ||
		mongoose.model<IProduct>("Product", ProductSchema)
	);
}
