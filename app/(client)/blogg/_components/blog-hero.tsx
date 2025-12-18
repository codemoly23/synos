"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface BlogHeroProps {
	pageTitle?: string;
}

/**
 * BlogHero Component
 *
 * Hero section for the blog listing page with title, description, and decorative elements.
 * Supports custom pageTitle for different routes (e.g., "Nyheter", "Blogg")
 */
export function BlogHero({ pageTitle = "Blogg" }: BlogHeroProps) {
	return (
		<section className="relative overflow-hidden bg-linear-to-br from-slate-100 to-primary/20 pt-32 pb-16 md:pb-24">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			<div className="_container relative">
				<motion.div
					initial="initial"
					animate="animate"
					variants={staggerContainer}
					className="mx-auto max-w-4xl text-center"
				>
					{/* Badge */}
					<motion.div
						variants={fadeUp}
						className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
					>
						<BookOpen className="h-4 w-4 text-primary" />
						<span className="text-sm font-semibold text-primary">
							{pageTitle === "Nyheter"
								? "Nyheter"
								: "Nyheter & Artiklar"}
						</span>
					</motion.div>

					{/* Title */}
					<motion.h1
						variants={fadeUp}
						className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl"
					>
						Senaste nytt om{" "}
						<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
							klinikutrustning
						</span>
					</motion.h1>

					{/* Description */}
					<motion.p
						variants={fadeUp}
						className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
					>
						Ta del av det allra senaste inom hårborttagning, hudvård,
						microneedling och tatueringsborttagning. Expertguider,
						tekniska genomgångar och branschnyheter.
					</motion.p>

					{/* Stats */}
					<motion.div
						variants={fadeUp}
						className="flex flex-wrap items-center justify-center gap-8 text-sm"
					>
						<div className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							<span className="text-muted-foreground">
								Uppdateras regelbundet
							</span>
						</div>
						<div className="flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-primary" />
							<span className="text-muted-foreground">
								Expertskrivna artiklar
							</span>
						</div>
					</motion.div>
				</motion.div>
			</div>

			{/* Bottom Wave */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg
					viewBox="0 0 1440 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full"
				>
					<path
						d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
						fill="rgb(255 255 255 / 0.50)"
					/>
				</svg>
			</div>
		</section>
	);
}
