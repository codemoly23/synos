"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PrivacyPageData } from "@/lib/repositories/privacy-page.repository";

interface PrivacyPageClientProps {
	data: PrivacyPageData;
}

// Helper component for content sections
function ContentSection({
	section,
	className = "",
}: {
	section: {
		sectionNumber?: string;
		title?: string;
		intro?: string;
		items?: { title?: string; description?: string }[];
		outro?: string;
		highlighted?: boolean;
	};
	className?: string;
}) {
	const hasContent =
		section.title ||
		section.intro ||
		(section.items && section.items.filter((i) => i.title || i.description).length > 0) ||
		section.outro;

	if (!hasContent) return null;

	const validItems = (section.items || []).filter(
		(i) => i.title || i.description
	);

	const baseClasses = section.highlighted
		? "rounded-lg bg-muted/50 p-6 sm:p-8"
		: "";

	return (
		<section className={`${baseClasses} ${className}`}>
			{section.title && (
				<h2 className="mb-4 text-2xl font-bold text-secondary">
					{section.sectionNumber && `${section.sectionNumber} `}
					{section.title}
				</h2>
			)}
			<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
				{section.intro && <p>{section.intro}</p>}
				{validItems.length > 0 && (
					<ul className="ml-6 list-disc space-y-2">
						{validItems.map((item, index) => (
							<li key={index}>
								{item.title && <strong>{item.title}:</strong>}{" "}
								{item.description}
							</li>
						))}
					</ul>
				)}
				{section.outro && <p className="mt-4">{section.outro}</p>}
			</div>
		</section>
	);
}

