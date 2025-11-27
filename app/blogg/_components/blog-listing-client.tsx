"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { BlogHero } from "./blog-hero";
import { BlogCard } from "./blog-card";
import { BlogSidebar } from "./blog-sidebar";
import { staggerContainer } from "@/lib/animations";
import { getRecentArticles } from "@/data/blog/blog-data";

interface BlogListingClientProps {
	articles: Article[];
	categories: string[];
}

/**
 * BlogListingClient Component
 * 
 * Client-side component for blog listing with filtering and search.
 */
export function BlogListingClient({
	articles,
	categories,
}: BlogListingClientProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	// Filter articles based on search and category
	const filteredArticles = useMemo(() => {
		let filtered = articles;

		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter((article) =>
				article.categories.includes(selectedCategory)
			);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(article) =>
					article.title.toLowerCase().includes(query) ||
					article.excerpt.toLowerCase().includes(query) ||
					article.content.toLowerCase().includes(query) ||
					article.tags?.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		return filtered;
	}, [articles, selectedCategory, searchQuery]);

	const recentArticles = getRecentArticles(5);

	return (
		<>
			<BlogHero />

			<section className="section-padding bg-slate-50">
				<div className="_container">
					<div className="grid gap-8 lg:grid-cols-[1fr_350px]">
						{/* Main Content */}
						<div>
							{/* Results Count */}
							<div className="mb-6 text-sm text-muted-foreground">
								Visar {filteredArticles.length} av {articles.length} artiklar
								{selectedCategory && ` i kategorin "${selectedCategory}"`}
								{searchQuery && ` för "${searchQuery}"`}
							</div>

							{/* Articles Grid */}
							{filteredArticles.length > 0 ? (
								<motion.div
									initial="initial"
									animate="animate"
									variants={staggerContainer}
									className="grid gap-8 md:grid-cols-2"
								>
									{filteredArticles.map((article, index) => (
										<BlogCard key={article.id} article={article} index={index} />
									))}
								</motion.div>
							) : (
								<div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
									<p className="text-lg text-muted-foreground">
										Inga artiklar hittades.
									</p>
									<p className="mt-2 text-sm text-muted-foreground">
										Prova att ändra dina sökkriterier eller filtrera efter en annan
										kategori.
									</p>
								</div>
							)}
						</div>

						{/* Sidebar */}
						<BlogSidebar
							categories={categories}
							recentArticles={recentArticles}
							onSearch={setSearchQuery}
							onCategoryFilter={setSelectedCategory}
							selectedCategory={selectedCategory}
						/>
					</div>
				</div>
			</section>
		</>
	);
}

