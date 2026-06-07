"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import { EyebrowTag } from "./EyebrowTag";
import { NumberMark } from "./NumberMark";

export interface GridFeatureItem {
	icon: LucideIcon;
	title: string;
	description: string;
}

export type SectionCorners = "top" | "middle" | "bottom" | "all";

const cornerClassMap: Record<SectionCorners, string> = {
	top: "rounded-t-3xl rounded-b-none",
	middle: "rounded-none",
	bottom: "rounded-b-3xl rounded-t-none",
	all: "rounded-3xl",
};

export interface ProductFeatureGridProps {
	eyebrow?: string;
	heading: string;
	description?: string;
	features: GridFeatureItem[]; // 4 items recommended
	image: string;
	imageAlt?: string;
	bottomBlock?: {
		sectionNumber: string;
		title: string;
		description?: string;
		items: GridFeatureItem[]; // 3 items recommended
	};
	corners?: SectionCorners;
}

/**
 * Section 3 — "Tekniska fördelar som märks i vardagen" pattern
 */
export function ProductFeatureGrid({
	eyebrow,
	heading,
	description,
	features,
	image,
	imageAlt,
	bottomBlock,
	corners = "all",
}: ProductFeatureGridProps) {
	return (
		<section>
			<div className="_container">
				<div className={`${cornerClassMap[corners]} py-6 sm:py-10 lg:py-16`}>
					{/* Top block */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch"
					>
						<div className="relative w-full lg:h-full">
							<div
								className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden rounded-xl"
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
									className="object-cover"
									wrapperClasses="w-full h-full"
								/>
							</div>
						</div>

						<div>
							{eyebrow && <EyebrowTag className="mb-5">{eyebrow}</EyebrowTag>}
							<h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold tracking-tight text-secondary leading-[1.15] mb-4">
								{heading}
							</h2>
							{description && (
								<p className="text-[14px] sm:text-[15px] leading-relaxed text-slate-600 mb-6 lg:mb-8 max-w-[480px]">
									{description}
								</p>
							)}

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								{features.map((feature, idx) => {
									const Icon = feature.icon;
									return (
										<div
											key={idx}
											className="group flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white ring-1 ring-slate-200 hover:ring-primary/50 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(220,167,131,0.30)] transition-all duration-300"
										>
											<div className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-slate-100">
												<Icon
													strokeWidth={1.5}
													className="h-6 w-6 sm:h-10 sm:w-10 text-[#98a7b5]"
												/>
											</div>
											<div className="min-w-0 overflow-hidden">
												<h3 className="text-xs sm:text-[15px] font-semibold text-secondary mb-1 leading-snug break-words">
													{feature.title}
												</h3>
												<p className="text-[10px] sm:text-[12.5px] leading-relaxed text-slate-600 break-words">
													{feature.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</motion.div>

					{/* Bottom block — huge number + horizontal features */}
					{bottomBlock && (
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-80px" }}
							transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
							className="mt-8 lg:mt-10 border-t border-slate-200/80 pt-6 lg:pt-8"
						>
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
								<div className="lg:col-span-5 flex items-start gap-5 sm:gap-6">
									<NumberMark
										number={bottomBlock.sectionNumber}
										variant="huge"
										className="shrink-0 -mt-2"
									/>
									<div className="flex-1 min-w-0 pt-1">
										<h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-semibold tracking-tight text-secondary leading-[1.2] mb-3">
											{bottomBlock.title}
										</h3>
										{bottomBlock.description && (
											<p className="text-sm leading-relaxed text-slate-600 max-w-[360px]">
												{bottomBlock.description}
											</p>
										)}
									</div>
								</div>

								<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-8 items-start">
									{bottomBlock.items.map((item, idx) => {
										const Icon = item.icon;
										return (
											<div key={idx} className="flex flex-col">
												<Icon
													strokeWidth={1.5}
													className="h-7 w-7 text-slate-700 mb-3.5"
												/>
												<h4 className="text-base font-semibold text-secondary mb-1.5 leading-snug">
													{item.title}
												</h4>
												<p className="text-[13px] leading-relaxed text-slate-600">
													{item.description}
												</p>
											</div>
										);
									})}
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
