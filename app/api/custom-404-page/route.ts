import { NextRequest, NextResponse } from "next/server";
import { custom404PageService } from "@/lib/services/custom-404-page.service";
import { updateCustom404PageSchema } from "@/lib/validations/custom-404-page.validation";
import { revalidateCustom404Page } from "@/lib/revalidation/actions";

/**
 * GET /api/custom-404-page
 * Fetch custom 404 page content (public)
 */
export async function GET() {
	try {
		const page = await custom404PageService.getCustom404Page();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching custom 404 page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch custom 404 page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/custom-404-page
 * Update custom 404 page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		const validationResult = updateCustom404PageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await custom404PageService.updateCustom404Page(
			validationResult.data
		);

		await revalidateCustom404Page();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating custom 404 page:", error);
		return NextResponse.json(
			{ error: "Failed to update custom 404 page" },
			{ status: 500 }
		);
	}
}
