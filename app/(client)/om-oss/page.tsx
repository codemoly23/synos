import type { Metadata } from "next";
import {
	getAboutPage,
	getAboutPageSeo,
} from "@/lib/services/about-page.service";
import { AboutPageClient } from "./_components/about-page-client";

export const dynamic = "force-dynamic";

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
	const aboutPage = await getAboutPage().catch((error) => {
		console.error("Failed to load about page:", error);
		return null;
	});

	if (!aboutPage) return <></>;

	return <AboutPageClient data={aboutPage} />;
}
