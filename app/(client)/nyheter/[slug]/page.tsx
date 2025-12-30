import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getArticleBySlug,
	getAllArticles,
	getRelatedArticles,
} from "@/lib/data/blog";
import { blogPostService } from "@/lib/services/blog-post.service";
import { getSiteConfig } from "@/config/site";
import { NyheterDetailHero } from "../_components/nyheter-detail-hero";
import { NyheterContent } from "../_components/nyheter-content";
import { NyheterRelated } from "../_components/nyheter-related";
import { BlogComments } from "../../blogg/_components/blog-comments";
// import { TrustindexReviews } from "@/components/widgets/TrustindexReviews";

/**
 * Nyheter Detail Page
 *
 * Dynamic route for individual news/blog posts under /nyheter.
 * Uses ISR for optimal performance with fresh content.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new posts to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all published posts at build time
 */
export async function generateStaticParams() {
	try {
		const result = await blogPostService.getPublishedPosts({
			limit: 1000,
			sort: "-publishedAt",
		});
		return result.data.map((post) => ({ slug: post.slug }));
	} catch (error) {
		console.error("Error generating static params for news posts:", error);
		return [];
	}
}

interface NyheterDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Generate metadata for SEO
export async function generateMetadata({
	params,
}: NyheterDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [article, siteConfig] = await Promise.all([
		getArticleBySlug(slug),
		getSiteConfig(),
	]);

	if (!article) {
		return {
			title: "Artikel hittades inte | Synos Medical",
		};
	}

	const ogImage = article.seo?.ogImage || article.featuredImage?.url;

	return {
		title: article.seo?.title || `${article.title} | Synos Medical`,
		description: article.seo?.description || article.excerpt,
		keywords: article.seo?.keywords || article.tags,
		openGraph: {
			title: article.seo?.title || article.title,
			description: article.seo?.description || article.excerpt,
			url: `${siteConfig.url}/nyheter/${article.slug}`,
			siteName: siteConfig.name,
			images: ogImage
				? [
						{
							url: ogImage.startsWith("http")
								? ogImage
								: `${siteConfig.url}${ogImage}`,
							width: 1200,
							height: 630,
							alt: article.title,
						},
				  ]
				: [],
			locale: "sv_SE",
			type: "article",
			publishedTime: article.publishedAt,
			modifiedTime: article.updatedAt,
			authors: [article.author.name],
			tags: article.tags,
		},
		twitter: {
			card: "summary_large_image",
			title: article.seo?.title || article.title,
			description: article.seo?.description || article.excerpt,
			images: ogImage
				? [
						ogImage.startsWith("http")
							? ogImage
							: `${siteConfig.url}${ogImage}`,
				  ]
				: [],
		},
		alternates: {
			canonical: `${siteConfig.url}/nyheter/${article.slug}`,
		},
	};
}

export default async function NyheterDetailPage({
	params,
}: NyheterDetailPageProps) {
	const { slug } = await params;
	const [article, siteConfig] = await Promise.all([
		getArticleBySlug(slug),
		getSiteConfig(),
	]);

	if (!article) {
		notFound();
	}

	// Get related articles based on current article
	let relatedArticles;
	if (article.id) {
		relatedArticles = await getRelatedArticles(article.id, 6);
	}

	// Fallback to all articles if no related articles found
	if (!relatedArticles || relatedArticles.length === 0) {
		relatedArticles = await getAllArticles();
	}

	return (
		<>
			{/* Structured Data - Article */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BlogPosting",
						headline: article.title,
						description: article.excerpt,
						image: article.featuredImage?.url
							? `${siteConfig.url}${article.featuredImage.url}`
							: undefined,
						datePublished: article.publishedAt,
						dateModified: article.updatedAt,
						author: {
							"@type": "Person",
							name: article.author.name,
							jobTitle: article.author.role,
						},
						publisher: {
							"@type": "Organization",
							name: siteConfig.name,
							url: siteConfig.url,
							logo: {
								"@type": "ImageObject",
								url: `${siteConfig.url}/logo.png`,
							},
						},
						mainEntityOfPage: {
							"@type": "WebPage",
							"@id": `${siteConfig.url}/nyheter/${article.slug}`,
						},
						keywords: article.tags?.join(", "),
					}),
				}}
			/>

			<NyheterDetailHero article={article} basePath="/nyheter" />

			<NyheterContent article={article} basePath="/nyheter" />

			{/* Customer Reviews - Temporarily disabled */}

			<BlogComments postId={article.id} />

			<NyheterRelated
				articles={relatedArticles}
				currentArticleId={article.id}
				basePath="/nyheter"
			/>
		</>
	);
}
