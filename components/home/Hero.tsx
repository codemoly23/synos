"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageComponent } from "../common/image-component";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import type { IHeroSection, IHeroSlide } from "@/models/home-page.model";

// Icon mapping for trust indicators
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	ShieldCheck,
	Star,
};

interface HeroProps {
	data: IHeroSection;
}

export function Hero({ data }: HeroProps) {
	const slides = data.slides || [];
	const hasSlides = slides.length > 0;

	// Carousel state
	const [currentSlide, setCurrentSlide] = useState(0);

	const nextSlide = useCallback(() => {
		if (slides.length > 1) {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}
	}, [slides.length]);

	// Auto-slide every 5 seconds
	useEffect(() => {
		if (slides.length <= 1) return;
		const interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	}, [nextSlide, slides.length]);

	// Current slide data
	const slide: IHeroSlide | undefined = hasSlides ? slides[currentSlide] : undefined;

	// Determine background state
	const hasBackgroundImage = !!slide?.backgroundImage;
	const isDarkBackground = hasBackgroundImage;

	// Set navbar variant based on background
	useSetNavbarVariant(isDarkBackground ? "dark-hero" : "default");

	// Check per-slide content
	const hasFloatingCard = slide?.floatingCard?.image && slide?.floatingCard?.label;
	const hasCertificationCard = slide?.certificationCard?.title && slide?.certificationCard?.subtitle;
	const hasMainImage = !!slide?.mainImage;

	if (!hasSlides) {
		return (
			<section className="relative w-full overflow-hidden padding-top pb-4 lg:pb-8 min-h-[65svh] lg:min-h-0 bg-slate-100">
				<div className="z-10 absolute inset-0 bg-[url('/image.png')] opacity-5 bg-no-repeat bg-cover bg-center" />
				<div className="relative z-20 _container flex items-center justify-center min-h-[60vh]">
					<p className="text-slate-400 text-lg">No hero slides configured.</p>
				</div>
			</section>
		);
	}

	return (
		<section className={`relative w-full overflow-hidden padding-top pb-4 lg:pb-8 min-h-[65svh] lg:min-h-0 ${
			isDarkBackground ? 'bg-slate-900' : 'bg-slate-100'
		}`}>
			{/* Background Image Carousel */}
			{hasBackgroundImage && (
				<div className="absolute inset-0 z-0">
					<AnimatePresence mode="popLayout">
						{slides.map((s, index) =>
							index === currentSlide && s.backgroundImage ? (
								<motion.div
									key={index}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 1, ease: "easeInOut" }}
									className="absolute inset-0"
								>
									<ImageComponent
										src={s.backgroundImage}
										alt={`Hero slide ${index + 1}`}
										height={0}
										width={0}
										sizes="100vw"
										wrapperClasses="w-full h-full"
										className="object-cover w-full h-full opacity-40"
									/>
								</motion.div>
							) : null
						)}
					</AnimatePresence>
					<div className="absolute inset-0 bg-slate-900/60 z-1" />
				</div>
			)}

			{/* Pattern Overlay - only show if no background image */}
			{!hasBackgroundImage && (
				<div className="z-10 absolute inset-0 bg-[url('/image.png')] opacity-5 bg-no-repeat bg-cover bg-center" />
			)}

			{/* Mobile Hero Image (full-height on mobile) */}
			{slide?.mobileImage && (
				<div className="lg:hidden absolute inset-0 z-0">
					<AnimatePresence mode="popLayout">
						{slides.map((s, index) =>
							index === currentSlide && s.mobileImage ? (
								<motion.div
									key={index}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 1, ease: "easeInOut" }}
									className="absolute inset-0"
								>
									<ImageComponent
										src={s.mobileImage}
										alt={`Hero slide ${index + 1} mobile`}
										height={0}
										width={0}
										sizes="100vw"
										wrapperClasses="w-full h-full"
										className="object-cover w-full h-full"
									/>
								</motion.div>
							) : null
						)}
					</AnimatePresence>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-100/40 via-transparent to-transparent" />
				</div>
			)}

			{/* Slide Indicators */}
			{slides.length > 1 && (
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`h-2 rounded-full transition-all duration-300 ${
								index === currentSlide
									? "w-8 bg-primary"
									: "w-2 bg-white/50 hover:bg-white/80"
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}

			<div className="relative z-20 _container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				{/* Left Content - Animated per slide */}
				<AnimatePresence mode="wait">
					<motion.div
						key={currentSlide}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="flex flex-col gap-6 lg:gap-8 max-w-2xl"
					>
						{/* Trust Badge */}
						{slide?.badge && (
							<div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-green-50 border border-green-200 animate-pulse tracking-widest">
								<span className="flex h-2 w-2 rounded-full bg-primary" />
								<span className="text-[9px] font-semibold text-primary uppercase leading-relaxed">
									{slide.badge}
								</span>
							</div>
						)}

						{/* Heading */}
						{(slide?.title || slide?.titleHighlight) && (
							<h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight ${
								isDarkBackground ? 'text-white' : 'text-secondary'
							}`}>
								{slide?.title} <br />
								{slide?.titleHighlight && (
									<span className="text-gradient-primary text-2xl sm:text-3xl lg:text-4xl">
										{slide.titleHighlight}
									</span>
								)}
							</h1>
						)}

						{/* Description */}
						{slide?.subtitle && (
							<p className={`text-lg leading-relaxed max-w-xl ${
								isDarkBackground ? 'text-slate-200' : 'text-slate-600'
							}`}>
								{slide.subtitle}
							</p>
						)}

						{/* Actions */}
						<div className="flex flex-wrap gap-4 pt-2">
							{slide?.primaryCta?.text && slide?.primaryCta?.href && (
								<Button
									asChild
									size="lg"
									className="bg-primary hover:bg-primary-hover text-white rounded-full cursor-pointer px-8 h-12 text-base shadow-lg shadow-primary/20"
								>
									<Link href={slide.primaryCta.href}>
										{slide.primaryCta.text}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							)}
							{slide?.secondaryCta?.text && slide?.secondaryCta?.href && (
								<Button
									asChild
									variant="outline"
									size="lg"
									className={`rounded-full px-8 h-12 text-base ${
										isDarkBackground
											? 'border-white/30 text-white hover:bg-white/10 hover:border-white'
											: 'border-secondary/20 text-secondary hover:bg-secondary/5'
									}`}
								>
									<Link href={slide.secondaryCta.href}>
										{slide.secondaryCta.text}
									</Link>
								</Button>
							)}
						</div>

						{/* Trust Indicators */}
						{slide?.trustIndicators && slide.trustIndicators.length > 0 && (
							<div className={`flex items-center gap-6 pt-6 text-sm ${
								isDarkBackground ? 'text-slate-300' : 'text-slate-600'
							}`}>
								{slide.trustIndicators
									.filter((ind) => ind.icon && ind.text)
									.map((indicator, index) => {
										const IconComponent = indicator.icon
											? iconMap[indicator.icon] || ShieldCheck
											: ShieldCheck;
										return (
											<div key={index} className="flex items-center gap-2">
												<IconComponent className="h-5 w-5 text-success" />
												<span>{indicator.text}</span>
											</div>
										);
									})}
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Right Content - Main Image + Floating Cards - Animated per slide */}
				{hasMainImage && (
					<AnimatePresence mode="wait">
						<motion.div
							key={currentSlide}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="relative h-[500px] lg:h-[600px] w-full hidden lg:block"
						>
							{/* Main Image */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] z-10">
								<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white">
									<ImageComponent
										src={slide!.mainImage!}
										alt="Hero Image"
										height={0}
										width={0}
										sizes="100vw"
										wrapperClasses="w-full h-full"
										className="object-cover w-full h-full"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-secondary/40 to-transparent pointer-events-none" />
								</div>
							</div>

							{/* Floating Detail Card (Top Right) */}
							{hasFloatingCard && (
								<motion.div
									initial={{ opacity: 0, y: 20, x: -20 }}
									animate={{ opacity: 1, y: 0, x: 0 }}
									transition={{ duration: 0.8, delay: 0.3 }}
									className="absolute top-[5%] right-[5%] w-45 h-48 z-20 hover:scale-[1.01] duration-300"
								>
									<div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/50 bg-white p-0">
										<div className="w-full h-full rounded-lg overflow-hidden relative">
											<ImageComponent
												src={slide!.floatingCard!.image!}
												alt={slide!.floatingCard!.label!}
												height={0}
												width={0}
												sizes="100vw"
												wrapperClasses="w-full h-full"
												className="object-cover w-full h-full"
											/>
											<div className="absolute bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-sm p-2 text-center rounded-b-xl">
												<span className="text-xs font-medium text-white">
													{slide!.floatingCard!.label}
												</span>
											</div>
										</div>
									</div>
								</motion.div>
							)}

							{/* Certification Card (Bottom Left) */}
							{hasCertificationCard && (
								<motion.div
									initial={{ opacity: 0, y: -20, x: 20 }}
									animate={{ opacity: 1, y: 0, x: 0 }}
									transition={{ duration: 0.8, delay: 0.5 }}
									className="absolute bottom-[15%] left-[5%] w-64 h-auto z-20"
								>
									<div className="glass-card w-full rounded-xl p-4 flex flex-col gap-3 bg-white/90 backdrop-blur-md border-white/40 shadow-xl">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
												<ShieldCheck className="h-5 w-5 text-primary" />
											</div>
											<div>
												<div className="text-sm font-bold text-secondary">
													{slide!.certificationCard!.title}
												</div>
												<div className="text-xs text-muted-foreground">
													{slide!.certificationCard!.subtitle}
												</div>
											</div>
										</div>
										{slide?.certificationCard?.progressLabel &&
											slide?.certificationCard?.progressValue && (
												<div className="space-y-2">
													<div className="flex justify-between text-xs mb-1">
														<span className="text-muted-foreground">
															{slide.certificationCard.progressLabel}
														</span>
														<span className="font-bold text-secondary">
															{slide.certificationCard.progressValue}
														</span>
													</div>
													{slide.certificationCard.progressPercentage !== undefined && (
														<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
															<div
																className="h-full bg-primary rounded-full"
																style={{
																	width: `${slide.certificationCard.progressPercentage}%`,
																}}
															/>
														</div>
													)}
												</div>
											)}
									</div>
								</motion.div>
							)}
						</motion.div>
					</AnimatePresence>
				)}
			</div>
		</section>
	);
}
