import { notFound } from "next/navigation";
// import Image from "next/image";
import type { Metadata } from "next";
import { featuredProducts } from "@/data/products/featured-products";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductDetailSidebar } from "@/components/products/ProductDetailSidebar";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ProductQnA } from "@/components/products/ProductQnA";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { ProductShareButtons } from "@/components/products/ProductShareButtons";
import { ProductLongDescription } from "@/components/products/ProductLongDescription";
import { Badge } from "@/components/ui/badge";
import { ImageComponent } from "@/components/common/image-component";

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
		aggregateRating:
			product.reviews && product.reviews.length > 0
				? {
						"@type": "AggregateRating",
						ratingValue:
							product.reviews.reduce((sum, r) => sum + r.rating, 0) /
							product.reviews.length,
						reviewCount: product.reviews.length,
				  }
				: undefined,
		review:
			product.reviews && product.reviews.length > 0
				? product.reviews.map((review) => ({
						"@type": "Review",
						author: {
							"@type": "Person",
							name: review.author,
						},
						datePublished: review.date,
						reviewRating: {
							"@type": "Rating",
							ratingValue: review.rating,
							bestRating: 5,
						},
						reviewBody: review.content,
				  }))
				: undefined,
	};

	return (
		<>
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="min-h-screen bg-linear-to-b from-slate-200 to-primary/10">
				<div className="page-padding-top">
					<div className="_container">
						{/* Breadcrumb */}
						<Breadcrumb
							items={[
								{ label: "Produkter", href: "/produkter" },
								{ label: product.name },
							]}
						/>
					</div>

					{/* Main Layout */}
					<div className="_container flex flex-col gap-8 lg:flex-row">
						{/* Main Content */}
						<article className="flex-1">
							{/* Hero Section with Product Info */}
							<div className="mb-12">
								<div className="grid gap-8 lg:grid-cols-2">
									{/* Left Column - Image Gallery */}
									<div>
										{product.gallery && product.gallery.length > 0 ? (
											<ProductImageGallery
												images={product.gallery}
												productName={product.name}
											/>
										) : (
											<div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-linear-to-br from-slate-100 to-primary/20">
												{primaryImage ? (
													<ImageComponent
														src={primaryImage.url}
														alt={primaryImage.alt}
														// fill
														className="object-cover w-full h-full"
														priority
														height={0}
														width={0}
														sizes="100vw"
														wrapperClasses="w-full h-full"
														showLoader={true}
													/>
												) : (
													<div className="flex h-full items-center justify-center">
														<svg
															className="h-32 w-32 text-primary/40"
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
										)}
									</div>

									{/* Right Column - Product Info */}
									<div className="flex flex-col">
										{/* Header with Share Button */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex flex-wrap gap-2">
												{product.treatments.map((treatment) => (
													<Badge
														key={treatment}
														variant="secondary"
														className="bg-primary/10 text-secondary hover:bg-primary/20"
													>
														{treatment}
													</Badge>
												))}
											</div>
											<ProductShareButtons
												productName={product.name}
												productUrl={`/produkter/produkt/${product.slug}`}
											/>
										</div>

										<h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
											{product.name}
										</h1>

										<p className="mb-6 text-lg text-muted-foreground leading-relaxed">
											{product.description}
										</p>

										{/* Benefits List */}
										{product.benefits &&
											product.benefits.length > 0 && (
												<div className="mb-6 p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/30">
													<h3 className="text-lg font-bold text-foreground mb-4">
														Viktiga fördelar
													</h3>
													<ul className="space-y-2">
														{product.benefits
															.slice(0, 5)
															.map((benefit, index) => (
																<li
																	key={index}
																	className="flex items-start gap-3 text-sm text-muted-foreground"
																>
																	<svg
																		className="h-5 w-5 text-primary shrink-0 mt-0.5"
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
																	<span>{benefit}</span>
																</li>
															))}
													</ul>
												</div>
											)}

										{/* Certifications */}
										{product.certifications &&
											product.certifications.length > 0 && (
												<div className="flex flex-wrap gap-3">
													{product.certifications.map(
														(cert, index) => (
															<div
																key={index}
																className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20"
																title={cert.description}
															>
																<span className="text-sm font-semibold text-primary">
																	{cert.name}
																</span>
															</div>
														)
													)}
												</div>
											)}
									</div>
								</div>
							</div>

							{/* Long Description Section */}
							{product.longDescription && (
								<ProductLongDescription
									description={product.longDescription}
								/>
							)}

							{/* Features Section */}
							{product.features.length > 0 && (
								<section className="mb-12" id="features">
									<h2 className="text-3xl font-bold text-secondary mb-8">
										Funktioner & Fördelar
									</h2>
									<div className="grid gap-6 sm:grid-cols-2">
										{product.features.map((feature, index) => (
											<div
												key={index}
												className="group p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
											>
												<div className="flex gap-4">
													<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary group-hover:scale-110 transition-transform duration-300">
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
														<h3 className="mb-2 font-bold text-lg text-foreground">
															{feature.title}
														</h3>
														<p className="text-sm text-muted-foreground leading-relaxed">
															{feature.description}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Specifications Section */}
							{product.specifications.length > 0 && (
								<section className="mb-12" id="specifications">
									<h2 className="text-3xl font-bold text-secondary mb-8">
										Tekniska Specifikationer
									</h2>
									<div className="p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/50">
										<div className="grid gap-4 md:grid-cols-2">
											{product.specifications.map((spec, index) => (
												<div
													key={index}
													className="flex justify-between items-center py-4 px-4 rounded-lg hover:bg-primary/20 transition-colors duration-200"
												>
													<span className="font-semibold text-foreground">
														{spec.label}
													</span>
													<span className="text-muted-foreground font-medium">
														{spec.value}
													</span>
												</div>
											))}
										</div>
									</div>
								</section>
							)}
						</article>

						{/* Sidebar */}
						<div className="w-full lg:w-96 lg:shrink-0">
							<div className="lg:sticky lg:top-24 pt-5">
								<ProductDetailSidebar
									brochureUrl={product.brochureUrl}
									videoUrl={product.videoUrl}
								/>
							</div>
						</div>
					</div>

					{/* Full Width Sections */}
					{/* Customer Reviews */}
					{product.reviews && product.reviews.length > 0 && (
						<ProductReviews
							reviews={product.reviews}
							productName={product.name}
						/>
					)}

					{/* FAQ Section */}
					{product.faqs && product.faqs.length > 0 && (
						<ProductFAQ faqs={product.faqs} />
					)}

					{/* Q&A Section */}
					{product.qna && product.qna.length > 0 && (
						<ProductQnA qna={product.qna} />
					)}

					{/* Related Products */}
					{relatedProducts.length > 0 && (
						<section className="py-16 md:py-24">
							<div className="_container">
								<h2 className="mb-12 text-3xl md:text-4xl font-bold text-center text-secondary">
									Relaterade Produkter
								</h2>
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
									{relatedProducts.map((relatedProduct) => (
										<ProductCard
											key={relatedProduct.id}
											product={relatedProduct}
											variant="grid"
										/>
									))}
								</div>
							</div>
						</section>
					)}

					{/* Product Inquiry Form */}
					<ProductInquiryForm
						productName={product.name}
						productId={product.id}
					/>
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
