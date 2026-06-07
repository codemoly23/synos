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
		product.featureSections
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
						{/* <div className="absolute inset-x-0 top-[6%] h-[50vh] z-10 flex items-center justify-center">
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
						</div> */}
					</div>
					{/* Mobile text */}
					<div className="lg:hidden relative z-10 px-6 py-8 pb-12 -mt-[28vh]">
						<h1 className="text-5xl font-sans font-light text-white mb-3 leading-tight">
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
								src={product.heroBackgroundDesktop || "/images/Product detail breadcrumbs background.jpeg"}
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
									{/* Product image — anchored to floor */}
									{/* <div className="relative w-full h-[620px] z-10">
										<ImageComponent
											src="/images/motus.png"
											alt="Motus Pro"
											fill
											className="object-contain object-bottom"
											priority
											sizes="700px"
										/>
									</div> */}
									{/* Contact shadow + floor reflection */}
									{/* <div className="relative z-10 w-full shrink-0 -mt-3">
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
									</div> */}
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
						<div className="relative z-10 grid grid-cols-2 items-center min-h-[640px] lg:min-h-[740px] gap-8">
							<div />
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
					<div className="w-full">
						{/* Main Content */}
						<article className="min-w-0">
							{/* Before & After Section */}
							{product.beforeAfterImages &&
								product.beforeAfterImages.length > 0 && (
									<BeforeAfterShowcase
										pairs={product.beforeAfterImages}
										productName={product.title}
									/>
								)}

							{/* FAQ Section */}
							{product.qa && product.qa.length > 0 && (
								<div className="mb-12">
									<ProductFAQ faqs={product.qa} title={product.faqTitle} />
								</div>
							)}

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
					categoryName={baseLabel}
					purchaseTitle={product.purchaseInfo?.title}
					purchaseDescription={product.purchaseInfo?.description}
					formSubtitle={product.purchaseInfo?.formSubtitle}
					buttonText={product.purchaseInfo?.buttonText}
					productImage={product.overviewImage}
					contactPhone={contactPhone}
					contactEmail={contactEmail}
					bgMobile={product.inquiryBgMobile || undefined}
					bgDesktop={product.inquiryBgDesktop || undefined}
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
