import { Metadata } from "next";
import {
	getAllArticles,
	getAllCategories,
	getRecentArticles,
} from "@/lib/data/blog";
import { getSiteConfig } from "@/config/site";
import { BlogListingClient } from "./_components/blog-listing-client";
// import { TrustindexReviews } from "@/components/widgets/TrustindexReviews";

/**
 * Blog Listing Page
 *
 * Displays all blog articles with filtering and search capabilities.
 * Now fetches from database instead of static data.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();

	return {
		title: `Blogg – Nyheter & Artiklar | ${siteConfig.name}`,
		description:
			"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning. Expertguider, tekniska genomgångar och branschnyheter.",
		keywords: [
			"blogg",
			"nyheter",
			"artiklar",
			"hårborttagning",
			"tatueringsborttagning",
			"hudvård",
			"laser",
			"klinikutrustning",
		],
		openGraph: {
			title: `Blogg – Nyheter & Artiklar | ${siteConfig.name}`,
			description:
				"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning.",
			url: `${siteConfig.url}/blogg`,
			siteName: siteConfig.name,
			images: [
				{
					url: `${siteConfig.url}/images/og/blogg.jpg`,
					width: 1200,
					height: 630,
					alt: `${siteConfig.name} Blogg`,
				},
			],
			locale: "sv_SE",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: `Blogg – Nyheter & Artiklar | ${siteConfig.name}`,
			description:
				"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning.",
			images: [`${siteConfig.url}/images/og/blogg.jpg`],
		},
		alternates: {
			canonical: `${siteConfig.url}/blogg`,
		},
	};
}

export default async function BlogPage() {
	const [articles, categories, recentArticles, siteConfig] = await Promise.all(
		[getAllArticles(), getAllCategories(), getRecentArticles(5), getSiteConfig()]
	);

	return (
		<>
			{/* Structured Data - Blog */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Blog",
						name: `${siteConfig.name} Blogg`,
						description:
							"Nyheter och artiklar om klinikutrustning, laserbehandlingar och estetisk medicin.",
						url: `${siteConfig.url}/blogg`,
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
							url: `${siteConfig.url}/blogg/${article.slug}`,
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

			<BlogListingClient
				articles={articles}
				categories={categories}
				recentArticles={recentArticles}
			/>

			{/* Trustindex Reviews Widget - Temporarily disabled */}
		</>
	);
}
