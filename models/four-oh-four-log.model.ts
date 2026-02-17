import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// 404 LOG ENTRY
// ============================================================================
export interface IFourOhFourLog extends Document {
	_id: mongoose.Types.ObjectId;
	url: string;
	hits: number;
	lastHitAt: Date;
	firstHitAt: Date;
	referrer?: string;
	userAgent?: string;
	redirectUrl?: string;
	isRedirectActive: boolean;
	updatedAt: Date;
	createdAt: Date;
}

const FourOhFourLogSchema = new Schema<IFourOhFourLog>(
	{
		url: { type: String, required: true, trim: true },
		hits: { type: Number, default: 1 },
		lastHitAt: { type: Date, default: Date.now },
		firstHitAt: { type: Date, default: Date.now },
		referrer: { type: String, trim: true },
		userAgent: { type: String, trim: true },
		redirectUrl: { type: String, trim: true, default: "" },
		isRedirectActive: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		collection: "four_oh_four_logs",
	}
);

// Indexes
FourOhFourLogSchema.index({ url: 1 }, { unique: true });
FourOhFourLogSchema.index({ hits: -1, lastHitAt: -1 });
FourOhFourLogSchema.index({ isRedirectActive: 1 });

FourOhFourLogSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

FourOhFourLogSchema.set("toObject", { virtuals: true });

/**
 * Get FourOhFourLog Model
 */
export const getFourOhFourLogModel =
	async (): Promise<Model<IFourOhFourLog>> => {
		await connectMongoose();

		return (
			(mongoose.models.FourOhFourLog as Model<IFourOhFourLog>) ||
			mongoose.model<IFourOhFourLog>(
				"FourOhFourLog",
				FourOhFourLogSchema
			)
		);
	};

/**
 * Export synchronous model getter for use in repositories
 */
export function getFourOhFourLogModelSync(): Model<IFourOhFourLog> {
	if (
		process.env.NODE_ENV === "development" &&
		mongoose.models.FourOhFourLog
	) {
		delete mongoose.models.FourOhFourLog;
	}
	return (
		(mongoose.models.FourOhFourLog as Model<IFourOhFourLog>) ||
		mongoose.model<IFourOhFourLog>("FourOhFourLog", FourOhFourLogSchema)
	);
}
