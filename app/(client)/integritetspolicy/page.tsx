import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Integritetspolicy",
	description:
		"Synos Medical AB:s integritetspolicy - information om hur vi behandlar dina personuppgifter enligt GDPR.",
	openGraph: {
		title: "Integritetspolicy - Synos Medical",
		description:
			"Läs om hur Synos Medical AB behandlar dina personuppgifter enligt GDPR.",
	},
};

export default function PrivacyPolicyPage() {
	return (
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			<div className="mb-12 text-center">
				<h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
					Integritetspolicy
				</h1>
				<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
					Information om hur vi behandlar dina personuppgifter
				</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Senast uppdaterad: December 2024
				</p>
			</div>

			{/* Main Content */}
			<div className="mx-auto max-w-4xl space-y-10">
				{/* Introduction */}
				<section>
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						1. Inledning
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Synos Medical AB (**org number goes here**
							{/* org.nr 556871-8075 */}) värnar om din personliga
							integritet. Denna integritetspolicy förklarar hur vi samlar
							in, använder, lagrar och skyddar dina personuppgifter i
							enlighet med EU:s dataskyddsförordning (GDPR).
						</p>
						<p>
							Vi är personuppgiftsansvariga för behandlingen av dina
							personuppgifter och ansvarar för att behandlingen sker i
							enlighet med tillämplig lagstiftning.
						</p>
					</div>
				</section>

				{/* What we collect */}
				<section className="rounded-lg bg-muted/50 p-6 sm:p-8">
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						2. Vilka personuppgifter samlar vi in?
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>Vi samlar in följande kategorier av personuppgifter:</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Kontaktuppgifter:</strong> Namn, e-postadress,
								telefonnummer och land
							</li>
							<li>
								<strong>Företagsuppgifter:</strong> Organisationsnummer
								(om tillämpligt)
							</li>
							<li>
								<strong>Förfrågningsuppgifter:</strong> Information om
								vilka produkter du är intresserad av och hur vi kan
								hjälpa dig
							</li>
							<li>
								<strong>Teknisk information:</strong> IP-adress,
								webbläsartyp och vilken sida du besökte när du skickade
								en förfrågan
							</li>
							<li>
								<strong>Samtyckesinformation:</strong> Tidpunkt och
								version för när du godkände vår integritetspolicy
							</li>
						</ul>
					</div>
				</section>

				{/* Why we collect */}
				<section>
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						3. Varför behandlar vi dina personuppgifter?
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>Vi behandlar dina personuppgifter för följande ändamål:</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Hantera förfrågningar:</strong> För att kunna
								svara på dina frågor och ge dig information om våra
								produkter och tjänster
							</li>
							<li>
								<strong>Kundkommunikation:</strong> För att kontakta dig
								med relevant information om dina förfrågningar
							</li>
							<li>
								<strong>Förbättra våra tjänster:</strong> För att
								analysera och förbättra vår webbplats och våra tjänster
							</li>
							<li>
								<strong>Lagkrav:</strong> För att uppfylla våra
								rättsliga förpliktelser
							</li>
						</ul>
					</div>
				</section>

				{/* Legal basis */}
				<section className="rounded-lg bg-secondary/5 p-6 sm:p-8">
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						4. Rättslig grund för behandling
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Vi behandlar dina personuppgifter baserat på följande
							rättsliga grunder:
						</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Samtycke:</strong> Du har gett ditt samtycke
								till behandlingen genom att godkänna vår
								integritetspolicy när du skickar en förfrågan
							</li>
							<li>
								<strong>Berättigat intresse:</strong> För att förbättra
								våra tjänster och skydda mot missbruk
							</li>
							<li>
								<strong>Rättslig förpliktelse:</strong> När vi måste
								behandla uppgifter för att uppfylla lagkrav
							</li>
						</ul>
					</div>
				</section>

				{/* Storage */}
				<section>
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						5. Hur länge sparar vi dina uppgifter?
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Vi sparar dina personuppgifter endast så länge det är
							nödvändigt för de ändamål för vilka de samlades in:
						</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Förfrågningar:</strong> Sparas i upp till 24
								månader efter senaste kontakt, eller tills du begär
								radering
							</li>
							<li>
								<strong>Teknisk information:</strong> Sparas i upp till
								12 månader för säkerhets- och analysändamål
							</li>
							<li>
								<strong>Bokföringsuppgifter:</strong> Sparas enligt
								gällande bokföringslagstiftning (normalt 7 år)
							</li>
						</ul>
					</div>
				</section>

				{/* Sharing */}
				<section className="rounded-lg bg-muted/50 p-6 sm:p-8">
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						6. Delning av personuppgifter
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Vi säljer aldrig dina personuppgifter. Vi kan dela dina
							uppgifter med:
						</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Tjänsteleverantörer:</strong> Företag som
								hjälper oss med IT-tjänster, hosting och e-post, och som
								är bundna av sekretessavtal
							</li>
							<li>
								<strong>Myndigheter:</strong> När vi är skyldiga enligt
								lag att lämna ut information
							</li>
						</ul>
						<p className="mt-4">
							Alla våra tjänsteleverantörer är bundna av
							personuppgiftsbiträdesavtal och får endast behandla dina
							uppgifter enligt våra instruktioner.
						</p>
					</div>
				</section>

				{/* Your rights */}
				<section>
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						7. Dina rättigheter
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>Enligt GDPR har du följande rättigheter:</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Rätt till tillgång:</strong> Du har rätt att få
								information om vilka personuppgifter vi behandlar om dig
							</li>
							<li>
								<strong>Rätt till rättelse:</strong> Du har rätt att få
								felaktiga uppgifter korrigerade
							</li>
							<li>
								<strong>Rätt till radering:</strong> Du har rätt att
								begära att vi raderar dina personuppgifter under vissa
								förutsättningar
							</li>
							<li>
								<strong>Rätt till begränsning:</strong> Du har rätt att
								begära att vi begränsar behandlingen av dina uppgifter
							</li>
							<li>
								<strong>Rätt till dataportabilitet:</strong> Du har rätt
								att få ut dina uppgifter i ett maskinläsbart format
							</li>
							<li>
								<strong>Rätt att återkalla samtycke:</strong> Du kan när
								som helst återkalla ditt samtycke till behandling
							</li>
							<li>
								<strong>Rätt att invända:</strong> Du har rätt att
								invända mot viss behandling av dina personuppgifter
							</li>
						</ul>
						<p className="mt-4">
							För att utöva dina rättigheter, kontakta oss på{" "}
							<a
								href="mailto:info@synosmedical.se"
								className="text-primary hover:underline"
							>
								info@synosmedical.se
							</a>
						</p>
					</div>
				</section>

				{/* Security */}
				<section className="rounded-lg bg-secondary/5 p-6 sm:p-8">
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						8. Säkerhet
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Vi vidtar lämpliga tekniska och organisatoriska
							säkerhetsåtgärder för att skydda dina personuppgifter mot
							obehörig åtkomst, ändring, spridning eller förstöring:
						</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>Krypterad dataöverföring (SSL/TLS)</li>
							<li>Säker lagring med begränsad åtkomst</li>
							<li>Regelbunden säkerhetsgranskning</li>
							<li>Utbildning av personal i dataskydd</li>
						</ul>
					</div>
				</section>

				{/* Cookies */}
				<section>
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						9. Cookies
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Vår webbplats använder cookies för att förbättra din
							upplevelse. Cookies är små textfiler som lagras på din
							enhet. Vi använder:
						</p>
						<ul className="ml-6 list-disc space-y-2">
							<li>
								<strong>Nödvändiga cookies:</strong> Krävs för
								webbplatsens grundläggande funktioner
							</li>
							<li>
								<strong>Analyscookies:</strong> Hjälper oss förstå hur
								besökare använder webbplatsen
							</li>
						</ul>
						<p className="mt-4">
							Du kan hantera dina cookieinställningar i din webbläsare.
						</p>
					</div>
				</section>

				{/* Contact */}
				<section className="rounded-lg bg-muted/50 p-6 sm:p-8">
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						10. Kontakta oss
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Om du har frågor om denna integritetspolicy eller vår
							behandling av dina personuppgifter, kontakta oss:
						</p>
						<div className="mt-4 space-y-2">
							<p>
								<strong>Synos Medical AB</strong>
							</p>
							<p>Organisationsnummer: 556871-8075</p>
							<p>
								E-post:{" "}
								<a
									href="mailto:info@synosmedical.se"
									className="text-primary hover:underline"
								>
									info@synosmedical.se
								</a>
							</p>
							<p>
								Telefon:{" "}
								<a
									href="tel:010-205 15 01"
									className="text-primary hover:underline"
								>
									010-205 15 01
								</a>
							</p>
							<p>Stockholm: Turebergsvägen 5, 191 47 Sollentuna</p>
							<p>Linköping: Datalinjen 5, 582 78 Linköping</p>
						</div>
					</div>
				</section>

				{/* Complaints */}
				{/* <section>
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						11. Klagomål
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Om du anser att vi behandlar dina personuppgifter i strid
							med GDPR har du rätt att lämna in ett klagomål till
							Integritetsskyddsmyndigheten (IMY):
						</p>
						<div className="mt-4 space-y-2">
							<p>
								<strong>Integritetsskyddsmyndigheten</strong>
							</p>
							<p>Box 8114, 104 20 Stockholm</p>
							<p>
								Webbplats:{" "}
								<a
									href="https://www.imy.se"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									www.imy.se
								</a>
							</p>
						</div>
					</div>
				</section> */}

				{/* Changes */}
				<section className="rounded-lg bg-secondary/5 p-6 sm:p-8">
					<h2 className="mb-4 text-2xl font-bold text-secondary">
						12. Ändringar i integritetspolicyn
					</h2>
					<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
						<p>
							Vi kan komma att uppdatera denna integritetspolicy. Vid
							väsentliga ändringar kommer vi att meddela dig via e-post
							eller genom en tydlig notis på vår webbplats. Den senaste
							versionen finns alltid tillgänglig på denna sida.
						</p>
					</div>
				</section>

				{/* CTA */}
				<section className="mt-12 text-center">
					<p className="mb-6 text-lg text-muted-foreground">
						Har du frågor om hur vi hanterar dina personuppgifter?
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button asChild size="lg">
							<Link href="/kontakt">Kontakta oss</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<a href="mailto:info@synosmedical.se">
								info@synosmedical.se
							</a>
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
}
