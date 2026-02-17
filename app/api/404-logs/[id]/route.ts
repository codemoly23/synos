import { NextRequest, NextResponse } from "next/server";
import { fourOhFourLogService } from "@/lib/services/four-oh-four-log.service";

/**
 * DELETE /api/404-logs/[id]
 * Delete a single 404 log entry
 */
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		await fourOhFourLogService.deleteLog(id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting 404 log:", error);
		return NextResponse.json(
			{ error: "Failed to delete 404 log" },
			{ status: 500 }
		);
	}
}
