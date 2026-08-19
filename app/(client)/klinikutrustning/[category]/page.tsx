import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
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
import { getActiveTechnologyGroupNames } from "@/lib/services/product-cache.service";
import { categoryHeroConfig } from "@/config/category-hero-config";
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
 * Fallback FAQ content for the category listing pages.
 * Used when the admin has not added per-category FAQs via the dashboard.
 * Uses the category name so the same fallback is mildly personalised per page.
 */
function buildCategoryFaqs(name: string) {
	const lower = name.toLowerCase();
	return [
		{
			_id: "cat-faq-1",
			question: `Vilken maskin passar bäst för ${lower}?`,
			answer: `<p>Det optimala valet beror på vilken volym ni planerar, vilka hudtyper ni främst behandlar och er befintliga utrustning. Vårt team hjälper dig gärna med en kostnadsfri behovsanalys där vi tar fram ett par alternativ inom ${lower} som passar just din klinik.</p>`,
			visible: true,
		},
		{
			_id: "cat-faq-2",
			question: "Är alla maskiner MDR-certifierade?",
			answer:
				"<p>Ja. Samtliga produkter vi säljer är certifierade enligt EU:s medicintekniska förordning (MDR). Det innebär att utrustningen uppfyller högt ställda krav på säkerhet, spårbarhet och klinisk evidens.</p>",
			visible: true,
		},
		{
			_id: "cat-faq-3",
			question: "Ingår utbildning vid köp?",
			answer:
				"<p>Ja, komplett operatörsutbildning för upp till två personer ingår alltid. Utbildningen sker på plats hos er eller hos oss, och vi tillhandahåller även uppdaterade behandlingsprotokoll i takt med att tekniken utvecklas.</p>",
			visible: true,
		},
		{
			_id: "cat-faq-4",
			question: "Hur ser garantin och servicen ut?",
			answer:
				"<p>Vi erbjuder 2 års full garanti på alla maskiner samt teknisk support inom 48 arbetstimmar. Under längre servicetillfällen kan vi många gånger erbjuda en ersättningsmaskin så att driften kan fortsätta utan avbrott.</p>",
			visible: true,
		},
		{
			_id: "cat-faq-5",
			question: "Kan jag boka en demo innan köp?",
			answer: `<p>Självklart. Vi erbjuder kostnadsfria demonstrationer av våra ${lower}-maskiner – antingen hos oss eller på din klinik. Kontakta oss via formuläret eller telefon så bokar vi in en tid som passar.</p>`,
			visible: true,
		},
	];
}

/**
 * Product Category Page
 *
 * URL: /klinikutrustning/[category]/
 * Shows all products in a specific category with sidebar filter
 */

