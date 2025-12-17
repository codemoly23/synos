import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Shield,
	FileText,
	Scale,
	Cookie,
	Mail,
	Phone,
	MapPin,
	ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Juridisk Information | Synos Medical",
	description:
		"Juridisk information om Synos Medical AB - integritetspolicy, villkor, GDPR och cookies.",
	openGraph: {
		title: "Juridisk Information - Synos Medical",
		description:
			"Läs om våra juridiska villkor, integritetspolicy och hur vi hanterar dina personuppgifter.",
	},
};

const legalSections = [
	{
		icon: Shield,
		title: "Integritetspolicy",
		description:
			"Information om hur vi samlar in, behandlar och skyddar dina personuppgifter enligt GDPR.",
		href: "/integritetspolicy",
		highlights: [
			"GDPR-kompatibel behandling",
			"Dina rättigheter",
			"Säkerhetsåtgärder",
		],
	},
	{
		icon: Cookie,
		title: "Cookies",
		description:
			"Vi använder cookies för att förbättra din upplevelse på vår webbplats.",
		href: "/integritetspolicy#cookies",
		highlights: [
			"Nödvändiga cookies",
			"Analyscookies",
			"Hantera inställningar",
		],
	},
	{
		icon: FileText,
		title: "Allmänna Villkor",
		description:
			"Villkor för användning av våra tjänster och produkter.",
		href: "#allmanna-villkor",
		highlights: [
			"Leveransvillkor",
			"Garantier",
			"Reklamationsrätt",
		],
	},
	{
		icon: Scale,
		title: "Företagsinformation",
		description:
			"Officiell information om Synos Medical AB som juridisk person.",
		href: "#foretagsinformation",
		highlights: [
			"Organisationsnummer",
			"Registrerade adresser",
			"Kontaktuppgifter",
		],
	},
];

