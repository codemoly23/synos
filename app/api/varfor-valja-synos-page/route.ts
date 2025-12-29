import { NextRequest, NextResponse } from "next/server";
import { varforValjaSynosPageService } from "@/lib/services/varfor-valja-synos-page.service";
import { updateVarforValjaSynosPageSchema } from "@/lib/validations/varfor-valja-synos-page.validation";
import { revalidateVarforValjaSynosPage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const data = await varforValjaSynosPageService.getVarforValjaSynosPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching varför välja synos page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch varför välja synos page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateVarforValjaSynosPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await varforValjaSynosPageService.updateVarforValjaSynosPage(
			result.data
		);

		// Revalidate ISR cache
		await revalidateVarforValjaSynosPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating varför välja synos page:", error);
		return NextResponse.json(
			{ error: "Failed to update varför välja synos page data" },
			{ status: 500 }
		);
	}
}
