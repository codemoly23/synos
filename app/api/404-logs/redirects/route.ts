import { NextRequest, NextResponse } from "next/server";
import { fourOhFourLogService } from "@/lib/services/four-oh-four-log.service";

/**
 * GET /api/404-logs/redirects
 * Get all active redirects (used by middleware)
 */
export async function GET(request: NextRequest) {
	try {
		// Verify middleware secret to prevent public access
		const secret = request.headers.get("x-middleware-secret");
		if (
			process.env.MIDDLEWARE_SECRET &&
			secret !== process.env.MIDDLEWARE_SECRET
		) {
			return NextResponse.json({ redirects: [] });
		}

		const redirects = await fourOhFourLogService.getActiveRedirects();

		return NextResponse.json({ redirects });
	} catch (error) {
		console.error("Error fetching redirects:", error);
		return NextResponse.json({ redirects: [] });
	}
}
