"use client";

import { motion } from "framer-motion";
import {
	Clock,
	Truck,
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
	Search,
	FileText,
	CheckCircle,
} from "lucide-react";
import type { IFeatureHighlight } from "@/models/home-page.model";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Clock,
	Truck,
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
	Search,
	FileText,
	CheckCircle,
};

interface FeatureHighlightsProps {
	features: IFeatureHighlight[];
}

export function FeatureHighlights({ features }: FeatureHighlightsProps) {
	// Filter out features without required data
	const validFeatures = features.filter(
		(f) => f.title && f.description && f.icon
	);

	if (validFeatures.length === 0) return null;

	return (
		<section className="py-16 bg-slate-100 border-y border-primary/50">
			<div className="_container ">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{validFeatures.map((feature, index) => {
						const IconComponent = feature.icon
							? iconMap[feature.icon] || Star
							: Star;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
							>
								<div className="h-12 w-12 rounded-xl bg-secondary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
									<IconComponent className="h-6 w-6" />
								</div>
								<h3 className="text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors duration-300">
									{feature.title}
								</h3>
								<p className="text-sm text-slate-600 leading-relaxed group-hover:text-secondary/80 transition-colors duration-300">
									{feature.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
