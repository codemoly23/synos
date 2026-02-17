import { NextRequest, NextResponse } from "next/server";
import { fourOhFourLogService } from "@/lib/services/four-oh-four-log.service";
import { addRedirectSchema } from "@/lib/validations/four-oh-four-log.validation";

/**
 * PUT /api/404-logs/[id]/redirect
 * Add or update a redirect URL for a 404 log entry
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();

		const validationResult = addRedirectSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Invalid redirect URL",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updated = await fourOhFourLogService.addRedirect(
			id,
			validationResult.data.redirectUrl
		);

		if (!updated) {
			return NextResponse.json(
				{ error: "404 log entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating redirect:", error);
		return NextResponse.json(
			{ error: "Failed to update redirect" },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/404-logs/[id]/redirect
 * Remove a redirect from a 404 log entry
 */
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const updated = await fourOhFourLogService.removeRedirect(id);

		if (!updated) {
			return NextResponse.json(
				{ error: "404 log entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error removing redirect:", error);
		return NextResponse.json(
			{ error: "Failed to remove redirect" },
			{ status: 500 }
		);
	}
}
