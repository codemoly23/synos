import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getAllArticles,
	getArticleBySlug,
	getArticlesByCategory,
} from "@/data/blog/blog-data";
import { siteConfig } from "@/config/site";
import { BlogDetailHero } from "../../blogg/_components/blog-detail-hero";
import { BlogContent } from "../../blogg/_components/blog-content";
import { BlogAuthor } from "../../blogg/_components/blog-author";
import { RelatedPosts } from "../../blogg/_components/related-posts";
import { BlogComments } from "../../blogg/_components/blog-comments";

/**
 * Nyheter Detail Page
 *
 * Dynamic route for individual news/blog posts under /nyheter.
 * Uses the same components as /blogg but with /nyheter URLs.
 */

// Force dynamic rendering to avoid SSG issues with client components
export const dynamic = "force-dynamic";

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
	const article = getArticleBySlug(slug);

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
	const article = getArticleBySlug(slug);

	if (!article) {
		notFound();
	}

	// Get related articles from the same categories
	const relatedArticles =
		article.categories.length > 0
			? getArticlesByCategory(article.categories[0])
			: getAllArticles();

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

			<BlogDetailHero article={article} />

			<section className="py-16 _container">
				<BlogContent article={article} />
			</section>

			<section className="py-16">
				<div className="_container">
					<BlogAuthor author={article.author} />
				</div>
			</section>

			<BlogComments />

			<RelatedPosts
				articles={relatedArticles}
				currentArticleId={article.id}
				basePath="/nyheter"
			/>
		</>
	);
}
