import { NextResponse } from "next/server";
import { linkAuditService } from "@/lib/services/link-audit.service";

/**
 * GET /api/link-management/audit/status
 * Check if there's a running audit and get its progress
 */
export async function GET() {
	try {
		const latest = await linkAuditService.getLatestAudit();

		if (!latest) {
			return NextResponse.json({
				isRunning: false,
				audit: null,
			});
		}

		return NextResponse.json({
			isRunning: latest.status === "running",
			audit: {
				_id: latest._id,
				status: latest.status,
				type: latest.type,
				totalLinks: latest.totalLinks,
				checkedLinks: latest.checkedLinks,
				brokenLinks: latest.brokenLinks,
				redirectLinks: latest.redirectLinks,
				mixedContentLinks: latest.mixedContentLinks,
				externalBrokenLinks: latest.externalBrokenLinks,
				okLinks: latest.okLinks,
				timeoutLinks: latest.timeoutLinks,
				duration: latest.duration,
				startedAt: latest.startedAt,
				completedAt: latest.completedAt,
			},
		});
	} catch (error) {
		console.error("Error checking audit status:", error);
		return NextResponse.json(
			{ error: "Failed to check audit status" },
			{ status: 500 }
		);
	}
}
