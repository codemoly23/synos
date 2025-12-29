import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../_components/contact-form-section";
import { miniutbildningPageService } from "@/lib/services/miniutbildning-page.service";
import { PreviewEditor } from "@/components/common/TextEditor";
import {
	GraduationCap,
	CheckCircle,
	Clock,
	Users,
	ArrowRight,
	Play,
	Award,
	Zap,
	Heart,
	Star,
	BookOpen,
	LucideIcon,
} from "lucide-react";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
	Clock,
	GraduationCap,
	Users,
	Play,
	Award,
	Zap,
	CheckCircle,
	Heart,
	Star,
	BookOpen,
};

export async function generateMetadata(): Promise<Metadata> {
	const pageData = await miniutbildningPageService.getMiniutbildningPage();

	return {
		title: pageData.seo?.title || "Miniutbildning | Synos Medical",
		description:
			pageData.seo?.description ||
			"Kostnadsfri miniutbildning om laserteknik och klinikutrustning. Lär dig grunderna för att fatta rätt beslut om din investering.",
		openGraph: {
			title: pageData.seo?.title || "Kostnadsfri miniutbildning | Synos Medical",
			description:
				pageData.seo?.description ||
				"Kostnadsfri miniutbildning om laserteknik och klinikutrustning. Lär dig grunderna för att fatta rätt beslut.",
			images: pageData.seo?.ogImage ? [{ url: pageData.seo.ogImage }] : [],
		},
	};
}

// Default data for fallback
const defaultBenefits = [
	{
		icon: "Clock",
		title: "Flexibelt format",
		description:
			"Utbildningen anpassas efter dina behov och kan genomföras digitalt eller på plats.",
	},
	{
		icon: "GraduationCap",
		title: "Expertledda sessioner",
		description:
			"Våra certifierade utbildare har mångårig erfarenhet inom laserteknik och estetisk medicin.",
	},
	{
		icon: "Users",
		title: "Personlig rådgivning",
		description:
			"Få individuell rådgivning baserat på dina specifika behov och verksamhetsmål.",
	},
];

const defaultLearnings = [
	"Grundläggande laserfysik och hur olika våglängder påverkar behandlingar",
	"Skillnader mellan olika lasertyper (diod, Alexandrit, Nd:YAG)",
	"Vad du ska titta på när du jämför maskiner",
	"Säkerhetskrav och certifieringar (MDR, CE)",
	"Hur du beräknar ROI på din investering",
	"Vanliga misstag att undvika vid köp",
];

const defaultProcessSteps = [
	{
		number: "1",
		title: "Boka tid",
		description: "Fyll i formuläret så kontaktar vi dig för att boka en tid som passar.",
	},
	{
		number: "2",
		title: "Delta i utbildningen",
		description: "Välj mellan digitalt möte eller besök på vårt showroom.",
	},
	{
		number: "3",
		title: "Få personlig rådgivning",
		description: "Diskutera dina behov och få rekommendationer anpassade för dig.",
	},
];

