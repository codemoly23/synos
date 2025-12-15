"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Tag, TrendingUp, Mail } from "lucide-react";
import { Article } from "@/types/article";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp } from "@/lib/animations";
import { useState } from "react";

interface BlogSidebarProps {
	categories: string[];
	recentArticles: Article[];
	onSearch?: (query: string) => void;
	onCategoryFilter?: (category: string | null) => void;
	selectedCategory?: string | null;
	basePath?: string;
}

/**
 * BlogSidebar Component
 *
 * Sidebar for blog listing page with search, categories, and recent posts.
 * Supports custom basePath for different routes (e.g., /nyheter, /blogg)
 */
export function BlogSidebar({
	categories,
	recentArticles,
	onSearch,
	onCategoryFilter,
	selectedCategory,
	basePath = "/blogg",
}: BlogSidebarProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(searchQuery);
	};

	return (
		<aside className="space-y-8">
			{/* Search */}
			<motion.div
				variants={fadeUp}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="rounded-2xl border border-border bg-white p-6 shadow-sm"
			>
				<div className="mb-4 flex items-center gap-2">
					<Search className="h-5 w-5 text-primary" />
					<h3 className="font-bold text-foreground">Sök artiklar</h3>
				</div>
				<form onSubmit={handleSearch} className="flex gap-2">
					<Input
						type="search"
						placeholder="Sök..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="flex-1"
					/>
					<Button type="submit" size="sm" variant="primary">
						Sök
					</Button>
				</form>
			</motion.div>

			{/* Categories */}
			<motion.div
				variants={fadeUp}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				transition={{ delay: 0.1 }}
				className="rounded-2xl border border-border bg-white p-6 shadow-sm"
			>
				<div className="mb-4 flex items-center gap-2">
					<Tag className="h-5 w-5 text-primary" />
					<h3 className="font-bold text-foreground">Kategorier</h3>
				</div>
				<div className="space-y-2">
					<button
						onClick={() => onCategoryFilter?.(null)}
						className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
							selectedCategory === null
								? "bg-primary text-white"
								: "hover:bg-muted"
						}`}
					>
						Alla artiklar
					</button>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => onCategoryFilter?.(category)}
							className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
								selectedCategory === category
									? "bg-primary text-white"
									: "hover:bg-muted"
							}`}
						>
							{category}
						</button>
					))}
				</div>
			</motion.div>

			{/* Recent Posts */}
			<motion.div
				variants={fadeUp}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				transition={{ delay: 0.2 }}
				className="rounded-2xl border border-border bg-white p-6 shadow-sm"
			>
				<div className="mb-4 flex items-center gap-2">
					<TrendingUp className="h-5 w-5 text-primary" />
					<h3 className="font-bold text-foreground">Senaste artiklarna</h3>
				</div>
				<div className="space-y-4">
					{recentArticles.map((article) => (
						<Link
							key={article.id}
							href={`${basePath}/${article.slug}`}
							className="group block"
						>
							<h4 className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
								{article.title}
							</h4>
							<p className="text-xs text-muted-foreground">
								{new Date(article.publishedAt).toLocaleDateString(
									"sv-SE",
									{
										year: "numeric",
										month: "short",
										day: "numeric",
									}
								)}
							</p>
						</Link>
					))}
				</div>
			</motion.div>

			{/* Newsletter CTA */}
			<motion.div
				variants={fadeUp}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				transition={{ delay: 0.3 }}
				className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-sm"
			>
				<div className="mb-4 flex items-center gap-2">
					<Mail className="h-5 w-5 text-primary" />
					<h3 className="font-bold text-foreground">Nyhetsbrev</h3>
				</div>
				<p className="mb-4 text-sm text-muted-foreground">
					Få de senaste artiklarna och nyheterna direkt i din inkorg.
				</p>
				<Button asChild variant="primary" className="w-full">
					<Link href="/kontakt">Prenumerera</Link>
				</Button>
			</motion.div>
		</aside>
	);
}
