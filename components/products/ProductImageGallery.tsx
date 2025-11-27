"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { ProductImage } from "@/types/product";
import { ImageComponent } from "../common/image-component";

interface ProductImageGalleryProps {
	images: ProductImage[];
	productName: string;
}

/**
 * ProductImageGallery Component
 *
 * Modern image gallery with:
 * - Main image display with zoom
 * - Thumbnail navigation
 * - Lightbox modal
 * - Keyboard navigation
 * - Glassmorphism effects
 * - Smooth animations
 */
export function ProductImageGallery({
	images,
	productName,
}: ProductImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const selectedImage = images[selectedIndex];

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative aspect-4/3 overflow-hidden rounded-2xl bg-primary/10 group"
			>
				<ImageComponent
					src={selectedImage.url}
					alt={selectedImage.alt}
					height={0}
					width={0}
					sizes="100vw"
					wrapperClasses="w-full h-full"
					className="object-cover h-full w-full"
				/>

				{/* Glassmorphic Overlay on Hover */}
				<div className="absolute inset-0 bg-linear-to-t from-secondary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* Zoom Button */}
				<button
					onClick={() => setIsLightboxOpen(true)}
					className="absolute top-4 right-4 p-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/30 hover:text-primary hover:scale-110 cursor-pointer"
					aria-label="Zoom image"
				>
					<ZoomIn className="h-4 w-4" />
				</button>

				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={handlePrevious}
							className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 cursor-pointer"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							onClick={handleNext}
							className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 cursor-pointer"
							aria-label="Next image"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</>
				)}

				{/* Image Counter */}
				{images.length > 1 && (
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-primary/50 backdrop-blur-sm border border-primary/50 text-xs font-normal text-white">
						{selectedIndex + 1} / {images.length}
					</div>
				)}
			</motion.div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="grid grid-cols-4 md:grid-cols-6 gap-3">
					{images.map((image, index) => (
						<motion.button
							key={index}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							onClick={() => setSelectedIndex(index)}
							className={`
								relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer
								${
									index === selectedIndex
										? "border-primary ring-2 ring-primary/20 scale-105"
										: "border-primary/50 hover:border-primary/20 hover:scale-105"
								}
							`}
							aria-label={`View image ${index + 1}`}
						>
							<ImageComponent
								src={image.url}
								alt={image.alt}
								// fill
								height={0}
								width={0}
								// sizes="(max-width: 768px) 25vw, 150px"
								sizes="100vw"
								wrapperClasses="w-full h-full"
								className="object-cover h-full w-full"
							/>
						</motion.button>
					))}
				</div>
			)}

			{/* Lightbox Modal */}
			<AnimatePresence>
				{isLightboxOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
						onClick={() => setIsLightboxOpen(false)}
					>
						{/* Close Button */}
						<button
							onClick={() => setIsLightboxOpen(false)}
							className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
							aria-label="Close lightbox"
						>
							<X className="h-6 w-6" />
						</button>

						{/* Lightbox Image */}
						<motion.div
							initial={{ scale: 0.9 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.9 }}
							className="relative max-w-7xl max-h-[90vh] w-full h-full"
							onClick={(e) => e.stopPropagation()}
						>
							{/* <Image
								src={selectedImage.url}
								alt={selectedImage.alt}
								fill
								className="object-contain"
								sizes="100vw"
							/> */}

							<ImageComponent
								src={selectedImage.url}
								alt={selectedImage.alt}
								// fill
								height={0}
								width={0}
								// sizes="(max-width: 768px) 25vw, 150px"
								sizes="100vw"
								wrapperClasses="w-full h-full"
								className="object-cover h-full w-full"
							/>
						</motion.div>

						{/* Navigation in Lightbox */}
						{images.length > 1 && (
							<>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handlePrevious();
									}}
									className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
									aria-label="Previous image"
								>
									<ChevronLeft className="h-8 w-8" />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleNext();
									}}
									className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
									aria-label="Next image"
								>
									<ChevronRight className="h-8 w-8" />
								</button>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
