"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	contactFormSchema,
	type ContactFormData,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

export function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			gdprConsent: false,
			marketingConsent: false,
		},
	});

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true);
		setSubmitStatus({ type: null, message: "" });

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Något gick fel");
			}

			setSubmitStatus({
				type: "success",
				message:
					"Tack för ditt meddelande! Vi återkommer till dig så snart som möjligt.",
			});
			reset();
		} catch (error) {
			setSubmitStatus({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Ett fel uppstod vid skickandet. Vänligen försök igen.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6 text-secondary"
		>
			{/* Name */}
			<div>
				<label htmlFor="name" className="mb-2 block text-sm font-medium">
					Namn <span className="text-red-500">*</span>
				</label>
				<Input
					id="name"
					type="text"
					placeholder="Ditt namn"
					{...register("name")}
					className={cn(errors.name && "border-red-500")}
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-500">
						{errors.name.message}
					</p>
				)}
			</div>

			{/* Email */}
			<div>
				<label htmlFor="email" className="mb-2 block text-sm font-medium">
					E-post <span className="text-red-500">*</span>
				</label>
				<Input
					id="email"
					type="email"
					placeholder="din@email.se"
					{...register("email")}
					className={cn(errors.email && "border-red-500")}
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-500">
						{errors.email.message}
					</p>
				)}
			</div>

			{/* Phone */}
			<div>
				<label htmlFor="phone" className="mb-2 block text-sm font-medium">
					Telefon <span className="text-red-500">*</span>
				</label>
				<Input
					id="phone"
					type="tel"
					placeholder="070-123 45 67"
					{...register("phone")}
					className={cn(errors.phone && "border-red-500")}
				/>
				{errors.phone && (
					<p className="mt-1 text-sm text-red-500">
						{errors.phone.message}
					</p>
				)}
			</div>

			{/* Company (Optional) */}
			<div>
				<label htmlFor="company" className="mb-2 block text-sm font-medium">
					Företag{" "}
					<span className="text-sm text-muted-foreground">(valfritt)</span>
				</label>
				<Input
					id="company"
					type="text"
					placeholder="Ditt företag"
					{...register("company")}
					className={cn(errors.company && "border-red-500")}
				/>
				{errors.company && (
					<p className="mt-1 text-sm text-red-500">
						{errors.company.message}
					</p>
				)}
			</div>

			{/* Subject */}
			<div>
				<label htmlFor="subject" className="mb-2 block text-sm font-medium">
					Ämne <span className="text-red-500">*</span>
				</label>
				<Input
					id="subject"
					type="text"
					placeholder="Vad gäller din förfrågan?"
					{...register("subject")}
					className={cn(errors.subject && "border-red-500")}
				/>
				{errors.subject && (
					<p className="mt-1 text-sm text-red-500">
						{errors.subject.message}
					</p>
				)}
			</div>

			{/* Message */}
			<div>
				<label htmlFor="message" className="mb-2 block text-sm font-medium">
					Meddelande <span className="text-red-500">*</span>
				</label>
				<Textarea
					id="message"
					placeholder="Berätta mer om din förfrågan..."
					rows={6}
					{...register("message")}
					className={cn(errors.message && "border-red-500")}
				/>
				{errors.message && (
					<p className="mt-1 text-sm text-red-500">
						{errors.message.message}
					</p>
				)}
			</div>

			{/* GDPR Consent */}
			<div className="space-y-4 rounded-lg border border-border/15 bg-muted/10 p-4">
				<div className="flex items-start gap-3">
					<input
						id="gdprConsent"
						type="checkbox"
						{...register("gdprConsent")}
						className={cn(
							"mt-1 h-4 w-4 rounded border-gray-300 text-secondary",
							errors.gdprConsent && "border-red-500"
						)}
					/>
					<label htmlFor="gdprConsent" className="text-sm">
						<span className="font-medium">
							Jag godkänner behandling av mina personuppgifter{" "}
							<span className="text-red-500">*</span>
						</span>
						<p className="mt-1 text-muted-foreground">
							Synos Medical AB behandlar dina personuppgifter för att
							kunna hantera din förfrågan. Läs mer i vår{" "}
							<a
								href="/om-oss/juridisk-information"
								className="text-secondary hover:underline"
								target="_blank"
							>
								integritetspolicy
							</a>
							.
						</p>
					</label>
				</div>
				{errors.gdprConsent && (
					<p className="text-sm text-red-500">
						{errors.gdprConsent.message}
					</p>
				)}

				{/* Marketing Consent */}
				<div className="flex items-start gap-3">
					<input
						id="marketingConsent"
						type="checkbox"
						{...register("marketingConsent")}
						className="mt-1 h-4 w-4 rounded border-gray-300 text-secondary"
					/>
					<label htmlFor="marketingConsent" className="text-sm">
						<span className="font-medium">
							Jag vill ta emot nyhetsbrev och erbjudanden
						</span>
						<p className="mt-1 text-muted-foreground">
							Du kan när som helst avregistrera dig från vårt nyhetsbrev.
						</p>
					</label>
				</div>
			</div>

			{/* Submit Status */}
			{submitStatus.type && (
				<div
					className={cn(
						"rounded-lg p-4",
						submitStatus.type === "success" &&
							"bg-green-50 text-green-800",
						submitStatus.type === "error" && "bg-red-50 text-red-800"
					)}
				>
					<p className="text-sm">{submitStatus.message}</p>
				</div>
			)}

			{/* Submit Button */}
			<Button
				type="submit"
				size="lg"
				disabled={isSubmitting}
				className="w-full sm:w-auto"
			>
				{isSubmitting ? "Skickar..." : "Skicka meddelande"}
			</Button>

			<p className="text-sm text-muted-foreground">
				<span className="text-red-500">*</span> Obligatoriska fält
			</p>
		</form>
	);
}