interface CategoryPageProps {
	params: Promise<{
		category: string;
	}>;
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Allow new categories to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all active categories at build time
 */
export async function generateStaticParams() {
	try {
		const categories = await categoryRepository.findActiveCategories();
		return categories
			.filter((cat) => cat.slug)
			.map((cat) => ({ category: cat.slug }));
	} catch (error) {
		console.error("Error generating static params for categories:", error);
		return [];
	}
}

/**
 * Fallback data for uncategorized products
 */
type UncategorizedFallback = {
	_id: { toString: () => string };
	slug: string;
	name: string;
	description: string;
	image: string | null;
	isActive: boolean;
	faqTitle: string;
	faqs: Array<{
		_id?: { toString: () => string };
		question: string;
		answer: string;
		visible: boolean;
	}>;
	seo: undefined;
};

const UNCATEGORIZED_FALLBACK: UncategorizedFallback = {
	_id: { toString: () => "uncategorized" },
	slug: "uncategorized",
	name: "Okategoriserad",
	description: "Produkter som inte tillhör någon specifik kategori.",
	image: null,
	isActive: true,
	faqTitle: "",
	faqs: [],
	seo: undefined,
};

async function getCategory(slug: string) {
	// Handle uncategorized products
	if (slug === "uncategorized") {
		return UNCATEGORIZED_FALLBACK;
	}

	try {
		return await categoryRepository.findBySlug(slug);
	} catch (error) {
		console.error("Error fetching category:", error);
		return null;
	}
}

async function getCategories() {
	try {
		return await categoryRepository.findActiveCategories();
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

async function getProductsByCategory(categoryId: string) {
	try {
		// Handle uncategorized products
		if (categoryId === "uncategorized") {
			const { data } = await productRepository.findUncategorized({
				limit: 100,
				publishedOnly: true,
				sort: "order",
			});
			return data;
		}

		const { data } = await productRepository.findByCategory(categoryId, {
			limit: 100,
			publishedOnly: true,
			sort: "order",
		});
		return data;
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

// Strip HTML tags for meta description
function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { category: categorySlug } = await params;
	const [category, siteConfig] = await Promise.all([
		getCategory(categorySlug),
		getSiteConfig(),
	]);

	if (!category) {
		return {
			title: `Kategori hittades inte | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	// Use SEO fields if available, otherwise fallback to defaults
	const seoTitle =
		category.seo?.title ||
		`${category.name} | Kategori | ${siteConfig.name}`;
	const seoDescription =
		category.seo?.description ||
		(category.description
			? stripHtml(category.description).slice(0, 160)
			: `Utforska vårt sortiment av ${category.name.toLowerCase()}. MDR-certifierad utrustning från DEKA.`);

	// OG image priority: seo.ogImage > category.image
	const ogImage = category.seo?.ogImage || category.image;

	return {
		title: seoTitle,
		description: seoDescription,
		openGraph: {
			title: category.seo?.title || `${category.name} | ${siteConfig.name}`,
			description: seoDescription,
			url: `${siteConfig.url}/klinikutrustning/${category.slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
			images: ogImage
				? [
						{
							url: ogImage.startsWith("http")
								? ogImage
								: `${siteConfig.url}${ogImage}`,
							alt: category.name,
						},
				  ]
				: [],
		},
		alternates: {
			canonical: `${siteConfig.url}/klinikutrustning/${category.slug}`,
		},
		robots: category.seo?.noindex
			? { index: false, follow: true }
			: undefined,
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
				{/* Image */}
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
					<p className="text-sm text-muted-foreground line-clamp-2">
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

type TechGroupItem = { _id: string; name: string; slug: string; order: number };

// Sidebar Component
function KategoriSidebar({
	categories,
	techGroups,
	activeCategory,
}: {
	categories: ICategory[];
	techGroups: TechGroupItem[];
	activeCategory?: string;
}) {
	return (
		<aside className="space-y-6">
			{/* Categories Filter */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">
						Behandlingskategorier
					</CardTitle>
					<Link
						href="/klinikutrustning"
						className={`block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
							!activeCategory
								? "btn-copper-gradient"
								: "text-foreground hover:bg-primary/50"
						}`}
					>
						Alla Produkter
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="space-y-2 pb-2! p-0">
					<div className="max-h-[200px] overflow-y-auto px-3">
						{categories.map((category) => (
							<Link
								key={category._id.toString()}
								href={`/klinikutrustning/${category.slug}`}
								className={`block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
									activeCategory === category.slug
										? "btn-copper-gradient"
										: "text-foreground hover:bg-primary/20"
								}`}
							>
								{category.name}
							</Link>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Technology Category Card */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">
						Technology Category
					</CardTitle>
					<Link
						href="/klinikutrustning"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors btn-copper-gradient"
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
								className="block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-foreground hover:bg-primary/20"
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
				<CardContent className="pt-4 space-y-3">
					<p className="text-sm text-foreground">
						Våra experter hjälper dig att hitta rätt utrustning för din
						verksamhet.
					</p>
					<Link
						href="/kontakt"
						className="inline-flex w-full items-center justify-center rounded-lg btn-copper-gradient px-4 py-2.5 text-sm font-semibold transition-colors border border-transparent"
					>
						Begär produktförfrågan
					</Link>
				</CardContent>
			</Card>

			{/* Features Card */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">
						Varför välja Synos?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<ShieldCheck className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								MDR-certifierade
							</h4>
							<p className="text-xs text-muted-foreground">
								Alla produkter är certifierade enligt EU-förordningar
							</p>
						</div>
					</div>

					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<BookOpen className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								Utbildning ingår
							</h4>
							<p className="text-xs text-muted-foreground">
								Komplett utbildning och support vid köp
							</p>
						</div>
					</div>

					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
							<Settings className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								Snabb service
							</h4>
							<p className="text-xs text-muted-foreground">
								Reparation inom 48 arbetstimmar
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</aside>
	);
}


export default async function CategoryPage({ params }: CategoryPageProps) {
	const { category: categorySlug } = await params;

	const [category, categories] = await Promise.all([
		getCategory(categorySlug),
		getCategories(),
	]);

	if (!category) {
		notFound();
	}

	const [products, contactInfo, techGroups, branding] = await Promise.all([
		getProductsByCategory(category._id.toString()),
		getContactInfo().catch(() => ({ phone: "", email: "" })),
		getActiveTechnologyGroupNames().catch(() => [] as TechGroupItem[]),
		getBrandingSettings().catch(() => null),
	]);

	const heroConfig = categoryHeroConfig[categorySlug];

	const catExtra = category as unknown as {
		heroTitle?: string;
		heroSubtitle?: string;
		heroBulletPoints?: string[];
		heroBgMobile?: string;
		heroBgDesktop?: string;
	};

	// Always resolve a hero title (own field → legacy static config → category name)
	// so every category — including brand-new ones with no hero config set yet —
	// gets the full hero layout with the inquiry form, matching the technology
	// group pages' behavior (see teknologi/[slug]/page.tsx).
	const resolvedHeroTitle = catExtra.heroTitle || heroConfig?.title || category.name;
	const resolvedHeroSubtitle = catExtra.heroSubtitle || heroConfig?.subtitle;
	const resolvedBulletPoints =
		catExtra.heroBulletPoints?.filter(Boolean).length
			? catExtra.heroBulletPoints
			: heroConfig?.bulletPoints ?? [];
	const resolvedBgMobile = catExtra.heroBgMobile || "/images/Background Mobile.jpeg";
	const resolvedBgDesktop = catExtra.heroBgDesktop || "/images/Product detail breadcrumbs background.jpeg";

	const adminFaqs = category.faqs
		?.filter((f) => f.visible)
		.map((f) => ({
			_id: f._id?.toString() || `cat-faq-${Math.random()}`,
			question: f.question,
			answer: f.answer,
			visible: f.visible,
		}));
	const faqs =
		adminFaqs && adminFaqs.length > 0
			? adminFaqs
			: buildCategoryFaqs(category.name);
	const faqTitle =
		category.faqTitle && category.faqTitle.trim().length > 0
			? category.faqTitle
			: `Vanliga frågor om ${category.name.toLowerCase()}`;

	const siteConfig = await getSiteConfig();
	const breadcrumbJsonLd = generateSimpleBreadcrumbJsonLd([
		{ name: "Hem", url: siteConfig.url },
		{ name: "Klinikutrustning", url: `${siteConfig.url}/klinikutrustning` },
		{ name: category.name, url: `${siteConfig.url}/klinikutrustning/${categorySlug}` },
	]);
	const collectionPageJsonLd = generateCollectionPageJsonLd({
		name: category.name,
		description: (category as unknown as { description?: string }).description
			? stripHtml((category as unknown as { description?: string }).description!).slice(0, 300)
			: undefined,
		url: `${siteConfig.url}/klinikutrustning/${categorySlug}`,
		items: products.map((product) => ({
			name: product.title,
			url: `${siteConfig.url}/klinikutrustning/${categorySlug}/${product.slug}`,
		})),
	});
	const faqJsonLd = generateFaqJsonLd(faqs);

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
						src={resolvedBgMobile}
						alt=""
						fill
						priority
						className="object-cover object-[40%_62%] scale-[1.2] origin-[0%_62%] -translate-y-[20%]"
						sizes="100vw"
					/>
				</div>

				{/* Mobile text */}
				<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[28vh]">
					<h1 className="text-[1.75rem] md:text-5xl font-sans font-light text-white mb-3 leading-tight break-words">
						{resolvedHeroTitle}
					</h1>
					<div className="w-14 h-[2px] bg-primary mb-4" />
					{resolvedHeroSubtitle && (
						<p className="text-white/70 text-sm mb-8 leading-relaxed">
							{resolvedHeroSubtitle}
						</p>
					)}
					{resolvedBulletPoints.length > 0 && (
						<ul className="space-y-4">
							{resolvedBulletPoints.map((item) => (
								<li key={item} className="flex items-center gap-3">
									<div className="h-6 w-6 rounded-full border border-[#fcf3e1] flex items-center justify-center shrink-0">
										<Check className="h-3 w-3 text-[#fcf3e1]" strokeWidth={1} />
									</div>
									<span className="text-white/90 text-sm font-thin">{item}</span>
								</li>
							))}
						</ul>
					)}
					<a href="#inquiry-form" className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#cf9d7c] text-[#cf9d7c] text-sm font-light">
						<FileText className="h-4 w-4 shrink-0" />
						Begär offert
					</a>
				</div>

				{/* ── DESKTOP LAYOUT ── */}
				<div className="hidden lg:block">
					<div className="_container relative overflow-hidden min-h-[740px]">
						<ImageComponent
							src={resolvedBgDesktop}
							alt=""
							fill
							priority
							className="object-cover object-center"
							sizes="(max-width: 2560px) 100vw, 2560px"
						/>
						<div className="relative z-10 grid grid-cols-2 items-center min-h-[740px] gap-8">
							<div />
							{/* Right — Form */}
							<div className="flex flex-col justify-center py-10 pl-10 pr-8">
								<h2 className="text-5xl font-sans font-light text-white mb-2 leading-tight">
									{resolvedHeroTitle}
								</h2>
								{resolvedHeroSubtitle && (
									<p className="text-white/60 text-base mb-8 leading-relaxed">
										{resolvedHeroSubtitle}
									</p>
								)}
								<HeroCategoryForm categoryName={resolvedHeroTitle} />
							</div>
						</div>
					</div>
				</div>

			</section>

			<div className="bg-linear-to-b from-slate-100 to-primary/10">
			<div className="_container mx-auto px-4 py-8">
				{/* Main Layout with Sidebar */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="w-full lg:w-80 lg:shrink-0">
						<div className="lg:sticky lg:top-28 hidden sm:block">
							<KategoriSidebar
								categories={categories} techGroups={techGroups}
								activeCategory={categorySlug}
							/>
						</div>
						<MobileFilterDrawer>
							<KategoriSidebar
								categories={categories} techGroups={techGroups}
								activeCategory={categorySlug}
							/>
						</MobileFilterDrawer>
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									Visar{" "}
									<span className="font-medium text-foreground">
										{products.length}
									</span>{" "}
									produkter i {category.name}
								</p>
							</div>
						</div>

						{/* Products Grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{products.map((product) => (
								<ProductCardDB
									key={product._id.toString()}
									product={product}
									categorySlug={categorySlug}
								/>
							))}
						</div>

						{/* Empty State */}
						{products.length === 0 && (
							<div className="py-16 text-center">
								<p className="text-lg text-muted-foreground">
									Inga produkter tillgängliga i denna kategori för tillfället.
								</p>
								<Link
									href="/klinikutrustning"
									className="mt-4 inline-block text-primary hover:underline"
								>
									← Tillbaka till alla kategorier
								</Link>
							</div>
						)}

						{/* Category Description — shown below products, expandable */}
						{(category as unknown as { description?: string }).description && (
							<CategoryDescriptionExpander
								html={(category as unknown as { description?: string }).description!}
							/>
						)}
					</div>
				</div>
			</div>
			</div>

			{/* FAQ Footer Section — admin-controllable via dashboard, falls back to default content */}
			<section className="bg-white py-12 md:py-16 border-t border-slate-200">
				<div className="_container mx-auto px-4">
					<ProductFAQ title={faqTitle} faqs={faqs} limit={5} />
				</div>
			</section>

			{/* Contact form (dark, product-inquiry styling, generic mode with category context) */}
			<div id="inquiry-form">
				<ProductInquiryForm
					pillLabel={`${category.name.toUpperCase()} FÖRFRÅGAN`}
					purchaseTitle={`Frågor om ${category.name.toLowerCase()}?`}
					purchaseDescription={`<p>Vill du veta mer om vårt sortiment inom ${category.name.toLowerCase()}? Vårt team återkommer inom 24 timmar med personlig rådgivning och kan boka in en kostnadsfri demonstration.</p>`}
					categoryName={category.name}
					contactPhone={contactInfo.phone}
					contactEmail={contactInfo.email}
					bgMobile={(category as unknown as { inquiryBgMobile?: string }).inquiryBgMobile || branding?.inquiryDefaultBgMobile || undefined}
					bgDesktop={(category as unknown as { inquiryBgDesktop?: string }).inquiryBgDesktop || branding?.inquiryDefaultBgDesktop || undefined}
				/>
			</div>
		</div>
	);
}
