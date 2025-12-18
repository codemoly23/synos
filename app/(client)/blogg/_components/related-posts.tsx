"use client";

import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { BlogCard } from "./blog-card";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Sparkles } from "lucide-react";

interface RelatedPostsProps {
	articles: Article[];
	currentArticleId: string;
	basePath?: string;
}

/**
 * RelatedPosts Component
 *
 * Displays related blog posts based on categories or tags.
 * Supports custom basePath for different routes (e.g., /nyheter, /blogg)
 */
export function RelatedPosts({
	articles,
	currentArticleId,
	basePath = "/blogg",
}: RelatedPostsProps) {
	// Filter out current article and limit to 3
	const relatedArticles = articles
		.filter((article) => article.id !== currentArticleId)
		.slice(0, 3);

	if (relatedArticles.length === 0) {
		return null;
	}

	return (
		<section className="section-padding bg-slate-50">
			<div className="_container">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					variants={staggerContainer}
				>
					{/* Section Header */}
					<div className="mb-12 text-center">
						<motion.div
							variants={fadeUp}
							className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
						>
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-sm font-semibold text-primary">
								Relaterade artiklar
							</span>
						</motion.div>
						<motion.h2
							variants={fadeUp}
							className="text-3xl font-bold text-secondary md:text-4xl"
						>
							Läs mer
						</motion.h2>
					</div>

					{/* Related Articles Grid */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{relatedArticles.map((article, index) => (
							<BlogCard
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
