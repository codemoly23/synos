import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../_components/contact-form-section";
import { kopguidePageService } from "@/lib/services/kopguide-page.service";
import { PreviewEditor } from "@/components/common/TextEditor";
import {
	BookOpen,
	CheckCircle,
	FileText,
	ArrowRight,
	Target,
	Lightbulb,
	Scale,
	Shield,
	Award,
	Settings,
	Users,
	LucideIcon,
} from "lucide-react";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
	Target,
	Lightbulb,
	Scale,
	FileText,
	BookOpen,
	CheckCircle,
	Shield,
	Award,
	Settings,
	Users,
};

export async function generateMetadata(): Promise<Metadata> {
	const pageData = await kopguidePageService.getKopguidePage();

	return {
		title: pageData.seo?.title || "Köpguide | Synos Medical",
		description:
			pageData.seo?.description ||
			"Din kompletta guide till att köpa rätt klinikutrustning. Lär dig vad du ska tänka på innan du investerar i lasermaskiner och medicinsk utrustning.",
		openGraph: {
			title: pageData.seo?.title || "Köpguide för klinikutrustning | Synos Medical",
			description:
				pageData.seo?.description ||
				"Din kompletta guide till att köpa rätt klinikutrustning. Lär dig vad du ska tänka på innan du investerar.",
			images: pageData.seo?.ogImage ? [{ url: pageData.seo.ogImage }] : [],
		},
	};
}

// Default data for fallback
const defaultSteps = [
	{
		number: "01",
		icon: "Target",
		title: "Definiera dina mål",
		description:
			"Börja med att definiera vilka behandlingar du vill erbjuda och vilken målgrupp du vänder dig till. Detta hjälper dig att välja rätt utrustning.",
	},
	{
		number: "02",
		icon: "Lightbulb",
		title: "Utforska alternativ",
		description:
			"Undersök olika maskiner och teknologier. Jämför specifikationer, behandlingsområden och långsiktiga kostnader.",
	},
	{
		number: "03",
		icon: "Scale",
		title: "Jämför leverantörer",
		description:
			"Utvärdera leverantörer baserat på produktkvalitet, utbildning, support och servicenivå. Certifieringar som MDR är avgörande.",
	},
	{
		number: "04",
		icon: "FileText",
		title: "Planera finansiering",
		description:
			"Utforska finansieringsalternativ som leasing eller avbetalning. En bra leverantör hjälper dig med detta.",
	},
];

const defaultChecklist = [
	"Är produkten MDR-certifierad?",
	"Vilken utbildning ingår vid köp?",
	"Hur ser serviceavtalet ut?",
	"Finns det garanti och försäkringsmöjligheter?",
	"Vilken support erbjuds efter köp?",
	"Finns det referenskunder jag kan kontakta?",
	"Hur lång är leveranstiden?",
	"Vilka finansieringsalternativ finns?",
];

export default async function KopguidePage() {
	const pageData = await kopguidePageService.getKopguidePage();

	const visibility = pageData.sectionVisibility || {
		hero: true,
		guideSteps: true,
		checklist: true,
		cta: true,
		contactForm: true,
		richContent: false,
	};

	const hero = pageData.hero || {};
	const stepsSection = pageData.stepsSection || {};
	const steps = stepsSection.steps?.length ? stepsSection.steps : defaultSteps;
	const checklistSection = pageData.checklistSection || {};
	const checklist = checklistSection.items?.length ? checklistSection.items : defaultChecklist;
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
								{ label: "Köpguide" },
							]}
						/>

						<div className="mt-8 max-w-4xl">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
								<BookOpen className="h-4 w-4 text-primary" />
								<span className="text-sm font-semibold text-primary">
									{hero.badge || "Köpguide"}
								</span>
							</div>

							<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
								{hero.title || "Din guide till rätt"}{" "}
								<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									{hero.titleHighlight || "klinikutrustning"}
								</span>
							</h1>

							<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
								{hero.subtitle ||
									"Att investera i klinikutrustning är ett stort beslut. Den här guiden hjälper dig att navigera processen och göra ett välgrundat val."}
							</p>
						</div>
					</div>
				</section>
			)}

			{/* Guide Steps Section */}
			{visibility.guideSteps && (
				<section className="py-16">
					<div className="_container">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-secondary mb-4">
								{stepsSection.title || "4 steg till rätt beslut"}
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								{stepsSection.subtitle ||
									"Följ dessa steg för att säkerställa att du väljer rätt utrustning för din verksamhet."}
							</p>
						</div>

						<div className="grid gap-8 md:grid-cols-2">
							{steps.map((step, index) => {
								const IconComponent = iconMap[step.icon || "Target"] || Target;
								return (
									<Card
										key={index}
										className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
									>
										<CardContent className="p-8">
											<div className="flex items-start gap-4">
												<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
													<IconComponent className="h-7 w-7 text-primary" />
												</div>
												<div>
													<span className="text-sm font-bold text-primary">
														Steg {step.number}
													</span>
													<h3 className="mb-2 text-xl font-bold text-secondary">
														{step.title}
													</h3>
													<p className="text-muted-foreground">
														{step.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* Checklist Section */}
			{visibility.checklist && (
				<section className="py-16 bg-secondary/5">
					<div className="_container">
						<div className="max-w-3xl mx-auto">
							<div className="text-center mb-12">
								<h2 className="text-3xl font-bold text-secondary mb-4">
									{checklistSection.title || "Checklista vid köp"}
								</h2>
								<p className="text-muted-foreground">
									{checklistSection.subtitle ||
										"Använd den här checklistan när du utvärderar leverantörer och produkter."}
								</p>
							</div>

							<Card className="border-primary/20">
								<CardContent className="p-8">
									<div className="grid gap-4 sm:grid-cols-2">
										{checklist.map((item, index) => (
											<div
												key={index}
												className="flex items-start gap-3"
											>
												<CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
												<span className="text-secondary">
													{item}
												</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
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
								{ctaSection.title || "Vill du veta mer?"}
							</h2>
							<p className="text-white/80 mb-8 max-w-2xl mx-auto">
								{ctaSection.subtitle ||
									"Boka en kostnadsfri konsultation med en av våra experter. Vi hjälper dig att hitta den perfekta lösningen för din klinik."}
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<Button
									asChild
									size="lg"
									className="bg-primary hover:bg-primary/90 text-white"
								>
									<Link href={ctaSection.primaryButtonHref || "/kontakt"}>
										{ctaSection.primaryButtonText || "Boka konsultation"}
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
										<Link href={ctaSection.secondaryButtonHref || "/starta-eget/miniutbildning"}>
											{ctaSection.secondaryButtonText || "Kostnadsfri miniutbildning"}
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
