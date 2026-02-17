import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getLinkAuditModelSync,
	type ILinkAudit,
	type IAuditedLink,
} from "@/models/link-audit.model";

export type LinkAuditData = Omit<ILinkAudit, keyof Document> & { _id: string };

export interface PaginatedLinkAudits {
	data: LinkAuditData[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class LinkAuditRepository {
	/**
	 * Create a new audit (status = running)
	 */
	async create(type: "full" | "internal" | "external"): Promise<LinkAuditData> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		const audit = await LinkAudit.create({
			status: "running",
			type,
			startedAt: new Date(),
		});
		return serialize(audit.toObject() as unknown as LinkAuditData);
	}

	/**
	 * Update audit progress
	 */
	async updateProgress(
		id: string,
		data: {
			checkedLinks?: number;
			totalLinks?: number;
			brokenLinks?: number;
			redirectLinks?: number;
			mixedContentLinks?: number;
			externalBrokenLinks?: number;
			okLinks?: number;
			timeoutLinks?: number;
		}
	): Promise<void> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		await LinkAudit.findByIdAndUpdate(id, { $set: data });
	}

	/**
	 * Complete an audit with results
	 */
	async complete(
		id: string,
		links: IAuditedLink[],
		stats: {
			totalLinks: number;
			checkedLinks: number;
			brokenLinks: number;
			redirectLinks: number;
			mixedContentLinks: number;
			externalBrokenLinks: number;
			okLinks: number;
			timeoutLinks: number;
			duration: number;
		}
	): Promise<LinkAuditData> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		const audit = await LinkAudit.findByIdAndUpdate(
			id,
			{
				$set: {
					status: "completed",
					links,
					completedAt: new Date(),
					...stats,
				},
			},
			{ new: true }
		).lean<LinkAuditData>();

		if (!audit) throw new Error("Audit not found");
		return serialize(audit);
	}

	/**
	 * Mark audit as failed
	 */
	async fail(id: string, error: string): Promise<void> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		await LinkAudit.findByIdAndUpdate(id, {
			$set: {
				status: "failed",
				completedAt: new Date(),
			},
		});
	}

	/**
	 * Get latest audit
	 */
	async getLatest(): Promise<LinkAuditData | null> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		const audit = await LinkAudit.findOne()
			.sort({ createdAt: -1 })
			.lean<LinkAuditData>();
		return audit ? serialize(audit) : null;
	}

	/**
	 * Get audit by ID
	 */
	async getById(id: string): Promise<LinkAuditData | null> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		const audit = await LinkAudit.findById(id).lean<LinkAuditData>();
		return audit ? serialize(audit) : null;
	}

	/**
	 * Get paginated audit history (without links array for performance)
	 */
	async findPaginated(page: number, limit: number): Promise<PaginatedLinkAudits> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			LinkAudit.find()
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.select("-links")
				.lean<LinkAuditData[]>(),
			LinkAudit.countDocuments(),
		]);

		return {
			data: serialize(data),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	/**
	 * Delete an audit
	 */
	async deleteById(id: string): Promise<void> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		await LinkAudit.findByIdAndDelete(id);
	}

	/**
	 * Check if there's a running audit
	 */
	async hasRunningAudit(): Promise<boolean> {
		await connectMongoose();
		const LinkAudit = getLinkAuditModelSync();
		const running = await LinkAudit.findOne({ status: "running" }).lean();
		return !!running;
	}
}

export const linkAuditRepository = new LinkAuditRepository();
