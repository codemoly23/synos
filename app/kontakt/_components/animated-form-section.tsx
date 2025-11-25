"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export function AnimatedFormSection() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#00949E]/10 px-4 py-1.5">
					<Send className="h-4 w-4 text-[#00949E]" />
					<span className="text-sm font-semibold text-[#00949E]">
						Skicka meddelande
					</span>
				</div>
				<h2 className="mb-4 text-3xl font-bold text-[#0C2C46] md:text-4xl">
					Berätta om ditt projekt
				</h2>
				<p className="text-lg text-slate-600">
					Fyll i formuläret så återkommer vi till dig så snart som möjligt.
				</p>
			</div>
			<div className="rounded-md border border-slate-200 bg-white p-4 sm:p-8 shadow-lg">
				<ContactForm />
			</div>
		</motion.div>
	);
}
