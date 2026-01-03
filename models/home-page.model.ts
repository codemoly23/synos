import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * CTA Button interface - all fields optional to allow empty content
 */
export interface ICtaButton {
	text?: string;
	href?: string;
	variant?: "primary" | "outline" | "secondary";
}

/**
 * Hero Floating Card interface (top right card with image)
 */
export interface IHeroFloatingCard {
	image?: string;
	label?: string;
}

/**
 * Hero Certification Card interface (bottom left card)
 */
export interface IHeroCertificationCard {
	title?: string;
	subtitle?: string;
	progressLabel?: string;
	progressValue?: string;
	progressPercentage?: number;
}

/**
 * Hero Section interface - all fields optional to allow empty content
 */
export interface IHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	primaryCta?: ICtaButton;
	secondaryCta?: ICtaButton;
	backgroundImage?: string;
	mainImage?: string;
	/** Separate mobile image for responsive hero (full-height on mobile) */
	mobileImage?: string;
	trustIndicators?: Array<{
		icon?: string;
		text?: string;
	}>;
	floatingCard?: IHeroFloatingCard;
	certificationCard?: IHeroCertificationCard;
}

/**
 * Feature Highlight interface - all fields optional
 */
export interface IFeatureHighlight {
	icon?: string;
	title?: string;
	description?: string;
}

/**
 * Process Step interface - all fields optional
 */
export interface IProcessStep {
	stepNumber?: string;
	title?: string;
	description?: string;
	icon?: string;
}

/**
 * Process Steps Section interface - all fields optional
 */
export interface IProcessStepsSection {
	badge?: string;
	title?: string;
	subtitle?: string;
	steps?: IProcessStep[];
}

/**
 * About Section interface - all fields optional
 */
export interface IAboutSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	content?: string;
	image?: string;
	benefits?: string[];
	primaryCta?: ICtaButton;
	secondaryCta?: ICtaButton;
	certificationBadge?: IAboutCertificationBadge;
}

/**
 * CTA Section interface - all fields optional
 */
export interface ICtaSection {
	title?: string;
	subtitle?: string;
	phoneTitle?: string;
	phoneSubtitle?: string;
	emailTitle?: string;
	emailSubtitle?: string;
	formTitle?: string;
	formSubtitle?: string;
	formCtaText?: string;
}

/**
 * Product Showcase Item interface - all fields optional
 */
export interface IProductShowcaseItem {
	name?: string;
	category?: string;
	description?: string;
	status?: string;
	image?: string;
	href?: string;
}

/**
 * Product Showcase Section interface
 */
export interface IProductShowcaseSection {
	title?: string;
	subtitle?: string;
	ctaText?: string;
	ctaHref?: string;
	products?: IProductShowcaseItem[];
}

/**
 * Gallery Image interface - all fields optional
 */
export interface IGalleryImage {
	src?: string;
	title?: string;
	subtitle?: string;
}

/**
 * Image Gallery Section interface - all fields optional
 */
export interface IImageGallerySection {
	badge?: string;
	title?: string;
	subtitle?: string;
	images?: IGalleryImage[];
	ctaTitle?: string;
	ctaSubtitle?: string;
	ctaButtonText?: string;
}

/**
 * About Certification Badge interface
 */
export interface IAboutCertificationBadge {
	title?: string;
	description?: string;
}

/**
 * Testimonial Item interface - all fields optional
 */
export interface ITestimonialItem {
	quote?: string;
	author?: string;
	role?: string;
	company?: string;
}

/**
 * Testimonials Section interface - all fields optional
 */
export interface ITestimonialsSection {
	title?: string;
	subtitle?: string;
	testimonials?: ITestimonialItem[];
}

/**
 * Section Visibility Settings interface
 */
export interface ISectionVisibility {
	hero: boolean;
	features: boolean;
	productShowcase: boolean;
	imageGallery: boolean;
	processSteps: boolean;
	about: boolean;
	testimonials: boolean;
	cta: boolean;
	richContent: boolean;
}

