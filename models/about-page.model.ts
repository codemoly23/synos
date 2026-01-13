import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IAboutSectionVisibility {
	hero: boolean;
	mission: boolean;
	stats: boolean;
	imageGallery: boolean;
	faq: boolean;
	testimonials: boolean;
	partners: boolean;
	cta: boolean;
}

const AboutSectionVisibilitySchema = new Schema<IAboutSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		mission: { type: Boolean, default: true },
		stats: { type: Boolean, default: true },
		imageGallery: { type: Boolean, default: true },
		faq: { type: Boolean, default: true },
		testimonials: { type: Boolean, default: true },
		partners: { type: Boolean, default: true },
		cta: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IAboutHeroSection {
	badge?: string;
	title?: string;
	subtitle?: string;
}

const AboutHeroSectionSchema = new Schema<IAboutHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MISSION SECTION
// ============================================================================
export interface IAboutMissionSection {
	badge?: string;
	title?: string;
	description?: string;
	image?: string;
	features?: IAboutFeature[];
}

export interface IAboutFeature {
	icon?: string;
	title?: string;
	description?: string;
	image?: string; // Background image for image-based card design
	buttonText?: string; // Optional button text for image-based cards
	buttonLink?: string; // Optional button link for image-based cards
}

const AboutFeatureSchema = new Schema<IAboutFeature>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		image: { type: String, trim: true },
		buttonText: { type: String, trim: true },
		buttonLink: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutMissionSectionSchema = new Schema<IAboutMissionSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		image: { type: String, trim: true },
		features: { type: [AboutFeatureSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// STATS SECTION
// ============================================================================
export interface IAboutStat {
	value?: string;
	label?: string;
	suffix?: string;
}

const AboutStatSchema = new Schema<IAboutStat>(
	{
		value: { type: String, trim: true },
		label: { type: String, trim: true },
		suffix: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// IMAGE GALLERY SECTION
// ============================================================================
export interface IAboutGalleryImage {
	src?: string;
	alt?: string;
}

export interface IAboutImageGallerySection {
	title?: string;
	subtitle?: string;
	images?: IAboutGalleryImage[];
}

const AboutGalleryImageSchema = new Schema<IAboutGalleryImage>(
	{
		src: { type: String, trim: true },
		alt: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutImageGallerySectionSchema = new Schema<IAboutImageGallerySection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		images: { type: [AboutGalleryImageSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// FAQ SECTION
// ============================================================================
export interface IAboutFaqItem {
	question?: string;
	answer?: string;
}

export interface IAboutFaqSection {
	title?: string;
	subtitle?: string;
	items?: IAboutFaqItem[];
}

const AboutFaqItemSchema = new Schema<IAboutFaqItem>(
	{
		question: { type: String, trim: true },
		answer: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutFaqSectionSchema = new Schema<IAboutFaqSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		items: { type: [AboutFaqItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
export interface IAboutTestimonial {
	quote?: string;
	author?: string;
	role?: string;
	company?: string;
	image?: string;
	rating?: number;
}

export interface IAboutTestimonialsSection {
	title?: string;
	subtitle?: string;
	testimonials?: IAboutTestimonial[];
}

const AboutTestimonialSchema = new Schema<IAboutTestimonial>(
	{
		quote: { type: String, trim: true },
		author: { type: String, trim: true },
		role: { type: String, trim: true },
		company: { type: String, trim: true },
		image: { type: String, trim: true },
		rating: { type: Number, min: 1, max: 5, default: 5 },
	},
	{ _id: false }
);

const AboutTestimonialsSectionSchema = new Schema<IAboutTestimonialsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		testimonials: { type: [AboutTestimonialSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// PARTNERS SECTION
// ============================================================================
export interface IAboutPartner {
	name?: string;
	logo?: string;
	url?: string;
}

export interface IAboutPartnersSection {
	title?: string;
	subtitle?: string;
	partners?: IAboutPartner[];
}

const AboutPartnerSchema = new Schema<IAboutPartner>(
	{
		name: { type: String, trim: true },
		logo: { type: String, trim: true },
		url: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutPartnersSectionSchema = new Schema<IAboutPartnersSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		partners: { type: [AboutPartnerSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface IAboutCtaButton {
	text?: string;
	href?: string;
}

export interface IAboutCtaSection {
	title?: string;
	description?: string;
	primaryCta?: IAboutCtaButton;
	secondaryCta?: IAboutCtaButton;
}

const AboutCtaButtonSchema = new Schema<IAboutCtaButton>(
	{
		text: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutCtaSectionSchema = new Schema<IAboutCtaSection>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		primaryCta: { type: AboutCtaButtonSchema },
		secondaryCta: { type: AboutCtaButtonSchema },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface IAboutPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const AboutPageSeoSchema = new Schema<IAboutPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN ABOUT PAGE
// ============================================================================
export interface IAboutPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IAboutSectionVisibility;
	hero: IAboutHeroSection;
	mission: IAboutMissionSection;
	stats: IAboutStat[];
	imageGallery: IAboutImageGallerySection;
	faq: IAboutFaqSection;
	testimonials: IAboutTestimonialsSection;
	partners: IAboutPartnersSection;
	cta: IAboutCtaSection;
	seo: IAboutPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const AboutPageSchema = new Schema<IAboutPage>(
	{
		sectionVisibility: {
			type: AboutSectionVisibilitySchema,
			default: {
				hero: true,
				mission: true,
				stats: true,
				imageGallery: true,
				faq: true,
				testimonials: true,
				partners: true,
				cta: true,
			},
		},
		hero: { type: AboutHeroSectionSchema, default: {} },
		mission: { type: AboutMissionSectionSchema, default: {} },
		stats: { type: [AboutStatSchema], default: [] },
		imageGallery: { type: AboutImageGallerySectionSchema, default: {} },
		faq: { type: AboutFaqSectionSchema, default: {} },
		testimonials: { type: AboutTestimonialsSectionSchema, default: {} },
		partners: { type: AboutPartnersSectionSchema, default: {} },
		cta: { type: AboutCtaSectionSchema, default: {} },
		seo: { type: AboutPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "about_page",
	}
);

// Ensure virtuals are included in JSON
AboutPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

AboutPageSchema.set("toObject", { virtuals: true });

/**
 * Get AboutPage Model
 */
export const getAboutPageModel = async (): Promise<Model<IAboutPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.AboutPage as Model<IAboutPage>) ||
		mongoose.model<IAboutPage>("AboutPage", AboutPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getAboutPageModelSync(): Model<IAboutPage> {
	return (
		(mongoose.models.AboutPage as Model<IAboutPage>) ||
		mongoose.model<IAboutPage>("AboutPage", AboutPageSchema)
	);
}
