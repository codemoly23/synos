"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowRight, Sparkles } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, floating } from "@/lib/animations";

/**
 * 404 Not Found Page
 *
 * Modern, eye-catching error page with glassmorphism design.
 * Uses hardcoded colors from Synos Medical design system.
 * Colors: Primary #0C2C46, Accent #00949E, Accent Hover #007A82
 */
export default function NotFound() {
	return (
		<div className="min-h-screen relative flex items-center justify-center px-4 padding-top pb-12 overflow-hidden ">
			{/* Gradient Background */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ccfbf1 100%)",
				}}
			/>

			{/* Animated Background Orbs */}
			<motion.div
				variants={floating}
				initial="initial"
				animate="animate"
				className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full opacity-30 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, #00949E 0%, transparent 70%)",
				}}
			/>
			<motion.div
				variants={floating}
				initial="initial"
				animate="animate"
				transition={{ delay: 0.5, duration: 8 }}
				className="absolute bottom-20 left-[10%] w-[350px] h-[350px] rounded-full opacity-20 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, #0C2C46 0%, transparent 70%)",
				}}
			/>
			<motion.div
				variants={floating}
				initial="initial"
				animate="animate"
				transition={{ delay: 1, duration: 7 }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, #00949E 0%, transparent 70%)",
				}}
			/>

			{/* Main Content */}
			<div className="max-w-5xl mx-auto text-center relative z-10">
				<motion.div
					initial="initial"
					animate="animate"
					variants={staggerContainer}
					className="space-y-8"
				>
					{/* Floating Icon Badge */}
					<motion.div
						variants={scaleIn}
						className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-4 relative"
						style={{
							background:
								"linear-gradient(135deg, rgba(0, 148, 158, 0.1) 0%, rgba(12, 44, 70, 0.05) 100%)",
							border: "2px solid rgba(0, 148, 158, 0.2)",
							boxShadow: "0 8px 32px rgba(0, 148, 158, 0.15)",
						}}
					>
						<Search className="h-14 w-14" style={{ color: "#00949E" }} />
						<motion.div
							animate={{ rotate: 360 }}
							transition={{
								duration: 20,
								repeat: Infinity,
								ease: "linear",
							}}
							className="absolute inset-0 rounded-3xl"
							style={{
								background:
									"conic-gradient(from 0deg, transparent 0%, rgba(0, 148, 158, 0.1) 50%, transparent 100%)",
							}}
						/>
					</motion.div>

					{/* 404 Number with Gradient */}
					<motion.div variants={fadeUp}>
						<h1
							className="text-[10rem] md:text-[14rem] lg:text-[16rem] font-black select-none tracking-tighter leading-none mb-4"
							style={{
								background:
									"linear-gradient(135deg, rgba(12, 44, 70, 0.15) 0%, rgba(0, 148, 158, 0.15) 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							404
						</h1>
					</motion.div>

					{/* Main Glass Card */}
					<motion.div
						variants={fadeUp}
						className="relative rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl"
						style={{
							background: "rgba(255, 255, 255, 0.7)",
							backdropFilter: "blur(20px)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
							boxShadow:
								"0 20px 60px rgba(0, 148, 158, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
						}}
					>
						{/* Sparkle Icon */}
						<motion.div
							animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
							transition={{ duration: 3, repeat: Infinity }}
							className="inline-block mb-6"
						>
							<Sparkles
								className="h-8 w-8 md:h-10 md:w-10"
								style={{ color: "#00949E" }}
							/>
						</motion.div>

						<h2
							className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tight"
							style={{ color: "#0C2C46" }}
						>
							Sidan kunde inte hittas
						</h2>

						<p
							className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto font-medium mb-10 leading-relaxed"
							style={{ color: "rgba(12, 44, 70, 0.75)" }}
						>
							Tyvärr kunde vi inte hitta sidan du letar efter. Den kan ha
							flyttats eller tagits bort.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link
								href="/"
								className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 shadow-lg hover:shadow-xl"
								style={{
									background:
										"linear-gradient(135deg, #00949E 0%, #007A82 100%)",
									color: "#FFFFFF",
									boxShadow: "0 10px 30px rgba(0, 148, 158, 0.3)",
								}}
							>
								<Home className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
								Tillbaka till startsidan
								<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Link>

							<Link
								href="/kontakt"
								className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4"
								style={{
									background: "rgba(255, 255, 255, 0.9)",
									color: "#0C2C46",
									border: "2px solid rgba(12, 44, 70, 0.2)",
									boxShadow: "0 4px 20px rgba(12, 44, 70, 0.1)",
								}}
							>
								Kontakta oss
								<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Link>
						</div>
					</motion.div>

					{/* Quick Links Card */}
					<motion.div
						variants={fadeUp}
						className="rounded-2xl p-6 md:p-8 shadow-lg"
						style={{
							background: "rgba(255, 255, 255, 0.5)",
							backdropFilter: "blur(10px)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
						}}
					>
						<p
							className="text-sm font-bold mb-5 uppercase tracking-widest"
							style={{ color: "#0C2C46" }}
						>
							Populära sidor
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							{[
								{ href: "/produkter", label: "Produkter" },
								{ href: "/om-oss", label: "Om Oss" },
								{ href: "/utbildningar", label: "Utbildningar" },
								{ href: "/starta-eget", label: "Starta Eget" },
							].map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
									style={{
										background: "rgba(0, 148, 158, 0.1)",
										color: "#00949E",
										border: "1px solid rgba(0, 148, 158, 0.2)",
									}}
								>
									{link.label}
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							))}
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
