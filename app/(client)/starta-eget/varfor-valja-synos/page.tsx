import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../_components/contact-form-section";
import {
	Shield,
	Award,
	Users,
	HeartHandshake,
	Sparkles,
	CheckCircle,
	ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Varför välja Synos? | Synos Medical",
	description:
		"Upptäck varför Synos Medical är rätt val för din klinik. MDR-certifierad utrustning, världsledande utbildning och livstids support.",
	openGraph: {
		title: "Varför välja Synos Medical?",
		description:
			"Upptäck varför Synos Medical är rätt val för din klinik. MDR-certifierad utrustning, världsledande utbildning och livstids support.",
	},
};

const reasons = [
	{
		icon: Shield,
		title: "MDR-certifierad utrustning",
		description:
			"Alla våra produkter är certifierade enligt EU:s medicintekniska förordning (MDR), vilket garanterar högsta säkerhet och kvalitet.",
	},
	{
		icon: Award,
		title: "Världsledande varumärken",
		description:
			"Vi är stolta representanter för DEKA, en av världens ledande tillverkare av medicinska lasrar med över 50 års erfarenhet.",
	},
	{
		icon: Users,
		title: "Personlig utbildning",
		description:
			"Varje kund får skräddarsydd utbildning av våra certifierade experter. Vi säkerställer att du känner dig trygg och säker.",
	},
	{
		icon: HeartHandshake,
		title: "Livstids support",
		description:
			"Vi är med dig hela vägen. Vår support är alltid tillgänglig för att hjälpa dig med frågor och felsökning.",
	},
];

const benefits = [
	"Service inom 48 arbetstimmar",
	"Kostnadsfri konsultation",
	"Finansieringslösningar",
	"Försäkringsalternativ",
	"Marknadsföringsstöd",
	"Nätverksmöjligheter",
];

export default function VarforValjaSynosPage() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
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
								Din partner för framgång
							</span>
						</div>

						<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
							Varför välja{" "}
							<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								Synos Medical?
							</span>
						</h1>

						<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
							Vi är mer än en leverantör – vi är din partner på resan mot
							en framgångsrik klinik. Med över 15 års erfarenhet och
							hundratals nöjda kunder vet vi vad som krävs för att lyckas.
						</p>
					</div>
				</div>
			</section>

			{/* Main Reasons Section */}
			<section className="py-16">
				<div className="_container">
					<div className="grid gap-8 md:grid-cols-2">
						{reasons.map((reason, index) => (
							<Card
								key={index}
								className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
							>
								<CardContent className="p-8">
									<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
										<reason.icon className="h-7 w-7 text-primary" />
									</div>
									<h3 className="mb-3 text-xl font-bold text-secondary">
										{reason.title}
									</h3>
									<p className="text-muted-foreground">
										{reason.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-16 bg-secondary/5">
				<div className="_container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-secondary mb-4">
							Fördelar med att välja Synos
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Som kund hos Synos Medical får du tillgång till ett komplett
							ekosystem av tjänster och support.
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

			{/* CTA Section */}
			<section className="py-16">
				<div className="_container">
					<div className="bg-linear-to-br from-secondary to-secondary/90 rounded-3xl p-8 md:p-12 text-center">
						<h2 className="text-3xl font-bold text-white mb-4">
							Redo att ta nästa steg?
						</h2>
						<p className="text-white/80 mb-8 max-w-2xl mx-auto">
							Kontakta oss idag för en kostnadsfri konsultation. Vi
							hjälper dig att hitta rätt lösning för din verksamhet.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary/90 text-white"
							>
								<Link href="/kontakt">
									Kontakta oss
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="border-white text-white hover:bg-white hover:text-secondary"
							>
								<Link href="/utrustning">Se vår utrustning</Link>
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
