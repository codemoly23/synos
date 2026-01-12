"use client";

import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import Link from "next/link";

interface CareersHeroProps {
	title?: string;
	breadcrumb?: { label: string; href?: string }[];
}

/**
 * CareersHero Component
 *
 * Dark hero section with geometric wave pattern overlay (like Nyheter page).
 */
export function CareersHero({
	title = "Lediga Tjänster",
	breadcrumb = [
		{ label: "Om Oss", href: "/om-oss" },
		{ label: "Lediga Tjänster" },
	],
}: CareersHeroProps) {
	// Set navbar to dark-hero variant for this page
	useSetNavbarVariant("dark-hero");

	return (
		<section className="relative overflow-hidden bg-secondary pt-32 pb-20 md:pt-36 md:pb-24">
			{/* Abstract Geometric Overlay */}
			<div className="absolute inset-0 opacity-10">
				<svg
					className="absolute top-0 left-0 w-full h-full"
					viewBox="0 0 1440 560"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid slice"
				>
					{/* Animated geometric lines */}
					<motion.path
						d="M-100 300 Q 200 100, 400 300 T 800 300 T 1200 300 T 1600 300"
						stroke="currentColor"
						strokeWidth="1"
						fill="none"
						className="text-primary"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.6 }}
						transition={{ duration: 2, ease: "easeInOut" }}
					/>
					<motion.path
						d="M-100 350 Q 250 150, 500 350 T 900 350 T 1300 350 T 1700 350"
						stroke="currentColor"
						strokeWidth="0.5"
						fill="none"
						className="text-primary"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.4 }}
						transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
					/>
					<motion.path
						d="M-100 250 Q 150 50, 350 250 T 750 250 T 1150 250 T 1550 250"
						stroke="currentColor"
						strokeWidth="0.5"
						fill="none"
						className="text-primary"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.3 }}
						transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
					/>
				</svg>
			</div>

			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/80" />

			<div className="_container relative z-10">
				<motion.div
					initial="initial"
					animate="animate"
					variants={staggerContainer}
					className="max-w-4xl mx-auto text-center"
				>
					{/* Breadcrumb */}
					<motion.nav
						variants={fadeUp}
						className="mb-6 flex items-center justify-center gap-2 text-sm"
						aria-label="Breadcrumb"
					>
						<Link
							href="/"
							className="flex items-center gap-1 text-white/60 hover:text-primary transition-colors"
						>
							<Home className="h-4 w-4" />
							<span>Hem</span>
						</Link>
						{breadcrumb.map((item, index) => (
							<span key={index} className="flex items-center gap-2">
								<ChevronRight className="h-4 w-4 text-white/40" />
								{item.href ? (
									<Link
										href={item.href}
										className="text-white/60 hover:text-primary transition-colors"
									>
										{item.label}
									</Link>
								) : (
									<span className="text-white font-medium">{item.label}</span>
								)}
							</span>
						))}
					</motion.nav>

					{/* Title */}
					<motion.h1
						variants={fadeUp}
						className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
					>
						{title}
					</motion.h1>
				</motion.div>
			</div>

		</section>
	);
}
