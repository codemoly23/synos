"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-gradient-soft py-20 lg:py-28">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
			</div>

			<div className="section-container">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
					{/* Left content */}
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="space-y-6"
					>
						<motion.h1
							variants={staggerItem}
							className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
						>
							Professionell{" "}
							<span className="text-primary">medicinsk utrustning</span>{" "}
							för moderna kliniker
						</motion.h1>

						<motion.p
							variants={staggerItem}
							className="text-lg text-muted-foreground max-w-2xl"
						>
							Sveriges ledande leverantör av MDR-certifierad
							klinikutrustning för laser, hårborttagning,
							tatueringsborttagning och hudföryngring. Kvalitet och
							säkerhet i varje detalj.
						</motion.p>

						<motion.div
							variants={staggerItem}
							className="flex flex-wrap gap-4"
						>
							<Link
								href="/produkter"
								className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-md hover:bg-primary-dark transition-colors"
							>
								Utforska produkter
							</Link>
							<Link
								href="/kontakt"
								className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-white px-8 py-3.5 text-base font-medium text-foreground hover:bg-background-soft transition-colors"
							>
								Kontakta oss
							</Link>
						</motion.div>

						{/* Trust indicators */}
						<motion.div
							variants={staggerItem}
							className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted"
						>
							<div className="flex items-center gap-2">
								<svg
									className="h-5 w-5 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>MDR-certifierad</span>
							</div>
							<div className="flex items-center gap-2">
								<svg
									className="h-5 w-5 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Svensk support</span>
							</div>
							<div className="flex items-center gap-2">
								<svg
									className="h-5 w-5 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>20+ års erfarenhet</span>
							</div>
						</motion.div>
					</motion.div>

					{/* Right image */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="relative"
					>
						<div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-background-soft shadow-xl">
							{/* Placeholder for hero image */}
							<div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
								<div className="text-center">
									<svg
										className="mx-auto h-24 w-24 text-primary/30"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
