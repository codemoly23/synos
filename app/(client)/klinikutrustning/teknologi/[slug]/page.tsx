import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import {
	getNewestProducts,
	getActiveCategories,
	getActiveTechnologyGroupNames,
	getTechnologyGroupBySlug,
} from "@/lib/services/product-cache.service";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, BookOpen, Settings, Check, FileText } from "lucide-react";
import { MobileFilterDrawer } from "@/components/klinikutrustning/MobileFilterDrawer";
import { ImageComponent } from "@/components/common/image-component";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { getContactInfo, getBrandingSettings } from "@/lib/services/site-settings.service";
import { HeroCategoryForm } from "@/components/klinikutrustning/HeroCategoryForm";
import { CategoryDescriptionExpander } from "@/components/klinikutrustning/CategoryDescriptionExpander";
import {
	generateSimpleBreadcrumbJsonLd,
	generateCollectionPageJsonLd,
	generateFaqJsonLd,
} from "@/lib/seo";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Technology Group Landing Page
 *
 * URL: /klinikutrustning/teknologi/[slug]
 * Mirrors the KATEGORI "Visa alla" pattern (path-based, under /klinikutrustning)
 * for technology groups. Resolves the group by slug, lists products whose
 * `technologyGroups` array contains the group name, and renders the group's
 * own hero / FAQ / inquiry form. The existing /produkter?technology= page is
 * left untouched.
 */

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Allow new technology groups to be generated on-demand
export const dynamicParams = true;

interface TeknologiPageProps {
	params: Promise<{ slug: string }>;
}

type TechGroupItem = { _id: string; name: string; slug: string; order: number };

/**
 * Pre-render all active technology group slugs at build time.
 */
export async function generateStaticParams() {
	try {
		const groups = await getActiveTechnologyGroupNames();
		return groups.filter((g) => g.slug).map((g) => ({ slug: g.slug }));
	} catch (error) {
		console.error("Error generating static params for technology groups:", error);
		return [];
	}
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateMetadata({
	params,
}: TeknologiPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [group, siteConfig] = await Promise.all([
		getTechnologyGroupBySlug(slug),
		getSiteConfig(),
	]);

	if (!group) {
		return {
			title: `Teknologi hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	const seoTitle = group.seo?.title || `${group.name} | Teknologi | ${siteConfig.name}`;
	const seoDescription =
		group.seo?.description ||
		(group.description
			? stripHtml(group.description).slice(0, 160)
			: `Utforska vårt sortiment inom ${group.name}. MDR-certifierad utrustning från DEKA.`);
	const ogImage = group.seo?.ogImage || group.image || undefined;
	const canonical = `${siteConfig.url}/klinikutrustning/teknologi/${group.slug}`;

	return {
		title: seoTitle,
		description: seoDescription,
		openGraph: {
			title: group.seo?.title || `${group.name} | ${siteConfig.name}`,
			description: seoDescription,
			url: canonical,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
			...(ogImage ? { images: [{ url: ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage}`, alt: group.name }] } : {}),
		},
		alternates: { canonical },
		robots: group.seo?.noindex ? { index: false, follow: true } : undefined,
	};
}

// Product Card Component
function ProductCardDB({
	product,
	categorySlug,
}: {
	product: IProduct;
	categorySlug: string;
}) {
	const primaryImage = product.overviewImage || product.productImages?.[0];
	return (
		<Link href={`/klinikutrustning/${categorySlug}/${product.slug}`} className="h-full">
			<Card className="group h-full flex flex-col overflow-hidden border-primary/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 p-0!">
				<div className="relative aspect-4/3 overflow-hidden bg-primary/50 shrink-0">
					<ImageComponent
						src={primaryImage}
						alt={product.title}
						height={0}
						width={0}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						showLoader
						wrapperClasses="w-full h-full"
						className="object-cover transition-transform h-full w-full duration-300 group-hover:scale-105"
					/>
				</div>
				<div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2">
					<h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">
						{product.title}
					</h3>
					<p className="text-base text-muted-foreground line-clamp-2">
						{product.shortDescription}
					</p>
					<div className="flex-1" />
					<Button className="w-full btn-copper-gradient transition-colors">
						Läs mer
					</Button>
				</div>
			</Card>
		</Link>
	);
}

