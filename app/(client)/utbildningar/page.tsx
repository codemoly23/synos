import type { Metadata } from "next";
import { trainingPageService } from "@/lib/services/training-page.service";
import { TrainingPageClient } from "./training-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const data = await trainingPageService.getTrainingPage();

	return {
		title: data.seo?.title || "Utbildningar",
		description:
			data.seo?.description ||
			"När du köper maskin hos oss ingår även flera dagar utbildning - helt skräddarsydd efter dina förutsättningar, förkunskaper och behov!",
		openGraph: {
			title:
				data.seo?.title ||
				"Synos Utbildningar - Vi utbildar dig i samband med köp av maskin",
			description:
				data.seo?.description ||
				"När du köper maskin hos oss ingår även flera dagar utbildning - helt skräddarsydd efter dina förutsättningar, förkunskaper och behov!",
			...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
		},
	};
}

export default async function UtbildningarPage() {
	const data = await trainingPageService.getTrainingPage();

	return <TrainingPageClient data={data} />;
}
