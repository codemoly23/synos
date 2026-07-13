import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getAboutPageModelSync,
	ABOUT_PAGE_SINGLETON_KEY,
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

		let aboutPage: AboutPageData | null;
		try {
			aboutPage = await AboutPage.findOneAndUpdate(
				{ singleton: ABOUT_PAGE_SINGLETON_KEY },
				{ $setOnInsert: { singleton: ABOUT_PAGE_SINGLETON_KEY } },
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			).lean<AboutPageData>();
		} catch (err) {
			// A concurrent request won the upsert race (duplicate key) — just re-read it.
			if ((err as { code?: number }).code === 11000) {
				aboutPage = await AboutPage.findOne({
					singleton: ABOUT_PAGE_SINGLETON_KEY,
				}).lean<AboutPageData>();
			} else {
				throw err;
			}
		}

		if (!aboutPage) {
			throw new Error("Failed to load about page");
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
			Object.entries(data.sectionVisibility).forEach(([key, value]) => {
				updateData[`sectionVisibility.${key}`] = value;
			});
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
			// Set each field explicitly to ensure nested objects like groupCooperation are saved
			if (data.testimonials.title !== undefined) {
				updateData["testimonials.title"] = data.testimonials.title;
			}
			if (data.testimonials.subtitle !== undefined) {
				updateData["testimonials.subtitle"] = data.testimonials.subtitle;
			}
			if (data.testimonials.testimonials !== undefined) {
				updateData["testimonials.testimonials"] = data.testimonials.testimonials;
			}
			if (data.testimonials.groupCooperation !== undefined) {
				updateData["testimonials.groupCooperation"] = data.testimonials.groupCooperation;
			}
			if (data.testimonials.ctaTitle !== undefined) {
				updateData["testimonials.ctaTitle"] = data.testimonials.ctaTitle;
			}
			if (data.testimonials.ctaDescription !== undefined) {
				updateData["testimonials.ctaDescription"] = data.testimonials.ctaDescription;
			}
			if (data.testimonials.ctaButtonText !== undefined) {
				updateData["testimonials.ctaButtonText"] = data.testimonials.ctaButtonText;
			}
			if (data.testimonials.ctaButtonLink !== undefined) {
				updateData["testimonials.ctaButtonLink"] = data.testimonials.ctaButtonLink;
			}
			if (data.testimonials.rating !== undefined) {
				updateData["testimonials.rating"] = data.testimonials.rating;
			}
			if (data.testimonials.reviewCount !== undefined) {
				updateData["testimonials.reviewCount"] = data.testimonials.reviewCount;
			}
			if (data.testimonials.reviewCountLabel !== undefined) {
				updateData["testimonials.reviewCountLabel"] = data.testimonials.reviewCountLabel;
			}
			if (data.testimonials.reviewPlatforms !== undefined) {
				updateData["testimonials.reviewPlatforms"] = data.testimonials.reviewPlatforms;
			}
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
			{ singleton: ABOUT_PAGE_SINGLETON_KEY },
			{ $set: updateData, $setOnInsert: { singleton: ABOUT_PAGE_SINGLETON_KEY } },
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