/**
 * SEO Settings interface
 */
export interface IHomePageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

/**
 * HomePage interface extending Mongoose Document
 * Singleton model for home page content
 */
export interface IHomePage extends Document {
	_id: mongoose.Types.ObjectId;

	// Section Visibility Settings
	sectionVisibility: ISectionVisibility;

	// Hero Section
	hero: IHeroSection;

	// Feature Highlights (4 cards)
	features: IFeatureHighlight[];

	// Product Showcase Section
	productShowcase: IProductShowcaseSection;

	// Image Gallery Section
	imageGallery: IImageGallerySection;

	// Process Steps Section (title, subtitle, steps)
	processStepsSection: IProcessStepsSection;

	// About Section
	aboutSection: IAboutSection;

	// Testimonials Section
	testimonialsSection: ITestimonialsSection;

	// CTA Section
	ctaSection: ICtaSection;

	// Rich Content (HTML from text editor)
	richContent?: string;

	// SEO
	seo: IHomePageSeo;

	// Timestamps
	updatedAt: Date;
	createdAt: Date;
}

/**
 * CTA Button sub-schema - no required fields to allow empty content
 */
const CtaButtonSchema = new Schema<ICtaButton>(
	{
		text: { type: String, trim: true },
		href: { type: String, trim: true },
		variant: {
			type: String,
			enum: ["primary", "outline", "secondary"],
			default: "primary",
		},
	},
	{ _id: false }
);

/**
 * Hero Floating Card sub-schema
 */
const HeroFloatingCardSchema = new Schema<IHeroFloatingCard>(
	{
		image: { type: String, trim: true },
		label: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Hero Certification Card sub-schema
 */
const HeroCertificationCardSchema = new Schema<IHeroCertificationCard>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		progressLabel: { type: String, trim: true },
		progressValue: { type: String, trim: true },
		progressPercentage: { type: Number, min: 0, max: 100 },
	},
	{ _id: false }
);

/**
 * Hero Section sub-schema - no required fields to allow empty content
 */
const HeroSectionSchema = new Schema<IHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		primaryCta: { type: CtaButtonSchema },
		secondaryCta: { type: CtaButtonSchema },
		backgroundImage: { type: String, trim: true },
		mainImage: { type: String, trim: true },
		mobileImage: { type: String, trim: true },
		trustIndicators: [
			{
				icon: { type: String, trim: true },
				text: { type: String, trim: true },
			},
		],
		floatingCard: { type: HeroFloatingCardSchema },
		certificationCard: { type: HeroCertificationCardSchema },
	},
	{ _id: false }
);

/**
 * Feature Highlight sub-schema - no required fields
 */
const FeatureHighlightSchema = new Schema<IFeatureHighlight>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Process Step sub-schema - no required fields
 */
