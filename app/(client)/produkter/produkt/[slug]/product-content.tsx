"use client";

import { ProductType } from "@/types";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductDetailSidebar } from "@/components/products/ProductDetailSidebar";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { ProductShareButtons } from "@/components/products/ProductShareButtons";
import { ProductLongDescription } from "@/components/products/ProductLongDescription";
import { BeforeAfterShowcase } from "@/components/products/BeforeAfterShowcase";
import { Badge } from "@/components/ui/badge";
import { ImageComponent } from "@/components/common/image-component";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductContentProps {
	product: ProductType;
	/** Base path for navigation (e.g., "/produkter" or "/klinikutrustning/category") */
	basePath?: string;
	/** Label for the back button breadcrumb */
	baseLabel?: string;
}

/**
 * Client component for interactive product page elements
 * Receives all data as props from server component
 */
export function ProductContent({
	product,
	basePath = "/produkter",
	baseLabel = "Produkter",
}: ProductContentProps) {
	const primaryImage = product.overviewImage;

	return (
		<div className="min-h-screen">
			{/* Hero Section - Similar to Blog Detail Hero */}
			<section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-primary/10 padding-top pb-8">
				<div className="_container">
					{/* Breadcrumb */}
					<Breadcrumb
						items={[
							{ label: baseLabel, href: basePath },
							{ label: product.title },
						]}
					/>
				</div>

				<div className="_container">
					{/* Back Button */}
					{/* <motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="mb-6"
					>
						<Button asChild variant="ghost" size="sm">
							<Link href={basePath} className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Tillbaka till {baseLabel.toLowerCase()}
							</Link>
						</Button>
					</motion.div> */}

					{/* Title */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.15 }}
						className="mb-6 text-3xl font-bold tracking-tight text-secondary md:text-4xl lg:text-5xl"
					>
						{product.title}
					</motion.h1>

					{/* Short Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mb-8 text-lg text-muted-foreground md:text-xl"
					>
						{product.shortDescription}
					</motion.p>

					{/* Certifications & Share Row */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.25 }}
						className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
					>
						{/* Certifications */}
						{product.certifications &&
							product.certifications.length > 0 && (
								<div className="flex flex-wrap items-center gap-2">
									{product.certifications.map((cert, index) => (
										<div
											key={index}
											className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm font-medium"
										>
											<svg
												className="h-3.5 w-3.5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											{cert}
										</div>
									))}
								</div>
							)}

						{/* Share Button */}
						<div className="ml-auto">
							<ProductShareButtons
								productName={product.title}
								productUrl={`/produkter/produkt/${product.slug}`}
							/>
						</div>
					</motion.div>

					{/* Featured Image */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="w-full"
					>
						{product.productImages && product.productImages.length > 0 ? (
							<ProductImageGallery
								images={product.productImages}
								productName={product.title}
								youtubeUrl={product.youtubeUrl}
							/>
						) : primaryImage ? (
							<div className="relative aspect-video md:aspect-21/9 w-full overflow-hidden rounded-2xl shadow-xl">
								<ImageComponent
									src={primaryImage}
									alt={product.title}
									className="object-cover w-full h-full"
									priority
									height={0}
									width={0}
									sizes="100vw"
									wrapperClasses="w-full h-full"
									showLoader={true}
								/>
							</div>
						) : (
							<div className="relative aspect-video md:aspect-21/9 w-full overflow-hidden rounded-2xl shadow-xl flex items-center justify-center bg-linear-to-br from-slate-100 to-primary/10">
								<svg
									className="h-24 w-24 text-primary/40"
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
					</motion.div>
				</div>
			</section>

			{/* Main Content Section */}
			<section className="py-12 md:py-16">
				<div className="_container">
					<div className="grid gap-8 lg:grid-cols-[1fr_340px]">
						{/* Main Content */}
						<article className="min-w-0">
							{/* Long Description Section */}
							{product.productDescription && (
								<ProductLongDescription
									description={product.productDescription}
								/>
							)}

							{/* Before & After Section */}
							{product.beforeAfterImages &&
								product.beforeAfterImages.length > 0 && (
									<BeforeAfterShowcase
										pairs={product.beforeAfterImages}
										productName={product.title}
									/>
								)}

							{/* Specifications Section */}
							{product?.techSpecifications &&
								product?.techSpecifications?.length > 0 && (
									<motion.section
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: "-100px" }}
										transition={{ duration: 0.6 }}
										className="mb-12"
										id="specifications"
									>
										<h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
											Tekniska Specifikationer
										</h2>
										<div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
											<div className="divide-y divide-slate-100">
												{product?.techSpecifications?.map(
													(spec, index) => (
														<div
															key={index}
															className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 px-6 hover:bg-slate-50/80 transition-colors duration-200 gap-1 sm:gap-4"
														>
															<span className="font-medium text-foreground">
																{spec.title}
															</span>
															<span className="text-muted-foreground sm:text-right">
																{spec.description}
															</span>
														</div>
													)
												)}
											</div>
										</div>
									</motion.section>
								)}
						</article>

						{/* Sidebar - Sticky */}
						<aside className="space-y-6">
							<div className="sticky top-24 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pr-1">
								<ProductDetailSidebar
									brochureUrl={product.documentation}
									videoUrl={product.youtubeUrl}
									benefits={product.benefits}
									certifications={product.certifications}
								/>
							</div>
						</aside>
					</div>
				</div>
			</section>
			{/* Treatment Badges */}
			<div className="_container">
				{product?.treatments && product.treatments.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="mb-4 flex flex-wrap gap-2"
					>
						{product.treatments.map((treatment) => (
							<Badge
								key={treatment}
								variant="secondary"
								className="bg-primary/10 text-primary hover:bg-primary/20"
							>
								{treatment}
							</Badge>
						))}
					</motion.div>
				)}
			</div>

			{/* Full Width Sections */}
			{/* FAQ Section */}
			{product.qa && product.qa.length > 0 && (
				<ProductFAQ faqs={product.qa} />
			)}

			{/* Product Inquiry Form */}
			<ProductInquiryForm
				productName={product.title}
				productId={product.id}
				productSlug={product.slug}
			/>
		</div>
	);
}
