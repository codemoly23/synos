"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/common/container";
import { GlassCard } from "@/components/common/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";

// Simplified contact schema for homepage CTA
const contactSchema = z.object({
	name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
	email: z.string().email("Vänligen ange en giltig e-postadress"),
	message: z.string().min(10, "Meddelandet måste vara minst 10 tecken"),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * ContactCTA Section - Contact form with glassmorphism design
 */
export function ContactCTA() {
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
		resolver: zodResolver(contactSchema),
	});

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			// Send to API endpoint (stub for now)
			const response = await fetch("/api/contact/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				setSubmitStatus("success");
				reset();
				console.log("Contact form submitted:", data);
			} else {
				setSubmitStatus("error");
			}
		} catch (error) {
			console.error("Contact form error:", error);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="contact" className="py-20 md:py-32 relative overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />

			<Container maxWidth="xl" className="relative z-10">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					variants={staggerContainer}
				>
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						{/* Left column - Text */}
						<motion.div variants={fadeUp} transition={defaultTransition}>
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
								Redo att ta{" "}
								<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
									nästa steg?
								</span>
							</h2>
							<p className="text-lg text-slate-300 mb-8">
								Kontakta oss idag för en kostnadsfri konsultation. Vi
								hjälper dig att hitta rätt utrustning för din
								verksamhet.
							</p>

							{/* Contact info */}
							<div className="space-y-4">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
										<svg
											className="w-6 h-6 text-secondary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
									</div>
									<div>
										<p className="text-sm text-slate-400">Telefon</p>
										<p className="text-slate-100 font-medium">
											010-205 15 01
										</p>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
										<svg
											className="w-6 h-6 text-accent"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<p className="text-sm text-slate-400">E-post</p>
										<p className="text-slate-100 font-medium">
											info@synos.se
										</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Right column - Form */}
						<motion.div variants={fadeUp} transition={defaultTransition}>
							<GlassCard padding="lg">
								<form
									onSubmit={handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<div>
										<label htmlFor="name" className="sr-only">
											Namn
										</label>
										<Input
											id="name"
											placeholder="Ditt namn"
											{...register("name")}
											aria-invalid={!!errors.name}
											className="bg-slate-900/50 border-glass-border text-slate-100 placeholder:text-slate-500"
										/>
										{errors.name && (
											<p className="mt-2 text-sm text-error">
												{errors.name.message}
											</p>
										)}
									</div>

									<div>
										<label htmlFor="email" className="sr-only">
											E-post
										</label>
										<Input
											id="email"
											type="email"
											placeholder="din@email.se"
											{...register("email")}
											aria-invalid={!!errors.email}
											className="bg-slate-900/50 border-glass-border text-slate-100 placeholder:text-slate-500"
										/>
										{errors.email && (
											<p className="mt-2 text-sm text-error">
												{errors.email.message}
											</p>
										)}
									</div>

									<div>
										<label htmlFor="message" className="sr-only">
											Meddelande
										</label>
										<Textarea
											id="message"
											placeholder="Ditt meddelande..."
											rows={5}
											{...register("message")}
											aria-invalid={!!errors.message}
											className="bg-slate-900/50 border-glass-border text-slate-100 placeholder:text-slate-500 resize-none"
										/>
										{errors.message && (
											<p className="mt-2 text-sm text-error">
												{errors.message.message}
											</p>
										)}
									</div>

									<Button
										type="submit"
										size="lg"
										disabled={isSubmitting}
										className="w-full bg-secondary hover:bg-secondary-600 text-white shadow-lg shadow-primary/50"
									>
										{isSubmitting
											? "Skickar..."
											: "Skicka meddelande"}
									</Button>

									{submitStatus === "success" && (
										<p className="text-sm text-success text-center">
											Tack! Vi återkommer så snart som möjligt.
										</p>
									)}
									{submitStatus === "error" && (
										<p className="text-sm text-error text-center">
											Något gick fel. Vänligen försök igen eller
											kontakta oss direkt.
										</p>
									)}
								</form>
							</GlassCard>
						</motion.div>
					</div>
				</motion.div>
			</Container>
		</section>
	);
}
