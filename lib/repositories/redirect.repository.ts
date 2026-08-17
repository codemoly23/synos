import type { Document, Types } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import { getRedirectModelSync, type IRedirect } from "@/models/redirect.model";

/**
 * Plain object type for Redirect
 */
export type RedirectData = Omit<IRedirect, keyof Document> & {
	_id: Types.ObjectId;
};

export interface PaginatedRedirects {
	data: RedirectData[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateRedirectInput {
	fromUrl: string;
	toUrl: string;
	statusCode?: number;
	source?: "manual" | "auto";
	createdBy?: string;
}

export interface UpdateRedirectInput {
	toUrl?: string;
	statusCode?: number;
	isActive?: boolean;
}

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Redirect Repository
 */
class RedirectRepository {
	/**
	 * Create a new redirect
	 */
	async create(input: CreateRedirectInput): Promise<RedirectData> {
		await connectMongoose();
		const Redirect = getRedirectModelSync();

		const redirect = await Redirect.create({
			fromUrl: input.fromUrl,
			toUrl: input.toUrl,
			statusCode: input.statusCode ?? 301,
			source: input.source ?? "manual",
			createdBy: input.createdBy,
		});

		return serialize(redirect.toObject() as RedirectData);
	}

	/**
	 * Find a redirect by its fromUrl
	 */
	async findByFromUrl(fromUrl: string): Promise<RedirectData | null> {
		await connectMongoose();
		const Redirect = getRedirectModelSync();

		const redirect = await Redirect.findOne({ fromUrl }).lean<RedirectData>();
		return redirect ? serialize(redirect) : null;
	}

	/**
	 * Get paginated redirects
	 */
	async findPaginated(options: {
		page: number;
		limit: number;
		search?: string;
		sort?: string;
	}): Promise<PaginatedRedirects> {
		await connectMongoose();
		const Redirect = getRedirectModelSync();

		const { page, limit, search, sort = "-createdAt" } = options;
		const skip = (page - 1) * limit;

		const filter: Record<string, unknown> = {};
		if (search) {
			filter.$or = [
				{ fromUrl: { $regex: search, $options: "i" } },
				{ toUrl: { $regex: search, $options: "i" } },
			];
		}

		const sortObj: Record<string, 1 | -1> = {};
		if (sort.startsWith("-")) {
			sortObj[sort.slice(1)] = -1;
		} else {
			sortObj[sort] = 1;
		}

		const [data, total] = await Promise.all([
			Redirect.find(filter)
				.sort(sortObj)
				.skip(skip)
				.limit(limit)
				.lean<RedirectData[]>(),
			Redirect.countDocuments(filter),
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
	 * Update a redirect
	 */
	async update(
		id: string,
		input: UpdateRedirectInput
	): Promise<RedirectData | null> {
		await connectMongoose();
		const Redirect = getRedirectModelSync();

		const redirect = await Redirect.findByIdAndUpdate(
			id,
			{ $set: input },
			{ returnDocument: "after" }
		).lean<RedirectData>();

		return redirect ? serialize(redirect) : null;
	}

	/**
	 * Delete a redirect
	 */
	async deleteById(id: string): Promise<void> {
		await connectMongoose();
		const Redirect = getRedirectModelSync();

		await Redirect.findByIdAndDelete(id);
	}

	/**
	 * Get all active redirects (used by the proxy)
	 */
	async getActiveRedirects(): Promise<
		Array<{ fromUrl: string; toUrl: string }>
	> {
		await connectMongoose();
		const Redirect = getRedirectModelSync();

		const redirects = await Redirect.find(
			{ isActive: true },
			{ fromUrl: 1, toUrl: 1, _id: 0 }
		).lean<Array<{ fromUrl: string; toUrl: string }>>();

		return serialize(redirects);
	}
}

// Export singleton instance
export const redirectRepository = new RedirectRepository();
