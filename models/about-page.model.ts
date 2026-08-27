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
	richContent: boolean;
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
		richContent: { type: Boolean, default: false },
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
	mobileImage?: string;
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
		mobileImage: { type: String, trim: true },
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
	mobileSrc?: string;
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
		mobileSrc: { type: String, trim: true },
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

export interface IAboutFaqContactCard {
	title?: string;
	formTitle?: string;
}

export interface IAboutFaqSection {
	title?: string;
	subtitle?: string;
	items?: IAboutFaqItem[];
	contactCard?: IAboutFaqContactCard;
}

const AboutFaqItemSchema = new Schema<IAboutFaqItem>(
	{
		question: { type: String, trim: true },
		answer: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutFaqContactCardSchema = new Schema<IAboutFaqContactCard>(
	{
		title: { type: String, trim: true },
		formTitle: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutFaqSectionSchema = new Schema<IAboutFaqSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		items: { type: [AboutFaqItemSchema], default: [] },
		contactCard: { type: AboutFaqContactCardSchema, default: {} },
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

export interface IAboutTeamMember {
	image?: string;
	name?: string;
}

export interface IAboutGroupCooperation {
	backgroundImage?: string;
	title?: string;
	teamMembers?: IAboutTeamMember[];
}

export interface IAboutReviewPlatform {
	icon?: string;
	iconColor?: string;
	url?: string;
}

export interface IAboutTestimonialsSection {
	title?: string;
	subtitle?: string;
	testimonials?: IAboutTestimonial[];
	groupCooperation?: IAboutGroupCooperation;
	ctaTitle?: string;
	ctaDescription?: string;
	ctaButtonText?: string;
	ctaButtonLink?: string;
	rating?: number;
	reviewCount?: string;
	reviewCountLabel?: string;
	reviewPlatforms?: IAboutReviewPlatform[];
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

const AboutTeamMemberSchema = new Schema<IAboutTeamMember>(
	{
		image: { type: String, trim: true },
		name: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutGroupCooperationSchema = new Schema<IAboutGroupCooperation>(
	{
		backgroundImage: { type: String, trim: true },
		title: { type: String, trim: true },
		teamMembers: { type: [AboutTeamMemberSchema], default: [] },
	},
	{ _id: false }
);

const AboutReviewPlatformSchema = new Schema<IAboutReviewPlatform>(
	{
		icon: { type: String, trim: true },
		iconColor: { type: String, trim: true },
		url: { type: String, trim: true },
	},
	{ _id: false }
);

const AboutTestimonialsSectionSchema = new Schema<IAboutTestimonialsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		testimonials: { type: [AboutTestimonialSchema], default: [] },
		groupCooperation: { type: AboutGroupCooperationSchema, default: {} },
		ctaTitle: {
			type: String,
			trim: true,
			default: "Trusted By Over 1300 Loyal Clients",
		},
		ctaDescription: {
			type: String,
			trim: true,
			default:
				"Ad litora torquent per conubia nostra inceptos himenaeos. Dis parturient montes nascetur ridiculus mus donec.",
		},
		ctaButtonText: { type: String, trim: true, default: "Contact Us" },
		ctaButtonLink: { type: String, trim: true, default: "/kontakt" },
		rating: { type: Number, min: 0, max: 5, default: 4.8 },
		reviewCount: { type: String, trim: true, default: "2,568" },
		reviewCountLabel: {
			type: String,
			trim: true,
			default: "Reviews and counting",
		},
		reviewPlatforms: {
			type: [AboutReviewPlatformSchema],
			default: [
				{ icon: "🍎", iconColor: "", url: "" },
				{ icon: "G", iconColor: "#4285F4", url: "" },
				{ icon: "▶", iconColor: "#EF4444", url: "" },
			],
		},
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
	badge?: string;
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
		badge: { type: String, trim: true },
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
export const ABOUT_PAGE_SINGLETON_KEY = "singleton";

export interface IAboutPage extends Document {
	_id: mongoose.Types.ObjectId;
	singleton: string;
	sectionVisibility: IAboutSectionVisibility;
	hero: IAboutHeroSection;
	mission: IAboutMissionSection;
	stats: IAboutStat[];
	imageGallery: IAboutImageGallerySection;
	faq: IAboutFaqSection;
	testimonials: IAboutTestimonialsSection;
	partners: IAboutPartnersSection;
	cta: IAboutCtaSection;
	richContent: string;
	seo: IAboutPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const AboutPageSchema = new Schema<IAboutPage>(
	{
		singleton: {
			type: String,
			default: ABOUT_PAGE_SINGLETON_KEY,
			required: true,
			unique: true,
		},
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
				richContent: false,
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
		richContent: { type: String, default: "" },
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
