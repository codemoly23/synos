"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-slate-100 page-padding-top pb-16 lg:pb-32">
			<div className="z-10 absolute inset-0 bg-[url('/image.png')] opacity-5 bg-no-repeat bg-cover bg-center" />
			{/* Background Gradients */}
			{/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
				<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
				<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
			</div> */}

			<div className="relative z-20 container-width grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				{/* Left Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="flex flex-col gap-6 lg:gap-8 max-w-2xl"
				>
					{/* Trust Badge */}
					<div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-green-50 border border-green-200">
						<span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
						<span className="text-[10px] font-semibold text-accent uppercase leading-relaxed animate-pulse tracking-widest">
							Sveriges ledande leverantör av MDR-certifierad
							klinikutrustning
						</span>
					</div>

					{/* Heading */}
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary leading-[1.1] tracking-tight">
						Advanced Medical <br />
						<span className="text-gradient-accent sm:text-nowrap text-3xl sm:text-4xl">
							Equipment Solutions
						</span>
					</h1>

					{/* Description */}
					<p className="text-lg text-slate-600 leading-relaxed max-w-xl">
						Equip your facility with state-of-the-art medical technology.
						We provide certified, high-performance equipment designed for
						precision and patient care.
					</p>

					{/* Actions */}
					<div className="flex flex-wrap gap-4 pt-2">
						<Button
							size="lg"
							className="bg-accent hover:bg-accent-hover text-white rounded-full cursor-pointer px-8 h-12 text-base shadow-lg shadow-accent/20"
						>
							View Catalog
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="rounded-full px-8 h-12 text-base border-secondary/20 text-secondary hover:bg-secondary/5"
						>
							Contact Sales
						</Button>
					</div>

					{/* Trust Indicators */}
					<div className="flex items-center gap-6 pt-6 text-sm text-slate-600">
						<div className="flex items-center gap-2">
							<ShieldCheck className="h-5 w-5 text-success" />
							<span>FDA Approved</span>
						</div>
						<div className="flex items-center gap-2">
							<Star className="h-5 w-5 text-warning" />
							<span>Top Rated Support</span>
						</div>
					</div>
				</motion.div>

				{/* Right Content - Hybrid Image Grid */}
				<div className="relative h-[500px] lg:h-[600px] w-full hidden lg:block">
					{/* Main Image */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] z-10"
					>
						<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white">
							<Image
								fill
								src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								alt="Advanced MRI Machine"
								className="w-full h-full object-cover"
							/>
							{/* Overlay Gradient */}
							<div className="absolute inset-0 bg-linear-to-t from-secondary/40 to-transparent pointer-events-none" />
						</div>
					</motion.div>

					{/* Floating Detail Card 1 (Top Right) */}
					<motion.div
						initial={{ opacity: 0, y: 20, x: -20 }}
						animate={{ opacity: 1, y: 0, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="absolute top-[5%] right-[5%] w-45 h-48 z-20 hover:scale-[1.01] duration-300"
					>
						<div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/50 bg-white p-0">
							<div className="w-full h-full rounded-lg overflow-hidden relative">
								<Image
									fill
									src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400"
									alt="Medical Technology Detail"
									className="w-full h-full object-cover"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-sm p-2 text-center rounded-b-xl">
									<span className="text-xs font-medium text-white">
										Precision Optics
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Floating Detail Card 2 (Bottom Left) */}
					<motion.div
						initial={{ opacity: 0, y: -20, x: 20 }}
						animate={{ opacity: 1, y: 0, x: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="absolute bottom-[15%] left-[5%] w-64 h-auto z-20"
					>
						<div className="glass-card w-full rounded-xl p-4 flex flex-col gap-3 bg-white/90 backdrop-blur-md border-white/40 shadow-xl">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
									<ShieldCheck className="h-5 w-5 text-accent" />
								</div>
								<div>
									<div className="text-sm font-bold text-secondary">
										Certified Excellence
									</div>
									<div className="text-xs text-muted-foreground">
										ISO 13485 Compliant
									</div>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-xs mb-1">
									<span className="text-muted-foreground">
										Performance Score
									</span>
									<span className="font-bold text-secondary">
										99.8%
									</span>
								</div>
								<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
									<div className="h-full w-[99.8%] bg-accent rounded-full" />
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
