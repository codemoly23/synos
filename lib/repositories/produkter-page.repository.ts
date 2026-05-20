import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getProdukterPageModelSync,
	type IProdukterPage,
	type IProdukterFaqSection,
	type IProdukterFaq,
} from "@/models/produkter-page.model";

export interface UpdateProdukterPageInput {
	faqSection?: {
		title?: string;
		faqs?: Array<Partial<IProdukterFaq>>;
	};
}

export type ProdukterPageData = Omit<IProdukterPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class ProdukterPageRepository {
	async get(): Promise<ProdukterPageData> {
		await connectMongoose();
		const ProdukterPage = getProdukterPageModelSync();

		let page = await ProdukterPage.findOne().lean<ProdukterPageData>();

		if (!page) {
			const created = await ProdukterPage.create({});
			page = created.toObject() as ProdukterPageData;
		}

		return serialize(page);
	}

	async update(
		data: UpdateProdukterPageInput
	): Promise<ProdukterPageData> {
		await connectMongoose();
		const ProdukterPage = getProdukterPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.faqSection) {
			if (data.faqSection.title !== undefined) {
				updateData["faqSection.title"] = data.faqSection.title;
			}
			if (data.faqSection.faqs !== undefined) {
				updateData["faqSection.faqs"] = data.faqSection.faqs;
			}
		}

		const updated = await ProdukterPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<ProdukterPageData>();

		if (!updated) {
			throw new Error("Failed to update produkter page");
		}

		return serialize(updated);
	}

	async getFaqSection(): Promise<IProdukterFaqSection> {
		const page = await this.get();
		return page.faqSection;
	}
}

export const produkterPageRepository = new ProdukterPageRepository();
