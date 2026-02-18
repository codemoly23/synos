import { NextResponse } from "next/server";
import { linkAuditService } from "@/lib/services/link-audit.service";

/**
 * POST /api/link-management/audit/cancel
 * Cancel the currently running audit
 */
export async function POST() {
	try {
		const cancelled = await linkAuditService.cancelAudit();

		if (!cancelled) {
			return NextResponse.json(
				{ error: "No running audit to cancel" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error cancelling audit:", error);
		return NextResponse.json(
			{ error: "Failed to cancel audit" },
			{ status: 500 }
		);
	}
}
