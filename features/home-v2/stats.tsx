"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const stats = [
	{
		value: "20+",
		label: "År i branschen",
		description: "Gedigen erfarenhet"
	},
	{
		value: "500+",
		label: "Nöjda kliniker",
		description: "I hela Norden"
	},
	{
		value: "100%",
		label: "MDR-certifierat",
		description: "Garanterad kvalitet"
	},
	{
		value: "24/7",
		label: "Support",
		description: "Alltid tillgängliga"
	}
];

export function Stats() {
	return (
		<section className="py-16 lg:py-20 bg-background-section">
			<div className="section-container">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
				>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							variants={staggerItem}
							className="text-center"
						>
							<div className="mb-2 text-4xl font-bold text-primary lg:text-5xl">
								{stat.value}
							</div>
							<div className="mb-1 text-lg font-semibold text-foreground">
								{stat.label}
							</div>
							<div className="text-sm text-muted-foreground">
								{stat.description}
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

