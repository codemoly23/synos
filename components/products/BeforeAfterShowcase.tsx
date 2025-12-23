"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	X,
	Columns2,
	SplitSquareHorizontal,
	Maximize2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { BeforeAfterImage } from "@/types";

interface BeforeAfterShowcaseProps {
	pairs: BeforeAfterImage[];
	productName: string;
}

type ViewMode = "slider" | "side-by-side";

/**
 * BeforeAfterShowcase Component
 *
 * Modern before/after image comparison with:
 * - Draggable slider mode
 * - Side-by-side toggle option
 * - Multiple pairs carousel navigation
 * - Fullscreen lightbox with slider
 * - Smooth animations
 * - Touch/mobile support
 */
export function BeforeAfterShowcase({
	pairs,
	productName,
}: BeforeAfterShowcaseProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [viewMode, setViewMode] = useState<ViewMode>("slider");
	const [sliderPosition, setSliderPosition] = useState(50);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [lightboxSliderPosition, setLightboxSliderPosition] = useState(50);
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const lightboxContainerRef = useRef<HTMLDivElement>(null);

	const currentPair = pairs[selectedIndex];

	// Handle slider drag
	const handleSliderMove = useCallback(
		(clientX: number, container: HTMLDivElement | null, isLightbox = false) => {
			if (!container) return;

			const rect = container.getBoundingClientRect();
			const x = clientX - rect.left;
			const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

			if (isLightbox) {
				setLightboxSliderPosition(percentage);
			} else {
				setSliderPosition(percentage);
			}
		},
		[]
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, isLightbox = false) => {
			e.preventDefault();
			setIsDragging(true);
			const container = isLightbox
				? lightboxContainerRef.current
				: containerRef.current;
			handleSliderMove(e.clientX, container, isLightbox);
		},
		[handleSliderMove]
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;
			// Check if we're in lightbox mode
			if (isLightboxOpen) {
				handleSliderMove(e.clientX, lightboxContainerRef.current, true);
			} else {
				handleSliderMove(e.clientX, containerRef.current, false);
			}
		},
		[isDragging, isLightboxOpen, handleSliderMove]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Touch handlers
	const handleTouchStart = useCallback(
		(e: React.TouchEvent, isLightbox = false) => {
			setIsDragging(true);
			const container = isLightbox
				? lightboxContainerRef.current
				: containerRef.current;
			handleSliderMove(e.touches[0].clientX, container, isLightbox);
		},
		[handleSliderMove]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!isDragging) return;
			if (isLightboxOpen) {
				handleSliderMove(
					e.touches[0].clientX,
					lightboxContainerRef.current,
					true
				);
			} else {
				handleSliderMove(e.touches[0].clientX, containerRef.current, false);
			}
		},
		[isDragging, isLightboxOpen, handleSliderMove]
	);

	// Event listeners
	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("touchmove", handleTouchMove);
			window.addEventListener("touchend", handleMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

	// Keyboard navigation for lightbox
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isLightboxOpen) {
				if (e.key === "Escape") setIsLightboxOpen(false);
				if (e.key === "ArrowLeft" && pairs.length > 1) {
					setSelectedIndex((prev) =>
						prev === 0 ? pairs.length - 1 : prev - 1
					);
				}
				if (e.key === "ArrowRight" && pairs.length > 1) {
					setSelectedIndex((prev) =>
						prev === pairs.length - 1 ? 0 : prev + 1
					);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isLightboxOpen, pairs.length]);

	// Sync lightbox slider position when opening
	useEffect(() => {
		if (isLightboxOpen) {
			setLightboxSliderPosition(sliderPosition);
		}
	}, [isLightboxOpen, sliderPosition]);

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? pairs.length - 1 : prev - 1));
		setSliderPosition(50);
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === pairs.length - 1 ? 0 : prev + 1));
		setSliderPosition(50);
	};

	// Slider comparison component
	const SliderComparison = ({
		beforeImage,
		afterImage,
		position,
		onMouseDown,
		onTouchStart,
		containerRef: ref,
		isLightbox = false,
	}: {
		beforeImage: string;
		afterImage: string;
		position: number;
		onMouseDown: (e: React.MouseEvent) => void;
		onTouchStart: (e: React.TouchEvent) => void;
		containerRef: React.RefObject<HTMLDivElement | null>;
		isLightbox?: boolean;
	}) => (
		<div
			ref={ref}
			className={cn(
				"relative w-full overflow-hidden select-none",
				isLightbox ? "h-full" : "aspect-[4/3] md:aspect-[16/10]"
			)}
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
		>
			{/* After Image (Base layer) */}
			<div className="absolute inset-0">
				<Image
					src={afterImage}
					alt="After"
					fill
					sizes={isLightbox ? "100vw" : "(max-width: 768px) 100vw, 800px"}
					className="object-cover"
					priority
				/>
				<div className="absolute bottom-4 right-4 bg-emerald-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wide shadow-lg">
					Efter
				</div>
			</div>

			{/* Before Image (Clipped layer) */}
			<div
				className="absolute inset-0 overflow-hidden"
				style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
			>
				<Image
					src={beforeImage}
					alt="Before"
					fill
					sizes={isLightbox ? "100vw" : "(max-width: 768px) 100vw, 800px"}
					className="object-cover"
					priority
				/>
				<div className="absolute bottom-4 left-4 bg-slate-800/90 text-white text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wide shadow-lg">
					Före
				</div>
			</div>

			{/* Slider Handle */}
			<div
				className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] cursor-ew-resize z-10"
				style={{ left: `${position}%`, transform: "translateX(-50%)" }}
			>
				{/* Handle Circle */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
					<div className="flex items-center gap-0.5">
						<ChevronLeft className="h-4 w-4 text-slate-600" />
						<ChevronRight className="h-4 w-4 text-slate-600" />
					</div>
				</div>
			</div>

			{/* Instruction overlay (shows briefly) */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="bg-black/50 text-white text-sm px-4 py-2 rounded-full opacity-0 animate-[fadeInOut_3s_ease-in-out]">
					Dra för att jämföra
				</div>
			</div>
		</div>
	);

	// Side by side comparison
	const SideBySideComparison = ({
		beforeImage,
		afterImage,
		isLightbox = false,
	}: {
		beforeImage: string;
		afterImage: string;
		isLightbox?: boolean;
	}) => (
		<div
			className={cn(
				"grid grid-cols-2 gap-2 md:gap-4 w-full",
				isLightbox ? "h-full" : ""
			)}
		>
			{/* Before */}
			<div
				className={cn(
					"relative overflow-hidden rounded-lg md:rounded-xl",
					isLightbox ? "h-full" : "aspect-[4/3]"
				)}
			>
				<Image
					src={beforeImage}
					alt="Before"
					fill
					sizes={isLightbox ? "50vw" : "(max-width: 768px) 50vw, 400px"}
					className="object-cover"
					priority
				/>
				<div className="absolute bottom-3 left-3 bg-slate-800/90 text-white text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wide shadow-lg">
					Före
				</div>
			</div>

			{/* After */}
			<div
				className={cn(
					"relative overflow-hidden rounded-lg md:rounded-xl",
					isLightbox ? "h-full" : "aspect-[4/3]"
				)}
			>
				<Image
					src={afterImage}
					alt="After"
					fill
					sizes={isLightbox ? "50vw" : "(max-width: 768px) 50vw, 400px"}
					className="object-cover"
					priority
				/>
				<div className="absolute bottom-3 right-3 bg-emerald-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wide shadow-lg">
					Efter
				</div>
			</div>
		</div>
	);

	if (!pairs || pairs.length === 0) return null;

	return (
		<motion.section
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6 }}
			className="mb-12"
			id="before-after"
		>
			{/* Section Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<h2 className="text-2xl md:text-3xl font-bold text-secondary">
					Före & Efter
				</h2>

				{/* View Mode Toggle */}
				<div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
					<button
						onClick={() => setViewMode("slider")}
						className={cn(
							"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
							viewMode === "slider"
								? "bg-white text-secondary shadow-sm"
								: "text-slate-600 hover:text-secondary"
						)}
					>
						<SplitSquareHorizontal className="h-4 w-4" />
						<span className="hidden sm:inline">Jämför</span>
					</button>
					<button
						onClick={() => setViewMode("side-by-side")}
						className={cn(
							"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
							viewMode === "side-by-side"
								? "bg-white text-secondary shadow-sm"
								: "text-slate-600 hover:text-secondary"
						)}
					>
						<Columns2 className="h-4 w-4" />
						<span className="hidden sm:inline">Sida vid sida</span>
					</button>
				</div>
			</div>

			{/* Main Comparison Container */}
			<div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg group">
				<AnimatePresence mode="wait">
					<motion.div
						key={`${selectedIndex}-${viewMode}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{viewMode === "slider" ? (
							<SliderComparison
								beforeImage={currentPair.beforeImage}
								afterImage={currentPair.afterImage}
								position={sliderPosition}
								onMouseDown={(e) => handleMouseDown(e, false)}
								onTouchStart={(e) => handleTouchStart(e, false)}
								containerRef={containerRef}
							/>
						) : (
							<div className="p-4">
								<SideBySideComparison
									beforeImage={currentPair.beforeImage}
									afterImage={currentPair.afterImage}
								/>
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Fullscreen Button */}
				<button
					onClick={() => setIsLightboxOpen(true)}
					className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 shadow-lg text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 z-20"
					aria-label="Open fullscreen"
				>
					<Maximize2 className="h-5 w-5" />
				</button>

				{/* Label Badge */}
				{currentPair.label && (
					<div className="absolute top-4 left-4 bg-white/95 text-slate-800 text-sm px-4 py-2 rounded-full font-medium shadow-lg z-20">
						{currentPair.label}
					</div>
				)}
			</div>

			{/* Navigation for Multiple Pairs */}
			{pairs.length > 1 && (
				<div className="mt-6">
					{/* Navigation Arrows + Thumbnails */}
					<div className="flex items-center justify-center gap-4">
						<button
							onClick={handlePrevious}
							className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
							aria-label="Previous pair"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>

						{/* Thumbnails */}
						<div className="flex items-center gap-3 overflow-x-auto pb-1 px-2">
							{pairs.map((pair, index) => (
								<button
									key={index}
									onClick={() => {
										setSelectedIndex(index);
										setSliderPosition(50);
									}}
									className={cn(
										"relative shrink-0 rounded-lg overflow-hidden transition-all cursor-pointer border-2",
										index === selectedIndex
											? "border-primary ring-2 ring-primary/20 scale-105"
											: "border-slate-200 opacity-60 hover:opacity-100"
									)}
								>
									<div className="w-16 h-16 md:w-20 md:h-20 grid grid-cols-2">
										<div className="relative">
											<Image
												src={pair.beforeImage}
												alt={`Before ${index + 1}`}
												fill
												sizes="40px"
												className="object-cover"
											/>
										</div>
										<div className="relative">
											<Image
												src={pair.afterImage}
												alt={`After ${index + 1}`}
												fill
												sizes="40px"
												className="object-cover"
											/>
										</div>
									</div>
									{pair.label && (
										<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
											{pair.label}
										</div>
									)}
								</button>
							))}
						</div>

						<button
							onClick={handleNext}
							className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
							aria-label="Next pair"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					</div>

					{/* Counter */}
					<div className="text-center mt-3 text-sm text-muted-foreground">
						{selectedIndex + 1} / {pairs.length}
					</div>
				</div>
			)}

			{/* Lightbox Modal */}
			<AnimatePresence>
				{isLightboxOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/95 flex flex-col"
						onClick={() => setIsLightboxOpen(false)}
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 z-20">
							{/* View Mode Toggle in Lightbox */}
							<div className="flex items-center gap-2 p-1 bg-white/10 rounded-lg">
								<button
									onClick={(e) => {
										e.stopPropagation();
										setViewMode("slider");
									}}
									className={cn(
										"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
										viewMode === "slider"
											? "bg-white text-slate-800"
											: "text-white/70 hover:text-white"
									)}
								>
									<SplitSquareHorizontal className="h-4 w-4" />
									<span className="hidden sm:inline">Jämför</span>
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setViewMode("side-by-side");
									}}
									className={cn(
										"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
										viewMode === "side-by-side"
											? "bg-white text-slate-800"
											: "text-white/70 hover:text-white"
									)}
								>
									<Columns2 className="h-4 w-4" />
									<span className="hidden sm:inline">Sida vid sida</span>
								</button>
							</div>

							{/* Close Button */}
							<button
								onClick={() => setIsLightboxOpen(false)}
								className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
								aria-label="Close lightbox"
							>
								<X className="h-6 w-6" />
							</button>
						</div>

						{/* Main Content */}
						<div
							className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="w-full max-w-5xl h-full max-h-[70vh]">
								{viewMode === "slider" ? (
									<div className="relative h-full rounded-xl overflow-hidden">
										<SliderComparison
											beforeImage={currentPair.beforeImage}
											afterImage={currentPair.afterImage}
											position={lightboxSliderPosition}
											onMouseDown={(e) => handleMouseDown(e, true)}
											onTouchStart={(e) => handleTouchStart(e, true)}
											containerRef={lightboxContainerRef}
											isLightbox
										/>
									</div>
								) : (
									<SideBySideComparison
										beforeImage={currentPair.beforeImage}
										afterImage={currentPair.afterImage}
										isLightbox
									/>
								)}
							</div>
						</div>

						{/* Label */}
						{currentPair.label && (
							<div className="text-center pb-2">
								<span className="bg-white/10 text-white text-sm px-4 py-2 rounded-full">
									{currentPair.label}
								</span>
							</div>
						)}

						{/* Navigation in Lightbox */}
						{pairs.length > 1 && (
							<>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handlePrevious();
									}}
									className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
									aria-label="Previous pair"
								>
									<ChevronLeft className="h-8 w-8" />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleNext();
									}}
									className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
									aria-label="Next pair"
								>
									<ChevronRight className="h-8 w-8" />
								</button>

								{/* Lightbox Thumbnails */}
								<div className="flex justify-center gap-2 pb-6 px-4">
									{pairs.map((pair, index) => (
										<button
											key={index}
											onClick={(e) => {
												e.stopPropagation();
												setSelectedIndex(index);
												setSliderPosition(50);
												setLightboxSliderPosition(50);
											}}
											className={cn(
												"relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
												index === selectedIndex
													? "border-white scale-110"
													: "border-white/30 opacity-60 hover:opacity-100"
											)}
										>
											<div className="grid grid-cols-2 h-full">
												<div className="relative">
													<Image
														src={pair.beforeImage}
														alt={`Thumbnail before ${index + 1}`}
														fill
														sizes="28px"
														className="object-cover"
													/>
												</div>
												<div className="relative">
													<Image
														src={pair.afterImage}
														alt={`Thumbnail after ${index + 1}`}
														fill
														sizes="28px"
														className="object-cover"
													/>
												</div>
											</div>
										</button>
									))}
								</div>
							</>
						)}

						{/* Counter in Lightbox */}
						{pairs.length > 1 && (
							<div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium text-white z-20">
								{selectedIndex + 1} / {pairs.length}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			<style jsx>{`
				@keyframes fadeInOut {
					0% {
						opacity: 0;
					}
					20% {
						opacity: 1;
					}
					80% {
						opacity: 1;
					}
					100% {
						opacity: 0;
					}
				}
			`}</style>
		</motion.section>
	);
}
