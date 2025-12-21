import type { Metadata } from "next";
import { careersPageService } from "@/lib/services/careers-page.service";
import { CareersPageClient } from "./careers-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const data = await careersPageService.getCareersPage();

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
}

export default async function LedigaTjansterPage() {
	const data = await careersPageService.getCareersPage();

	return <CareersPageClient data={data} />;
}
