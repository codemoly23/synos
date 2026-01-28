import { NextRequest, NextResponse } from "next/server";
import { getAboutPage, updateAboutPage } from "@/lib/services/about-page.service";
import { updateAboutPageSchema } from "@/lib/validations/about-page.validation";
import { revalidateAboutPage } from "@/lib/revalidation/actions";

/**
 * GET /api/about-page
 * Fetch about page content
 */
export async function GET() {
	try {
		const aboutPage = await getAboutPage();
		return NextResponse.json(aboutPage);
	} catch (error) {
		console.error("Error fetching about page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch about page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/about-page
 * Update about page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Debug: Log incoming testimonials data
		console.log("[DEBUG] PUT /api/about-page - testimonials:", JSON.stringify(body.testimonials, null, 2));

		// Validate input
		const validationResult = updateAboutPageSchema.safeParse(body);
		if (!validationResult.success) {
			console.log("[DEBUG] Validation failed:", validationResult.error.flatten());
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		// Debug: Log validated testimonials data
		console.log("[DEBUG] After validation - testimonials:", JSON.stringify(validationResult.data.testimonials, null, 2));

		const updatedPage = await updateAboutPage(validationResult.data);

		// Revalidate ISR cache
		await revalidateAboutPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating about page:", error);
		return NextResponse.json(
			{ error: "Failed to update about page" },
			{ status: 500 }
		);
	}
}
