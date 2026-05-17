"use client";

import { ProductType } from "@/types";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { ProductDetailSidebar } from "@/components/products/ProductDetailSidebar";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { ProductShareButtons } from "@/components/products/ProductShareButtons";
import { ProductLongDescription } from "@/components/products/ProductLongDescription";
import { BeforeAfterShowcase } from "@/components/products/BeforeAfterShowcase";
import { ProductFeatureSplit } from "@/components/products/sections/ProductFeatureSplit";
import { ProductFeatureImageList } from "@/components/products/sections/ProductFeatureImageList";
import { ProductFeatureGrid } from "@/components/products/sections/ProductFeatureGrid";
import { getProductCustomSections } from "@/lib/data/product-sections";
import { Badge } from "@/components/ui/badge";
import { ImageComponent } from "@/components/common/image-component";
import { motion } from "framer-motion";
import { ArrowLeft, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductContentProps {
	product: ProductType;
	/** Base path for navigation (e.g., "/produkter" or "/klinikutrustning/category") */
	basePath?: string;
	/** Label for the back button breadcrumb */
	baseLabel?: string;
	/** Optional extra breadcrumb items to prepend before the product title */
	parentBreadcrumbs?: BreadcrumbItem[];
	contactPhone?: string;
	contactEmail?: string;
	/** When true, renders a hardcoded Motus Pro hero (mobile + desktop) instead of the dynamic product hero */
	hardcodedHero?: boolean;
}

/**
 * Client component for interactive product page elements
 * Receives all data as props from server component
 */
export function ProductContent({
	product,
	basePath = "/produkter",
	baseLabel = "Produkter",
	parentBreadcrumbs,
	contactPhone,
	contactEmail,
	hardcodedHero = false,
}: ProductContentProps) {
	const primaryImage = product.overviewImage;
	const customSections = getProductCustomSections(
		product.slug,
		product.title,
		primaryImage
	);

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			{hardcodedHero ? (
				<section className="relative overflow-hidden pt-20 sm:pt-24 bg-black">
					{/* ── MOBILE LAYOUT ── */}
					<div className="relative overflow-hidden h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] lg:hidden">
						<ImageComponent
							src="/images/Background Mobile.jpeg"
							alt=""
							fill
							priority
							className="object-cover object-[40%_62%] scale-[1.2] origin-[0%_62%] -translate-y-[20%]"
							sizes="100vw"
						/>
						<div className="absolute inset-x-0 top-[6%] h-[50vh] z-10 flex items-center justify-center">
							<div className="relative w-full h-full">
								<ImageComponent
									src="/images/motus-ax-3.jpg"
									alt="Motus Pro"
									fill
									className="object-contain drop-shadow-2xl"
									priority
									sizes="100vw"
								/>
							</div>
						</div>
					</div>
					{/* Mobile text */}
					<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[38vh]">
						<h1 className="text-5xl font-serif font-light text-white mb-3 leading-tight">
							Motus Pro
						</h1>
						<div className="w-14 h-[2px] bg-primary mb-4" />
						<p className="text-white/70 text-sm mb-8 leading-relaxed">
							Avancerad laserplattform för professionella behandlingar
						</p>
						<ul className="space-y-4">
							{[
								"Snabb och effektiv behandling",
								"Skonsam teknik med hög precision",
								"Intuitiv touchskärm och smart arbetsflöde",
								"Anpassad för professionella kliniker",
							].map((item) => (
								<li key={item} className="flex items-center gap-3">
									<div className="h-6 w-6 rounded-full border border-[#fcf3e1] flex items-center justify-center shrink-0">
										<Check className="h-3 w-3 text-[#fcf3e1]" strokeWidth={1} />
									</div>
									<span className="text-white/90 text-sm font-thin">{item}</span>
								</li>
							))}
						</ul>
						<button type="button" className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-white/30 text-white/90 text-sm font-light">
							<FileText className="h-4 w-4 shrink-0" />
							Begär offert
						</button>
					</div>
					{/* ── DESKTOP LAYOUT ── */}
					<div className="hidden lg:block">
						<div className="_container relative overflow-hidden min-h-[740px]">
							<ImageComponent
								src="/images/Product detail breadcrumbs background.jpeg"
								alt=""
								fill
								priority
								className="object-cover object-[30%_top]"
								sizes="100vw"
							/>
							{/* Breadcrumb */}
							<div className="absolute top-6 left-0 right-0 z-20 px-4">
								<Breadcrumb
									items={
										parentBreadcrumbs
											? [...parentBreadcrumbs, { label: product.title }]
											: [{ label: baseLabel, href: basePath }, { label: product.title }]
									}
								/>
							</div>
							<div className="relative z-10 grid grid-cols-2 items-center min-h-[740px] gap-8">
								{/* Left — machine grounded on floor */}
								<div className="relative h-[740px] flex flex-col items-center justify-center">
									{/* Warm floor glow matching background lighting */}
									<div
										className="absolute inset-x-[8%] pointer-events-none z-0"
										style={{
											bottom: '14%',
											height: '90px',
											background: 'radial-gradient(ellipse at 50% 80%, rgba(184,138,58,0.22) 0%, transparent 70%)',
											filter: 'blur(22px)',
										}}
									/>
									{/* Product image — anchored to floor */}
									<div className="relative w-full h-[620px] z-10">
										<ImageComponent
											src="/images/motus.png"
											alt="Motus Pro"
											fill
											className="object-contain object-bottom"
											priority
											sizes="700px"
										/>
									</div>
									{/* Contact shadow + floor reflection */}
									<div className="relative z-10 w-full shrink-0 -mt-3">
										<div
											className="mx-auto pointer-events-none"
											style={{
												width: '46%',
												height: '16px',
												background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.82) 0%, transparent 70%)',
												filter: 'blur(9px)',
											}}
										/>
										<div
											className="w-full mt-1 overflow-hidden"
											style={{
												height: '68px',
												opacity: 0.35,
												maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
												WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
											}}
										>
											<div className="relative w-full h-[620px]" style={{ transform: 'scaleY(-1)' }}>
												<ImageComponent
													src="/images/motus.png"
													fill
													alt=""
													className="object-contain object-bottom"
													sizes="700px"
												/>
											</div>
										</div>
									</div>
								</div>
								{/* Right — Form */}
								<div className="flex flex-col justify-center py-10 pl-10 pr-8">
									<h2 className="text-5xl font-serif font-light text-white mb-2 leading-tight">
										Motus Pro
									</h2>
									<p className="text-white/60 text-base mb-8 leading-relaxed">
										Avancerad laserplattform för professionella behandlingar
									</p>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="block text-xs text-white/60 mb-1.5">Förnamn <span className="text-primary">*</span></label>
												<input type="text" placeholder="Ditt förnamn" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
											</div>
											<div>
												<label className="block text-xs text-white/60 mb-1.5">Efternamn <span className="text-primary">*</span></label>
												<input type="text" placeholder="Ditt efternamn" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="block text-xs text-white/60 mb-1.5">Företag <span className="text-primary">*</span></label>
												<input type="text" placeholder="Ditt företagsnamn" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
											</div>
											<div>
												<label className="block text-xs text-white/60 mb-1.5">E-post <span className="text-primary">*</span></label>
												<input type="email" placeholder="din.email@exempel.se" className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none" />
											</div>
										</div>
										<div>
											<label className="block text-xs text-white/60 mb-1.5">När är du intresserad av att ta nästa steg? <span className="text-primary">*</span></label>
											<textarea rows={4} placeholder="Beskriv när det passar er bäst eller andra detaljer..." className="w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none resize-none" />
										</div>
										<button type="button" className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium text-base">
											Skicka förfrågan
										</button>
										<p className="text-center text-xs text-white/40">
											Vi behandlar dina uppgifter konfidentiellt och delar dem inte med tredje part.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			) : (
				<section className="relative overflow-hidden pt-20 sm:pt-24 min-h-[580px] lg:min-h-[640px] bg-black">
					<div className="_container relative overflow-hidden min-h-[640px] lg:min-h-[740px]">
						{/* Background */}
						<ImageComponent
							src="/images/Product detail breadcrumbs background.jpeg"
							alt=""
							fill
							priority
							className="object-cover object-[30%_top]"
							sizes="100vw"
						/>
						{/* Breadcrumb */}
						<div className="absolute top-6 left-0 right-0 z-20 hidden md:block px-4">
							<Breadcrumb
								items={
									parentBreadcrumbs
										? [...parentBreadcrumbs, { label: product.title }]
										: [{ label: baseLabel, href: basePath }, { label: product.title }]
								}
							/>
						</div>
						<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center min-h-[640px] lg:min-h-[740px] gap-8">
							{/* Left – Product image + floor reflection */}
							<div className="relative h-[640px] lg:h-[740px] flex flex-col items-center justify-center">
								<div className="relative w-full h-[520px] lg:h-[620px]">
									<ImageComponent
										src={product.overviewImage || product.productImages?.[0] || ""}
										alt={product.title}
										fill
										className="object-contain drop-shadow-2xl"
										priority
										sizes="(max-width: 1024px) 100vw, 700px"
									/>
								</div>
								{/* Reflection */}
								<div
									className="w-full h-16 overflow-hidden opacity-50 shrink-0 -mt-16"
									style={{
										maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
										WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
									}}
								>
									<div className="relative w-full h-[620px]" style={{ transform: 'scaleY(-1)' }}>
										<ImageComponent
											src={product.overviewImage || product.productImages?.[0] || ""}
											fill
											alt=""
											className="object-contain object-bottom"
											sizes="(max-width: 1024px) 100vw, 700px"
										/>
									</div>
								</div>
							</div>
							{/* Right – text */}
							<div className="flex flex-col justify-center py-16 pl-8 lg:pl-16 pr-4">
								<h1 className="text-6xl lg:text-8xl font-serif font-light text-white mb-3 leading-tight">
									{product.title}
								</h1>
								<div className="w-14 h-[2px] bg-primary mb-5" />
								<p className="text-white/70 text-3xl mb-12 leading-relaxed">
									{product.shortDescription}
								</p>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Custom Feature Sections (per-product, after hero) */}
			{customSections && (
				<div className="py-8 md:py-10 lg:py-12">
					<ProductFeatureSplit {...customSections.section1} corners="top" />
					<ProductFeatureImageList
						{...customSections.section2}
						corners="middle"
					/>
					<ProductFeatureGrid {...customSections.section3} corners="bottom" />
				</div>
			)}

			{/* Main Content Section */}
			<section className="py-12 md:py-16">
				<div className="_container">
					{/* Certifications */}
					{product.certifications && product.certifications.length > 0 && (
						<div className="mb-8 flex flex-wrap items-center gap-2">
							{product.certifications.map((cert, index) => (
								<div
									key={index}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm font-medium"
								>
									<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
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
					{/* Image Gallery */}
					<div className="mb-12">
						{product.productImages && product.productImages.length > 0 ? (
							<ProductImageGallery
								images={product.productImages}
								productName={product.title}
								youtubeUrl={product.youtubeUrl}
								videoThumbnail={product.videoThumbnail}
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
						) : null}
					</div>
					<div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
						{/* Main Content */}
						<article className="min-w-0">
							{/* Share Button - below image, above Om Produkten */}
							<div className="mb-6 flex justify-end">
								<ProductShareButtons
									productName={product.title}
									productUrl={`/produkter/produkt/${product.slug}`}
								/>
							</div>

							{/* Long Description Section */}
							{product.productDescription && (
								<ProductLongDescription
									description={product.productDescription}
								/>
							)}

							{/* FAQ Section - Right after description */}
							{product.qa && product.qa.length > 0 && (
								<div className="mb-12">
									<ProductFAQ faqs={product.qa} title={product.faqTitle} />
								</div>
							)}

							{/* Sidebar - mobile only, below FAQ */}
							<div className="md:hidden mb-12">
								<ProductDetailSidebar
									certifications={product.certifications}
									onScrollToForm={() => {
										document
											.getElementById("product-inquiry-form")
											?.scrollIntoView({ behavior: "smooth", block: "start" });
									}}
								/>
							</div>

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

						{/* Sidebar - Sticky (Desktop) */}
						<aside className="sticky top-28 self-start space-y-4 hidden md:block">
							<ProductDetailSidebar
								brochureUrl={product.documentation}
								videoUrl={product.youtubeUrl}
								benefits={product.benefits}
								certifications={product.certifications}
								onScrollToForm={() =>
									document
										.getElementById("product-inquiry-form")
										?.scrollIntoView({ behavior: "smooth" })
								}
							/>
						</aside>
					</div>
				</div>
			</section>

			{/* Product Inquiry Form */}
			<div id="product-inquiry-form">
				<ProductInquiryForm
					productName={product.title}
					productId={product.id}
					productSlug={product.slug}
					categoryName={baseLabel}
					purchaseTitle={product.purchaseInfo?.title}
					purchaseDescription={product.purchaseInfo?.description}
					productImage={product.overviewImage}
					contactPhone={contactPhone}
					contactEmail={contactEmail}
				/>
			</div>

			{/* SEO Content - Hidden from users but visible to search engines */}
			{/* This content is in the DOM for SEO purposes but visually hidden */}
			{product.seoAccordions && product.seoAccordions.length > 0 && (
				<div
					className="sr-only"
					aria-hidden="true"
					itemScope
					itemType="https://schema.org/FAQPage"
				>
					{product.seoAccordions.map((accordion) => (
						<article
							key={accordion._id}
							itemScope
							itemProp="mainEntity"
							itemType="https://schema.org/Question"
						>
							<h3 itemProp="name">{accordion.title}</h3>
							<div
								itemScope
								itemProp="acceptedAnswer"
								itemType="https://schema.org/Answer"
							>
								<div
									itemProp="text"
									dangerouslySetInnerHTML={{
										__html: accordion.content,
									}}
								/>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
