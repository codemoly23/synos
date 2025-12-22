"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactFormSection } from "./_components/contact-form-section";
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
	type LucideIcon,
} from "lucide-react";
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
};

interface StartaEgetPageClientProps {
	data: StartaEgetPageData;
}

export function StartaEgetPageClient({ data }: StartaEgetPageClientProps) {
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
		<div className="_container mx-auto px-4 py-12 padding-top">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<div className="mb-16 text-center">
					{(data.hero?.title || data.hero?.titleHighlight) && (
						<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
							{data.hero.title}
							{data.hero.titleHighlight && (
								<>
									<br />
									<span className="text-secondary">
										{data.hero.titleHighlight}
									</span>
								</>
							)}
						</h1>
					)}
					{data.hero?.subtitle && (
						<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
							{data.hero.subtitle}
						</p>
					)}
					{data.hero?.callout && (
						<p className="mx-auto mt-4 max-w-3xl text-xl font-semibold text-secondary">
							{data.hero.callout}
						</p>
					)}
				</div>
			)}

			{/* Main Content Section */}
			{visibility.mainContent && hasMainContent && (
				<section className="mb-20">
					<div className="mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
						{data.mainContent?.title && (
							<h2 className="mb-4 text-3xl font-bold">
								{data.mainContent.title}
							</h2>
						)}
						{data.mainContent?.subtitle && (
							<h3 className="mb-4 text-xl font-semibold text-secondary">
								{data.mainContent.subtitle}
							</h3>
						)}
						{validParagraphs.map((paragraph, index) => (
							<p
								key={index}
								className={`text-lg leading-relaxed ${index < validParagraphs.length - 1 ? "mb-4" : ""}`}
							>
								{paragraph}
							</p>
						))}
					</div>

					{/* Benefits Grid */}
					{visibility.benefits && hasBenefits && (
						<div className="mb-12 grid gap-8 md:grid-cols-3">
							{validBenefits.map((benefit, index) => {
								const IconComponent = benefit.icon
									? ICON_MAP[benefit.icon] || BookOpen
									: BookOpen;
								return (
									<Card key={index} className="border-primary/20">
										<CardContent className="p-8">
											<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10">
												<IconComponent className="h-8 w-8 text-secondary" />
											</div>
											<h3 className="mb-3 text-xl font-semibold">
												{benefit.title}
											</h3>
											{benefit.description && (
												<p className="text-muted-foreground">
													{benefit.description}
												</p>
											)}
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</section>
			)}

			{/* Features Section */}
			{visibility.features && hasFeatures && (
				<section className="mb-20">
					<div className="rounded-lg border border-primary/20 bg-card p-8 md:p-12">
						{data.featuresSection?.title && (
							<h2 className="mb-6 text-3xl font-bold">
								{data.featuresSection.title}
							</h2>
						)}
						{data.featuresSection?.intro && (
							<p className="mb-6 text-lg leading-relaxed text-muted-foreground">
								{data.featuresSection.intro}
							</p>
						)}
						{validFeatures.length > 0 && (
							<div className="space-y-6">
								{validFeatures.map((feature, index) => (
									<div key={index} className="flex gap-4">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
											<CheckCircle className="h-5 w-5 text-secondary" />
										</div>
										<div>
											{feature.title && (
												<h3 className="mb-2 text-lg font-semibold">
													{feature.title}
												</h3>
											)}
											{feature.description && (
												<p className="text-muted-foreground">
													{feature.description}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			)}

			{/* Contact Form Section */}
			{visibility.contactForm && <ContactFormSection />}

			{/* Resources Grid */}
			{visibility.resources && hasResources && (
				<section>
					{(data.resourcesSection?.title ||
						data.resourcesSection?.subtitle) && (
						<div className="mb-8 text-center">
							{data.resourcesSection?.title && (
								<h2 className="mb-3 text-3xl font-bold">
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
						<div className="grid gap-8 md:grid-cols-3">
							{validResources.map((resource, index) => (
								<Card
									key={index}
									className="group overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-xl"
								>
									<CardContent className="p-8">
										<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10 transition-colors group-hover:bg-secondary/20">
											<FileText className="h-8 w-8 text-secondary" />
										</div>
										{resource.title && (
											<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
												{resource.title}
											</h3>
										)}
										{resource.description && (
											<p className="mb-6 text-muted-foreground">
												{resource.description}
											</p>
										)}
										{resource.href && (
											<Button asChild className="w-full">
												<Link href={resource.href}>
													{resource.buttonText || "Läs mer"}
												</Link>
											</Button>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
