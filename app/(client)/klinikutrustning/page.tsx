import { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import {
	getPublishedProducts,
	getActiveCategories,
	getActiveTechnologyGroupNames,
	getTechnologyCategoriesPageDescription,
} from "@/lib/services/product-cache.service";
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
import { getKlinikutrustningFaqSection, getKlinikutrustningHeroSection, getKlinikutrustningPage } from "@/lib/services/klinikutrustning-page.service";
import { HeroCategoryForm } from "@/components/klinikutrustning/HeroCategoryForm";
import {
	generateSimpleBreadcrumbJsonLd,
	generateCollectionPageJsonLd,
	generateFaqJsonLd,
} from "@/lib/seo";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Fallback FAQ used if the database fetch fails. The DB is auto-seeded with
 * the same content on first read (see klinikutrustning-page model defaults),
 * so this fallback only kicks in on a hard error.
 */
const FALLBACK_FAQ_TITLE = "Vanliga frågor om klinikutrustning";
const FALLBACK_FAQS: Array<{
	_id: string;
	question: string;
	answer: string;
	visible: boolean;
	order: number;
}> = [
	{
		_id: "klinik-faq-1",
		question: "Vilken laser passar bäst för min klinik?",
		answer:
			"<p>Valet av laser beror på vilka behandlingar du vill erbjuda och din målgrupp. För hårborttagning passar alexandrit- och Nd:YAG-lasrar bäst, medan tatueringsborttagning kräver Q-switched-teknik. Kontakta oss för en kostnadsfri behovsanalys där vi hjälper dig att hitta rätt utrustning.</p>",
		visible: true,
		order: 0,
	},
	{
		_id: "klinik-faq-2",
		question: "Är det säkert att använda laserutrustning på alla hudtyper?",
		answer:
			"<p>Ja, men det kräver rätt utrustning och rätt inställningar. Våra maskiner är utvecklade för att kunna anpassas till samtliga hudtyper enligt Fitzpatrick-skalan. Vid operatörsutbildningen får ni komplett kunskap om hur ni säkert behandlar olika hudtyper.</p>",
		visible: true,
		order: 1,
	},
	{
		_id: "klinik-faq-3",
		question: "Hur lång är leveranstiden på en ny maskin?",
		answer:
			"<p>Leveranstiden varierar mellan 2–6 veckor beroende på modell och tillgänglighet i lager. Vid akut behov kan vi i många fall ordna ersättningsmaskin under tiden. Kontakta oss för aktuella leveranstider.</p>",
		visible: true,
		order: 2,
	},
	{
		_id: "klinik-faq-4",
		question: "Erbjuder ni service och reparationer?",
		answer:
			"<p>Ja, vi har egen serviceavdelning med certifierade tekniker. Vi erbjuder både planerat underhåll och akuta reparationer, med en garanterad responstid på 48 arbetstimmar. Under serviceperioder kan ni få tillgång till en ersättningsmaskin.</p>",
		visible: true,
		order: 3,
	},
	{
		_id: "klinik-faq-5",
		question: "Kan jag se en maskin innan jag köper?",
		answer:
			"<p>Absolut. Vi erbjuder kostnadsfria demonstrationer både hos er klinik och på vårt huvudkontor. Vid demonstrationen får ni testa maskinen, ställa frågor till våra experter och få en personlig ROI-beräkning för din verksamhet.</p>",
		visible: true,
		order: 4,
	},
];

/**
 * Kategori (Category) Main Listing Page
 *
 * URL: /klinikutrustning/
 * Shows all products with category sidebar filter
 * This is an alias for /klinikutrustning with "Kategori" branding
 */

// ISR: Revalidate every 24 hours
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	try {
		const siteConfig = await getSiteConfig();

		return {
			title: `Kategori | ${siteConfig.name}`,
			description:
				"Professionell klinikutrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer. MDR-certifierade lasermaskiner från DEKA.",
			openGraph: {
				title: `Kategori | ${siteConfig.name}`,
				description:
					"Professionell klinikutrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer.",
				url: `${siteConfig.url}/kategori`,
				siteName: siteConfig.name,
				locale: "sv_SE",
				type: "website",
			},
			alternates: {
				canonical: `${siteConfig.url}/kategori`,
			},
		};
	} catch {
		return { title: "Klinikutrustning | Synos Medical" };
	}
}

