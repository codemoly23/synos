import { NextRequest, NextResponse } from "next/server";
import { startaEgetPageService } from "@/lib/services/starta-eget-page.service";
import { updateStartaEgetPageSchema } from "@/lib/validations/starta-eget-page.validation";
import { revalidateStartaEgetPage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const data = await startaEgetPageService.getStartaEgetPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching starta eget page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch starta eget page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateStartaEgetPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await startaEgetPageService.updateStartaEgetPage(
			result.data
		);

		// Revalidate ISR cache
		await revalidateStartaEgetPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating starta eget page:", error);
		return NextResponse.json(
			{ error: "Failed to update starta eget page data" },
			{ status: 500 }
		);
	}
}
