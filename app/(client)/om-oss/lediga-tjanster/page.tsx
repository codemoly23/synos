import type { Metadata } from "next";
import { careersPageService } from "@/lib/services/careers-page.service";
import { CareersListing } from "./_components/careers-listing";

// ISR: Revalidate every 24 hours
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	try {
		const data = await careersPageService.getPublicCareersPage();

		return {
			title: data.seo?.title || "Lediga Tjänster | Synos Medical",
			description:
				data.seo?.description ||
				"Bli en del av Synos Medical-teamet. Se våra lediga tjänster och ansök idag. Vi söker engagerade medarbetare som vill växa med oss.",
			openGraph: {
				title: data.seo?.title || "Karriär hos Synos Medical | Lediga Tjänster",
				description:
					data.seo?.description ||
					"Bli en del av Synos Medical-teamet. Se våra lediga tjänster och ansök idag.",
				...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
			},
		};
	} catch {
		return { title: "Lediga tjänster | Synos Medical" };
	}
}

export default async function LedigaTjansterPage() {
	const data = await careersPageService.getPublicCareersPage().catch(() => null);

	if (!data) return <></>;

	return <CareersListing data={data} />;
}
