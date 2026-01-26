"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { CareersHero } from "../../_components/careers-hero";
import { ContactSidebar } from "../../_components/contact-sidebar";
import { ExpertCtaSection } from "./expert-cta-section";
import { staggerContainer, fadeUp } from "@/lib/animations";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
							<motion.div
								initial={{ opacity: 0, y: 60 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: "easeOut" }}
								className="mb-8 rounded-2xl overflow-hidden shadow-lg"
							>
								<Image
									src={job.featuredImage || "/images/career-details-img-04.jpg"}
									alt={job.title || "Job image"}
									width={800}
									height={450}
									className="w-full h-auto object-cover aspect-video"
								/>
							</motion.div>

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

			{/* FAQ Section */}
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
								Vanliga frågor om tjänsten
							</motion.h2>
							<motion.p variants={fadeUp} className="text-muted-foreground">
								Här hittar du svar på de vanligaste frågorna om denna tjänst.
							</motion.p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<Accordion type="single" collapsible className="space-y-4">
								<AccordionItem
									value="faq-1"
									className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
								>
									<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
										Vad innebär rollen som Teknisk Supportspecialist?
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
										Som Teknisk Supportspecialist hos Synos Medical hjälper du våra kunder med teknisk assistans.
										Du arbetar med både support på distans och servicebesök hos kunder, och blir en viktig del av vårt serviceteam.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="faq-2"
									className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
								>
									<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
										Vilka kvalifikationer krävs för tjänsten?
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
										Vi söker dig med teknisk utbildning eller motsvarande erfarenhet, erfarenhet av kundservice/support,
										god problemlösningsförmåga, B-körkort för servicebesök, samt flytande svenska och god engelska.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="faq-3"
									className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
								>
									<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
										Vad ingår i arbetsuppgifterna?
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
										Du kommer att ge teknisk support via telefon och e-post, genomföra servicebesök och installationer hos kunder,
										dokumentera supportärenden och lösningar, utbilda kunder i användning av utrustning, samt bidra till förbättring av supportprocesser.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="faq-4"
									className="faq-accordion-item rounded-xl border border-slate-200/80 px-6 transition-all duration-300 hover:border-[#DCA783] data-[state=open]:border-[#DCA783] group/faq"
								>
									<AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline py-5 group-hover/faq:text-white data-[state=open]:text-white [&>svg]:group-hover/faq:text-white [&>svg]:data-[state=open]:text-white">
										Hur ansöker jag till tjänsten?
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pb-5 group-hover/faq:text-white/90 data-[state=open]:text-white/90">
										Du kan ansöka genom att fylla i kontaktformuläret på denna sida eller skicka din ansökan direkt till oss.
										Bifoga ditt CV och ett personligt brev där du beskriver varför du passar för rollen.
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Expert CTA Section */}
			<ExpertCtaSection data={expertCta} />
		</div>
	);
}
