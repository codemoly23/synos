"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Tag, TrendingUp, Mail } from "lucide-react";
import { Article } from "@/types/article";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { useState } from "react";
import { ImageComponent } from "@/components/common/image-component";

interface NyheterSidebarProps {
	categories: string[];
	recentArticles: Article[];
	onSearch?: (query: string) => void;
	onCategoryFilter?: (category: string | null) => void;
	selectedCategory?: string | null;
	basePath?: string;
}

/**
 * NyheterSidebar Component
 *
 * Left sticky sidebar for news listing page.
 * Modern, minimal design with smooth transitions.
 */
export function NyheterSidebar({
	categories,
	recentArticles,
	onSearch,
	onCategoryFilter,
	selectedCategory,
	basePath = "/nyheter",
}: NyheterSidebarProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(searchQuery);
	};

	return (
		<aside className="lg:sticky lg:top-28 lg:self-start space-y-6">
			{/* Search */}
			<motion.div
				variants={fadeUp}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="rounded-2xl bg-white p-5 shadow-sm border border-border/50"
			>
				<div className="mb-4 flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<Search className="h-4 w-4 text-primary" />
					</div>
					<h3 className="font-semibold text-secondary">Sök artiklar</h3>
				</div>
				<form onSubmit={handleSearch} className="flex gap-2">
					<Input
						type="search"
						placeholder="Sök..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="flex-1 bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
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
				className="rounded-2xl bg-white p-5 shadow-sm border border-border/50"
			>
				<div className="mb-4 flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<Tag className="h-4 w-4 text-primary" />
					</div>
					<h3 className="font-semibold text-secondary">Kategorier</h3>
				</div>
				<div className="space-y-1">
					<button
						onClick={() => onCategoryFilter?.(null)}
						className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
							selectedCategory === null
								? "bg-primary text-white shadow-sm"
								: "text-muted-foreground hover:bg-slate-50 hover:text-secondary"
						}`}
					>
						Alla artiklar
					</button>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => onCategoryFilter?.(category)}
							className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
								selectedCategory === category
									? "bg-primary text-white shadow-sm"
									: "text-muted-foreground hover:bg-slate-50 hover:text-secondary"
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
				className="rounded-2xl bg-white p-5 shadow-sm border border-border/50"
			>
				<div className="mb-4 flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<TrendingUp className="h-4 w-4 text-primary" />
					</div>
					<h3 className="font-semibold text-secondary">Senaste</h3>
				</div>
				<div className="space-y-4">
					{recentArticles.slice(0, 4).map((article) => (
						<Link
							key={article.id}
							href={`${basePath}/${article.slug}`}
							className="group flex gap-3"
						>
							{/* Thumbnail */}
							{article.featuredImage && (
								<div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
									<ImageComponent
										src={article.featuredImage.url}
										alt={article.featuredImage.alt}
										height={0}
										width={0}
										sizes="56px"
										wrapperClasses="w-full h-full"
										className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
									/>
								</div>
							)}
							<div className="flex-1 min-w-0">
								<h4 className="text-sm font-medium text-secondary leading-tight transition-colors group-hover:text-primary line-clamp-2">
									{article.title}
								</h4>
								<p className="mt-1 text-xs text-muted-foreground">
									{new Date(article.publishedAt).toLocaleDateString(
										"sv-SE",
										{
											month: "short",
											day: "numeric",
										}
									)}
								</p>
							</div>
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
				className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-5 border border-primary/10"
			>
				<div className="mb-3 flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
						<Mail className="h-4 w-4 text-primary" />
					</div>
					<h3 className="font-semibold text-secondary">Nyhetsbrev</h3>
				</div>
				<p className="mb-4 text-sm text-muted-foreground leading-relaxed">
					Få de senaste artiklarna direkt i din inkorg.
				</p>
				<Button asChild variant="primary" size="sm" className="w-full">
					<Link href="/kontakt">Prenumerera</Link>
				</Button>
			</motion.div>
		</aside>
	);
}
