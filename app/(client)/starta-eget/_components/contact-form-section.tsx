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
	MessageSquare,
	Rocket,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";
import { cn } from "@/lib/utils/cn";
import { z } from "zod";

// Form schema
const clientFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	countryCode: z.string().min(2, "Landskod krävs"),
	countryName: z.string().min(2, "Land krävs"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional()
		.or(z.literal("")),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
});

type FormData = z.infer<typeof clientFormSchema>;

export function ContactFormSection() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);
	const [gdprChecked, setGdprChecked] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(clientFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			countryCode: defaultCountry.dialCode,
			countryName: defaultCountry.name,
			phone: "",
			message: "",
			gdprConsent: undefined as unknown as true,
		},
	});

	const handleCountryChange = (country: Country) => {
		setSelectedCountry(country);
		setValue("countryCode", country.dialCode);
		setValue("countryName", country.name);
	};

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

	const onSubmit = async (data: FormData) => {
		// Frontend phone validation
		const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
		if (!isValidPhoneNumber(fullPhone)) {
			setError("phone", {
				type: "manual",
				message: "Ogiltigt telefonnummer för valt land",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "contact",
					subject: "Förfrågan om att starta eget",
					...data,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				setSelectedCountry(defaultCountry);
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
			<section className="py-16 bg-gradient-to-b from-primary/5 to-white">
				<div className="_container">
					<div className="mx-auto max-w-2xl text-center p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-lg">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
							<CheckCircle2 className="h-10 w-10 text-green-600" />
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
							Tack för din förfrågan!
						</h2>
						<p className="text-lg text-muted-foreground mb-6">
							Vi har mottagit din förfrågan om att starta eget och
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
		<section className="py-16 bg-gradient-to-b from-primary/5 to-white">
			<div className="_container">
				<div className="mx-auto max-w-3xl">
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
							<Rocket className="h-4 w-4 text-secondary" />
							<span className="text-sm font-semibold text-secondary">
								Kontakta oss
							</span>
						</div>
						<h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
							Kontakta oss
						</h2>
						<p className="text-lg text-slate-600">
							Fält markerade med en{" "}
							<span className="text-red-500">*</span> är obligatoriskt
						</p>
					</div>

					{/* Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border shadow-xl space-y-6"
					>
						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="fullName" className="text-sm font-semibold">
								Namn <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
								<Input
									id="fullName"
									{...register("fullName")}
									placeholder="Namn"
									className={cn(
										"pl-11 h-12 bg-slate-50",
										errors.fullName && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
							{errors.fullName && (
								<p className="text-sm text-red-500">
									{errors.fullName.message}
								</p>
							)}
						</div>

						{/* Email */}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-semibold">
								E-postadress <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
								<Input
									id="email"
									type="email"
									{...register("email")}
									placeholder="E-postadress"
									className={cn(
										"pl-11 h-12 bg-slate-50",
										errors.email && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
							{errors.email && (
								<p className="text-sm text-red-500">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Phone */}
						<div className="space-y-2">
							<Label className="text-sm font-semibold">
								Telefon <span className="text-red-500">*</span>
							</Label>
							<div className="flex gap-2">
								<div className="w-[110px] shrink-0">
									<CountryCodeSelect
										value={selectedCountry}
										onChange={handleCountryChange}
										disabled={isSubmitting}
									/>
								</div>
								<div className="relative flex-1 min-w-0">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
									<Input
										id="phone"
										type="tel"
										{...register("phone")}
										placeholder="Telefon"
										className={cn(
											"pl-11 h-12 bg-slate-50",
											errors.phone && "border-red-500"
										)}
										disabled={isSubmitting}
									/>
								</div>
							</div>
							{errors.phone && (
								<p className="text-sm text-red-500">
									{errors.phone.message}
								</p>
							)}
						</div>

						{/* Message */}
						<div className="space-y-2">
							<Label htmlFor="message" className="text-sm font-semibold">
								Meddelande{" "}
								<span className="text-muted-foreground font-normal">
									(valfritt)
								</span>
							</Label>
							<Textarea
								id="message"
								{...register("message")}
								placeholder="Skriv ditt meddelande här..."
								className={cn(
									"min-h-[150px] resize-none bg-slate-50",
									errors.message && "border-red-500"
								)}
								disabled={isSubmitting}
							/>
							{errors.message && (
								<p className="text-sm text-red-500">
									{errors.message.message}
								</p>
							)}
						</div>

						{/* GDPR Consent */}
						<div className="space-y-2">
							<label
								htmlFor="gdprConsent"
								className={cn(
									"flex items-start gap-3 p-4 rounded-lg border cursor-pointer",
									errors.gdprConsent
										? "border-red-500 bg-red-50"
										: gdprChecked
											? "border-primary bg-primary/5"
											: "border-border"
								)}
							>
								<Checkbox
									id="gdprConsent"
									checked={gdprChecked}
									onCheckedChange={(checked) =>
										handleGdprChange(checked === true)
									}
									disabled={isSubmitting}
									className="mt-0.5 shrink-0"
								/>
								<span className="text-sm leading-normal">
									Genom att kryssa i godkänner du våran integritetspolicy{" "}
									<span className="text-red-500">*</span>{" "}
									<Link
										href="/integritetspolicy"
										className="text-primary hover:underline font-medium"
										target="_blank"
										onClick={(e) => e.stopPropagation()}
									>
										*Synos integritetspolicy
									</Link>
								</span>
							</label>
							{errors.gdprConsent && (
								<p className="text-sm text-red-500">
									{errors.gdprConsent.message}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isSubmitting}
							size="lg"
							className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Skickar...
								</>
							) : (
								<>
									<Send className="mr-2 h-5 w-5" />
									SKICKA
								</>
							)}
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
}
