"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrainingInquiryForm } from "@/components/forms/TrainingInquiryForm";
import {
	BookOpen,
	CheckSquare,
	HeartPlus,
	Mail,
	GraduationCap,
	Award,
	Users,
	Zap,
	type LucideIcon,
} from "lucide-react";
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

export function TrainingPageClient({ data }: TrainingPageClientProps) {
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
			data.supportSection.paragraphs.filter((p) => p && p.trim()).length >
				0) ||
		data.supportSection?.phone ||
		data.supportSection?.email;
	const hasInquiry =
		data.inquirySection?.badge ||
		data.inquirySection?.title ||
		data.inquirySection?.subtitle;
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
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<div className="mb-16 text-center">
					{(data.hero?.title || data.hero?.titleHighlight) && (
						<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
							{data.hero.title}{" "}
							{data.hero.titleHighlight && (
								<span className="text-secondary">
									{data.hero.titleHighlight}
								</span>
							)}
						</h1>
					)}
					{data.hero?.subtitle && (
						<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
							{data.hero.subtitle}
						</p>
					)}
				</div>
			)}

			{/* Main Content Section */}
			{visibility.mainContent && hasMainContent && (
				<section className="mb-20">
					<div className="mb-12 rounded-lg bg-linear-to-r from-primary/10 to-primary/5 p-8 md:p-12">
						{data.mainContent?.title && (
							<h2 className="mb-6 text-3xl font-bold">
								{data.mainContent.title}
							</h2>
						)}
						{validParagraphsMain.length > 0 && (
							<div className="space-y-4 text-lg leading-relaxed">
								{validParagraphsMain.map((paragraph, index) => (
									<p
										key={index}
										dangerouslySetInnerHTML={{ __html: paragraph }}
									/>
								))}
							</div>
						)}
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

			{/* Training Process Section */}
			{visibility.process && hasProcess && (
				<section className="mb-20">
					{(data.processSection?.title || data.processSection?.subtitle) && (
						<div className="mb-12 text-center">
							{data.processSection?.title && (
								<h2 className="mb-4 text-3xl font-bold">
									{data.processSection.title}
								</h2>
							)}
							{data.processSection?.subtitle && (
								<p className="mx-auto max-w-2xl text-muted-foreground">
									{data.processSection.subtitle}
								</p>
							)}
						</div>
					)}

					{validSteps.length > 0 && (
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
							{validSteps.map((step, index) => (
								<div key={index} className="relative">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
										<span className="text-xl font-bold">
											{step.number || index + 1}
										</span>
									</div>
									<h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
									{step.description && (
										<p className="text-sm text-muted-foreground">
											{step.description}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{/* Support Section */}
			{visibility.support && hasSupport && (
				<section className="mb-20">
					<div className="rounded-lg border border-primary/20 bg-card p-8 md:p-12">
						<div className="grid gap-8 md:grid-cols-2">
							<div>
								{data.supportSection?.title && (
									<h2 className="mb-4 text-2xl font-bold">
										{data.supportSection.title}
									</h2>
								)}
								{validParagraphsSupport.length > 0 && (
									<div className="space-y-4">
										{validParagraphsSupport.map((paragraph, index) => (
											<p key={index} className="text-muted-foreground">
												{paragraph}
											</p>
										))}
									</div>
								)}
								{(data.supportSection?.phone ||
									data.supportSection?.email) && (
									<div className="mt-6 flex flex-wrap gap-4">
										{data.supportSection?.phone && (
											<Button asChild>
												<a href={`tel:${data.supportSection.phone}`}>
													{data.supportSection.phone}
												</a>
											</Button>
										)}
										{data.supportSection?.email && (
											<Button asChild variant="outline">
												<a href={`mailto:${data.supportSection.email}`}>
													{data.supportSection.email}
												</a>
											</Button>
										)}
									</div>
								)}
							</div>
							<div className="flex items-center justify-center">
								<div className="rounded-lg bg-secondary/10 p-8">
									<svg
										className="h-32 w-32 text-secondary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Training Inquiry Form Section */}
			{visibility.inquiryForm && (
				<section className="mb-20">
					<div className="mx-auto max-w-5xl">
						{hasInquiry && (
							<div className="mb-12 text-center">
								{data.inquirySection?.badge && (
									<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
										<Mail className="h-4 w-4" />
										<span className="text-sm font-semibold">
											{data.inquirySection.badge}
										</span>
									</div>
								)}
								{data.inquirySection?.title && (
									<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
										{data.inquirySection.title}
									</h2>
								)}
								{data.inquirySection?.subtitle && (
									<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
										{data.inquirySection.subtitle}
									</p>
								)}
							</div>
						)}
						<TrainingInquiryForm />
					</div>
				</section>
			)}

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
											<svg
												className="h-8 w-8 text-secondary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
												/>
											</svg>
										</div>
										<h3 className="mb-3 text-xl font-semibold group-hover:text-secondary">
											{resource.title}
										</h3>
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
