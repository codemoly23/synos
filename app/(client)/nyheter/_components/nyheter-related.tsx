"use client";

import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { NyheterCard } from "./nyheter-card";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NyheterRelatedProps {
	articles: Article[];
	currentArticleId: string;
	basePath?: string;
}

/**
 * NyheterRelated Component
 *
 * Displays related news posts with minimal, modern design.
 */
export function NyheterRelated({
	articles,
	currentArticleId,
	basePath = "/nyheter",
}: NyheterRelatedProps) {
	const relatedArticles = articles
		.filter((article) => article.id !== currentArticleId)
		.slice(0, 3);

	if (relatedArticles.length === 0) {
		return null;
	}

	return (
		<section className="py-16 md:py-20 bg-slate-50/50">
			<div className="_container">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					variants={staggerContainer}
				>
					{/* Section Header */}
					<div className="mb-10 flex flex-wrap items-end justify-between gap-4">
						<div>
							<motion.p
								variants={fadeUp}
								className="mb-2 text-sm font-medium text-primary uppercase tracking-wide"
							>
								Fortsätt läsa
							</motion.p>
							<motion.h2
								variants={fadeUp}
								className="text-2xl font-bold text-secondary md:text-3xl"
							>
								Relaterade artiklar
							</motion.h2>
						</div>
						<motion.div variants={fadeUp}>
							<Button asChild variant="ghost" className="gap-2">
								<Link href={basePath}>
									Alla artiklar
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</motion.div>
					</div>

					{/* Related Articles Grid */}
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{relatedArticles.map((article, index) => (
							<NyheterCard
								key={article.id}
								article={article}
								index={index}
								basePath={basePath}
							/>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
