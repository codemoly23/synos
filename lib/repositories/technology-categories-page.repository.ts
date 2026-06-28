import { connectMongoose } from "@/lib/db/db-connect";
import { getTechnologyCategoriesPageModelSync } from "@/models/technology-categories-page.model";

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class TechnologyCategoriesPageRepository {
	async get(): Promise<{ description: string }> {
		await connectMongoose();
		const Model = getTechnologyCategoriesPageModelSync();
		let page = await Model.findOne().lean<{ description: string }>();
		if (!page) {
			const created = await Model.create({ description: "" });
			page = created.toObject() as { description: string };
		}
		return serialize(page);
	}

	async update(data: { description: string }): Promise<{ description: string }> {
		await connectMongoose();
		const Model = getTechnologyCategoriesPageModelSync();
		const updated = await Model.findOneAndUpdate(
			{},
			{ $set: { description: data.description } },
			{ new: true, upsert: true, runValidators: true }
		).lean<{ description: string }>();
		if (!updated) throw new Error("Failed to update technology categories page");
		return serialize(updated);
	}
}

export const technologyCategoriesPageRepository = new TechnologyCategoriesPageRepository();
