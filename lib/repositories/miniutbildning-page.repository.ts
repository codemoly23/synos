import { connectMongoose } from "@/lib/db/db-connect";
import {
	getMiniutbildningPageModelSync,
	type IMiniutbildningPage,
} from "@/models/miniutbildning-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type MiniutbildningPageData = Omit<IMiniutbildningPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class MiniutbildningPageRepository {
	/**
	 * Get the miniutbildning page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<MiniutbildningPageData> {
		await connectMongoose();
		const MiniutbildningPage = getMiniutbildningPageModelSync();

		let page = await MiniutbildningPage.findOne().lean<MiniutbildningPageData>();

		if (!page) {
			// Create default document
			const newPage = await MiniutbildningPage.create({});
			page = newPage.toObject() as MiniutbildningPageData;
		}

		return serialize(page);
	}

	/**
	 * Update the miniutbildning page data
	 */
	async update(
		data: Partial<MiniutbildningPageData>
	): Promise<MiniutbildningPageData> {
		await connectMongoose();
		const MiniutbildningPage = getMiniutbildningPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await MiniutbildningPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<MiniutbildningPageData>();

		if (!updated) {
			throw new Error("Failed to update miniutbildning page");
		}

		return serialize(updated);
	}
}

export const miniutbildningPageRepository = new MiniutbildningPageRepository();
