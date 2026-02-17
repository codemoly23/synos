import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getCustom404PageModelSync,
	type ICustom404Page,
} from "@/models/custom-404-page.model";
import type { UpdateCustom404PageInput } from "@/lib/validations/custom-404-page.validation";

/**
 * Plain object type for Custom404Page
 */
export type Custom404PageData = Omit<ICustom404Page, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Custom404Page Repository
 */
class Custom404PageRepository {
	/**
	 * Get custom 404 page content
	 */
	async get(): Promise<Custom404PageData> {
		await connectMongoose();
		const Custom404Page = getCustom404PageModelSync();

		let page = await Custom404Page.findOne().lean<Custom404PageData>();

		if (!page) {
			const created = await Custom404Page.create({});
			page = created.toObject() as Custom404PageData;
		}

		return serialize(page);
	}

	/**
	 * Update custom 404 page content
	 */
	async update(data: UpdateCustom404PageInput): Promise<Custom404PageData> {
		await connectMongoose();
		const Custom404Page = getCustom404PageModelSync();

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

		if (data.suggestedPages) {
			updateData.suggestedPages = data.suggestedPages;
		}

		if (data.cta) {
			Object.entries(data.cta).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`cta.${key}`] = value;
				}
			});
		}

		const page = await Custom404Page.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<Custom404PageData>();

		if (!page) {
			throw new Error("Failed to update custom 404 page");
		}

		return serialize(page);
	}
}

// Export singleton instance
export const custom404PageRepository = new Custom404PageRepository();
