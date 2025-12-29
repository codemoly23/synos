import { connectMongoose } from "@/lib/db/db-connect";
import {
	getVarforValjaSynosPageModelSync,
	type IVarforValjaSynosPage,
} from "@/models/varfor-valja-synos-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type VarforValjaSynosPageData = Omit<IVarforValjaSynosPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class VarforValjaSynosPageRepository {
	/**
	 * Get the varfor valja synos page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<VarforValjaSynosPageData> {
		await connectMongoose();
		const VarforValjaSynosPage = getVarforValjaSynosPageModelSync();

		let page = await VarforValjaSynosPage.findOne().lean<VarforValjaSynosPageData>();

		if (!page) {
			// Create default document
			const newPage = await VarforValjaSynosPage.create({});
			page = newPage.toObject() as VarforValjaSynosPageData;
		}

		return serialize(page);
	}

	/**
	 * Update the varfor valja synos page data
	 */
	async update(
		data: Partial<VarforValjaSynosPageData>
	): Promise<VarforValjaSynosPageData> {
		await connectMongoose();
		const VarforValjaSynosPage = getVarforValjaSynosPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await VarforValjaSynosPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<VarforValjaSynosPageData>();

		if (!updated) {
			throw new Error("Failed to update varfor valja synos page");
		}

		return serialize(updated);
	}
}

export const varforValjaSynosPageRepository = new VarforValjaSynosPageRepository();
