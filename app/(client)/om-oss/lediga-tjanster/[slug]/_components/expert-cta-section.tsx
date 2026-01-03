"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
	Send,
	Loader2,
	User,
	Mail,
	Phone,
	MessageSquare,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { ICareersExpertCta } from "@/models/careers-page.model";

interface ExpertCtaSectionProps {
	data?: ICareersExpertCta;
}

// Form schema
const expertFormSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Valid email required"),
	phone: z.string().min(6, "Phone number required"),
	subject: z.string().min(1, "Please select a subject"),
	message: z.string().optional(),
});

type ExpertFormData = z.infer<typeof expertFormSchema>;

const subjectOptions = [
	{ value: "job-inquiry", label: "Tjänsteförfrågan" },
	{ value: "general", label: "Allmän förfrågan" },
	{ value: "partnership", label: "Samarbete" },
	{ value: "other", label: "Övrigt" },
];

/**
 * ExpertCtaSection Component
 *
 * Dark background CTA section with contact form.
 * "Talk To An Expert" section at bottom of job detail pages.
 */
export function ExpertCtaSection({ data }: ExpertCtaSectionProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<ExpertFormData>({
		resolver: zodResolver(expertFormSchema),
		defaultValues: {
			subject: "",
		},
	});

	const onSubmit = async (formData: ExpertFormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "contact",
					subject: `${formData.subject} - Careers Expert Contact`,
					fullName: formData.name,
					email: formData.email,
					phone: formData.phone,
					message: formData.message,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();
			if (result.success) {
				setIsSuccess(true);
				reset();
				toast.success("Your message has been sent! We'll be in touch soon.");
				setTimeout(() => setIsSuccess(false), 8000);
			} else {
				toast.error(result.message || "Something went wrong. Please try again.");
			}
		} catch {
			toast.error("Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="bg-secondary py-16 md:py-20 lg:py-24 relative overflow-hidden">
			{/* Geometric Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<svg
					className="absolute top-0 left-0 w-full h-full"
					viewBox="0 0 1440 560"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid slice"
				>
					<path
						d="M-100 280 Q 200 80, 400 280 T 800 280 T 1200 280 T 1600 280"
						stroke="currentColor"
						strokeWidth="1"
						fill="none"
						className="text-primary"
					/>
					<path
						d="M-100 320 Q 250 120, 500 320 T 900 320 T 1300 320 T 1700 320"
						stroke="currentColor"
						strokeWidth="0.5"
						fill="none"
						className="text-white"
					/>
				</svg>
			</div>

			<div className="_container relative z-10">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
					className="max-w-4xl mx-auto"
				>
					{/* Header */}
					<motion.div variants={fadeUp} className="text-center mb-10">
						{/* Badge */}
						<span className="inline-flex items-center gap-2 text-sm font-medium text-white/60 mb-4">
							<span className="text-primary">&larr;</span>
							{data?.badge || "We Support You"}
							<span className="text-primary">&rarr;</span>
						</span>

						{/* Title */}
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
							{data?.title || "Talk To An Expert"}
						</h2>

						{/* Subtitle */}
						{data?.subtitle && (
							<p className="text-white/70 max-w-xl mx-auto">{data.subtitle}</p>
						)}
					</motion.div>

					{/* Form */}
					{isSuccess ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-10 text-center"
						>
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
								<CheckCircle2 className="w-8 h-8 text-green-400" />
							</div>
							<h3 className="text-xl font-bold text-white mb-2">
								Tack för ditt meddelande!
							</h3>
							<p className="text-white/70">
								Vi har mottagit din förfrågan och återkommer inom kort.
							</p>
						</motion.div>
					) : (
						<motion.form
							variants={fadeUp}
							onSubmit={handleSubmit(onSubmit)}
							className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 md:p-8"
						>
							<div className="grid gap-5 md:grid-cols-2">
								{/* Name */}
								<div>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
										<Input
											{...register("name")}
											placeholder="Your Name*"
											className={cn(
												"pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary",
												errors.name && "border-red-400"
											)}
											disabled={isSubmitting}
										/>
									</div>
									{errors.name && (
										<p className="text-xs text-red-400 mt-1">
											{errors.name.message}
										</p>
									)}
								</div>

								{/* Email */}
								<div>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
										<Input
											{...register("email")}
											type="email"
											placeholder="Email Address*"
											className={cn(
												"pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary",
												errors.email && "border-red-400"
											)}
											disabled={isSubmitting}
										/>
									</div>
									{errors.email && (
										<p className="text-xs text-red-400 mt-1">
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Phone */}
								<div>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
										<Input
											{...register("phone")}
											type="tel"
											placeholder="Phone Number*"
											className={cn(
												"pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary",
												errors.phone && "border-red-400"
											)}
											disabled={isSubmitting}
										/>
									</div>
									{errors.phone && (
										<p className="text-xs text-red-400 mt-1">
											{errors.phone.message}
										</p>
									)}
								</div>

								{/* Subject */}
								<div>
									<Select
										onValueChange={(value) => setValue("subject", value)}
										disabled={isSubmitting}
									>
										<SelectTrigger
											className={cn(
												"h-12 bg-white/10 border-white/20 text-white [&>span]:text-white/50 data-[state=open]:border-primary",
												errors.subject && "border-red-400"
											)}
										>
											<SelectValue placeholder="Choose Subject Type*" />
										</SelectTrigger>
										<SelectContent>
											{subjectOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.subject && (
										<p className="text-xs text-red-400 mt-1">
											{errors.subject.message}
										</p>
									)}
								</div>

								{/* Message - Full Width */}
								<div className="md:col-span-2">
									<div className="relative">
										<MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/50" />
										<Textarea
											{...register("message")}
											placeholder="Write Message (Optional)"
											rows={4}
											className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary resize-none"
											disabled={isSubmitting}
										/>
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className="mt-6">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-medium"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Sending...
										</>
									) : (
										<>
											Send Message
											<Send className="w-4 h-4 ml-2" />
										</>
									)}
								</Button>
							</div>
						</motion.form>
					)}
				</motion.div>
			</div>
		</section>
	);
}
