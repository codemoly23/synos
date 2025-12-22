"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactFormSection } from "../../starta-eget/_components/contact-form-section";
import {
	Briefcase,
	MapPin,
	Clock,
	ArrowRight,
	Sparkles,
	Heart,
	GraduationCap,
	Users,
	Building2,
	Star,
	Shield,
	Coffee,
	Zap,
	type LucideIcon,
} from "lucide-react";
import type { CareersPageData } from "@/lib/repositories/careers-page.repository";

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
	Heart,
	GraduationCap,
	Users,
	Building2,
	Briefcase,
	Star,
	Shield,
	Clock,
	Coffee,
	Zap,
};

interface CareersPageClientProps {
	data: CareersPageData;
}

export function CareersPageClient({ data }: CareersPageClientProps) {
	const visibility = data.sectionVisibility || {
		hero: true,
		benefits: true,
		jobOpenings: true,
		values: true,
		applicationForm: true,
	};

	// Check if we have content to display
	const hasHero =
		data.hero?.badge ||
		data.hero?.title ||
		data.hero?.titleHighlight ||
		data.hero?.subtitle;
	const hasBenefits =
		data.benefitsSection?.title ||
		data.benefitsSection?.subtitle ||
		(data.benefitsSection?.benefits &&
			data.benefitsSection.benefits.filter((b) => b.title).length > 0);
	const hasJobOpenings =
		data.jobOpeningsSection?.title ||
		data.jobOpeningsSection?.subtitle ||
		data.jobOpeningsSection?.noJobsMessage ||
		(data.jobOpeningsSection?.jobOpenings &&
			data.jobOpeningsSection.jobOpenings.filter((j) => j.title).length > 0);
	const hasValues =
		data.valuesSection?.title ||
		data.valuesSection?.subtitle ||
		(data.valuesSection?.values &&
			data.valuesSection.values.filter((v) => v && v.trim()).length > 0);

	const validBenefits = (data.benefitsSection?.benefits || []).filter(
		(b) => b.title
	);
	const validJobOpenings = (data.jobOpeningsSection?.jobOpenings || []).filter(
		(j) => j.title
	);
	const validValues = (data.valuesSection?.values || []).filter(
		(v) => v && v.trim()
	);

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-slate-100 to-white pt-32 pb-16">
					<div className="_container">
						<Breadcrumb
							items={[
								{ label: "Om Oss", href: "/om-oss" },
								{ label: "Lediga Tjänster" },
							]}
						/>

						<div className="mt-8 max-w-4xl">
							{data.hero?.badge && (
								<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
									<Briefcase className="h-4 w-4 text-primary" />
									<span className="text-sm font-semibold text-primary">
										{data.hero.badge}
									</span>
								</div>
							)}

							{(data.hero?.title || data.hero?.titleHighlight) && (
								<h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
									{data.hero.title}{" "}
									{data.hero.titleHighlight && (
										<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
											{data.hero.titleHighlight}
										</span>
									)}
								</h1>
							)}

							{data.hero?.subtitle && (
								<p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
									{data.hero.subtitle}
								</p>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Benefits Section */}
			{visibility.benefits && hasBenefits && (
				<section className="py-16">
					<div className="_container">
						{(data.benefitsSection?.title ||
							data.benefitsSection?.subtitle) && (
							<div className="text-center mb-12">
								{data.benefitsSection?.title && (
									<h2 className="text-3xl font-bold text-secondary mb-4">
										{data.benefitsSection.title}
									</h2>
								)}
								{data.benefitsSection?.subtitle && (
									<p className="text-muted-foreground max-w-2xl mx-auto">
										{data.benefitsSection.subtitle}
									</p>
								)}
							</div>
						)}

						{validBenefits.length > 0 && (
							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
								{validBenefits.map((benefit, index) => {
									const IconComponent = benefit.icon
										? ICON_MAP[benefit.icon] || Heart
										: Heart;
									return (
										<Card
											key={index}
											className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
										>
											<CardContent className="p-6 text-center">
												<div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
													<IconComponent className="h-6 w-6 text-primary" />
												</div>
												<h3 className="mb-2 text-lg font-bold text-secondary">
													{benefit.title}
												</h3>
												{benefit.description && (
													<p className="text-sm text-muted-foreground">
														{benefit.description}
													</p>
												)}
											</CardContent>
										</Card>
									);
								})}
							</div>
						)}
					</div>
				</section>
			)}

			{/* Open Positions Section */}
			{visibility.jobOpenings && hasJobOpenings && (
				<section className="py-16 bg-secondary/5">
					<div className="_container">
						{(data.jobOpeningsSection?.title ||
							data.jobOpeningsSection?.subtitle) && (
							<div className="text-center mb-12">
								{data.jobOpeningsSection?.title && (
									<h2 className="text-3xl font-bold text-secondary mb-4">
										{data.jobOpeningsSection.title}
									</h2>
								)}
								{data.jobOpeningsSection?.subtitle && (
									<p className="text-muted-foreground max-w-2xl mx-auto">
										{data.jobOpeningsSection.subtitle}
									</p>
								)}
							</div>
						)}

						{validJobOpenings.length > 0 ? (
							<div className="grid gap-6 max-w-4xl mx-auto">
								{validJobOpenings.map((job, index) => (
									<Card
										key={index}
										className="border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
									>
										<CardContent className="p-6">
											<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
												<div>
													<h3 className="text-xl font-bold text-secondary mb-2">
														{job.title}
													</h3>
													<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
														{job.location && (
															<span className="flex items-center gap-1">
																<MapPin className="h-4 w-4" />
																{job.location}
															</span>
														)}
														{job.type && (
															<span className="flex items-center gap-1">
																<Clock className="h-4 w-4" />
																{job.type}
															</span>
														)}
													</div>
													{job.description && (
														<p className="text-muted-foreground">
															{job.description}
														</p>
													)}
												</div>
												<Button
													asChild
													className="shrink-0 bg-primary text-white"
												>
													{job.applyLink ? (
														<Link href={job.applyLink}>
															Ansök nu
															<ArrowRight className="ml-2 h-4 w-4" />
														</Link>
													) : (
														<a href="#ansok">
															Ansök nu
															<ArrowRight className="ml-2 h-4 w-4" />
														</a>
													)}
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							data.jobOpeningsSection?.noJobsMessage && (
								<div className="text-center py-12">
									<Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
									<p className="text-lg text-muted-foreground">
										{data.jobOpeningsSection.noJobsMessage}
									</p>
								</div>
							)
						)}
					</div>
				</section>
			)}

			{/* Values Section */}
			{visibility.values && hasValues && (
				<section className="py-16">
					<div className="_container">
						<div className="max-w-3xl mx-auto">
							{(data.valuesSection?.title || data.valuesSection?.subtitle) && (
								<div className="text-center mb-12">
									{data.valuesSection?.title && (
										<h2 className="text-3xl font-bold text-secondary mb-4">
											{data.valuesSection.title}
										</h2>
									)}
									{data.valuesSection?.subtitle && (
										<p className="text-muted-foreground">
											{data.valuesSection.subtitle}
										</p>
									)}
								</div>
							)}

							{validValues.length > 0 && (
								<Card className="border-primary/20">
									<CardContent className="p-8">
										<div className="space-y-4">
											{validValues.map((value, index) => (
												<div
													key={index}
													className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
												>
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
														{index + 1}
													</div>
													<span className="text-secondary font-medium">
														{value}
													</span>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Application Form */}
			{visibility.applicationForm && (
				<div id="ansok">
					<ContactFormSection />
				</div>
			)}
		</div>
	);
}
