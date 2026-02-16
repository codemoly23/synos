"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageComponent } from "../common/image-component";
import type { IProductShowcaseSection } from "@/models/home-page.model";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

interface ProductShowcaseProps {
	data: IProductShowcaseSection;
}

export function ProductShowcase({ data }: ProductShowcaseProps) {
	// Filter out products without required data
	const validProducts = (data?.products ?? []).filter(
		(p) => p.name && p.image
	);

	if (validProducts.length === 0) return null;

	return (
		<section className="section-padding bg-white">
			<div className="_container">
				{/* Section Header */}
				<div className="flex justify-between items-end mb-8">
					<div>
						{data?.title && (
							<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
								{data.title}
							</h2>
						)}
						{data?.subtitle && (
							<p className="text-slate-600 text-base mt-2 max-w-xl">
								{data.subtitle}
							</p>
						)}
					</div>
					{data?.ctaText && data?.ctaHref && (
						<Link
							href={data.ctaHref}
							className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm whitespace-nowrap"
						>
							{data.ctaText}
							<ArrowRight className="h-4 w-4" />
						</Link>
					)}
				</div>
			</div>

			{/* Product Carousel */}
			<div className="_container">
				<Swiper
					modules={[Autoplay, FreeMode]}
					spaceBetween={20}
					slidesPerView={1.2}
					freeMode={{
						enabled: true,
						momentumRatio: 0.5,
					}}
					autoplay={{
						delay: 4000,
						disableOnInteraction: true,
						pauseOnMouseEnter: true,
					}}
					breakpoints={{
						480: { slidesPerView: 1.5, spaceBetween: 20 },
						640: { slidesPerView: 2.2, spaceBetween: 24 },
						1024: { slidesPerView: 3.2, spaceBetween: 28 },
						1280: { slidesPerView: 4, spaceBetween: 28 },
					}}
					className="overflow-visible!"
				>
					{validProducts.map((product, index) => (
						<SwiperSlide key={index} className="h-auto!">
							<Link
								href={
									product.href ||
									`/produkter/${(product.name || "product")
										.toLowerCase()
										.replace(/\s+/g, "-")}`
								}
								className="block h-full group"
							>
								{/* Card */}
								<div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
									{/* Image */}
									<div className="relative aspect-square overflow-hidden bg-slate-100 rounded-2xl">
										{product.image && (
											<>
												<ImageComponent
													src={product.image}
													alt={product.name || "Product"}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
													loading={index < 2 ? "eager" : "lazy"}
													height={0}
													width={0}
													sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
													wrapperClasses={`w-full h-full ${product.mobileImage ? "hidden md:block" : ""}`}
												/>
												{product.mobileImage && (
													<ImageComponent
														src={product.mobileImage}
														alt={product.name || "Product"}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
														loading={index < 2 ? "eager" : "lazy"}
														height={0}
														width={0}
														sizes="85vw"
														wrapperClasses="w-full h-full md:hidden"
													/>
												)}
											</>
										)}
									</div>

									{/* Content */}
									<div className="pt-4 pb-2 flex flex-col grow">
										{product.category && (
											<span className="text-primary text-xs font-semibold mb-1">
												{product.category}
											</span>
										)}
										<h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">
											{product.name}
										</h3>
										{product.description && (
											<p className="text-slate-500 text-sm mt-1 line-clamp-2">
												{product.description}
											</p>
										)}

										{/* Read more + arrow */}
										<div className="flex items-center justify-between mt-3">
											<span className="text-sm text-slate-500">
												Läs mer
											</span>
											<div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
												<ArrowRight className="h-4 w-4 text-white" />
											</div>
										</div>
									</div>
								</div>
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Mobile View All Button */}
			{data?.ctaText && data?.ctaHref && (
				<div className="_container mt-6 md:hidden">
					<Button variant="outline" className="w-full" asChild>
						<Link href={data.ctaHref}>
							{data.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			)}
		</section>
	);
}
