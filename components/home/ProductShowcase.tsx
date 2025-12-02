"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ImageComponent } from "../common/image-component";

// Dummy Data
const products = [
	{
		id: 1,
		name: "Advanced MRI Scanner X1",
		category: "Imaging",
		// price: "$125,000",
		status: "In Stock",
		image: "https://plus.unsplash.com/premium_photo-1678376871157-6cebdd957e22?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 2,
		name: "Precision Surgical Robot",
		category: "Robotics",
		// price: "$450,000",
		status: "Pre-order",
		image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 3,
		name: "Vital Signs Monitor Pro",
		category: "Monitoring",
		// price: "$2,500",
		status: "In Stock",
		image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800", // Using a generic medical tech image as fallback for specific monitor
	},
	{
		id: 4,
		name: "Anesthesia Workstation",
		category: "Surgical",
		// price: "$18,000",
		status: "Low Stock",
		image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 5,
		name: "Ultrasound System 4D",
		category: "Imaging",
		// price: "$45,000",
		status: "In Stock",
		image: "https://images.unsplash.com/photo-1648224395352-812a6ce3431c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		id: 6,
		name: "Digital X-Ray System",
		category: "Imaging",
		// price: "$85,000",
		status: "In Stock",
		image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
	},
];

export function ProductShowcase() {
	return (
		<section className="section-padding bg-white">
			<div className="_container ">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
					<div className="max-w-2xl">
						<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
							Premium Medical Equipment
						</h2>
						<p className="text-slate-600 text-lg">
							Explore our catalog of certified, high-performance medical
							devices designed for modern healthcare facilities.
						</p>
					</div>
					<Button variant="outline" className="hidden md:flex gap-2">
						View Full Catalog <ArrowRight className="h-4 w-4" />
					</Button>
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{products.map((product, index) => (
						<motion.div
							key={product.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className="bg-white group overflow-hidden border-border/10 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
								{/* Image Area */}
								<div className="relative h-64 overflow-hidden bg-secondary/50">
									<ImageComponent
										src={product.image}
										alt={product.name}
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

									<div className="absolute top-4 right-4">
										<Badge
											variant="secondary"
											className="bg-secondary/50 backdrop-blur-sm text-slate-200 font-medium"
										>
											{product.category}
										</Badge>
									</div>
								</div>

								{/* Content */}
								<CardContent className="pt-6 grow">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
											{product.name}
										</h3>
									</div>
									<p className="text-slate-600 text-sm mb-4">
										Professional grade equipment with extended
										warranty options.
									</p>
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
								</CardContent>

								{/* Footer */}
								<CardFooter className="border-t border-border/10 pt-4 flex justify-between items-center">
									{/* <span className="text-lg font-bold text-secondary">
										{product.price}
									</span> */}
									<Link
										href={`/produkter/${product.name
											.toLowerCase()
											.replace(/\s+/g, "-")}`}
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
				<div className="mt-8 text-center md:hidden">
					<Button variant="outline" className="w-full">
						View Full Catalog <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</section>
	);
}
