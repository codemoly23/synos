"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	contactFormSchema,
	type ContactFormData,
} from "@/lib/validations/contact";
import { fadeUp } from "@/lib/animations";

export function Contact() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
	});

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			const response = await fetch("/api/contact/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				setSubmitStatus("success");
				reset();
			} else {
				setSubmitStatus("error");
			}
		} catch (error) {
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="py-20 lg:py-28 bg-white">
			<div className="section-container">
				<div className="mx-auto max-w-4xl">
					{/* Section header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
							Redo att komma igång?
						</h2>
						<p className="text-lg text-muted-foreground">
							Kontakta oss idag för en kostnadsfri konsultation
						</p>
					</motion.div>

					{/* Contact form */}
					<motion.div
						variants={fadeUp}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="rounded-xl bg-white p-8 lg:p-12 card-shadow"
					>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Name and Email row */}
							<div className="grid gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-foreground mb-2"
									>
										Namn <span className="text-red-500">*</span>
									</label>
									<input
										{...register("name")}
										type="text"
										id="name"
										className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										placeholder="Ditt namn"
									/>
									{errors.name && (
										<p className="mt-1 text-sm text-red-500">
											{errors.name.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-foreground mb-2"
									>
										E-post <span className="text-red-500">*</span>
									</label>
									<input
										{...register("email")}
										type="email"
										id="email"
										className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										placeholder="din@email.se"
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>
							</div>

							{/* Phone and Company row */}
							<div className="grid gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-medium text-foreground mb-2"
									>
										Telefon <span className="text-red-500">*</span>
									</label>
									<input
										{...register("phone")}
										type="tel"
										id="phone"
										className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										placeholder="070-123 45 67"
									/>
									{errors.phone && (
										<p className="mt-1 text-sm text-red-500">
											{errors.phone.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="company"
										className="block text-sm font-medium text-foreground mb-2"
									>
										Företag
									</label>
									<input
										{...register("company")}
										type="text"
										id="company"
										className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										placeholder="Ditt företag"
									/>
									{errors.company && (
										<p className="mt-1 text-sm text-red-500">
											{errors.company.message}
										</p>
									)}
								</div>
							</div>

							{/* Subject */}
							<div>
								<label
									htmlFor="subject"
									className="block text-sm font-medium text-foreground mb-2"
								>
									Ämne <span className="text-red-500">*</span>
								</label>
								<input
									{...register("subject")}
									type="text"
									id="subject"
									className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
									placeholder="Vad gäller din förfrågan?"
								/>
								{errors.subject && (
									<p className="mt-1 text-sm text-red-500">
										{errors.subject.message}
									</p>
								)}
							</div>

							{/* Message */}
							<div>
								<label
									htmlFor="message"
									className="block text-sm font-medium text-foreground mb-2"
								>
									Meddelande <span className="text-red-500">*</span>
								</label>
								<textarea
									{...register("message")}
									id="message"
									rows={6}
									className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
									placeholder="Berätta mer om dina behov..."
								/>
								{errors.message && (
									<p className="mt-1 text-sm text-red-500">
										{errors.message.message}
									</p>
								)}
							</div>

							{/* GDPR Consent */}
							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<input
										{...register("gdprConsent")}
										type="checkbox"
										id="gdprConsent"
										className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
									/>
									<label
										htmlFor="gdprConsent"
										className="text-sm text-muted-foreground"
									>
										Jag godkänner att Synos Medical behandlar mina
										personuppgifter enligt{" "}
										<a
											href="/integritetspolicy"
											className="text-primary hover:underline"
										>
											integritetspolicyn
										</a>
										. <span className="text-red-500">*</span>
									</label>
								</div>
								{errors.gdprConsent && (
									<p className="text-sm text-red-500">
										{errors.gdprConsent.message}
									</p>
								)}

								<div className="flex items-start gap-3">
									<input
										{...register("marketingConsent")}
										type="checkbox"
										id="marketingConsent"
										className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
									/>
									<label
										htmlFor="marketingConsent"
										className="text-sm text-muted-foreground"
									>
										Jag vill ta emot nyhetsbrev och erbjudanden från
										Synos Medical
									</label>
								</div>
							</div>

							{/* Submit button */}
							<div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full rounded-lg bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting ? "Skickar..." : "Skicka förfrågan"}
								</button>
							</div>

							{/* Status messages */}
							{submitStatus === "success" && (
								<div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
									<p className="font-medium">
										Tack för din förfrågan!
									</p>
									<p className="text-sm mt-1">
										Vi återkommer till dig inom kort.
									</p>
								</div>
							)}

							{submitStatus === "error" && (
								<div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
									<p className="font-medium">Något gick fel</p>
									<p className="text-sm mt-1">
										Vänligen försök igen eller kontakta oss direkt.
									</p>
								</div>
							)}
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
