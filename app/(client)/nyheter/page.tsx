import { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/data/blog/blog-data";
import { siteConfig } from "@/config/site";
import { BlogListingClient } from "../blogg/_components/blog-listing-client";

/**
 * Nyheter (News) Listing Page
 *
 * Main news page displaying all articles with filtering and search capabilities.
 * Uses the same components as /blogg but with "Nyheter" branding.
 */

export const metadata: Metadata = {
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

export default function NyheterPage() {
	const articles = getAllArticles();
	const categories = getAllCategories();

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

			<BlogListingClient
				articles={articles}
				categories={categories}
				basePath="/nyheter"
				pageTitle="Nyheter"
			/>
		</>
	);
}
