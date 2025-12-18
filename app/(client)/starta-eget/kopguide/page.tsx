import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../_components/contact-form-section";
import {
	BookOpen,
	CheckCircle,
	FileText,
	ArrowRight,
	Target,
	Lightbulb,
	Scale,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Köpguide | Synos Medical",
	description:
		"Din kompletta guide till att köpa rätt klinikutrustning. Lär dig vad du ska tänka på innan du investerar i lasermaskiner och medicinsk utrustning.",
	openGraph: {
		title: "Köpguide för klinikutrustning | Synos Medical",
		description:
			"Din kompletta guide till att köpa rätt klinikutrustning. Lär dig vad du ska tänka på innan du investerar.",
	},
};

const guideSteps = [
	{
		number: "01",
		icon: Target,
		title: "Definiera dina mål",
		description:
			"Börja med att definiera vilka behandlingar du vill erbjuda och vilken målgrupp du vänder dig till. Detta hjälper dig att välja rätt utrustning.",
	},
	{
		number: "02",
		icon: Lightbulb,
		title: "Utforska alternativ",
		description:
			"Undersök olika maskiner och teknologier. Jämför specifikationer, behandlingsområden och långsiktiga kostnader.",
	},
	{
		number: "03",
		icon: Scale,
		title: "Jämför leverantörer",
		description:
			"Utvärdera leverantörer baserat på produktkvalitet, utbildning, support och servicenivå. Certifieringar som MDR är avgörande.",
	},
	{
		number: "04",
		icon: FileText,
		title: "Planera finansiering",
		description:
			"Utforska finansieringsalternativ som leasing eller avbetalning. En bra leverantör hjälper dig med detta.",
	},
];

const checklist = [
	"Är produkten MDR-certifierad?",
	"Vilken utbildning ingår vid köp?",
	"Hur ser serviceavtalet ut?",
	"Finns det garanti och försäkringsmöjligheter?",
	"Vilken support erbjuds efter köp?",
	"Finns det referenskunder jag kan kontakta?",
	"Hur lång är leveranstiden?",
	"Vilka finansieringsalternativ finns?",
];

export default function KopguidePage() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
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
								Köpguide
							</span>
						</div>

						<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
							Din guide till rätt{" "}
							<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								klinikutrustning
							</span>
						</h1>

						<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
							Att investera i klinikutrustning är ett stort beslut. Den
							här guiden hjälper dig att navigera processen och göra ett
							välgrundat val.
						</p>
					</div>
				</div>
			</section>

			{/* Guide Steps Section */}
			<section className="py-16">
				<div className="_container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-secondary mb-4">
							4 steg till rätt beslut
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Följ dessa steg för att säkerställa att du väljer rätt
							utrustning för din verksamhet.
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						{guideSteps.map((step, index) => (
							<Card
								key={index}
								className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
							>
								<CardContent className="p-8">
									<div className="flex items-start gap-4">
										<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
											<step.icon className="h-7 w-7 text-primary" />
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
						))}
					</div>
				</div>
			</section>

			{/* Checklist Section */}
			<section className="py-16 bg-secondary/5">
				<div className="_container">
					<div className="max-w-3xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-secondary mb-4">
								Checklista vid köp
							</h2>
							<p className="text-muted-foreground">
								Använd den här checklistan när du utvärderar leverantörer
								och produkter.
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

			{/* CTA Section */}
			<section className="py-16">
				<div className="_container">
					<div className="bg-linear-to-br from-secondary to-secondary/90 rounded-3xl p-8 md:p-12 text-center">
						<h2 className="text-3xl font-bold text-white mb-4">
							Vill du veta mer?
						</h2>
						<p className="text-white/80 mb-8 max-w-2xl mx-auto">
							Boka en kostnadsfri konsultation med en av våra experter.
							Vi hjälper dig att hitta den perfekta lösningen för din
							klinik.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary/90 text-white"
							>
								<Link href="/kontakt">
									Boka konsultation
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="border-white text-white hover:bg-white hover:text-secondary"
							>
								<Link href="/starta-eget/miniutbildning">
									Kostnadsfri miniutbildning
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form */}
			<ContactFormSection />
		</div>
	);
}
