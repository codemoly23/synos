"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "@/lib/animations";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-toner-100 flex items-center justify-center px-4">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute left-1/4 bottom-1/4 h-[250px] w-[250px] rounded-full bg-accent/5 blur-3xl" />
			</div>

			<div className="max-w-2xl mx-auto text-center">
				{/* 404 Number */}
				<motion.div
					variants={scaleIn}
					initial="initial"
					animate="animate"
					className="mb-8"
				>
					<h1 className="text-9xl font-bold text-primary/20 select-none">
						404
					</h1>
				</motion.div>

				{/* Content */}
				<motion.div
					variants={fadeUp}
					initial="initial"
					animate="animate"
					transition={{ delay: 0.2 }}
					className="space-y-6"
				>
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">
						Sidan kunde inte hittas
					</h2>
					<p className="text-lg text-muted-foreground max-w-md mx-auto">
						Tyvärr kunde vi inte hitta sidan du letar efter. Den kan ha
						flyttats eller tagits bort.
					</p>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-md hover:bg-primary-dark transition-colors"
						>
							<svg
								className="mr-2 h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Tillbaka till startsidan
						</Link>
						<Link
							href="/kontakt"
							className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-white px-8 py-3.5 text-base font-medium text-foreground hover:bg-background-soft transition-colors"
						>
							Kontakta oss
						</Link>
					</div>
				</motion.div>

				{/* Helpful links */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="mt-12 pt-8 border-t border-border"
				>
					<p className="text-sm text-muted-foreground mb-4">
						Kanske letar du efter:
					</p>
					<div className="flex flex-wrap gap-3 justify-center">
						<Link
							href="/produkter"
							className="text-sm text-primary hover:text-primary-dark hover:underline"
						>
							Produkter
						</Link>
						<span className="text-muted-foreground">•</span>
						<Link
							href="/om-oss"
							className="text-sm text-primary hover:text-primary-dark hover:underline"
						>
							Om Oss
						</Link>
						<span className="text-muted-foreground">•</span>
						<Link
							href="/utbildningar"
							className="text-sm text-primary hover:text-primary-dark hover:underline"
						>
							Utbildningar
						</Link>
						<span className="text-muted-foreground">•</span>
						<Link
							href="/starta-eget"
							className="text-sm text-primary hover:text-primary-dark hover:underline"
						>
							Starta Eget
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