export default async function MiniutbildningPage() {
	const pageData = await miniutbildningPageService.getMiniutbildningPage();

	const visibility = pageData.sectionVisibility || {
		hero: true,
		benefits: true,
		learnings: true,
		process: true,
		contactForm: true,
		richContent: false,
	};

	const hero = pageData.hero || {};
	const benefits = pageData.benefits?.length ? pageData.benefits : defaultBenefits;
	const learningsSection = pageData.learningsSection || {};
	const learnings = learningsSection.items?.length ? learningsSection.items : defaultLearnings;
	const processSection = pageData.processSection || {};
	const processSteps = processSection.steps?.length ? processSection.steps : defaultProcessSteps;

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
			{visibility.hero && (
				<section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-slate-100 to-white pt-32 pb-16">
					<div className="_container">
						<Breadcrumb
							items={[
								{ label: "Starta Eget", href: "/starta-eget" },
								{ label: "Miniutbildning" },
							]}
						/>

						<div className="mt-8 max-w-4xl">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
								<GraduationCap className="h-4 w-4 text-primary" />
								<span className="text-sm font-semibold text-primary">
									{hero.badge || "Kostnadsfri utbildning"}
								</span>
							</div>

							<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
								{hero.title || "Kostnadsfri"}{" "}
								<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									{hero.titleHighlight || "miniutbildning"}
								</span>
							</h1>

							<p className="text-lg text-muted-foreground md:text-xl max-w-2xl mb-8">
								{hero.subtitle ||
									"Få kunskapen att välja rätt laser. Vår kostnadsfria miniutbildning ger dig verktygen att jämföra olika modeller på marknaden och fatta ett välgrundat beslut."}
							</p>

							<div className="flex flex-wrap gap-4">
								<Button asChild size="lg" className="bg-primary text-white">
									<Link href={hero.buttonHref || "#kontakt"}>
										<Play className="mr-2 h-4 w-4" />
										{hero.buttonText || "Boka miniutbildning"}
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Benefits Section */}
			{visibility.benefits && (
				<section className="py-16">
					<div className="_container">
						<div className="grid gap-8 md:grid-cols-3">
							{benefits.map((benefit, index) => {
								const IconComponent = iconMap[benefit.icon || "Clock"] || Clock;
								return (
									<Card
										key={index}
										className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
									>
										<CardContent className="p-8 text-center">
											<div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
												<IconComponent className="h-7 w-7 text-primary" />
											</div>
											<h3 className="mb-3 text-xl font-bold text-secondary">
												{benefit.title}
											</h3>
											<p className="text-muted-foreground">
												{benefit.description}
											</p>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* What You'll Learn Section */}
			{visibility.learnings && (
				<section className="py-16 bg-secondary/5">
					<div className="_container">
						<div className="max-w-4xl mx-auto">
							<div className="text-center mb-12">
								<h2 className="text-3xl font-bold text-secondary mb-4">
									{learningsSection.title || "Vad du kommer lära dig"}
								</h2>
								<p className="text-muted-foreground">
									{learningsSection.subtitle ||
										"Miniutbildningen täcker de viktigaste grunderna för att göra ett informerat val."}
								</p>
							</div>

							<Card className="border-primary/20">
								<CardContent className="p-8">
									<div className="grid gap-4 md:grid-cols-2">
										{learnings.map((learning, index) => (
											<div
												key={index}
												className="flex items-start gap-3"
											>
												<CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
												<span className="text-secondary">
													{learning}
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

			{/* Process Section */}
			{visibility.process && (
				<section className="py-16">
					<div className="_container">
						<div className="grid gap-8 lg:grid-cols-2 items-center">
							<div>
								<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
									<Zap className="h-4 w-4 text-primary" />
									<span className="text-sm font-semibold text-primary">
										{processSection.badge || "Snabb start"}
									</span>
								</div>
								<h2 className="text-3xl font-bold text-secondary mb-4">
									{processSection.title || "Så här går det till"}
								</h2>
								<p className="text-muted-foreground mb-6">
									{processSection.subtitle ||
										"Miniutbildningen är helt kostnadsfri och utan förpliktelser. Du bestämmer själv om du vill fortsätta samarbetet efter utbildningen."}
								</p>

								<div className="space-y-4">
									{processSteps.map((step, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
												{step.number}
											</div>
											<div>
												<h4 className="font-semibold text-secondary">
													{step.title}
												</h4>
												<p className="text-muted-foreground text-sm">
													{step.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl p-8 text-center">
								<Award className="h-16 w-16 text-primary mx-auto mb-4" />
								<h3 className="text-2xl font-bold text-secondary mb-2">
									{processSection.highlightTitle || "100% kostnadsfritt"}
								</h3>
								<p className="text-muted-foreground mb-6">
									{processSection.highlightSubtitle ||
										"Ingen förpliktelse att köpa. Lär dig grunderna och fatta sedan ditt eget beslut."}
								</p>
								<Button asChild size="lg" className="bg-primary text-white">
									<Link href={processSection.highlightButtonHref || "#kontakt"}>
										{processSection.highlightButtonText || "Boka din plats"}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Contact Form */}
			{visibility.contactForm && (
				<div id="kontakt">
					<ContactFormSection />
				</div>
			)}
		</div>
	);
}
