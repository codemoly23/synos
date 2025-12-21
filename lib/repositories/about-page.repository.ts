import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getAboutPageModelSync,
	type IAboutPage,
	type IAboutHeroSection,
	type IAboutContentSection,
	type IAboutContactSection,
	type IAboutFeatureCard,
	type IAboutCompanyInfo,
	type IAboutSectionVisibility,
	type IAboutPageSeo,
} from "@/models/about-page.model";

/**
 * Type for updating about page
 */
export interface UpdateAboutPageInput {
	sectionVisibility?: IAboutSectionVisibility;
	hero?: Partial<IAboutHeroSection>;
	contentSections?: IAboutContentSection[];
	contactSection?: Partial<IAboutContactSection>;
	featureCards?: IAboutFeatureCard[];
	companyInfo?: Partial<IAboutCompanyInfo>;
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

		return aboutPage;
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

		if (data.contentSections) {
			updateData.contentSections = data.contentSections;
		}

		if (data.contactSection) {
			Object.entries(data.contactSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`contactSection.${key}`] = value;
				}
			});
		}

		if (data.featureCards) {
			updateData.featureCards = data.featureCards;
		}

		if (data.companyInfo) {
			Object.entries(data.companyInfo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`companyInfo.${key}`] = value;
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

		return aboutPage;
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
