import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { featuredProducts } from "@/data/products/featured-products";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductDetailSidebar } from "@/components/products/ProductDetailSidebar";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = featuredProducts.find((p) => p.slug === slug);

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
			images: product.seo.ogImage ? [product.seo.ogImage] : undefined,
		},
	};
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug } = await params;
	const product = featuredProducts.find((p) => p.slug === slug);

	if (!product) {
		notFound();
	}

	// Get related products (same category, excluding current product)
	const relatedProducts = featuredProducts
		.filter(
			(p) =>
				p.id !== product.id &&
				p.categories.some((cat) => product.categories.includes(cat))
		)
		.slice(0, 3);

	const primaryImage =
		product.images.find((img) => img.isPrimary) || product.images[0];

	// Structured data for SEO
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description,
		image: primaryImage?.url,
		brand: {
			"@type": "Brand",
			name: "Synos Medical",
		},
		offers: product.price
			? {
					"@type": "Offer",
					price: product.price.amount,
					priceCurrency: product.price.currency,
					availability: "https://schema.org/InStock",
			  }
			: undefined,
	};

	return (
		<>
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="min-h-screen bg-linear-to-b from-muted to-background">
				<div className="container mx-auto px-4 py-8 page-padding-top">
					{/* Breadcrumb */}
					<Breadcrumb
						items={[
							{ label: "Produkter", href: "/produkter" },
							{ label: product.name },
						]}
					/>

					{/* Main Layout */}
					<div className="flex flex-col gap-8 lg:flex-row">
						{/* Main Content */}
						<article className="flex-1">
							{/* Hero Section */}
							<div className="mb-8 overflow-hidden rounded-2xl bg-card shadow-lg">
								<div className="grid gap-8 md:grid-cols-2">
									{/* Product Image */}
									<div className="relative aspect-square overflow-hidden bg-linear-to-br from-tertiary/30 to-muted md:aspect-auto">
										{primaryImage ? (
											<Image
												src={primaryImage.url}
												alt={primaryImage.alt}
												fill
												className="object-cover"
												priority
											/>
										) : (
											<div className="flex h-full min-h-[400px] items-center justify-center">
												<svg
													className="h-32 w-32 text-tertiary/40"
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
										)}
									</div>

									{/* Product Info */}
									<div className="p-8">
										<div className="mb-4 flex flex-wrap gap-2">
											{product.treatments.map((treatment) => (
												<Badge
													key={treatment}
													variant="secondary"
													className="bg-tertiary/20 text-secondary hover:bg-tertiary/30"
												>
													{treatment}
												</Badge>
											))}
										</div>

										<h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
											{product.name}
										</h1>

										<p className="mb-6 text-lg text-muted-foreground">
											{product.description}
										</p>

										{product.longDescription && (
											<p className="text-muted-foreground">
												{product.longDescription}
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Features Section */}
							{product.features.length > 0 && (
								<Card className="mb-8 border-border/50 bg-card">
									<CardHeader>
										<CardTitle className="text-2xl font-bold text-foreground">
											Funktioner & Fördelar
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6 sm:grid-cols-2">
											{product.features.map((feature, index) => (
												<div key={index} className="flex gap-4">
													<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary">
														<svg
															className="h-6 w-6 text-primary-foreground"
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
														<h3 className="mb-1 font-semibold text-foreground">
															{feature.title}
														</h3>
														<p className="text-sm text-muted-foreground">
															{feature.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Specifications Section */}
							{product.specifications.length > 0 && (
								<Card className="mb-8 border-border/50 bg-card">
									<CardHeader>
										<CardTitle className="text-2xl font-bold text-foreground">
											Tekniska Specifikationer
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{product.specifications.map((spec, index) => (
												<div key={index}>
													<div className="flex justify-between py-3">
														<span className="font-medium text-foreground">
															{spec.label}
														</span>
														<span className="text-muted-foreground">
															{spec.value}
														</span>
													</div>
													{index <
														product.specifications.length - 1 && (
														<Separator className="bg-border/50" />
													)}
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Related Products */}
							{relatedProducts.length > 0 && (
								<section className="mb-8">
									<h2 className="mb-6 text-2xl font-bold text-foreground">
										Relaterade Produkter
									</h2>
									<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
										{relatedProducts.map((relatedProduct) => (
											<ProductCard
												key={relatedProduct.id}
												product={relatedProduct}
												variant="grid"
											/>
										))}
									</div>
								</section>
							)}
						</article>

						{/* Sidebar */}
						<div className="w-full lg:w-96 lg:shrink-0">
							<div className="lg:sticky lg:top-24">
								<ProductDetailSidebar
									brochureUrl={product.brochureUrl}
									videoUrl={product.videoUrl}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export async function generateStaticParams() {
	return featuredProducts.map((product) => ({
		slug: product.slug,
	}));
}
