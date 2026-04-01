"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Send,
	Mail,
	Phone,
	User,
	Loader2,
	CheckCircle2,
	Package,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";
import { z } from "zod";

interface ProductInquiryFormProps {
	productName: string;
	productId: string;
	productSlug: string;
	categoryName?: string;
}

// Form schema with phone validation
const clientFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional(),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
	productId: z.string(),
	productName: z.string(),
	productSlug: z.string(),
});

type FormData = z.infer<typeof clientFormSchema>;

export function ProductInquiryForm({
	productName,
	productId,
	productSlug,
	categoryName,
}: ProductInquiryFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	// Local state for UI elements that need to update visually
	const [gdprChecked, setGdprChecked] = useState(false);
const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(clientFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			message: "",
			gdprConsent: undefined as unknown as true,
			productId,
			productName,
			productSlug,
		},
	});

const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "product_inquiry",
					...data,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				toast.success(
					"Tack för din förfrågan! Vi återkommer inom 24 timmar."
				);
				setTimeout(() => setIsSuccess(false), 10000);
			} else {
				if (result.errors && Array.isArray(result.errors)) {
					const fieldErrors = result.errors
						.filter(
							(err: { path?: string[]; message?: string }) =>
								err.path && err.message
						)
						.map(
							(err: { path?: string[]; message?: string }) => err.message
						)
						.join(", ");
					toast.error(
						fieldErrors ||
							result.message ||
							"Något gick fel. Försök igen."
					);
				} else {
					toast.error(result.message || "Något gick fel. Försök igen.");
				}
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("Något gick fel. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<section className="py-16 md:py-24">
				<div className="_container">
					<div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-lg">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
							<CheckCircle2 className="h-10 w-10 text-green-600" />
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
							Tack för din förfrågan!
						</h2>
						<p className="text-lg text-muted-foreground mb-6">
							Vi har mottagit din förfrågan gällande {productName} och
							återkommer till dig inom 24 timmar.
						</p>
						<Button
							variant="outline"
							onClick={() => setIsSuccess(false)}
							className="mt-4"
						>
							Skicka ny förfrågan
						</Button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 md:py-24 bg-slate-400/80 relative overflow-hidden">
			<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
			<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
			<div className="_container relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

					{/* Left - Info */}
					<div className="space-y-8">
						<div className="space-y-4">
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-secondary">
								Intresserad av {productName}?
							</h2>
							<p className="text-slate-600 text-xl leading-relaxed">
								Kontakta oss idag för en kostnadsfri konsultation och upptäck hur vi kan hjälpa dig att nå dina mål.
							</p>
						</div>

						<div className="space-y-6">
							<a href="tel:010-20515 01" className="flex items-start gap-4 text-secondary">
								<div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
									<Phone className="h-6 w-6" />
								</div>
								<div>
									<h4 className="text-lg font-bold">Ring oss</h4>
									<p className="text-slate-600">Vi finns tillgängliga för att hjälpa dig</p>
									<span className="text-primary font-semibold hover:underline mt-1 block">010-205 15 01</span>
								</div>
							</a>

							<a href="mailto:info@synos.se" className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-full bg-white text-slate-600 shadow-sm flex items-center justify-center shrink-0">
									<Mail className="h-6 w-6" />
								</div>
								<div>
									<h4 className="text-lg font-bold text-secondary">Maila oss</h4>
									<p className="text-slate-600">Skicka oss ett meddelande</p>
									<span className="text-primary font-medium mt-1 block hover:underline">info@synos.se</span>
								</div>
							</a>
						</div>
					</div>

					{/* Right - Form Card */}
					<div>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="rounded-2xl bg-white shadow-2xl overflow-hidden"
						>
							{/* Card Header */}
							<div className="px-6 py-5 border-b border-slate-100">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 shrink-0">
										<Package className="h-4 w-4 text-primary" />
									</div>
									<div>
										{categoryName && (
											<p className="text-xs text-primary font-medium leading-none mb-0.5">{categoryName}</p>
										)}
										<p className="font-semibold text-secondary text-sm">{productName}</p>
									</div>
								</div>
							</div>

							<div className="p-6 space-y-4">
								{/* Name + Email */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label htmlFor="fullName" className="text-sm font-semibold text-secondary">
											Namn <span className="text-red-500">*</span>
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
											<Input
												id="fullName"
												{...register("fullName")}
												placeholder="Ditt fullständiga namn"
												className={cn("pl-10 h-11", errors.fullName && "border-red-500")}
												disabled={isSubmitting}
											/>
										</div>
										{errors.fullName && (
											<p className="text-xs text-red-500">{errors.fullName.message}</p>
										)}
									</div>

									<div className="space-y-1.5">
										<Label htmlFor="email" className="text-sm font-semibold text-secondary">
											E-postadress <span className="text-red-500">*</span>
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
											<Input
												id="email"
												type="email"
												{...register("email")}
												placeholder="din@email.se"
												className={cn("pl-10 h-11", errors.email && "border-red-500")}
												disabled={isSubmitting}
											/>
										</div>
										{errors.email && (
											<p className="text-xs text-red-500">{errors.email.message}</p>
										)}
									</div>
								</div>

								{/* Phone */}
								<div className="space-y-1.5">
									<Label htmlFor="phone" className="text-sm font-semibold text-secondary">
										Telefonnummer <span className="text-red-500">*</span>
									</Label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
										<Input
											id="phone"
											type="tel"
											{...register("phone")}
											placeholder="701234567"
											className={cn("pl-10 h-11", errors.phone && "border-red-500")}
											disabled={isSubmitting}
										/>
									</div>
									{errors.phone && (
										<p className="text-xs text-red-500">{errors.phone.message}</p>
									)}
								</div>

								{/* Message */}
								<div className="space-y-1.5">
									<Label htmlFor="message" className="text-sm font-semibold text-secondary">
										Meddelande{" "}
										<span className="text-muted-foreground font-normal">(valfritt)</span>
									</Label>
									<Textarea
										id="message"
										{...register("message")}
										placeholder="Berätta mer om dina behov, frågor eller önskemål..."
										className={cn("min-h-[90px] resize-none", errors.message && "border-red-500")}
										disabled={isSubmitting}
									/>
									{errors.message && (
										<p className="text-xs text-red-500">{errors.message.message}</p>
									)}
								</div>

								{/* GDPR */}
								<label
									htmlFor="gdprConsent"
									className={cn(
										"flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
										errors.gdprConsent
											? "border-red-400 bg-red-50"
											: gdprChecked
											? "border-primary bg-primary/5"
											: "border-slate-200 hover:border-primary/40"
									)}
								>
									<Checkbox
										id="gdprConsent"
										checked={gdprChecked}
										onCheckedChange={(checked) => handleGdprChange(checked === true)}
										disabled={isSubmitting}
										className="mt-0.5 shrink-0"
									/>
									<span className="text-xs leading-relaxed text-muted-foreground">
										Jag godkänner Synos Medical AB:s{" "}
										<Link
											href="/integritetspolicy"
											className="text-primary hover:underline font-medium"
											target="_blank"
											onClick={(e) => e.stopPropagation()}
										>
											integritetspolicy
										</Link>{" "}
										och samtycker till att mina uppgifter behandlas enligt GDPR.{" "}
										<span className="text-red-500">*</span>
									</span>
								</label>
								{errors.gdprConsent && (
									<p className="text-xs text-red-500">{errors.gdprConsent.message}</p>
								)}

								{/* Submit */}
								<Button
									type="submit"
									disabled={isSubmitting}
									size="lg"
									className="w-full h-12 text-sm font-semibold"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Skickar...
										</>
									) : (
										<>
											<Send className="mr-2 h-4 w-4" />
											Skicka förfrågan
										</>
									)}
								</Button>

								<p className="text-center text-xs text-muted-foreground">
									<span className="text-red-500">*</span> Obligatoriska fält
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
