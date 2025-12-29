import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../_components/contact-form-section";
import { varforValjaSynosPageService } from "@/lib/services/varfor-valja-synos-page.service";
import { PreviewEditor } from "@/components/common/TextEditor";
import {
	Shield,
	Award,
	Users,
	HeartHandshake,
	Sparkles,
	CheckCircle,
	ArrowRight,
	Heart,
	Star,
	Zap,
	BookOpen,
	Settings,
	LucideIcon,
} from "lucide-react";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
	Shield,
	Award,
	Users,
	HeartHandshake,
	Heart,
	Star,
	Zap,
	BookOpen,
	Settings,
	CheckCircle,
};

export async function generateMetadata(): Promise<Metadata> {
	const pageData = await varforValjaSynosPageService.getVarforValjaSynosPage();

	return {
		title: pageData.seo?.title || "Varför välja Synos? | Synos Medical",
		description:
			pageData.seo?.description ||
			"Upptäck varför Synos Medical är rätt val för din klinik. MDR-certifierad utrustning, världsledande utbildning och livstids support.",
		openGraph: {
			title: pageData.seo?.title || "Varför välja Synos Medical?",
			description:
				pageData.seo?.description ||
				"Upptäck varför Synos Medical är rätt val för din klinik. MDR-certifierad utrustning, världsledande utbildning och livstids support.",
			images: pageData.seo?.ogImage ? [{ url: pageData.seo.ogImage }] : [],
		},
	};
}

// Default data for fallback
const defaultReasons = [
	{
		icon: "Shield",
		title: "MDR-certifierad utrustning",
		description:
			"Alla våra produkter är certifierade enligt EU:s medicintekniska förordning (MDR), vilket garanterar högsta säkerhet och kvalitet.",
	},
	{
		icon: "Award",
		title: "Världsledande varumärken",
		description:
			"Vi är stolta representanter för DEKA, en av världens ledande tillverkare av medicinska lasrar med över 50 års erfarenhet.",
	},
	{
		icon: "Users",
		title: "Personlig utbildning",
		description:
			"Varje kund får skräddarsydd utbildning av våra certifierade experter. Vi säkerställer att du känner dig trygg och säker.",
	},
	{
		icon: "HeartHandshake",
		title: "Livstids support",
		description:
			"Vi är med dig hela vägen. Vår support är alltid tillgänglig för att hjälpa dig med frågor och felsökning.",
	},
];

const defaultBenefits = [
	"Service inom 48 arbetstimmar",
	"Kostnadsfri konsultation",
	"Finansieringslösningar",
	"Försäkringsalternativ",
	"Marknadsföringsstöd",
	"Nätverksmöjligheter",
];

export default async function VarforValjaSynosPage() {
	const pageData = await varforValjaSynosPageService.getVarforValjaSynosPage();

	const visibility = pageData.sectionVisibility || {
		hero: true,
		reasons: true,
		benefits: true,
		cta: true,
		contactForm: true,
		richContent: false,
	};

	const hero = pageData.hero || {};
	const reasons = pageData.reasons?.length ? pageData.reasons : defaultReasons;
	const benefitsSection = pageData.benefitsSection || {};
	const benefits = benefitsSection.items?.length ? benefitsSection.items : defaultBenefits;
	const ctaSection = pageData.ctaSection || {};

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
			{visibility.hero && (
				<section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-slate-100 to-white pt-32 pb-16">
					<div className="_container">
						<Breadcrumb
							items={[
								{ label: "Starta Eget", href: "/starta-eget" },
								{ label: "Varför välja Synos?" },
							]}
						/>

						<div className="mt-8 max-w-4xl">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
								<Sparkles className="h-4 w-4 text-primary" />
								<span className="text-sm font-semibold text-primary">
									{hero.badge || "Din partner för framgång"}
								</span>
							</div>

							<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
								{hero.title || "Varför välja"}{" "}
								<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									{hero.titleHighlight || "Synos Medical?"}
								</span>
							</h1>

							<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
								{hero.subtitle ||
									"Vi är mer än en leverantör – vi är din partner på resan mot en framgångsrik klinik. Med över 15 års erfarenhet och hundratals nöjda kunder vet vi vad som krävs för att lyckas."}
							</p>
						</div>
					</div>
				</section>
			)}

			{/* Main Reasons Section */}
			{visibility.reasons && (
				<section className="py-16">
					<div className="_container">
						<div className="grid gap-8 md:grid-cols-2">
							{reasons.map((reason, index) => {
								const IconComponent = iconMap[reason.icon || "Shield"] || Shield;
								return (
									<Card
										key={index}
										className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
									>
										<CardContent className="p-8">
											<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
												<IconComponent className="h-7 w-7 text-primary" />
											</div>
											<h3 className="mb-3 text-xl font-bold text-secondary">
												{reason.title}
											</h3>
											<p className="text-muted-foreground">
												{reason.description}
											</p>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* Benefits Section */}
			{visibility.benefits && (
				<section className="py-16 bg-secondary/5">
					<div className="_container">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-secondary mb-4">
								{benefitsSection.title || "Fördelar med att välja Synos"}
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								{benefitsSection.subtitle ||
									"Som kund hos Synos Medical får du tillgång till ett komplett ekosystem av tjänster och support."}
							</p>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
							{benefits.map((benefit, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-4 bg-white rounded-lg border border-primary/20"
								>
									<CheckCircle className="h-5 w-5 text-primary shrink-0" />
									<span className="font-medium text-secondary">
										{benefit}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Rich Content Section */}
			{visibility.richContent && pageData.richContent && (
				<section className="py-16">
					<div className="_container prose prose-lg max-w-none">
						<PreviewEditor>{pageData.richContent}</PreviewEditor>
					</div>
				</section>
			)}

			{/* CTA Section */}
			{visibility.cta && (
				<section className="py-16">
					<div className="_container">
						<div className="bg-linear-to-br from-secondary to-secondary/90 rounded-3xl p-8 md:p-12 text-center">
							<h2 className="text-3xl font-bold text-white mb-4">
								{ctaSection.title || "Redo att ta nästa steg?"}
							</h2>
							<p className="text-white/80 mb-8 max-w-2xl mx-auto">
								{ctaSection.subtitle ||
									"Kontakta oss idag för en kostnadsfri konsultation. Vi hjälper dig att hitta rätt lösning för din verksamhet."}
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<Button
									asChild
									size="lg"
									className="bg-primary hover:bg-primary/90 text-white"
								>
									<Link href={ctaSection.primaryButtonHref || "/kontakt"}>
										{ctaSection.primaryButtonText || "Kontakta oss"}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								{(ctaSection.secondaryButtonText || true) && (
									<Button
										asChild
										size="lg"
										variant="outline"
										className="border-white text-white hover:bg-white hover:text-secondary"
									>
										<Link href={ctaSection.secondaryButtonHref || "/utrustning"}>
											{ctaSection.secondaryButtonText || "Se vår utrustning"}
										</Link>
									</Button>
								)}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Contact Form */}
			{visibility.contactForm && <ContactFormSection />}
		</div>
	);
}
