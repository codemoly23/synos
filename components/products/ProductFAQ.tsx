"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PreviewEditor } from "@/components/common/TextEditor";

interface ProductFAQProps {
	faqs: Array<{
		question: string;
		answer: string;
		visible: boolean;
		_id: string;
	}>;
	title?: string;
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
export function ProductFAQ({ faqs, title }: ProductFAQProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	if (!faqs || faqs.length === 0) return null;

	return (
		<div className="space-y-4">
			{title && (
				<h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
					{title}
				</h2>
			)}
			{faqs
				.filter((faq) => faq.visible)
				.map((faq, index) => (
					<motion.div
						key={faq._id}
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
								<span className="font-medium text-foreground text-lg flex-1 cursor-pointer">
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
										<div className="px-6 pb-5 pt-0">
											<div className="font-medium text-foreground text-lg leading-relaxed border-t border-slate-300 pt-4 [&_.sun-editor-editable]:text-[15px]!">
												<PreviewEditor>{faq.answer}</PreviewEditor>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				))}
		</div>
	);
}
