"use client";

import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import Link from "next/link";

interface NyheterHeroProps {
	pageTitle?: string;
}

/**
 * NyheterHero Component
 *
 * Dark hero section with abstract image overlay.
 */
export function NyheterHero({ pageTitle = "Nyheter" }: NyheterHeroProps) {
	// Set navbar to dark-hero variant for this page
	useSetNavbarVariant("dark-hero");

	return (
		<section className="relative overflow-hidden bg-secondary pt-32 pb-28 md:pt-36 md:pb-40 lg:pb-48">
			{/* Abstract Image Overlay */}
			<div className="absolute inset-0 bg-[url('/image.png')] opacity-5 bg-no-repeat bg-cover bg-center" />

			{/* Subtle gradient overlay */}
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-secondary/50" />

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
						className="mb-8 flex items-center justify-center gap-2 text-sm"
						aria-label="Breadcrumb"
					>
						<Link
							href="/"
							className="flex items-center gap-1 text-white/60 hover:text-primary transition-colors"
						>
							<Home className="h-4 w-4" />
							<span>Hem</span>
						</Link>
						<ChevronRight className="h-4 w-4 text-white/40" />
						<span className="text-white font-medium">{pageTitle}</span>
					</motion.nav>

					{/* Title */}
					<motion.h1
						variants={fadeUp}
						className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
					>
						Senaste Nytt & <span className="text-primary">Insikter</span>
					</motion.h1>

					{/* Description */}
					<motion.p
						variants={fadeUp}
						className="text-lg text-white/70 md:text-xl max-w-2xl mx-auto"
					>
						Expertguider, tekniska genomgångar och branschnyheter inom
						hårborttagning, hudvård och klinikutrustning.
					</motion.p>
				</motion.div>
			</div>

			{/* Bottom curve/wave transition */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg
					viewBox="0 0 1440 80"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-auto"
					preserveAspectRatio="none"
				>
					<path
						d="M0 80L1440 80L1440 40C1440 40 1320 0 1080 20C840 40 720 60 480 40C240 20 120 0 0 40L0 80Z"
						fill="rgb(248 250 252)"
					/>
				</svg>
			</div>
		</section>
	);
}
