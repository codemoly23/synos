import type { Metadata } from "next";
import { getLegalPage, getLegalPageSeo } from "@/lib/services/legal-page.service";
import { LegalPageClient } from "./legal-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getLegalPageSeo();

	const title = seo?.title || "Juridisk Information | Synos Medical";
	const description =
		seo?.description ||
		"Juridisk information om Synos Medical AB - integritetspolicy, villkor, GDPR och cookies.";

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

export default async function JuridiskInformationPage() {
	const legalPage = await getLegalPage();
	return <LegalPageClient data={legalPage} />;
}