const ProcessStepSchema = new Schema<IProcessStep>(
	{
		stepNumber: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		icon: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Process Steps Section sub-schema - no required fields
 */
const ProcessStepsSectionSchema = new Schema<IProcessStepsSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		steps: { type: [ProcessStepSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Product Showcase Item sub-schema - no required fields
 */
const ProductShowcaseItemSchema = new Schema<IProductShowcaseItem>(
	{
		name: { type: String, trim: true },
		category: { type: String, trim: true },
		description: { type: String, trim: true },
		status: { type: String, trim: true },
		image: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Product Showcase Section sub-schema - no required fields
 */
const ProductShowcaseSectionSchema = new Schema<IProductShowcaseSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		ctaText: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
		products: { type: [ProductShowcaseItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Gallery Image sub-schema - no required fields
 */
const GalleryImageSchema = new Schema<IGalleryImage>(
	{
		src: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Image Gallery Section sub-schema - no required fields
 */
const ImageGallerySectionSchema = new Schema<IImageGallerySection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		images: { type: [GalleryImageSchema], default: [] },
		ctaTitle: { type: String, trim: true },
		ctaSubtitle: { type: String, trim: true },
		ctaButtonText: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * About Certification Badge sub-schema
 */
const AboutCertificationBadgeSchema = new Schema<IAboutCertificationBadge>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * About Section sub-schema - no required fields
 */
const AboutSectionSchema = new Schema<IAboutSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		content: { type: String, trim: true },
		image: { type: String, trim: true },
		benefits: [{ type: String, trim: true }],
		primaryCta: { type: CtaButtonSchema },
		secondaryCta: { type: CtaButtonSchema },
		certificationBadge: { type: AboutCertificationBadgeSchema },
	},
	{ _id: false }
);

/**
 * CTA Section sub-schema - no required fields
 */
const CtaSectionSchema = new Schema<ICtaSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		phoneTitle: { type: String, trim: true },
		phoneSubtitle: { type: String, trim: true },
		emailTitle: { type: String, trim: true },
		emailSubtitle: { type: String, trim: true },
		formTitle: { type: String, trim: true },
		formSubtitle: { type: String, trim: true },
		formCtaText: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * HomePage SEO sub-schema
 */
const HomePageSeoSchema = new Schema<IHomePageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Testimonial Item sub-schema - no required fields
 */
const TestimonialItemSchema = new Schema<ITestimonialItem>(
	{
		quote: { type: String, trim: true },
		author: { type: String, trim: true },
		role: { type: String, trim: true },
		company: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Testimonials Section sub-schema - no required fields
 */
const TestimonialsSectionSchema = new Schema<ITestimonialsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		testimonials: { type: [TestimonialItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Section Visibility sub-schema
 */
const SectionVisibilitySchema = new Schema<ISectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		features: { type: Boolean, default: true },
		productShowcase: { type: Boolean, default: true },
		imageGallery: { type: Boolean, default: true },
		processSteps: { type: Boolean, default: true },
		about: { type: Boolean, default: true },
		testimonials: { type: Boolean, default: true },
		cta: { type: Boolean, default: true },
		richContent: { type: Boolean, default: false },
	},
	{ _id: false }
);

/**
 * HomePage Schema
 * Singleton model - only one document should exist
 * NO DEFAULT DATA - sections show only if content is explicitly added via CMS
 */
const HomePageSchema = new Schema<IHomePage>(
	{
		sectionVisibility: {
			type: SectionVisibilitySchema,
			default: {
				hero: true,
				features: true,
				productShowcase: true,
				imageGallery: true,
				processSteps: true,
				about: true,
				testimonials: true,
				cta: true,
				richContent: false,
			},
		},
		hero: {
			type: HeroSectionSchema,
			default: {},
		},
		features: {
			type: [FeatureHighlightSchema],
			default: [],
		},
		productShowcase: {
			type: ProductShowcaseSectionSchema,
			default: {},
		},
		imageGallery: {
			type: ImageGallerySectionSchema,
			default: {},
		},
		processStepsSection: {
			type: ProcessStepsSectionSchema,
			default: {},
		},
		aboutSection: {
			type: AboutSectionSchema,
			default: {},
		},
		testimonialsSection: {
			type: TestimonialsSectionSchema,
			default: {},
		},
		ctaSection: {
			type: CtaSectionSchema,
			default: {},
		},
		richContent: {
			type: String,
			default: "",
		},
		seo: {
			type: HomePageSeoSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "home_page",
	}
);

// Ensure virtuals are included in JSON
HomePageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

HomePageSchema.set("toObject", { virtuals: true });

/**
 * Get HomePage Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getHomePageModel = async (): Promise<Model<IHomePage>> => {
	await connectMongoose();

	return (
		(mongoose.models.HomePage as Model<IHomePage>) ||
		mongoose.model<IHomePage>("HomePage", HomePageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getHomePageModelSync(): Model<IHomePage> {
	return (
		(mongoose.models.HomePage as Model<IHomePage>) ||
		mongoose.model<IHomePage>("HomePage", HomePageSchema)
	);
}
