"use client";

import { motion } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import { CareersHero } from "./careers-hero";
import { JobCard } from "./job-card";
import { ContactSidebar } from "./contact-sidebar";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { CareersPageData } from "@/lib/repositories/careers-page.repository";

interface CareersListingProps {
	data: CareersPageData;
}

/**
 * CareersListing Component
 *
 * Main careers/jobs listing page with:
 * - Dark hero section (like Nyheter page)
 * - Two-column layout (jobs left, contact sidebar right)
 * - Modern job cards with hover effects
 */
export function CareersListing({ data }: CareersListingProps) {
	const visibility = data.sectionVisibility || {
		hero: true,
		benefits: true,
		jobOpenings: true,
		values: true,
		applicationForm: true,
	};

	const validJobOpenings = (data.jobOpeningsSection?.jobOpenings || []).filter(
		(j) => j.title && j.isActive === true
	);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Hero Section */}
			{visibility.hero && <CareersHero title="Lediga Tjänster" />}

			{/* Main Content */}
			<section className="py-12 md:py-16 lg:py-20">
				<div className="_container">
					<div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
						{/* Left Column - Jobs */}
						<div>
							{/* Section Header */}
							{visibility.jobOpenings && (
								<motion.div
									initial="initial"
									animate="animate"
									variants={staggerContainer}
									className="mb-8"
								>
									{/* Badge */}
									<motion.div variants={fadeUp} className="mb-4">
										<span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
											<span className="text-primary">&larr;</span>
											{data.jobOpeningsSection?.title || "Success Journey"}
											<span className="text-primary">&rarr;</span>
										</span>
									</motion.div>

									{/* Title */}
									<motion.h2
										variants={fadeUp}
										className="text-3xl md:text-4xl font-bold text-secondary mb-3"
									>
										{data.hero?.title || "Driving Traders Toward"}{" "}
										<br className="hidden sm:block" />
										<span className="text-primary">
											{data.hero?.titleHighlight || "Daily Wins"}
										</span>
									</motion.h2>

									{/* Subtitle */}
									{(data.hero?.subtitle || data.jobOpeningsSection?.subtitle) && (
										<motion.p
											variants={fadeUp}
											className="text-muted-foreground max-w-xl"
										>
											{data.hero?.subtitle || data.jobOpeningsSection?.subtitle}
										</motion.p>
									)}
								</motion.div>
							)}

							{/* Job Listings */}
							{visibility.jobOpenings && (
								<div className="space-y-4">
									{validJobOpenings.length > 0 ? (
										validJobOpenings.map((job, index) => (
											<JobCard
												key={job._id?.toString() || index}
												job={job}
												index={index}
											/>
										))
									) : (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											className="bg-white rounded-xl border border-slate-200/80 p-12 text-center"
										>
											<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
												<Sparkles className="w-8 h-8 text-muted-foreground/50" />
											</div>
											<p className="text-lg font-medium text-secondary mb-2">
												Inga lediga tjänster just nu
											</p>
											<p className="text-muted-foreground">
												{data.jobOpeningsSection?.noJobsMessage ||
													"Vi har för närvarande inga öppna positioner, men kolla tillbaka snart!"}
											</p>
										</motion.div>
									)}
								</div>
							)}

							{/* Benefits Section (Optional) */}
							{visibility.benefits &&
								data.benefitsSection?.benefits &&
								data.benefitsSection.benefits.length > 0 && (
									<motion.div
										initial="initial"
										whileInView="animate"
										viewport={{ once: true }}
										variants={staggerContainer}
										className="mt-16"
									>
										{data.benefitsSection.title && (
											<motion.h3
												variants={fadeUp}
												className="text-2xl font-bold text-secondary mb-6"
											>
												{data.benefitsSection.title}
											</motion.h3>
										)}
										<div className="grid gap-4 sm:grid-cols-2">
											{data.benefitsSection.benefits
												.filter((b) => b.title)
												.map((benefit, index) => (
													<motion.div
														key={index}
														variants={fadeUp}
														className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow"
													>
														<div className="flex items-start gap-4">
															<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
																<Briefcase className="w-5 h-5 text-primary" />
															</div>
															<div>
																<h4 className="font-semibold text-secondary mb-1">
																	{benefit.title}
																</h4>
																{benefit.description && (
																	<p className="text-sm text-muted-foreground">
																		{benefit.description}
																	</p>
																)}
															</div>
														</div>
													</motion.div>
												))}
										</div>
									</motion.div>
								)}
						</div>

						{/* Right Column - Contact Sidebar */}
						<div className="hidden lg:block">
							<ContactSidebar data={data.contactSidebar} />
						</div>
					</div>

					{/* Mobile Contact Sidebar */}
					<div className="lg:hidden mt-12">
						<ContactSidebar data={data.contactSidebar} />
					</div>
				</div>
			</section>

			{/* Footer Dark Section (matches reference) */}
			<section className="bg-secondary py-8">
				<div className="_container">
					<div className="flex items-center justify-center opacity-20">
						{/* Decorative geometric pattern */}
						<svg
							className="w-full max-w-4xl h-16"
							viewBox="0 0 800 60"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0 30 Q 100 0, 200 30 T 400 30 T 600 30 T 800 30"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
							/>
							<path
								d="M0 35 Q 100 5, 200 35 T 400 35 T 600 35 T 800 35"
								stroke="currentColor"
								strokeWidth="0.3"
								fill="none"
								className="text-white"
							/>
						</svg>
					</div>
				</div>
			</section>
		</div>
	);
}
