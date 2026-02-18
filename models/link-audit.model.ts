import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// AUDITED LINK (sub-document stored within the audit report)
// ============================================================================
export interface IAuditedLink {
	url: string;
	sourceModel: string;
	sourceField: string;
	sourceId?: string;
	sourceTitle?: string;
	statusCode?: number;
	status: "ok" | "broken" | "redirect" | "mixed-content" | "timeout" | "error";
	redirectChain?: string[];
	isExternal: boolean;
	isMixedContent: boolean;
	responseTime?: number;
	error?: string;
	rel?: string;
}

const AuditedLinkSchema = new Schema<IAuditedLink>(
	{
		url: { type: String, required: true, trim: true },
		sourceModel: { type: String, required: true, trim: true },
		sourceField: { type: String, required: true, trim: true },
		sourceId: { type: String, trim: true },
		sourceTitle: { type: String, trim: true },
		statusCode: { type: Number },
		status: {
			type: String,
			enum: ["ok", "broken", "redirect", "mixed-content", "timeout", "error"],
			required: true,
		},
		redirectChain: [{ type: String }],
		isExternal: { type: Boolean, default: false },
		isMixedContent: { type: Boolean, default: false },
		responseTime: { type: Number },
		error: { type: String, trim: true },
		rel: { type: String, trim: true },
	},
	{ _id: true }
);

// ============================================================================
// LINK AUDIT REPORT
// ============================================================================
export interface ILinkAudit extends Document {
	_id: mongoose.Types.ObjectId;
	status: "running" | "completed" | "failed" | "cancelled";
	type: "full" | "internal" | "external";
	totalLinks: number;
	checkedLinks: number;
	brokenLinks: number;
	redirectLinks: number;
	mixedContentLinks: number;
	externalBrokenLinks: number;
	okLinks: number;
	timeoutLinks: number;
	duration?: number;
	links: IAuditedLink[];
	startedAt: Date;
	completedAt?: Date;
	updatedAt: Date;
	createdAt: Date;
}

const LinkAuditSchema = new Schema<ILinkAudit>(
	{
		status: {
			type: String,
			enum: ["running", "completed", "failed", "cancelled"],
			default: "running",
		},
		type: {
			type: String,
			enum: ["full", "internal", "external"],
			default: "full",
		},
		totalLinks: { type: Number, default: 0 },
		checkedLinks: { type: Number, default: 0 },
		brokenLinks: { type: Number, default: 0 },
		redirectLinks: { type: Number, default: 0 },
		mixedContentLinks: { type: Number, default: 0 },
		externalBrokenLinks: { type: Number, default: 0 },
		okLinks: { type: Number, default: 0 },
		timeoutLinks: { type: Number, default: 0 },
		duration: { type: Number },
		links: { type: [AuditedLinkSchema], default: [] },
		startedAt: { type: Date, default: Date.now },
		completedAt: { type: Date },
	},
	{
		timestamps: true,
		collection: "link_audits",
	}
);

LinkAuditSchema.index({ status: 1 });
LinkAuditSchema.index({ createdAt: -1 });

LinkAuditSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

LinkAuditSchema.set("toObject", { virtuals: true });

export const getLinkAuditModel = async (): Promise<Model<ILinkAudit>> => {
	await connectMongoose();
	return (
		(mongoose.models.LinkAudit as Model<ILinkAudit>) ||
		mongoose.model<ILinkAudit>("LinkAudit", LinkAuditSchema)
	);
};

export function getLinkAuditModelSync(): Model<ILinkAudit> {
	if (process.env.NODE_ENV === "development" && mongoose.models.LinkAudit) {
		delete mongoose.models.LinkAudit;
	}
	return (
		(mongoose.models.LinkAudit as Model<ILinkAudit>) ||
		mongoose.model<ILinkAudit>("LinkAudit", LinkAuditSchema)
	);
}
