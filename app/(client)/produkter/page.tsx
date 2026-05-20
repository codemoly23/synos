import { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import {
	getNewestProducts,
	getActiveCategories,
	getActiveTechnologyGroupNames,
	getTechnologyGroupByName,
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
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ListFilter, ShieldCheck, BookOpen, Settings, Check, FileText } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { getContactInfo } from "@/lib/services/site-settings.service";
import { getProdukterFaqSection, getProdukterHeroSection, getProdukterPage } from "@/lib/services/produkter-page.service";
import { HeroCategoryForm } from "@/components/klinikutrustning/HeroCategoryForm";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Fallback FAQ used if the database fetch fails. The DB is auto-seeded with
 * the same content on first read (see produkter-page model defaults), so this
 * fallback only kicks in on a hard error.
 */
const FALLBACK_FAQ_TITLE = "Vanliga frågor";
const FALLBACK_FAQS: Array<{
	_id: string;
	question: string;
	answer: string;
	visible: boolean;
	order: number;
}> = [
	{
		_id: "produkter-faq-1",
		question: "Är alla era produkter MDR-certifierade?",
		answer:
			"<p>Ja, samtliga produkter i vårt sortiment är certifierade enligt EU:s medicintekniska förordning (MDR). Detta garanterar att utrustningen uppfyller de högsta säkerhets- och kvalitetskraven inom medicinteknik.</p>",
		visible: true,
		order: 0,
	},
	{
		_id: "produkter-faq-2",
		question: "Vilken garanti ingår vid köp av en maskin?",
		answer:
			"<p>Vi erbjuder 2 års full garanti på alla komponenter. Dessutom ingår teknisk support inom 48 timmar samt tillgång till ersättningsmaskin under serviceperioder för att minimera driftstopp i din verksamhet.</p>",
		visible: true,
		order: 1,
	},
	{
		_id: "produkter-faq-3",
		question: "Kan jag leasa eller hyra utrustningen?",
		answer:
			"<p>Ja, vi erbjuder flexibla finansieringsalternativ – köp, leasing eller hyra. Vårt team hjälper dig att räkna fram den lösning som passar bäst för din ekonomi och dina långsiktiga mål.</p>",
		visible: true,
		order: 2,
	},
	{
		_id: "produkter-faq-4",
		question: "Får jag utbildning när jag köper en maskin?",
		answer:
			"<p>Ja, komplett operatörsutbildning för upp till 2 personer ingår vid varje maskinköp. Utbildningen sker på plats hos er eller hos oss, och vi tillhandahåller även kontinuerliga uppdateringar och behandlingsprotokoll.</p>",
		visible: true,
		order: 3,
	},
	{
		_id: "produkter-faq-5",
		question: "Hur snabbt får jag svar på en förfrågan?",
		answer:
			"<p>Vi återkommer alltid inom 24 timmar på alla förfrågningar. För akuta servicefrågor finns vår tekniska support tillgänglig dygnet runt och kan vara på plats inom 48 arbetstimmar.</p>",
		visible: true,
		order: 4,
	},
];
/**
 * Products Page
 *
 * URL: /produkter
 * Shows all published products with category sidebar filter
 */
// ISR: Revalidate every 24 hours
export const revalidate = 60;
export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ technology?: string }>;
}): Promise<Metadata> {
	try {
		const { technology } = await searchParams;
		const [siteConfig, group] = await Promise.all([
			getSiteConfig(),
			technology ? getTechnologyGroupByName(technology) : Promise.resolve(null),
		]);

		const baseDescription =
			"Professionella lasermaskiner och medicinsk utrustning av högsta kvalitet. Alla våra produkter är MDR-certifierade och testade för bästa funktionalitet.";

		const title = group
			? group.seo?.title || `${group.name} | Produkter | ${siteConfig.name}`
			: `Produkter | ${siteConfig.name}`;

		const description = group
			? group.seo?.description ||
			  (group.description
					? group.description.replace(/<[^>]*>/g, "").trim().slice(0, 160)
					: baseDescription)
			: baseDescription;

		const ogImage = group?.seo?.ogImage || group?.image || undefined;

		const canonical = group
			? `${siteConfig.url}/produkter?technology=${encodeURIComponent(group.name)}`
			: `${siteConfig.url}/produkter`;

		return {
			title,
			description,
			robots: group?.seo?.noindex ? { index: false, follow: false } : undefined,
			openGraph: {
				title,
				description,
				url: canonical,
				siteName: siteConfig.name,
				locale: "sv_SE",
				type: "website",
				...(ogImage ? { images: [ogImage] } : {}),
			},
			alternates: {
				canonical,
			},
		};
	} catch {
		return { title: "Produkter | Synos Medical" };
	}
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
				<div className="relative aspect-square overflow-hidden bg-white p-4 shrink-0">
					<ImageComponent
						src={primaryImage}
						alt={product.title}
						height={0}
						width={0}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						showLoader
						wrapperClasses="w-full h-full"
						className="object-contain transition-transform h-full w-full duration-300 group-hover:scale-105"
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
					<Button className="w-full bg-primary text-primary-foreground transition-colors">
						Läs mer
					</Button>
				</div>
			</Card>
		</Link>
	);
}

