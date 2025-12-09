import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations/contact";
import {
	getContactEmailTemplate,
	getAutoReplyTemplate,
} from "@/lib/email/templates";
import { siteConfig } from "@/config/site";

// Initialize Resend (will use RESEND_API_KEY from environment)
const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body = await request.json();

		// Validate form data
		const validationResult = contactFormSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Ogiltig data",
					details: validationResult.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const data = validationResult.data;

		// Check if Resend is configured
		if (!resend || !process.env.RESEND_API_KEY) {
			console.warn("Resend API key not configured. Email will not be sent.");

			// Return success even without email sending (for development)
			return NextResponse.json({
				success: true,
				message:
					"Formulär mottaget (utvecklingsläge - inget e-postmeddelande skickat)",
			});
		}

		// Prepare email templates
		const contactEmail = getContactEmailTemplate(data);
		const autoReply = getAutoReplyTemplate(data.name);

		// Send email to company
		const companyEmailResult = await resend.emails.send({
			from: `${siteConfig.name} Kontaktformulär <${siteConfig.company.noreplyEmail}>`,
			to: siteConfig.company.email,
			subject: contactEmail.subject,
			html: contactEmail.html,
			text: contactEmail.text,
			replyTo: data.email,
		});

		if (companyEmailResult.error) {
			console.error(
				"Failed to send company email:",
				companyEmailResult.error
			);
			throw new Error("Kunde inte skicka e-post till företaget");
		}

		// Send auto-reply to customer
		const autoReplyResult = await resend.emails.send({
			from: `${siteConfig.name} <${siteConfig.company.noreplyEmail}>`,
			to: data.email,
			subject: autoReply.subject,
			html: autoReply.html,
			text: autoReply.text,
		});

		if (autoReplyResult.error) {
			console.error("Failed to send auto-reply:", autoReplyResult.error);
			// Don't throw error here - company email was sent successfully
		}

		// Log successful submission
		// console.log("Contact form submitted successfully:", {
		//   name: data.name,
		//   email: data.email,
		//   subject: data.subject,
		//   timestamp: new Date().toISOString(),
		//   companyEmailId: companyEmailResult.data?.id,
		//   autoReplyId: autoReplyResult.data?.id,
		// });

		// Track with Facebook Pixel (if needed)
		// This would be done client-side, but we can log it here
		// console.log("Contact form conversion - track with FB Pixel");

		return NextResponse.json({
			success: true,
			message: "Ditt meddelande har skickats!",
		});
	} catch (error) {
		console.error("Contact form error:", error);

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Ett oväntat fel uppstod. Vänligen försök igen senare.",
			},
			{ status: 500 }
		);
	}
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
	return NextResponse.json({}, { status: 200 });
}
