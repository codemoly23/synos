import { getUploadLogModel } from "@/models/upload-log.model";

/**
 * Rate limit configuration for the public upload endpoint
 */
const UPLOAD_RATE_LIMIT = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 20, // Max 20 uploads per window
};

/**
 * Check whether an IP is within the public upload rate limit.
 */
export async function checkUploadRateLimit(ip: string): Promise<boolean> {
	if (process.env.NODE_ENV === "development") return true;

	const UploadLog = await getUploadLogModel();
	const windowStart = new Date(Date.now() - UPLOAD_RATE_LIMIT.windowMs);
	const count = await UploadLog.countDocuments({
		ip,
		createdAt: { $gte: windowStart },
	}).exec();

	return count < UPLOAD_RATE_LIMIT.maxRequests;
}

/**
 * Record a successful upload attempt for rate-limit accounting.
 */
export async function recordUpload(ip: string): Promise<void> {
	const UploadLog = await getUploadLogModel();
	await UploadLog.create({ ip });
}
