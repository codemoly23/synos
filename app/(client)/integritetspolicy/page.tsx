import type { Metadata } from "next";
import { privacyPageService } from "@/lib/services/privacy-page.service";
import { PrivacyPageClient } from "./privacy-page-client";

export async function generateMetadata(): Promise<Metadata> {
	try {
		const data = await privacyPageService.getPrivacyPage();

		return {
			title: data.seo?.title || "Integritetspolicy",
			description:
				data.seo?.description ||
				"Synos Medical AB:s integritetspolicy - information om hur vi behandlar dina personuppgifter enligt GDPR.",
			openGraph: {
				title: data.seo?.title || "Integritetspolicy - Synos Medical",
				description:
					data.seo?.description ||
					"Läs om hur Synos Medical AB behandlar dina personuppgifter enligt GDPR.",
				...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
			},
		};
	} catch {
		return { title: "Integritetspolicy | Synos Medical" };
	}
}

export default async function PrivacyPolicyPage() {
	const data = await privacyPageService.getPrivacyPage().catch(() => null);

	if (!data) return <></>;

	return <PrivacyPageClient data={data} />;
}
