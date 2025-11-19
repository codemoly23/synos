"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const features = [
	{
		icon: (
			<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
		),
		title: "MDR-certifierad utrustning",
		description: "All vår utrustning är certifierad enligt de senaste MDR-kraven för medicintekniska produkter, vilket garanterar högsta säkerhet och kvalitet."
	},
	{
		icon: (
			<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
		),
		title: "Senaste teknologin",
		description: "Vi erbjuder marknadens mest avancerade laser- och ljusteknologi för effektiva och säkra behandlingar med dokumenterade resultat."
	},
	{
		icon: (
			<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		),
		title: "Komplett support",
		description: "Svensk teknisk support, utbildning och service. Vi finns alltid tillgängliga för att säkerställa att din verksamhet fungerar optimalt."
	},
	{
		icon: (
			<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
			</svg>
		),
		title: "Utbildning & träning",
		description: "Omfattande utbildningsprogram för din personal. Vi säkerställer att ni får maximal nytta av er investering från dag ett."
	},
	{
		icon: (
			<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
		),
		title: "Flexibla lösningar",
		description: "Skräddarsydda finansieringslösningar och serviceavtal anpassade efter din verksamhets behov och budget."
	},
	{
		icon: (
			<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
		),
		title: "20+ års erfarenhet",
		description: "Med över två decennier i branschen har vi hjälpt hundratals kliniker att växa och utvecklas med rätt utrustning."
	}
];

export function Features() {
	return (
		<section className="py-20 lg:py-28 bg-white">
			<div className="section-container">
				{/* Section header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-2xl text-center mb-16"
				>
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
						Varför välja Synos Medical?
					</h2>
					<p className="text-lg text-muted-foreground">
						Vi är din pålitliga partner för medicinsk utrustning av högsta kvalitet
					</p>
				</motion.div>

				{/* Features grid */}
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
				>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							variants={staggerItem}
							className="group relative rounded-xl bg-white p-8 card-shadow hover:shadow-lg transition-all duration-300"
						>
							<div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
								{feature.icon}
							</div>
							<h3 className="mb-3 text-xl font-semibold text-foreground">
								{feature.title}
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

