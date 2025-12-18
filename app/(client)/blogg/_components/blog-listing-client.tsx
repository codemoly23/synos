"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { BlogHero } from "./blog-hero";
import { BlogCard } from "./blog-card";
import { BlogSidebar } from "./blog-sidebar";
import { staggerContainer } from "@/lib/animations";

interface BlogListingClientProps {
	articles: Article[];
	categories: string[];
	recentArticles?: Article[];
	basePath?: string; // e.g., "/nyheter" or "/blogg"
	pageTitle?: string; // e.g., "Nyheter" or "Blogg"
}

/**
 * BlogListingClient Component
 *
 * Client-side component for blog listing with filtering and search.
 * Supports custom basePath for different routes (e.g., /nyheter, /blogg)
 */
export function BlogListingClient({
	articles,
	categories,
	recentArticles,
	basePath = "/blogg",
	pageTitle = "Blogg",
}: BlogListingClientProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);

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

	// Use provided recent articles or fall back to first 5 from all articles
	const displayRecentArticles = recentArticles || articles.slice(0, 5);

	return (
		<>
			<BlogHero pageTitle={pageTitle} />

			<section className="section-padding bg-slate-50">
				<div className="_container">
					<div className="grid gap-8 lg:grid-cols-[1fr_350px]">
						{/* Main Content */}
						<div>
							{/* Results Count */}
							<div className="mb-6 text-sm text-muted-foreground">
								Visar {filteredArticles.length} av {articles.length}{" "}
								artiklar
								{selectedCategory &&
									` i kategorin "${selectedCategory}"`}
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
										<BlogCard
											key={article.id}
											article={article}
											index={index}
											basePath={basePath}
										/>
									))}
								</motion.div>
							) : (
								<div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
									<p className="text-lg text-muted-foreground">
										Inga artiklar hittades.
									</p>
									<p className="mt-2 text-sm text-muted-foreground">
										Prova att ändra dina sökkriterier eller filtrera
										efter en annan kategori.
									</p>
								</div>
							)}
						</div>

						{/* Sidebar */}
						<BlogSidebar
							categories={categories}
							recentArticles={displayRecentArticles}
							onSearch={setSearchQuery}
							onCategoryFilter={setSelectedCategory}
							selectedCategory={selectedCategory}
							basePath={basePath}
						/>
					</div>
				</div>
			</section>
		</>
	);
}
