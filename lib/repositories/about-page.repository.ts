import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getAboutPageModelSync,
	type IAboutPage,
	type IAboutHeroSection,
	type IAboutMissionSection,
	type IAboutStat,
	type IAboutImageGallerySection,
	type IAboutFaqSection,
	type IAboutTestimonialsSection,
	type IAboutPartnersSection,
	type IAboutCtaSection,
	type IAboutSectionVisibility,
	type IAboutPageSeo,
} from "@/models/about-page.model";

/**
 * Helper to convert Mongoose documents to plain serializable objects
 */
function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Type for updating about page
 */
export interface UpdateAboutPageInput {
	sectionVisibility?: IAboutSectionVisibility;
	hero?: Partial<IAboutHeroSection>;
	mission?: Partial<IAboutMissionSection>;
	stats?: IAboutStat[];
	imageGallery?: Partial<IAboutImageGallerySection>;
	faq?: Partial<IAboutFaqSection>;
	testimonials?: Partial<IAboutTestimonialsSection>;
	partners?: Partial<IAboutPartnersSection>;
	cta?: Partial<IAboutCtaSection>;
	seo?: Partial<IAboutPageSeo>;
}

/**
 * Plain object type for AboutPage
 */
export type AboutPageData = Omit<IAboutPage, keyof Document>;

/**
 * AboutPage Repository
 */
class AboutPageRepository {
	/**
	 * Get about page content
	 */
	async get(): Promise<AboutPageData> {
		await connectMongoose();
		const AboutPage = getAboutPageModelSync();

		let aboutPage = await AboutPage.findOne().lean<AboutPageData>();

		if (!aboutPage) {
			const created = await AboutPage.create({});
			aboutPage = created.toObject() as AboutPageData;
		}

		return toPlainObject(aboutPage);
	}

	/**
	 * Update about page content
	 */
	async update(data: UpdateAboutPageInput): Promise<AboutPageData> {
		await connectMongoose();
		const AboutPage = getAboutPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.sectionVisibility) {
			updateData.sectionVisibility = data.sectionVisibility;
		}

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`hero.${key}`] = value;
				}
			});
		}

		if (data.mission) {
			updateData.mission = data.mission;
		}

		if (data.stats) {
			updateData.stats = data.stats;
		}

		if (data.imageGallery) {
			updateData.imageGallery = data.imageGallery;
		}

		if (data.faq) {
			updateData.faq = data.faq;
		}

		if (data.testimonials) {
			updateData.testimonials = data.testimonials;
		}

		if (data.partners) {
			updateData.partners = data.partners;
		}

		if (data.cta) {
			Object.entries(data.cta).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`cta.${key}`] = value;
				}
			});
		}

		if (data.seo) {
			Object.entries(data.seo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`seo.${key}`] = value;
				}
			});
		}

		const aboutPage = await AboutPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<AboutPageData>();

		if (!aboutPage) {
			throw new Error("Failed to update about page");
		}

		return toPlainObject(aboutPage);
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<IAboutPageSeo> {
		const aboutPage = await this.get();
		return aboutPage.seo;
	}
}

// Export singleton instance
export const aboutPageRepository = new AboutPageRepository();
