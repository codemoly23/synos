import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	getAboutPage,
	getAboutPageSeo,
} from "@/lib/services/about-page.service";
import {
	CheckCircle,
	Search,
	Zap,
	BookOpen,
	Info,
	Settings,
	type LucideIcon,
} from "lucide-react";

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
	CheckCircle,
	Search,
	Zap,
	BookOpen,
	Info,
	Settings,
};

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getAboutPageSeo();

	const title = seo?.title || "Om oss - Synos Medical";
	const description =
		seo?.description ||
		"Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
		},
	};
}

export default async function AboutPage() {
	const aboutPage = await getAboutPage();

	const visibility = aboutPage.sectionVisibility || {
		hero: true,
		contentSections: true,
		contactSection: true,
		featureCards: true,
		companyInfo: true,
	};

	// Check if we have content to display
	const hasHero = aboutPage.hero?.title || aboutPage.hero?.subtitle;
	const hasContentSections =
		aboutPage.contentSections &&
		aboutPage.contentSections.filter((s) => s.title || s.content).length > 0;
	const hasContactSection =
		aboutPage.contactSection?.title || aboutPage.contactSection?.description;
	const hasFeatureCards =
		aboutPage.featureCards &&
		aboutPage.featureCards.filter((c) => c.title || c.description).length > 0;
	const hasCompanyInfo =
		aboutPage.companyInfo?.companyName ||
		aboutPage.companyInfo?.organizationNumber;

	return (
		<div className="_container padding-top padding-bottom">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<div className="mb-16 text-center">
					{aboutPage.hero?.title && (
						<h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
							{aboutPage.hero.title}
						</h1>
					)}
					{aboutPage.hero?.subtitle && (
						<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
							{aboutPage.hero.subtitle}
						</p>
					)}
				</div>
			)}

			{/* Content Sections */}
			{visibility.contentSections && hasContentSections && (
				<div className="space-y-12">
					{aboutPage.contentSections
						?.filter((section) => section.title || section.content)
						.map((section, index) => (
							<section
								key={index}
								className={
									section.highlighted
										? "rounded-lg bg-muted/50 p-8"
										: ""
								}
							>
								{section.title && (
									<h2 className="mb-4 text-3xl font-bold text-secondary">
										{section.title}
									</h2>
								)}
								{section.content && (
									<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
										{section.content
											.split("\n")
											.map((paragraph, pIndex) =>
												paragraph.trim() ? (
													<p key={pIndex}>{paragraph}</p>
												) : null
											)}
									</div>
								)}
							</section>
						))}
				</div>
			)}

			{/* Contact Section */}
			{visibility.contactSection && hasContactSection && (
				<section className="mt-12 rounded-lg bg-secondary/5 p-8 text-center">
					{aboutPage.contactSection?.title && (
						<h2 className="mb-4 text-3xl font-bold text-secondary">
							{aboutPage.contactSection.title}
						</h2>
					)}
					{aboutPage.contactSection?.description && (
						<p className="mb-6 text-lg text-muted-foreground">
							{aboutPage.contactSection.description}
						</p>
					)}
					{(aboutPage.contactSection?.primaryCta?.text ||
						aboutPage.contactSection?.secondaryCta?.text) && (
						<div className="flex flex-wrap justify-center gap-4">
							{aboutPage.contactSection?.primaryCta?.text &&
								aboutPage.contactSection?.primaryCta?.href && (
									<Button asChild size="lg">
										<Link
											href={aboutPage.contactSection.primaryCta.href}
										>
											{aboutPage.contactSection.primaryCta.text}
										</Link>
									</Button>
								)}
							{aboutPage.contactSection?.secondaryCta?.text &&
								aboutPage.contactSection?.secondaryCta?.href && (
									<Button asChild variant="outline" size="lg">
										<a
											href={
												aboutPage.contactSection.secondaryCta.href
											}
										>
											{aboutPage.contactSection.secondaryCta.text}
										</a>
									</Button>
								)}
						</div>
					)}
				</section>
			)}

			{/* Feature Cards */}
			{visibility.featureCards && hasFeatureCards && (
				<div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{aboutPage.featureCards
						?.filter((card) => card.title || card.description)
						.map((card, index) => {
							const IconComponent = card.icon
								? ICON_MAP[card.icon] || CheckCircle
								: CheckCircle;

							return (
								<Card
									key={index}
									className="border-primary/20 transition-shadow hover:shadow-lg"
								>
									<CardContent className="p-6">
										<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
											<IconComponent className="h-6 w-6 text-secondary" />
										</div>
										{card.title && (
											<h3 className="mb-2 font-semibold">
												{card.title}
											</h3>
										)}
										{card.description && (
											<p className="mb-4 text-sm text-muted-foreground">
												{card.description}
											</p>
										)}
										{card.ctaText && card.ctaHref && (
											<Button asChild variant="ghost" size="sm">
												<Link href={card.ctaHref}>
													{card.ctaText}
												</Link>
											</Button>
										)}
									</CardContent>
								</Card>
							);
						})}
				</div>
			)}

			{/* Company Info */}
			{visibility.companyInfo && hasCompanyInfo && (
				<div className="mt-16 rounded-lg bg-muted/30 p-8 text-center">
					{aboutPage.companyInfo?.companyName && (
						<h3 className="mb-4 text-xl font-semibold">
							{aboutPage.companyInfo.companyName}
						</h3>
					)}
					{aboutPage.companyInfo?.organizationNumber && (
						<p className="text-muted-foreground">
							Organisationsnummer:{" "}
							{aboutPage.companyInfo.organizationNumber}
						</p>
					)}
					{aboutPage.companyInfo?.addresses &&
						aboutPage.companyInfo.addresses.length > 0 && (
							<div className="mt-4 space-y-1 text-muted-foreground">
								{aboutPage.companyInfo.addresses.map(
									(address, index) => (
										<p key={index}>{address}</p>
									)
								)}
							</div>
						)}
				</div>
			)}
		</div>
	);
}
