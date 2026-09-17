"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { MapPin, Mail, Phone, Send, Loader2, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { pushEvent } from "@/lib/analytics/gtm";
import { cn } from "@/lib/utils";
import type { ICareersContactSidebar } from "@/models/careers-page.model";

interface ContactSidebarProps {
	data?: ICareersContactSidebar;
	className?: string;
}

// Form schema
const quickContactSchema = z.object({
	name: z.string().min(2, "Namn krävs"),
	email: z.string().email("Giltig e-postadress krävs"),
	phone: z.string().min(6, "Telefonnummer krävs"),
	message: z.string().optional(),
	gdprConsent: z
		.boolean()
		.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),
});

type QuickContactData = z.infer<typeof quickContactSchema>;

/**
 * ContactSidebar Component
 *
 * "Always Nearby" contact card with address, email, phone,
 * and quick contact form (Wave Hi!).
 */
export function ContactSidebar({ data, className }: ContactSidebarProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [gdprChecked, setGdprChecked] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<QuickContactData>({
		resolver: zodResolver(quickContactSchema),
	});

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

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
					gdprConsent: formData.gdprConsent,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();
			if (result.success) {
				reset();
				setGdprChecked(false);
				pushEvent("generate_lead", {
					form_type: "careers_sidebar_contact",
					page_path: window.location.pathname,
					page_url: window.location.href,
				});
				router.push("/tack/");
			} else {
				toast.error(result.message || "Något gick fel. Försök igen.");
			}
		} catch {
			toast.error("Kunde inte skicka meddelandet. Försök igen senare.");
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
				{data?.title || "Alltid nära dig"}
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
							<p className="font-bold text-secondary text-base mb-1">Nå oss</p>
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
							<p className="font-bold text-secondary text-base mb-1">Maila oss</p>
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
							<p className="font-bold text-secondary text-base mb-1">Ring oss</p>
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
					{data?.formTitle || "Säg hej!"}
				</h4>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
						<div>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									{...register("name")}
									placeholder="Namn*"
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
									placeholder="E-postadress*"
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
									placeholder="Telefonnummer*"
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
									placeholder="Meddelande"
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

						<div>
							<label className="flex items-start gap-2 cursor-pointer">
								<Checkbox
									checked={gdprChecked}
									onCheckedChange={(checked) => handleGdprChange(checked === true)}
									disabled={isSubmitting}
									className="mt-0.5 shrink-0"
								/>
								<span className="text-xs text-muted-foreground leading-normal">
									Jag godkänner Synos Medical AB:s{" "}
									<Link
										href="/integritetspolicy"
										className="text-primary hover:underline font-medium"
										target="_blank"
										onClick={(e) => e.stopPropagation()}
									>
										integritetspolicy
									</Link>
									. *
								</span>
							</label>
							{errors.gdprConsent && (
								<p className="text-xs text-red-500 mt-1">{errors.gdprConsent.message}</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full h-11 btn-copper-gradient font-medium"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Skickar...
								</>
							) : (
								<>
									Skicka meddelande
									<Send className="w-4 h-4 ml-2" />
								</>
							)}
						</Button>
					</form>
			</div>
		</div>
	);
}
