import { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/lib/data/blog";
import { getSiteConfig } from "@/config/site";
import { NyheterListing } from "./_components/nyheter-listing";
// import { TrustindexReviews } from "@/components/widgets/TrustindexReviews";

/**
 * Nyheter (News) Listing Page
 *
 * Main news page displaying all articles with filtering and search capabilities.
 * Fetches data from MongoDB for dynamic content.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();

	return {
		title: "Nyheter | Synos Medical",
		description:
			"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning. Expertguider, tekniska genomgångar och branschnyheter.",
		keywords: [
			"nyheter",
			"artiklar",
			"hårborttagning",
			"tatueringsborttagning",
			"hudvård",
			"laser",
			"klinikutrustning",
		],
		openGraph: {
			title: "Nyheter | Synos Medical",
			description:
				"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning.",
			url: `${siteConfig.url}/nyheter`,
			siteName: siteConfig.name,
			images: [
				{
					url: `${siteConfig.url}/images/og/nyheter.jpg`,
					width: 1200,
					height: 630,
					alt: "Synos Medical Nyheter",
				},
			],
			locale: "sv_SE",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: "Nyheter | Synos Medical",
			description:
				"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning.",
			images: [`${siteConfig.url}/images/og/nyheter.jpg`],
		},
		alternates: {
			canonical: `${siteConfig.url}/nyheter`,
		},
	};
}

export default async function NyheterPage() {
	const [articles, categories, siteConfig] = await Promise.all([
		getAllArticles(),
		getAllCategories(),
		getSiteConfig(),
	]);

	return (
		<>
			{/* Structured Data - Blog/News */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Blog",
						name: "Synos Medical Nyheter",
						description:
							"Nyheter och artiklar om klinikutrustning, laserbehandlingar och estetisk medicin.",
						url: `${siteConfig.url}/nyheter`,
						publisher: {
							"@type": "Organization",
							name: siteConfig.name,
							url: siteConfig.url,
							logo: {
								"@type": "ImageObject",
								url: `${siteConfig.url}/logo.png`,
							},
						},
						blogPost: articles.slice(0, 10).map((article) => ({
							"@type": "BlogPosting",
							headline: article.title,
							description: article.excerpt,
							url: `${siteConfig.url}/nyheter/${article.slug}`,
							datePublished: article.publishedAt,
							dateModified: article.updatedAt,
							author: {
								"@type": "Person",
								name: article.author.name,
							},
							image: article.featuredImage?.url
								? `${siteConfig.url}${article.featuredImage.url}`
								: undefined,
						})),
					}),
				}}
			/>

			<NyheterListing
				articles={articles}
				categories={categories}
				basePath="/nyheter"
				pageTitle="Nyheter"
			/>

			{/* Trustindex Reviews Widget - Temporarily disabled */}
		</>
	);
}
