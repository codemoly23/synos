import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { getArticlesByCategory } from "@/lib/data/blog";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { NyheterCard } from "../../_components/nyheter-card";
import { NyheterHero } from "../../_components/nyheter-hero";

/**
 * Nyheter Category Archive Page
 *
 * URL: /nyheter/category/[slug]/
 * Shows all blog posts in a specific category
 * Uses ISR for optimal performance.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new categories to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all active categories at build time
 */
export async function generateStaticParams() {
	try {
		const categories = await blogCategoryService.getActiveCategories();
		return categories.map((cat) => ({ slug: cat.slug }));
	} catch (error) {
		console.error("Error generating static params for nyheter categories:", error);
		return [];
	}
}

interface CategoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

async function getCategoryBySlug(slug: string) {
	try {
		return await blogCategoryService.getCategoryBySlug(slug);
	} catch {
		return null;
	}
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [category, siteConfig] = await Promise.all([
		getCategoryBySlug(slug),
		getSiteConfig(),
	]);

	if (!category) {
		return {
			title: `Kategori hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${category.name} | Nyheter | ${siteConfig.name}`,
		description: `Läs våra artiklar om ${category.name.toLowerCase()}. Tips, guider och nyheter från Synos Medical.`,
		openGraph: {
			title: `${category.name} | Nyheter | ${siteConfig.name}`,
			description: `Läs våra artiklar om ${category.name.toLowerCase()}.`,
			url: `${siteConfig.url}/nyheter/category/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/nyheter/category/${slug}`,
		},
	};
}

export default async function NyheterCategoryPage({
	params,
}: CategoryPageProps) {
	const { slug } = await params;
	const [category, articles] = await Promise.all([
		getCategoryBySlug(slug),
		getArticlesByCategory(slug),
	]);

	if (!category || articles.length === 0) {
		notFound();
	}

	return (
		<>
			<NyheterHero pageTitle={category.name} />

			<section className="py-12 md:py-16 lg:py-20 bg-slate-50/50">
				<div className="_container">
					{/* Page Header */}
					<div className="mb-8">
						<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
							Kategori
						</p>
						<p className="text-muted-foreground">
							{articles.length} artikel{articles.length !== 1 ? "ar" : ""} i
							denna kategori
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
