"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";

/**
 * Image Gallery Data Structure
 * Maintains the existing data format for backward compatibility
 */
interface GalleryImage {
	src: string;
	title: string;
	subtitle: string;
}

const images: GalleryImage[] = [
	{
		src: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "Modern Operating Theaters",
		subtitle: "Equipped with precision robotics",
	},
	{
		src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=847&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "Advanced Imaging Centers",
		subtitle: "High-resolution diagnostic clarity",
	},
	{
		src: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "Patient Care Units",
		subtitle: "Comfort meets technology",
	},
	{
		src: "https://plus.unsplash.com/premium_photo-1678376871157-6cebdd957e22?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		title: "Sterile Processing",
		subtitle: "Gold standard hygiene protocols",
	},
];

/**
 * ImageGallery Component
 *
 * A modern, responsive image gallery with glassmorphism effects and smooth animations.
 * Features:
 * - Responsive masonry-style grid layout
 * - Glassmorphic overlay on hover
 * - Smooth entrance and hover animations
 * - SEO-optimized with semantic HTML and proper alt attributes
 * - Lazy loading for performance
 * - Keyboard accessible
 *
 * @returns {JSX.Element} The ImageGallery component
 */
export function ImageGallery() {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<section
			className="section-padding bg-slate-100 overflow-hidden relative"
			aria-labelledby="gallery-heading"
		>
			{/* Decorative background elements */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

			<div className="_container relative z-10">
				{/* Section Header */}
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					variants={staggerContainer}
					className="text-center mb-12 md:mb-16"
				>
					<motion.div
						variants={fadeUp}
						transition={defaultTransition}
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 w-fit border border-primary/20 mb-6 mx-auto"
					>
						<Eye className="h-4 w-4 text-primary" />
						<span className="text-xs font-extrabold text-primary uppercase tracking-wider">
							Our Facilities
						</span>
					</motion.div>

					<motion.h2
						id="gallery-heading"
						variants={fadeUp}
						transition={defaultTransition}
						className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-4 tracking-tight"
					>
						Excellence in Action
					</motion.h2>

					<motion.p
						variants={fadeUp}
						transition={defaultTransition}
						className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium"
					>
						See how our equipment transforms medical facilities around the
						world
					</motion.p>
				</motion.div>

				{/* Gallery Grid */}
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-50px" }}
					variants={staggerContainer}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
				>
					{images.map((image, index) => (
						<motion.figure
							key={index}
							variants={fadeUp}
							transition={{ ...defaultTransition, delay: index * 0.1 }}
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
							className={`
								relative overflow-hidden rounded-2xl group cursor-pointer
								${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
								${index === 0 ? "h-[400px] md:h-full" : "h-[300px]"}
							`}
						>
							{/* Image */}
							<Image
								src={image.src}
								alt={`${image.title} - ${image.subtitle}`}
								fill
								loading={index === 0 ? "eager" : "lazy"}
								className="object-cover transition-transform duration-700 group-hover:scale-110"
								sizes={
									index === 0
										? "(max-width: 768px) 100vw, 50vw"
										: "(max-width: 768px) 100vw, 25vw"
								}
							/>

							{/* Gradient Overlay - Always visible on mobile, hover on desktop */}
							<div
								className={`
									absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent
									transition-opacity duration-500
									md:opacity-0 md:group-hover:opacity-50
								`}
							/>

							{/* Glassmorphic Content Overlay */}
							<div
								className={`
									absolute inset-0 flex flex-col justify-end p-6 md:p-8
									transition-all duration-500
									${
										hoveredIndex === index
											? "translate-y-0 opacity-100"
											: "md:translate-y-4 md:opacity-0"
									}
								`}
							>
								{/* Glass Card with Content */}
								<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 shadow-2xl transform transition-all duration-300 group-hover:shadow-primary/20">
									{/* Icon Badge */}
									{/* <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 mb-3">
										<Maximize2 className="h-5 w-5 text-primary" />
									</div> */}

									{/* Title */}
									<h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 line-clamp-2 tracking-tight">
										{image.title}
									</h3>

									{/* Subtitle */}
									<p className="text-slate-200 text-sm md:text-base line-clamp-2 font-medium">
										{image.subtitle}
									</p>

									{/* Decorative accent line */}
									<div className="mt-4 h-1 w-16 bg-linear-to-r from-primary to-primary/20 rounded-full" />
								</div>
							</div>

							{/* Hover Indicator - Desktop only */}
							{/* <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
								<div className="bg-white/70 backdrop-blur-md rounded-full p-2 shadow-lg">
									<Eye className="h-5 w-5 text-primary" />
								</div>
							</div> */}

							{/* Accessible caption for screen readers */}
							<figcaption className="sr-only">
								{image.title}: {image.subtitle}
							</figcaption>
						</motion.figure>
					))}
				</motion.div>

				{/* Bottom CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="mt-12 md:mt-16 text-center"
				>
					<div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-6 md:p-8 shadow-xl">
						<div className="flex-1 text-left">
							<h3 className="text-lg md:text-xl font-extrabold text-secondary mb-2 tracking-tight">
								Want to see more?
							</h3>
							<p className="text-secondary/50 text-sm md:text-base font-medium">
								Schedule a virtual tour of our facilities and equipment
							</p>
						</div>
						<button
							className="shrink-0 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
							aria-label="Schedule a virtual tour"
						>
							Schedule Tour
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
