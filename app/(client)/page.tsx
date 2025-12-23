import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { SearchSection } from "@/components/home/SearchSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ImageGallery } from "@/components/home/ImageGallery";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { Testimonials } from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import CtaSection from "@/components/home/CtaSection";
import { getHomePage, getHomePageSeo } from "@/lib/services/home-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { searchService } from "@/lib/services/search.service";
import { SearchPageClient } from "./search-page";
import { SearchPageSkeleton } from "@/components/search/SearchSkeleton";

// ISR: Revalidate every 24 hours
// Note: Search mode uses searchParams which makes those requests dynamic
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const [seo, siteSettings] = await Promise.all([
		getHomePageSeo(),
		getSiteSettings(),
	]);

	const siteName = siteSettings.seo?.siteName || "Synos Medical";
	const siteDescription =
		siteSettings.seo?.siteDescription ||
		"Sveriges ledande leverantör av MDR-certifierad klinikutrustning";

	const title = seo?.title || `${siteName} - Medicinsk utrustning`;
	const description = seo?.description || siteDescription;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			siteName,
			...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(seo?.ogImage && { images: [seo.ogImage] }),
		},
	};
}

interface HomeProps {
	searchParams: Promise<{ s?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
	const params = await searchParams;
	const searchQuery = params?.s || "";
	const isSearchMode = searchQuery.length >= 2;

	// If in search mode, fetch search results server-side
	if (isSearchMode) {
		const page = parseInt(params?.page || "1");
		let initialResults = null;

		try {
			initialResults = await searchService.search({
				query: searchQuery,
				page,
				limit: 10,
			});
		} catch (error) {
			console.error("Server-side search error:", error);
		}

		return (
			<div className="flex flex-col min-h-screen pt-20">
				<Suspense
					fallback={
						<div className="_container py-12">
							<SearchPageSkeleton />
						</div>
					}
				>
					<SearchPageClient
						initialResults={initialResults}
						initialQuery={searchQuery}
					/>
				</Suspense>
			</div>
		);
	}

	// Fetch CMS data for homepage
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
