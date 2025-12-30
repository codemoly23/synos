import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { getArticlesByCategory } from "@/lib/data/blog";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Category Archive Page
 *
 * URL: /blogg/category/[slug]/
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
		console.error("Error generating static params for blog categories:", error);
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
		title: `${category.name} | Blogg | ${siteConfig.name}`,
		description: `Läs våra artiklar om ${category.name.toLowerCase()}. Tips, guider och nyheter från Synos Medical.`,
		openGraph: {
			title: `${category.name} | Blogg | ${siteConfig.name}`,
			description: `Läs våra artiklar om ${category.name.toLowerCase()}.`,
			url: `${siteConfig.url}/blogg/category/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/blogg/category/${slug}`,
		},
	};
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
	const { slug } = await params;
	const [category, articles] = await Promise.all([
		getCategoryBySlug(slug),
		getArticlesByCategory(slug),
	]);

	if (!category || articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blogg", href: "/blogg" },
						{ label: category.name },
					]}
				/>

				{/* Page Header */}
				<div className="mb-12">
					<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
						Kategori
					</p>
					<h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
						{category.name}
					</h1>
					<p className="text-lg text-muted-foreground">
						{articles.length} artikel{articles.length !== 1 ? "ar" : ""} i
						denna kategori
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
