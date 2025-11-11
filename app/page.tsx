import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary-light to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Sveriges ledande leverantör av{" "}
              <span className="text-primary">MDR-certifierad</span>{" "}
              klinikutrustning
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Vi erbjuder högkvalitativ medicinsk utrustning för laser,
              hårborttagning, tatueringsborttagning och hudföryngring.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/produkter">Se våra produkter</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/kontakt">Kontakta oss</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Varför välja Synos Medical?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "MDR-certifierad utrustning",
                description:
                  "All vår utrustning är certifierad enligt de senaste MDR-kraven",
                icon: "✓",
              },
              {
                title: "Komplett utbildning",
                description:
                  "Vi erbjuder omfattande utbildning för all vår utrustning",
                icon: "📚",
              },
              {
                title: "Teknisk support",
                description:
                  "Professionell support och service under hela produktens livstid",
                icon: "🔧",
              },
              {
                title: "Flexibla betalningsalternativ",
                description:
                  "Vi erbjuder olika finansieringslösningar för din verksamhet",
                icon: "💳",
              },
              {
                title: "Starta eget-paket",
                description:
                  "Komplett stöd för dig som vill starta din egen klinik",
                icon: "🚀",
              },
              {
                title: "Svensk support",
                description:
                  "Lokal support på svenska från våra kontor i Stockholm och Linköping",
                icon: "🇸🇪",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Redo att ta nästa steg?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Kontakta oss idag för en kostnadsfri konsultation
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link href="/kontakt">Kontakta oss</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link href="/starta-eget">Starta eget</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {siteConfig.company.addresses.map((address) => (
              <div
                key={address.name}
                className="rounded-lg border border-border bg-background p-8"
              >
                <h3 className="mb-4 text-2xl font-bold text-primary">
                  {address.name}
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>{address.street}</p>
                  <p>
                    {address.postalCode} {address.city}
                  </p>
                  <p className="pt-4">
                    <a
                      href={`tel:${siteConfig.company.phone.replace(
                        /\s/g,
                        ""
                      )}`}
                      className="text-primary hover:underline"
                    >
                      {siteConfig.company.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${siteConfig.company.email}`}
                      className="text-primary hover:underline"
                    >
                      {siteConfig.company.email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
