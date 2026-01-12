"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { CareersHero } from "../../_components/careers-hero";
import { ContactSidebar } from "../../_components/contact-sidebar";
import { ExpertCtaSection } from "./expert-cta-section";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { JobOpeningData } from "@/lib/repositories/careers-page.repository";
import type {
	ICareersContactSidebar,
	ICareersExpertCta,
} from "@/models/careers-page.model";

interface JobDetailProps {
	job: JobOpeningData;
	contactSidebar?: ICareersContactSidebar;
	expertCta?: ICareersExpertCta;
}

/**
 * JobDetail Component
 *
 * Job detail page with:
 * - Dark hero with job title and breadcrumb
 * - Featured image section
 * - Job description with requirements/responsibilities (checkmarks)
 * - Contact sidebar
 * - Expert CTA section at bottom
 */
export function JobDetail({ job, contactSidebar, expertCta }: JobDetailProps) {
	const breadcrumb = [
		{ label: "Om Oss", href: "/om-oss" },
		{ label: "Lediga Tjänster", href: "/om-oss/lediga-tjanster" },
		{ label: job.title || "Job" },
	];

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Hero Section */}
			<CareersHero title={job.title || "Job Details"} breadcrumb={breadcrumb} />

			{/* Main Content */}
			<section className="py-12 md:py-16 lg:py-20">
				<div className="_container">
					<div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
						{/* Left Column - Job Details */}
						<motion.div
							initial="initial"
							animate="animate"
							variants={staggerContainer}
						>
							{/* Featured Image */}
							{job.featuredImage && (
								<motion.div
									initial={{ opacity: 0, y: 60 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, ease: "easeOut" }}
									className="mb-8 rounded-2xl overflow-hidden shadow-lg"
								>
									<Image
										src={job.featuredImage}
										alt={job.title || "Job image"}
										width={800}
										height={450}
										className="w-full h-auto object-cover aspect-video"
									/>
								</motion.div>
							)}

							{/* Job Description */}
							{job.description && (
								<motion.div variants={fadeUp} className="mb-10">
									<h2 className="text-2xl font-bold text-secondary mb-4">
										Om tjänsten
									</h2>
									<div
										className="prose prose-slate max-w-none prose-headings:text-secondary prose-p:text-muted-foreground prose-li:text-muted-foreground"
										dangerouslySetInnerHTML={{ __html: job.description }}
									/>
								</motion.div>
							)}

							{/* Requirements */}
							{job.requirements && job.requirements.length > 0 && (
								<motion.div variants={fadeUp} className="mb-10">
									<h2 className="text-2xl font-bold text-secondary mb-4">
										Krav
									</h2>
									<ul className="space-y-3">
										{job.requirements.map((req, index) => (
											<li key={index} className="flex items-start gap-3">
												<div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
													<Check className="w-4 h-4 text-primary" />
												</div>
												<span className="text-muted-foreground">{req}</span>
											</li>
										))}
									</ul>
								</motion.div>
							)}

							{/* Responsibilities */}
							{job.responsibilities && job.responsibilities.length > 0 && (
								<motion.div variants={fadeUp} className="mb-10">
									<h2 className="text-2xl font-bold text-secondary mb-4">
										Ansvarsområden
									</h2>
									<ul className="space-y-3">
										{job.responsibilities.map((resp, index) => (
											<li key={index} className="flex items-start gap-3">
												<div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
													<Check className="w-4 h-4 text-primary" />
												</div>
												<span className="text-muted-foreground">{resp}</span>
											</li>
										))}
									</ul>
								</motion.div>
							)}

							{/* Job Meta */}
							<motion.div
								variants={fadeUp}
								className="bg-white rounded-xl border border-slate-200/80 p-6"
							>
								<h3 className="text-lg font-semibold text-secondary mb-4">
									Tjänstinformation
								</h3>
								<div className="grid gap-4 sm:grid-cols-2">
									{job.location && (
										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Plats
											</p>
											<p className="font-medium text-secondary">
												{job.location}
											</p>
										</div>
									)}
									{job.workType && (
										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Arbetstyp
											</p>
											<p className="font-medium text-secondary">
												{job.workType}
											</p>
										</div>
									)}
									{job.employmentType && (
										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Anställningsform
											</p>
											<p className="font-medium text-secondary">
												{job.employmentType}
											</p>
										</div>
									)}
								</div>
							</motion.div>
						</motion.div>

						{/* Right Column - Contact Sidebar */}
						<div className="hidden lg:block">
							<ContactSidebar data={contactSidebar} />
						</div>
					</div>

					{/* Mobile Contact Sidebar */}
					<div className="lg:hidden mt-12">
						<ContactSidebar data={contactSidebar} />
					</div>
				</div>
			</section>

			{/* Expert CTA Section */}
			<ExpertCtaSection data={expertCta} />
		</div>
	);
}
