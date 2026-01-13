"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
	Home,
	ChevronRight,
	CheckCircle,
	Star,
	ArrowRight,
	Quote,
	Target,
	Award,
	Users,
	Sparkles,
	type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ImageComponent } from "@/components/common/image-component";
import type { AboutPageData } from "@/lib/repositories/about-page.repository";

interface AboutPageClientProps {
	data: AboutPageData;
}

// Icon mapping for mission features
const ICON_MAP: Record<string, LucideIcon> = {
	Target,
	Award,
	Users,
	Sparkles,
	CheckCircle,
	Star,
};

export function AboutPageClient({ data }: AboutPageClientProps) {
	// Set navbar to dark-hero variant
	useSetNavbarVariant("dark-hero");

	const visibility = data.sectionVisibility || {
		hero: true,
		mission: true,
		stats: true,
		imageGallery: true,
		faq: true,
		testimonials: true,
		partners: true,
		cta: true,
	};

	// Check if we have content to display
	const hasHero = data.hero?.badge || data.hero?.title || data.hero?.subtitle;
	const hasMission =
		data.mission?.title ||
		data.mission?.description ||
		(data.mission?.features && data.mission.features.length > 0);
	const hasStats =
		data.stats && data.stats.filter((s) => s.value && s.label).length > 0;
	const hasImageGallery =
		data.imageGallery?.images && data.imageGallery.images.length > 0;
	const hasFaq =
		data.faq?.items && data.faq.items.filter((f) => f.question).length > 0;
	const hasTestimonials =
		data.testimonials?.testimonials &&
		data.testimonials.testimonials.filter((t) => t.quote).length > 0;
	const hasPartners =
		data.partners?.partners &&
		data.partners.partners.filter((p) => p.logo).length > 0;
	const hasCta =
		data.cta?.title ||
		data.cta?.description ||
		data.cta?.primaryCta?.text;

	const validStats = (data.stats || []).filter((s) => s.value && s.label);
	const validImages = (data.imageGallery?.images || []).filter((i) => i.src);
	const validFaqItems = (data.faq?.items || []).filter((f) => f.question);
	const validTestimonials = (data.testimonials?.testimonials || []).filter(
		(t) => t.quote
	);
	const validPartners = (data.partners?.partners || []).filter((p) => p.logo);
	const validFeatures = (data.mission?.features || []).filter((f) => f.title);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Dark Hero Section */}
			{visibility.hero && hasHero && (
				<section className="relative overflow-hidden bg-secondary pt-32 pb-20 md:pt-36 md:pb-24">
					{/* Abstract Geometric Overlay */}
					<div className="absolute inset-0 opacity-10">
						<svg
							className="absolute top-0 left-0 w-full h-full"
							viewBox="0 0 1440 560"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid slice"
						>
							<motion.path
								d="M-100 300 Q 200 100, 400 300 T 800 300 T 1200 300 T 1600 300"
								stroke="currentColor"
								strokeWidth="1"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 0.6 }}
								transition={{ duration: 2, ease: "easeInOut" }}
							/>
							<motion.path
								d="M-100 350 Q 250 150, 500 350 T 900 350 T 1300 350 T 1700 350"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 0.4 }}
								transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
							/>
							<motion.path
								d="M-100 250 Q 150 50, 350 250 T 750 250 T 1150 250 T 1550 250"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 0.3 }}
								transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
							/>
						</svg>
					</div>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/80" />

					<div className="_container relative z-10">
						<motion.div
							initial="initial"
							animate="animate"
							variants={staggerContainer}
							className="max-w-4xl mx-auto text-center"
						>
							{/* Breadcrumb */}
							<motion.nav
								variants={fadeUp}
								className="mb-6 flex items-center justify-center gap-2 text-sm"
								aria-label="Breadcrumb"
							>
								<Link
									href="/"
									className="flex items-center gap-1 text-white/60 hover:text-primary transition-colors"
								>
									<Home className="h-4 w-4" />
									<span>Hem</span>
								</Link>
								<ChevronRight className="h-4 w-4 text-white/40" />
								<span className="text-white font-medium">Om Oss</span>
							</motion.nav>

							{/* Badge */}
							{data.hero?.badge && (
								<motion.div
									variants={fadeUp}
									className="mb-4 inline-flex items-center gap-2"
								>
									<span className="text-primary">&larr;</span>
									<span className="text-sm font-medium text-white/60">
										{data.hero.badge}
									</span>
									<span className="text-primary">&rarr;</span>
								</motion.div>
							)}

							{/* Title */}
							{data.hero?.title && (
								<motion.h1
									variants={fadeUp}
									className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
								>
									{data.hero.title}
								</motion.h1>
							)}

							{/* Subtitle */}
							{data.hero?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="mt-4 text-lg text-white/70 max-w-2xl mx-auto"
								>
									{data.hero.subtitle}
								</motion.p>
							)}
						</motion.div>
					</div>

				</section>
			)}

			{/* Stats Section */}
			{visibility.stats && hasStats && (
				<section className="py-16 md:py-20 bg-slate-50">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex flex-wrap justify-center items-center gap-0 -mx-8"
						>
							{validStats.map((stat, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="group relative w-72 h-72 -mx-8"
								>
									<div className="absolute inset-0 rounded-full bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-500 border border-slate-200 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-[#DBA480]">
										<p className="text-5xl font-bold mb-3 transition-colors duration-300 text-secondary group-hover:text-[#DBA480]">
											{stat.value}
											{stat.suffix && (
												<span className="text-3xl">{stat.suffix}</span>
											)}
										</p>
										<p className="text-secondary font-medium text-center px-8 leading-relaxed">
											{stat.label}
										</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Mission Section */}
			{visibility.mission && hasMission && (
				<section className="py-16 md:py-20 lg:py-24">
					<div className="_container">
						{/* Header */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{data.mission?.badge && (
								<motion.div
									variants={fadeUp}
									className="mb-4 inline-flex items-center gap-2 text-sm text-primary font-medium"
								>
									<span className="w-8 h-px bg-primary" />
									{data.mission.badge}
								</motion.div>
							)}

							{data.mission?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-secondary mb-4"
								>
									{data.mission.title}
								</motion.h2>
							)}

							{data.mission?.description && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-3xl mx-auto leading-relaxed"
								>
									{data.mission.description}
								</motion.p>
							)}
						</motion.div>

						{/* 2-Column Layout: Image on Left, Cards on Right */}
						<div className="grid gap-8 lg:grid-cols-2 items-center">
							{/* Left - Large Image */}
							<motion.div
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="relative h-full"
							>
								<div className="rounded-2xl overflow-hidden shadow-2xl h-full min-h-[600px]">
									<ImageComponent
										src="/images/mission-section-image.jpg"
										alt="Vår mission"
										width={600}
										height={800}
										className="w-full h-full object-cover"
									/>
								</div>
							</motion.div>

							{/* Right - Features Grid (2x2) */}
							{validFeatures.length > 0 && (
								<div className="grid gap-6 sm:grid-cols-2">
									{validFeatures.map((feature, index) => {
											const IconComponent = feature.icon
												? ICON_MAP[feature.icon] || CheckCircle
												: CheckCircle;

											// Check if this is an image-based card
											if (feature.image) {
												return (
													<div
														key={index}
														className="relative rounded-xl overflow-hidden group cursor-pointer h-[280px]"
													>
														{/* Background Image with Overlay */}
														<div className="absolute inset-0">
															<ImageComponent
																src={feature.image}
																alt={feature.title || ""}
																width={600}
																height={400}
																className="w-full h-full object-cover"
															/>
															<div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/80 to-secondary/70" />
														</div>

														{/* Content */}
														<div className="relative h-full flex flex-col justify-between p-6">
															{/* Icon in speech bubble style */}
															<div className="inline-flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center">
																<IconComponent className="w-7 h-7 text-white" />
															</div>

															{/* Title and Description */}
															<div className="mt-auto">
																<h3 className="text-2xl font-bold text-white mb-3">
																	{feature.title}
																</h3>
																{feature.description && (
																	<p className="text-white/80 text-sm leading-relaxed mb-4">
																		{feature.description}
																	</p>
																)}

																{/* Discover More Button */}
																{feature.buttonText && (
																	<Link
																		href={feature.buttonLink || "#"}
																		className="inline-flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all"
																	>
																		{feature.buttonText}
																		<ArrowRight className="w-4 h-4" />
																	</Link>
																)}
															</div>
														</div>
													</div>
												);
											}

											// Regular card design
											return (
												<div
													key={index}
													className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/80 hover:border-primary/30 transition-colors"
												>
													<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
														<IconComponent className="w-5 h-5 text-primary" />
													</div>
													<div>
														<h3 className="font-semibold text-secondary">
															{feature.title}
														</h3>
														{feature.description && (
															<p className="text-sm text-muted-foreground mt-1">
																{feature.description}
															</p>
														)}
													</div>
												</div>
											);
									})}
								</div>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Image Gallery Section */}
			{visibility.imageGallery && hasImageGallery && (
				<section className="py-16 md:py-20 bg-white">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{data.imageGallery?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-secondary mb-4"
								>
									{data.imageGallery.title}
								</motion.h2>
							)}
							{data.imageGallery?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{data.imageGallery.subtitle}
								</motion.p>
							)}
						</motion.div>

						{/* Gallery Grid */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
						>
							{validImages.map((image, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className={`relative rounded-2xl overflow-hidden shadow-lg group ${
										index === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
									}`}
								>
									<ImageComponent
										src={image.src || ""}
										alt={image.alt || `Bild ${index + 1}`}
										width={index === 0 ? 600 : 400}
										height={index === 0 ? 600 : 300}
										className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* FAQ Section */}
			{visibility.faq && hasFaq && (
				<section className="py-16 md:py-20 lg:py-24">
					<div className="_container">
						<div className="max-w-3xl mx-auto">
							<motion.div
								variants={staggerContainer}
								initial="initial"
								whileInView="animate"
								viewport={{ once: true }}
								className="text-center mb-12"
							>
								{data.faq?.title && (
									<motion.h2
										variants={fadeUp}
										className="text-3xl md:text-4xl font-bold text-secondary mb-4"
									>
										{data.faq.title}
									</motion.h2>
								)}
								{data.faq?.subtitle && (
									<motion.p
										variants={fadeUp}
										className="text-muted-foreground"
									>
										{data.faq.subtitle}
									</motion.p>
								)}
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
							>
								<Accordion type="single" collapsible className="space-y-4">
									{validFaqItems.map((item, index) => (
										<AccordionItem
											key={index}
											value={`faq-${index}`}
											className="bg-white rounded-xl border border-slate-200/80 px-6 overflow-hidden transition-all duration-300 data-[state=open]:bg-[#DBA480] data-[state=open]:border-[#DBA480]"
										>
											<AccordionTrigger className="text-left font-semibold text-secondary hover:text-primary py-5 data-[state=open]:text-white">
												{item.question}
											</AccordionTrigger>
											<AccordionContent className="text-muted-foreground pb-5 data-[state=open]:text-white/90">
												{item.answer}
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</motion.div>
						</div>
					</div>
				</section>
			)}

			{/* Testimonials Section */}
			{visibility.testimonials && hasTestimonials && (
				<section className="py-16 md:py-20 lg:py-24 bg-secondary">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{data.testimonials?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-white mb-4"
								>
									{data.testimonials.title}
								</motion.h2>
							)}
							{data.testimonials?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-white/70 max-w-2xl mx-auto"
								>
									{data.testimonials.subtitle}
								</motion.p>
							)}
						</motion.div>

						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
						>
							{validTestimonials.map((testimonial, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
								>
									{/* Rating */}
									{testimonial.rating && (
										<div className="flex gap-1 mb-4">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`w-4 h-4 ${
														i < (testimonial.rating || 0)
															? "text-yellow-400 fill-yellow-400"
															: "text-white/20"
													}`}
												/>
											))}
										</div>
									)}

									{/* Quote */}
									<Quote className="w-8 h-8 text-primary/40 mb-3" />
									<p className="text-white/90 mb-6 leading-relaxed">
										{testimonial.quote}
									</p>

									{/* Author */}
									<div className="flex items-center gap-4">
										{testimonial.image ? (
											<Image
												src={testimonial.image}
												alt={testimonial.author || ""}
												width={48}
												height={48}
												className="rounded-full object-cover"
											/>
										) : (
											<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
												<span className="text-lg font-bold text-primary">
													{(testimonial.author || "?")[0]}
												</span>
											</div>
										)}
										<div>
											<p className="font-semibold text-white">
												{testimonial.author}
											</p>
											{(testimonial.role || testimonial.company) && (
												<p className="text-sm text-white/60">
													{testimonial.role}
													{testimonial.role && testimonial.company && " - "}
													{testimonial.company}
												</p>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Partners Section */}
			{visibility.partners && hasPartners && (
				<section className="py-16 md:py-20">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{data.partners?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-secondary mb-4"
								>
									{data.partners.title}
								</motion.h2>
							)}
							{data.partners?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{data.partners.subtitle}
								</motion.p>
							)}
						</motion.div>

						{/* Partners Logo Grid */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
						>
							{validPartners.map((partner, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="flex items-center justify-center"
								>
									{partner.url ? (
										<a
											href={partner.url}
											target="_blank"
											rel="noopener noreferrer"
											className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
										>
											<Image
												src={partner.logo || ""}
												alt={partner.name || `Partner ${index + 1}`}
												width={150}
												height={60}
												className="max-h-12 w-auto object-contain"
											/>
										</a>
									) : (
										<div className="grayscale opacity-60">
											<Image
												src={partner.logo || ""}
												alt={partner.name || `Partner ${index + 1}`}
												width={150}
												height={60}
												className="max-h-12 w-auto object-contain"
											/>
										</div>
									)}
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* CTA Section */}
			{visibility.cta && hasCta && (
				<section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="max-w-3xl mx-auto text-center"
						>
							{data.cta?.title && (
								<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
									{data.cta.title}
								</h2>
							)}
							{data.cta?.description && (
								<p className="text-muted-foreground mb-8 text-lg">
									{data.cta.description}
								</p>
							)}
							{(data.cta?.primaryCta?.text || data.cta?.secondaryCta?.text) && (
								<div className="flex flex-wrap justify-center gap-4">
									{data.cta?.primaryCta?.text && data.cta?.primaryCta?.href && (
										<Button asChild size="lg" className="group">
											<Link href={data.cta.primaryCta.href}>
												{data.cta.primaryCta.text}
												<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
											</Link>
										</Button>
									)}
									{data.cta?.secondaryCta?.text &&
										data.cta?.secondaryCta?.href && (
											<Button asChild variant="outline" size="lg">
												<Link href={data.cta.secondaryCta.href}>
													{data.cta.secondaryCta.text}
												</Link>
											</Button>
										)}
								</div>
							)}
						</motion.div>
					</div>
				</section>
			)}
		</div>
	);
}
