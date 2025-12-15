import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../../starta-eget/_components/contact-form-section";
import {
	Briefcase,
	MapPin,
	Clock,
	Users,
	ArrowRight,
	Heart,
	Sparkles,
	Building2,
	GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Lediga Tjänster | Synos Medical",
	description:
		"Bli en del av Synos Medical-teamet. Se våra lediga tjänster och ansök idag. Vi söker engagerade medarbetare som vill växa med oss.",
	openGraph: {
		title: "Karriär hos Synos Medical | Lediga Tjänster",
		description:
			"Bli en del av Synos Medical-teamet. Se våra lediga tjänster och ansök idag.",
	},
};

const benefits = [
	{
		icon: Heart,
		title: "Hälsoförmåner",
		description: "Friskvårdsbidrag och hälsoförsäkring för alla anställda.",
	},
	{
		icon: GraduationCap,
		title: "Utbildning",
		description: "Kontinuerlig kompetensutveckling och karriärmöjligheter.",
	},
	{
		icon: Users,
		title: "Fantastiskt team",
		description: "Arbeta med passionerade kollegor i en positiv miljö.",
	},
	{
		icon: Building2,
		title: "Moderna kontor",
		description: "Välutrustat showroom och kontor i Stockholm och Linköping.",
	},
];

const values = [
	"Vi sätter kunden först i allt vi gör",
	"Vi tror på öppenhet och ärlig kommunikation",
	"Vi strävar efter excellens i varje detalj",
	"Vi värdesätter lagarbete och stöttar varandra",
	"Vi omfamnar förändring och innovation",
];

// Example job openings - in a real app, these would come from a CMS or database
const jobOpenings = [
	{
		title: "Säljare / Account Manager",
		location: "Stockholm",
		type: "Heltid",
		description:
			"Vi söker en driven säljare med erfarenhet av B2B-försäljning inom medicinteknik eller skönhetsbranschen.",
	},
	{
		title: "Servicetekniker",
		location: "Linköping",
		type: "Heltid",
		description:
			"Som servicetekniker ansvarar du för installation, service och reparation av våra lasermaskiner.",
	},
	{
		title: "Utbildare / Applikationsspecialist",
		location: "Stockholm / Remote",
		type: "Heltid",
		description:
			"Vi söker en utbildare med bakgrund inom hudvård eller estetisk medicin för att utbilda våra kunder.",
	},
];

export default function LedigaTjansterPage() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-slate-100 to-white pt-32 pb-16">
				<div className="_container">
					<Breadcrumb
						items={[
							{ label: "Om Oss", href: "/om-oss" },
							{ label: "Lediga Tjänster" },
						]}
					/>

					<div className="mt-8 max-w-4xl">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
							<Briefcase className="h-4 w-4 text-primary" />
							<span className="text-sm font-semibold text-primary">
								Karriär hos Synos
							</span>
						</div>

						<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
							Bli en del av{" "}
							<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								vårt team
							</span>
						</h1>

						<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
							Vi är alltid på jakt efter talangfulla och engagerade
							medarbetare som delar vår passion för att hjälpa kliniker
							att lyckas. Utforska våra lediga tjänster och ta nästa steg
							i din karriär.
						</p>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-16">
				<div className="_container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-secondary mb-4">
							Varför jobba hos oss?
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Vi erbjuder en stimulerande arbetsmiljö med goda
							utvecklingsmöjligheter.
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{benefits.map((benefit, index) => (
							<Card
								key={index}
								className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
							>
								<CardContent className="p-6 text-center">
									<div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
										<benefit.icon className="h-6 w-6 text-primary" />
									</div>
									<h3 className="mb-2 text-lg font-bold text-secondary">
										{benefit.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{benefit.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Open Positions Section */}
			<section className="py-16 bg-secondary/5">
				<div className="_container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-secondary mb-4">
							Lediga tjänster
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Hittar du inte en tjänst som passar? Skicka gärna en
							spontanansökan via formuläret nedan.
						</p>
					</div>

					{jobOpenings.length > 0 ? (
						<div className="grid gap-6 max-w-4xl mx-auto">
							{jobOpenings.map((job, index) => (
								<Card
									key={index}
									className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
								>
									<CardContent className="p-6">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
											<div>
												<h3 className="text-xl font-bold text-secondary mb-2">
													{job.title}
												</h3>
												<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
													<span className="flex items-center gap-1">
														<MapPin className="h-4 w-4" />
														{job.location}
													</span>
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{job.type}
													</span>
												</div>
												<p className="text-muted-foreground">
													{job.description}
												</p>
											</div>
											<Button
												asChild
												className="shrink-0 bg-primary text-white"
											>
												<a href="#ansok">
													Ansök nu
													<ArrowRight className="ml-2 h-4 w-4" />
												</a>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
							<p className="text-lg text-muted-foreground">
								Just nu har vi inga öppna tjänster, men skicka gärna en
								spontanansökan!
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16">
				<div className="_container">
					<div className="max-w-3xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-secondary mb-4">
								Våra värderingar
							</h2>
							<p className="text-muted-foreground">
								Det här är vad som driver oss varje dag.
							</p>
						</div>

						<Card className="border-primary/20">
							<CardContent className="p-8">
								<div className="space-y-4">
									{values.map((value, index) => (
										<div
											key={index}
											className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
										>
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
												{index + 1}
											</div>
											<span className="text-secondary font-medium">
												{value}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Application Form */}
			<div id="ansok">
				<ContactFormSection />
			</div>
		</div>
	);
}
