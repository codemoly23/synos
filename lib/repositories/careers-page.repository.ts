import { connectMongoose } from "@/lib/db/db-connect";
import {
	getCareersPageModelSync,
	type ICareersPage,
} from "@/models/careers-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type CareersPageData = Omit<ICareersPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class CareersPageRepository {
	/**
	 * Get the careers page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<CareersPageData> {
		await connectMongoose();
		const CareersPage = getCareersPageModelSync();

		let careersPage = await CareersPage.findOne().lean<CareersPageData>();

		if (!careersPage) {
			// Create default document
			const newPage = await CareersPage.create({});
			careersPage = newPage.toObject() as CareersPageData;
		}

		return serialize(careersPage);
	}

	/**
	 * Update the careers page data
	 */
	async update(data: Partial<CareersPageData>): Promise<CareersPageData> {
		await connectMongoose();
		const CareersPage = getCareersPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await CareersPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<CareersPageData>();

		if (!updated) {
			throw new Error("Failed to update careers page");
		}

		return serialize(updated);
	}
}

export const careersPageRepository = new CareersPageRepository();
