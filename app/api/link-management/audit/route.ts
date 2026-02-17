import { NextRequest, NextResponse } from "next/server";
import { linkAuditService } from "@/lib/services/link-audit.service";
import { startAuditSchema, auditListQuerySchema } from "@/lib/validations/link-audit.validation";

/**
 * GET /api/link-management/audit
 * Get audit history or latest audit
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const latest = searchParams.get("latest");

		if (latest === "true") {
			const audit = await linkAuditService.getLatestAudit();
			return NextResponse.json(audit);
		}

		const query = {
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
		};

		const validationResult = auditListQuerySchema.safeParse(query);
		if (!validationResult.success) {
			return NextResponse.json(
				{ error: "Invalid query parameters" },
				{ status: 400 }
			);
		}

		const result = await linkAuditService.getAuditHistory(
			validationResult.data.page,
			validationResult.data.limit
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error fetching audits:", error);
		return NextResponse.json(
			{ error: "Failed to fetch audits" },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/link-management/audit
 * Start a new link audit
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}));

		const validationResult = startAuditSchema.safeParse(body);
		const type = validationResult.success ? validationResult.data.type : "full";

		const audit = await linkAuditService.startAudit(type);

		return NextResponse.json(audit, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to start audit";

		if (message === "An audit is already running") {
			return NextResponse.json({ error: message }, { status: 409 });
		}

		console.error("Error starting audit:", error);
		return NextResponse.json(
			{ error: "Failed to start audit" },
			{ status: 500 }
		);
	}
}
