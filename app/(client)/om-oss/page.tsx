import type { Metadata } from "next";
import {
	getAboutPage,
	getAboutPageSeo,
} from "@/lib/services/about-page.service";
import { AboutPageClient } from "./_components/about-page-client";

export async function generateMetadata(): Promise<Metadata> {
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
}

export default async function AboutPage() {
	const aboutPage = await getAboutPage();
	return <AboutPageClient data={aboutPage} />;
}
