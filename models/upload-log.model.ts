import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Upload log entry — tracks anonymous public uploads by IP for rate limiting.
 */
export interface IUploadLog extends Document {
	_id: mongoose.Types.ObjectId;
	ip: string;
	createdAt: Date;
}

const UploadLogSchema = new Schema<IUploadLog>({
	ip: {
		type: String,
		required: true,
		index: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 60 * 60, // auto-delete after 1 hour
	},
});

/**
 * Get UploadLog Model
 */
export const getUploadLogModel = async (): Promise<Model<IUploadLog>> => {
	await connectMongoose();

	return (
		(mongoose.models.UploadLog as Model<IUploadLog>) ||
		mongoose.model<IUploadLog>("UploadLog", UploadLogSchema)
	);
};
