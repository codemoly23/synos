"use client";

import { ProductType } from "@/types";
import { type BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { ProductDetailSidebar } from "@/components/products/ProductDetailSidebar";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { BeforeAfterShowcase } from "@/components/products/BeforeAfterShowcase";
import { ProductFeatureSplit } from "@/components/products/sections/ProductFeatureSplit";
import { ProductFeatureImageList } from "@/components/products/sections/ProductFeatureImageList";
import { ProductFeatureGrid } from "@/components/products/sections/ProductFeatureGrid";
import { getProductCustomSections } from "@/lib/data/product-sections";
import { HeroCategoryForm } from "@/components/klinikutrustning/HeroCategoryForm";
import { BrochureRequestModal } from "@/components/product/BrochureRequestModal";
import { Badge } from "@/components/ui/badge";
import { ImageComponent } from "@/components/common/image-component";
import { motion } from "framer-motion";
import { ArrowLeft, Check, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

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
	/** Global fallback background for the product hero (from site settings) */
	defaultBackground?: string;
	/** Global fallback background for the inquiry/contact form section (from site settings) */
	defaultInquiryBgMobile?: string;
	defaultInquiryBgDesktop?: string;
	/** Category slug for correct URL construction in form submissions */
	productCategorySlug?: string;
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
	defaultBackground,
	defaultInquiryBgMobile,
	defaultInquiryBgDesktop,
	productCategorySlug,
}: ProductContentProps) {
	const [brochureModal, setBrochureModal] = useState<{ open: boolean; title?: string }>({ open: false });
	const primaryImage = product.overviewImage;
	const FALLBACK_BG = "/images/Product detail breadcrumbs background.jpeg";
	const resolvedBg = defaultBackground || FALLBACK_BG;
	const mobileBgMap: Record<string, string> = {
		"helix": "/Mobile_bilder/Helix.webp",
		"motus-pro": "/Mobile_bilder/Motus_pro.webp",
		"again-pro": "/Mobile_bilder/Again_pro.webp",
		"duoglide": "/Mobile_bilder/DuGlide.webp",
		"ny-smartxide-punto": "/Mobile_bilder/SmartXd.webp",
		"tetra-pro": "/Mobile_bilder/TertaPro.webp",
		"hifu-ultraskin-s": "/Mobile_bilder/Hifu.webp",
		"jovena": "/Mobile_bilder/Jovena.webp",
		"harborttagningslaser-kopa-motus-ax": "/Mobile_bilder/Motus_ax.webp",
		"prisma": "/Mobile_bilder/Priema.webp",
		"toro": "/Mobile_bilder/Toro.webp",
		"vivace-rf-microneedling": "/Mobile_bilder/Vivace.webp",
		"redium": "/Mobile_bilder/Redtouch.webp",
	};
	const mobileBg = product.heroBackgroundMobile || mobileBgMap[product.slug] || "/Mobile_bilder/Motus_Ay.webp";
	const customSections = getProductCustomSections(
		product.slug,
		product.title,
		primaryImage,
		product.featureSections,
		{
			section1Image: product.section1Image,
			section2TopImage: product.section2TopImage,
			section2BottomImage: product.section2BottomImage,
			section3Image: product.section3Image,
		}
	);

	return (
		<div className="min-h-screen font-heading">
			{/* Hero Section */}
			{hardcodedHero ? (
				<section className="relative overflow-hidden pt-20 sm:pt-24 bg-black">
					{/* ── MOBILE LAYOUT ── */}
					<div className="relative overflow-hidden h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] lg:hidden">
						<ImageComponent
							src={mobileBg}
							alt=""
							fill
							priority
							className="object-cover object-top"
							sizes="100vw"
						/>
					</div>
					{/* Mobile text */}
					<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[28vh]">
						<h1 className="text-[2.2rem] font-sans font-light text-white mb-3 leading-tight">
							{product.title}
						</h1>
						<div className="w-14 h-[2px] bg-primary mb-4" />
						{(product as unknown as { heroSubtitle?: string }).heroSubtitle && (
							<p className="text-white/70 text-sm mb-8 leading-relaxed">
								{(product as unknown as { heroSubtitle?: string }).heroSubtitle}
							</p>
						)}
						<ul className="space-y-4">
							{((product as unknown as { heroFeatures?: string[] }).heroFeatures?.filter(Boolean).length
								? (product as unknown as { heroFeatures?: string[] }).heroFeatures!
								: [
									"Snabb och effektiv behandling",
									"Skonsam teknik med hög precision",
									"Intuitiv touchskärm och smart arbetsflöde",
									"Anpassad för professionella kliniker",
								]
							).map((item) => (
								<li key={item} className="flex items-center gap-3">
									<div className="h-6 w-6 rounded-full border border-[#fcf3e1] flex items-center justify-center shrink-0">
										<Check className="h-3 w-3 text-[#fcf3e1]" strokeWidth={1} />
									</div>
									<span className="text-white/90 text-sm font-thin">{item}</span>
								</li>
							))}
						</ul>
						<button type="button" onClick={() => document.getElementById("product-inquiry-form")?.scrollIntoView({ behavior: "smooth" })} className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#dba481]/50 text-sm font-light" style={{ color: '#dba481', boxShadow: '-10px 0 8px -6px rgba(219,164,129,0.35), 10px 0 8px -6px rgba(219,164,129,0.35)' }}>
							<FileText className="h-4 w-4 shrink-0" />
							Begär offert
						</button>
					</div>
					{/* ── DESKTOP LAYOUT ── */}
					<div className="hidden lg:block">
						<div className="_container relative overflow-hidden min-h-[740px]">
							<ImageComponent
								src={product.heroBackgroundDesktop || resolvedBg}
								alt=""
								fill
								priority
								className="object-cover object-[30%_top]"
								sizes="100vw"
							/>
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
								</div>
								{/* Right — Form */}
								<div className="flex flex-col justify-center py-10 pl-10 pr-8">
									<h2 className="text-5xl font-sans font-light text-white mb-2 leading-tight">
										{product.title}
									</h2>
									{(product as unknown as { heroSubtitle?: string }).heroSubtitle && (
										<p className="text-white/60 text-base mb-8 leading-relaxed">
											{(product as unknown as { heroSubtitle?: string }).heroSubtitle}
										</p>
									)}
									<HeroCategoryForm categoryName={product.title} />
								</div>
							</div>
						</div>
					</div>
				</section>
			) : (
				<section className="relative overflow-hidden pt-20 sm:pt-24 bg-black">
					{/* ── MOBILE LAYOUT ── */}
					<div className="lg:hidden">
						<div className="relative h-[50vh] min-h-[360px]">
							<ImageComponent
								src={resolvedBg}
								alt=""
								fill
								priority
								className="object-cover object-[30%_top]"
								sizes="100vw"
							/>
							{primaryImage && (
								<ImageComponent
									src={primaryImage}
									alt={product.title}
									fill
									priority
									className="object-contain object-bottom drop-shadow-2xl"
									sizes="100vw"
								/>
							)}
						</div>
						<div className="relative z-10 px-6 py-8 pb-12 bg-black">
							<h1 className="text-[2.2rem] font-sans font-light text-white mb-3 leading-tight">
								{product.title}
							</h1>
							<div className="w-14 h-[2px] bg-primary mb-4" />
							<p className="text-white/70 text-sm leading-relaxed">
								{product.shortDescription}
							</p>
						</div>
					</div>

					{/* ── DESKTOP LAYOUT ── */}
					<div className="hidden lg:block">
						<div className="_container relative overflow-hidden min-h-[740px]">
							{/* Background */}
							<ImageComponent
								src={resolvedBg}
								alt=""
								fill
								priority
								className="object-cover object-[30%_top]"
								sizes="100vw"
							/>
							<div className="relative z-10 grid grid-cols-2 items-center min-h-[740px] gap-8">
								{/* Left — machine image overlay */}
								{primaryImage ? (
									<div className="relative h-[740px]">
										<ImageComponent
											src={primaryImage}
											alt={product.title}
											fill
											priority
											className="object-contain object-bottom drop-shadow-2xl"
											sizes="640px"
										/>
									</div>
								) : (
									<div />
								)}
								{/* Right – text */}
								<div className="flex flex-col justify-center py-16 pl-8 lg:pl-16 pr-4">
									<h1 className="text-6xl lg:text-8xl font-sans font-light text-white mb-3 leading-tight">
										{product.title}
									</h1>
									<div className="w-14 h-[2px] bg-primary mb-5" />
									<p className="text-white/70 text-3xl mb-12 leading-relaxed">
										{product.shortDescription}
									</p>
								</div>
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

			{/* Benefits Section */}
			{product.benefits && product.benefits.length > 0 && (
				<section className="py-12 md:py-16 bg-secondary/5 border-y border-primary/10">
					<div className="_container">
						<h2 className="text-2xl md:text-3xl font-light text-secondary mb-8 text-center">
							Vad ingår?
						</h2>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
							{product.benefits.map((benefit, index) => (
								<div
									key={index}
									className="flex items-start gap-3 rounded-xl border border-primary/20 bg-white px-4 py-3 shadow-sm"
								>
									<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
										<Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
									</div>
									<span className="text-sm text-foreground leading-snug">{benefit}</span>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Main Content Section */}
			<section className="py-12 md:py-16">
				<div className="_container">
					<div className="w-full">
						{/* Main Content */}
						<article className="min-w-0">
							{/* Main Description */}
							{product.description?.trim() && (
								<div
									className="prose prose-slate max-w-none mb-10 prose-headings:text-secondary prose-p:text-muted-foreground prose-li:text-muted-foreground"
									dangerouslySetInnerHTML={{ __html: product.description }}
								/>
							)}

							{/* Extended Description */}
							{product.productDescription?.trim() && (
								<div
									className="prose prose-slate max-w-none mb-10 prose-headings:text-secondary prose-p:text-muted-foreground prose-li:text-muted-foreground"
									dangerouslySetInnerHTML={{ __html: product.productDescription }}
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

							{/* Additional Description (above FAQ) */}
							{product.additionalDescription?.trim() && (
								<div className="mb-12">
									{product.additionalDescriptionTitle?.trim() && (
										<h2 className="text-2xl font-light text-secondary mb-4">
											{product.additionalDescriptionTitle}
										</h2>
									)}
									<div
										className="prose prose-slate max-w-none prose-headings:text-secondary prose-p:text-muted-foreground prose-li:text-muted-foreground"
										dangerouslySetInnerHTML={{ __html: product.additionalDescription }}
									/>
								</div>
							)}

							{/* FAQ Section */}
							{product.qa && product.qa.length > 0 && (
								<div className="mb-12">
									<ProductFAQ faqs={product.qa} title={product.faqTitle} />
								</div>
							)}

							{/* Technical Specifications Section */}
							{product.techSpecifications && product.techSpecifications.length > 0 && (
								<div className="mb-12">
									<h2 className="text-2xl font-light text-secondary mb-6">Tekniska specifikationer</h2>
									<div className="overflow-hidden rounded-xl border border-primary/20">
										{product.techSpecifications.map((spec, index) => (
											<div
												key={spec._id || index}
												className={`flex flex-col sm:flex-row gap-2 px-5 py-4 ${index % 2 === 0 ? "bg-primary/5" : "bg-white"}`}
											>
												<span className="text-sm font-semibold text-secondary w-full sm:w-2/5 shrink-0">{spec.title}</span>
												<span className="text-sm text-muted-foreground">{spec.description}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Documentation / Brochure Section - CTA style (always visible) */}
							<div className="mb-12">
								<div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 shadow-sm">
									{/* Decorative icon backdrop */}
									<div className="pointer-events-none absolute -right-6 -top-6 opacity-10">
										<FileText className="h-32 w-32 text-primary" />
									</div>

									<div className="relative">
										<div className="mb-1 flex items-center gap-2">
											<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
												<FileText className="h-5 w-5" />
											</span>
											<h2 className="text-xl sm:text-2xl font-bold text-secondary">
												Broschyrer & Dokumentation
											</h2>
										</div>
										<p className="mb-5 text-sm text-secondary/70 max-w-2xl">
											Ladda ner produktbroschyrer och teknisk dokumentation – fyll i
											dina uppgifter så skickar vi materialet direkt till dig.
										</p>

										<div className="flex flex-wrap gap-3">
											{product.documentation && product.documentation.length > 0 ? (
												product.documentation.map((doc, i) => (
													<button
														key={i}
														type="button"
														onClick={() => setBrochureModal({ open: true, title: doc.title })}
														className="group inline-flex items-center gap-2.5 rounded-xl btn-copper-gradient px-5 py-3 text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
													>
														<Download className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5" />
														{doc.title || "Broschyr"}
													</button>
												))
											) : (
												<button
													type="button"
													onClick={() => setBrochureModal({ open: true, title: product.title })}
													className="group inline-flex items-center gap-2.5 rounded-xl btn-copper-gradient px-5 py-3 text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
												>
													<Download className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5" />
													Begär broschyr
												</button>
											)}
										</div>
									</div>
								</div>
							</div>

						</article>

						{/* Sidebar - Mobile only */}
						<aside className="sticky top-28 self-start space-y-4 block md:hidden">
							<ProductDetailSidebar
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
					productCategorySlug={productCategorySlug}
					categoryName={baseLabel}
					purchaseTitle={product.purchaseInfo?.title}
					purchaseDescription={product.purchaseInfo?.description}
					formSubtitle={product.purchaseInfo?.formSubtitle}
					buttonText={product.purchaseInfo?.buttonText}
					contactPhone={contactPhone}
					contactEmail={contactEmail}
					bgMobile={product.inquiryBgMobile || defaultInquiryBgMobile || undefined}
					bgDesktop={product.inquiryBgDesktop || defaultInquiryBgDesktop || undefined}
				/>
			</div>

			{/* Brochure Request Modal */}
			<BrochureRequestModal
				open={brochureModal.open}
				onOpenChange={(val) => setBrochureModal({ open: val })}
				productName={product.title}
				productSlug={product.slug}
				documentTitle={brochureModal.title}
			/>

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
