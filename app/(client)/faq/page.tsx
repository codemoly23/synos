import type { Metadata } from "next";
import { faqPageService } from "@/lib/services/faq-page.service";
import { FAQPageClient } from "./faq-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const data = await faqPageService.getFAQPage();

	return {
		title: data.seo?.title || "FAQ - Vanliga frågor och svar",
		description:
			data.seo?.description ||
			"Har du frågor om Synos Medical, våra produkter, utbildningar eller tjänster? Här hittar du svar på de vanligaste frågorna. Kontakta oss gärna om du inte hittar svar på din fråga.",
		keywords: data.seo?.keywords || [
			"FAQ",
			"vanliga frågor",
			"frågor och svar",
			"Synos Medical",
			"lasermaskiner",
			"utbildning",
			"support",
		],
		openGraph: {
			title: data.seo?.title || "FAQ - Vanliga frågor och svar | Synos Medical",
			description:
				data.seo?.description ||
				"Svar på de vanligaste frågorna om Synos Medical, våra produkter, utbildningar och tjänster.",
			type: "website",
			locale: "sv_SE",
			...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
		},
		twitter: {
			card: "summary_large_image",
			title: data.seo?.title || "FAQ - Vanliga frågor och svar | Synos Medical",
			description:
				data.seo?.description ||
				"Svar på de vanligaste frågorna om Synos Medical, våra produkter, utbildningar och tjänster.",
		},
	};
}

export default async function FAQPage() {
	const data = await faqPageService.getFAQPage();

	return <FAQPageClient data={data} />;
}
