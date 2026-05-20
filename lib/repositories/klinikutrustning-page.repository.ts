import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getKlinikutrustningPageModelSync,
	type IKlinikutrustningPage,
	type IKlinikFaqSection,
	type IKlinikHeroSection,
	type IKlinikFaq,
} from "@/models/klinikutrustning-page.model";

export interface UpdateKlinikutrustningPageInput {
	faqSection?: {
		title?: string;
		faqs?: Array<Partial<IKlinikFaq>>;
	};
	heroSection?: {
		title?: string;
		subtitle?: string;
		bulletPoints?: string[];
		bgMobile?: string;
		bgDesktop?: string;
	};
}

export type KlinikutrustningPageData = Omit<
	IKlinikutrustningPage,
	keyof Document
>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class KlinikutrustningPageRepository {
	async get(): Promise<KlinikutrustningPageData> {
		await connectMongoose();
		const KlinikutrustningPage = getKlinikutrustningPageModelSync();

		let page = await KlinikutrustningPage.findOne().lean<KlinikutrustningPageData>();

		if (!page) {
			const created = await KlinikutrustningPage.create({});
			page = created.toObject() as KlinikutrustningPageData;
		}

		return serialize(page);
	}

	async update(
		data: UpdateKlinikutrustningPageInput
	): Promise<KlinikutrustningPageData> {
		await connectMongoose();
		const KlinikutrustningPage = getKlinikutrustningPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.faqSection) {
			if (data.faqSection.title !== undefined) {
				updateData["faqSection.title"] = data.faqSection.title;
			}
			if (data.faqSection.faqs !== undefined) {
				updateData["faqSection.faqs"] = data.faqSection.faqs;
			}
		}

		if (data.heroSection) {
			const h = data.heroSection;
			if (h.title !== undefined) updateData["heroSection.title"] = h.title;
			if (h.subtitle !== undefined) updateData["heroSection.subtitle"] = h.subtitle;
			if (h.bulletPoints !== undefined) updateData["heroSection.bulletPoints"] = h.bulletPoints;
			if (h.bgMobile !== undefined) updateData["heroSection.bgMobile"] = h.bgMobile;
			if (h.bgDesktop !== undefined) updateData["heroSection.bgDesktop"] = h.bgDesktop;
		}

		const updated = await KlinikutrustningPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<KlinikutrustningPageData>();

		if (!updated) {
			throw new Error("Failed to update klinikutrustning page");
		}

		return serialize(updated);
	}

	async getFaqSection(): Promise<IKlinikFaqSection> {
		const page = await this.get();
		return page.faqSection;
	}

	async getHeroSection(): Promise<IKlinikHeroSection> {
		const page = await this.get();
		return page.heroSection ?? { title: "", subtitle: "", bulletPoints: [], bgMobile: "", bgDesktop: "" };
	}
}

export const klinikutrustningPageRepository =
	new KlinikutrustningPageRepository();
