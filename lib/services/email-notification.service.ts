import nodemailer from "nodemailer";
import { siteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { logger } from "@/lib/utils/logger";
import type { IFormSubmission } from "@/models/form-submission.model";

const FORM_TYPE_LABELS: Record<string, string> = {
	product_inquiry: "Product Inquiry",
	training_inquiry: "Training Inquiry",
	contact: "Contact",
	demo_request: "Demo Request",
	quote_request: "Quote Request",
	callback_request: "Callback Request",
	tour_request: "Tour Request",
	job_application: "Job Application",
	hero_inquiry: "Hero Inquiry",
	brochure_request: "Brochure Request",
	training_application: "Training Application",
	newsletter_subscription: "Newsletter Subscription",
};

const HELP_TYPE_LABELS: Record<string, string> = {
	clinic_buy: "Buy for Clinic",
	start_business: "Start a Business",
	just_interested: "Just Interested",
	buy_contact: "Buy / Contact",
};

const TRAINING_INTEREST_LABELS: Record<string, string> = {
	machine_purchase: "Machine Purchase",
	already_customer: "Already a Customer",
	certification_info: "Certification Info",
	general_info: "General Info",
};

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("sv-SE", {
		timeZone: "Europe/Stockholm",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function buildEmailHtml(submission: IFormSubmission, fromName: string): string {
	const typeLabel = FORM_TYPE_LABELS[submission.type] ?? submission.type;
	const submittedAt = formatDate(submission.metadata?.submittedAt ?? submission.createdAt);

	const rows: [string, string][] = [
		["Form Type", typeLabel],
		["Full Name", submission.fullName],
		["Email", submission.email],
		["Phone", `${submission.countryCode ?? ""} ${submission.phone}`.trim()],
	];

	if (submission.countryName) rows.push(["Country", submission.countryName]);
	if (submission.corporationNumber) rows.push(["Corp. Number", submission.corporationNumber]);
	if (submission.subject) rows.push(["Subject", submission.subject]);
	if (submission.productName) rows.push(["Product", submission.productName]);
	if (submission.helpType) rows.push(["Help Type", HELP_TYPE_LABELS[submission.helpType] ?? submission.helpType]);
	if (submission.trainingInterestType) rows.push(["Training Interest", TRAINING_INTEREST_LABELS[submission.trainingInterestType] ?? submission.trainingInterestType]);
	if (submission.jobTitle) rows.push(["Job Title", submission.jobTitle]);
	if (submission.careerType) rows.push(["Career Type", submission.careerType]);
	if (submission.resumeUrl) rows.push(["Resume", `<a href="${submission.resumeUrl}">Download</a>`]);
	if (submission.category) rows.push(["Category", submission.category]);
	if (submission.attachmentUrl) rows.push(["Attachment", `<a href="${submission.attachmentUrl}">Download</a>`]);
	if (submission.preferredDate) rows.push(["Preferred Date", formatDate(submission.preferredDate)]);
	if (submission.preferredTime) rows.push(["Preferred Time", submission.preferredTime]);
	if (submission.message) rows.push(["Message", submission.message]);
	rows.push(["Submitted", submittedAt]);

	const tableRows = rows
		.map(
			([label, value]) => `
		<tr>
			<td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;vertical-align:top;">${label}</td>
			<td style="padding:8px 12px;border:1px solid #e0e0e0;word-break:break-word;">${value.replace(/\n/g, "<br>")}</td>
		</tr>`
		)
		.join("");

	return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 0;">
		<tr><td align="center">
			<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
				<tr>
					<td style="background:#1a1a1a;padding:24px 32px;">
						<h2 style="color:#fff;margin:0;font-size:20px;">New ${typeLabel}</h2>
						<p style="color:#aaa;margin:4px 0 0;font-size:13px;">${fromName}</p>
					</td>
				</tr>
				<tr>
					<td style="padding:32px;">
						<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
							${tableRows}
						</table>
					</td>
				</tr>
				<tr>
					<td style="background:#f5f5f5;padding:16px 32px;font-size:12px;color:#999;">
						This notification was sent automatically by ${fromName}.
					</td>
				</tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`;
}

export async function sendSubmissionNotification(submission: IFormSubmission): Promise<void> {
	try {
		const settings = await siteSettingsRepository.get();
		const smtp = settings.smtp;

		if (!smtp?.enabled || !smtp.host || !smtp.adminNotificationEmail) {
			return;
		}

		const isSecure = smtp.encryption === "ssl";
		const transporter = nodemailer.createTransport({
			host: smtp.host,
			port: smtp.port ?? 587,
			secure: isSecure,
			...(smtp.encryption === "tls" && { requireTLS: true }),
			...(smtp.username
				? { auth: { user: smtp.username, pass: smtp.password ?? "" } }
				: {}),
		});

		const fromName = smtp.fromName ?? settings.companyName ?? "Synos";
		const fromEmail = smtp.fromEmail ?? smtp.username ?? "";
		const typeLabel = FORM_TYPE_LABELS[submission.type] ?? submission.type;

		await transporter.sendMail({
			from: `"${fromName}" <${fromEmail}>`,
			to: smtp.adminNotificationEmail,
			subject: `New ${typeLabel} from ${submission.fullName}`,
			html: buildEmailHtml(submission, fromName),
		});

		logger.info(`Email notification sent for submission ${submission._id}`);
	} catch (error) {
		logger.error("Failed to send email notification", error);
	}
}
