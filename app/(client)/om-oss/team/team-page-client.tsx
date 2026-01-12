"use client";

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

					{/* Bottom curve transition */}
					<div className="absolute bottom-0 left-0 right-0">
						<svg
							viewBox="0 0 1440 60"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-auto"
							preserveAspectRatio="none"
						>
							<path
								d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 15C840 30 720 45 480 30C240 15 120 0 0 30L0 60Z"
								fill="rgb(248 250 252)"
							/>
						</svg>
					</div>
				</section>
			)}

			{/* Stats Section */}
			{visibility.stats && hasStats && (
				<section className="bg-secondary py-8 -mt-1">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
						>
							{validStats.map((stat, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="text-center"
								>
									<p className="text-4xl font-bold text-primary">
										{stat.value}
									</p>
									<p className="text-white/70 mt-1">{stat.label}</p>
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
							className="flex flex-wrap justify-center gap-6 lg:gap-8"
						>
							{validTeamMembers.map((member, index) => {
								// Calculate if this card should be in the offset row
								const rowIndex = Math.floor(index / 3);
								const isOffsetRow = rowIndex % 2 === 1;
								const isFirstInOffsetRow = isOffsetRow && index % 3 === 0;

								return (
								<motion.div
									key={index}
									variants={fadeUp}
									custom={index}
									className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-500 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.334rem)] max-w-[360px]"
									style={isFirstInOffsetRow ? { marginLeft: 'calc(16.666% + 1rem)' } : {}}
								>
									{/* Image Container */}
									<div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
										{member.image ? (
											<ImageComponent
												src={member.image}
												alt={member.name || "Team member"}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
												height={480}
												width={360}
												wrapperClasses="w-full h-full"
											/>
										) : (
											<div className="absolute inset-0 flex items-center justify-center">
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

										{/* Gradient Overlay on Hover */}
										<div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

										{/* Plus Button - Bottom Center */}
										<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
											<button className="w-12 h-12 rounded-full bg-secondary shadow-lg flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:rotate-90">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
												</svg>
											</button>
										</div>

										{/* Social Links - Appear on Hover */}
										{(member.email || member.linkedin || member.phone) && (
											<div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100">
												{member.email && (
													<a
														href={`mailto:${member.email}`}
														className="rounded-full bg-white/95 backdrop-blur-sm p-2.5 text-secondary transition-all hover:scale-110 hover:bg-primary hover:text-white shadow-md"
														aria-label={`Email ${member.name}`}
													>
														<Mail className="h-4 w-4" />
													</a>
												)}
												{member.linkedin && (
													<a
														href={member.linkedin}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded-full bg-white/95 backdrop-blur-sm p-2.5 text-secondary transition-all hover:scale-110 hover:bg-primary hover:text-white shadow-md"
														aria-label={`LinkedIn profile of ${member.name}`}
													>
														<Linkedin className="h-4 w-4" />
													</a>
												)}
												{member.phone && (
													<a
														href={`tel:${member.phone}`}
														className="rounded-full bg-white/95 backdrop-blur-sm p-2.5 text-secondary transition-all hover:scale-110 hover:bg-primary hover:text-white shadow-md"
														aria-label={`Call ${member.name}`}
													>
														<Phone className="h-4 w-4" />
													</a>
												)}
											</div>
										)}
									</div>

									{/* Content */}
									<div className="p-6 text-center bg-white">
										{member.department && (
											<div className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
												{member.department}
											</div>
										)}
										<h3 className="mb-1.5 text-xl font-bold text-secondary leading-tight">
											{member.name}
										</h3>
										<p className="text-sm font-medium text-primary mb-3">
											{member.role}
										</p>
										{member.bio && (
											<p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
												{member.bio}
											</p>
										)}
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
				<section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="max-w-3xl mx-auto text-center"
						>
							{data.joinUs?.title && (
								<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
									{data.joinUs.title}
								</h2>
							)}
							{data.joinUs?.description && (
								<p className="text-muted-foreground mb-8 text-lg">
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
											<Button asChild variant="outline" size="lg">
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
