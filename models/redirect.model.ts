import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// REDIRECT ENTRY
// ============================================================================
export interface IRedirect extends Document {
	_id: mongoose.Types.ObjectId;
	fromUrl: string;
	toUrl: string;
	statusCode: number;
	source: "manual" | "auto";
	isActive: boolean;
	createdBy?: mongoose.Types.ObjectId;
	updatedAt: Date;
	createdAt: Date;
}

const RedirectSchema = new Schema<IRedirect>(
	{
		fromUrl: { type: String, required: true, trim: true },
		toUrl: { type: String, required: true, trim: true },
		statusCode: { type: Number, default: 301, enum: [301, 302] },
		source: { type: String, enum: ["manual", "auto"], default: "manual" },
		isActive: { type: Boolean, default: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
		collection: "redirects",
	}
);

// Indexes
RedirectSchema.index({ fromUrl: 1 }, { unique: true });
RedirectSchema.index({ isActive: 1 });

RedirectSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

RedirectSchema.set("toObject", { virtuals: true });

/**
 * Get Redirect Model
 */
export const getRedirectModel = async (): Promise<Model<IRedirect>> => {
	await connectMongoose();

	return (
		(mongoose.models.Redirect as Model<IRedirect>) ||
		mongoose.model<IRedirect>("Redirect", RedirectSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getRedirectModelSync(): Model<IRedirect> {
	if (process.env.NODE_ENV === "development" && mongoose.models.Redirect) {
		delete mongoose.models.Redirect;
	}
	return (
		(mongoose.models.Redirect as Model<IRedirect>) ||
		mongoose.model<IRedirect>("Redirect", RedirectSchema)
	);
}
