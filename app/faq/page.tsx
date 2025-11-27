import type { Metadata } from "next";
import { FAQHero } from "./_components/faq-hero";
import { FAQAccordion } from "./_components/faq-accordion";
import { FAQSidebar } from "./_components/faq-sidebar";
import { FAQNewsletter } from "./_components/faq-newsletter";
import { getAllFAQs } from "@/data/faq/faq-data";

/**
 * FAQ Page Metadata
 */
export const metadata: Metadata = {
	title: "FAQ - Vanliga frågor och svar",
	description:
		"Har du frågor om Synos Medical, våra produkter, utbildningar eller tjänster? Här hittar du svar på de vanligaste frågorna. Kontakta oss gärna om du inte hittar svar på din fråga.",
	keywords: [
		"FAQ",
		"vanliga frågor",
		"frågor och svar",
		"Synos Medical",
		"lasermaskiner",
		"utbildning",
		"support",
	],
	openGraph: {
		title: "FAQ - Vanliga frågor och svar | Synos Medical",
		description:
			"Svar på de vanligaste frågorna om Synos Medical, våra produkter, utbildningar och tjänster.",
		type: "website",
		locale: "sv_SE",
	},
	twitter: {
		card: "summary_large_image",
		title: "FAQ - Vanliga frågor och svar | Synos Medical",
		description:
			"Svar på de vanligaste frågorna om Synos Medical, våra produkter, utbildningar och tjänster.",
	},
};

/**
 * FAQ Page Component
 * 
 * Main FAQ page with:
 * - Hero section
 * - FAQ accordion with search
 * - Sidebar with contact info
 * - Newsletter subscription
 * - Fully responsive layout
 * - SEO optimized
 */
export default function FAQPage() {
	// Get all FAQs
	const faqs = getAllFAQs();

	return (
		<div className="min-h-screen bg-slate-100">
			{/* Hero Section */}
			<FAQHero />

			{/* Main Content Section */}
			<section className="py-16 md:py-24">
				<div className="_container">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
						{/* FAQ Accordion - Main Content */}
						<div className="lg:col-span-2 order-2 lg:order-1">
							<FAQAccordion faqs={faqs} />
						</div>

						{/* Sidebar */}
						<div className="lg:col-span-1 order-1 lg:order-2">
							<div className="lg:sticky lg:top-24">
								<FAQSidebar />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<FAQNewsletter />

			{/* Structured Data for SEO */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: faqs.map((faq) => ({
							"@type": "Question",
							name: faq.question,
							acceptedAnswer: {
								"@type": "Answer",
								text: faq.answer,
							},
						})),
					}),
				}}
			/>
		</div>
	);
}

