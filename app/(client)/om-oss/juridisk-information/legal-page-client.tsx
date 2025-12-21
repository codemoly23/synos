"use client";

import Link from "next/link";
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
	type LucideIcon,
} from "lucide-react";
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
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<div className="mb-12 text-center">
					{data.hero?.badge && (
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
							<Scale className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium text-primary">
								{data.hero.badge}
							</span>
						</div>
					)}
					{data.hero?.title && (
						<h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
							{data.hero.title}
						</h1>
					)}
					{data.hero?.subtitle && (
						<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
							{data.hero.subtitle}
						</p>
					)}
				</div>
			)}

			{/* Legal Sections Grid */}
			{visibility.legalCards && hasLegalCards && (
				<div className="mx-auto max-w-5xl">
					<div className="grid gap-6 md:grid-cols-2">
						{validLegalCards.map((section, index) => {
							const IconComponent = section.icon
								? ICON_MAP[section.icon] || Shield
								: Shield;
							const isExternal = section.href?.startsWith("#");

							return (
								<div
									key={index}
									className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
								>
									<div className="mb-4 flex items-start justify-between">
										<div className="rounded-lg bg-primary/10 p-3">
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
										<ul className="space-y-1">
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
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Company Information Section */}
			{visibility.companyInfo && hasCompanyInfo && (
				<section id="foretagsinformation" className="mx-auto mt-16 max-w-4xl">
					<h2 className="mb-8 text-center text-3xl font-bold text-secondary">
						Företagsinformation
					</h2>
					<div className="rounded-xl border border-border bg-card p-8">
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
							<div className="mt-8 border-t border-border pt-8">
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
				</section>
			)}

			{/* Terms Section */}
			{visibility.terms && hasTerms && (
				<section id="allmanna-villkor" className="mx-auto mt-16 max-w-4xl">
					{data.termsSection?.title && (
						<h2 className="mb-8 text-center text-3xl font-bold text-secondary">
							{data.termsSection.title}
						</h2>
					)}
					{validTerms.length > 0 && (
						<div className="space-y-6">
							{validTerms.map((term, index) => (
								<div
									key={index}
									className="rounded-xl border border-border bg-card p-6"
								>
									{term.title && (
										<h3 className="mb-3 text-lg font-bold text-secondary">
											{term.title}
										</h3>
									)}
									{term.content && (
										<p className="text-muted-foreground">{term.content}</p>
									)}
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{/* GDPR Rights Summary */}
			{visibility.gdprRights && hasGdprRights && (
				<section className="mx-auto mt-16 max-w-4xl">
					<div className="rounded-xl bg-primary/5 p-8">
						{data.gdprSection?.title && (
							<h2 className="mb-6 text-2xl font-bold text-secondary">
								{data.gdprSection.title}
							</h2>
						)}
						{validGdprRights.length > 0 && (
							<div className="grid gap-4 sm:grid-cols-2">
								{validGdprRights.map((right, index) => (
									<div key={index} className="flex items-start gap-3">
										<div className="rounded-full bg-primary/10 p-2">
											<Shield className="h-4 w-4 text-primary" />
										</div>
										<div>
											{right.title && (
												<p className="font-medium text-foreground">
													{right.title}
												</p>
											)}
											{right.description && (
												<p className="text-sm text-muted-foreground">
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
										<Button asChild variant="outline">
											<Link href={data.gdprSection.secondaryCta.href}>
												{data.gdprSection.secondaryCta.text}
											</Link>
										</Button>
									)}
							</div>
						)}
					</div>
				</section>
			)}

			{/* CTA */}
			{visibility.cta && hasCta && (
				<section className="mt-16 text-center">
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
				</section>
			)}
		</div>
	);
}
