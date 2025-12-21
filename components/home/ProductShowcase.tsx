"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ImageComponent } from "../common/image-component";
import type { IProductShowcaseSection } from "@/models/home-page.model";

interface ProductShowcaseProps {
	data: IProductShowcaseSection;
}

export function ProductShowcase({ data }: ProductShowcaseProps) {
	// Filter out products without required data
	const validProducts = (data?.products ?? []).filter(
		(p) => p.name && p.image && p.description
	);

	if (validProducts.length === 0) return null;

	return (
		<section className="section-padding bg-white">
			<div className="_container ">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
					<div className="max-w-2xl">
						{data?.title && (
							<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
								{data.title}
							</h2>
						)}
						{data?.subtitle && (
							<p className="text-slate-600 text-lg">{data.subtitle}</p>
						)}
					</div>
					{data?.ctaText && data?.ctaHref && (
						<Button
							variant="outline"
							className="hidden md:flex gap-2"
							asChild
						>
							<Link href={data.ctaHref}>
								{data.ctaText} <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					)}
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{validProducts.map((product, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className="bg-white group overflow-hidden border-border/10 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
								{/* Image Area */}
								<div className="relative h-64 overflow-hidden bg-secondary/50">
									{product.image && (
										<ImageComponent
											src={product.image}
											alt={product.name || "Product"}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											loading={index === 0 ? "eager" : "lazy"}
											height={0}
											width={0}
											sizes={
												index === 0
													? "(max-width: 768px) 100vw, 50vw"
													: "100vw"
											}
											wrapperClasses="w-full h-full"
										/>
									)}

									{product.category && (
										<div className="absolute top-4 right-4">
											<Badge
												variant="secondary"
												className="bg-secondary/50 backdrop-blur-sm text-slate-200 font-medium"
											>
												{product.category}
											</Badge>
										</div>
									)}
								</div>

								{/* Content */}
								<CardContent className="pt-6 grow">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
											{product.name}
										</h3>
									</div>
									{product.description && (
										<p className="text-slate-600 text-sm mb-4">
											{product.description}
										</p>
									)}
									{product.status && (
										<div className="flex items-center gap-2 text-sm font-medium">
											<span
												className={
													product.status === "In Stock"
														? "text-green-500"
														: "text-orange-500"
												}
											>
												● {product.status}
											</span>
										</div>
									)}
								</CardContent>

								{/* Footer */}
								<CardFooter className="border-t border-border/10 pt-4 flex justify-between items-center">
									<Link
										href={
											product.href ||
											`/produkter/${(product.name || "product")
												.toLowerCase()
												.replace(/\s+/g, "-")}`
										}
										className="text-primary hover:text-primary-hover hover:bg-primary/10 flex items-center border border-slate-200 px-5 py-1 rounded-xl"
									>
										Details <ArrowRight className="ml-1 h-4 w-4" />
									</Link>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Mobile View All Button */}
				{data?.ctaText && data?.ctaHref && (
					<div className="mt-8 text-center md:hidden">
						<Button variant="outline" className="w-full" asChild>
							<Link href={data.ctaHref}>
								{data.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
