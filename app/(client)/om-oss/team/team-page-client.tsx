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
				<section className="py-16 md:py-20 lg:py-24">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
						>
							{validTeamMembers.map((member, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									custom={index}
									className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-xl"
								>
									{/* Image or Placeholder */}
									<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-slate-100">
										{member.image ? (
											<ImageComponent
												src={member.image}
												alt={member.name || "Team member"}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												height={400}
												width={400}
												wrapperClasses="w-full h-full"
											/>
										) : (
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
													<span className="text-4xl font-bold text-primary/60">
														{(member.name || "?")
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</span>
												</div>
											</div>
										)}
										{/* Overlay on hover with social links */}
										{(member.email || member.linkedin || member.phone) && (
											<div className="absolute inset-0 flex items-center justify-center gap-4 bg-secondary/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
												{member.email && (
													<a
														href={`mailto:${member.email}`}
														className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110 shadow-lg"
														aria-label={`Email ${member.name}`}
													>
														<Mail className="h-5 w-5" />
													</a>
												)}
												{member.linkedin && (
													<a
														href={member.linkedin}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110 shadow-lg"
														aria-label={`LinkedIn profile of ${member.name}`}
													>
														<Linkedin className="h-5 w-5" />
													</a>
												)}
												{member.phone && (
													<a
														href={`tel:${member.phone}`}
														className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110 shadow-lg"
														aria-label={`Call ${member.name}`}
													>
														<Phone className="h-5 w-5" />
													</a>
												)}
											</div>
										)}
									</div>

									{/* Content */}
									<div className="p-6">
										{member.department && (
											<div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
												{member.department}
											</div>
										)}
										<h3 className="mb-1 text-xl font-bold text-secondary">
											{member.name}
										</h3>
										<p className="mb-3 text-sm font-medium text-primary">
											{member.role}
										</p>
										{member.bio && (
											<p className="text-sm text-muted-foreground line-clamp-3">
												{member.bio}
											</p>
										)}
									</div>
								</motion.div>
							))}
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
