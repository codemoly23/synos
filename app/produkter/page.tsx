import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { treatmentCategories } from "@/data/categories/treatment-categories";
import { featuredProducts } from "@/data/products/featured-products";

export const metadata: Metadata = {
	title: "Produkter",
	description:
		"Upptäck vårt sortiment av professionella lasermaskiner och medicinsk utrustning för kliniker och salonger. MDR-certifierade produkter av högsta kvalitet.",
	openGraph: {
		title: "Produkter - Synos Medical",
		description:
			"Professionella lasermaskiner och medicinsk utrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer.",
	},
};

export default function ProductsPage() {
	return (
		<div className="container mx-auto px-4 py-12 page-padding-top">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
					Våra Produkter
				</h1>
				<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
					Professionella lasermaskiner och medicinsk utrustning av högsta
					kvalitet. Alla våra produkter är MDR-certifierade och testade för
					bästa funktionalitet.
				</p>
			</div>

			{/* Treatment Categories */}
			<section className="mb-20">
				<div className="mb-8 text-center">
					<h2 className="mb-3 text-3xl font-bold">
						Behandlingskategorier
					</h2>
					<p className="text-muted-foreground">
						Välj behandlingsområde för att se relevanta produkter
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{treatmentCategories.map((category) => (
						<Link
							key={category.id}
							href={`/produkter/${category.slug}`}
							className="group"
						>
							<Card className="h-full border-primary/20 transition-all hover:border-primary hover:shadow-lg">
								<CardContent className="p-6">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 transition-colors group-hover:bg-secondary/20">
										<svg
											className="h-6 w-6 text-secondary"
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
									<h3 className="mb-2 font-semibold group-hover:text-secondary">
										{category.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{category.description}
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</section>

			{/* Featured Products */}
			<section className="mb-20">
				<div className="mb-8 text-center">
					<h2 className="mb-3 text-3xl font-bold">Utvalda Produkter</h2>
					<p className="text-muted-foreground">
						Våra mest populära lasermaskiner och utrustning
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{featuredProducts.map((product) => (
						<Card
							key={product.id}
							className="group overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-xl"
						>
							<div className="aspect-video overflow-hidden bg-muted">
								{/* Placeholder for product image */}
								<div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
									<svg
										className="h-20 w-20 text-secondary/30"
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
							<CardHeader>
								<CardTitle className="group-hover:text-secondary">
									{product.name}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-sm text-muted-foreground">
									{product.description}
								</p>

								{/* Treatment tags */}
								<div className="mb-4 flex flex-wrap gap-2">
									{product.treatments.slice(0, 3).map((treatment) => (
										<span
											key={treatment}
											className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
										>
											{treatment}
										</span>
									))}
									{product.treatments.length > 3 && (
										<span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
											+{product.treatments.length - 3} mer
										</span>
									)}
								</div>

								<Button asChild className="w-full">
									<Link href={`/produkter/produkt/${product.slug}`}>
										Läs mer
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="rounded-lg bg-gradient-to-r from-primary to-primary-hover p-12 text-center text-white">
				<h2 className="mb-4 text-3xl font-bold">
					Behöver du hjälp att välja?
				</h2>
				<p className="mb-6 text-lg opacity-90">
					Våra experter hjälper dig att hitta rätt utrustning för din
					verksamhet
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
						<Link href="/starta-eget/kopguide">Läs köpguiden</Link>
					</Button>
				</div>
			</section>

			{/* Info Cards */}
			<section className="mt-16 grid gap-6 md:grid-cols-3">
				<Card className="border-primary/20">
					<CardContent className="p-6">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
							<svg
								className="h-6 w-6 text-secondary"
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
						<h3 className="mb-2 font-semibold">MDR-certifierade</h3>
						<p className="text-sm text-muted-foreground">
							Alla våra produkter är certifierade enligt de senaste
							EU-förordningarna för medicintekniska produkter
						</p>
					</CardContent>
				</Card>

				<Card className="border-primary/20">
					<CardContent className="p-6">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
							<svg
								className="h-6 w-6 text-secondary"
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
							Komplett utbildning och support ingår vid köp av utrustning
							från Synos Medical
						</p>
					</CardContent>
				</Card>

				<Card className="border-primary/20">
					<CardContent className="p-6">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
							<svg
								className="h-6 w-6 text-secondary"
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
							Vi lagar din maskin inom 48 arbetstimmar och erbjuder
							automatisk service
						</p>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
