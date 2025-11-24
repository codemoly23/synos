"use client";

import { motion } from "framer-motion";
import { Clock, Truck, ShieldCheck, HeadphonesIcon } from "lucide-react";

const features = [
	{
		icon: Clock,
		title: "24/7 Support",
		description:
			"Expert technical assistance available whenever you need it.",
	},
	{
		icon: ShieldCheck,
		title: "FDA Certified",
		description: "All equipment meets strict regulatory safety standards.",
	},
	{
		icon: Truck,
		title: "Fast Shipping",
		description: "Expedited delivery options for urgent medical needs.",
	},
	{
		icon: HeadphonesIcon,
		title: "Training Included",
		description:
			"Comprehensive staff training with every major installation.",
	},
];

export function FeatureHighlights() {
	return (
		<section className="py-16 bg-slate-100 border-y border-border/50">
			<div className="container-width">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
						>
							<div className="h-12 w-12 rounded-xl bg-secondary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
								<feature.icon className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-semibold text-[#0C2C46] mb-2 group-hover:text-primary transition-colors duration-300">
								{feature.title}
							</h3>
							<p className="text-sm text-slate-600 leading-relaxed group-hover:text-[#0C2C46]/80 transition-colors duration-300">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