export default function JuridiskInformationPage() {
	return (
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			<div className="mb-12 text-center">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
					<Scale className="h-4 w-4 text-primary" />
					<span className="text-sm font-medium text-primary">
						Juridisk Information
					</span>
				</div>
				<h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
					Juridisk Information
				</h1>
				<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
					Här hittar du all juridisk information om Synos Medical AB,
					inklusive integritetspolicy, villkor och företagsinformation.
				</p>
			</div>

			{/* Legal Sections Grid */}
			<div className="mx-auto max-w-5xl">
				<div className="grid gap-6 md:grid-cols-2">
					{legalSections.map((section) => {
						const Icon = section.icon;
						const isExternal = section.href.startsWith("#");

						return (
							<div
								key={section.title}
								className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
							>
								<div className="mb-4 flex items-start justify-between">
									<div className="rounded-lg bg-primary/10 p-3">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									{!isExternal && (
										<Link
											href={section.href}
											className="flex items-center gap-1 text-sm text-primary hover:underline"
										>
											Läs mer
											<ExternalLink className="h-3 w-3" />
										</Link>
									)}
								</div>
								<h3 className="mb-2 text-xl font-bold text-secondary">
									{section.title}
								</h3>
								<p className="mb-4 text-muted-foreground">
									{section.description}
								</p>
								<ul className="space-y-1">
									{section.highlights.map((highlight) => (
										<li
											key={highlight}
											className="flex items-center gap-2 text-sm text-muted-foreground"
										>
											<span className="h-1.5 w-1.5 rounded-full bg-primary" />
											{highlight}
										</li>
									))}
								</ul>
							</div>
						);
					})}
				</div>
			</div>

			{/* Company Information Section */}
			<section id="foretagsinformation" className="mx-auto mt-16 max-w-4xl">
				<h2 className="mb-8 text-center text-3xl font-bold text-secondary">
					Företagsinformation
				</h2>
				<div className="rounded-xl border border-border bg-card p-8">
					<div className="grid gap-8 md:grid-cols-2">
						<div>
							<h3 className="mb-4 text-xl font-bold text-secondary">
								Synos Medical AB
							</h3>
							<div className="space-y-3 text-muted-foreground">
								<p>
									<span className="font-medium text-foreground">
										Organisationsnummer:
									</span>{" "}
									556871-8075
								</p>
								<p>
									<span className="font-medium text-foreground">
										Momsregistreringsnummer:
									</span>{" "}
									SE556871807501
								</p>
								<p>
									<span className="font-medium text-foreground">
										Registrerat säte:
									</span>{" "}
									Sollentuna
								</p>
							</div>
						</div>
						<div>
							<h3 className="mb-4 text-xl font-bold text-secondary">
								Kontorsadresser
							</h3>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<MapPin className="mt-1 h-5 w-5 text-primary" />
									<div>
										<p className="font-medium text-foreground">
											Stockholm (Huvudkontor)
										</p>
										<p className="text-muted-foreground">
											Turebergsvägen 5, 191 47 Sollentuna
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="mt-1 h-5 w-5 text-primary" />
									<div>
										<p className="font-medium text-foreground">
											Linköping
										</p>
										<p className="text-muted-foreground">
											Datalinjen 5, 582 78 Linköping
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-8 border-t border-border pt-8">
						<h3 className="mb-4 text-xl font-bold text-secondary">
							Kontaktuppgifter
						</h3>
						<div className="flex flex-wrap gap-6">
							<a
								href="mailto:info@synosmedical.se"
								className="flex items-center gap-2 text-primary hover:underline"
							>
								<Mail className="h-5 w-5" />
								info@synosmedical.se
							</a>
							<a
								href="tel:010-205 15 01"
								className="flex items-center gap-2 text-primary hover:underline"
							>
								<Phone className="h-5 w-5" />
								010-205 15 01
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Terms Section */}
			<section id="allmanna-villkor" className="mx-auto mt-16 max-w-4xl">
				<h2 className="mb-8 text-center text-3xl font-bold text-secondary">
					Allmänna Villkor
				</h2>
				<div className="space-y-6">
					<div className="rounded-xl border border-border bg-card p-6">
						<h3 className="mb-3 text-lg font-bold text-secondary">
							1. Leveransvillkor
						</h3>
						<p className="text-muted-foreground">
							Leverans av utrustning sker enligt överenskommelse mellan
							Synos Medical AB och kunden. Leveranstider kan variera
							beroende på produkttillgänglighet och logistiska faktorer.
							Alla leveranser inkluderar installation och grundläggande
							utbildning om inget annat avtalats.
						</p>
					</div>
					<div className="rounded-xl border border-border bg-card p-6">
						<h3 className="mb-3 text-lg font-bold text-secondary">
							2. Garanti
						</h3>
						<p className="text-muted-foreground">
							Våra produkter levereras med tillverkarens garanti.
							Garantitiden och villkoren varierar beroende på produkt.
							Detaljerad garantiinformation lämnas vid köp. Garantin
							omfattar inte skador orsakade av felaktig användning eller
							bristande underhåll.
						</p>
					</div>
					<div className="rounded-xl border border-border bg-card p-6">
						<h3 className="mb-3 text-lg font-bold text-secondary">
							3. Service och Support
						</h3>
						<p className="text-muted-foreground">
							Synos Medical AB erbjuder omfattande service och support
							för all utrustning. Serviceavtal kan tecknas för
							regelbundet underhåll och prioriterad support. Kontakta
							oss för mer information om servicealternativ.
						</p>
					</div>
					<div className="rounded-xl border border-border bg-card p-6">
						<h3 className="mb-3 text-lg font-bold text-secondary">
							4. Ansvarsbegränsning
						</h3>
						<p className="text-muted-foreground">
							Synos Medical AB ansvarar inte för indirekta skador eller
							följdskador. Vårt ansvar är begränsat till värdet av den
							levererade produkten eller tjänsten. All medicinsk
							utrustning ska användas av utbildad personal enligt
							gällande föreskrifter och tillverkarens instruktioner.
						</p>
					</div>
					<div className="rounded-xl border border-border bg-card p-6">
						<h3 className="mb-3 text-lg font-bold text-secondary">
							5. Tvistlösning
						</h3>
						<p className="text-muted-foreground">
							Tvister som uppstår i anledning av avtal med Synos Medical
							AB ska i första hand lösas genom förhandling. Om parterna
							inte kan enas ska tvisten avgöras av svensk domstol med
							tillämpning av svensk rätt.
						</p>
					</div>
				</div>
			</section>

			{/* GDPR Rights Summary */}
			<section className="mx-auto mt-16 max-w-4xl">
				<div className="rounded-xl bg-primary/5 p-8">
					<h2 className="mb-6 text-2xl font-bold text-secondary">
						Dina rättigheter enligt GDPR
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex items-start gap-3">
							<div className="rounded-full bg-primary/10 p-2">
								<Shield className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="font-medium text-foreground">
									Rätt till information
								</p>
								<p className="text-sm text-muted-foreground">
									Du har rätt att veta vilka uppgifter vi har om dig
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="rounded-full bg-primary/10 p-2">
								<Shield className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="font-medium text-foreground">
									Rätt till rättelse
								</p>
								<p className="text-sm text-muted-foreground">
									Du kan begära att felaktiga uppgifter korrigeras
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="rounded-full bg-primary/10 p-2">
								<Shield className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="font-medium text-foreground">
									Rätt till radering
								</p>
								<p className="text-sm text-muted-foreground">
									Du kan begära att vi raderar dina uppgifter
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="rounded-full bg-primary/10 p-2">
								<Shield className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="font-medium text-foreground">
									Rätt att invända
								</p>
								<p className="text-sm text-muted-foreground">
									Du kan invända mot viss behandling av dina uppgifter
								</p>
							</div>
						</div>
					</div>
					<div className="mt-6 flex flex-wrap gap-4">
						<Button asChild>
							<Link href="/integritetspolicy">
								Läs fullständig integritetspolicy
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/kontakt">Kontakta oss</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="mt-16 text-center">
				<p className="mb-6 text-lg text-muted-foreground">
					Har du frågor om våra juridiska villkor eller hur vi hanterar
					dina uppgifter?
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Button asChild size="lg">
						<Link href="/kontakt">Kontakta oss</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<a href="mailto:info@synosmedical.se">info@synosmedical.se</a>
					</Button>
				</div>
			</section>
		</div>
	);
}
