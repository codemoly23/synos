import { connectMongoose } from "@/lib/db/db-connect";
import {
	getStartaEgetPageModelSync,
	type IStartaEgetPage,
} from "@/models/starta-eget-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type StartaEgetPageData = Omit<IStartaEgetPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class StartaEgetPageRepository {
	/**
	 * Get the starta eget page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<StartaEgetPageData> {
		await connectMongoose();
		const StartaEgetPage = getStartaEgetPageModelSync();

		let startaEgetPage =
			await StartaEgetPage.findOne().lean<StartaEgetPageData>();

		if (!startaEgetPage) {
			// Create default document
			const newPage = await StartaEgetPage.create({});
			startaEgetPage = newPage.toObject() as StartaEgetPageData;
		}

		return serialize(startaEgetPage);
	}

	/**
	 * Update the starta eget page data
	 */
	async update(data: Partial<StartaEgetPageData>): Promise<StartaEgetPageData> {
		await connectMongoose();
		const StartaEgetPage = getStartaEgetPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await StartaEgetPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<StartaEgetPageData>();

		if (!updated) {
			throw new Error("Failed to update starta eget page");
		}

		return serialize(updated);
	}
}

export const startaEgetPageRepository = new StartaEgetPageRepository();
