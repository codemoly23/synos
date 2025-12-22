"use client";

import { motion } from "framer-motion";
import { HelpCircle, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { IFAQHeroSection } from "@/models/faq-page.model";

interface FAQHeroClientProps {
	data: IFAQHeroSection;
}

export function FAQHeroClient({ data }: FAQHeroClientProps) {
	const validStats = (data.stats || []).filter((s) => s.value);

	return (
		<section className="relative w-full overflow-hidden bg-linear-to-br from-slate-100 to-primary/20 padding-top pb-20">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg- rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
			</div>

			<div className="_container relative z-10">
				{/* Breadcrumb */}
				<motion.nav
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="mb-8 flex items-center gap-2 text-sm"
					aria-label="Breadcrumb"
				>
					<Link
						href="/"
						className="flex items-center gap-1 text-secondary/70 hover:text-primary transition-colors"
					>
						<Home className="h-4 w-4" />
						<span>Hem</span>
					</Link>
					<ChevronRight className="h-4 w-4 text-secondary/50" />
					<span className="text-secondary font-medium">FAQ</span>
				</motion.nav>

				{/* Hero Content */}
				<div className="max-w-4xl mx-auto text-center">
					{/* Badge */}
					{data.badge && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-secondary/20 mb-6"
						>
							<HelpCircle className="h-5 w-5 text-secondary" />
							<span className="text-sm font-semibold text-secondary">
								{data.badge}
							</span>
						</motion.div>
					)}

					{/* Title */}
					{(data.title || data.titleHighlight) && (
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-6 leading-tight"
						>
							{data.title}{" "}
							{data.titleHighlight && (
								<span className="text-primary">{data.titleHighlight}</span>
							)}
						</motion.h1>
					)}

					{/* Description */}
					{data.subtitle && (
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-lg sm:text-xl text-secondary/80 max-w-3xl mx-auto leading-relaxed"
						>
							{data.subtitle}
						</motion.p>
					)}

					{/* Stats */}
					{validStats.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
						>
							{validStats.map((stat, index) => (
								<div
									key={index}
									className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-secondary/30 ${
										validStats.length === 3 && index === 2
											? "col-span-2 sm:col-span-1"
											: ""
									}`}
								>
									<div className="text-3xl font-bold text-primary mb-1">
										{stat.value}
									</div>
									{stat.label && (
										<div className="text-sm text-secondary/70">
											{stat.label}
										</div>
									)}
								</div>
							))}
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
