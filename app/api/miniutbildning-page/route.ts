import { NextRequest, NextResponse } from "next/server";
import { miniutbildningPageService } from "@/lib/services/miniutbildning-page.service";
import { updateMiniutbildningPageSchema } from "@/lib/validations/miniutbildning-page.validation";
import { revalidateMiniutbildningPage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const data = await miniutbildningPageService.getMiniutbildningPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching miniutbildning page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch miniutbildning page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateMiniutbildningPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await miniutbildningPageService.updateMiniutbildningPage(
			result.data
		);

		// Revalidate ISR cache
		await revalidateMiniutbildningPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating miniutbildning page:", error);
		return NextResponse.json(
			{ error: "Failed to update miniutbildning page data" },
			{ status: 500 }
		);
	}
}
