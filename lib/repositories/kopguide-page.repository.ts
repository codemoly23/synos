import { connectMongoose } from "@/lib/db/db-connect";
import {
	getKopguidePageModelSync,
	type IKopguidePage,
} from "@/models/kopguide-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type KopguidePageData = Omit<IKopguidePage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class KopguidePageRepository {
	/**
	 * Get the kopguide page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<KopguidePageData> {
		await connectMongoose();
		const KopguidePage = getKopguidePageModelSync();

		let page = await KopguidePage.findOne().lean<KopguidePageData>();

		if (!page) {
			// Create default document
			const newPage = await KopguidePage.create({});
			page = newPage.toObject() as KopguidePageData;
		}

		return serialize(page);
	}

	/**
	 * Update the kopguide page data
	 */
	async update(data: Partial<KopguidePageData>): Promise<KopguidePageData> {
		await connectMongoose();
		const KopguidePage = getKopguidePageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await KopguidePage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<KopguidePageData>();

		if (!updated) {
			throw new Error("Failed to update kopguide page");
		}

		return serialize(updated);
	}
}

export const kopguidePageRepository = new KopguidePageRepository();
