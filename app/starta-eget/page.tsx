import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Starta eget",
	description:
		"Drömmer du om frihet och framgång? Starta klinik med Synos! Vi hjälper dig med uppstart, inköp, utbildning och marknadsföring.",
	openGraph: {
		title: "Drömmer du om frihet och framgång? Starta klinik med Synos!",
		description:
			"Att starta och driva en egen hudvårdsklinik måste inte vara svårt och tidskrävande. Synos hjälper dig med uppstart, inköp och marknadsföring!",
	},
};

export default function StartaEgetPage() {
	return (
		<div className="container mx-auto px-4 py-12 page-padding-top">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
					Drömmer du om frihet och framgång?
					<br />
					<span className="text-secondary">Starta klinik med Synos!</span>
				</h1>
				<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
					Är du hudterapeut och funderar på att starta eget? Vill du vara
					din egen chef och kunna styra över dina arbetstider och sysslor
					på ett sätt som du inte kan idag? Funderar du på vad som krävs
					för att kunna förverkliga drömmen om en egen skönhetssalong eller
					klinik?
				</p>
				<p className="mx-auto mt-4 max-w-3xl text-xl font-semibold text-secondary">
					I så fall är Synos Medical rätt samarbetspartner för dig!
				</p>
			</div>

			{/* Main Content Section */}
			<section className="mb-20">
				<div className="mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
					<h2 className="mb-4 text-3xl font-bold">
						Vi hjälper dig att starta eget
					</h2>
					<h3 className="mb-4 text-xl font-semibold text-secondary">
						Drömmer du om att driva en egen hudvårdsklinik?
					</h3>
					<p className="mb-4 text-lg leading-relaxed">
						Med Synos Medical blir det enklare än du tror. Vi erbjuder
						marknadens bästa klinikutrustning inom bland annat: hudvård,
						fettreducering och hårborttagning. Tillsammans med den support
						och kunskap du behöver för att lyckas.
					</p>
					<p className="text-lg leading-relaxed">
						Tänk dig själv som egen företagare, med friheten att skapa din
						egen framgång. Vi hjälper dig hela vägen, från start till mål.
					</p>
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
								Personlig utbildning
							</h3>
							<p className="text-muted-foreground">
								En av våra erfarna experter lär dig allt om din nya
								maskin, steg för steg. Du får både teoretisk och
								praktisk utbildning så att du känner dig trygg och säker
								när du börjar behandla dina kunder.
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
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold">
								Helhetslösning
							</h3>
							<p className="text-muted-foreground">
								Vi hjälper dig med finansiering och försäkring, så att
								du kan fokusera på det viktiga – att bygga upp din
								klinik.
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
										d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold">
								Trygghet i alla lägen
							</h3>
							<p className="text-muted-foreground">
								Om något oväntat skulle hända med din utrustning står vi
								alltid redo att hjälpa dig med service och support.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Utbildning, finansiering och försäkring */}
			<section className="mb-20">
				<div className="rounded-lg border border-primary/20 bg-card p-8 md:p-12">
					<h2 className="mb-6 text-3xl font-bold">
						Utbildning, finansiering och försäkring
					</h2>
					<p className="mb-6 text-lg leading-relaxed text-muted-foreground">
						När du väljer en maskin från Synos Medical får du mer än bara
						utrustning. Vi ger dig all den kunskap och det stöd du behöver
						för att lyckas.
					</p>

					<div className="space-y-6">
						<div className="flex gap-4">
							<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
								<svg
									className="h-5 w-5 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="mb-2 text-lg font-semibold">
									Personlig utbildning
								</h3>
								<p className="text-muted-foreground">
									En av våra erfarna experter lär dig allt om din nya
									maskin, steg för steg. Du får både teoretisk och
									praktisk utbildning så att du känner dig trygg och
									säker när du börjar behandla dina kunder.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
								<svg
									className="h-5 w-5 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="mb-2 text-lg font-semibold">
									Helhetslösning
								</h3>
								<p className="text-muted-foreground">
									Vi hjälper dig med finansiering och försäkring, så
									att du kan fokusera på det viktiga – att bygga upp
									din klinik.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
								<svg
									className="h-5 w-5 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="mb-2 text-lg font-semibold">
									Trygghet i alla lägen
								</h3>
								<p className="text-muted-foreground">
									Om något oväntat skulle hända med din utrustning står
									vi alltid redo att hjälpa dig med service och
									support.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="mb-20 rounded-lg bg-gradient-to-r from-primary to-primary-hover p-12 text-center text-white">
				<h2 className="mb-4 text-3xl font-bold">
					Hör av dig till oss så berättar vi mer
				</h2>
				<p className="mb-8 text-lg opacity-90">
					Vill du veta mer om hur man startar en hudvårdssalong eller
					klinik ska du höra av dig till oss på Synos. Allra smidigast är
					att boka ett förutsättningslöst möte med någon av våra
					produktspecialister, som då snabbt kan få en tydligare bild av
					dina behov och önskemål.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Button asChild size="lg" variant="secondary">
						<Link href="/kontakt">Kontakta oss</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="border-white bg-white/10 text-white hover:bg-white/20"
					>
						<a href="tel:010-205 15 01">010-205 15 01</a>
					</Button>
				</div>
			</section>

			{/* Resources Grid */}
			<section>
				<div className="mb-8 text-center">
					<h2 className="mb-3 text-3xl font-bold">Resurser för dig</h2>
					<p className="text-muted-foreground">
						Utforska våra guider och utbildningar för att komma igång
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
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
								Köpguide för privatkunder
							</h3>
							<p className="mb-6 text-muted-foreground">
								Ladda ner vår köpguide för att påbörja din resa, boka
								sedan en kostnadsfri miniutbildning för att utöka din
								kunskap.
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
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
							<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
								Utbildning i världsklass
							</h3>
							<p className="mb-6 text-muted-foreground">
								Våra utbildningar är uppbyggda från grunden och
								innehåller allt som en verksamhet behöver.
							</p>
							<Button asChild className="w-full">
								<Link href="/utbildningar">Läs mer</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
