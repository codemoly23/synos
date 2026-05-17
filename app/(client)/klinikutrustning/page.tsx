import { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import {
	getPublishedProducts,
	getActiveCategories,
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
import { technologyMap } from "@/config/technology-map";
import { ImageComponent } from "@/components/common/image-component";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { getContactInfo } from "@/lib/services/site-settings.service";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Fallback FAQ content for the bottom of /klinikutrustning.
 * TODO: Replace with admin-editable content from site settings.
 */
const KLINIK_FAQ_TITLE = "Vanliga frågor om klinikutrustning";
const KLINIK_FAQS = [
	{
		_id: "klinik-faq-1",
		question: "Vilken laser passar bäst för min klinik?",
		answer:
			"<p>Valet av laser beror på vilka behandlingar du vill erbjuda och din målgrupp. För hårborttagning passar alexandrit- och Nd:YAG-lasrar bäst, medan tatueringsborttagning kräver Q-switched-teknik. Kontakta oss för en kostnadsfri behovsanalys där vi hjälper dig att hitta rätt utrustning.</p>",
		visible: true,
	},
	{
		_id: "klinik-faq-2",
		question: "Är det säkert att använda laserutrustning på alla hudtyper?",
		answer:
			"<p>Ja, men det kräver rätt utrustning och rätt inställningar. Våra maskiner är utvecklade för att kunna anpassas till samtliga hudtyper enligt Fitzpatrick-skalan. Vid operatörsutbildningen får ni komplett kunskap om hur ni säkert behandlar olika hudtyper.</p>",
		visible: true,
	},
	{
		_id: "klinik-faq-3",
		question: "Hur lång är leveranstiden på en ny maskin?",
		answer:
			"<p>Leveranstiden varierar mellan 2–6 veckor beroende på modell och tillgänglighet i lager. Vid akut behov kan vi i många fall ordna ersättningsmaskin under tiden. Kontakta oss för aktuella leveranstider.</p>",
		visible: true,
	},
	{
		_id: "klinik-faq-4",
		question: "Erbjuder ni service och reparationer?",
		answer:
			"<p>Ja, vi har egen serviceavdelning med certifierade tekniker. Vi erbjuder både planerat underhåll och akuta reparationer, med en garanterad responstid på 48 arbetstimmar. Under serviceperioder kan ni få tillgång till en ersättningsmaskin.</p>",
		visible: true,
	},
	{
		_id: "klinik-faq-5",
		question: "Kan jag se en maskin innan jag köper?",
		answer:
			"<p>Absolut. Vi erbjuder kostnadsfria demonstrationer både hos er klinik och på vårt huvudkontor. Vid demonstrationen får ni testa maskinen, ställa frågor till våra experter och få en personlig ROI-beräkning för din verksamhet.</p>",
		visible: true,
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
					<Button className="w-full bg-primary text-primary-foreground transition-colors">
						Läs mer
					</Button>
				</div>
			</Card>
		</Link>
	);
}

const staticCategories = [
	{ name: "Permanent Hårborttagning", href: "/klinikutrustning/harborttagning" },
	{ name: "Tatueringsborttagning", href: "/klinikutrustning/tatueringsborttagning" },
	{ name: "Hudföryngring", href: "/klinikutrustning/hudforyngring" },
	{ name: "Skin Resurfacing", href: "/klinikutrustning/co2laser" },
	{ name: "Huduppstramning", href: "/klinikutrustning/hudforyngring" },
	{ name: "Pigmentbehandling", href: "/klinikutrustning/pigmentflackar" },
	{ name: "Kärlbehandling", href: "/klinikutrustning/ytliga-blodkarl-angiom" },
	{ name: "Akne & Ärrbehandling", href: "/klinikutrustning/akne-arr-och-hudbristningar" },
	{ name: "Hudbristningar", href: "/klinikutrustning/akne-arr-och-hudbristningar" },
	{ name: "Kroppsformning & Fettbehandling", href: "/klinikutrustning/kropp-muskler-fett" },
	{ name: "Muskeltoning", href: "/klinikutrustning/kropp-muskler-fett" },
	{ name: "Cellulitbehandling", href: "/klinikutrustning/kropp-muskler-fett" },
];

// Sidebar Component
function KategoriSidebar({
	categories,
	activeCategory,
	selectedTech,
}: {
	categories: ICategory[];
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
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors bg-primary text-primary-foreground"
					>
						Alla Produkter
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="pb-2! p-0">
					<div className="px-3">
						{staticCategories.map((cat) => (
							<Link
								key={cat.name}
								href={cat.href}
								className="block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-foreground hover:bg-primary/20"
							>
								{cat.name}
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
						className="block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors bg-primary text-primary-foreground"
					>
						Alla Teknologier
					</Link>
				</CardHeader>
				<Separator className="my-2 bg-primary/50" />
				<CardContent className="pb-2! p-0">
					<div className="px-3">
						{technologyMap.map((tech) => (
							<Link
								key={tech.name}
								href={`/produkter?technology=${encodeURIComponent(tech.name)}`}
								className="block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-foreground hover:bg-primary/20"
							>
								{tech.name}
							</Link>
						))}
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
function MobileDrawer({ categories }: { categories: ICategory[] }) {
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
						<KategoriSidebar categories={categories} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default async function KategoriPage() {
	const [categories, products, contactInfo] = await Promise.all([
		getActiveCategories().catch(() => [] as ICategory[]),
		getPublishedProducts({ limit: 100 }).catch(() => [] as IProduct[]),
		getContactInfo().catch(() => ({ phone: "", email: "" })),
	]);

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

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-20 sm:pt-24 bg-black">

				{/* ── MOBILE LAYOUT ── */}
				<div className="relative overflow-hidden h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] lg:hidden">
					<ImageComponent
						src="/images/Background Mobile.jpeg"
						alt=""
						fill
						priority
						className="object-cover object-[40%_62%] scale-[1.2] origin-[0%_62%] -translate-y-[20%]"
						sizes="100vw"
					/>
					{/* Machine image */}
					<div className="absolute inset-x-0 top-[6%] h-[50vh] z-10 flex items-center justify-center">
						<div className="relative w-full h-full">
							<ImageComponent
								src="/images/motus-ax-3.jpg"
								alt="Motus Pro"
								fill
								className="object-contain drop-shadow-2xl"
								priority
								sizes="100vw"
							/>
						</div>
					</div>
				</div>

				{/* Mobile text — below background */}
				<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[38vh]">
					<h1 className="text-5xl font-serif font-light text-white mb-3 leading-tight">
						Motus Pro
					</h1>
					<div className="w-14 h-[2px] bg-primary mb-4" />
					<p className="text-white/70 text-sm mb-8 leading-relaxed">
						Avancerad laserplattform för professionella behandlingar
					</p>
					<ul className="space-y-4">
						{[
							"Snabb och effektiv behandling",
							"Skonsam teknik med hög precision",
							"Intuitiv touchskärm och smart arbetsflöde",
							"Anpassad för professionella kliniker",
						].map((item) => (
							<li key={item} className="flex items-center gap-3">
								<div className="h-6 w-6 rounded-full border border-[#fcf3e1] flex items-center justify-center shrink-0">
									<Check className="h-3 w-3 text-[#fcf3e1]" strokeWidth={1} />
								</div>
								<span className="text-white/90 text-sm font-thin">{item}</span>
							</li>
						))}
					</ul>
					<button type="button" className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-white/30 text-white/90 text-sm font-light">
						<FileText className="h-4 w-4 shrink-0" />
						Begär offert
					</button>
				</div>

				{/* ── DESKTOP LAYOUT ── */}
				<div className="hidden lg:block">
					<div className="_container relative overflow-hidden min-h-[740px]">
						<ImageComponent
							src="/images/Product detail breadcrumbs background.jpeg"
							alt=""
							fill
							priority
							className="object-cover object-[30%_top]"
							sizes="100vw"
						/>
						<div className="relative z-10 grid grid-cols-2 items-center min-h-[740px] gap-8">
							{/* Left — machine grounded on floor */}
							<div className="relative h-[740px] flex flex-col items-center justify-center">
								{/* Warm floor glow matching background lighting */}
								<div
									className="absolute inset-x-[8%] pointer-events-none z-0"
									style={{
										bottom: '14%',
										height: '90px',
										background: 'radial-gradient(ellipse at 50% 80%, rgba(184,138,58,0.22) 0%, transparent 70%)',
										filter: 'blur(22px)',
									}}
								/>
								{/* Product image — anchored to floor */}
								<div className="relative w-full h-[620px] z-10">
									<ImageComponent
										src="/images/motus.png"
										alt="Motus Pro"
										fill
										className="object-contain object-bottom"
										priority
										sizes="700px"
									/>
								</div>
								{/* Contact shadow + floor reflection */}
								<div className="relative z-10 w-full shrink-0 -mt-3">
									<div
										className="mx-auto pointer-events-none"
										style={{
											width: '46%',
											height: '16px',
											background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.82) 0%, transparent 70%)',
											filter: 'blur(9px)',
										}}
									/>
									<div
										className="w-full mt-1 overflow-hidden"
										style={{
											height: '68px',
											opacity: 0.35,
											maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
											WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
										}}
									>
										<div className="relative w-full h-[620px]" style={{ transform: 'scaleY(-1)' }}>
											<ImageComponent
												src="/images/motus.png"
												fill
												alt=""
												className="object-contain object-bottom"
												sizes="700px"
											/>
										</div>
									</div>
								</div>
							</div>
							{/* Right — Form */}
							<div className="flex flex-col justify-center py-10 pl-10 pr-8">
								<h2 className="text-5xl font-serif font-light text-white mb-2 leading-tight">
									Motus Pro
								</h2>
								<p className="text-white/60 text-base mb-8 leading-relaxed">
									Avancerad laserplattform för professionella behandlingar
								</p>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs text-white/60 mb-1.5">Förnamn <span className="text-primary">*</span></label>
											<input type="text" placeholder="Ditt förnamn" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
										</div>
										<div>
											<label className="block text-xs text-white/60 mb-1.5">Efternamn <span className="text-primary">*</span></label>
											<input type="text" placeholder="Ditt efternamn" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs text-white/60 mb-1.5">Företag <span className="text-primary">*</span></label>
											<input type="text" placeholder="Ditt företagsnamn" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
										</div>
										<div>
											<label className="block text-xs text-white/60 mb-1.5">E-post <span className="text-primary">*</span></label>
											<input type="email" placeholder="din.email@exempel.se" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
										</div>
									</div>
									<div>
										<label className="block text-xs text-white/60 mb-1.5">När är du intresserad av att ta nästa steg? <span className="text-primary">*</span></label>
										<textarea rows={4} placeholder="Beskriv när det passar er bäst eller andra detaljer..." className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none resize-none" />
									</div>
									<button type="button" className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium text-base">
										Skicka förfrågan
									</button>
									<p className="text-center text-xs text-white/40">
										Vi behandlar dina uppgifter konfidentiellt och delar dem inte med tredje part.
									</p>
								</div>
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
								<KategoriSidebar categories={categories} />
							</div>
							<MobileDrawer categories={categories} />
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
						</div>
					</div>
				</div>
			</div>

			{/* Contact form (dark, product-inquiry styling, generic mode) */}
			<ProductInquiryForm
				pillLabel="SYNOS MEDICAL"
				purchaseTitle="Kontakta oss"
				purchaseDescription="<p>Behöver du hjälp att hitta rätt klinikutrustning för din verksamhet? Vårt team återkommer inom 24 timmar med personlig rådgivning.</p>"
				contactPhone={contactInfo.phone}
				contactEmail={contactInfo.email}
			/>

			{/* FAQ Footer Section (fallback content; admin-editable later) */}
			<section className="bg-white py-12 md:py-16 border-t border-slate-200">
				<div className="_container mx-auto px-4">
					<ProductFAQ title={KLINIK_FAQ_TITLE} faqs={KLINIK_FAQS} />
				</div>
			</section>
		</div>
	);
}
