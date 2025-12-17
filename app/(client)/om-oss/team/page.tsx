"use client";

import { motion } from "framer-motion";
import { Users, Mail, Linkedin, Phone } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Dummy team data - replace with real data or CMS integration
const teamMembers = [
	{
		id: 1,
		name: "Anna Lindqvist",
		role: "VD & Grundare",
		department: "Ledning",
		bio: "Anna grundade Synos Medical 2012 med visionen att göra avancerad estetisk teknologi tillgänglig för svenska kliniker. Med över 20 års erfarenhet inom medicinteknisk försäljning leder hon företaget mot fortsatt tillväxt.",
		image: "/api/placeholder/400/400",
		email: "anna.lindqvist@synosmedical.se",
		linkedin: "https://linkedin.com/in/",
	},
	{
		id: 2,
		name: "Erik Johansson",
		role: "Försäljningschef",
		department: "Försäljning",
		bio: "Erik ansvarar för all försäljning och kundrelationer. Hans djupa kunskap om estetisk utrustning och förståelse för kunders behov gör honom till en ovärderlig resurs för våra partners.",
		image: "/api/placeholder/400/400",
		email: "erik.johansson@synosmedical.se",
		linkedin: "https://linkedin.com/in/",
	},
	{
		id: 3,
		name: "Maria Bergström",
		role: "Utbildningsansvarig",
		department: "Utbildning",
		bio: "Maria leder vårt utbildningsprogram och ser till att alla kunder får den träning de behöver för att maximera användningen av sin utrustning. Hon har bakgrund som dermatologsköterska.",
		image: "/api/placeholder/400/400",
		email: "maria.bergstrom@synosmedical.se",
		linkedin: "https://linkedin.com/in/",
	},
	{
		id: 4,
		name: "Johan Andersson",
		role: "Teknisk Chef",
		department: "Service",
		bio: "Johan och hans team ansvarar för installation, service och teknisk support. Med certifieringar från alla våra leverantörer garanterar han att utrustningen alltid fungerar optimalt.",
		image: "/api/placeholder/400/400",
		email: "johan.andersson@synosmedical.se",
		linkedin: "https://linkedin.com/in/",
	},
	{
		id: 5,
		name: "Sara Nilsson",
		role: "Marknadsansvarig",
		department: "Marknad",
		bio: "Sara driver vår marknadsföring och kommunikation. Hon ser till att våra partners får synlighet och stöd i sin marknadsföring av behandlingar.",
		image: "/api/placeholder/400/400",
		email: "sara.nilsson@synosmedical.se",
		linkedin: "https://linkedin.com/in/",
	},
	{
		id: 6,
		name: "Peter Svensson",
		role: "Ekonomichef",
		department: "Administration",
		bio: "Peter ansvarar för ekonomi, finansiering och administration. Han hjälper även kunder med finansieringslösningar för deras utrustningsinvesteringar.",
		image: "/api/placeholder/400/400",
		email: "peter.svensson@synosmedical.se",
		linkedin: "https://linkedin.com/in/",
	},
];

const departments = [...new Set(teamMembers.map((m) => m.department))];

