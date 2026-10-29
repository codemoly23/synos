"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PreviewEditor } from "@/components/common/TextEditor";
import { Button } from "@/components/ui/button";

interface ProductFAQProps {
	faqs: Array<{
		question: string;
		answer: string;
		visible: boolean;
		_id: string;
	}>;
	title?: string;
	/** When set, only this many visible FAQs render until "showAllLabel" is clicked. */
	limit?: number;
	showAllLabel?: string;
}

/**
 * ProductFAQ Component
 *
 * Accordion-style FAQ section with:
 * - Smooth expand/collapse animations
 * - Glassmorphism card design
 * - One item open at a time
 * - Keyboard accessible
 */
export function ProductFAQ({ faqs, title, limit, showAllLabel = "Visa alla frågor" }: ProductFAQProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const [showAll, setShowAll] = useState(false);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	if (!faqs || faqs.length === 0) return null;

	const visibleFaqs = faqs.filter((faq) => faq.visible);
	const isCapped = !showAll && !!limit && visibleFaqs.length > limit;
	const displayedFaqs = isCapped ? visibleFaqs.slice(0, limit) : visibleFaqs;

	return (
		<div className="relative space-y-4">
			{title && (
				<h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
					{title}
				</h2>
			)}
			<div className="relative">
				{displayedFaqs.map((faq, index) => (
					<div key={faq._id} className={index > 0 ? "mt-4" : undefined}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div
								className={`
								rounded-2xl border transition-all duration-300
								${
									openIndex === index
										? "border-primary bg-card/80 backdrop-blur-sm shadow-lg"
										: "border-primary bg-card/50 backdrop-blur-sm hover:border-primary/50"
								}
							`}
							>
								{/* Question Button */}
								<button
									onClick={() => toggleFAQ(index)}
									className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left"
									aria-expanded={openIndex === index}
									aria-controls={`faq-answer-${faq._id}`}
								>
									<span className="font-semibold text-secondary text-lg flex-1 cursor-pointer">
										{faq.question}
									</span>
									<motion.div
										animate={{
											rotate: openIndex === index ? 180 : 0,
										}}
										transition={{ duration: 0.3 }}
										className="shrink-0 mt-1"
									>
										<ChevronDown
											className={`h-5 w-5 transition-colors ${
												openIndex === index
													? "text-primary"
													: "text-muted-foreground"
											}`}
										/>
									</motion.div>
								</button>

								{/* Answer */}
								<AnimatePresence>
									{openIndex === index && (
										<motion.div
											id={`faq-answer-${faq._id}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="overflow-hidden"
										>
											<div className="px-6 pb-4 pt-0">
												<div className="font-medium text-lg leading-relaxed border-t border-slate-300 pt-3 [&_.sun-editor-editable_*]:!text-[18px] [&_.sun-editor-editable]:![color:rgba(44,45,56,0.5)] [&_.sun-editor-editable]:!p-0 [&_.sun-editor-editable_p:last-child]:!mb-0">
													<PreviewEditor>{faq.answer}</PreviewEditor>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>
				))}
				{isCapped && (
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-2xl bg-gradient-to-t from-background to-transparent" />
				)}
			</div>

			{/* Show-all toggle sits after the last visible question */}
			{!!limit && visibleFaqs.length > limit && (
				<div className="relative flex justify-center pt-6 pb-2">
					<Button
						variant="outline"
						size="sm"
						className="relative rounded-full text-primary hover:text-primary/80"
						onClick={() => setShowAll((prev) => !prev)}
					>
						{showAll ? (
							<>
								Visa färre <ChevronUp className="ml-1 h-4 w-4" />
							</>
						) : (
							<>
								{showAllLabel} <ChevronDown className="ml-1 h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
