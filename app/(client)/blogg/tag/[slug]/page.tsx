import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { blogArticles } from "@/data/blog/blog-data";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Tag Archive Page
 *
 * URL: /blogg/tag/[slug]/
 * Shows all blog posts with a specific tag
 */

interface TagPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Blog tags with Swedish names
const TAG_NAMES: Record<string, string> = {
	"fore-och-efter-bilder": "Före och efter bilder",
	"again-pro": "Again Pro",
	aknearr: "Akneärr",
	"co2-laser": "CO2 laser",
	coolpeel: "CoolPeel",
	duoglide: "DuoGlide",
	eftervard: "Eftervård",
	fodelsemarken: "Födelsemärken",
	"fragor-och-svar": "Frågor och svar",
	fraknar: "Fräknar",
	hudvard: "Hudvård",
	koldioxidlaser: "Koldioxidlaser",
	"kosmetiska-tatueringar": "Kosmetiska tatueringar",
	leverflackar: "Leverfläckar",
	luxea: "Luxea",
	"motus-ax": "Motus AX",
	"motus-ay": "Motus AY",
	moveo: "Moveo",
	ndyag: "Nd:YAG",
	picolaser: "Picolaser",
	pigment: "Pigment",
	punto: "Punto",
	"q-switching": "Q-switching",
	"q-terra": "Q-Terra",
	"q-terra-q10": "Q-Terra Q10",
	rynkor: "Rynkor",
	smartpico: "SmartPico",
	tatueringar: "Tatueringar",
	tatueringsborttagning: "Tatueringsborttagning",
	vartor: "Vårtor",
	vinterhud: "Vinterhud",
	vintertorrhud: "Vintertorr hud",
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

function getArticlesByTag(tagSlug: string) {
	return blogArticles.filter((article) =>
		article.tags.some((tag) => createSlug(tag) === tagSlug)
	);
}

function getTagName(slug: string): string {
	return TAG_NAMES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({
	params,
}: TagPageProps): Promise<Metadata> {
	const { slug } = await params;
	const tagName = getTagName(slug);
	const articles = getArticlesByTag(slug);

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
	const tagName = getTagName(slug);
	const articles = getArticlesByTag(slug);

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
