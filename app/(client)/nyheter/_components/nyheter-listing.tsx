"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { parseAsInteger, useQueryState } from "nuqs";
import { Article } from "@/types/article";
import { NyheterHero } from "./nyheter-hero";
import { NyheterCard } from "./nyheter-card";
import { NyheterSidebar } from "./nyheter-sidebar";
import { staggerContainer } from "@/lib/animations";

const ARTICLES_PER_PAGE = 9;

interface NyheterListingProps {
	articles: Article[];
	categories: string[];
	recentArticles?: Article[];
	basePath?: string;
	pageTitle?: string;
}

/**
 * NyheterListing Component
 *
 * Main listing component with left sticky sidebar.
 * Modern, minimal design with responsive layout.
 */
export function NyheterListing({
	articles,
	categories,
	recentArticles,
	basePath = "/nyheter",
	pageTitle = "Nyheter",
}: NyheterListingProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [page, setPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1)
	);

	const filteredArticles = useMemo(() => {
		let filtered = articles;

		if (selectedCategory) {
			filtered = filtered.filter((article) =>
				article.categories.includes(selectedCategory)
			);
		}

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

	// Pagination calculations
	const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

	// Ensure page is within valid range
	const currentPage = Math.min(Math.max(1, page), Math.max(1, totalPages));

	// Update URL if page is out of bounds
	useEffect(() => {
		if (page !== currentPage && totalPages > 0) {
			setPage(currentPage);
		}
	}, [page, currentPage, totalPages, setPage]);

	const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
	const paginatedArticles = filteredArticles.slice(
		startIndex,
		startIndex + ARTICLES_PER_PAGE
	);

	// Reset to page 1 when filters change
	const handleCategoryFilter = (category: string | null) => {
		setSelectedCategory(category);
		setPage(1);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const displayRecentArticles = recentArticles || articles.slice(0, 5);

	return (
		<>
			<NyheterHero pageTitle={pageTitle} />

			<section className="py-12 md:py-16 lg:py-20 bg-slate-50/50">
				<div className="_container">
					{/* Grid: Sidebar Left, Content Right */}
					<div className="grid gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
						{/* Left Sidebar - Hidden on mobile, shown at lg */}
						<div className="hidden lg:block">
							<NyheterSidebar
								categories={categories}
								recentArticles={displayRecentArticles}
								onSearch={handleSearch}
								onCategoryFilter={handleCategoryFilter}
								selectedCategory={selectedCategory}
								basePath={basePath}
							/>
						</div>

						{/* Main Content */}
						<div>
							{/* Results Count */}
							<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
								<p className="text-sm text-muted-foreground">
									Visar{" "}
									<span className="font-semibold text-secondary">
										{startIndex + 1}-{Math.min(startIndex + ARTICLES_PER_PAGE, filteredArticles.length)}
									</span>{" "}
									av {filteredArticles.length} artiklar
									{selectedCategory && (
										<span>
											{" "}
											i{" "}
											<span className="font-medium text-primary">
												{selectedCategory}
											</span>
										</span>
									)}
									{searchQuery && (
										<span>
											{" "}
											för &ldquo;
											<span className="font-medium">{searchQuery}</span>
											&rdquo;
										</span>
									)}
								</p>

								{/* Mobile Filter Toggle */}
								<div className="lg:hidden">
									<MobileFilters
										categories={categories}
										recentArticles={displayRecentArticles}
										onSearch={handleSearch}
										onCategoryFilter={handleCategoryFilter}
										selectedCategory={selectedCategory}
										basePath={basePath}
									/>
								</div>
							</div>

							{/* Articles Grid */}
							{paginatedArticles.length > 0 ? (
								<motion.div
									key={currentPage}
									initial="initial"
									animate="animate"
									variants={staggerContainer}
									className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
								>
									{paginatedArticles.map((article, index) => (
										<NyheterCard
											key={article.id}
											article={article}
											index={index}
											basePath={basePath}
										/>
									))}
								</motion.div>
							) : (
								<div className="rounded-2xl bg-white p-12 text-center shadow-sm">
									<p className="text-lg text-secondary font-medium">
										Inga artiklar hittades.
									</p>
									<p className="mt-2 text-sm text-muted-foreground">
										Prova att ändra dina sökkriterier eller filtrera efter en
										annan kategori.
									</p>
								</div>
							)}

							{/* Pagination */}
							{totalPages > 1 && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

/**
 * Mobile Filters Component
 * Shows filters in a sheet/drawer on mobile devices
 */
function MobileFilters({
	categories,
	recentArticles,
	onSearch,
	onCategoryFilter,
	selectedCategory,
	basePath,
}: {
	categories: string[];
	recentArticles: Article[];
	onSearch: (query: string) => void;
	onCategoryFilter: (category: string | null) => void;
	selectedCategory: string | null;
	basePath: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-secondary shadow-sm border border-border/50 hover:bg-slate-50 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
				</svg>
				Filter
				{selectedCategory && (
					<span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
						1
					</span>
				)}
			</button>

			{/* Mobile Filter Overlay */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsOpen(false)}
					/>

					{/* Panel */}
					<div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-slate-50 shadow-xl overflow-y-auto">
						<div className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 border-b border-border/50">
							<h2 className="text-lg font-semibold text-secondary">Filter</h2>
							<button
								onClick={() => setIsOpen(false)}
								className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>
						<div className="p-4">
							<NyheterSidebar
								categories={categories}
								recentArticles={recentArticles}
								onSearch={(query) => {
									onSearch(query);
									setIsOpen(false);
								}}
								onCategoryFilter={(category) => {
									onCategoryFilter(category);
									setIsOpen(false);
								}}
								selectedCategory={selectedCategory}
								basePath={basePath}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}

/**
 * Pagination Component
 */
function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	const getVisiblePages = () => {
		const pages: (number | "ellipsis")[] = [];
		const showEllipsisThreshold = 7;

		if (totalPages <= showEllipsisThreshold) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("ellipsis");
			}

			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<nav
			className="mt-10 flex items-center justify-center gap-2"
			aria-label="Pagination"
		>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-white text-secondary transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Föregående sida"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
			</button>

			<div className="flex items-center gap-1">
				{getVisiblePages().map((page, index) =>
					page === "ellipsis" ? (
						<span
							key={`ellipsis-${index}`}
							className="flex h-10 w-10 items-center justify-center text-muted-foreground"
						>
							...
						</span>
					) : (
						<button
							key={page}
							onClick={() => onPageChange(page)}
							className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
								currentPage === page
									? "bg-primary text-white"
									: "border border-border/50 bg-white text-secondary hover:bg-slate-50"
							}`}
							aria-label={`Gå till sida ${page}`}
							aria-current={currentPage === page ? "page" : undefined}
						>
							{page}
						</button>
					)
				)}
			</div>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-white text-secondary transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Nästa sida"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</button>
		</nav>
	);
}
