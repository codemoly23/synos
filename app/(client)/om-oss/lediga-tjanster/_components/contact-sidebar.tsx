"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Send, Loader2, User, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ICareersContactSidebar } from "@/models/careers-page.model";

interface ContactSidebarProps {
	data?: ICareersContactSidebar;
	className?: string;
}

// Form schema
const quickContactSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Valid email required"),
	phone: z.string().min(6, "Phone number required"),
	message: z.string().optional(),
});

type QuickContactData = z.infer<typeof quickContactSchema>;

/**
 * ContactSidebar Component
 *
 * "Always Nearby" contact card with address, email, phone,
 * and quick contact form (Wave Hi!).
 */
export function ContactSidebar({ data, className }: ContactSidebarProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<QuickContactData>({
		resolver: zodResolver(quickContactSchema),
	});

	const onSubmit = async (formData: QuickContactData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "contact",
					subject: "Quick Contact - Careers Page",
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
				toast.success("Message sent! We'll get back to you soon.");
				setTimeout(() => setIsSuccess(false), 5000);
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
		<div
			className={cn(
				"bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:sticky lg:top-32",
				className
			)}
		>
			{/* Title */}
			<h3 className="text-xl font-bold text-secondary mb-6">
				{data?.title || "Always Nearby"}
			</h3>

			{/* Contact Info */}
			<div className="space-y-4 mb-8">
				{/* Address */}
				{data?.address && (
					<div className="flex items-start gap-3">
						<div className="w-12 h-12 rounded-xl bg-[#DFB294] flex items-center justify-center shrink-0">
							<MapPin className="w-6 h-6 text-white" />
						</div>
						<div>
							<p className="font-bold text-secondary text-base mb-1">Reach Us</p>
							<p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
								{data.address}
							</p>
						</div>
					</div>
				)}

				{/* Email */}
				{data?.email && (
					<div className="flex items-start gap-3">
						<div className="w-12 h-12 rounded-xl bg-[#DFB294] flex items-center justify-center shrink-0">
							<Mail className="w-6 h-6 text-white" />
						</div>
						<div>
							<p className="font-bold text-secondary text-base mb-1">Drop Us Mail</p>
							<a
								href={`mailto:${data.email}`}
								className="text-muted-foreground text-sm hover:text-primary transition-colors"
							>
								{data.email}
							</a>
						</div>
					</div>
				)}

				{/* Phone */}
				{(data?.phone || data?.secondaryPhone) && (
					<div className="flex items-start gap-3">
						<div className="w-12 h-12 rounded-xl bg-[#DFB294] flex items-center justify-center shrink-0">
							<Phone className="w-6 h-6 text-white" />
						</div>
						<div>
							<p className="font-bold text-secondary text-base mb-1">Connect Now</p>
							{data?.phone && (
								<a
									href={`tel:${data.phone.replace(/\s/g, "")}`}
									className="block text-muted-foreground text-sm hover:text-primary transition-colors"
								>
									{data.phone}
								</a>
							)}
							{data?.secondaryPhone && (
								<a
									href={`tel:${data.secondaryPhone.replace(/\s/g, "")}`}
									className="block text-muted-foreground text-sm hover:text-primary transition-colors"
								>
									{data.secondaryPhone}
								</a>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Divider */}
			<div className="border-t border-slate-200 my-6" />

			{/* Quick Contact Form */}
			<div>
				<h4 className="text-xl font-bold text-secondary mb-4">
					{data?.formTitle || "Say, Hello !"}
				</h4>

				{isSuccess ? (
					<div className="text-center py-6">
						<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
							<CheckCircle2 className="w-6 h-6 text-green-600" />
						</div>
						<p className="text-sm text-muted-foreground">
							Thanks! We&apos;ll be in touch soon.
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
						<div>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									{...register("name")}
									placeholder="Your Name*"
									className={cn(
										"pl-10 h-11 bg-slate-50 border-slate-200",
										errors.name && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
							{errors.name && (
								<p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
							)}
						</div>

						<div>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									{...register("email")}
									type="email"
									placeholder="Email Address*"
									className={cn(
										"pl-10 h-11 bg-slate-50 border-slate-200",
										errors.email && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
							{errors.email && (
								<p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
							)}
						</div>

						<div>
							<div className="relative">
								<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									{...register("phone")}
									type="tel"
									placeholder="Your Number*"
									className={cn(
										"pl-10 h-11 bg-slate-50 border-slate-200",
										errors.phone && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
							{errors.phone && (
								<p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
							)}
						</div>

						<div>
							<div className="relative">
								<MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
								<textarea
									{...register("message")}
									placeholder="Additional Message"
									rows={4}
									className={cn(
										"w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-slate-400",
										errors.message && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
							{errors.message && (
								<p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
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
					</form>
				)}
			</div>
		</div>
	);
}
