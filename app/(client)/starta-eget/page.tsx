import type { Metadata } from "next";
import { startaEgetPageService } from "@/lib/services/starta-eget-page.service";
import { StartaEgetPageClient } from "./starta-eget-page-client";

export async function generateMetadata(): Promise<Metadata> {
	try {
		const data = await startaEgetPageService.getStartaEgetPage();

		return {
			title: data.seo?.title || "Starta eget",
			description:
				data.seo?.description ||
				"Drömmer du om frihet och framgång? Starta klinik med Synos! Vi hjälper dig med uppstart, inköp, utbildning och marknadsföring.",
			openGraph: {
				title:
					data.seo?.title ||
					"Drömmer du om frihet och framgång? Starta klinik med Synos!",
				description:
					data.seo?.description ||
					"Att starta och driva en egen hudvårdsklinik måste inte vara svårt och tidskrävande. Synos hjälper dig med uppstart, inköp och marknadsföring!",
				...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
			},
		};
	} catch {
		return { title: "Starta eget | Synos Medical" };
	}
}

export default async function StartaEgetPage() {
	const data = await startaEgetPageService.getStartaEgetPage().catch(() => null);

	if (!data) return <></>;

	return <StartaEgetPageClient data={data} />;
}
