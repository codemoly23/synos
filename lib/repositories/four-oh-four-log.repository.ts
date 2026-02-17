import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getFourOhFourLogModelSync,
	type IFourOhFourLog,
} from "@/models/four-oh-four-log.model";

/**
 * Plain object type for FourOhFourLog
 */
export type FourOhFourLogData = Omit<IFourOhFourLog, keyof Document>;

export interface PaginatedFourOhFourLogs {
	data: FourOhFourLogData[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface FourOhFourLogStats {
	totalEntries: number;
	totalHits: number;
	activeRedirects: number;
}

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * FourOhFourLog Repository
 */
class FourOhFourLogRepository {
	/**
	 * Log a 404 hit - atomic upsert with increment
	 */
	async logHit(
		url: string,
		referrer?: string,
		userAgent?: string
	): Promise<void> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const now = new Date();
		const updateFields: Record<string, unknown> = { lastHitAt: now };
		if (referrer) updateFields.referrer = referrer;
		if (userAgent) updateFields.userAgent = userAgent;

		await FourOhFourLog.findOneAndUpdate(
			{ url },
			{
				$inc: { hits: 1 },
				$set: updateFields,
				$setOnInsert: {
					firstHitAt: now,
					isRedirectActive: false,
					redirectUrl: "",
				},
			},
			{ upsert: true }
		);
	}

	/**
	 * Get paginated 404 logs
	 */
	async findPaginated(options: {
		page: number;
		limit: number;
		search?: string;
		sort?: string;
	}): Promise<PaginatedFourOhFourLogs> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const { page, limit, search, sort = "-hits" } = options;
		const skip = (page - 1) * limit;

		const filter: Record<string, unknown> = {};
		if (search) {
			filter.url = { $regex: search, $options: "i" };
		}

		// Parse sort string (e.g., "-hits" -> { hits: -1 })
		const sortObj: Record<string, 1 | -1> = {};
		if (sort.startsWith("-")) {
			sortObj[sort.slice(1)] = -1;
		} else {
			sortObj[sort] = 1;
		}

		const [data, total] = await Promise.all([
			FourOhFourLog.find(filter)
				.sort(sortObj)
				.skip(skip)
				.limit(limit)
				.lean<FourOhFourLogData[]>(),
			FourOhFourLog.countDocuments(filter),
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
	 * Update redirect URL for a log entry
	 */
	async updateRedirect(
		id: string,
		redirectUrl: string
	): Promise<FourOhFourLogData | null> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const log = await FourOhFourLog.findByIdAndUpdate(
			id,
			{ $set: { redirectUrl, isRedirectActive: true } },
			{ new: true }
		).lean<FourOhFourLogData>();

		return log ? serialize(log) : null;
	}

	/**
	 * Remove redirect from a log entry
	 */
	async removeRedirect(id: string): Promise<FourOhFourLogData | null> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const log = await FourOhFourLog.findByIdAndUpdate(
			id,
			{ $set: { redirectUrl: "", isRedirectActive: false } },
			{ new: true }
		).lean<FourOhFourLogData>();

		return log ? serialize(log) : null;
	}

	/**
	 * Delete a single log entry
	 */
	async deleteById(id: string): Promise<void> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		await FourOhFourLog.findByIdAndDelete(id);
	}

	/**
	 * Delete multiple log entries
	 */
	async deleteMany(ids: string[]): Promise<number> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const result = await FourOhFourLog.deleteMany({
			_id: { $in: ids },
		});
		return result.deletedCount;
	}

	/**
	 * Get all active redirects (used by middleware)
	 */
	async getActiveRedirects(): Promise<
		Array<{ url: string; redirectUrl: string }>
	> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const redirects = await FourOhFourLog.find(
			{ isRedirectActive: true, redirectUrl: { $ne: "" } },
			{ url: 1, redirectUrl: 1, _id: 0 }
		).lean<Array<{ url: string; redirectUrl: string }>>();

		return serialize(redirects);
	}

	/**
	 * Get statistics
	 */
	async getStats(): Promise<FourOhFourLogStats> {
		await connectMongoose();
		const FourOhFourLog = getFourOhFourLogModelSync();

		const [totalEntries, activeRedirects, hitsResult] = await Promise.all([
			FourOhFourLog.countDocuments(),
			FourOhFourLog.countDocuments({ isRedirectActive: true }),
			FourOhFourLog.aggregate([
				{ $group: { _id: null, totalHits: { $sum: "$hits" } } },
			]),
		]);

		return {
			totalEntries,
			totalHits: hitsResult[0]?.totalHits || 0,
			activeRedirects,
		};
	}
}

// Export singleton instance
export const fourOhFourLogRepository = new FourOhFourLogRepository();
