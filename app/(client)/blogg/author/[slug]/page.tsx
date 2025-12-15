import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { blogArticles } from "@/data/blog/blog-data";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Author Archive Page
 *
 * URL: /blogg/author/[slug]/
 * Shows all blog posts by a specific author
 */

interface AuthorPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Author information
const AUTHORS: Record<
	string,
	{ name: string; role: string; bio?: string; image?: string }
> = {
	"agnessynos-se": {
		name: "Agnes",
		role: "Content Manager",
		bio: "Agnes arbetar med innehåll och marknadsföring på Synos Medical.",
	},
	"andreassynos-se": {
		name: "Andreas",
		role: "VD",
		bio: "Andreas är grundare och VD för Synos Medical.",
	},
};

function createAuthorSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/@/g, "")
		.replace(/\./g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-");
}

function getArticlesByAuthor(authorSlug: string) {
	return blogArticles.filter((article) => {
		if (!article.author?.name) return false;
		const slug = createAuthorSlug(article.author.name);
		return slug === authorSlug;
	});
}

function getAuthorInfo(slug: string) {
	// First check predefined authors
	if (AUTHORS[slug]) {
		return AUTHORS[slug];
	}

	// Try to find from articles
	const articles = getArticlesByAuthor(slug);
	if (articles.length > 0 && articles[0].author) {
		return {
			name: articles[0].author.name,
			role: articles[0].author.role || "Författare",
			bio: articles[0].author.bio,
			image: articles[0].author.image,
		};
	}

	return null;
}

export async function generateMetadata({
	params,
}: AuthorPageProps): Promise<Metadata> {
	const { slug } = await params;
	const author = getAuthorInfo(slug);
	const articles = getArticlesByAuthor(slug);

	if (!author || articles.length === 0) {
		return {
			title: `Författare hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${author.name} | Författare | ${siteConfig.name}`,
		description: `Läs artiklar av ${author.name}. ${author.bio || ""}`,
		openGraph: {
			title: `${author.name} | Författare | ${siteConfig.name}`,
			description: `Läs artiklar av ${author.name}.`,
			url: `${siteConfig.url}/blogg/author/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "profile",
		},
		alternates: {
			canonical: `${siteConfig.url}/blogg/author/${slug}`,
		},
	};
}

export default async function BlogAuthorPage({ params }: AuthorPageProps) {
	const { slug } = await params;
	const author = getAuthorInfo(slug);
	const articles = getArticlesByAuthor(slug);

	if (!author || articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blogg", href: "/blogg" },
						{ label: author.name },
					]}
				/>

				{/* Author Header */}
				<div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
					{/* Author Avatar */}
					<div className="mb-6 md:mb-0 md:mr-8">
						{author.image ? (
							<Image
								src={author.image}
								alt={author.name}
								width={120}
								height={120}
								className="rounded-full"
							/>
						) : (
							<div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
								{author.name.charAt(0)}
							</div>
						)}
					</div>

					{/* Author Info */}
					<div>
						<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
							Författare
						</p>
						<h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
							{author.name}
						</h1>
						<p className="mb-4 text-lg text-muted-foreground">
							{author.role}
						</p>
						{author.bio && (
							<p className="max-w-2xl text-muted-foreground">{author.bio}</p>
						)}
						<p className="mt-4 text-sm text-muted-foreground">
							{articles.length} publicerad{articles.length !== 1 ? "e" : ""}{" "}
							artikel{articles.length !== 1 ? "ar" : ""}
						</p>
					</div>
				</div>

				{/* Articles Grid */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{articles.map((article) => (
						<BlogCard key={article.id} article={article} />
					))}
				</div>

				{/* Back Link */}
				<div className="mt-12 text-center">
					<Link href="/blogg" className="text-primary hover:underline">
						← Tillbaka till bloggen
					</Link>
				</div>
			</div>
		</div>
	);
}
