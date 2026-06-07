"use client";

import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import { Article } from "@/types/article";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import Link from "next/link";
import { ImageComponent } from "@/components/common/image-component";

interface NyheterDetailHeroProps {
	article: Article;
	basePath?: string;
}

/**
 * NyheterDetailHero Component
 *
 * Spacious dark hero with abstract image overlay.
 * Full-width title with breadcrumb below.
 * Featured image overlaps into content area.
 */
export function NyheterDetailHero({
	article,
	basePath = "/blogg",
}: NyheterDetailHeroProps) {
	// Set navbar to dark-hero variant for this page
	useSetNavbarVariant("dark-hero");

	return (
		<>
			{/* Dark Hero Section */}
			<section className="relative overflow-hidden bg-secondary min-h-[320px] md:min-h-[400px] flex items-center pt-24 pb-12 md:pt-28 md:pb-14">
				{/* Background Image */}
				{article.headerImage ? (
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: `url('${article.headerImage.url}')` }}
					/>
				) : (
					<div className="absolute inset-0 bg-[url('/image.png')] opacity-5 bg-no-repeat bg-cover bg-center" />
				)}

				{/* Dark overlay for text readability */}
				{article.headerImage && (
					<div className="absolute inset-0 bg-secondary/60" />
				)}

				{/* Gradient overlays for depth */}
				<div className="absolute inset-0 bg-linear-to-b from-secondary/30 via-transparent to-secondary/60" />
				<div className="absolute inset-0 bg-linear-to-r from-secondary/20 via-transparent to-secondary/20" />

				<div className="_container relative z-10 w-full">
					<motion.div
						initial="initial"
						animate="animate"
						variants={staggerContainer}
						className="text-center"
					>
						{/* Title - Full width, main focus */}
						<motion.h1
							variants={fadeUp}
							className="mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight max-w-6xl mx-auto"
						>
							{article.title}
						</motion.h1>

						{/* Breadcrumb - Below title */}
						<motion.nav
							variants={fadeUp}
							className="flex items-center justify-center gap-2 text-sm"
							aria-label="Breadcrumb"
						>
							<Link
								href="/"
								className="flex items-center gap-1.5 text-white/50 hover:text-primary transition-colors"
							>
								<Home className="h-4 w-4" />
								<span>Hem</span>
							</Link>
							<ChevronRight className="h-4 w-4 text-white/30" />
							<Link
								href={basePath}
								className="text-white/50 hover:text-primary transition-colors"
							>
								Nyheter
							</Link>
							<ChevronRight className="h-4 w-4 text-white/30" />
							<span className="text-primary font-medium">Artikel</span>
						</motion.nav>
					</motion.div>
				</div>

			</section>

			{/* Featured Image - Overlapping the hero */}
			{article.featuredImage && (
				<section className="_container relative z-10 -mt-10 md:-mt-12 mb-10 md:mb-14">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
						className="relative aspect-video md:aspect-21/9 w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
					>
						<ImageComponent
							src={article.featuredImage.url}
							alt={article.featuredImage.alt}
							height={0}
							width={0}
							sizes="100vw"
							wrapperClasses="w-full h-full"
							className="object-cover w-full h-full"
						/>
						{/* Subtle gradient overlay on image */}
						<div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
					</motion.div>
				</section>
			)}
		</>
	);
}
