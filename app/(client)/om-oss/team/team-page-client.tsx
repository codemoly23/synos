"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Mail, Linkedin, Phone, Home, ChevronRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { Button } from "@/components/ui/button";
import type { TeamPageData } from "@/lib/repositories/team-page.repository";
import { ImageComponent } from "@/components/common/image-component";

interface TeamPageClientProps {
	data: TeamPageData;
}

export function TeamPageClient({ data }: TeamPageClientProps) {
	// Set navbar to dark-hero variant
	useSetNavbarVariant("dark-hero");

	const visibility = data.sectionVisibility || {
		hero: true,
		stats: true,
		teamMembers: true,
		values: true,
		joinUs: true,
		contact: true,
	};

	// Check if we have content to display
	const hasHero = data.hero?.badge || data.hero?.title || data.hero?.subtitle;
	const hasStats =
		data.stats && data.stats.filter((s) => s.value && s.label).length > 0;
	const hasTeamMembers =
		data.teamMembers &&
		data.teamMembers.filter((m) => m.name && m.role).length > 0;
	const hasValues =
		data.valuesSection?.title ||
		data.valuesSection?.subtitle ||
		(data.valuesSection?.values &&
			data.valuesSection.values.filter((v) => v.title).length > 0);
	const hasJoinUs =
		data.joinUs?.title ||
		data.joinUs?.description ||
		data.joinUs?.primaryCta?.text;
	const hasContact =
		data.contact?.title ||
		data.contact?.phone ||
		data.contact?.email;

	const validTeamMembers = (data.teamMembers || []).filter(
		(m) => m.name && m.role
	);
	const validStats = (data.stats || []).filter((s) => s.value && s.label);
	const validValues = (data.valuesSection?.values || []).filter(
		(v) => v.title
	);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Dark Hero Section */}
			{visibility.hero && hasHero && (
				<section className="relative overflow-hidden bg-secondary pt-32 pb-20 md:pt-36 md:pb-24">
					{/* Abstract Geometric Overlay */}
					<div className="absolute inset-0 opacity-10">
						<svg
							className="absolute top-0 left-0 w-full h-full"
							viewBox="0 0 1440 560"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid slice"
						>
							<motion.path
								d="M-100 300 Q 200 100, 400 300 T 800 300 T 1200 300 T 1600 300"
								stroke="currentColor"
								strokeWidth="1"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 0.6 }}
								transition={{ duration: 2, ease: "easeInOut" }}
							/>
							<motion.path
								d="M-100 350 Q 250 150, 500 350 T 900 350 T 1300 350 T 1700 350"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 0.4 }}
								transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
							/>
							<motion.path
								d="M-100 250 Q 150 50, 350 250 T 750 250 T 1150 250 T 1550 250"
								stroke="currentColor"
								strokeWidth="0.5"
								fill="none"
								className="text-primary"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 0.3 }}
								transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
							/>
						</svg>
					</div>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/80" />

					<div className="_container relative z-10">
						<motion.div
							initial="initial"
							animate="animate"
							variants={staggerContainer}
							className="max-w-4xl mx-auto text-center"
						>
							{/* Breadcrumb */}
							<motion.nav
								variants={fadeUp}
								className="mb-6 flex items-center justify-center gap-2 text-sm"
								aria-label="Breadcrumb"
							>
								<Link
									href="/"
									className="flex items-center gap-1 text-white/60 hover:text-primary transition-colors"
								>
									<Home className="h-4 w-4" />
									<span>Hem</span>
								</Link>
								<ChevronRight className="h-4 w-4 text-white/40" />
								<Link
									href="/om-oss"
									className="text-white/60 hover:text-primary transition-colors"
								>
									Om Oss
								</Link>
								<ChevronRight className="h-4 w-4 text-white/40" />
								<span className="text-white font-medium">Vårt Team</span>
							</motion.nav>

							{/* Badge */}
							{data.hero?.badge && (
								<motion.div
									variants={fadeUp}
									className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"
								>
									<Users className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium text-white">
										{data.hero.badge}
									</span>
								</motion.div>
							)}

							{/* Title */}
							{data.hero?.title && (
								<motion.h1
									variants={fadeUp}
									className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
								>
									{data.hero.title}
								</motion.h1>
							)}

							{/* Subtitle */}
							{data.hero?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="mt-4 text-lg text-white/70 max-w-2xl mx-auto"
								>
									{data.hero.subtitle}
								</motion.p>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Stats Section */}
			{visibility.stats && hasStats && (
				<section className="py-16 md:py-20 bg-slate-50">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex flex-wrap justify-center items-center gap-0 -mx-8"
						>
							{validStats.map((stat, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="group relative w-72 h-72 -mx-8"
								>
									<div className="absolute inset-0 rounded-full bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-500 border border-slate-200 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary">
										<p className="text-5xl font-bold mb-3 transition-colors duration-300 text-secondary group-hover:text-primary">
											{stat.value}
											{stat.suffix && (
												<span className="text-3xl">{stat.suffix}</span>
											)}
										</p>
										<p className="text-secondary font-medium text-center px-8 leading-relaxed">
											{stat.label}
										</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Team Grid */}
			{visibility.teamMembers && hasTeamMembers && (
				<section className="py-16 md:py-20 lg:py-24 bg-white">
					<div className="_container">
						{/* Section Header */}
						<div className="text-center mb-12">
							<div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-slate-100 text-sm font-medium text-secondary uppercase tracking-wider">
								Team Members
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
								Meet the talented team
							</h2>
							<p className="text-lg text-muted-foreground">
								from our company
							</p>
						</div>

						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto"
						>
							{validTeamMembers.map((member, index) => {
								// Calculate row position for alternating layout
								const rowIndex = Math.floor(index / 3);
								const isOffsetRow = rowIndex % 2 === 1;
								const positionInRow = index % 3;

								// First row: normal (left aligned)
								// Second row: offset right (add left margin to first item)
								const shouldOffset = isOffsetRow && positionInRow === 0;

								return (
								<motion.div
									key={index}
									variants={fadeUp}
									custom={index}
									className="group relative overflow-visible bg-white rounded-[10px] transition-all duration-500"
									style={shouldOffset ? {
										gridColumnStart: '2',
									} : {}}
								>
									{/* Image Container with Wrapper */}
									<div className="relative">
										<div className="thumb relative overflow-hidden rounded-[10px]">
											{member.image ? (
												<ImageComponent
													src={member.image}
													alt={member.name || "Team member"}
													className="w-full h-auto object-cover border-none rounded-[10px] max-w-full"
													height={480}
													width={360}
													wrapperClasses="w-full"
												/>
											) : (
												<div className="aspect-[3/4] flex items-center justify-center bg-slate-100 rounded-[10px]">
													<div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center">
														<span className="text-4xl font-bold text-primary/40">
															{(member.name || "?")
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</span>
													</div>
												</div>
											)}

											{/* Plus Button - Bottom Right (slightly left from edge) */}
											<div className="absolute bottom-4 right-4 z-10">
												<button className="w-14 h-14 rounded-full bg-secondary shadow-xl flex items-center justify-center transform transition-all duration-300 group-hover:bg-primary">
													<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
													</svg>
												</button>
											</div>

											{/* Social Overlay - Appear on Hover */}
											{(member.email || member.linkedin || member.phone) && (
												<div className="social-overlay absolute inset-0 bg-secondary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[10px] flex items-center justify-center gap-3">
													{member.linkedin && (
														<a
															href={member.linkedin}
															target="_blank"
															rel="noopener noreferrer"
															className="w-12 h-12 rounded-full bg-white text-secondary flex items-center justify-center transition-all hover:bg-primary hover:text-white"
															aria-label={`LinkedIn profile of ${member.name}`}
														>
															<Linkedin className="h-5 w-5" />
														</a>
													)}
													{member.email && (
														<a
															href={`mailto:${member.email}`}
															className="w-12 h-12 rounded-full bg-white text-secondary flex items-center justify-center transition-all hover:bg-primary hover:text-white"
															aria-label={`Email ${member.name}`}
														>
															<Mail className="h-5 w-5" />
														</a>
													)}
													{member.phone && (
														<a
															href={`tel:${member.phone}`}
															className="w-12 h-12 rounded-full bg-white text-secondary flex items-center justify-center transition-all hover:bg-primary hover:text-white"
															aria-label={`Call ${member.name}`}
														>
															<Phone className="h-5 w-5" />
														</a>
													)}
												</div>
											)}
										</div>
									</div>

									{/* Info - Content Below Image */}
									<div className="info pt-6 text-center">
										{member.department && (
											<div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
												{member.department}
											</div>
										)}
										<h3 className="mb-1 text-xl font-bold text-secondary leading-tight">
											{member.name}
										</h3>
										<p className="text-sm font-medium text-primary">
											{member.role}
										</p>
									</div>
								</motion.div>
								);
							})}
						</motion.div>
					</div>
				</section>
			)}

			{/* Values Section */}
			{visibility.values && hasValues && (
				<section className="py-16 md:py-20 bg-white">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{data.valuesSection?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-bold text-secondary mb-4"
								>
									{data.valuesSection.title}
								</motion.h2>
							)}
							{data.valuesSection?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="mx-auto max-w-2xl text-muted-foreground"
								>
									{data.valuesSection.subtitle}
								</motion.p>
							)}
						</motion.div>

						{validValues.length > 0 && (
							<motion.div
								variants={staggerContainer}
								initial="initial"
								whileInView="animate"
								viewport={{ once: true }}
								className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
							>
								{validValues.map((value, index) => (
									<motion.div
										key={index}
										variants={fadeUp}
										custom={index}
										className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 text-center hover:border-primary/30 transition-colors"
									>
										<h3 className="mb-2 text-lg font-bold text-secondary">
											{value.title}
										</h3>
										{value.description && (
											<p className="text-sm text-muted-foreground">
												{value.description}
											</p>
										)}
									</motion.div>
								))}
							</motion.div>
						)}
					</div>
				</section>
			)}

			{/* Join Us CTA */}
			{visibility.joinUs && hasJoinUs && (
				<section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
					{/* Triangulated Particles Animation */}
					<div className="absolute inset-0 opacity-30">
						<svg
							className="absolute top-0 left-0 w-full h-full"
							viewBox="0 0 1440 800"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid slice"
						>
							{/* Generate random particles with triangulated connections */}
							{(() => {
								// Generate particle positions
								const particles = [...Array(25)].map(() => ({
									x: Math.random() * 1440,
									y: Math.random() * 800,
									size: 2 + Math.random() * 2,
								}));

								// Create triangulation lines between nearby particles
								const lines: React.JSX.Element[] = [];
								particles.forEach((p1, i) => {
									particles.slice(i + 1).forEach((p2, j) => {
										const distance = Math.sqrt(
											Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
										);
										// Only connect particles within 200px distance
										if (distance < 200) {
											lines.push(
												<motion.line
													key={`line-${i}-${j}`}
													x1={p1.x}
													y1={p1.y}
													x2={p2.x}
													y2={p2.y}
													stroke="white"
													strokeWidth="0.5"
													initial={{ opacity: 0 }}
													animate={{
														opacity: [0.1, 0.3, 0.1],
													}}
													transition={{
														duration: 4 + Math.random() * 3,
														repeat: Infinity,
														delay: Math.random() * 2,
													}}
												/>
											);
										}
									});
								});

								return (
									<>
										{/* Render connection lines */}
										{lines}

										{/* Render particles */}
										{particles.map((particle, i) => (
											<motion.g key={`particle-${i}`}>
												{/* Particle glow */}
												<motion.circle
													cx={particle.x}
													cy={particle.y}
													r={particle.size * 3}
													fill="white"
													initial={{ opacity: 0.05 }}
													animate={{
														opacity: [0.05, 0.15, 0.05],
														scale: [1, 1.3, 1],
													}}
													transition={{
														duration: 3 + Math.random() * 2,
														repeat: Infinity,
														delay: Math.random() * 2,
													}}
												/>
												{/* Particle core */}
												<motion.circle
													cx={particle.x}
													cy={particle.y}
													r={particle.size}
													fill="white"
													initial={{ opacity: 0.4 }}
													animate={{
														opacity: [0.4, 0.9, 0.4],
														x: [0, (Math.random() - 0.5) * 30],
														y: [0, (Math.random() - 0.5) * 30],
													}}
													transition={{
														duration: 8 + Math.random() * 4,
														repeat: Infinity,
														repeatType: "reverse",
														delay: Math.random() * 2,
													}}
												/>
											</motion.g>
										))}

										{/* Add some triangular mesh patterns */}
										{[...Array(8)].map((_, i) => {
											const x = Math.random() * 1440;
											const y = Math.random() * 800;
											const size = 40 + Math.random() * 60;
											return (
												<motion.path
													key={`triangle-${i}`}
													d={`M${x} ${y} L${x + size} ${y + size * 0.5} L${x} ${y + size} Z`}
													stroke="white"
													strokeWidth="0.3"
													fill="white"
													fillOpacity="0.02"
													initial={{ opacity: 0, rotate: 0 }}
													animate={{
														opacity: [0, 0.4, 0],
														rotate: 360,
														scale: [1, 1.2, 1],
													}}
													transition={{
														duration: 15 + Math.random() * 10,
														repeat: Infinity,
														delay: Math.random() * 3,
													}}
													style={{ transformOrigin: `${x + size / 2}px ${y + size / 2}px` }}
												/>
											);
										})}
									</>
								);
							})()}
						</svg>
					</div>

					<div className="_container relative z-10">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="max-w-3xl mx-auto text-center"
						>
							{data.joinUs?.title && (
								<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
									{data.joinUs.title}
								</h2>
							)}
							{data.joinUs?.description && (
								<p className="text-white/80 mb-8 text-lg">
									{data.joinUs.description}
								</p>
							)}
							{(data.joinUs?.primaryCta?.text || data.joinUs?.secondaryCta?.text) && (
								<div className="flex flex-wrap justify-center gap-4">
									{data.joinUs?.primaryCta?.text && data.joinUs?.primaryCta?.href && (
										<Button asChild size="lg">
											<Link href={data.joinUs.primaryCta.href}>
												{data.joinUs.primaryCta.text}
											</Link>
										</Button>
									)}
									{data.joinUs?.secondaryCta?.text &&
										data.joinUs?.secondaryCta?.href && (
											<Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-secondary">
												<Link href={data.joinUs.secondaryCta.href}>
													{data.joinUs.secondaryCta.text}
												</Link>
											</Button>
										)}
								</div>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Contact Section */}
			{visibility.contact && hasContact && (
				<section className="py-16 md:py-20 bg-secondary">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center"
						>
							{data.contact?.title && (
								<h2 className="mb-4 text-2xl font-bold text-white">
									{data.contact.title}
								</h2>
							)}
							{data.contact?.description && (
								<p className="mb-6 text-white/70">
									{data.contact.description}
								</p>
							)}
							{(data.contact?.phone || data.contact?.email) && (
								<div className="flex flex-wrap justify-center gap-6">
									{data.contact?.phone && (
										<a
											href={`tel:${data.contact.phone}`}
											className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
										>
											<Phone className="h-5 w-5" />
											{data.contact.phone}
										</a>
									)}
									{data.contact?.email && (
										<a
											href={`mailto:${data.contact.email}`}
											className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
										>
											<Mail className="h-5 w-5" />
											{data.contact.email}
										</a>
									)}
								</div>
							)}
						</motion.div>
					</div>
				</section>
			)}
		</div>
	);
}
