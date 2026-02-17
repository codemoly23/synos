import { NextRequest, NextResponse } from "next/server";
import { linkAuditService } from "@/lib/services/link-audit.service";

/**
 * GET /api/link-management/audit/[id]
 * Get a specific audit report with all links
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const audit = await linkAuditService.getAuditById(id);

		if (!audit) {
			return NextResponse.json(
				{ error: "Audit not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(audit);
	} catch (error) {
		console.error("Error fetching audit:", error);
		return NextResponse.json(
			{ error: "Failed to fetch audit" },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/link-management/audit/[id]
 * Delete an audit report
 */
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await linkAuditService.deleteAudit(id);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting audit:", error);
		return NextResponse.json(
			{ error: "Failed to delete audit" },
			{ status: 500 }
		);
	}
}