type TechGroupItem = { _id: string; name: string; slug: string; order: number };

// Sidebar Component
function ProduktSidebar({
	categories,
	techGroups,
	selectedTech,
}: {
	categories: ICategory[];
	techGroups: TechGroupItem[];
	selectedTech?: string;
}) {
	return (
		<aside className="space-y-4">
			{/* Behandlingskategorier Card — from DB */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">
						Behandlingskategorier
					</CardTitle>
					<Link
						href="/produkter"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors bg-primary text-primary-foreground"
					>
						Alla Produkter
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="pb-2! p-0">
					<div className="px-3">
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

			{/* Technology Category Card — from DB */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm p-0!">
				<CardHeader className="px-3 py-2">
					<CardTitle className="text-xl font-semibold">
						Teknologikategori
					</CardTitle>
					<Link
						href="/produkter"
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors bg-primary text-primary-foreground"
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
								href={`/produkter?technology=${encodeURIComponent(tech.name)}`}
								className={`block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
									selectedTech === tech.name
										? "bg-primary text-primary-foreground"
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
					<CardTitle className="text-base font-semibold text-foreground">
						Behöver du hjälp?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-foreground">
						Våra experter hjälper dig att hitta rätt utrustning för din
						verksamhet.
					</p>
					<Link
						href="/kontakt"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary border border-transparent"
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
// Mobile Drawer Component
function MobileDrawer({
	categories,
	techGroups,
	selectedTech,
}: {
	categories: ICategory[];
	techGroups: TechGroupItem[];
	selectedTech?: string;
}) {
	return (
		<div className="flex justify-end">
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="primary" size="sm" className="block sm:hidden">
						<ListFilter className="h-4 w-4" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="p-0! rounded-t-sm">
					<DrawerTitle className="sr-only">Filter</DrawerTitle>
					<div className="max-h-[90vh] p-3 overflow-y-auto">
						<ProduktSidebar categories={categories} techGroups={techGroups} selectedTech={selectedTech} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
export default async function ProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ technology?: string }>;
}) {
	const { technology: selectedTech } = await searchParams;
	const [products, categories, techGroups, selectedGroup, contactInfo, faqSection, heroSection, pageData] = await Promise.all([
		getNewestProducts(100).catch(() => [] as IProduct[]),
		getActiveCategories().catch(() => [] as ICategory[]),
		getActiveTechnologyGroupNames().catch(() => [] as TechGroupItem[]),
		selectedTech ? getTechnologyGroupByName(selectedTech).catch(() => null) : Promise.resolve(null),
		getContactInfo().catch(() => ({ phone: "", email: "" })),
		getProdukterFaqSection().catch(() => ({
			title: FALLBACK_FAQ_TITLE,
			faqs: FALLBACK_FAQS,
		})),
		getProdukterHeroSection().catch(() => null),
		getProdukterPage().catch(() => null),
	]);

	const defaultBullets = ["Snabb och effektiv behandling", "Skonsam teknik med hög precision", "Intuitiv touchskärm och smart arbetsflöde", "Anpassad för professionella kliniker"];
	const heroBullets = (selectedGroup?.heroBulletPoints?.length ? selectedGroup.heroBulletPoints : null)
		?? (heroSection?.bulletPoints?.length ? heroSection.bulletPoints : null)
		?? defaultBullets;
	const heroBgMobile = selectedGroup?.heroBgMobile || heroSection?.bgMobile || "/images/Background Mobile.jpeg";
	const heroBgDesktop = selectedGroup?.heroBgDesktop || heroSection?.bgDesktop || "/images/Product detail breadcrumbs background.jpeg";

	// Sort by `order` then normalize _id to string for ProductFAQ.
	const globalFaqTitle = faqSection?.title || FALLBACK_FAQ_TITLE;
	const rawFaqs = Array.isArray(faqSection?.faqs) ? faqSection.faqs : [];
	const globalProdukterFaqs =
		rawFaqs.length > 0
			? [...rawFaqs]
					.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
					.map((f, idx) => ({
						_id: (f._id ?? `produkter-faq-${idx}`).toString(),
						question: f.question,
						answer: f.answer,
						visible: f.visible ?? true,
					}))
			: FALLBACK_FAQS;

	// Per-technology FAQ override:
	// When a technology is selected (?technology=X) and that technology has
	// admin-managed FAQs, show those instead of the global /produkter FAQ.
	// If the selected technology has no FAQs, fall through to the global ones.
	const techFaqs =
		selectedGroup?.faqs?.filter((f) => f.visible).map((f) => ({
			_id: f._id,
			question: f.question,
			answer: f.answer,
			visible: f.visible,
		})) || [];
	const useTechFaqs = !!selectedGroup && techFaqs.length > 0;
	const faqTitle = useTechFaqs
		? selectedGroup?.faqTitle && selectedGroup.faqTitle.trim().length > 0
			? selectedGroup.faqTitle
			: `Vanliga frågor om ${selectedGroup!.name}`
		: globalFaqTitle;
	const produkterFaqs = useTechFaqs ? techFaqs : globalProdukterFaqs;

	// Filter products by selected technology (using technologyGroups array on product)
	const filteredProducts = selectedTech
		? products.filter((p) =>
				((p as unknown as { technologyGroups?: string[] }).technologyGroups || []).includes(selectedTech)
		  )
		: products;

	// Hero content: technology-specific fields take priority, then global DB hero, then hardcoded defaults
	const heroTitle = selectedGroup?.heroTitle?.trim() || selectedGroup?.name || heroSection?.title || "Våra Produkter";
	const heroSubtitle = selectedGroup?.heroSubtitle?.trim() || heroSection?.subtitle || "Avancerad laserplattform för professionella behandlingar";
	const heroDescription = selectedGroup?.description
		? selectedGroup.description.replace(/<[^>]*>/g, "").trim().slice(0, 300)
		: heroSection?.subtitle || "Professionella lasermaskiner och medicinsk utrustning av högsta kvalitet. Alla våra produkter är MDR-certifierade och testade för bästa funktionalitet.";
	const heroImage = selectedGroup?.image || "/storage/images/motus-ax-3-600x500.webp";
	// Create a map of category ID to slug for product cards
	const categorySlugMap = new Map<string, string>();
	categories.forEach((cat) => {
		categorySlugMap.set(cat._id.toString(), cat.slug);
	});
	// Get category slug for each product
	function getCategorySlugForProduct(product: IProduct): string {
		const primaryCat = product.primaryCategory as unknown as {
			_id?: { toString(): string };
			slug?: string;
		};
		if (primaryCat?.slug) return primaryCat.slug;
		if (primaryCat?._id) {
			const slug = categorySlugMap.get(primaryCat._id.toString());
			if (slug) return slug;
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
	const heroImages = products
		.filter((p) => p.overviewImage || p.productImages?.[0])
		.slice(0, 2)
		.map((p) => p.overviewImage || p.productImages![0]);
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-20 sm:pt-24 bg-black">

				{/* ── MOBILE LAYOUT ── */}
				<div className="relative overflow-hidden h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] lg:hidden">
					<ImageComponent
						src={heroBgMobile}
						alt=""
						fill
						priority
						className="object-cover object-[40%_62%] scale-[1.2] origin-[0%_62%] -translate-y-[20%]"
						sizes="100vw"
					/>
				</div>

				{/* Mobile text — below background */}
				<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[38vh]">
					<h1 className="text-5xl font-serif font-light text-white mb-3 leading-tight">
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
								<h2 className="text-5xl font-serif font-light text-white mb-2 leading-tight">
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
				{/* Main Layout with Sidebar */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="w-full lg:w-80 lg:shrink-0">
						<div className="lg:sticky lg:top-28 hidden sm:block">
							<ProduktSidebar categories={categories} techGroups={techGroups} selectedTech={selectedTech} />
						</div>
						<MobileDrawer categories={categories} techGroups={techGroups} selectedTech={selectedTech} />
					</div>
					{/* Main Content */}
					<div className="flex-1">
						<div className="mb-6">
							<p className="text-sm text-muted-foreground">
								Visar{" "}
								<span className="font-medium text-foreground">
									{filteredProducts.length}
								</span>{" "}
								produkter
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
									Inga produkter tillgängliga för tillfället.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			</div>

			{/* Contact form (dark, product-inquiry styling, generic mode) */}
			<div id="inquiry-form">
				<ProductInquiryForm
					pillLabel={
						selectedGroup
							? `${selectedGroup.name.toUpperCase()} FÖRFRÅGAN`
							: "SYNOS MEDICAL"
					}
					purchaseTitle={
						selectedGroup
							? `Frågor om ${selectedGroup.name}?`
							: "Kontakta oss"
					}
					purchaseDescription={
						selectedGroup
							? `<p>Behöver du hjälp att välja rätt maskin inom ${selectedGroup.name}? Vårt team återkommer inom 24 timmar.</p>`
							: "<p>Behöver du hjälp att hitta rätt klinikutrustning? Fyll i formuläret så återkommer vi inom 24 timmar.</p>"
					}
					categoryName={selectedGroup?.name}
					contactPhone={contactInfo.phone}
					contactEmail={contactInfo.email}
					bgMobile={selectedGroup?.inquiryBgMobile || (pageData as unknown as { inquiryBgMobile?: string })?.inquiryBgMobile || undefined}
					bgDesktop={selectedGroup?.inquiryBgDesktop || (pageData as unknown as { inquiryBgDesktop?: string })?.inquiryBgDesktop || undefined}
				/>
			</div>

			{/* FAQ Footer Section (managed via /dashboard/products/settings) */}
			<section className="bg-white py-12 md:py-16 border-t border-slate-200">
				<div className="_container mx-auto px-4">
					<ProductFAQ
						title={faqTitle}
						faqs={produkterFaqs}
					/>
				</div>
			</section>
		</div>
	);

}
