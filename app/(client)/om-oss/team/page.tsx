import type { Metadata } from "next";
import { getTeamPage, getTeamPageSeo } from "@/lib/services/team-page.service";
import { TeamPageClient } from "./team-page-client";

export async function generateMetadata(): Promise<Metadata> {
	try {
		const seo = await getTeamPageSeo();

		const title = seo?.title || "Vårt Team - Synos Medical";
		const description =
			seo?.description ||
			"Möt teamet bakom Synos Medical - experter inom estetisk medicinteknologi.";

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
		return { title: "Vårt team | Synos Medical" };
	}
}

export default async function TeamPage() {
	const teamPage = await getTeamPage().catch(() => null);

	if (!teamPage) return <></>;

	return <TeamPageClient data={teamPage} />;
}
