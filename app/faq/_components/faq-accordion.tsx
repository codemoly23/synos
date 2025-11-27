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
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2C2D38]/40" />
					<input
						type="text"
						placeholder="Sök efter frågor..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#E6C4AE] bg-white/80 backdrop-blur-sm text-[#2C2D38] placeholder:text-[#2C2D38]/40 focus:outline-none focus:border-[#39898F] focus:ring-4 focus:ring-[#39898F]/10 transition-all duration-300"
					/>
				</div>
			</motion.div>

			{/* FAQ Items */}
			<div className="space-y-4">
				{filteredFAQs.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12 text-[#2C2D38]/60"
					>
						<p className="text-lg">Inga frågor hittades. Försök med en annan sökning.</p>
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
											? "border-[#39898F] bg-white shadow-xl shadow-[#39898F]/10"
											: "border-[#E6C4AE] bg-white/80 backdrop-blur-sm hover:border-[#DFB294] hover:shadow-lg"
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
									<span className="font-semibold text-[#2C2D38] text-lg flex-1 leading-relaxed">
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
													? "text-[#39898F]"
													: "text-[#2C2D38]/40 group-hover:text-[#39898F]"
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
											transition={{ duration: 0.3, ease: "easeInOut" }}
											className="overflow-hidden"
										>
											<div className="px-6 pb-6 pt-0">
												<div className="border-t-2 border-[#F1DCCF] pt-4">
													<p className="text-[#2C2D38]/80 leading-relaxed">
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
					<p className="text-[#2C2D38]/60 mb-4">
						Hittade du inte svar på din fråga?
					</p>
					<a
						href="/kontakt"
						className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#39898F] text-white font-semibold hover:bg-[#2C2D38] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						Kontakta oss
					</a>
				</motion.div>
			)}
		</div>
	);
}

