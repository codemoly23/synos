import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getKlinikutrustningPageModelSync,
	type IKlinikutrustningPage,
	type IKlinikFaqSection,
	type IKlinikFaq,
} from "@/models/klinikutrustning-page.model";

export interface UpdateKlinikutrustningPageInput {
	faqSection?: {
		title?: string;
		faqs?: Array<Partial<IKlinikFaq>>;
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
}

export const klinikutrustningPageRepository =
	new KlinikutrustningPageRepository();
