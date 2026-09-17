import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface ITechnologyCategoriesPage extends Document {
	_id: mongoose.Types.ObjectId;
	description: string;
	updatedAt: Date;
	createdAt: Date;
}

const TechnologyCategoriesPageSchema = new Schema<ITechnologyCategoriesPage>(
	{
		description: { type: String, default: "" },
	},
	{
		timestamps: true,
		collection: "technology_categories_page",
	}
);

TechnologyCategoriesPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

TechnologyCategoriesPageSchema.set("toObject", { virtuals: true });

function buildModel(): Model<ITechnologyCategoriesPage> {
	const cached = mongoose.models.TechnologyCategoriesPage as Model<ITechnologyCategoriesPage> | undefined;
	if (cached) return cached;
	return mongoose.model<ITechnologyCategoriesPage>("TechnologyCategoriesPage", TechnologyCategoriesPageSchema);
}

export const getTechnologyCategoriesPageModel = async (): Promise<Model<ITechnologyCategoriesPage>> => {
	await connectMongoose();
	return buildModel();
};

export function getTechnologyCategoriesPageModelSync(): Model<ITechnologyCategoriesPage> {
	return buildModel();
}
