import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SearchSection } from "@/components/home/SearchSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ImageGallery } from "@/components/home/ImageGallery";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { Testimonials } from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import CtaSection from "@/components/home/CtaSection";
import { FloatingContactButton } from "@/components/home/FloatingContactButton";
import { getHomePage, getHomePageSeo } from "@/lib/services/home-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";

export async function generateMetadata(): Promise<Metadata> {
	const [seo, siteSettings] = await Promise.all([
		getHomePageSeo(),
		getSiteSettings(),
	]);

	const siteName = siteSettings.seo?.siteName || "Synos Medical";
	const siteDescription =
		siteSettings.seo?.siteDescription ||
		"Sveriges ledande leverantör av MDR-certifierad klinikutrustning";

	const title = seo.title || `${siteName} - Medicinsk utrustning`;
	const description = seo.description || siteDescription;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			siteName,
			...(seo.ogImage && { images: [{ url: seo.ogImage }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(seo.ogImage && { images: [seo.ogImage] }),
		},
	};
}

export default async function Home() {
	// Fetch CMS data
	const [homePage, siteSettings] = await Promise.all([
		getHomePage(),
		getSiteSettings(),
	]);

	// Section visibility settings (defaults to all visible if not set)
	const visibility = homePage.sectionVisibility || {
		hero: true,
		features: true,
		productShowcase: true,
		imageGallery: true,
		processSteps: true,
		about: true,
		testimonials: true,
		cta: true,
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			{visibility.hero && homePage.hero && <Hero data={homePage.hero} />}

			{/* Search Section - Always visible */}
			<SearchSection />

			{/* Feature Highlights */}
			{visibility.features && homePage.features?.length > 0 && (
				<FeatureHighlights features={homePage.features} />
			)}

			{/* Product Showcase */}
			{visibility.productShowcase &&
				(homePage.productShowcase?.products?.length ?? 0) > 0 && (
					<ProductShowcase data={homePage.productShowcase} />
				)}

			{/* Image Gallery */}
			{visibility.imageGallery &&
				(homePage.imageGallery?.images?.length ?? 0) > 0 && (
					<ImageGallery data={homePage.imageGallery} />
				)}

			{/* About Section */}
			{visibility.about && homePage.aboutSection && (
				<AboutSection data={homePage.aboutSection} />
			)}

			{/* Process Steps */}
			{visibility.processSteps &&
				(homePage.processStepsSection?.steps?.length ?? 0) > 0 && (
					<ProcessSteps data={homePage.processStepsSection} />
				)}

			{/* Testimonials */}
			{visibility.testimonials &&
				(homePage.testimonialsSection?.testimonials?.length ?? 0) > 0 && (
					<Testimonials data={homePage.testimonialsSection} />
				)}

			{/* CTA Section */}
			{visibility.cta && homePage.ctaSection && (
				<CtaSection
					data={homePage.ctaSection}
					phone={siteSettings.phone}
					email={siteSettings.email}
				/>
			)}

			{/* Floating Contact Button - Always visible */}
			{/* <FloatingContactButton /> */}
		</div>
	);
}
