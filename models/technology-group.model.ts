import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface ITechnologyGroup extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

const TechnologyGroupSchema = new Schema<ITechnologyGroup>(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			maxlength: [100, "Name cannot exceed 100 characters"],
			unique: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		collection: "technology_groups",
	}
);

TechnologyGroupSchema.index({ isActive: 1, order: 1 });

TechnologyGroupSchema.set("toJSON", {
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

export const getTechnologyGroupModel = async (): Promise<Model<ITechnologyGroup>> => {
	await connectMongoose();
	return (
		(mongoose.models.TechnologyGroup as Model<ITechnologyGroup>) ||
		mongoose.model<ITechnologyGroup>("TechnologyGroup", TechnologyGroupSchema)
	);
};

export function getTechnologyGroupModelSync(): Model<ITechnologyGroup> {
	return (
		(mongoose.models.TechnologyGroup as Model<ITechnologyGroup>) ||
		mongoose.model<ITechnologyGroup>("TechnologyGroup", TechnologyGroupSchema)
	);
}
