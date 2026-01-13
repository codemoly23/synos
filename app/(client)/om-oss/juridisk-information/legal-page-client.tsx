"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Shield,
	FileText,
	Scale,
	Cookie,
	Mail,
	Phone,
	MapPin,
	ExternalLink,
	Home,
	ChevronRight,
	type LucideIcon,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import type { LegalPageData } from "@/lib/repositories/legal-page.repository";

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
	Shield,
	FileText,
	Scale,
	Cookie,
};

interface LegalPageClientProps {
	data: LegalPageData;
}

export function LegalPageClient({ data }: LegalPageClientProps) {
	// Set navbar to dark-hero variant
	useSetNavbarVariant("dark-hero");

	const visibility = data.sectionVisibility || {
		hero: true,
		legalCards: true,
		companyInfo: true,
		terms: true,
		gdprRights: true,
		cta: true,
	};

	// Check if we have content to display
	const hasHero = data.hero?.badge || data.hero?.title || data.hero?.subtitle;
	const hasLegalCards =
		data.legalCards &&
		data.legalCards.filter((c) => c.title || c.description).length > 0;
	const hasCompanyInfo =
		data.companyInfo?.companyName || data.companyInfo?.organizationNumber;
	const hasTerms =
		data.termsSection?.title ||
		(data.termsSection?.terms &&
			data.termsSection.terms.filter((t) => t.title || t.content).length > 0);
	const hasGdprRights =
		data.gdprSection?.title ||
		(data.gdprSection?.rights &&
			data.gdprSection.rights.filter((r) => r.title).length > 0);
	const hasCta =
		data.ctaSection?.text ||
		data.ctaSection?.primaryCta?.text ||
		data.ctaSection?.secondaryCta?.text;

	const validLegalCards = (data.legalCards || []).filter(
		(c) => c.title || c.description
	);
	const validTerms = (data.termsSection?.terms || []).filter(
		(t) => t.title || t.content
	);
	const validGdprRights = (data.gdprSection?.rights || []).filter(
		(r) => r.title
	);
	const validOffices = (data.companyInfo?.offices || []).filter(
		(o) => o.name || o.address
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
								<Link
									href="/om-oss"
									className="text-white/60 hover:text-primary transition-colors"
								>
									Om Oss
								</Link>
								<ChevronRight className="h-4 w-4 text-white/40" />
								<span className="text-white font-medium">Juridisk Information</span>
							</motion.nav>

							{/* Badge */}
							{data.hero?.badge && (
								<motion.div
									variants={fadeUp}
									className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"
								>
									<Scale className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium text-white">
										{data.hero.badge}
									</span>
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

			{/* Featured Image Section - Integritetspolicy */}
			<section className="py-16 md:py-24">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="mx-auto max-w-6xl"
					>
						{/* Full Width Image */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12"
						>
							<Image
								src="/images/juridisk-information-featured.jpg"
								alt="Juridisk Information - Integritetspolicy"
								fill
								className="object-cover"
								priority
							/>
							<div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
								Featured Image
							</div>
						</motion.div>

						{/* Content Below Image */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="max-w-4xl mx-auto"
						>
							<div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary uppercase tracking-wider">
								Integritetspolicy
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
								Integritetspolicy
							</h2>
							<div className="prose prose-slate max-w-none">
								<p className="text-lg text-muted-foreground mb-6">
									Den här texten förklarar hur Synos Medical AB hanterar de uppgifter som vi samlar in om dig, i samband med att du använder våra webbplatser eller kommunicerar digitalt med oss.
								</p>
								<h3 className="text-xl font-bold text-secondary mt-8 mb-4">
									Vem ansvarar för de personuppgifter vi samlar in?
								</h3>
								<p className="text-muted-foreground mb-6">
									Synos Medical AB (org. nr. 556871-8075), S-Corp AB (org. nr. 559269-0407) och Revage AB (org. nr. 559322-6813) är personuppgiftsansvariga för de uppgifter du lämnar, när du använder vår webbplats eller kommunicerar digitalt med oss.
								</p>
								<h3 className="text-xl font-bold text-secondary mt-8 mb-4">
									När samlar vi in information?
								</h3>
								<p className="text-muted-foreground">
									Vi samlar in information om dig när du begär att få tillgång till material, kontaktar oss via mail, pop-ups eller formulär på webben, begär att bli uppringd av någon av våra produktspecialister, hör av dig via sms eller registrerar dig som prenumerant på våra nyhetsbrev. Vi använder cookies och pixlar (se nedan) på våra webbsidor för att spåra användardata och -beteenden.
								</p>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Legal Sections Grid */}
			{visibility.legalCards && hasLegalCards && (
				<section className="py-16 md:py-20">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="mx-auto max-w-5xl"
						>
							<div className="grid gap-6 md:grid-cols-2">
								{validLegalCards.map((section, index) => {
									const IconComponent = section.icon
										? ICON_MAP[section.icon] || Shield
										: Shield;
									const isExternal = section.href?.startsWith("#");

									return (
										<motion.div
											key={index}
											variants={fadeUp}
											className="group rounded-2xl border border-slate-200/80 bg-white p-6 transition-all hover:border-primary/30 hover:shadow-xl"
										>
											<div className="mb-4 flex items-start justify-between">
												<div className="rounded-xl bg-primary/10 p-3">
													<IconComponent className="h-6 w-6 text-primary" />
												</div>
												{section.href && !isExternal && (
													<Link
														href={section.href}
														className="flex items-center gap-1 text-sm text-primary hover:underline"
													>
														Läs mer
														<ExternalLink className="h-3 w-3" />
													</Link>
												)}
											</div>
											{section.title && (
												<h3 className="mb-2 text-xl font-bold text-secondary">
													{section.title}
												</h3>
											)}
											{section.description && (
												<p className="mb-4 text-muted-foreground">
													{section.description}
												</p>
											)}
											{section.highlights && section.highlights.length > 0 && (
												<ul className="space-y-2">
													{section.highlights.map((highlight, hIndex) => (
														<li
															key={hIndex}
															className="flex items-center gap-2 text-sm text-muted-foreground"
														>
															<span className="h-1.5 w-1.5 rounded-full bg-primary" />
															{highlight}
														</li>
													))}
												</ul>
											)}
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					</div>
				</section>
			)}

			{/* Company Information Section */}
			{visibility.companyInfo && hasCompanyInfo && (
				<section id="foretagsinformation" className="py-16 md:py-20 bg-white">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="mx-auto max-w-4xl"
						>
							<h2 className="mb-8 text-center text-3xl font-bold text-secondary">
								Företagsinformation
							</h2>
							<div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-8">
								<div className="grid gap-8 md:grid-cols-2">
									<div>
										{data.companyInfo?.companyName && (
											<h3 className="mb-4 text-xl font-bold text-secondary">
												{data.companyInfo.companyName}
											</h3>
										)}
										<div className="space-y-3 text-muted-foreground">
											{data.companyInfo?.organizationNumber && (
												<p>
													<span className="font-medium text-foreground">
														Organisationsnummer:
													</span>{" "}
													{data.companyInfo.organizationNumber}
												</p>
											)}
											{data.companyInfo?.vatNumber && (
												<p>
													<span className="font-medium text-foreground">
														Momsregistreringsnummer:
													</span>{" "}
													{data.companyInfo.vatNumber}
												</p>
											)}
											{data.companyInfo?.registeredSeat && (
												<p>
													<span className="font-medium text-foreground">
														Registrerat säte:
													</span>{" "}
													{data.companyInfo.registeredSeat}
												</p>
											)}
										</div>
									</div>
									{validOffices.length > 0 && (
										<div>
											<h3 className="mb-4 text-xl font-bold text-secondary">
												Kontorsadresser
											</h3>
											<div className="space-y-4">
												{validOffices.map((office, index) => (
													<div key={index} className="flex items-start gap-3">
														<MapPin className="mt-1 h-5 w-5 text-primary" />
														<div>
															{office.name && (
																<p className="font-medium text-foreground">
																	{office.name}
																</p>
															)}
															{office.address && (
																<p className="text-muted-foreground">
																	{office.address}
																</p>
															)}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
								{(data.companyInfo?.email || data.companyInfo?.phone) && (
									<div className="mt-8 border-t border-slate-200 pt-8">
										<h3 className="mb-4 text-xl font-bold text-secondary">
											Kontaktuppgifter
										</h3>
										<div className="flex flex-wrap gap-6">
											{data.companyInfo?.email && (
												<a
													href={`mailto:${data.companyInfo.email}`}
													className="flex items-center gap-2 text-primary hover:underline"
												>
													<Mail className="h-5 w-5" />
													{data.companyInfo.email}
												</a>
											)}
											{data.companyInfo?.phone && (
												<a
													href={`tel:${data.companyInfo.phone}`}
													className="flex items-center gap-2 text-primary hover:underline"
												>
													<Phone className="h-5 w-5" />
													{data.companyInfo.phone}
												</a>
											)}
										</div>
									</div>
								)}
							</div>
						</motion.div>
					</div>
				</section>
			)}

			{/* Terms Section */}
			{visibility.terms && hasTerms && (
				<section id="allmanna-villkor" className="py-16 md:py-20">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="mx-auto max-w-4xl"
						>
							{data.termsSection?.title && (
								<h2 className="mb-8 text-center text-3xl font-bold text-secondary">
									{data.termsSection.title}
								</h2>
							)}
							{validTerms.length > 0 && (
								<div className="space-y-6">
									{validTerms.map((term, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 10 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ delay: index * 0.1 }}
											className="rounded-2xl border border-slate-200/80 bg-white p-6"
										>
											{term.title && (
												<h3 className="mb-3 text-lg font-bold text-secondary">
													{term.title}
												</h3>
											)}
											{term.content && (
												<p className="text-muted-foreground">{term.content}</p>
											)}
										</motion.div>
									))}
								</div>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* GDPR Rights Summary */}
			{visibility.gdprRights && hasGdprRights && (
				<section className="py-16 md:py-20 bg-secondary">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="mx-auto max-w-4xl"
						>
							<div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 border border-white/20">
								{data.gdprSection?.title && (
									<h2 className="mb-6 text-2xl font-bold text-white">
										{data.gdprSection.title}
									</h2>
								)}
								{validGdprRights.length > 0 && (
									<div className="grid gap-4 sm:grid-cols-2">
										{validGdprRights.map((right, index) => (
											<div key={index} className="flex items-start gap-3">
												<div className="rounded-full bg-primary/20 p-2">
													<Shield className="h-4 w-4 text-primary" />
												</div>
												<div>
													{right.title && (
														<p className="font-medium text-white">
															{right.title}
														</p>
													)}
													{right.description && (
														<p className="text-sm text-white/70">
															{right.description}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								)}
								{(data.gdprSection?.primaryCta?.text ||
									data.gdprSection?.secondaryCta?.text) && (
									<div className="mt-6 flex flex-wrap gap-4">
										{data.gdprSection?.primaryCta?.text &&
											data.gdprSection?.primaryCta?.href && (
												<Button asChild>
													<Link href={data.gdprSection.primaryCta.href}>
														{data.gdprSection.primaryCta.text}
													</Link>
												</Button>
											)}
										{data.gdprSection?.secondaryCta?.text &&
											data.gdprSection?.secondaryCta?.href && (
												<Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
													<Link href={data.gdprSection.secondaryCta.href}>
														{data.gdprSection.secondaryCta.text}
													</Link>
												</Button>
											)}
									</div>
								)}
							</div>
						</motion.div>
					</div>
				</section>
			)}

			{/* CTA */}
			{visibility.cta && hasCta && (
				<section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="max-w-3xl mx-auto text-center"
						>
							{data.ctaSection?.text && (
								<p className="mb-6 text-lg text-muted-foreground">
									{data.ctaSection.text}
								</p>
							)}
							{(data.ctaSection?.primaryCta?.text ||
								data.ctaSection?.secondaryCta?.text) && (
								<div className="flex flex-wrap justify-center gap-4">
									{data.ctaSection?.primaryCta?.text &&
										data.ctaSection?.primaryCta?.href && (
											<Button asChild size="lg">
												<Link href={data.ctaSection.primaryCta.href}>
													{data.ctaSection.primaryCta.text}
												</Link>
											</Button>
										)}
									{data.ctaSection?.secondaryCta?.text &&
										data.ctaSection?.secondaryCta?.href && (
											<Button asChild variant="outline" size="lg">
												<a href={data.ctaSection.secondaryCta.href}>
													{data.ctaSection.secondaryCta.text}
												</a>
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