export function PrivacyPageClient({ data }: PrivacyPageClientProps) {
	const visibility = data.sectionVisibility || {
		hero: true,
		introduction: true,
		dataCollection: true,
		purposeOfProcessing: true,
		legalBasis: true,
		dataRetention: true,
		dataSharing: true,
		yourRights: true,
		security: true,
		cookies: true,
		contact: true,
		policyChanges: true,
		cta: true,
	};

	// Check if we have content to display
	const hasHero =
		data.hero?.title || data.hero?.subtitle || data.hero?.lastUpdated;
	const hasIntroduction =
		data.introduction?.title ||
		data.introduction?.intro ||
		(data.introduction?.items &&
			data.introduction.items.filter((i) => i.title || i.description).length >
				0);
	const hasDataCollection =
		data.dataCollection?.title ||
		data.dataCollection?.intro ||
		(data.dataCollection?.items &&
			data.dataCollection.items.filter((i) => i.title || i.description).length >
				0);
	const hasPurposeOfProcessing =
		data.purposeOfProcessing?.title ||
		data.purposeOfProcessing?.intro ||
		(data.purposeOfProcessing?.items &&
			data.purposeOfProcessing.items.filter((i) => i.title || i.description)
				.length > 0);
	const hasLegalBasis =
		data.legalBasis?.title ||
		data.legalBasis?.intro ||
		(data.legalBasis?.items &&
			data.legalBasis.items.filter((i) => i.title || i.description).length > 0);
	const hasDataRetention =
		data.dataRetention?.title ||
		data.dataRetention?.intro ||
		(data.dataRetention?.items &&
			data.dataRetention.items.filter((i) => i.title || i.description).length >
				0);
	const hasDataSharing =
		data.dataSharing?.title ||
		data.dataSharing?.intro ||
		(data.dataSharing?.items &&
			data.dataSharing.items.filter((i) => i.title || i.description).length >
				0);
	const hasYourRights =
		data.yourRights?.title ||
		data.yourRights?.intro ||
		(data.yourRights?.items &&
			data.yourRights.items.filter((i) => i.title || i.description).length > 0);
	const hasSecurity =
		data.security?.title ||
		data.security?.intro ||
		(data.security?.items &&
			data.security.items.filter((i) => i.title || i.description).length > 0);
	const hasCookies =
		data.cookies?.title ||
		data.cookies?.intro ||
		(data.cookies?.items &&
			data.cookies.items.filter((i) => i.title || i.description).length > 0);
	const hasContact =
		data.contact?.title ||
		data.contact?.companyName ||
		data.contact?.email ||
		data.contact?.phone;
	const hasPolicyChanges =
		data.policyChanges?.title ||
		data.policyChanges?.intro ||
		(data.policyChanges?.items &&
			data.policyChanges.items.filter((i) => i.title || i.description).length >
				0);
	const hasCta =
		data.ctaSection?.text ||
		data.ctaSection?.primaryCta?.text ||
		data.ctaSection?.secondaryCta?.text;

	const validContactAddresses = (data.contact?.addresses || []).filter(
		(a) => a && a.trim()
	);

	return (
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<div className="mb-12 text-center">
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
					{data.hero?.lastUpdated && (
						<p className="mt-2 text-sm text-muted-foreground">
							Senast uppdaterad: {data.hero.lastUpdated}
						</p>
					)}
				</div>
			)}

			{/* Main Content */}
			<div className="mx-auto max-w-4xl space-y-10">
				{/* Introduction */}
				{visibility.introduction && hasIntroduction && (
					<ContentSection section={data.introduction} />
				)}

				{/* Data Collection */}
				{visibility.dataCollection && hasDataCollection && (
					<ContentSection
						section={{
							...data.dataCollection,
							highlighted:
								data.dataCollection.highlighted !== undefined
									? data.dataCollection.highlighted
									: true,
						}}
					/>
				)}

				{/* Purpose of Processing */}
				{visibility.purposeOfProcessing && hasPurposeOfProcessing && (
					<ContentSection section={data.purposeOfProcessing} />
				)}

				{/* Legal Basis */}
				{visibility.legalBasis && hasLegalBasis && (
					<ContentSection
						section={{
							...data.legalBasis,
							highlighted:
								data.legalBasis.highlighted !== undefined
									? data.legalBasis.highlighted
									: true,
						}}
					/>
				)}

				{/* Data Retention */}
				{visibility.dataRetention && hasDataRetention && (
					<ContentSection section={data.dataRetention} />
				)}

				{/* Data Sharing */}
				{visibility.dataSharing && hasDataSharing && (
					<ContentSection
						section={{
							...data.dataSharing,
							highlighted:
								data.dataSharing.highlighted !== undefined
									? data.dataSharing.highlighted
									: true,
						}}
					/>
				)}

				{/* Your Rights */}
				{visibility.yourRights && hasYourRights && (
					<ContentSection section={data.yourRights} />
				)}

				{/* Security */}
				{visibility.security && hasSecurity && (
					<ContentSection
						section={{
							...data.security,
							highlighted:
								data.security.highlighted !== undefined
									? data.security.highlighted
									: true,
						}}
					/>
				)}

				{/* Cookies */}
				{visibility.cookies && hasCookies && (
					<ContentSection section={data.cookies} />
				)}

				{/* Contact */}
				{visibility.contact && hasContact && (
					<section
						className={
							data.contact?.highlighted !== false
								? "rounded-lg bg-muted/50 p-6 sm:p-8"
								: ""
						}
					>
						{data.contact?.title && (
							<h2 className="mb-4 text-2xl font-bold text-secondary">
								{data.contact.sectionNumber && `${data.contact.sectionNumber} `}
								{data.contact.title}
							</h2>
						)}
						<div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
							{data.contact?.intro && <p>{data.contact.intro}</p>}
							<div className="mt-4 space-y-2">
								{data.contact?.companyName && (
									<p>
										<strong>{data.contact.companyName}</strong>
									</p>
								)}
								{data.contact?.organizationNumber && (
									<p>Organisationsnummer: {data.contact.organizationNumber}</p>
								)}
								{data.contact?.email && (
									<p>
										E-post:{" "}
										<a
											href={`mailto:${data.contact.email}`}
											className="text-primary hover:underline"
										>
											{data.contact.email}
										</a>
									</p>
								)}
								{data.contact?.phone && (
									<p>
										Telefon:{" "}
										<a
											href={`tel:${data.contact.phone}`}
											className="text-primary hover:underline"
										>
											{data.contact.phone}
										</a>
									</p>
								)}
								{validContactAddresses.map((address, index) => (
									<p key={index}>{address}</p>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Policy Changes */}
				{visibility.policyChanges && hasPolicyChanges && (
					<ContentSection
						section={{
							...data.policyChanges,
							highlighted:
								data.policyChanges.highlighted !== undefined
									? data.policyChanges.highlighted
									: true,
						}}
					/>
				)}

				{/* CTA */}
				{visibility.cta && hasCta && (
					<section className="mt-12 text-center">
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
		</div>
	);
}
