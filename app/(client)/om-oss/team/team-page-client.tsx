"use client";

import { motion } from "framer-motion";
import { Users, Mail, Linkedin, Phone } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TeamPageData } from "@/lib/repositories/team-page.repository";
import { ImageComponent } from "@/components/common/image-component";

interface TeamPageClientProps {
	data: TeamPageData;
}

export function TeamPageClient({ data }: TeamPageClientProps) {
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
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<motion.div
					variants={staggerContainer}
					initial="initial"
					animate="animate"
					className="mb-16 text-center"
				>
					{data.hero?.badge && (
						<motion.div
							variants={fadeUp}
							className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
						>
							<Users className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium text-primary">
								{data.hero.badge}
							</span>
						</motion.div>
					)}
					{data.hero?.title && (
						<motion.h1
							variants={fadeUp}
							className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl"
						>
							{data.hero.title}
						</motion.h1>
					)}
					{data.hero?.subtitle && (
						<motion.p
							variants={fadeUp}
							className="mx-auto max-w-3xl text-lg text-muted-foreground"
						>
							{data.hero.subtitle}
						</motion.p>
					)}
				</motion.div>
			)}

			{/* Stats Section */}
			{visibility.stats && hasStats && (
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{validStats.map((stat, index) => (
						<motion.div
							key={index}
							variants={fadeUp}
							custom={index}
							className="rounded-xl border border-border bg-card p-6 text-center"
						>
							<p className="text-3xl font-bold text-primary">{stat.value}</p>
							<p className="text-muted-foreground">{stat.label}</p>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Team Grid */}
			{visibility.teamMembers && hasTeamMembers && (
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
							className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
						>
							{/* Image or Placeholder */}
							<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-slate-100">
								{member.image ? (
									<ImageComponent
										src={member.image}
										alt={member.name || "Team member"}
										className="w-full h-full object-cover"
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
								{/* Overlay on hover */}
								{(member.email || member.linkedin) && (
									<div className="absolute inset-0 flex items-center justify-center gap-4 bg-secondary/80 opacity-0 transition-opacity group-hover:opacity-100">
										{member.email && (
											<a
												href={`mailto:${member.email}`}
												className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110"
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
												className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110"
												aria-label={`LinkedIn profile of ${member.name}`}
											>
												<Linkedin className="h-5 w-5" />
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
			)}

			{/* Values Section */}
			{visibility.values && hasValues && (
				<section className="mt-20">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="text-center"
					>
						{data.valuesSection?.title && (
							<motion.h2
								variants={fadeUp}
								className="mb-4 text-3xl font-bold text-secondary"
							>
								{data.valuesSection.title}
							</motion.h2>
						)}
						{data.valuesSection?.subtitle && (
							<motion.p
								variants={fadeUp}
								className="mx-auto mb-12 max-w-2xl text-muted-foreground"
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
									className="rounded-xl border border-border bg-card p-6 text-center"
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
				</section>
			)}

			{/* Join Us CTA */}
			{visibility.joinUs && hasJoinUs && (
				<section className="mt-20">
					<div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center sm:p-12">
						{data.joinUs?.title && (
							<h2 className="mb-4 text-3xl font-bold text-secondary">
								{data.joinUs.title}
							</h2>
						)}
						{data.joinUs?.description && (
							<p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
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
					</div>
				</section>
			)}

			{/* Contact Section */}
			{visibility.contact && hasContact && (
				<section className="mt-20 text-center">
					{data.contact?.title && (
						<h2 className="mb-4 text-2xl font-bold text-secondary">
							{data.contact.title}
						</h2>
					)}
					{data.contact?.description && (
						<p className="mb-6 text-muted-foreground">
							{data.contact.description}
						</p>
					)}
					{(data.contact?.phone || data.contact?.email) && (
						<div className="flex flex-wrap justify-center gap-6">
							{data.contact?.phone && (
								<a
									href={`tel:${data.contact.phone}`}
									className="flex items-center gap-2 text-primary hover:underline"
								>
									<Phone className="h-5 w-5" />
									{data.contact.phone}
								</a>
							)}
							{data.contact?.email && (
								<a
									href={`mailto:${data.contact.email}`}
									className="flex items-center gap-2 text-primary hover:underline"
								>
									<Mail className="h-5 w-5" />
									{data.contact.email}
								</a>
							)}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
