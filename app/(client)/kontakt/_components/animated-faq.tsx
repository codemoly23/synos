"use client";

import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";

const faqs = [
	{
		question: "Hur snabbt får jag svar?",
		answer:
			"Vi strävar efter att svara på alla förfrågningar inom 24 timmar under vardagar.",
	},
	{
		question: "Kan jag boka ett möte?",
		answer:
			"Absolut! Ange i meddelandet att du vill boka ett möte så återkommer vi med förslag på tider.",
	},
	{
		question: "Erbjuder ni demonstrationer?",
		answer:
			"Ja, vi erbjuder kostnadsfria produktdemonstrationer på våra kontor eller hos er.",
	},
	{
		question: "Finns ni på plats?",
		answer:
			"Vi rekommenderar att boka tid innan besök för att säkerställa att rätt person finns tillgänglig.",
	},
];

export function AnimatedFAQ() {
	return (
		<section className="section-padding bg-slate-100">
			<div className="_container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mx-auto max-w-4xl text-center"
				>
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
						<MessageCircle className="h-4 w-4 text-secondary" />
						<span className="text-sm font-semibold text-secondary">
							Vanliga frågor
						</span>
					</div>
					<h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
						Har du frågor?
					</h2>
					<p className="mb-12 text-lg text-slate-600">
						Här hittar du svar på de vanligaste frågorna. Hittar du inte
						svar? Kontakta oss gärna!
					</p>
				</motion.div>

				<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: index * 0.1 }}
							className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/30"
						>
							<div className="mb-3 flex items-start gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
									<CheckCircle2 className="h-5 w-5" />
								</div>
								<h3 className="font-bold text-secondary">
									{faq.question}
								</h3>
							</div>
							<p className="pl-11 text-sm text-slate-600">
								{faq.answer}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
