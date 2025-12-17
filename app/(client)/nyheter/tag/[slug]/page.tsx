import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getArticlesByTag } from "@/lib/data/blog";
import { NyheterCard } from "../../_components/nyheter-card";
import { NyheterHero } from "../../_components/nyheter-hero";

/**
 * Nyheter Tag Archive Page
 *
 * URL: /nyheter/tag/[slug]/
 * Shows all blog posts with a specific tag
 * Fetches from MongoDB
 */

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
	const articles = await getArticlesByTag(slug);

	if (articles.length === 0) {
		return {
			title: `Tagg hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${tagName} | Nyheter | ${siteConfig.name}`,
		description: `Artiklar taggade med "${tagName}". Tips, guider och nyheter från Synos Medical.`,
		openGraph: {
			title: `${tagName} | Nyheter | ${siteConfig.name}`,
			description: `Artiklar taggade med "${tagName}".`,
			url: `${siteConfig.url}/nyheter/tag/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/nyheter/tag/${slug}`,
		},
	};
}

export default async function NyheterTagPage({ params }: TagPageProps) {
	const { slug } = await params;
	const tagName = formatTagName(slug);
	const articles = await getArticlesByTag(slug);

	if (articles.length === 0) {
		notFound();
	}

	return (
		<>
			<NyheterHero pageTitle={tagName} />

			<section className="py-12 md:py-16 lg:py-20 bg-slate-50/50">
				<div className="_container">
					{/* Page Header */}
					<div className="mb-8">
						<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
							Tagg
						</p>
						<p className="text-muted-foreground">
							{articles.length} artikel{articles.length !== 1 ? "ar" : ""} med
							denna tagg
						</p>
					</div>

					{/* Articles Grid */}
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{articles.map((article, index) => (
							<NyheterCard
								key={article.id}
								article={article}
								index={index}
								basePath="/nyheter"
							/>
						))}
					</div>

					{/* Back Link */}
					<div className="mt-12 text-center">
						<Link
							href="/nyheter"
							className="text-primary hover:underline"
						>
							← Tillbaka till nyheter
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
