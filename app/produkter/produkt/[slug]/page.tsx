import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  featuredProducts,
  getProductBySlug,
} from "@/data/products/featured-products";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return featuredProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produkt hittades inte",
    };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      images: product.images
        .filter((img) => img.isPrimary)
        .map((img) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          alt: img.alt,
        })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Hem
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/produkter" className="hover:text-primary">
              Produkter
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      {/* Product Header */}
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <svg
              className="h-32 w-32 text-primary/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="mb-6 text-xl text-muted-foreground">
            {product.description}
          </p>

          {/* Treatment Tags */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Behandlingsområden
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.treatments.map((treatment) => (
                <span
                  key={treatment}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {treatment}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/kontakt">Begär offert</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/kontakt">Boka demonstration</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">Om produkten</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {product.longDescription}
            </p>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Funktioner & Fördelar</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {product.features.map((feature, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <svg
                        className="h-5 w-5 text-primary"
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
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">
                Tekniska specifikationer
              </h2>
              <Card>
                <CardContent className="p-0">
                  <dl className="divide-y divide-border">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-4 px-6 py-4"
                      >
                        <dt className="font-medium">{spec.label}</dt>
                        <dd className="text-muted-foreground">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Intresserad?</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Kontakta oss för mer information, offert eller för att boka en
                kostnadsfri demonstration.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/kontakt">Kontakta oss</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="tel:010-205 15 01">010-205 15 01</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
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
              <h3 className="mb-2 font-semibold">Utbildning ingår</h3>
              <p className="text-sm text-muted-foreground">
                Komplett utbildning och certifiering ingår vid köp
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
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
              <h3 className="mb-2 font-semibold">Service & Support</h3>
              <p className="text-sm text-muted-foreground">
                Reparation inom 48h och automatisk service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

