import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { blogArticles } from "@/data/blog/blog-data";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Category Archive Page
 *
 * URL: /blogg/category/[slug]/
 * Shows all blog posts in a specific category
 */

interface CategoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Blog categories with Swedish names
const CATEGORY_NAMES: Record<string, string> = {
	artikelserier: "Artikelserier",
	behandlingar: "Behandlingar",
	eftervard: "Eftervård",
	gynekologi: "Gynekologi",
	harborttagning: "Hårborttagning",
	hudatstramning: "Hudåtstramning",
	hudforyngring: "Hudföryngring",
	inkontinens: "Inkontinens",
	klinikutrustning: "Klinikutrustning",
	muskelatstramning: "Muskelatstramning",
	nyheter: "Nyheter",
	okategoriserade: "Okategoriserade",
	produkter: "Produkter",
	tatueringsborttagning: "Tatueringsborttagning",
};

function createSlug(str: string): string {
	return str
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-");
}

function getArticlesByCategory(categorySlug: string) {
	return blogArticles.filter((article) =>
		article.categories.some((cat) => createSlug(cat) === categorySlug)
	);
}

function getCategoryName(slug: string): string {
	return CATEGORY_NAMES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { slug } = await params;
	const categoryName = getCategoryName(slug);
	const articles = getArticlesByCategory(slug);

	if (articles.length === 0) {
		return {
			title: `Kategori hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${categoryName} | Blogg | ${siteConfig.name}`,
		description: `Läs våra artiklar om ${categoryName.toLowerCase()}. Tips, guider och nyheter från Synos Medical.`,
		openGraph: {
			title: `${categoryName} | Blogg | ${siteConfig.name}`,
			description: `Läs våra artiklar om ${categoryName.toLowerCase()}.`,
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
	const categoryName = getCategoryName(slug);
	const articles = getArticlesByCategory(slug);

	if (articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blogg", href: "/blogg" },
						{ label: categoryName },
					]}
				/>

				{/* Page Header */}
				<div className="mb-12">
					<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
						Kategori
					</p>
					<h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
						{categoryName}
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
