"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";
import {
	BookOpen,
	Shield,
	Settings,
	Users,
	Heart,
	Star,
	Zap,
	Award,
	FileText,
	GraduationCap,
	Building2,
	CheckCircle,
	Home,
	ChevronRight,
	MapPin,
	Mail,
	Phone,
	User,
	Send,
	Loader2,
	CheckCircle2,
	Rocket,
	ArrowRight,
	Upload,
	ChevronDown,
	type LucideIcon,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ImageComponent } from "@/components/common/image-component";
import { cn } from "@/lib/utils";
import type { StartaEgetPageData } from "@/lib/repositories/starta-eget-page.repository";

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
	BookOpen,
	Shield,
	Settings,
	Users,
	Heart,
	Star,
	Zap,
	Award,
	FileText,
	GraduationCap,
	Building2,
	Rocket,
};

interface StartaEgetPageClientProps {
	data: StartaEgetPageData;
}

// Contact form schema
const clientFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	countryCode: z.string().min(2, "Landskod krävs"),
	countryName: z.string().min(2, "Land krävs"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional()
		.or(z.literal("")),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
});

type FormData = z.infer<typeof clientFormSchema>;

export function StartaEgetPageClient({ data }: StartaEgetPageClientProps) {
	// Set navbar to dark-hero variant
	useSetNavbarVariant("dark-hero");

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);
	const [gdprChecked, setGdprChecked] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(clientFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			countryCode: defaultCountry.dialCode,
			countryName: defaultCountry.name,
			phone: "",
			message: "",
			gdprConsent: undefined as unknown as true,
		},
	});

	const handleCountryChange = (country: Country) => {
		setSelectedCountry(country);
		setValue("countryCode", country.dialCode);
		setValue("countryName", country.name);
	};

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

	const onSubmit = async (formData: FormData) => {
		// Frontend phone validation
		const fullPhone =
			formData.countryCode + formData.phone.replace(/[\s\-]/g, "");
		if (!isValidPhoneNumber(fullPhone)) {
			setError("phone", {
				type: "manual",
				message: "Ogiltigt telefonnummer för valt land",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "contact",
					subject: "Förfrågan om att starta eget",
					...formData,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				setSelectedCountry(defaultCountry);
				toast.success("Tack för din förfrågan! Vi återkommer inom 24 timmar.");
				setTimeout(() => setIsSuccess(false), 10000);
			} else {
				toast.error(result.message || "Något gick fel. Försök igen.");
			}
		} catch {
			toast.error("Något gick fel. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const visibility = data.sectionVisibility || {
		hero: true,
		mainContent: true,
		benefits: true,
		features: true,
		contactForm: true,
		resources: true,
	};

	// Check if we have content to display
	const hasHero =
		data.hero?.title ||
		data.hero?.titleHighlight ||
		data.hero?.subtitle ||
		data.hero?.callout;
	const hasMainContent =
		data.mainContent?.title ||
		data.mainContent?.subtitle ||
		(data.mainContent?.paragraphs &&
			data.mainContent.paragraphs.filter((p) => p && p.trim()).length > 0);
	const hasBenefits =
		data.benefits && data.benefits.filter((b) => b.title).length > 0;
	const hasFeatures =
		data.featuresSection?.title ||
		data.featuresSection?.intro ||
		(data.featuresSection?.features &&
			data.featuresSection.features.filter((f) => f.title).length > 0);
	const hasResources =
		data.resourcesSection?.title ||
		data.resourcesSection?.subtitle ||
		(data.resourcesSection?.resources &&
			data.resourcesSection.resources.filter((r) => r.title).length > 0);

	const validBenefits = (data.benefits || []).filter((b) => b.title);
	const validParagraphs = (data.mainContent?.paragraphs || []).filter(
		(p) => p && p.trim()
	);
	const validFeatures = (data.featuresSection?.features || []).filter(
		(f) => f.title
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
								<span className="text-white font-medium">Starta Eget</span>
							</motion.nav>

							{/* Badge */}
							<motion.div
								variants={fadeUp}
								className="mb-4 inline-flex items-center gap-2"
							>
								<span className="text-primary">&larr;</span>
								<span className="text-sm font-medium text-white/60">
									Drömmer du om egen klinik?
								</span>
								<span className="text-primary">&rarr;</span>
							</motion.div>

							{/* Title */}
							{(data.hero?.title || data.hero?.titleHighlight) && (
								<motion.h1
									variants={fadeUp}
									className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
								>
									{data.hero.title}
									{data.hero.titleHighlight && (
										<>
											<br />
											<span className="text-primary">
												{data.hero.titleHighlight}
											</span>
										</>
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

							{/* Callout */}
							{data.hero?.callout && (
								<motion.p
									variants={fadeUp}
									className="mt-6 text-xl font-semibold text-primary"
								>
									{data.hero.callout}
								</motion.p>
							)}

							{/* CTA Buttons */}
							<motion.div
								variants={fadeUp}
								className="mt-8 flex flex-wrap justify-center gap-4"
							>
								<Button asChild size="lg" className="group">
									<a href="#kontakta-oss">
										Kontakta Oss
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</a>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="border-white/20 text-white hover:bg-white/10"
								>
									<Link href="/starta-eget/varfor-valja-synos">
										Varför välja Synos?
									</Link>
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
							{/* Veritatisin Reprehenderit Section */}
							<motion.div variants={fadeUp}>
								{/* Image */}
								<div className="relative rounded-xl overflow-hidden shadow-lg aspect-[16/9] mb-8">
									<ImageComponent
										src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=450&fit=crop"
										alt="Veritatisin Reprehenderit"
										width={800}
										height={450}
										className="w-full h-full object-cover"
									/>
								</div>

								{/* Title */}
								<h2 className="mb-4 text-2xl md:text-3xl font-bold text-secondary">
									Veritatisin Reprehenderit
								</h2>

								{/* Text */}
								<p className="text-muted-foreground leading-relaxed mb-8">
									Vel aliquid dolores id dolor quis nam labore voluptatem sit architecto itaque aut consectetur nulla. Nam neque labore ab sunt sequi est praesentium voluptatem aut internos voluptas a molestiae consequatur non eligendi dolor et libero quod.
								</p>

								{/* Dignissi Nostrum Section */}
								<h3 className="text-xl font-bold text-secondary mb-4">
									Dignissi Nostrum
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#DCA783] mt-0.5 shrink-0" />
										<span className="text-muted-foreground">Ab sunt sequi est praesentium voluptatem aut internos voluptas.</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#DCA783] mt-0.5 shrink-0" />
										<span className="text-muted-foreground">A molestiae consequatur non eligendi dolor et libero quod.</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#DCA783] mt-0.5 shrink-0" />
										<span className="text-muted-foreground">Nam neque labore ab sunt sequi est praesentium voluptatem.</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#DCA783] mt-0.5 shrink-0" />
										<span className="text-muted-foreground">Aut internos voluptas a molestiae consequatur non eligendi.</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#DCA783] mt-0.5 shrink-0" />
										<span className="text-muted-foreground">Dolor et libero quod vel aliquid dolores id dolor quis nam.</span>
									</li>
								</ul>
							</motion.div>

							{/* Benefits Grid */}
							{visibility.benefits && hasBenefits && (
								<motion.div variants={fadeUp}>
									<h2 className="mb-8 text-2xl md:text-3xl font-bold text-secondary">
										Fördelar med Synos
									</h2>
									<div className="grid gap-6 sm:grid-cols-2">
										{validBenefits.map((benefit, index) => {
											const IconComponent = benefit.icon
												? ICON_MAP[benefit.icon] || Rocket
												: Rocket;
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

							{/* Features Section - Vi hjälper dig förverkliga din dröm */}
							{visibility.features && hasFeatures && (
								<motion.div variants={fadeUp}>
									{/* Title */}
									{data.featuresSection?.title && (
										<motion.h2
											initial={{ opacity: 0, y: 30 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ duration: 0.6 }}
											className="mb-4 text-2xl md:text-3xl font-bold text-secondary"
										>
											{data.featuresSection.title}
										</motion.h2>
									)}

									{/* Text */}
									{data.featuresSection?.intro && (
										<motion.p
											initial={{ opacity: 0, y: 30 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ duration: 0.6, delay: 0.1 }}
											className="text-muted-foreground leading-relaxed"
										>
											{data.featuresSection.intro}
										</motion.p>
									)}
								</motion.div>
							)}

							{/* FAQ Section */}
							<motion.div variants={fadeUp}>
								<h2 className="mb-8 text-2xl md:text-3xl font-bold text-secondary">
									Vanliga Frågor
								</h2>
								<Accordion type="single" collapsible className="space-y-4">
									<AccordionItem
										value="faq-1"
										className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
									>
										<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
											Vad behövs för att starta en hudklinik?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
											För att starta en hudklinik behöver du rätt utrustning,
											utbildning och kunskap om säkerhet och behandlingar. Synos
											hjälper dig med allt från utrustning till utbildning och
											marknadsföring.
										</AccordionContent>
									</AccordionItem>
									<AccordionItem
										value="faq-2"
										className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
									>
										<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
											Hur lång tid tar det att komma igång?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
											Med rätt planering och support kan du vara redo att ta
											emot dina första kunder inom några veckor. Vi hjälper dig
											genom hela processen.
										</AccordionContent>
									</AccordionItem>
									<AccordionItem
										value="faq-3"
										className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
									>
										<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
											Vilken typ av utbildning ingår?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
											När du köper utrustning från oss ingår omfattande
											utbildning - både teoretisk och praktisk. Du lär dig allt
											du behöver för att utföra säkra och effektiva
											behandlingar.
										</AccordionContent>
									</AccordionItem>
									<AccordionItem
										value="faq-4"
										className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
									>
										<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
											Får jag support efter köp?
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
											Ja, vi erbjuder kontinuerlig support och service. Du kan
											alltid nå oss för frågor, teknisk support eller ytterligare
											utbildning.
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</motion.div>

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
															<FileText className="h-6 w-6 text-primary" />
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

								{/* Quick Links */}
								<div className="space-y-3">
									<h4 className="text-sm font-semibold text-secondary">
										Snabblänkar
									</h4>
									<div className="grid gap-2">
										<Button
											asChild
											variant="outline"
											className="w-full justify-start"
										>
											<Link href="/starta-eget/varfor-valja-synos">
												<Star className="w-4 h-4 mr-2 text-primary" />
												Varför välja Synos?
											</Link>
										</Button>
										<Button
											asChild
											variant="outline"
											className="w-full justify-start"
										>
											<Link href="/starta-eget/kopguide">
												<FileText className="w-4 h-4 mr-2 text-primary" />
												Köpguide
											</Link>
										</Button>
										<Button
											asChild
											variant="outline"
											className="w-full justify-start"
										>
											<Link href="/starta-eget/miniutbildning">
												<GraduationCap className="w-4 h-4 mr-2 text-primary" />
												Miniutbildning
											</Link>
										</Button>
									</div>
								</div>
							</div>
						</div>

						{/* Mobile Contact Links */}
						<div className="lg:hidden">
							<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
								<h3 className="text-xl font-bold text-secondary mb-4">
									Snabblänkar
								</h3>
								<div className="grid gap-3 sm:grid-cols-3">
									<Button
										asChild
										variant="outline"
										className="w-full justify-center"
									>
										<Link href="/starta-eget/varfor-valja-synos">
											<Star className="w-4 h-4 mr-2 text-primary" />
											Varför Synos?
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="w-full justify-center"
									>
										<Link href="/starta-eget/kopguide">
											<FileText className="w-4 h-4 mr-2 text-primary" />
											Köpguide
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="w-full justify-center"
									>
										<Link href="/starta-eget/miniutbildning">
											<GraduationCap className="w-4 h-4 mr-2 text-primary" />
											Miniutbildning
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			{visibility.contactForm && (
				<section
					className="py-16 md:py-20 bg-secondary relative overflow-hidden"
					id="kontakt-formular"
				>
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
						<div className="max-w-3xl mx-auto">
							{/* Header */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="text-center mb-10"
							>
								<span className="inline-flex items-center gap-2 text-sm font-medium text-white/60 mb-4">
									<span className="text-primary">&larr;</span>
									Vi hjälper dig komma igång
									<span className="text-primary">&rarr;</span>
								</span>
								<h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
									Kontakta Oss
								</h2>
								<p className="text-white/70">
									Fyll i formuläret så kontaktar vi dig inom 24 timmar
								</p>
							</motion.div>

							{/* Form */}
							{isSuccess ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-10 text-center"
								>
									<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
										<CheckCircle2 className="w-10 h-10 text-green-400" />
									</div>
									<h3 className="text-2xl font-bold text-white mb-3">
										Tack för din förfrågan!
									</h3>
									<p className="text-white/70 mb-6">
										Vi har mottagit din förfrågan och återkommer till dig inom
										24 timmar.
									</p>
									<Button
										variant="outline"
										onClick={() => setIsSuccess(false)}
										className="border-white/20 text-white hover:bg-white/10"
									>
										Skicka ny förfrågan
									</Button>
								</motion.div>
							) : (
								<motion.form
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									onSubmit={handleSubmit(onSubmit)}
									className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 md:p-8 space-y-5"
								>
									{/* Name & Email */}
									<div className="grid gap-5 md:grid-cols-2">
										<div className="space-y-2">
											<Label
												htmlFor="fullName"
												className="text-sm font-medium text-white"
											>
												Namn <span className="text-red-400">*</span>
											</Label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
												<Input
													id="fullName"
													{...register("fullName")}
													placeholder="Ditt Namn"
													className={cn(
														"pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary",
														errors.fullName && "border-red-400"
													)}
													disabled={isSubmitting}
												/>
											</div>
											{errors.fullName && (
												<p className="text-xs text-red-400">
													{errors.fullName.message}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="email"
												className="text-sm font-medium text-white"
											>
												E-postadress <span className="text-red-400">*</span>
											</Label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
												<Input
													id="email"
													type="email"
													{...register("email")}
													placeholder="E-postadress"
													className={cn(
														"pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary",
														errors.email && "border-red-400"
													)}
													disabled={isSubmitting}
												/>
											</div>
											{errors.email && (
												<p className="text-xs text-red-400">
													{errors.email.message}
												</p>
											)}
										</div>
									</div>

									{/* Phone */}
									<div className="space-y-2">
										<Label className="text-sm font-medium text-white">
											Telefon <span className="text-red-400">*</span>
										</Label>
										<div className="flex gap-3">
											<div className="w-[120px] shrink-0">
												<CountryCodeSelect
													value={selectedCountry}
													onChange={handleCountryChange}
													disabled={isSubmitting}
												/>
											</div>
											<div className="relative flex-1">
												<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
												<Input
													id="phone"
													type="tel"
													{...register("phone")}
													placeholder="Telefonnummer"
													className={cn(
														"pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary",
														errors.phone && "border-red-400"
													)}
													disabled={isSubmitting}
												/>
											</div>
										</div>
										{errors.phone && (
											<p className="text-xs text-red-400">
												{errors.phone.message}
											</p>
										)}
									</div>

									{/* Message */}
									<div className="space-y-2">
										<Label
											htmlFor="message"
											className="text-sm font-medium text-white"
										>
											Meddelande{" "}
											<span className="text-white/50 font-normal">
												(valfritt)
											</span>
										</Label>
										<Textarea
											id="message"
											{...register("message")}
											placeholder="Berätta om dina planer..."
											className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary resize-none"
											disabled={isSubmitting}
										/>
									</div>

									{/* GDPR */}
									<div className="space-y-2">
										<label
											htmlFor="gdprConsent"
											className={cn(
												"flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
												errors.gdprConsent
													? "border-red-400 bg-red-400/10"
													: gdprChecked
														? "border-primary bg-primary/10"
														: "border-white/20 bg-white/5"
											)}
										>
											<Checkbox
												id="gdprConsent"
												checked={gdprChecked}
												onCheckedChange={(checked) =>
													handleGdprChange(checked === true)
												}
												disabled={isSubmitting}
												className="mt-0.5 shrink-0 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span className="text-sm text-white/80 leading-normal">
												Jag godkänner{" "}
												<Link
													href="/integritetspolicy"
													className="text-primary hover:underline font-medium"
													target="_blank"
													onClick={(e) => e.stopPropagation()}
												>
													Synos integritetspolicy
												</Link>{" "}
												<span className="text-red-400">*</span>
											</span>
										</label>
										{errors.gdprConsent && (
											<p className="text-xs text-red-400">
												{errors.gdprConsent.message}
											</p>
										)}
									</div>

									{/* Submit */}
									<Button
										type="submit"
										disabled={isSubmitting}
										size="lg"
										className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
									>
										{isSubmitting ? (
											<>
												<Loader2 className="w-5 h-5 mr-2 animate-spin" />
												Skickar...
											</>
										) : (
											<>
												<Send className="w-5 h-5 mr-2" />
												Skicka Förfrågan
											</>
										)}
									</Button>
								</motion.form>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Bottom CTA Section */}
			<section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="max-w-3xl mx-auto text-center"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
							Redo att ta nästa steg?
						</h2>
						<p className="text-muted-foreground mb-8 text-lg">
							Vi hjälper dig att förverkliga din dröm om en egen hudklinik. Ta
							kontakt med oss idag för en kostnadsfri konsultation.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button asChild size="lg" className="group">
								<a href="#kontakt-formular">
									Kontakta Oss Nu
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</a>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/produkter">Se Våra Produkter</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Application Form Section */}
			<ApplicationFormSection />
		</div>
	);
}

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
