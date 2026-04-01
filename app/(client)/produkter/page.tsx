import { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import {
	getNewestProducts,
	getActiveCategories,
} from "@/lib/services/product-cache.service";
import { technologyMap } from "@/config/technology-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ListFilter, ShieldCheck, BookOpen, Settings } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";
/**
 * Products Page
 *
 * URL: /produkter
 * Shows all published products with category sidebar filter
 */
// ISR: Revalidate every 24 hours
export const revalidate = 60;
export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();
	return {
		title: `Produkter | ${siteConfig.name}`,
		description:
			"Professionella lasermaskiner och medicinsk utrustning av högsta kvalitet. Alla våra produkter är MDR-certifierade och testade för bästa funktionalitet.",
		openGraph: {
			title: `Produkter | ${siteConfig.name}`,
			description:
				"Professionella lasermaskiner och medicinsk utrustning av högsta kvalitet.",
			url: `${siteConfig.url}/produkter`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/produkter`,
		},
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
		<Link href={`/kategori/${categorySlug}/${product.slug}`}>
			<Card className="group h-full overflow-hidden border-primary/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 p-0!">
				{/* Image */}
				<div className="relative aspect-square overflow-hidden bg-white p-4">
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
				<CardHeader className="px-4 py-3">
					<h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">
						{product.title}
					</h3>
				</CardHeader>
				<CardContent className="px-4 pb-3 pt-0">
					<p className="mb-3 text-sm text-muted-foreground line-clamp-3">
						{product.shortDescription}
					</p>
					{/* Treatment Tags */}
					{product.treatments && product.treatments.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{product.treatments.slice(0, 3).map((treatment) => (
								<Badge
									key={treatment}
									variant="secondary"
									className="bg-primary/5 text-primary/80 text-xs hover:bg-primary/5"
								>
									{treatment}
								</Badge>
							))}
						</div>
					)}
				</CardContent>
				<CardFooter className="px-4 pb-4 pt-0">
					<Button className="w-full bg-primary text-primary-foreground transition-colors">
						Läs mer
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
}
// Static category list
const staticCategories = [
	{ name: "Permanent Hårborttagning", href: "/kategori/harborttagning", tech: "Alexandrit/Nd:YAG, Diode, IPL" },
	{ name: "Tatueringsborttagning", href: "/kategori/tatueringsborttagning", tech: "Pico/Q-Switched" },
	{ name: "Hudföryngring", href: "/kategori/hudforyngring", tech: "CO₂, Er:YAG, 1540/1570, Redium, RF" },
	{ name: "Skin Resurfacing", href: "/kategori/co2laser", tech: "CO₂, Er:YAG" },
	{ name: "Huduppstramning", href: "/kategori/hudforyngring", tech: "CO₂, RF, HIFU, Plasma" },
	{ name: "Pigmentbehandling", href: "/kategori/pigmentflackar", tech: "Pico/Q-Switched, Redium, CO₂, IPL" },
	{ name: "Kärlbehandling", href: "/kategori/ytliga-blodkarl-angiom", tech: "Alexandrit/Nd:YAG" },
	{ name: "Akne & Ärrbehandling", href: "/kategori/akne-arr-och-hudbristningar", tech: "CO₂, Redium, RF, Plasma" },
	{ name: "Hudbristningar", href: "/kategori/akne-arr-och-hudbristningar", tech: "CO₂, Redium, RF, Plasma" },
	{ name: "Kroppsformning & Fettbehandling", href: "/kategori/kropp-muskler-fett", tech: "Body Contouring" },
	{ name: "Muskeltoning", href: "/kategori/kropp-muskler-fett", tech: "EMS" },
	{ name: "Cellulitbehandling", href: "/kategori/kropp-muskler-fett", tech: "Body Contouring" },
];

// Static technology map for sidebar
const sidebarTechMap = [
	{
		name: "Alexandrit & Nd:YAG",
		machines: [
			{ title: "MOTUS PRO", href: "/kategori/harborttagning/motus-pro" },
			{ title: "Motus AX / AY", href: "/kategori/harborttagning/harborttagningslaser-kopa-motus-ax" },
			{ title: "Again PRO PLUS", href: "/kategori/harborttagning/again-pro" },
		],
	},
	{
		name: "Pico & Q-Switched",
		machines: [
			{ title: "Q-terra Q10", href: "/kategori/tatueringsborttagning/qterra-q10-tatueringsborttagning-laser-sverige" },
			{ title: "Toro Pico Laser", href: "/kategori/tatueringsborttagning/toro" },
		],
	},
	{
		name: "Diodlaser",
		machines: [
			{ title: "Tridi Wave", href: "/produkter" },
		],
	},
	{
		name: "IPL",
		machines: [
			{ title: "Prisma", href: "/produkter" },
		],
	},
	{
		name: "Fraktionerad laser 1540/1570nm",
		machines: [
			{ title: "Helix", href: "/produkter" },
			{ title: "DuoGlide", href: "/kategori/co2laser/duoglide" },
		],
	},
	{
		name: "CO₂ Fraktionerad laser",
		machines: [
			{ title: "Helix", href: "/produkter" },
			{ title: "Tetra PRO", href: "/kategori/co2laser/tetra-pro" },
			{ title: "SmartXide PRO", href: "/kategori/co2laser/ny-smartxide-punto" },
			{ title: "Punto", href: "/kategori/co2laser/ny-smartxide-punto" },
			{ title: "DuoGlide", href: "/kategori/co2laser/duoglide" },
		],
	},
	{
		name: "Fraktionerad Redium 675 nm",
		machines: [
			{ title: "RedTouch PRO", href: "/kategori/hudforyngring/redium" },
		],
	},
	{
		name: "RF Microneedling",
		machines: [
			{ title: "Vivace RF", href: "/kategori/hudforyngring/vivace-rf-microneedling" },
		],
	},
	{
		name: "HIFU",
		machines: [
			{ title: "HIFU Ultraskin S", href: "/produkter" },
		],
	},
	{
		name: "Plasma",
		machines: [
			{ title: "Jovena", href: "/kategori/ansiktsbehandlingar/jovena" },
			{ title: "Plasmage", href: "/produkter" },
		],
	},
	{
		name: "Body Contouring",
		machines: [
			{ title: "Onda Coolwaves PRO", href: "/kategori/kropp-muskler-fett/onda-coolwaves-pro" },
			{ title: "BodyStim Pro", href: "/produkter" },
			{ title: "HIFU Ultraskin S", href: "/produkter" },
		],
	},
	{
		name: "EMS",
		machines: [
			{ title: "BodyStim Pro", href: "/produkter" },
		],
	},
];

// Sidebar Component
function ProduktSidebar({
	categories,
	selectedTech,
}: {
	categories: ICategory[];
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
						href="/produkter"
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
						href="/produkter"
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
								className={`block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
									selectedTech === tech.name
										? "bg-primary text-primary-foreground"
										: "text-foreground hover:bg-primary/20"
								}`}
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
	selectedTech,
}: {
	categories: ICategory[];
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
						<ProduktSidebar categories={categories} selectedTech={selectedTech} />
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
	const [products, categories] = await Promise.all([
		getNewestProducts(100),
		getActiveCategories(),
	]);

	// Filter products by selected technology
	const filteredProducts = selectedTech
		? (() => {
				const techGroup = technologyMap.find((t) => t.name === selectedTech);
				if (!techGroup) return products;
				const machineSlugs = techGroup.machines.map(
					(m) => m.href.split("/").pop() ?? ""
				);
				return products.filter((p) => machineSlugs.includes(p.slug));
		  })()
		: products;
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
			<section className="relative overflow-hidden bg-secondary padding-top pb-0">
				<div className="_container relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 items-end gap-8 min-h-[280px]">
						{/* Left - Text */}
						<div className="py-12 lg:py-16">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-4">
								Våra Produkter
							</h1>
							<p className="text-white/60 text-base max-w-lg leading-relaxed">
								Professionella lasermaskiner och medicinsk utrustning av högsta kvalitet.
								Alla våra produkter är MDR-certifierade och testade för bästa funktionalitet.
							</p>
						</div>
						{/* Right - Product Images */}
						<div className="hidden lg:flex items-end justify-end self-end">
							<div className="relative w-[500px] h-80 drop-shadow-2xl">
								<ImageComponent
									src="/storage/images/motus-ax-3-600x500.webp"
									alt="Medicinsk utrustning"
									fill
									className="object-contain object-bottom"
									priority
									sizes="500px"
								/>
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
							<ProduktSidebar categories={categories} selectedTech={selectedTech} />
						</div>
						<MobileDrawer categories={categories} selectedTech={selectedTech} />
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
		</div>
	);

}
