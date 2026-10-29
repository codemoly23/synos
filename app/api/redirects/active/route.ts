import { NextRequest, NextResponse } from "next/server";
import { redirectService } from "@/lib/services/redirect.service";

/**
 * GET /api/redirects/active
 * Get all active redirects (used by proxy.ts)
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

		const redirects = await redirectService.getActiveRedirects();

		return NextResponse.json({ redirects });
	} catch (error) {
		console.error("Error fetching active redirects:", error);
		return NextResponse.json({ redirects: [] });
	}
}
