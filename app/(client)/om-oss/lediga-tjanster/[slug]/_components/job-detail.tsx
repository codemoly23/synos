"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Upload, ChevronDown, ArrowRight } from "lucide-react";
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

			{/* Application Form Section */}
			<ApplicationFormSection jobTitle={job.title} />

			{/* Expert CTA Section */}
			<ExpertCtaSection data={expertCta} />
		</div>
	);
}

/**
 * Application Form Section Component
 */
function ApplicationFormSection({ jobTitle }: { jobTitle?: string }) {
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
							possible regarding your application for {jobTitle || "this position"}.
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
