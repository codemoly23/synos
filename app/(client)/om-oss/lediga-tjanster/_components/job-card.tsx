"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { JobOpeningData } from "@/lib/repositories/careers-page.repository";
import { fadeUp } from "@/lib/animations";

interface JobCardProps {
	job: JobOpeningData;
	index?: number;
}

/**
 * JobCard Component
 *
 * Modern job listing card with hover effect (green left border accent).
 * Displays job title, work type, location, and employment type badges.
 */
export function JobCard({ job, index = 0 }: JobCardProps) {
	const href = job.slug
		? `/om-oss/lediga-tjanster/${job.slug}`
		: "#";

	return (
		<motion.div
			variants={fadeUp}
			custom={index}
			initial="initial"
			animate="animate"
			transition={{ delay: index * 0.1 }}
		>
			<Link href={href} className="block group">
				<div className="relative bg-white rounded-xl border border-slate-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 overflow-hidden">
					{/* Gradient background on hover */}
					<div className="absolute inset-0 bg-gradient-to-r from-[#DBA480] to-[#F1DCCF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

					<div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex-1">
							{/* Job Title */}
							<h3 className="text-lg font-bold text-secondary transition-colors mb-2">
								{job.title}
							</h3>

							{/* Job Meta Badges */}
							<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
								{job.workType && (
									<span className="flex items-center gap-1.5">
										<span className="w-1.5 h-1.5 rounded-full bg-primary" />
										{job.workType}
									</span>
								)}
								{job.location && (
									<span className="flex items-center gap-1.5">
										<span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
										{job.location}
									</span>
								)}
								{job.employmentType && (
									<span className="flex items-center gap-1.5">
										<span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
										{job.employmentType}
									</span>
								)}
							</div>
						</div>

						{/* Arrow Button */}
						<div className="shrink-0 self-start sm:self-center">
							<div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:border-black">
								<ArrowRight className="w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-[#F8EEE8] group-hover:-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</div>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
