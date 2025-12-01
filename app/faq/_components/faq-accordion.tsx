"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { FAQItem } from "@/types/faq";

interface FAQAccordionProps {
	faqs: FAQItem[];
}

/**
 * FAQ Accordion Component
 *
 * Modern accordion with:
 * - Radix UI-inspired smooth animations
 * - Search functionality
 * - One item open at a time
 * - Glassmorphism card design
 * - Hover effects
 * - Keyboard accessible
 */
export function FAQAccordion({ faqs }: FAQAccordionProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	// Filter FAQs based on search query
	const filteredFAQs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="w-full">
			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-8"
			>
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary/40" />
					<input
						type="text"
						placeholder="Sök efter frågor..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-primary bg-white/80 backdrop-blur-sm text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/10 transition-all duration-300"
					/>
				</div>
			</motion.div>

			{/* FAQ Items */}
			<div className="space-y-4">
				{filteredFAQs.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12 text-secondary/60"
					>
						<p className="text-lg">
							Inga frågor hittades. Försök med en annan sökning.
						</p>
					</motion.div>
				) : (
					filteredFAQs.map((faq, index) => (
						<motion.div
							key={faq.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.05 }}
						>
							<div
								className={`
									rounded-2xl border-2 transition-all duration-300 overflow-hidden
									${
										openIndex === index
											? "border-primary bg-white shadow-xl shadow-primary/10"
											: "border-secondary/50 bg-white/80 backdrop-blur-sm hover:border-secondary hover:shadow-lg"
									}
								`}
							>
								{/* Question Button */}
								<button
									onClick={() => toggleFAQ(index)}
									className="w-full px-6 py-6 flex items-start justify-between gap-4 text-left group"
									aria-expanded={openIndex === index}
									aria-controls={`faq-answer-${faq.id}`}
								>
									<span className="font-semibold text-secondary text-lg flex-1 leading-relaxed">
										{faq.question}
									</span>
									<motion.div
										animate={{
											rotate: openIndex === index ? 180 : 0,
										}}
										transition={{ duration: 0.3, ease: "easeInOut" }}
										className="shrink-0 mt-1"
									>
										<ChevronDown
											className={`h-6 w-6 transition-colors duration-300 ${
												openIndex === index
													? "text-primary"
													: "text-secondary/40 group-hover:text-primary"
											}`}
										/>
									</motion.div>
								</button>

								{/* Answer */}
								<AnimatePresence>
									{openIndex === index && (
										<motion.div
											id={`faq-answer-${faq.id}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												duration: 0.3,
												ease: "easeInOut",
											}}
											className="overflow-hidden"
										>
											<div className="px-6 pb-6 pt-0">
												<div className="border-t-2 border-primary pt-4">
													<p className="text-secondary/80 leading-relaxed">
														{faq.answer}
													</p>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					))
				)}
			</div>

			{/* Help Text */}
			{filteredFAQs.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-12 text-center"
				>
					<p className="text-secondary/60 mb-4">
						Hittade du inte svar på din fråga?
					</p>
					<a
						href="/kontakt"
						className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						Kontakta oss
					</a>
				</motion.div>
			)}
		</div>
	);
}
