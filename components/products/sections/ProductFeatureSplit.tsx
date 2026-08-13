"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import { EyebrowTag } from "./EyebrowTag";
import { NumberMark } from "./NumberMark";

export interface NumberedFeature {
	icon: LucideIcon;
	title: string;
	description: string;
}

export interface BenefitChip {
	icon: LucideIcon;
	title: string;
	description?: string;
}

export type SectionCorners = "top" | "middle" | "bottom" | "all";

const cornerClassMap: Record<SectionCorners, string> = {
	top: "rounded-t-3xl rounded-b-none",
	middle: "rounded-none",
	bottom: "rounded-b-3xl rounded-t-none",
	all: "rounded-3xl",
};

export interface ProductFeatureSplitProps {
	eyebrow?: string;
	heading: string;
	paragraphs: string[];
	image: string;
	imageAlt?: string;
	numberedFeatures: NumberedFeature[];
	benefits?: BenefitChip[];
	corners?: SectionCorners;
}

/**
 * Section 1 — "Byggd för moderna kliniker" pattern
 */
export function ProductFeatureSplit({
	eyebrow,
	heading,
	paragraphs,
	image,
	imageAlt,
	numberedFeatures,
	benefits,
	corners = "all",
}: ProductFeatureSplitProps) {
	return (
		<section>
			<div className="_container">
				<div className={`${cornerClassMap[corners]} py-6 sm:py-10 lg:py-16`}>
					{/* Top split */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
					>
						<div>
							{eyebrow && <EyebrowTag className="mb-6">{eyebrow}</EyebrowTag>}
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-secondary leading-[1.15] mb-6">
								{heading}
							</h2>
							<div className="space-y-4 text-[15px] sm:text-base leading-relaxed text-slate-600 max-w-[520px]">
								{paragraphs.map((p, idx) => (
									<p key={idx}>{p}</p>
								))}
							</div>
						</div>

						<div className="relative w-full">
							<div
								className="relative aspect-[4/3] lg:aspect-[3/2] w-full overflow-hidden rounded-xl"
								style={{
									background:
										"radial-gradient(ellipse 75% 80% at 50% 55%, #c6cad3 0%, #d8dbe2 35%, #e6e7ec 70%, #eeedf2 100%)",
								}}
							>
								<ImageComponent
									src={image}
									alt={imageAlt ?? heading}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-contain"
									wrapperClasses="w-full h-full"
								/>
							</div>
						</div>
					</motion.div>

					{/* Numbered features row */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
						className="mt-8 lg:mt-10 border-t border-slate-200/80 pt-6 lg:pt-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
							{numberedFeatures.slice(0, 3).map((feature, idx) => {
								const Icon = feature.icon;
								const visibleCount = Math.min(
									numberedFeatures.length,
									3
								);
								const isFirst = idx === 0;
								const isLast = idx === visibleCount - 1;
								const colClasses = isFirst
									? "md:pr-8 lg:pr-12"
									: isLast
										? "md:pl-8 lg:pl-12 md:border-l md:border-slate-200"
										: "md:px-8 lg:px-12 md:border-l md:border-slate-200";
								return (
									<div
										key={idx}
										className={`flex flex-col ${colClasses}`}
									>
										<div className="flex items-center gap-4 mb-5">
											<NumberMark
												number={String(idx + 1).padStart(2, "0")}
												className="shrink-0"
											/>
											<Icon
												strokeWidth={1.5}
												className="h-7 w-7 text-slate-700"
											/>
										</div>
										<h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2.5 leading-snug">
											{feature.title}
										</h3>
										<p className="text-sm leading-relaxed text-slate-600">
											{feature.description}
										</p>
									</div>
								);
							})}
						</div>
					</motion.div>

					{/* Benefit chips */}
					{benefits && benefits.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-80px" }}
							transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
							className="mt-10 lg:mt-12"
						>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
								{benefits.map((b, idx) => {
									const Icon = b.icon;
									return (
										<div
											key={idx}
											className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 sm:p-5 rounded-xl bg-white ring-1 ring-slate-200 hover:ring-primary/50 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(220,167,131,0.25)] transition-all duration-300"
										>
											<div className="shrink-0 flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-100 mb-1 sm:mb-0">
												<Icon
													strokeWidth={1.5}
													className="h-5 w-5 sm:h-7 sm:w-7 text-[#98a7b5]"
												/>
											</div>
											<div className="min-w-0 w-full overflow-hidden">
												<h4 className="text-xs sm:text-sm font-semibold text-secondary leading-snug break-words">
													{b.title}
												</h4>
												{b.description && (
													<p className="text-[10px] sm:text-xs leading-relaxed text-slate-500 mt-1 break-words">
														{b.description}
													</p>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
