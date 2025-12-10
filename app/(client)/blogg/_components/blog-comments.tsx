"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";
import { MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

/**
 * BlogComments Component
 *
 * Comments/reviews section for blog posts with form and sample comments.
 */

interface Comment {
	id: string;
	author: string;
	date: string;
	content: string;
	avatar?: string;
}

// Sample comments for demonstration
const sampleComments: Comment[] = [
	{
		id: "1",
		author: "Anna Svensson",
		date: "2025-11-15",
		content:
			"Mycket informativ artikel! Jag har funderat på att investera i en CO2-laser till min klinik och detta hjälpte verkligen att förstå skillnaderna mellan teknologierna.",
	},
	{
		id: "2",
		author: "Erik Johansson",
		date: "2025-11-10",
		content:
			"Tack för den detaljerade jämförelsen. RF-teknologin verkar verkligen vara framtiden. Skulle gärna vilja se en demo av Tetra PRO.",
	},
	{
		id: "3",
		author: "Maria Andersson",
		date: "2025-11-05",
		content:
			"Vi har använt RF-stimulerad CO2-laser i vår klinik i 6 månader nu och resultaten är fantastiska. Patienterna är mycket nöjda med CoolPeel-behandlingarna!",
	},
];

export function BlogComments() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Reset form
		setName("");
		setEmail("");
		setComment("");
		setIsSubmitting(false);

		// In production, this would send data to an API
		toast.success(
			"Tack för din kommentar! Den kommer att granskas innan publicering."
		);
	};

	return (
		<section className="section-padding bg-gradient-to-br from-slate-50 via-white to-slate-50">
			<div className="_container">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
					className="mx-auto max-w-4xl"
				>
					{/* Section Header */}
					<motion.div variants={fadeUp} className="mb-12 text-center">
						<div className="mb-4 flex items-center justify-center gap-2">
							<MessageSquare className="h-6 w-6 text-primary" />
							<h2 className="text-3xl font-bold text-secondary md:text-4xl">
								Kommentarer
							</h2>
						</div>
						<p className="text-lg text-muted-foreground">
							Dela dina tankar och frågor om artikeln
						</p>
					</motion.div>

					{/* Existing Comments */}
					<motion.div
						variants={staggerContainer}
						className="mb-12 space-y-6"
					>
						{sampleComments.map((comment) => (
							<motion.div
								key={comment.id}
								variants={staggerItem}
								className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
							>
								<div className="mb-4 flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<User className="h-6 w-6 text-primary" />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-foreground">
											{comment.author}
										</h4>
										<time className="text-sm text-muted-foreground">
											{new Date(comment.date).toLocaleDateString(
												"sv-SE",
												{
													year: "numeric",
													month: "long",
													day: "numeric",
												}
											)}
										</time>
									</div>
								</div>
								<p className="leading-relaxed text-muted-foreground">
									{comment.content}
								</p>
							</motion.div>
						))}
					</motion.div>

					{/* Comment Form */}
					<motion.div
						variants={fadeUp}
						className="rounded-2xl border border-border bg-white p-8 shadow-sm"
					>
						<h3 className="mb-6 text-xl font-bold text-secondary">
							Lämna en kommentar
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<label
										htmlFor="name"
										className="mb-2 block text-sm font-medium text-foreground"
									>
										Namn *
									</label>
									<Input
										id="name"
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
										placeholder="Ditt namn"
									/>
								</div>
								<div>
									<label
										htmlFor="email"
										className="mb-2 block text-sm font-medium text-foreground"
									>
										E-post *
									</label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										placeholder="din@email.se"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="comment"
									className="mb-2 block text-sm font-medium text-foreground"
								>
									Kommentar *
								</label>
								<Textarea
									id="comment"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									required
									placeholder="Skriv din kommentar här..."
									rows={5}
								/>
							</div>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full md:w-auto"
							>
								{isSubmitting ? "Skickar..." : "Skicka kommentar"}
							</Button>
						</form>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
