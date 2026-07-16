"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Upload, ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
		{ label: job.title || "Tjänst" },
	];

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Hero Section */}
			<CareersHero title={job.title || "Tjänstedetaljer"} breadcrumb={breadcrumb} />

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
									alt={job.title || "Tjänstebild"}
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
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		careerType: "",
		message: "",
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const careerTypes = [
		"Account Manager",
		"Säljrepresentant",
		"Teknisk Support",
		"Marknadsspecialist",
		"Mjukvaruutvecklare",
		"Annat",
	];

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				toast.error("Filstorleken får inte överstiga 10MB");
				return;
			}
			setSelectedFile(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate required fields
		if (!formData.name || !formData.email || !formData.phone || !formData.careerType) {
			toast.error("Fyll i alla obligatoriska fält");
			return;
		}

		setIsSubmitting(true);

		try {
			// Upload file first if exists
			let fileUrl = "";
			if (selectedFile) {
				const uploadFormData = new FormData();
				uploadFormData.append("file", selectedFile);

				const uploadResponse = await fetch("/api/upload", {
					method: "POST",
					body: uploadFormData,
				});

				if (!uploadResponse.ok) {
					throw new Error("Kunde inte ladda upp filen");
				}

				const uploadResult = await uploadResponse.json();
				fileUrl = uploadResult.url;
			}

			// Submit form data
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "job_application",
					subject: `Job Application - ${jobTitle || "Position"}`,
					fullName: formData.name,
					email: formData.email,
					phone: formData.phone,
					careerType: formData.careerType,
					message: formData.message,
					resumeUrl: fileUrl,
					jobTitle: jobTitle,
					pageUrl: typeof window !== "undefined" ? window.location.href : "",
				}),
			});

			const result = await response.json();

			if (result.success) {
				setFormData({
					name: "",
					email: "",
					phone: "",
					careerType: "",
					message: "",
				});
				setSelectedFile(null);
				router.push("/tack/");
			} else {
				toast.error(result.message || "Något gick fel. Försök igen.");
			}
		} catch (error) {
			console.error("Error submitting application:", error);
			toast.error("Kunde inte skicka ansökan. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
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
								Få svar direkt
							</span>
						</motion.div>
						<motion.h2
							variants={fadeUp}
							className="text-3xl md:text-4xl font-bold text-secondary mb-4"
						>
							Berätta vad du behöver
						</motion.h2>
						<motion.p
							variants={fadeUp}
							className="text-muted-foreground max-w-2xl mx-auto"
						>
							Fyll i formuläret nedan så återkommer vi till dig så snart som möjligt
							angående din ansökan för {jobTitle || "denna tjänst"}.
						</motion.p>
					</motion.div>

					{/* Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-sm"
					>
						<form onSubmit={handleSubmit}>
						<div className="grid gap-6 md:grid-cols-2">
							{/* Your Name */}
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Namn <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Ange ditt namn"
									required
									disabled={isSubmitting}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>

							{/* Email Address */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-secondary mb-2"
								>
									E-postadress <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="Ange din e-postadress"
									required
									disabled={isSubmitting}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>

							{/* Your Number */}
							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Telefonnummer <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									id="phone"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									placeholder="Ange ditt telefonnummer"
									required
									disabled={isSubmitting}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>

							{/* Choose Careers Type */}
							<div className="relative">
								<label
									htmlFor="careerType"
									className="block text-sm font-medium text-secondary mb-2"
								>
									Välj yrkeskategori <span className="text-red-500">*</span>
								</label>
								<button
									type="button"
									onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
									disabled={isSubmitting}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-left flex items-center justify-between bg-white disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<span
										className={
											formData.careerType
												? "text-secondary"
												: "text-muted-foreground/50"
										}
									>
										{formData.careerType || "Välj yrkeskategori"}
									</span>
									<ChevronDown
										className={`w-5 h-5 text-muted-foreground transition-transform ${
											isDropdownOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
								{isDropdownOpen && !isSubmitting && (
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
								Meddelande
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleInputChange}
								placeholder="Berätta mer om dig själv och varför du är intresserad av denna tjänst..."
								rows={5}
								disabled={isSubmitting}
								className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-muted-foreground/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
										disabled={isSubmitting}
									/>
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										disabled={isSubmitting}
										className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#DCA783]/20 to-[#DCA783]/40 hover:from-[#DCA783]/30 hover:to-[#DCA783]/50 text-secondary font-medium rounded-l-xl transition-colors border border-r-0 border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Upload className="w-4 h-4" />
										Ladda upp
									</button>
									<div className="px-6 py-3 bg-white border border-slate-200 rounded-r-xl min-w-[140px]">
										<span className="text-muted-foreground text-sm truncate max-w-[200px] block">
											{selectedFile ? selectedFile.name : "Ingen fil vald"}
										</span>
									</div>
								</div>
								<p className="text-muted-foreground text-xs mt-2">
									*Ladda upp ditt CV i pdf-, jpg-, png- eller doc-format (max 10MB).
								</p>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#DCA783] to-[#C4956E] hover:from-[#C4956E] hover:to-[#B08560] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#DCA783]/25 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Skickar...
									</>
								) : (
									<>
										Skicka
										<ArrowRight className="w-5 h-5" />
									</>
								)}
							</button>
						</div>
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
