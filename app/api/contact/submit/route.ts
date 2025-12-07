import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Contact Form Submission API Endpoint (Stub)
 *
 * This is a test endpoint that logs submissions to the console.
 * In production, this should:
 * - Send emails via Resend or similar service
 * - Store submissions in a database
 * - Integrate with CRM systems
 * - Send notifications to team
 */

const contactSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	message: z.string().min(10),
});

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body = await request.json();

		// Validate input
		const validatedData = contactSchema.parse(body);

		// Log to console (stub behavior)
		// console.log("=== Contact Form Submission ===");
		// console.log("Timestamp:", new Date().toISOString());
		// console.log("Name:", validatedData.name);
		// console.log("Email:", validatedData.email);
		// console.log("Message:", validatedData.message);
		// console.log("================================");

		// TODO: In production, implement:
		// 1. Send email notification via Resend
		// 2. Store in database
		// 3. Send auto-reply to customer
		// 4. Integrate with CRM

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message:
					"Tack för ditt meddelande! Vi återkommer så snart som möjligt.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Contact form submission error:", error);

		// Handle validation errors
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: "Ogiltiga formulärdata",
					errors: error.issues,
				},
				{ status: 400 }
			);
		}

		// Handle other errors
		return NextResponse.json(
			{
				success: false,
				message: "Ett fel uppstod. Vänligen försök igen senare.",
			},
			{ status: 500 }
		);
	}
}

// Handle unsupported methods
export async function GET() {
	return NextResponse.json(
		{ success: false, message: "Method not allowed" },
		{ status: 405 }
	);
}
