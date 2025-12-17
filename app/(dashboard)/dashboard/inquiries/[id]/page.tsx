import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import { InquiryDetail } from "./inquiry-detail";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

/**
 * Inquiry Detail Page - Server Component
 */
export default async function InquiryDetailPage({ params }: PageProps) {
	const { id } = await params;

	// Get session from server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	// Check admin role - cast to include role from extended user type
	// const userRole = (session?.user as { role?: string } | undefined)?.role;
	if (
		!session?.user?.id
		//  || userRole !== "admin"
	) {
		notFound();
	}

	let submission;
	try {
		submission = await formSubmissionService.getSubmissionById(id);
	} catch {
		notFound();
	}

	if (!submission) {
		notFound();
	}

	// Auto-mark as read when viewing
	if (submission.status === "new") {
		try {
			await formSubmissionService.updateStatus(
				id,
				{ status: "read" },
				session.user.id
			);
			submission.status = "read";
			submission.readAt = new Date();
			submission.readBy = session.user
				.id as unknown as typeof submission.readBy;
		} catch (error) {
			console.error("Failed to auto-mark as read:", error);
		}
	}

	return (
		<InquiryDetail
			submission={{
				_id: submission._id.toString(),
				type: submission.type,
				status: submission.status,
				fullName: submission.fullName,
				email: submission.email,
				phone: submission.phone,
				countryCode: submission.countryCode,
				countryName: submission.countryName,
				corporationNumber: submission.corporationNumber || null,
				message: submission.message || null,
				gdprConsent: submission.gdprConsent,
				gdprConsentTimestamp: submission.gdprConsentTimestamp.toISOString(),
				gdprConsentVersion: submission.gdprConsentVersion || "1.0",
				marketingConsent: submission.marketingConsent || false,
				productId: submission.productId?.toString() || null,
				productName: submission.productName || null,
				productSlug: submission.productSlug || null,
				helpType: submission.helpType || null,
				trainingInterestType: submission.trainingInterestType || null,
				subject: submission.subject || null,
				preferredDate: submission.preferredDate?.toISOString() || null,
				preferredTime: submission.preferredTime || null,
				metadata: {
					ipAddress: submission.metadata.ipAddress,
					userAgent: submission.metadata.userAgent,
					referrer: submission.metadata.referrer || null,
					pageUrl: submission.metadata.pageUrl,
					locale: submission.metadata.locale || null,
					submittedAt: submission.metadata.submittedAt.toISOString(),
				},
				readAt: submission.readAt?.toISOString() || null,
				readBy: submission.readBy?.toString() || null,
				createdAt: submission.createdAt.toISOString(),
				updatedAt: submission.updatedAt.toISOString(),
			}}
		/>
	);
}
