"use client";

import { motion } from "framer-motion";
import {
	Search,
	FileText,
	Truck,
	CheckCircle,
	Clock,
	ShieldCheck,
	HeadphonesIcon,
	Star,
	Award,
	Zap,
	Heart,
	Users,
	Building,
	Phone,
	Mail,
	Globe,
	Layers,
} from "lucide-react";
import type { IProcessStepsSection } from "@/models/home-page.model";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Search,
	FileText,
	Truck,
	CheckCircle,
	Clock,
	ShieldCheck,
	HeadphonesIcon,
	Star,
	Award,
	Zap,
	Heart,
	Users,
	Building,
	Phone,
	Mail,
	Globe,
	Layers,
};

interface ProcessStepsProps {
	data: IProcessStepsSection;
}

export function ProcessSteps({ data }: ProcessStepsProps) {
	// Filter out steps without required data
	const validSteps = (data?.steps ?? []).filter(
		(s) => s.title && s.description && s.stepNumber
	);

	if (validSteps.length === 0) return null;

	return (
		<section className="section-padding bg-slate-50">
			<div className="_container">
				<div className="text-center max-w-3xl mx-auto mb-16">
					{data?.badge && (
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 w-fit border border-primary/20 mb-4 mx-auto">
							<Layers className="h-4 w-4 text-primary" />
							<span className="text-xs font-bold text-primary uppercase tracking-wider">
								{data.badge}
							</span>
						</div>
					)}
					{data?.title && (
						<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
							{data.title}
						</h2>
					)}
					{data?.subtitle && (
						<p className="text-slate-600 text-lg">{data.subtitle}</p>
					)}
				</div>

				<div className="relative">
					{/* Connecting Line (Desktop) */}
					<div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{validSteps.map((step, index) => {
							const IconComponent = step.icon
								? iconMap[step.icon] || Search
								: Search;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.2 }}
									className="relative bg-white lg:bg-transparent p-6 lg:p-0 rounded-xl border lg:border-none border-border/50"
								>
									<div className="flex flex-col items-center text-center">
										<div className="h-24 w-24 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center mb-6 relative z-10 shadow-sm">
											<IconComponent className="h-10 w-10 text-primary" />
											<div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
												{step.stepNumber}
											</div>
										</div>
										<h3 className="text-xl font-bold text-secondary mb-3">
											{step.title}
										</h3>
										<p className="text-slate-600">{step.description}</p>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
