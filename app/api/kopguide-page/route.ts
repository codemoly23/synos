import { NextRequest, NextResponse } from "next/server";
import { kopguidePageService } from "@/lib/services/kopguide-page.service";
import { updateKopguidePageSchema } from "@/lib/validations/kopguide-page.validation";
import { revalidateKopguidePage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const data = await kopguidePageService.getKopguidePage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching köpguide page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch köpguide page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateKopguidePageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await kopguidePageService.updateKopguidePage(
			result.data
		);

		// Revalidate ISR cache
		await revalidateKopguidePage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating köpguide page:", error);
		return NextResponse.json(
			{ error: "Failed to update köpguide page data" },
			{ status: 500 }
		);
	}
}