export default function TeamPage() {
	return (
		<div className="_container padding-top pb-16">
			{/* Hero Section */}
			<motion.div
				variants={staggerContainer}
				initial="initial"
				animate="animate"
				className="mb-16 text-center"
			>
				<motion.div
					variants={fadeUp}
					className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
				>
					<Users className="h-4 w-4 text-primary" />
					<span className="text-sm font-medium text-primary">Vårt Team</span>
				</motion.div>
				<motion.h1
					variants={fadeUp}
					className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl"
				>
					Möt Teamet
				</motion.h1>
				<motion.p
					variants={fadeUp}
					className="mx-auto max-w-3xl text-lg text-muted-foreground"
				>
					Bakom Synos Medical står ett dedikerat team av experter med passion
					för estetisk teknologi. Vi är här för att hjälpa dig lyckas med din
					klinik.
				</motion.p>
			</motion.div>

			{/* Stats Section */}
			<motion.div
				variants={staggerContainer}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
			>
				{[
					{ value: "10+", label: "År i branschen" },
					{ value: "15+", label: "Teammedlemmar" },
					{ value: "200+", label: "Nöjda kunder" },
					{ value: "100%", label: "Engagemang" },
				].map((stat, index) => (
					<motion.div
						key={stat.label}
						variants={fadeUp}
						custom={index}
						className="rounded-xl border border-border bg-card p-6 text-center"
					>
						<p className="text-3xl font-bold text-primary">{stat.value}</p>
						<p className="text-muted-foreground">{stat.label}</p>
					</motion.div>
				))}
			</motion.div>

			{/* Team Grid */}
			<motion.div
				variants={staggerContainer}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
			>
				{teamMembers.map((member, index) => (
					<motion.div
						key={member.id}
						variants={fadeUp}
						custom={index}
						className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
					>
						{/* Image Placeholder */}
						<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-slate-100">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
									<span className="text-4xl font-bold text-primary/60">
										{member.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</span>
								</div>
							</div>
							{/* Overlay on hover */}
							<div className="absolute inset-0 flex items-center justify-center gap-4 bg-secondary/80 opacity-0 transition-opacity group-hover:opacity-100">
								<a
									href={`mailto:${member.email}`}
									className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110"
									aria-label={`Email ${member.name}`}
								>
									<Mail className="h-5 w-5" />
								</a>
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="rounded-full bg-white p-3 text-secondary transition-transform hover:scale-110"
									aria-label={`LinkedIn profile of ${member.name}`}
								>
									<Linkedin className="h-5 w-5" />
								</a>
							</div>
						</div>

						{/* Content */}
						<div className="p-6">
							<div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
								{member.department}
							</div>
							<h3 className="mb-1 text-xl font-bold text-secondary">
								{member.name}
							</h3>
							<p className="mb-3 text-sm font-medium text-primary">
								{member.role}
							</p>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{member.bio}
							</p>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Values Section */}
			<section className="mt-20">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="text-center"
				>
					<motion.h2
						variants={fadeUp}
						className="mb-4 text-3xl font-bold text-secondary"
					>
						Våra Värderingar
					</motion.h2>
					<motion.p
						variants={fadeUp}
						className="mx-auto mb-12 max-w-2xl text-muted-foreground"
					>
						Vi drivs av gemensamma värderingar som genomsyrar allt vi gör
					</motion.p>
				</motion.div>

				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{[
						{
							title: "Expertis",
							description:
								"Vi är specialister inom estetisk medicinteknologi och delar gärna vår kunskap.",
						},
						{
							title: "Partnerskap",
							description:
								"Vi ser våra kunder som partners och investerar i deras framgång.",
						},
						{
							title: "Innovation",
							description:
								"Vi arbetar endast med marknadsledande teknologi och de bästa leverantörerna.",
						},
						{
							title: "Service",
							description:
								"Vi finns alltid tillgängliga för support, utbildning och service.",
						},
					].map((value, index) => (
						<motion.div
							key={value.title}
							variants={fadeUp}
							custom={index}
							className="rounded-xl border border-border bg-card p-6 text-center"
						>
							<h3 className="mb-2 text-lg font-bold text-secondary">
								{value.title}
							</h3>
							<p className="text-sm text-muted-foreground">
								{value.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</section>

			{/* Join Us CTA */}
			<section className="mt-20">
				<div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center sm:p-12">
					<h2 className="mb-4 text-3xl font-bold text-secondary">
						Vill du bli en del av teamet?
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
						Vi söker alltid efter talangfulla personer som delar vår passion
						för estetisk medicinteknologi. Kolla in våra lediga tjänster eller
						skicka en spontanansökan.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button asChild size="lg">
							<Link href="/om-oss/lediga-tjanster">Lediga Tjänster</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/kontakt">Kontakta oss</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="mt-20 text-center">
				<h2 className="mb-4 text-2xl font-bold text-secondary">
					Har du frågor?
				</h2>
				<p className="mb-6 text-muted-foreground">
					Tveka inte att kontakta oss - vi svarar gärna på dina frågor.
				</p>
				<div className="flex flex-wrap justify-center gap-6">
					<a
						href="tel:010-205 15 01"
						className="flex items-center gap-2 text-primary hover:underline"
					>
						<Phone className="h-5 w-5" />
						010-205 15 01
					</a>
					<a
						href="mailto:info@synosmedical.se"
						className="flex items-center gap-2 text-primary hover:underline"
					>
						<Mail className="h-5 w-5" />
						info@synosmedical.se
					</a>
				</div>
			</section>
		</div>
	);
}
