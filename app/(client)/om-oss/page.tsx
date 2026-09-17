import type { Metadata } from "next";
import {
	getAboutPage,
	getAboutPageSeo,
} from "@/lib/services/about-page.service";
import { getContactInfo } from "@/lib/services/site-settings.service";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo";
import { AboutPageClient } from "./_components/about-page-client";

export async function generateMetadata(): Promise<Metadata> {
	try {
		const seo = await getAboutPageSeo();

		const title = seo?.title || "Om oss - Synos Medical";
		const description =
			seo?.description ||
			"Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien.";

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
			},
		};
	} catch {
		return { title: "Om oss | Synos Medical" };
	}
}

export default async function AboutPage() {
	const [aboutPage, contact] = await Promise.all([
		getAboutPage().catch((error) => {
			console.error("Failed to load about page:", error);
			return null;
		}),
		getContactInfo(),
	]);

	if (!aboutPage) return <></>;

	const [organizationJsonLd, websiteJsonLd] = await Promise.all([
		generateOrganizationJsonLd(),
		generateWebSiteJsonLd(),
	]);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
			<AboutPageClient data={aboutPage} contact={contact} />
		</>
	);
}
