import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien. Med kunden i fokus och utbildning i världsklass.",
  openGraph: {
    title: "Om oss - Synos Medical",
    description:
      "Professionell leverantör av medicinsk laserutrustning med kunden i fokus. Utbildning, service och support i världsklass.",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Om Synos Medical
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Sveriges främsta leverantör av medicinsk laserutrustning med kunden i
          fokus
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Professionell leverantör */}
        <section>
          <h2 className="mb-4 text-3xl font-bold text-primary">
            Professionell leverantör
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Synos Medical erbjuder professionella lasermaskiner och utrustning
              till kliniker och salonger runt om i Skandinavien. Alla våra
              lasermaskiner är testade för bästa funktionalitet inom sitt
              specifika användningsområde. När du beställer utrustning från oss
              får du en produkt som är tillverkad i enlighet med den senaste
              forskningen.
            </p>
          </div>
        </section>

        {/* Med kunden i fokus */}
        <section className="rounded-lg bg-muted/50 p-8">
          <h2 className="mb-4 text-3xl font-bold text-primary">
            Med kunden i fokus
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Vi vet hur viktigt det är att kunna erbjuda allra bästa kvalitet
              och service till sina kunder. Med våra lasermaskiner kan du
              garantera dina patienter behandlingar med deras trygghet och hälsa
              i fokus.
            </p>
            <p>
              En lyckad behandling är alltid i slutändan ett resultat av seriös
              forskning. Därför genomgår alla våra produkter noggranna
              undersökningar och tester innan de förs ut på marknaden. Med
              medicinsk laserutrustning från Synos kan du vara säker på att
              kunna erbjuda det bästa till dina kunder!
            </p>
          </div>
        </section>

        {/* Utbildning och service */}
        <section>
          <h2 className="mb-4 text-3xl font-bold text-primary">
            Utbildning och service
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Vi vill att du som beställer en lasermaskin från Synos Medical ska
              känna dig trygg med att använda din laserutrustning på rätt sätt.
              Oavsett om du är kirurg, sjuksköterska eller laserterapeut får du
              den utbildning du behöver för att kunna erbjuda laserbehandling av
              bästa kvalitet.
            </p>
            <p>
              Vi lagar din maskin inom 48 arbetstimmar samt erbjuder automatisk
              service beroende på vilken typ av laserutrustning du använder.
              Allt för att du ska känna dig trygg med att dina lasermaskiner
              fungerar i alla lägen.
            </p>
          </div>
        </section>

        {/* Kontakta oss */}
        <section className="rounded-lg bg-primary/5 p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary">Kontakta oss</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Synos Medical ligger alltid i framkant när det gäller teknisk
            utveckling inom lasermedicin. Vill du veta mer om vår verksamhet?
            Ring oss eller maila så berättar vi mer om våra lasermaskiner.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/kontakt">Kontakta oss</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:010-205 15 01">010-205 15 01</a>
            </Button>
          </div>
        </section>
      </div>

      {/* Feature Cards */}
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
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
            <h3 className="mb-2 font-semibold">Känner du dig osäker?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Behöver du råd inför ett köp så kan du kontakta oss direkt, via
              chatt eller så kan du läsa genom vår köpguide.
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link href="/starta-eget/kopguide">Läs mer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Hitta rätt utrustning</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Vi hjälper dig att hitta rätt utrustning! Ladda ner vår köpguide
              eller kontakta oss direkt för en kostnadsfri miniutbildning.
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link href="/starta-eget/kopguide">Läs mer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Hjälp att starta eget</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Har du en dröm att starta eget men saknar kunskapen att genomföra
              din dröm? Vi guidar dig steg för steg.
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link href="/starta-eget">Läs mer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
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
            <h3 className="mb-2 font-semibold">Utbildning i världsklass</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Våra utbildningar är uppbyggda från grunden och innehåller allt
              som en verksamhet behöver.
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link href="/utbildningar">Läs mer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Company Info */}
      <div className="mt-16 rounded-lg bg-muted/30 p-8 text-center">
        <h3 className="mb-4 text-xl font-semibold">Synos Medical AB</h3>
        <p className="text-muted-foreground">
          Organisationsnummer: 556871-8075
        </p>
        <div className="mt-4 space-y-1 text-muted-foreground">
          <p>Stockholm: Turebergsvägen 5, 191 47 Sollentuna</p>
          <p>Linköping: Datalinjen 5, 582 78 Linköping</p>
        </div>
      </div>
    </div>
  );
}

