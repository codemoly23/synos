"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, Pause, Play } from "lucide-react";
import Image from "next/image";

interface ProductImageGalleryProps {
	images: string[];
	productName: string;
}

/**
 * ProductImageGallery Component
 *
 * Modern image gallery with:
 * - Auto-sliding every 5 seconds
 * - Thumbnail navigation
 * - Lightbox modal
 * - Keyboard navigation
 * - Smooth animations
 * - Pause on hover
 */
export function ProductImageGallery({
	images,
	productName,
}: ProductImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

	const handlePrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	}, [images.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	}, [images.length]);

	// Auto-slide functionality
	useEffect(() => {
		if (isPaused || isHovered || isLightboxOpen || images.length <= 1) {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
				autoPlayRef.current = null;
			}
			return;
		}

		autoPlayRef.current = setInterval(() => {
			handleNext();
		}, 5000);

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [isPaused, isHovered, isLightboxOpen, images.length, handleNext]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isLightboxOpen) {
				if (e.key === "Escape") setIsLightboxOpen(false);
				if (e.key === "ArrowLeft") handlePrevious();
				if (e.key === "ArrowRight") handleNext();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isLightboxOpen, handlePrevious, handleNext]);

	const selectedImage = images[selectedIndex];

	return (
		<div className="w-full max-w-4xl mx-auto">
			{/* Main Image Container */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg group"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Main Image */}
				<div className="relative aspect-4/3 md:aspect-16/10 w-full bg-linear-to-br from-slate-50 to-slate-100">
					<AnimatePresence mode="wait">
						<motion.div
							key={selectedIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
						>
							<Image
								src={selectedImage}
								alt={`${productName} - ${selectedIndex + 1}`}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
								className="object-contain"
								priority={selectedIndex === 0}
							/>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Controls Overlay - Visible on Hover */}
				<div className="absolute inset-0 pointer-events-none">
					{/* Top Right Controls */}
					<div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						{/* Pause/Play Button */}
						{images.length > 1 && (
							<button
								onClick={() => setIsPaused(!isPaused)}
								className="p-2 sm:p-2.5 rounded-full bg-white/95 shadow-lg text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 cursor-pointer"
								aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
							>
								{isPaused ? (
									<Play className="h-4 w-4 sm:h-5 sm:w-5" />
								) : (
									<Pause className="h-4 w-4 sm:h-5 sm:w-5" />
								)}
							</button>
						)}

						{/* Zoom Button */}
						<button
							onClick={() => setIsLightboxOpen(true)}
							className="p-2 sm:p-2.5 rounded-full bg-white/95 shadow-lg text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 cursor-pointer"
							aria-label="Zoom image"
						>
							<ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
						</button>
					</div>

					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={handlePrevious}
								className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/95 shadow-lg text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 cursor-pointer pointer-events-auto"
								aria-label="Previous image"
							>
								<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
							</button>
							<button
								onClick={handleNext}
								className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/95 shadow-lg text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 cursor-pointer pointer-events-auto"
								aria-label="Next image"
							>
								<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
							</button>
						</>
					)}

					{/* Progress Dots */}
					{images.length > 1 && (
						<div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setSelectedIndex(index)}
									className={`rounded-full transition-all duration-300 cursor-pointer ${
										index === selectedIndex
											? "w-6 sm:w-8 h-2 bg-primary shadow-md"
											: "w-2 h-2 bg-slate-300 hover:bg-slate-400"
									}`}
									aria-label={`Go to image ${index + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			</motion.div>

			{/* Thumbnails - Horizontal Row */}
			{images.length > 1 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mt-4 flex justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 px-2"
				>
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedIndex(index)}
							className={`
								relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-lg sm:rounded-xl
								transition-all duration-300 cursor-pointer border-2
								${
									index === selectedIndex
										? "border-primary ring-2 ring-primary/20 shadow-md scale-105"
										: "border-slate-200 hover:border-primary/50 opacity-70 hover:opacity-100"
								}
							`}
							aria-label={`View image ${index + 1}`}
						>
							<Image
								src={image}
								alt={`${productName} thumbnail ${index + 1}`}
								fill
								sizes="80px"
								className="object-cover"
							/>
						</button>
					))}
				</motion.div>
			)}

			{/* Lightbox Modal */}
			<AnimatePresence>
				{isLightboxOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
						onClick={() => setIsLightboxOpen(false)}
					>
						{/* Close Button */}
						<button
							onClick={() => setIsLightboxOpen(false)}
							className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
							aria-label="Close lightbox"
						>
							<X className="h-6 w-6" />
						</button>

						{/* Lightbox Image */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<Image
								src={selectedImage}
								alt={`${productName} - ${selectedIndex + 1}`}
								fill
								sizes="100vw"
								className="object-contain"
								priority
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
									className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
									aria-label="Previous image"
								>
									<ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleNext();
									}}
									className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
									aria-label="Next image"
								>
									<ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
								</button>
							</>
						)}

						{/* Image Counter in Lightbox */}
						{images.length > 1 && (
							<div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium text-white z-20">
								{selectedIndex + 1} / {images.length}
							</div>
						)}

						{/* Lightbox Thumbnails */}
						{images.length > 1 && (
							<div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
								{images.map((image, index) => (
									<button
										key={index}
										onClick={(e) => {
											e.stopPropagation();
											setSelectedIndex(index);
										}}
										className={`
											relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
											${
												index === selectedIndex
													? "border-white scale-110"
													: "border-white/30 opacity-60 hover:opacity-100"
											}
										`}
									>
										<Image
											src={image}
											alt={`Thumbnail ${index + 1}`}
											fill
											sizes="56px"
											className="object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
