"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import { EyebrowTag } from "./EyebrowTag";
import { NumberMark } from "./NumberMark";

export interface NumberedListItem {
	icon: LucideIcon;
	title: string;
	description: string;
}

export interface IconFeatureItem {
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

export interface ProductFeatureImageListProps {
	eyebrow?: string;
	heading: string;
	description?: string;
	topBlock: {
		image: string;
		imageAlt?: string;
		items: NumberedListItem[];
	};
	bottomBlock: {
		sectionNumber: string;
		title: string;
		description?: string;
		items: IconFeatureItem[];
		image: string;
		imageAlt?: string;
	};
	corners?: SectionCorners;
}

/**
 * Section 2 — "Utvecklad för precision och komfort" pattern
 */
export function ProductFeatureImageList({
	eyebrow,
	heading,
	description,
	topBlock,
	bottomBlock,
	corners = "all",
}: ProductFeatureImageListProps) {
	return (
		<section>
			<div className="_container">
				<div className={`${cornerClassMap[corners]} py-6 sm:py-10 lg:py-16`}>
					{/* Header — centered */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
					>
						{eyebrow && <EyebrowTag className="mb-6">{eyebrow}</EyebrowTag>}
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-secondary leading-[1.15] mb-5">
							{heading}
						</h2>
						{description && (
							<p className="text-[15px] sm:text-base leading-relaxed text-slate-600 max-w-[640px] mx-auto">
								{description}
							</p>
						)}
					</motion.div>

					{/* Top block: image left + numbered list right */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
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
									src={topBlock.image}
									alt={topBlock.imageAlt ?? heading}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
									wrapperClasses="w-full h-full"
								/>
							</div>
						</div>

						<ul className="space-y-7 sm:space-y-8">
							{topBlock.items.slice(0, 4).map((item, idx) => {
								const Icon = item.icon;
								return (
									<li key={idx} className="flex items-start gap-4 sm:gap-5">
										{idx === 0 ? (
											<div className="shrink-0 flex items-center justify-center">
												<NumberMark number="01" variant="inline" />
											</div>
										) : (
											<div className="shrink-0 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#98a7b5]/15 text-[#98a7b5]">
												<Icon strokeWidth={1.5} className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
											</div>
										)}
										<div className="min-w-0 flex-1">
											<h3 className="text-base sm:text-lg font-semibold text-secondary leading-snug mb-2">
												{item.title}
											</h3>
											<p className="text-sm leading-relaxed text-slate-600">
												{item.description}
											</p>
										</div>
									</li>
								);
							})}
						</ul>
					</motion.div>

					{/* Bottom block: features left + lifestyle image right */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
						className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch"
					>
						<div className="order-2 lg:order-1">
							<div className="flex items-start gap-4 mb-8">
								<NumberMark
									number={bottomBlock.sectionNumber}
									variant="inline"
									className="shrink-0"
								/>
								<div className="flex-1 min-w-0">
									<h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-semibold tracking-tight text-secondary leading-[1.15] mb-3">
										{bottomBlock.title}
									</h3>
									{bottomBlock.description && (
										<p className="text-[15px] sm:text-base leading-relaxed text-slate-600 max-w-[520px]">
											{bottomBlock.description}
										</p>
									)}
								</div>
							</div>
							<ul className="space-y-6">
								{bottomBlock.items.map((item, idx) => {
									const Icon = item.icon;
									return (
										<li key={idx} className="flex items-start gap-4">
											<div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#98a7b5]/15 text-[#98a7b5] mt-0.5">
												<Icon strokeWidth={1.5} className="h-[18px] w-[18px]" />
											</div>
											<div className="min-w-0">
												<h4 className="text-base font-semibold text-secondary leading-snug mb-1.5">
													{item.title}
												</h4>
												<p className="text-sm leading-relaxed text-slate-600">
													{item.description}
												</p>
											</div>
										</li>
									);
								})}
							</ul>
						</div>

						<div className="relative w-full lg:h-full order-1 lg:order-2">
							<div
								className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden rounded-xl"
								style={{
									background:
										"radial-gradient(ellipse 75% 80% at 50% 55%, #c6cad3 0%, #d8dbe2 35%, #e6e7ec 70%, #eeedf2 100%)",
								}}
							>
								<ImageComponent
									src={bottomBlock.image}
									alt={bottomBlock.imageAlt ?? bottomBlock.title}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
									wrapperClasses="w-full h-full"
								/>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
