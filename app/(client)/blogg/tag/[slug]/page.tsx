import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { getArticlesByTag, getAllTags } from "@/lib/data/blog";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Tag Archive Page
 *
 * URL: /blogg/tag/[slug]/
 * Shows all blog posts with a specific tag
 * Uses ISR for optimal performance.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new tags to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all tags at build time
 */
export async function generateStaticParams() {
	try {
		const tags = await getAllTags();
		// Convert tag names to slugs
		return tags.map((tag) => ({
			slug: tag
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, ""),
		}));
	} catch (error) {
		console.error("Error generating static params for blog tags:", error);
		return [];
	}
}

interface TagPageProps {
	params: Promise<{
		slug: string;
	}>;
}

function formatTagName(slug: string): string {
	// Convert slug back to readable format
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export async function generateMetadata({
	params,
}: TagPageProps): Promise<Metadata> {
	const { slug } = await params;
	const tagName = formatTagName(slug);
	const [articles, siteConfig] = await Promise.all([
		getArticlesByTag(slug),
		getSiteConfig(),
	]);

	if (articles.length === 0) {
		return {
			title: `Tagg hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${tagName} | Blogg | ${siteConfig.name}`,
		description: `Artiklar taggade med "${tagName}". Tips, guider och nyheter från Synos Medical.`,
		openGraph: {
			title: `${tagName} | Blogg | ${siteConfig.name}`,
			description: `Artiklar taggade med "${tagName}".`,
			url: `${siteConfig.url}/blogg/tag/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/blogg/tag/${slug}`,
		},
	};
}

export default async function BlogTagPage({ params }: TagPageProps) {
	const { slug } = await params;
	const tagName = formatTagName(slug);
	const articles = await getArticlesByTag(slug);

	if (articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blogg", href: "/blogg" },
						{ label: tagName },
					]}
				/>

				{/* Page Header */}
				<div className="mb-12">
					<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
						Tagg
					</p>
					<h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
						{tagName}
					</h1>
					<p className="text-lg text-muted-foreground">
						{articles.length} artikel{articles.length !== 1 ? "ar" : ""} med
						denna tagg
					</p>
				</div>

				{/* Articles Grid */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{articles.map((article) => (
						<BlogCard key={article.id} article={article} />
					))}
				</div>

				{/* Back Link */}
				<div className="mt-12 text-center">
					<Link
						href="/blogg"
						className="text-primary hover:underline"
					>
						← Tillbaka till bloggen
					</Link>
				</div>
			</div>
		</div>
	);
}
