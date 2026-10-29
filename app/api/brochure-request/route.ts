import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { siteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			companyName,
			firstName,
			lastName,
			email,
			phone,
			corporationNumber,
			message,
			productName,
			productSlug,
		} = body;

		if (!companyName || !firstName || !lastName || !email || !phone) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
		}

		const settings = await siteSettingsRepository.get();
		const smtp = settings.smtp;

		if (smtp?.enabled && smtp.host && smtp.adminNotificationEmail) {
			const isSecure = smtp.encryption === "ssl";
			const transporter = nodemailer.createTransport({
				host: smtp.host,
				port: smtp.port ?? 587,
				secure: isSecure,
				connectionTimeout: 10000,
				greetingTimeout: 10000,
				socketTimeout: 10000,
				...(smtp.encryption === "tls" && { requireTLS: true }),
				...(smtp.username
					? { auth: { user: smtp.username, pass: smtp.password ?? "" } }
					: {}),
			});

			const fromName = smtp.fromName ?? settings.companyName ?? "Synos";
			const fromEmail = smtp.fromEmail ?? smtp.username ?? "";

			const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1a1a1a;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">New Brochure Request</h2>
            <p style="color:#aaa;margin:4px 0 0;font-size:13px;">${fromName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr>
                <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">Company</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0;">${companyName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">First Name</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0;">${firstName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">Last Name</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0;">${lastName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">Email</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">Phone</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">Product</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0;">${productName ?? "-"}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f5f5;padding:16px 32px;font-size:12px;color:#999;">
            This notification was sent automatically by ${fromName}. Please send the brochure for <strong>${productName ?? "the requested product"}</strong> to the email above.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

			// Fire-and-forget: a slow/unreachable SMTP host must never block this response
			transporter
				.sendMail({
					from: `"${fromName}" <${fromEmail}>`,
					to: smtp.adminNotificationEmail,
					subject: `Broschyrförfrågan: ${productName ?? "Produkt"} – ${firstName} ${lastName}`,
					html,
				})
				.then(() => logger.info(`Brochure request email sent for product: ${productSlug}`))
				.catch((err) => logger.error("Failed to send brochure request email", err));
		}

		// Save to database so it appears in dashboard inquiries
		const headersList = await headers();
		const metadata = {
			ipAddress:
				headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
				headersList.get("x-real-ip") ||
				"unknown",
			userAgent: headersList.get("user-agent") || "unknown",
			referrer: headersList.get("referer") || undefined,
			pageUrl: headersList.get("referer") || "unknown",
			locale: headersList.get("accept-language")?.split(",")[0] || undefined,
		};

		formSubmissionService.createBrochureRequest(
			{
				companyName: companyName as string,
				firstName: firstName as string,
				lastName: lastName as string,
				email: email as string,
				phone: phone as string,
				corporationNumber: corporationNumber as string | undefined,
				message: message as string | undefined,
				productName: productName as string | undefined,
				productSlug: productSlug as string | undefined,
			},
			metadata
		).catch((err) => logger.error("Failed to save brochure request to DB", err));

		return NextResponse.json({ success: true });
	} catch (error) {
		logger.error("Brochure request failed", error);
		return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
	}
}
