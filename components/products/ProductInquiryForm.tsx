"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductInquiryFormProps {
	productName: string;
	productId: string;
}

/**
 * ProductInquiryForm Component
 *
 * Contact form for product inquiries with:
 * - Glassmorphism design
 * - Form validation
 * - Success/error states
 * - Responsive layout
 */
export function ProductInquiryForm({
	productName,
	productId,
}: ProductInquiryFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			setSubmitStatus("success");
			setFormData({
				name: "",
				email: "",
				phone: "",
				company: "",
				message: "",
			});

			// Reset success message after 5 seconds
			setTimeout(() => setSubmitStatus("idle"), 5000);
		}, 1500);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<section className="py-16 md:py-24 bg-linear-to-br from-primary/5 to-secondary/5">
			<div className="_container">
				<div className="max-w-4xl mx-auto">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center mb-12"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
							<Mail className="h-4 w-4" />
							<span className="text-sm font-semibold">Kontakta oss</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
							Intresserad av {productName}?
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Fyll i formuläret så kontaktar vi dig för mer information,
							demo eller offert
						</p>
					</motion.div>

					{/* Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<form
							onSubmit={handleSubmit}
							className="p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								{/* Name */}
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-semibold text-foreground mb-2"
									>
										Namn *
									</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
											placeholder="Ditt namn"
										/>
									</div>
								</div>

								{/* Email */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-semibold text-foreground mb-2"
									>
										E-post *
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
											placeholder="din@email.se"
										/>
									</div>
								</div>

								{/* Phone */}
								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-semibold text-foreground mb-2"
									>
										Telefon
									</label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
										<input
											type="tel"
											id="phone"
											name="phone"
											value={formData.phone}
											onChange={handleChange}
											className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
											placeholder="+46 70 123 45 67"
										/>
									</div>
								</div>

								{/* Company */}
								<div>
									<label
										htmlFor="company"
										className="block text-sm font-semibold text-foreground mb-2"
									>
										Företag/Klinik
									</label>
									<div className="relative">
										<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
										<input
											type="text"
											id="company"
											name="company"
											value={formData.company}
											onChange={handleChange}
											className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
											placeholder="Ditt företag"
										/>
									</div>
								</div>
							</div>

							{/* Message */}
							<div className="mb-6">
								<label
									htmlFor="message"
									className="block text-sm font-semibold text-foreground mb-2"
								>
									Meddelande *
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows={5}
									className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
									placeholder="Berätta om dina behov och frågor..."
								/>
							</div>

							{/* Hidden field for product */}
							<input type="hidden" name="product" value={productName} />
							<input type="hidden" name="productId" value={productId} />

							{/* Submit Button */}
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									* Obligatoriska fält
								</p>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
								>
									{isSubmitting ? (
										<>
											<span className="animate-spin mr-2">⏳</span>
											Skickar...
										</>
									) : (
										<>
											<Send className="mr-2 h-4 w-4" />
											Skicka förfrågan
										</>
									)}
								</Button>
							</div>

							{/* Success Message */}
							{submitStatus === "success" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800"
								>
									<p className="font-semibold">
										Tack för din förfrågan!
									</p>
									<p className="text-sm">
										Vi återkommer till dig inom 24 timmar.
									</p>
								</motion.div>
							)}

							{/* Error Message */}
							{submitStatus === "error" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800"
								>
									<p className="font-semibold">Något gick fel</p>
									<p className="text-sm">
										Vänligen försök igen eller kontakta oss direkt.
									</p>
								</motion.div>
							)}
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
