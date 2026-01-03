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
					{/* Left accent border on hover */}
					<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex-1">
							{/* Job Title */}
							<h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors mb-2">
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
							<div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
								<ArrowRight className="w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
							</div>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
