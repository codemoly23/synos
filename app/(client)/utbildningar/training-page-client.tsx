"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	BookOpen,
	CheckSquare,
	HeartPlus,
	GraduationCap,
	Award,
	Users,
	Zap,
	Home,
	ChevronRight,
	MapPin,
	Mail,
	Phone,
	User,
	Send,
	Loader2,
	CheckCircle2,
	ExternalLink,
	ArrowRight,
	Upload,
	ChevronDown,
	type LucideIcon,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ImageComponent } from "@/components/common/image-component";
import { cn } from "@/lib/utils";
import type { TrainingPageData } from "@/lib/repositories/training-page.repository";

// Icon mapping for benefits
const ICON_MAP: Record<string, LucideIcon> = {
	BookOpen,
	CheckSquare,
	HeartPlus,
	GraduationCap,
	Award,
	Users,
	Zap,
};

interface TrainingPageClientProps {
	data: TrainingPageData;
}

// Contact sidebar form schema
const quickContactSchema = z.object({
	name: z.string().min(2, "Namn krävs"),
	email: z.string().email("Ange en giltig e-postadress"),
	phone: z.string().min(6, "Telefonnummer krävs"),
	message: z.string().optional(),
});

type QuickContactData = z.infer<typeof quickContactSchema>;

export function TrainingPageClient({ data }: TrainingPageClientProps) {
	// Set navbar to dark-hero variant
	useSetNavbarVariant("dark-hero");

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<QuickContactData>({
		resolver: zodResolver(quickContactSchema),
	});

	const onSubmit = async (formData: QuickContactData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "contact",
					subject: "Utbildningsförfrågan",
					fullName: formData.name,
					email: formData.email,
					phone: formData.phone,
					message: formData.message,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();
			if (result.success) {
				setIsSuccess(true);
				reset();
				toast.success("Tack! Vi återkommer inom kort.");
				setTimeout(() => setIsSuccess(false), 5000);
			} else {
				toast.error(result.message || "Något gick fel. Försök igen.");
			}
		} catch {
			toast.error("Kunde inte skicka meddelandet. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const visibility = data.sectionVisibility || {
		hero: true,
		featuredSection: true,
		mainContent: true,
		benefits: true,
		process: true,
		support: true,
		inquiryForm: true,
		resources: true,
	};

	// Check if we have content to display
	const hasHero =
		data.hero?.title || data.hero?.titleHighlight || data.hero?.subtitle;
	const hasMainContent =
		data.mainContent?.title ||
		(data.mainContent?.paragraphs &&
			data.mainContent.paragraphs.filter((p) => p && p.trim()).length > 0);
	const hasBenefits =
		data.benefits && data.benefits.filter((b) => b.title).length > 0;
	const hasProcess =
		data.processSection?.title ||
		data.processSection?.subtitle ||
		(data.processSection?.steps &&
			data.processSection.steps.filter((s) => s.title).length > 0);
	const hasSupport =
		data.supportSection?.title ||
		(data.supportSection?.paragraphs &&
			data.supportSection.paragraphs.filter((p) => p && p.trim()).length > 0) ||
		data.supportSection?.phone ||
		data.supportSection?.email;
	const hasResources =
		data.resourcesSection?.title ||
		data.resourcesSection?.subtitle ||
		(data.resourcesSection?.resources &&
			data.resourcesSection.resources.filter((r) => r.title).length > 0);

	const validBenefits = (data.benefits || []).filter((b) => b.title);
	const validSteps = (data.processSection?.steps || []).filter((s) => s.title);
	const validParagraphsMain = (data.mainContent?.paragraphs || []).filter(
		(p) => p && p.trim()
	);
	const validParagraphsSupport = (data.supportSection?.paragraphs || []).filter(
		(p) => p && p.trim()
	);
	const validResources = (data.resourcesSection?.resources || []).filter(
		(r) => r.title
	);

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
								<span className="text-white font-medium">Utbildningar</span>
							</motion.nav>

							{/* Badge */}
							<motion.div
								variants={fadeUp}
								className="mb-4 inline-flex items-center gap-2"
							>
								<span className="text-primary">&larr;</span>
								<span className="text-sm font-medium text-white/60">
									Professionell Utbildning
								</span>
								<span className="text-primary">&rarr;</span>
							</motion.div>

							{/* Title */}
							{(data.hero?.title || data.hero?.titleHighlight) && (
								<motion.h1
									variants={fadeUp}
									className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
								>
									{data.hero.title}{" "}
									{data.hero.titleHighlight && (
										<span className="text-primary">
											{data.hero.titleHighlight}
										</span>
									)}
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

							{/* CTA Buttons */}
							<motion.div
								variants={fadeUp}
								className="mt-8 flex flex-wrap justify-center gap-4"
							>
								<Button asChild size="lg" className="group">
									<a
										href="https://synos.academy"
										target="_blank"
										rel="noopener noreferrer"
									>
										Besök Synos Academy
										<ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</a>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="border-white/20 text-white hover:bg-white/10"
								>
									<a href="#kontakta-oss">Kontakta Oss</a>
								</Button>
							</motion.div>
						</motion.div>
					</div>

				</section>
			)}

			{/* Main Content with Sidebar Layout */}
			<section className="py-12 md:py-16 lg:py-20">
				<div className="_container">
					<div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
						{/* Left Column - Main Content */}
						<motion.div
							initial="initial"
							animate="animate"
							variants={staggerContainer}
							className="space-y-16"
						>
							{/* Featured Section (Veritatisin Reprehenderit) */}
							{visibility.featuredSection && (
								<motion.div variants={fadeUp}>
									<div className="relative rounded-2xl overflow-hidden">
										{/* Image */}
										<div className="aspect-[16/10] relative">
											{/* Desktop Image */}
											<ImageComponent
												src={data.featuredSection?.image || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop"}
												alt={data.featuredSection?.title || "Professional training session"}
												fill
												className={`object-cover ${data.featuredSection?.mobileImage ? "hidden md:block" : ""}`}
											/>
											{/* Mobile Image */}
											{data.featuredSection?.mobileImage && (
												<ImageComponent
													src={data.featuredSection.mobileImage}
													alt={data.featuredSection?.title || "Professional training session"}
													fill
													className="object-cover md:hidden"
												/>
											)}
										</div>
									</div>

									{/* Content Below Image */}
									<div className="mt-8">
										<h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
											{data.featuredSection?.title || "Veritatisin Reprehenderit"}
										</h2>
										{data.featuredSection?.description && (
											<p className="text-muted-foreground mb-8">
												{data.featuredSection.description}
											</p>
										)}

										{data.featuredSection?.subTitle && (
											<h3 className="text-xl font-semibold text-secondary mb-4">
												{data.featuredSection.subTitle}
											</h3>
										)}

										{/* Checkmark List */}
										{data.featuredSection?.checklistItems && data.featuredSection.checklistItems.length > 0 && (
											<div className="space-y-3 mb-8">
												{data.featuredSection.checklistItems.filter(item => item.text).map((item, index) => (
													<div key={index} className="flex items-start gap-3">
														<div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
															<CheckCircle2 className="w-3.5 h-3.5 text-primary" />
														</div>
														<p className="text-muted-foreground">
															{item.text}
														</p>
													</div>
												))}
											</div>
										)}

										{data.featuredSection?.bottomDescription && (
											<p className="text-muted-foreground">
												{data.featuredSection.bottomDescription}
											</p>
										)}
									</div>
								</motion.div>
							)}

							{/* Main Content Section */}
							{visibility.mainContent && hasMainContent && (
								<motion.div variants={fadeUp}>
									{data.mainContent?.title && (
										<h2 className="mb-4 text-2xl md:text-3xl font-bold text-secondary">
											{data.mainContent.title}
										</h2>
									)}
									{validParagraphsMain.length > 0 && (
										<div className="space-y-4 text-muted-foreground leading-relaxed">
											{validParagraphsMain.map((paragraph, index) => (
												<p
													key={index}
													dangerouslySetInnerHTML={{ __html: paragraph }}
												/>
											))}
										</div>
									)}
								</motion.div>
							)}

							{/* Benefits Grid */}
							{visibility.benefits && hasBenefits && (
								<motion.div variants={fadeUp}>
									<h2 className="mb-8 text-2xl md:text-3xl font-bold text-secondary">
										Fördelar med vår utbildning
									</h2>
									<div className="grid gap-6 sm:grid-cols-2">
										{validBenefits.map((benefit, index) => {
											const IconComponent = benefit.icon
												? ICON_MAP[benefit.icon] || BookOpen
												: BookOpen;
											return (
												<Card
													key={index}
													className="border-slate-200/80 hover:border-primary/30 transition-colors"
												>
													<CardContent className="p-6">
														<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
															<IconComponent className="h-7 w-7 text-primary" />
														</div>
														<h3 className="mb-2 text-lg font-semibold text-secondary">
															{benefit.title}
														</h3>
														{benefit.description && (
															<p className="text-muted-foreground text-sm">
																{benefit.description}
															</p>
														)}
													</CardContent>
												</Card>
											);
										})}
									</div>
								</motion.div>
							)}

							{/* Training Process Section */}
							{visibility.process && hasProcess && (
								<motion.div variants={fadeUp}>
									{(data.processSection?.title ||
										data.processSection?.subtitle) && (
										<div className="mb-10">
											{data.processSection?.title && (
												<h2 className="mb-3 text-2xl md:text-3xl font-bold text-secondary">
													{data.processSection.title}
												</h2>
											)}
											{data.processSection?.subtitle && (
												<p className="text-muted-foreground max-w-2xl">
													{data.processSection.subtitle}
												</p>
											)}
										</div>
									)}

									{validSteps.length > 0 && (
										<div className="relative">
											{/* Timeline line */}
											<div className="absolute left-[27px] top-0 bottom-0 w-px bg-primary/20 hidden md:block" />

											<div className="space-y-6">
												{validSteps.map((step, index) => (
													<motion.div
														key={index}
														initial={{ opacity: 0, x: -20 }}
														whileInView={{ opacity: 1, x: 0 }}
														viewport={{ once: true }}
														transition={{ delay: index * 0.1 }}
														className="relative flex gap-6"
													>
														{/* Step number */}
														<div className="relative z-10 shrink-0">
															<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white font-bold text-xl shadow-lg">
																{step.number || index + 1}
															</div>
														</div>

														{/* Step content */}
														<div className="flex-1 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
															<h3 className="text-lg font-semibold text-secondary mb-2">
																{step.title}
															</h3>
															{step.description && (
																<p className="text-muted-foreground text-sm">
																	{step.description}
																</p>
															)}
														</div>
													</motion.div>
												))}
											</div>
										</div>
									)}
								</motion.div>
							)}

							{/* Support Section */}
							{visibility.support && hasSupport && (
								<motion.div variants={fadeUp}>
									<div className="rounded-2xl bg-secondary p-8 md:p-10 text-white">
										{data.supportSection?.title && (
											<h2 className="mb-4 text-2xl font-bold">
												{data.supportSection.title}
											</h2>
										)}
										{validParagraphsSupport.length > 0 && (
											<div className="space-y-3 text-white/80 mb-6">
												{validParagraphsSupport.map((paragraph, index) => (
													<p key={index}>{paragraph}</p>
												))}
											</div>
										)}
										{(data.supportSection?.phone ||
											data.supportSection?.email) && (
											<div className="flex flex-wrap gap-4">
												{data.supportSection?.phone && (
													<Button
														asChild
														variant="secondary"
														className="bg-white text-secondary hover:bg-white/90"
													>
														<a
															href={`tel:${data.supportSection.phone.replace(/\s/g, "")}`}
														>
															<Phone className="w-4 h-4 mr-2" />
															{data.supportSection.phone}
														</a>
													</Button>
												)}
												{data.supportSection?.email && (
													<Button
														asChild
														variant="outline"
														className="border-white/20 text-white hover:bg-white/10"
													>
														<a href={`mailto:${data.supportSection.email}`}>
															<Mail className="w-4 h-4 mr-2" />
															{data.supportSection.email}
														</a>
													</Button>
												)}
											</div>
										)}
									</div>
								</motion.div>
							)}

							{/* Resources Grid */}
							{visibility.resources && hasResources && (
								<motion.div variants={fadeUp}>
									{(data.resourcesSection?.title ||
										data.resourcesSection?.subtitle) && (
										<div className="mb-8">
											{data.resourcesSection?.title && (
												<h2 className="mb-3 text-2xl md:text-3xl font-bold text-secondary">
													{data.resourcesSection.title}
												</h2>
											)}
											{data.resourcesSection?.subtitle && (
												<p className="text-muted-foreground">
													{data.resourcesSection.subtitle}
												</p>
											)}
										</div>
									)}

									{validResources.length > 0 && (
										<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
											{validResources.map((resource, index) => (
												<Card
													key={index}
													className="group overflow-hidden border-slate-200/80 transition-all hover:border-primary hover:shadow-lg"
												>
													<CardContent className="p-6">
														<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
															<GraduationCap className="h-6 w-6 text-primary" />
														</div>
														<h3 className="mb-2 text-lg font-semibold text-secondary group-hover:text-primary transition-colors">
															{resource.title}
														</h3>
														{resource.description && (
															<p className="mb-4 text-sm text-muted-foreground">
																{resource.description}
															</p>
														)}
														{resource.href && (
															<Button
																asChild
																variant="outline"
																className="w-full group-hover:border-primary group-hover:text-primary"
															>
																<Link href={resource.href}>
																	{resource.buttonText || "Läs mer"}
																	<ArrowRight className="ml-2 h-4 w-4" />
																</Link>
															</Button>
														)}
													</CardContent>
												</Card>
											))}
										</div>
									)}
								</motion.div>
							)}
						</motion.div>

						{/* Right Column - Contact Sidebar */}
						<div className="hidden lg:block" id="kontakta-oss">
							<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sticky top-32">
								{/* Title */}
								<h3 className="text-xl font-bold text-secondary mb-6">
									Kontakta Oss
								</h3>

								{/* Contact Info */}
								<div className="space-y-4 mb-8">
									{/* Address */}
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
											<MapPin className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold text-secondary text-sm">
												Besöksadress
											</p>
											<p className="text-muted-foreground text-sm">
												Synos Medical AB
												<br />
												Stockholm, Sverige
											</p>
										</div>
									</div>

									{/* Email */}
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
											<Mail className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold text-secondary text-sm">
												E-post
											</p>
											<a
												href="mailto:info@synos.se"
												className="text-muted-foreground text-sm hover:text-primary transition-colors"
											>
												info@synos.se
											</a>
										</div>
									</div>

									{/* Phone */}
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
											<Phone className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold text-secondary text-sm">
												Telefon
											</p>
											<a
												href="tel:010-2051501"
												className="text-muted-foreground text-sm hover:text-primary transition-colors"
											>
												010-205 15 01
											</a>
										</div>
									</div>
								</div>

								{/* Divider */}
								<div className="border-t border-slate-200 my-6" />

								{/* Quick Contact Form */}
								<div>
									<h4 className="text-lg font-semibold text-secondary mb-4">
										Snabbkontakt
									</h4>

									{isSuccess ? (
										<div className="text-center py-6">
											<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
												<CheckCircle2 className="w-6 h-6 text-green-600" />
											</div>
											<p className="text-sm text-muted-foreground">
												Tack! Vi återkommer inom kort.
											</p>
										</div>
									) : (
										<form
											onSubmit={handleSubmit(onSubmit)}
											className="space-y-3"
										>
											<div>
												<div className="relative">
													<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
													<Input
														{...register("name")}
														placeholder="Ditt Namn*"
														className={cn(
															"pl-10 h-11 bg-slate-50 border-slate-200",
															errors.name && "border-red-500"
														)}
														disabled={isSubmitting}
													/>
												</div>
												{errors.name && (
													<p className="text-xs text-red-500 mt-1">
														{errors.name.message}
													</p>
												)}
											</div>

											<div>
												<div className="relative">
													<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
													<Input
														{...register("email")}
														type="email"
														placeholder="E-postadress*"
														className={cn(
															"pl-10 h-11 bg-slate-50 border-slate-200",
															errors.email && "border-red-500"
														)}
														disabled={isSubmitting}
													/>
												</div>
												{errors.email && (
													<p className="text-xs text-red-500 mt-1">
														{errors.email.message}
													</p>
												)}
											</div>

											<div>
												<div className="relative">
													<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
													<Input
														{...register("phone")}
														type="tel"
														placeholder="Telefonnummer*"
														className={cn(
															"pl-10 h-11 bg-slate-50 border-slate-200",
															errors.phone && "border-red-500"
														)}
														disabled={isSubmitting}
													/>
												</div>
												{errors.phone && (
													<p className="text-xs text-red-500 mt-1">
														{errors.phone.message}
													</p>
												)}
											</div>

											<div>
												<Textarea
													{...register("message")}
													placeholder="Meddelande (valfritt)"
													className="bg-slate-50 border-slate-200 resize-none"
													rows={3}
													disabled={isSubmitting}
												/>
											</div>

											<Button
												type="submit"
												disabled={isSubmitting}
												className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
											>
												{isSubmitting ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Skickar...
													</>
												) : (
													<>
														Skicka Meddelande
														<Send className="w-4 h-4 ml-2" />
													</>
												)}
											</Button>
										</form>
									)}
								</div>

								{/* Synos Academy Link */}
								<div className="mt-6 pt-6 border-t border-slate-200">
									<Button
										asChild
										variant="outline"
										className="w-full border-primary text-primary hover:bg-primary hover:text-white"
									>
										<a
											href="https://synos.academy"
											target="_blank"
											rel="noopener noreferrer"
										>
											<GraduationCap className="w-4 h-4 mr-2" />
											Synos Academy
											<ExternalLink className="w-4 h-4 ml-2" />
										</a>
									</Button>
								</div>
							</div>
						</div>

						{/* Mobile Contact Section */}
						<div className="lg:hidden" id="kontakta-oss-mobile">
							<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
								<h3 className="text-xl font-bold text-secondary mb-6">
									Kontakta Oss
								</h3>

								{/* Contact Info */}
								<div className="grid gap-4 sm:grid-cols-3 mb-6">
									<a
										href="tel:010-2051501"
										className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-primary/10 transition-colors"
									>
										<Phone className="w-5 h-5 text-primary" />
										<span className="text-sm font-medium">010-205 15 01</span>
									</a>
									<a
										href="mailto:info@synos.se"
										className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-primary/10 transition-colors"
									>
										<Mail className="w-5 h-5 text-primary" />
										<span className="text-sm font-medium">info@synos.se</span>
									</a>
									<a
										href="https://synos.academy"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
									>
										<GraduationCap className="w-5 h-5 text-primary" />
										<span className="text-sm font-medium text-primary">
											Synos Academy
										</span>
									</a>
								</div>

								{/* Mobile Form */}
								{isSuccess ? (
									<div className="text-center py-6">
										<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
											<CheckCircle2 className="w-6 h-6 text-green-600" />
										</div>
										<p className="text-sm text-muted-foreground">
											Tack! Vi återkommer inom kort.
										</p>
									</div>
								) : (
									<form
										onSubmit={handleSubmit(onSubmit)}
										className="space-y-3"
									>
										<div className="grid gap-3 sm:grid-cols-2">
											<div>
												<Input
													{...register("name")}
													placeholder="Ditt Namn*"
													className={cn(
														"h-11 bg-slate-50 border-slate-200",
														errors.name && "border-red-500"
													)}
													disabled={isSubmitting}
												/>
												{errors.name && (
													<p className="text-xs text-red-500 mt-1">
														{errors.name.message}
													</p>
												)}
											</div>
											<div>
												<Input
													{...register("email")}
													type="email"
													placeholder="E-postadress*"
													className={cn(
														"h-11 bg-slate-50 border-slate-200",
														errors.email && "border-red-500"
													)}
													disabled={isSubmitting}
												/>
												{errors.email && (
													<p className="text-xs text-red-500 mt-1">
														{errors.email.message}
													</p>
												)}
											</div>
										</div>
										<div>
											<Input
												{...register("phone")}
												type="tel"
												placeholder="Telefonnummer*"
												className={cn(
													"h-11 bg-slate-50 border-slate-200",
													errors.phone && "border-red-500"
												)}
												disabled={isSubmitting}
											/>
											{errors.phone && (
												<p className="text-xs text-red-500 mt-1">
													{errors.phone.message}
												</p>
											)}
										</div>
										<Textarea
											{...register("message")}
											placeholder="Meddelande (valfritt)"
											className="bg-slate-50 border-slate-200 resize-none"
											rows={3}
											disabled={isSubmitting}
										/>
										<Button
											type="submit"
											disabled={isSubmitting}
											className="w-full h-11"
										>
											{isSubmitting ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Skickar...
												</>
											) : (
												<>
													Skicka Meddelande
													<Send className="w-4 h-4 ml-2" />
												</>
											)}
										</Button>
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			{visibility.inquiryForm && (
				<section className="py-16 md:py-20 bg-white">
					<div className="_container">
						<div className="max-w-3xl mx-auto">
							<motion.div
								variants={staggerContainer}
								initial="initial"
								whileInView="animate"
								viewport={{ once: true }}
								className="text-center mb-12"
							>
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-secondary mb-4"
								>
									{data.inquirySection?.title || "Vanliga Frågor"}
								</motion.h2>
								{data.inquirySection?.subtitle && (
									<motion.p variants={fadeUp} className="text-muted-foreground">
										{data.inquirySection.subtitle}
									</motion.p>
								)}
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
							>
								<Accordion type="single" collapsible className="space-y-4">
									{(data.inquirySection?.faqItems && data.inquirySection.faqItems.length > 0
										? data.inquirySection.faqItems.filter(item => item.question || item.answer)
										: [
											{ question: "Vad ingår i utbildningen?", answer: "Vår utbildning omfattar både teoretisk och praktisk undervisning. Du lär dig allt från säker hantering av utrustningen till optimala behandlingsprotokoll för olika hudtyper och tillstånd." },
											{ question: "Hur lång är utbildningen?", answer: "Utbildningens längd varierar beroende på vilken maskin du köper och dina förkunskaper. Vanligtvis 2-5 dagar intensiv utbildning följt av uppföljning och support." },
											{ question: "Får jag certifikat efter utbildningen?", answer: "Ja, efter genomförd utbildning får du ett certifikat som visar att du är utbildad på den specifika utrustningen. Detta är viktigt för din legitimitet som behandlare." },
											{ question: "Finns det möjlighet till uppföljningsutbildning?", answer: "Absolut! Vi erbjuder kontinuerlig support och möjlighet till fördjupad utbildning. Du kan alltid kontakta oss för att boka uppföljning eller lära dig nya tekniker." },
										]
									).map((faq, index) => (
										<AccordionItem
											key={index}
											value={`faq-${index}`}
											className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
										>
											<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
												{faq.answer}
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</motion.div>
						</div>
					</div>
				</section>
			)}

			{/* Application Form Section */}
			<ApplicationFormSection />

			{/* CTA Section */}
			<section className="bg-secondary py-16 md:py-20 lg:py-24 relative overflow-hidden">
				{/* Geometric Background Pattern */}
				<div className="absolute inset-0 opacity-5">
					<svg
						className="absolute top-0 left-0 w-full h-full"
						viewBox="0 0 1440 560"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						preserveAspectRatio="xMidYMid slice"
					>
						<path
							d="M-100 280 Q 200 80, 400 280 T 800 280 T 1200 280 T 1600 280"
							stroke="currentColor"
							strokeWidth="1"
							fill="none"
							className="text-primary"
						/>
						<path
							d="M-100 320 Q 250 120, 500 320 T 900 320 T 1300 320 T 1700 320"
							stroke="currentColor"
							strokeWidth="0.5"
							fill="none"
							className="text-white"
						/>
					</svg>
				</div>

				<div className="_container relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="max-w-3xl mx-auto text-center"
					>
						{/* Badge */}
						<span className="inline-flex items-center gap-2 text-sm font-medium text-white/60 mb-4">
							<span className="text-primary">&larr;</span>
							Online Utbildningsplattform
							<span className="text-primary">&rarr;</span>
						</span>

						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Besök Synos Academy
						</h2>
						<p className="text-white/70 mb-8 text-lg">
							Vår digitala utbildningsplattform ger dig tillgång till
							videolektioner, guider och material - när det passar dig.
						</p>

						<div className="flex flex-wrap justify-center gap-4">
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary/90 text-white group"
							>
								<a
									href="https://synos.academy"
									target="_blank"
									rel="noopener noreferrer"
								>
									<GraduationCap className="w-5 h-5 mr-2" />
									Gå till Synos Academy
									<ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</a>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="border-white/20 text-white hover:bg-white/10"
							>
								<Link href="/kontakt">Kontakta Oss</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}

/**
 * Application Form Section Component
 */
function ApplicationFormSection() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		careerType: "",
		message: "",
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const careerTypes = [
		"Account Manager",
		"Sales Representative",
		"Technical Support",
		"Marketing Specialist",
		"Software Developer",
		"Other",
	];

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Form submission logic here
		console.log("Form submitted:", { ...formData, file: selectedFile });
	};

	return (
		<section className="py-16 md:py-20 bg-slate-50">
			<div className="_container">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<motion.div variants={fadeUp} className="mb-4">
							<span className="inline-block px-4 py-1.5 bg-[#DCA783]/10 text-[#DCA783] rounded-full text-sm font-medium">
								Get Answers Instantly
							</span>
						</motion.div>
						<motion.h2
							variants={fadeUp}
							className="text-3xl md:text-4xl font-bold text-secondary mb-4"
						>
							Tell Us What You Need
						</motion.h2>
						<motion.p
							variants={fadeUp}
							className="text-muted-foreground max-w-2xl mx-auto"
						>
							Fill out the form below and we&apos;ll get back to you as soon as
							possible regarding your inquiry.
						</motion.p>
					</motion.div>

					{/* Form */}
					<motion.form
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						onSubmit={handleSubmit}
						className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-sm"
					>
						<div className="grid gap-6 md:grid-cols-2">
							{/* Your Name */}
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Your Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Enter your name"
									required
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50"
								/>
							</div>

							{/* Email Address */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Email Address <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="Enter your email"
									required
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50"
								/>
							</div>

							{/* Your Number */}
							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Your Number <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									id="phone"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									placeholder="Enter your phone number"
									required
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50"
								/>
							</div>

							{/* Choose Careers Type */}
							<div className="relative">
								<label
									htmlFor="careerType"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Choose Careers Type <span className="text-red-500">*</span>
								</label>
								<button
									type="button"
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-left flex items-center justify-between bg-white"
								>
									<span
										className={
											formData.careerType
												? "text-secondary"
												: "text-muted-foreground/50"
										}
									>
										{formData.careerType || "Select career type"}
									</span>
									<ChevronDown
										className={`w-5 h-5 text-muted-foreground transition-transform ${
											isDropdownOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
								{isDropdownOpen && (
									<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
										{careerTypes.map((type) => (
											<button
												key={type}
												type="button"
												onClick={() => {
													setFormData((prev) => ({ ...prev, careerType: type }));
													setIsDropdownOpen(false);
												}}
												className="w-full px-4 py-2.5 text-left text-secondary hover:bg-slate-50 transition-colors"
											>
												{type}
											</button>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Additional Message */}
						<div className="mt-6">
							<label
								htmlFor="message"
								className="block text-sm font-medium text-secondary mb-2"
							>
								Additional Message
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleInputChange}
								placeholder="Tell us more about yourself and why you're interested in this position..."
								rows={5}
								className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50 resize-none"
							/>
						</div>

						{/* File Upload and Submit Row */}
						<div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
							{/* File Upload */}
							<div>
								<div className="flex items-center">
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										accept=".pdf,.doc,.docx,.jpg,.png"
										className="hidden"
									/>
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#DCA783]/20 to-[#DCA783]/40 hover:from-[#DCA783]/30 hover:to-[#DCA783]/50 text-secondary font-medium rounded-l-xl transition-colors border border-r-0 border-slate-200"
									>
										<Upload className="w-4 h-4" />
										Upload
									</button>
									<div className="px-6 py-3 bg-white border border-slate-200 rounded-r-xl min-w-[140px]">
										<span className="text-muted-foreground text-sm">
											{selectedFile ? selectedFile.name : "No file chosen"}
										</span>
									</div>
								</div>
								<p className="text-muted-foreground text-xs mt-2">
									*Upload your resume in pdf, jpg, png, or doc format.
								</p>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#DCA783] to-[#C4956E] hover:from-[#C4956E] hover:to-[#B08560] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#DCA783]/25"
							>
								Submit
								<ArrowRight className="w-5 h-5" />
							</button>
						</div>
					</motion.form>
				</div>
			</div>
		</section>
	);
}