// Sidebar Component
function TeknologiSidebar({
	categories,
	techGroups,
	activeSlug,
}: {
	categories: ICategory[];
	techGroups: TechGroupItem[];
	activeSlug: string;
}) {
	return (
		<aside className="space-y-4">
			{/* Behandlingskategorier Card — from DB */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">Behandlingskategorier</CardTitle>
					<Link
						href="/kategori"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors text-foreground hover:bg-primary/20"
					>
						Alla Produkter
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="pb-2! p-0">
					<div className="max-h-[200px] overflow-y-auto px-3">
						{categories.map((cat) => (
							<Link
								key={cat._id.toString()}
								href={`/klinikutrustning/${cat.slug}`}
								className="block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-foreground hover:bg-primary/20"
							>
								{cat.name}
							</Link>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Technology Category Card — from DB, links to this route */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">Teknologikategori</CardTitle>
					<Link
						href="/klinikutrustning"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors text-foreground hover:bg-primary/20"
					>
						Alla Teknologier
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="pb-2! p-0">
					<div className="max-h-[200px] overflow-y-auto px-3">
						{techGroups.map((tech) => (
							<Link
								key={tech._id}
								href={`/klinikutrustning/teknologi/${tech.slug}`}
								className={`block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
									activeSlug === tech.slug
										? "btn-copper-gradient"
										: "text-foreground hover:bg-primary/20"
								}`}
							>
								{tech.name}
							</Link>
						))}
						{techGroups.length === 0 && (
							<p className="px-3 py-2 text-sm text-muted-foreground">Inga teknologier</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Quick Info Card */}
			<Card className="border-primary/50 bg-linear-to-br from-primary/20 to-slate-100">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">Behöver du hjälp?</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-foreground">
						Våra experter hjälper dig att hitta rätt utrustning för din verksamhet.
					</p>
					<Link
						href="/kontakt"
						className="inline-flex items-center justify-center rounded-lg btn-copper-gradient px-4 py-2 text-sm font-medium transition-colors border border-transparent"
					>
						Kontakta oss
					</Link>
				</CardContent>
			</Card>

			{/* Features Card */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">Varför välja Synos?</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<ShieldCheck className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">MDR-certifierade</h4>
							<p className="text-xs text-muted-foreground">Alla produkter är certifierade enligt EU-förordningar</p>
						</div>
					</div>
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<BookOpen className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">Utbildning ingår</h4>
							<p className="text-xs text-muted-foreground">Komplett utbildning och support vid köp</p>
						</div>
					</div>
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<Settings className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">Snabb service</h4>
							<p className="text-xs text-muted-foreground">Reparation inom 48 arbetstimmar</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</aside>
	);
}

// Mobile Drawer Component

export default async function TeknologiPage({ params }: TeknologiPageProps) {
	const { slug } = await params;

	const group = await getTechnologyGroupBySlug(slug);
	if (!group) {
		notFound();
	}

	const [products, categories, techGroups, contactInfo, branding] = await Promise.all([
		getNewestProducts(100).catch(() => [] as IProduct[]),
		getActiveCategories().catch(() => [] as ICategory[]),
		getActiveTechnologyGroupNames().catch(() => [] as TechGroupItem[]),
		getContactInfo().catch(() => ({ phone: "", email: "" })),
		getBrandingSettings().catch(() => null),
	]);

	// Filter products to this technology group (matched by name on the product).
	const filteredProducts = products.filter((p) =>
		((p as unknown as { technologyGroups?: string[] }).technologyGroups || []).includes(group.name)
	);

	// Hero content: technology-specific fields take priority, then defaults.
	const heroTitle = group.heroTitle?.trim() || group.name;
	const heroSubtitle =
		group.heroSubtitle?.trim() || "Avancerad laserplattform för professionella behandlingar";
	const defaultBullets = [
		"Snabb och effektiv behandling",
		"Skonsam teknik med hög precision",
		"Intuitiv touchskärm och smart arbetsflöde",
		"Anpassad för professionella kliniker",
	];
	const heroBullets = group.heroBulletPoints?.length ? group.heroBulletPoints : defaultBullets;
	const heroBgMobile = group.heroBgMobile || "/Mobile_bilder/Again_pro.webp";
	const heroBgDesktop = group.heroBgDesktop || "/images/Product detail breadcrumbs background.jpeg";

	// FAQ: group's own admin-managed FAQs (visible only); section hidden if none.
	const techFaqs = (group.faqs || [])
		.filter((f) => f.visible)
		.map((f) => ({ _id: f._id, question: f.question, answer: f.answer, visible: f.visible }));
	const faqTitle =
		group.faqTitle && group.faqTitle.trim().length > 0
			? group.faqTitle
			: `Vanliga frågor om ${group.name}`;

	// Category slug resolution for product cards (mirrors /produkter logic).
	const categorySlugMap = new Map<string, string>();
	categories.forEach((cat) => categorySlugMap.set(cat._id.toString(), cat.slug));
	function getCategorySlugForProduct(product: IProduct): string {
		const primaryCat = product.primaryCategory as unknown as {
			_id?: { toString(): string };
			slug?: string;
		};
		if (primaryCat?.slug) return primaryCat.slug;
		if (primaryCat?._id) {
			const s = categorySlugMap.get(primaryCat._id.toString());
			if (s) return s;
		}
		if (product.categories && product.categories.length > 0) {
			const firstCategory = product.categories[0] as unknown as {
				_id?: { toString(): string };
				slug?: string;
			};
			if (firstCategory?.slug) return firstCategory.slug;
			const catId = firstCategory?._id?.toString();
			if (catId) return categorySlugMap.get(catId) || "uncategorized";
		}
		return "uncategorized";
	}

	const siteConfig = await getSiteConfig();
	const breadcrumbJsonLd = generateSimpleBreadcrumbJsonLd([
		{ name: "Hem", url: siteConfig.url },
		{ name: "Klinikutrustning", url: `${siteConfig.url}/klinikutrustning` },
		{ name: group.name, url: `${siteConfig.url}/klinikutrustning/teknologi/${slug}` },
	]);
	const collectionPageJsonLd = generateCollectionPageJsonLd({
		name: group.name,
		description: group.description ? stripHtml(group.description).slice(0, 300) : undefined,
		url: `${siteConfig.url}/klinikutrustning/teknologi/${slug}`,
		items: filteredProducts.map((product) => ({
			name: product.title,
			url: `${siteConfig.url}/klinikutrustning/${getCategorySlugForProduct(product)}/${product.slug}`,
		})),
	});
	const faqJsonLd = generateFaqJsonLd(techFaqs);

	return (
		<div className="min-h-screen">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
			/>
			{faqJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
				/>
			)}

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-20 sm:pt-24 bg-black">
				{/* ── MOBILE LAYOUT ── */}
				<div className="relative overflow-hidden h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] lg:hidden">
					<ImageComponent
						src={heroBgMobile}
						alt=""
						fill
						priority
						className="object-cover object-top"
						sizes="100vw"
					/>
				</div>

				{/* Mobile text — below background */}
				<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[28vh]">
					<h1 className="text-[1.75rem] md:text-5xl font-sans font-light text-white mb-3 leading-tight break-words">{heroTitle}</h1>
					<div className="w-14 h-[2px] bg-primary mb-4" />
					<p className="text-white/70 text-sm mb-8 leading-relaxed">{heroSubtitle}</p>
					<ul className="space-y-4">
						{heroBullets.map((item) => (
							<li key={item} className="flex items-center gap-3">
								<div className="h-6 w-6 rounded-full border border-[#fcf3e1] flex items-center justify-center shrink-0">
									<Check className="h-3 w-3 text-[#fcf3e1]" strokeWidth={1} />
								</div>
								<span className="text-white/90 text-sm font-thin">{item}</span>
							</li>
						))}
					</ul>
					<a href="#inquiry-form" className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#cf9d7c] text-[#cf9d7c] text-sm font-light">
						<FileText className="h-4 w-4 shrink-0" />
						Begär offert
					</a>
				</div>

				{/* ── DESKTOP LAYOUT ── */}
				<div className="hidden lg:block">
					<div className="_container relative overflow-hidden min-h-[740px]">
						<ImageComponent
							src={heroBgDesktop}
							alt=""
							fill
							priority
							className="object-cover object-[30%_top]"
							sizes="100vw"
						/>
						<div className="relative z-10 grid grid-cols-2 items-center min-h-[740px] gap-8">
							<div />
							{/* Right — Form */}
							<div className="flex flex-col justify-center py-10 pl-10 pr-8">
								<h2 className="text-5xl font-sans font-light text-white mb-2 leading-tight">{heroTitle}</h2>
								<p className="text-white/60 text-base mb-8 leading-relaxed">{heroSubtitle}</p>
								<HeroCategoryForm categoryName={heroTitle} />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<div className="bg-linear-to-b from-slate-100 to-primary/10">
				<div className="_container mx-auto px-4 py-8">
					<div className="flex flex-col gap-8 lg:flex-row">
						{/* Sidebar */}
						<div className="w-full lg:w-80 lg:shrink-0">
							<div className="lg:sticky lg:top-28 hidden sm:block">
								<TeknologiSidebar categories={categories} techGroups={techGroups} activeSlug={slug} />
							</div>
							<MobileFilterDrawer>
							<TeknologiSidebar categories={categories} techGroups={techGroups} activeSlug={slug} />
						</MobileFilterDrawer>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							<div className="mb-6">
								<p className="text-sm text-muted-foreground">
									Visar{" "}
									<span className="font-medium text-foreground">{filteredProducts.length}</span>{" "}
									produkter i {group.name}
								</p>
							</div>

							{/* Products Grid */}
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{filteredProducts.map((product) => (
									<ProductCardDB
										key={product._id.toString()}
										product={product}
										categorySlug={getCategorySlugForProduct(product)}
									/>
								))}
							</div>

							{/* Empty State */}
							{filteredProducts.length === 0 && (
								<div className="py-16 text-center">
									<p className="text-lg text-muted-foreground">
										Inga produkter tillgängliga inom {group.name} för tillfället.
									</p>
									<Link href="/klinikutrustning" className="mt-4 inline-block text-primary hover:underline">
										← Tillbaka till all klinikutrustning
									</Link>
								</div>
							)}

							{/* Technology Group Description */}
							{group.description && (
								<CategoryDescriptionExpander html={group.description} />
							)}
						</div>
					</div>
				</div>
			</div>

			{/* FAQ Footer Section — only when the group has its own FAQs */}
			{techFaqs.length > 0 && (
				<section className="bg-white py-12 md:py-16 border-t border-slate-200">
					<div className="_container mx-auto px-4">
						<ProductFAQ title={faqTitle} faqs={techFaqs} />
					</div>
				</section>
			)}

			{/* Contact form (dark, product-inquiry styling, technology context) */}
			<div id="inquiry-form">
				<ProductInquiryForm
					pillLabel={`${group.name.toUpperCase()} FÖRFRÅGAN`}
					purchaseTitle={`Frågor om ${group.name}?`}
					purchaseDescription={`<p>Behöver du hjälp att välja rätt maskin inom ${group.name}? Vårt team återkommer inom 24 timmar.</p>`}
					categoryName={group.name}
					contactPhone={contactInfo.phone}
					contactEmail={contactInfo.email}
					bgMobile={group.inquiryBgMobile || branding?.inquiryDefaultBgMobile || undefined}
					bgDesktop={group.inquiryBgDesktop || branding?.inquiryDefaultBgDesktop || undefined}
				/>
			</div>
		</div>
	);
}