// Product Card Component for Database Products
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
	selectedTech,
}: {
	categories: ICategory[];
	techGroups: TechGroupItem[];
	activeCategory?: string;
	selectedTech?: string;
}) {
	return (
		<aside className="space-y-4">
			{/* Behandlingskategorier Card */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">
						Behandlingskategorier
					</CardTitle>
					<Link
						href="/kategori"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors btn-copper-gradient"
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
						href="/kategori"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors btn-copper-gradient"
					>
						Alla Teknologier
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="pb-2! p-0">
					<div className="px-3">
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
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">
						Behöver du hjälp?
					</CardTitle>
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


export default async function KategoriPage() {
	const [categories, products, contactInfo, faqSection, heroSection, pageData, techGroups, techPageDescription, branding] = await Promise.all([
		getActiveCategories().catch(() => [] as ICategory[]),
		getPublishedProducts({ limit: 100, sort: "order" }).catch(() => [] as IProduct[]),
		getContactInfo().catch(() => ({ phone: "", email: "" })),
		getKlinikutrustningFaqSection().catch(() => ({
			title: FALLBACK_FAQ_TITLE,
			faqs: FALLBACK_FAQS,
		})),
		getKlinikutrustningHeroSection().catch(() => null),
		getKlinikutrustningPage().catch(() => null),
		getActiveTechnologyGroupNames().catch(() => [] as TechGroupItem[]),
		getTechnologyCategoriesPageDescription().catch(() => ""),
		getBrandingSettings().catch(() => null),
	]);

	const heroTitle = heroSection?.title || "Motus Pro";
	const heroSubtitle = heroSection?.subtitle || "Avancerad laserplattform för professionella behandlingar";
	const heroBullets = heroSection?.bulletPoints?.length
		? heroSection.bulletPoints
		: ["Snabb och effektiv behandling", "Skonsam teknik med hög precision", "Intuitiv touchskärm och smart arbetsflöde", "Anpassad för professionella kliniker"];
	const heroBgMobile = heroSection?.bgMobile || "/Mobile_bilder/Motus_pro.webp";
	const heroBgDesktop = heroSection?.bgDesktop || "/images/Product detail breadcrumbs background.jpeg";

	// Sort by `order` then filter to only visible items; normalize _id to string.
	const faqTitle = faqSection?.title || FALLBACK_FAQ_TITLE;
	const rawFaqs = Array.isArray(faqSection?.faqs) ? faqSection.faqs : [];
	const klinikFaqs =
		rawFaqs.length > 0
			? [...rawFaqs]
					.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
					.map((f, idx) => ({
						_id: (f._id ?? `klinik-faq-${idx}`).toString(),
						question: f.question,
						answer: f.answer,
						visible: f.visible ?? true,
					}))
			: FALLBACK_FAQS;

	// Create a map of category ID to slug for product cards
	const categorySlugMap = new Map<string, string>();
	categories.forEach((cat) => {
		categorySlugMap.set(cat._id.toString(), cat.slug);
	});

	// Get category slug for each product
	function getCategorySlugForProduct(product: IProduct): string {
		if (product.categories && product.categories.length > 0) {
			const firstCategory = product.categories[0] as unknown as {
				_id?: { toString(): string };
				slug?: string;
			};
			// If populated, use slug directly
			if (firstCategory?.slug) {
				return firstCategory.slug;
			}
			// Otherwise look up from map
			const catId = firstCategory?._id?.toString();
			if (catId) {
				return categorySlugMap.get(catId) || "uncategorized";
			}
		}
		return "uncategorized";
	}

	const siteConfig = await getSiteConfig();
	const breadcrumbJsonLd = generateSimpleBreadcrumbJsonLd([
		{ name: "Hem", url: siteConfig.url },
		{ name: "Klinikutrustning", url: `${siteConfig.url}/klinikutrustning` },
	]);
	const collectionPageJsonLd = generateCollectionPageJsonLd({
		name: "Klinikutrustning",
		description: "Professionell klinikutrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer.",
		url: `${siteConfig.url}/klinikutrustning`,
		items: products.map((product) => ({
			name: product.title,
			url: `${siteConfig.url}/klinikutrustning/${getCategorySlugForProduct(product)}/${product.slug}`,
		})),
	});
	const faqJsonLd = generateFaqJsonLd(klinikFaqs);

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
					<h1 className="text-[1.75rem] md:text-5xl font-sans font-light text-white mb-3 leading-tight break-words">
						{heroTitle}
					</h1>
					<div className="w-14 h-[2px] bg-primary mb-4" />
					<p className="text-white/70 text-sm mb-8 leading-relaxed">
						{heroSubtitle}
					</p>
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
								<h2 className="text-5xl font-sans font-light text-white mb-2 leading-tight">
									{heroTitle}
								</h2>
								<p className="text-white/60 text-base mb-8 leading-relaxed">
									{heroSubtitle}
								</p>
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
								<KategoriSidebar categories={categories} techGroups={techGroups} />
							</div>
							<MobileFilterDrawer>
							<KategoriSidebar categories={categories} techGroups={techGroups} />
						</MobileFilterDrawer>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							<div className="mb-6">
								<p className="text-sm text-muted-foreground">
									Visar{" "}
									<span className="font-medium text-foreground">
										{products.length}
									</span>{" "}
									produkter
								</p>
							</div>

							{/* Products Grid */}
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{products.map((product) => (
									<ProductCardDB
										key={product._id.toString()}
										product={product}
										categorySlug={getCategorySlugForProduct(product)}
									/>
								))}
							</div>

							{/* Empty State */}
							{products.length === 0 && (
								<div className="py-16 text-center">
									<p className="text-lg text-muted-foreground">
										Inga produkter tillgängliga för tillfället.
									</p>
								</div>
							)}

							{/* Technology Categories Page Description */}
							{techPageDescription && (
								<div
									className="mt-10 prose prose-slate max-w-none prose-headings:text-secondary prose-p:text-muted-foreground prose-li:text-muted-foreground"
									dangerouslySetInnerHTML={{ __html: techPageDescription }}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* FAQ Footer Section (managed via /dashboard/categories/settings) */}
			<section className="bg-white py-12 md:py-16 border-t border-slate-200">
				<div className="_container mx-auto px-4">
					<ProductFAQ title={faqTitle} faqs={klinikFaqs} />
				</div>
			</section>

			{/* Contact form (dark, product-inquiry styling, generic mode) */}
			<div id="inquiry-form">
				<ProductInquiryForm
					pillLabel="SYNOS MEDICAL"
					purchaseTitle="Kontakta oss"
					purchaseDescription="<p>Behöver du hjälp att hitta rätt klinikutrustning för din verksamhet? Vårt team återkommer inom 24 timmar med personlig rådgivning.</p>"
					contactPhone={contactInfo.phone}
					contactEmail={contactInfo.email}
					bgMobile={(pageData as unknown as { inquiryBgMobile?: string })?.inquiryBgMobile || branding?.inquiryDefaultBgMobile || undefined}
					bgDesktop={(pageData as unknown as { inquiryBgDesktop?: string })?.inquiryBgDesktop || branding?.inquiryDefaultBgDesktop || undefined}
				/>
			</div>
		</div>
	);
}
