import { Hero } from "@/components/home/Hero";
import { SearchSection } from "@/components/home/SearchSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ImageGallery } from "@/components/home/ImageGallery";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { Testimonials } from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<Hero />
			<SearchSection />
			<FeatureHighlights />
			<ProductShowcase />
			<ImageGallery />

			<AboutSection />

			<ProcessSteps />
			<Testimonials />

			<CtaSection />
		</div>
	);
}
