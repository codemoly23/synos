import { NextRequest, NextResponse } from "next/server";
import { fourOhFourLogService } from "@/lib/services/four-oh-four-log.service";
import {
	logHitSchema,
	fourOhFourLogListQuerySchema,
} from "@/lib/validations/four-oh-four-log.validation";

/**
 * GET /api/404-logs
 * Get paginated 404 logs (dashboard)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = {
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "20",
			search: searchParams.get("search") || undefined,
			sort: searchParams.get("sort") || "-hits",
		};

		const validationResult = fourOhFourLogListQuerySchema.safeParse(query);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Invalid query parameters",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const result = await fourOhFourLogService.getLogs(
			validationResult.data
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error fetching 404 logs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch 404 logs" },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/404-logs
 * Log a 404 hit (public - called from not-found.tsx client component)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const validationResult = logHitSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{ error: "Invalid data" },
				{ status: 400 }
			);
		}

		const userAgent = request.headers.get("user-agent") || undefined;

		await fourOhFourLogService.logHit(
			validationResult.data.url,
			validationResult.data.referrer,
			userAgent
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error logging 404 hit:", error);
		return NextResponse.json(
			{ error: "Failed to log 404 hit" },
			{ status: 500 }
		);
	}
}
