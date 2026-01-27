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
	MessageCircle,
	Phone,
	Mail,
	MapPin,
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
				<section className="relative overflow-hidden bg-secondary pt-28 pb-8 md:pt-36 md:pb-16 lg:pb-20">
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
						</motion.div>
					</div>

				</section>
			)}

			{/* Mission Quote Section - Above Stats */}
			{data.hero?.subtitle && (
				<section className="py-6 md:py-12 lg:py-16 bg-slate-50">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="max-w-5xl mx-auto text-center"
						>
							{/* Badge */}
							<div className="mb-4 md:mb-8 inline-flex items-center gap-3">
								<span className="text-secondary/60">●</span>
								<span className="text-sm font-medium text-secondary/80 uppercase tracking-[0.2em]">
									Vårt Uppdrag
								</span>
								<span className="text-secondary/60">●</span>
							</div>

							{/* Quote - Italic with highlighted words */}
							<h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-secondary leading-relaxed italic">
								Sveriges ledande leverantör av professionell{" "}
								<span className="text-primary">klinikutrustning</span> och{" "}
								<span className="text-primary">lasermaskiner</span>. Vi kombinerar
								kvalitetsprodukter med utbildning och support i världsklass.
							</h2>
						</motion.div>
					</div>
				</section>
			)}

			{/* Stats Section */}
			{visibility.stats && hasStats && (
				<section className="py-6 md:py-12 lg:py-16 bg-slate-50">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex flex-wrap justify-center items-center gap-4 md:gap-0 md:-mx-8"
						>
							{validStats.map((stat, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="group relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 md:-mx-8"
								>
									{/* Rotating gradient border on hover */}
									<div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
										<div
											className="stat-gradient-border absolute inset-0 rounded-full"
											style={{
												background: "conic-gradient(from 0deg, #DCA783, #2C2D38, #DCA783, #2C2D38, #DCA783)",
											}}
										/>
									</div>
									{/* Inner white circle content */}
									<div className="absolute inset-[6px] rounded-full bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]">
										<p className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 transition-colors duration-300 text-secondary group-hover:text-primary">
											{stat.value}
											{stat.suffix && (
												<span className="text-xl md:text-2xl lg:text-3xl">{stat.suffix}</span>
											)}
										</p>
										<p className="text-secondary font-medium text-center px-4 md:px-8 leading-relaxed text-xs md:text-sm lg:text-base">
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
				<section className="relative py-16 md:py-20 lg:py-24 bg-secondary overflow-hidden">
					{/* Wave Pattern Background */}
					<div className="absolute inset-0 opacity-20">
						<svg
							className="absolute top-0 left-0 w-full h-full"
							viewBox="0 0 1440 800"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid slice"
						>
							<motion.path
								d="M-100 400 Q 200 200, 400 400 T 800 400 T 1200 400 T 1600 400"
								stroke="currentColor"
								strokeWidth="1"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								whileInView={{ pathLength: 1, opacity: 0.6 }}
								viewport={{ once: true }}
								transition={{ duration: 2, ease: "easeInOut" }}
							/>
							<motion.path
								d="M-100 450 Q 250 250, 500 450 T 900 450 T 1300 450 T 1700 450"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								whileInView={{ pathLength: 1, opacity: 0.4 }}
								viewport={{ once: true }}
								transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
							/>
							<motion.path
								d="M-100 350 Q 150 150, 350 350 T 750 350 T 1150 350 T 1550 350"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								whileInView={{ pathLength: 1, opacity: 0.3 }}
								viewport={{ once: true }}
								transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
							/>
							<motion.path
								d="M-100 500 Q 300 300, 600 500 T 1000 500 T 1400 500 T 1800 500"
								stroke="currentColor"
								strokeWidth="0.3"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								whileInView={{ pathLength: 1, opacity: 0.2 }}
								viewport={{ once: true }}
								transition={{ duration: 3, ease: "easeInOut", delay: 0.7 }}
							/>
						</svg>
					</div>

					<div className="_container relative z-10">
						{/* Header */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-left mb-12"
						>
							{data.mission?.badge && (
								<motion.div
									variants={fadeUp}
									className="mb-4 inline-flex items-center gap-2 text-sm text-white font-medium"
								>
									<span className="text-primary">●</span>
									{data.mission.badge}
									<span className="text-primary">●</span>
								</motion.div>
							)}

							{data.mission?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-white mb-4"
								>
									{data.mission.title}
								</motion.h2>
							)}

							{data.mission?.description && (
								<motion.p
									variants={fadeUp}
									className="text-white/70 max-w-3xl leading-relaxed"
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
													className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-colors"
												>
													<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
														<IconComponent className="w-5 h-5 text-primary" />
													</div>
													<div>
														<h3 className="font-semibold text-white">
															{feature.title}
														</h3>
														{feature.description && (
															<p className="text-sm text-white/70 mt-1">
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

			{/* Trusted Business Partner Section */}
			<section className="py-16 md:py-20 lg:py-24 bg-slate-100 overflow-hidden">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12"
					>
						{/* Badge */}
						<div className="mb-4 inline-flex items-center gap-3">
							<span className="text-secondary/60">●</span>
							<span className="text-sm font-medium text-secondary/80 uppercase tracking-[0.2em]">
								Our Company
							</span>
							<span className="text-secondary/60">●</span>
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary">
							Trusted Business Partner
						</h2>
					</motion.div>
				</div>

				{/* Marquee Container */}
				<div className="space-y-6">
					{/* Row 1 - Left to Right */}
					<div className="partner-marquee">
						<div className="partner-marquee-track animate-marquee-left">
							{[...Array(2)].map((_, setIndex) => (
								<div key={setIndex} className="flex gap-6">
									{[
										"Growth",
										"Hertz",
										"GrowTech",
										"Company",
										"Finance Plus",
										"Narrow",
										"TeamWork",
										"TechCorp",
										"MediaFlow",
										"DataSync",
									].map((name, index) => (
										<div
											key={`${setIndex}-${index}`}
											className="flex-shrink-0 w-[200px] h-[100px] bg-white rounded-xl flex items-center justify-center px-6 shadow-sm"
										>
											<span className="text-xl font-bold text-slate-400">
												{name}
											</span>
										</div>
									))}
								</div>
							))}
						</div>
					</div>

					{/* Row 2 - Right to Left */}
					<div className="partner-marquee">
						<div className="partner-marquee-track animate-marquee-right">
							{[...Array(2)].map((_, setIndex) => (
								<div key={setIndex} className="flex gap-6">
									{[
										"CloudBase",
										"NetPro",
										"SecureIT",
										"AppWorks",
										"DigiLab",
										"SmartBiz",
										"CoreTech",
										"FlexSoft",
										"WebFlow",
										"CodeCraft",
									].map((name, index) => (
										<div
											key={`${setIndex}-${index}`}
											className="flex-shrink-0 w-[200px] h-[100px] bg-white rounded-xl flex items-center justify-center px-6 shadow-sm"
										>
											<span className="text-xl font-bold text-slate-400">
												{name}
											</span>
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			{visibility.faq && hasFaq && (
				<section className="py-16 md:py-20 lg:py-24 bg-slate-50">
					<div className="_container">
						<div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
							{/* Left Column - FAQ */}
							<div>
								{/* Header */}
								<motion.div
									variants={staggerContainer}
									initial="initial"
									whileInView="animate"
									viewport={{ once: true }}
									className="mb-10"
								>
									{/* Badge */}
									<motion.div
										variants={fadeUp}
										className="mb-4 inline-flex items-center gap-3"
									>
										<span className="text-secondary/60">●</span>
										<span className="text-sm font-medium text-secondary/80 uppercase tracking-[0.2em]">
											Our Faq
										</span>
										<span className="text-secondary/60">●</span>
									</motion.div>

									{data.faq?.title && (
										<motion.h2
											variants={fadeUp}
											className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4"
										>
											Answers To <span className="text-primary">Your</span> Questions
										</motion.h2>
									)}
									{data.faq?.subtitle && (
										<motion.p
											variants={fadeUp}
											className="text-muted-foreground max-w-xl"
										>
											{data.faq.subtitle}
										</motion.p>
									)}
								</motion.div>

								{/* FAQ Accordion */}
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
												className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
											>
												<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
													{item.question}
												</AccordionTrigger>
												<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
													{item.answer}
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								</motion.div>
							</div>

							{/* Right Column - Contact Card */}
							<motion.div
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="hidden lg:block"
							>
								<div className="sticky top-32 rounded-2xl overflow-hidden bg-white shadow-xl p-8">
									{/* Title */}
									<h3 className="text-xl font-bold text-secondary mb-6">
										Alltid nära dig
									</h3>

									{/* Contact Info */}
									<div className="space-y-5 mb-8">
										{/* Location */}
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
												<MapPin className="w-5 h-5 text-primary" />
											</div>
											<div>
												<p className="font-semibold text-secondary">Reach Us</p>
												<p className="text-sm text-muted-foreground">Gävlegatan 12A, 113 30 Stockholm</p>
											</div>
										</div>

										{/* Email */}
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
												<Mail className="w-5 h-5 text-primary" />
											</div>
											<div>
												<p className="font-semibold text-secondary">Drop Us Mail</p>
												<p className="text-sm text-muted-foreground">karriar@synos.se</p>
											</div>
										</div>

										{/* Phone */}
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
												<Phone className="w-5 h-5 text-primary" />
											</div>
											<div>
												<p className="font-semibold text-secondary">Connect Now</p>
												<p className="text-sm text-muted-foreground">010-205 15 01</p>
											</div>
										</div>
									</div>

									{/* Divider */}
									<div className="border-t border-slate-200 my-6" />

									{/* Contact Form */}
									<h4 className="text-lg font-bold text-secondary mb-4">
										Säg hej!
									</h4>

									<form className="space-y-4">
										{/* Name */}
										<div className="relative">
											<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
												<Users className="w-4 h-4" />
											</div>
											<input
												type="text"
												placeholder="Your Name*"
												className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
											/>
										</div>

										{/* Email */}
										<div className="relative">
											<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
												<Mail className="w-4 h-4" />
											</div>
											<input
												type="email"
												placeholder="Email Address*"
												className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
											/>
										</div>

										{/* Phone */}
										<div className="relative">
											<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
												<Phone className="w-4 h-4" />
											</div>
											<input
												type="tel"
												placeholder="Your Number*"
												className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
											/>
										</div>

										{/* Message */}
										<div className="relative">
											<div className="absolute left-4 top-4 text-muted-foreground">
												<MessageCircle className="w-4 h-4" />
											</div>
											<textarea
												placeholder="Additional Message"
												rows={4}
												className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-none"
											/>
										</div>

										{/* Submit Button */}
										<Button className="w-full bg-primary hover:bg-primary/90 text-white">
											Send Message
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</form>
								</div>
							</motion.div>
						</div>

						{/* Mobile Contact Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="lg:hidden mt-12"
						>
							<div className="rounded-2xl overflow-hidden bg-white shadow-xl p-8">
								{/* Title */}
								<h3 className="text-xl font-bold text-secondary mb-6">
									Alltid nära dig
								</h3>

								{/* Contact Info */}
								<div className="space-y-5 mb-8">
									{/* Location */}
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
											<MapPin className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold text-secondary">Reach Us</p>
											<p className="text-sm text-muted-foreground">Gävlegatan 12A, 113 30 Stockholm</p>
										</div>
									</div>

									{/* Email */}
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Mail className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold text-secondary">Drop Us Mail</p>
											<p className="text-sm text-muted-foreground">karriar@synos.se</p>
										</div>
									</div>

									{/* Phone */}
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Phone className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold text-secondary">Connect Now</p>
											<p className="text-sm text-muted-foreground">010-205 15 01</p>
										</div>
									</div>
								</div>

								{/* Contact Button */}
								<Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
									<Link href="/kontakt">
										Kontakta Oss
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				</section>
			)}

			{/* Testimonials Section */}
			{visibility.testimonials && hasTestimonials && (
				<section className="py-16 md:py-20 lg:py-24 bg-slate-50">
					<div className="_container">
						{/* Header */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{/* Badge */}
							<motion.div
								variants={fadeUp}
								className="mb-4 inline-flex items-center gap-3"
							>
								<span className="text-secondary/60">●</span>
								<span className="text-sm font-medium text-secondary/80 uppercase tracking-[0.2em]">
									Testimonial
								</span>
								<span className="text-secondary/60">●</span>
							</motion.div>

							{data.testimonials?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4"
								>
									Hear What Our Clients Say
								</motion.h2>
							)}
							{data.testimonials?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{data.testimonials.subtitle}
								</motion.p>
							)}
						</motion.div>

						{/* Main 2 Column Layout - Review Card (left) + Rating/Cooperation (right) */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="grid gap-5 lg:grid-cols-[1fr_280px]"
						>
							{/* Left Column - Review Card with 3 internal columns */}
							<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
								{/* Desktop Layout - 3 columns */}
								<div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr] h-[600px]">
									{/* Inner Column 1 - CTA */}
									<div className="p-8 relative overflow-hidden flex flex-col border-r border-slate-100">
										{/* Grid pattern background */}
										<div className="absolute inset-0 opacity-30">
											<div className="grid grid-cols-6 grid-rows-8 h-full w-full">
												{[...Array(48)].map((_, i) => (
													<div
														key={i}
														className={`border border-primary/10 ${
															[5, 11, 17, 23, 29, 35].includes(i) ? "bg-primary/20" : ""
														}`}
													/>
												))}
											</div>
										</div>

										<div className="relative z-10 h-full flex flex-col justify-center">
											<h3 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
												Trusted By Over 1300 Loyal Clients
											</h3>
											<p className="text-muted-foreground mb-6 text-sm">
												Ad litora torquent per conubia nostra inceptos himenaeos. Dis parturient montes nascetur ridiculus mus donec.
											</p>
											<Button asChild className="w-fit bg-primary hover:bg-primary/90 text-white">
												<Link href="/kontakt">
													Contact Us
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>
									</div>

									{/* Inner Column 2 - Reviews (Top to Bottom) */}
									<div className="overflow-hidden relative border-r border-slate-100">
										<div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
										<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

										<div className="testimonial-marquee-vertical h-full p-4">
											<div className="testimonial-marquee-track-down space-y-4">
												{[
													{ quote: "Luctus nibh finibus facilisis dapibus etiam interdum tortor. Tincidunt nam porta elementum.", name: "Nicole Saskia", role: "Founder", avatar: "/images/testimonial-avatar-1.jpg" },
													{ quote: "Nulla molestie mattis scelerisque maximus eget fermentum odio. Mauris pharetra.", name: "Angela Ursel", role: "Managing Director", avatar: "/images/testimonial-avatar-2.jpg" },
													{ quote: "Cras eleifend turpis fames primis vulputate ornare sagittis. Proin libero feugiat tristique.", name: "Gretel Nicole", role: "Business Owner", avatar: "/images/testimonial-avatar-3.jpg" },
													{ quote: "Pretium tellus duis convallis tempus leo eu aenean. Fringilla lacus nec metus bibendum egestas.", name: "Marie Esther", role: "Senior Manager", avatar: "/images/testimonial-avatar-4.jpg" },
													{ quote: "Donec rhoncus eros lobortis nulla molestie mattis scelerisque. Purus est efficitur laoreet.", name: "Editha Kristin", role: "CEO", avatar: "/images/testimonial-avatar-1.jpg" },
													{ quote: "Euismod quam justo lectus commodo augue arcu dignissim. Porttitor ullamcorper.", name: "Operations Manager", role: "CEO", avatar: "/images/testimonial-avatar-2.jpg" },
												].map((item, index) => (
													<div key={index} className="bg-slate-50 rounded-xl p-4">
														<Quote className="w-6 h-6 text-secondary mb-2" />
														<p className="text-muted-foreground text-sm leading-relaxed mb-3">
															{item.quote}
														</p>
														<div className="flex items-center gap-3">
															<div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
																<Image
																	src={item.avatar}
																	alt={item.name}
																	width={36}
																	height={36}
																	className="object-cover w-full h-full"
																/>
															</div>
															<div>
																<p className="font-semibold text-secondary text-sm">{item.name}</p>
																<p className="text-xs text-muted-foreground">{item.role}</p>
															</div>
														</div>
													</div>
												))}
												{/* Duplicate for seamless loop */}
												{[
													{ quote: "Luctus nibh finibus facilisis dapibus etiam interdum tortor. Tincidunt nam porta elementum.", name: "Nicole Saskia", role: "Founder", avatar: "/images/testimonial-avatar-1.jpg" },
													{ quote: "Nulla molestie mattis scelerisque maximus eget fermentum odio. Mauris pharetra.", name: "Angela Ursel", role: "Managing Director", avatar: "/images/testimonial-avatar-2.jpg" },
													{ quote: "Cras eleifend turpis fames primis vulputate ornare sagittis. Proin libero feugiat tristique.", name: "Gretel Nicole", role: "Business Owner", avatar: "/images/testimonial-avatar-3.jpg" },
													{ quote: "Pretium tellus duis convallis tempus leo eu aenean. Fringilla lacus nec metus bibendum egestas.", name: "Marie Esther", role: "Senior Manager", avatar: "/images/testimonial-avatar-4.jpg" },
													{ quote: "Donec rhoncus eros lobortis nulla molestie mattis scelerisque. Purus est efficitur laoreet.", name: "Editha Kristin", role: "CEO", avatar: "/images/testimonial-avatar-1.jpg" },
													{ quote: "Euismod quam justo lectus commodo augue arcu dignissim. Porttitor ullamcorper.", name: "Operations Manager", role: "CEO", avatar: "/images/testimonial-avatar-2.jpg" },
												].map((item, index) => (
													<div key={`dup-${index}`} className="bg-slate-50 rounded-xl p-4">
														<Quote className="w-6 h-6 text-secondary mb-2" />
														<p className="text-muted-foreground text-sm leading-relaxed mb-3">
															{item.quote}
														</p>
														<div className="flex items-center gap-3">
															<div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
																<Image
																	src={item.avatar}
																	alt={item.name}
																	width={36}
																	height={36}
																	className="object-cover w-full h-full"
																/>
															</div>
															<div>
																<p className="font-semibold text-secondary text-sm">{item.name}</p>
																<p className="text-xs text-muted-foreground">{item.role}</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Inner Column 3 - Reviews (Bottom to Top) */}
									<div className="overflow-hidden relative">
										<div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
										<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

										<div className="testimonial-marquee-vertical h-full p-4">
											<div className="testimonial-marquee-track-up space-y-4">
												{[
													{ quote: "Urna tempor pulvinar vivamus fringilla lacus nec metus. Lacinia integer nunc posuere.", name: "Kay Ludger", role: "Finance Director", avatar: "/images/testimonial-avatar-3.jpg" },
													{ quote: "Fermentum odio phasellus non purus est efficitur laoreet. Blandit quis suspendisse.", name: "Lili Alexa", role: "Marketing Director", avatar: "/images/testimonial-avatar-4.jpg" },
													{ quote: "Porta elementum a enim euismod quam justo lectus. Imperdiet mollis nullam volutpat porttitor.", name: "Mario Pascal", role: "Project Manager", avatar: "/images/testimonial-avatar-1.jpg" },
													{ quote: "Taciti sociosqu ad litora torquent per conubia nostra. Et magnis dis parturient scelerisque.", name: "Edelgard Gisa", role: "HR Director", avatar: "/images/testimonial-avatar-2.jpg" },
													{ quote: "Viverra ac tincidunt nam porta elementum a enim. Arcu dignissim velit aliquam imperdiet mollis.", name: "Arnold Willy", role: "Sales Director", avatar: "/images/testimonial-avatar-3.jpg" },
													{ quote: "Duis convallis tempus leo eu aenean sed diam. Nec metus bibendum egestas et magnis iaculis.", name: "Frieda Janine", role: "CEO", avatar: "/images/testimonial-avatar-4.jpg" },
												].map((item, index) => (
													<div key={index} className="bg-slate-50 rounded-xl p-4">
														<Quote className="w-6 h-6 text-secondary mb-2" />
														<p className="text-muted-foreground text-sm leading-relaxed mb-3">
															{item.quote}
														</p>
														<div className="flex items-center gap-3">
															<div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
																<Image
																	src={item.avatar}
																	alt={item.name}
																	width={36}
																	height={36}
																	className="object-cover w-full h-full"
																/>
															</div>
															<div>
																<p className="font-semibold text-secondary text-sm">{item.name}</p>
																<p className="text-xs text-muted-foreground">{item.role}</p>
															</div>
														</div>
													</div>
												))}
												{/* Duplicate for seamless loop */}
												{[
													{ quote: "Urna tempor pulvinar vivamus fringilla lacus nec metus. Lacinia integer nunc posuere.", name: "Kay Ludger", role: "Finance Director", avatar: "/images/testimonial-avatar-3.jpg" },
													{ quote: "Fermentum odio phasellus non purus est efficitur laoreet. Blandit quis suspendisse.", name: "Lili Alexa", role: "Marketing Director", avatar: "/images/testimonial-avatar-4.jpg" },
													{ quote: "Porta elementum a enim euismod quam justo lectus. Imperdiet mollis nullam volutpat porttitor.", name: "Mario Pascal", role: "Project Manager", avatar: "/images/testimonial-avatar-1.jpg" },
													{ quote: "Taciti sociosqu ad litora torquent per conubia nostra. Et magnis dis parturient scelerisque.", name: "Edelgard Gisa", role: "HR Director", avatar: "/images/testimonial-avatar-2.jpg" },
													{ quote: "Viverra ac tincidunt nam porta elementum a enim. Arcu dignissim velit aliquam imperdiet mollis.", name: "Arnold Willy", role: "Sales Director", avatar: "/images/testimonial-avatar-3.jpg" },
													{ quote: "Duis convallis tempus leo eu aenean sed diam. Nec metus bibendum egestas et magnis iaculis.", name: "Frieda Janine", role: "CEO", avatar: "/images/testimonial-avatar-4.jpg" },
												].map((item, index) => (
													<div key={`dup-${index}`} className="bg-slate-50 rounded-xl p-4">
														<Quote className="w-6 h-6 text-secondary mb-2" />
														<p className="text-muted-foreground text-sm leading-relaxed mb-3">
															{item.quote}
														</p>
														<div className="flex items-center gap-3">
															<div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
																<Image
																	src={item.avatar}
																	alt={item.name}
																	width={36}
																	height={36}
																	className="object-cover w-full h-full"
																/>
															</div>
															<div>
																<p className="font-semibold text-secondary text-sm">{item.name}</p>
																<p className="text-xs text-muted-foreground">{item.role}</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>

								{/* Mobile Layout - Single column with CTA and reviews */}
								<div className="lg:hidden">
									{/* CTA Section */}
									<div className="p-6 relative overflow-hidden border-b border-slate-100">
										<div className="relative z-10">
											<h3 className="text-xl font-bold text-secondary mb-3">
												Trusted By Over 1300 Loyal Clients
											</h3>
											<p className="text-muted-foreground mb-4 text-sm">
												Ad litora torquent per conubia nostra inceptos himenaeos. Dis parturient montes nascetur ridiculus mus donec.
											</p>
											<Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
												<Link href="/kontakt">
													Contact Us
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>
									</div>

									{/* Mobile Reviews - Single column scrolling up */}
									<div className="overflow-hidden relative h-[400px]">
										<div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
										<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

										<div className="testimonial-marquee-vertical h-full p-4">
											<div className="testimonial-marquee-track-up space-y-4">
												{[
													{ quote: "Luctus nibh finibus facilisis dapibus etiam interdum tortor. Tincidunt nam porta elementum.", name: "Nicole Saskia", role: "Founder" },
													{ quote: "Nulla molestie mattis scelerisque maximus eget fermentum odio. Mauris pharetra.", name: "Angela Ursel", role: "Managing Director" },
													{ quote: "Cras eleifend turpis fames primis vulputate ornare sagittis. Proin libero feugiat tristique.", name: "Gretel Nicole", role: "Business Owner" },
													{ quote: "Pretium tellus duis convallis tempus leo eu aenean. Fringilla lacus nec metus bibendum egestas.", name: "Marie Esther", role: "Senior Manager" },
													{ quote: "Fermentum odio phasellus non purus est efficitur laoreet. Blandit quis suspendisse.", name: "Lili Alexa", role: "Marketing Director" },
													{ quote: "Porta elementum a enim euismod quam justo lectus. Imperdiet mollis nullam volutpat porttitor.", name: "Mario Pascal", role: "Project Manager" },
												].map((item, index) => (
													<div key={index} className="bg-slate-50 rounded-xl p-4">
														<Quote className="w-5 h-5 text-secondary mb-2" />
														<p className="text-muted-foreground text-sm leading-relaxed mb-3">
															{item.quote}
														</p>
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
																<span className="text-xs font-semibold text-secondary">{item.name.charAt(0)}</span>
															</div>
															<div>
																<p className="font-semibold text-secondary text-sm">{item.name}</p>
																<p className="text-xs text-muted-foreground">{item.role}</p>
															</div>
														</div>
													</div>
												))}
												{/* Duplicate for seamless loop */}
												{[
													{ quote: "Luctus nibh finibus facilisis dapibus etiam interdum tortor. Tincidunt nam porta elementum.", name: "Nicole Saskia", role: "Founder" },
													{ quote: "Nulla molestie mattis scelerisque maximus eget fermentum odio. Mauris pharetra.", name: "Angela Ursel", role: "Managing Director" },
													{ quote: "Cras eleifend turpis fames primis vulputate ornare sagittis. Proin libero feugiat tristique.", name: "Gretel Nicole", role: "Business Owner" },
													{ quote: "Pretium tellus duis convallis tempus leo eu aenean. Fringilla lacus nec metus bibendum egestas.", name: "Marie Esther", role: "Senior Manager" },
													{ quote: "Fermentum odio phasellus non purus est efficitur laoreet. Blandit quis suspendisse.", name: "Lili Alexa", role: "Marketing Director" },
													{ quote: "Porta elementum a enim euismod quam justo lectus. Imperdiet mollis nullam volutpat porttitor.", name: "Mario Pascal", role: "Project Manager" },
												].map((item, index) => (
													<div key={`dup-${index}`} className="bg-slate-50 rounded-xl p-4">
														<Quote className="w-5 h-5 text-secondary mb-2" />
														<p className="text-muted-foreground text-sm leading-relaxed mb-3">
															{item.quote}
														</p>
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
																<span className="text-xs font-semibold text-secondary">{item.name.charAt(0)}</span>
															</div>
															<div>
																<p className="font-semibold text-secondary text-sm">{item.name}</p>
																<p className="text-xs text-muted-foreground">{item.role}</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Mobile Rating Bar */}
									<div className="p-4 border-t border-slate-100 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<p className="text-2xl font-bold text-secondary">4.80</p>
											<div className="flex gap-0.5">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className="w-4 h-4 text-yellow-400 fill-yellow-400"
													/>
												))}
											</div>
										</div>
										<p className="text-xs text-muted-foreground">
											2,568 Reviews
										</p>
									</div>
								</div>
							</div>

							{/* Right Column - Rating Card + Group Cooperation (stacked vertically) - Hidden on mobile */}
							<div className="hidden lg:flex flex-col gap-5">
								{/* Rating Card */}
								<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center flex-1">
									<p className="text-5xl font-bold text-secondary mb-2">4.80</p>
									<div className="flex gap-0.5 mb-3">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="w-5 h-5 text-yellow-400 fill-yellow-400"
											/>
										))}
									</div>
									<p className="text-sm text-muted-foreground mb-4">
										2,568 Reviews and counting
									</p>
									<div className="flex items-center gap-4">
										<div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
											<span className="text-lg">🍎</span>
										</div>
										<div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
											<span className="text-lg font-bold text-blue-500">G</span>
										</div>
										<div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
											<span className="text-lg text-red-500">▶</span>
										</div>
									</div>
								</div>

								{/* Group Cooperation Card */}
								<div className="rounded-2xl p-6 shadow-sm relative overflow-hidden flex-1">
									{/* Background Image */}
									<div className="absolute inset-0">
										<Image
											src="/images/group-cooperation-bg.jpg"
											alt=""
											fill
											className="object-cover"
										/>
										{/* Gradient Overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-green-400/60" />
									</div>

									<div className="relative z-10 h-full flex flex-col justify-between min-h-[180px]">
										<h4 className="text-xl font-bold text-secondary">
											Group<br />Cooperation
										</h4>

										<div className="flex items-center mt-auto">
											<div className="flex -space-x-3">
												{[1, 2, 3].map((i) => (
													<div
														key={i}
														className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
													>
														<Image
															src={`/images/team-avatar-${i}.jpg`}
															alt=""
															width={40}
															height={40}
															className="object-cover"
														/>
													</div>
												))}
											</div>
											<div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center ml-1">
												<span className="text-white text-lg">+</span>
											</div>
										</div>
									</div>
								</div>
							</div>
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
