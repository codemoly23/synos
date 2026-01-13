"use client";

import { useState } from "react";
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

					{/* Bottom curve transition */}
					<div className="absolute bottom-0 left-0 right-0">
						<svg
							viewBox="0 0 1440 60"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-auto"
							preserveAspectRatio="none"
						>
							<path
								d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 15C840 30 720 45 480 30C240 15 120 0 0 30L0 60Z"
								fill="rgb(248 250 252)"
							/>
						</svg>
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
							{/* Main Content Section */}
							{visibility.mainContent && hasMainContent && (
								<motion.div variants={fadeUp}>
									<div className="rounded-2xl bg-white border border-slate-200/80 p-8 md:p-10 shadow-sm">
										{data.mainContent?.title && (
											<h2 className="mb-6 text-2xl md:text-3xl font-bold text-secondary">
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
									</div>
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
									<AccordionItem
										value="faq-1"
										className="bg-slate-50 rounded-xl border border-slate-200/80 px-6 overflow-hidden transition-all duration-300 data-[state=open]:bg-[#DBA480] data-[state=open]:border-[#DBA480]"
									>
										<AccordionTrigger className="text-left font-semibold text-secondary hover:text-primary py-5 data-[state=open]:text-white">
											Vad ingår i utbildningen?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 data-[state=open]:text-white/90">
											Vår utbildning omfattar både teoretisk och praktisk
											undervisning. Du lär dig allt från säker hantering av
											utrustningen till optimala behandlingsprotokoll för olika
											hudtyper och tillstånd.
										</AccordionContent>
									</AccordionItem>
									<AccordionItem
										value="faq-2"
										className="bg-slate-50 rounded-xl border border-slate-200/80 px-6 overflow-hidden transition-all duration-300 data-[state=open]:bg-[#DBA480] data-[state=open]:border-[#DBA480]"
									>
										<AccordionTrigger className="text-left font-semibold text-secondary hover:text-primary py-5 data-[state=open]:text-white">
											Hur lång är utbildningen?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 data-[state=open]:text-white/90">
											Utbildningens längd varierar beroende på vilken maskin du
											köper och dina förkunskaper. Vanligtvis 2-5 dagar intensiv
											utbildning följt av uppföljning och support.
										</AccordionContent>
									</AccordionItem>
									<AccordionItem
										value="faq-3"
										className="bg-slate-50 rounded-xl border border-slate-200/80 px-6 overflow-hidden transition-all duration-300 data-[state=open]:bg-[#DBA480] data-[state=open]:border-[#DBA480]"
									>
										<AccordionTrigger className="text-left font-semibold text-secondary hover:text-primary py-5 data-[state=open]:text-white">
											Får jag certifikat efter utbildningen?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 data-[state=open]:text-white/90">
											Ja, efter genomförd utbildning får du ett certifikat som
											visar att du är utbildad på den specifika utrustningen.
											Detta är viktigt för din legitimitet som behandlare.
										</AccordionContent>
									</AccordionItem>
									<AccordionItem
										value="faq-4"
										className="bg-slate-50 rounded-xl border border-slate-200/80 px-6 overflow-hidden transition-all duration-300 data-[state=open]:bg-[#DBA480] data-[state=open]:border-[#DBA480]"
									>
										<AccordionTrigger className="text-left font-semibold text-secondary hover:text-primary py-5 data-[state=open]:text-white">
											Finns det möjlighet till uppföljningsutbildning?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 data-[state=open]:text-white/90">
											Absolut! Vi erbjuder kontinuerlig support och möjlighet
											till fördjupad utbildning. Du kan alltid kontakta oss för
											att boka uppföljning eller lära dig nya tekniker.
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</motion.div>
						</div>
					</div>
				</section>
			)}

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
