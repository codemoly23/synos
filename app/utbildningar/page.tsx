import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
	title: "Utbildningar",
	description:
		"När du köper maskin hos oss ingår även flera dagar utbildning - helt skräddarsydd efter dina förutsättningar, förkunskaper och behov!",
	openGraph: {
		title: "Synos Utbildningar - Vi utbildar dig i samband med köp av maskin",
		description:
			"När du köper maskin hos oss ingår även flera dagar utbildning - helt skräddarsydd efter dina förutsättningar, förkunskaper och behov!",
	},
};

export default function UtbildningarPage() {
	return (
		<div className="container mx-auto px-4 py-12">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
					Vi ser till att du kan använda vår utrustning{" "}
					<span className="text-secondary">på rätt sätt</span>
				</h1>
				<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
					Vi på Synos Medical erbjuder avancerad och kraftfull utrustning
					som kan användas för många olika behandlingar och åtgärder, under
					förutsättningen att utrustningen används på rätt sätt. Vi på
					Synos vill naturligtvis säkerställa att vår utrustning utnyttjas
					på bästa möjliga sätt. Därför erbjuder vi utbildningar som är
					specifikt upplagda för våra olika maskiner.
				</p>
			</div>

			{/* Main Content Section */}
			<section className="mb-20">
				<div className="mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
					<h2 className="mb-6 text-3xl font-bold">
						Alltid anpassad utbildning
					</h2>
					<div className="space-y-4 text-lg leading-relaxed">
						<p>
							Vi är väl medvetna om att vår utrustning används av
							personer med väldigt olika bakgrunder, erfarenheter och
							kunskaper. Därför ser vi alltid till att skräddarsy
							utbildningen efter deltagarnas förutsättningar och behov.
						</p>
						<p>
							Vi går inte bara igenom själva användandet av den specifika
							maskinen utan även andra aspekter, exempelvis maskinlära
							och patientsäkerhet. Utbildningens längd kan variera mellan{" "}
							<strong>två till fem dagar</strong>.
						</p>
						<p>
							Sex månader efter den inledande utbildningen erbjuder vi en{" "}
							<strong>fördjupande utbildning</strong> inom respektive
							behandlingsområde. När deltagarna har genomgått en
							teoretisk och praktisk utbildning samt klarat av ett
							skriftligt test så kan de certifieras som{" "}
							<strong>Synos terapeut</strong>.
						</p>
					</div>
				</div>

				{/* Benefits Grid */}
				<div className="mb-12 grid gap-8 md:grid-cols-3">
					<Card className="border-primary/20">
						<CardContent className="p-8">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10">
								<svg
									className="h-8 w-8 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold">
								Teoretisk & Praktisk Utbildning
							</h3>
							<p className="text-muted-foreground">
								Omfattande utbildning som täcker både teori och praktik.
								Du lär dig maskinlära, patientsäkerhet och
								behandlingsmetoder.
							</p>
						</CardContent>
					</Card>

					<Card className="border-primary/20">
						<CardContent className="p-8">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10">
								<svg
									className="h-8 w-8 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold">
								Certifiering som Synos Terapeut
							</h3>
							<p className="text-muted-foreground">
								Efter genomgången utbildning och godkänt skriftligt test
								blir du certifierad Synos terapeut med full kompetens.
							</p>
						</CardContent>
					</Card>

					<Card className="border-primary/20">
						<CardContent className="p-8">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10">
								<svg
									className="h-8 w-8 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold">
								Livstids Support
							</h3>
							<p className="text-muted-foreground">
								Alla kunder som klarar av hela vår utbildning erbjuds
								livstids support. Vi finns alltid nära till hands för
								att svara på frågor eller lösa situationer.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Training Process Section */}
			<section className="mb-20">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-bold">Utbildningsprocessen</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground">
						Vår utbildning är uppbyggd för att ge dig bästa möjliga
						förutsättningar att lyckas med din nya utrustning
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					<div className="relative">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
							<span className="text-xl font-bold">1</span>
						</div>
						<h3 className="mb-2 text-lg font-semibold">
							Initial Utbildning
						</h3>
						<p className="text-sm text-muted-foreground">
							2-5 dagars intensiv utbildning anpassad efter dina
							förutsättningar och behov.
						</p>
					</div>

					<div className="relative">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
							<span className="text-xl font-bold">2</span>
						</div>
						<h3 className="mb-2 text-lg font-semibold">
							Praktisk Träning
						</h3>
						<p className="text-sm text-muted-foreground">
							Hands-on träning med din specifika maskin under handledning
							av våra experter.
						</p>
					</div>

					<div className="relative">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
							<span className="text-xl font-bold">3</span>
						</div>
						<h3 className="mb-2 text-lg font-semibold">Fördjupning</h3>
						<p className="text-sm text-muted-foreground">
							Efter 6 månader erbjuds fördjupande utbildning inom ditt
							behandlingsområde.
						</p>
					</div>

					<div className="relative">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
							<span className="text-xl font-bold">4</span>
						</div>
						<h3 className="mb-2 text-lg font-semibold">Certifiering</h3>
						<p className="text-sm text-muted-foreground">
							Genomför skriftligt test och bli certifierad Synos
							terapeut.
						</p>
					</div>
				</div>
			</section>

			{/* Support Section */}
			<section className="mb-20">
				<div className="rounded-lg border border-primary/20 bg-card p-8 md:p-12">
					<div className="grid gap-8 md:grid-cols-2">
						<div>
							<h2 className="mb-4 text-2xl font-bold">
								Support när du behöver det
							</h2>
							<p className="mb-4 text-muted-foreground">
								Du som kund får bland annat tillgång till vårt
								journummer för att alltid kunna nå oss, oavsett vilken
								tid på dygnet ni ringer.
							</p>
							<p className="mb-6 text-muted-foreground">
								Låt oss hjälpa dig att använda den utrustning du köper
								på ett säkert och effektivt sätt, inte bara för
								företaget och personalens skull utan även för att
								patienterna ska kunna känna sig säkra och få det
								resultat som de önskar.
							</p>
							<div className="flex flex-wrap gap-4">
								<Button asChild>
									<a href="tel:010-205 15 01">010-205 15 01</a>
								</Button>
								<Button asChild variant="outline">
									<a href="mailto:info@synos.se">info@synos.se</a>
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<div className="rounded-lg bg-secondary/10 p-8">
								<svg
									className="h-32 w-32 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			<section className="mb-20">
				<div className="mx-auto max-w-3xl">
					<div className="mb-8 text-center">
						<h2 className="mb-4 text-3xl font-bold">Kontakta oss</h2>
						<p className="text-muted-foreground">
							Har du frågor om våra utbildningar? Fyll i formuläret nedan
							så hör vi av oss till dig.
						</p>
					</div>
					<Card>
						<CardContent className="p-8">
							<ContactForm />
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Resources Grid */}
			<section>
				<div className="mb-8 text-center">
					<h2 className="mb-3 text-3xl font-bold">Relaterade resurser</h2>
					<p className="text-muted-foreground">
						Utforska mer om hur vi kan hjälpa dig
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					<Card className="group overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-xl">
						<CardContent className="p-8">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10 transition-colors group-hover:bg-secondary/20">
								<svg
									className="h-8 w-8 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
								Miniutbildning
							</h3>
							<p className="mb-6 text-muted-foreground">
								Få kunskapen att välja rätt laser. Vår kostnadsfria
								miniutbildning ger dig verktygen att jämföra olika
								modeller på marknaden och fatta ett välgrundat beslut.
							</p>
							<Button asChild className="w-full">
								<Link href="/starta-eget/miniutbildning">Läs mer</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="group overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-xl">
						<CardContent className="p-8">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10 transition-colors group-hover:bg-secondary/20">
								<svg
									className="h-8 w-8 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
								Hitta rätt utrustning
							</h3>
							<p className="mb-6 text-muted-foreground">
								Vi hjälper dig att hitta rätt utrustning! Ladda ner vår
								köpguide eller kontakta oss direkt för en kostnadsfri
								miniutbildning.
							</p>
							<Button asChild className="w-full">
								<Link href="/starta-eget/kopguide">Läs mer</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="group overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-xl">
						<CardContent className="p-8">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10 transition-colors group-hover:bg-secondary/20">
								<svg
									className="h-8 w-8 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
								Hjälp att starta eget
							</h3>
							<p className="mb-6 text-muted-foreground">
								Har du en dröm att starta eget men saknar kunskapen att
								genomföra din dröm? Vi guidar dig steg för steg.
							</p>
							<Button asChild className="w-full">
								<Link href="/starta-eget">Läs mer</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
