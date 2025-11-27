import { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/data/blog/blog-data";
import { siteConfig } from "@/config/site";
import { BlogListingClient } from "./_components/blog-listing-client";

/**
 * Blog Listing Page
 *
 * Displays all blog articles with filtering and search capabilities.
 */

export const metadata: Metadata = {
	title: "Blogg – Nyheter & Artiklar | Synos Medical",
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
		title: "Blogg – Nyheter & Artiklar | Synos Medical",
		description:
			"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning.",
		url: `${siteConfig.url}/blogg`,
		siteName: siteConfig.name,
		images: [
			{
				url: `${siteConfig.url}/images/og/blogg.jpg`,
				width: 1200,
				height: 630,
				alt: "Synos Medical Blogg",
			},
		],
		locale: "sv_SE",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Blogg – Nyheter & Artiklar | Synos Medical",
		description:
			"Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning.",
		images: [`${siteConfig.url}/images/og/blogg.jpg`],
	},
	alternates: {
		canonical: `${siteConfig.url}/blogg`,
	},
};

export default function BlogPage() {
	const articles = getAllArticles();
	const categories = getAllCategories();

	return (
		<>
			{/* Structured Data - Blog */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Blog",
						name: "Synos Medical Blogg",
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

			<BlogListingClient articles={articles} categories={categories} />
		</>
	);
}
