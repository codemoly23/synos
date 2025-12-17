"use client";

import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { fadeUp } from "@/lib/animations";
import {
	Share2,
	Facebook,
	Twitter,
	Linkedin,
	Link as LinkIcon,
	Tag,
	FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { sanitizeHtmlContent } from "@/lib/sanitize-html";
import { NyheterAuthorCard } from "./nyheter-author-card";
import Link from "next/link";

interface NyheterContentProps {
	article: Article;
	basePath?: string;
}

/**
 * NyheterContent Component
 *
 * Modern content area with left sidebar for social sharing.
 * Tags and categories displayed at the bottom with eye-catching UI.
 * Author card displayed at the bottom.
 */
export function NyheterContent({ article, basePath = "/nyheter" }: NyheterContentProps) {
	const [copied, setCopied] = useState(false);

	const sanitizedContent = useMemo(
		() => sanitizeHtmlContent(article.content),
		[article.content]
	);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const handleShare = (platform: string) => {
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(article.title);

		const shareUrls: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
			twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
		};

		if (shareUrls[platform]) {
			window.open(shareUrls[platform], "_blank", "width=600,height=400");
		}
	};

	const hasCategories = article.categories && article.categories.length > 0;
	const hasTags = article.tags && article.tags.length > 0;

	return (
		<div className="py-10 md:py-14">
			<div className="_container">
				{/* Grid: Sidebar Left, Content Right */}
				<div className="grid gap-8 lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr]">
					{/* Left Sidebar - Social Share */}
					<div className="hidden lg:block">
						<div className="sticky top-28">
							<motion.div
								initial="initial"
								animate="animate"
								variants={fadeUp}
								className="rounded-2xl bg-white p-5 shadow-sm border border-border/50"
							>
								<div className="mb-4 flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
										<Share2 className="h-4 w-4 text-primary" />
									</div>
									<h3 className="font-semibold text-secondary text-sm">Dela</h3>
								</div>
								<div className="space-y-2">
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start gap-2 text-xs"
										onClick={() => handleShare("facebook")}
									>
										<Facebook className="h-4 w-4" />
										Facebook
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start gap-2 text-xs"
										onClick={() => handleShare("twitter")}
									>
										<Twitter className="h-4 w-4" />
										Twitter
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start gap-2 text-xs"
										onClick={() => handleShare("linkedin")}
									>
										<Linkedin className="h-4 w-4" />
										LinkedIn
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start gap-2 text-xs"
										onClick={handleCopyLink}
									>
										<LinkIcon className="h-4 w-4" />
										{copied ? "Kopierad!" : "Kopiera länk"}
									</Button>
								</div>
							</motion.div>
						</div>
					</div>

					{/* Main Content */}
					<div className="max-w-3xl">
						<motion.article
							initial="initial"
							animate="animate"
							variants={fadeUp}
							className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-secondary prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl md:prose-h3:text-2xl prose-p:mb-5 prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:my-4 prose-li:my-2 prose-img:rounded-xl prose-img:shadow-md"
							dangerouslySetInnerHTML={{ __html: sanitizedContent }}
						/>

						{/* Author Card */}
						<div className="mt-10 pt-8 border-t border-border">
							<NyheterAuthorCard article={article} />
						</div>

						{/* Tags & Categories Section - Eye-catching bottom section */}
						{(hasCategories || hasTags) && (
							<motion.div
								initial="initial"
								whileInView="animate"
								viewport={{ once: true }}
								variants={fadeUp}
								className="mt-12 pt-10 border-t border-border"
							>
								<div className="grid gap-8 sm:grid-cols-2">
									{/* Categories */}
									{hasCategories && (
										<div className="group">
											<div className="flex items-center gap-3 mb-5">
												<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
													<FolderOpen className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="text-base font-semibold text-secondary">
														Kategorier
													</h3>
													<p className="text-xs text-muted-foreground">
														Utforska relaterade ämnen
													</p>
												</div>
											</div>
											<div className="flex flex-wrap gap-2">
												{article.categories.map((category) => (
													<Link
														key={category}
														href={`${basePath}/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
														className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-primary/15 to-primary/5 px-4 py-2 text-sm font-medium text-primary border border-primary/20 hover:border-primary/40 hover:from-primary/25 hover:to-primary/15 transition-all duration-300 hover:shadow-md hover:shadow-primary/10"
													>
														<span>{category}</span>
													</Link>
												))}
											</div>
										</div>
									)}

									{/* Tags */}
									{hasTags && (
										<div className="group">
											<div className="flex items-center gap-3 mb-5">
												<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 group-hover:from-secondary/30 group-hover:to-secondary/10 transition-colors">
													<Tag className="h-5 w-5 text-secondary" />
												</div>
												<div>
													<h3 className="text-base font-semibold text-secondary">
														Taggar
													</h3>
													<p className="text-xs text-muted-foreground">
														Upptäck mer innehåll
													</p>
												</div>
											</div>
											<div className="flex flex-wrap gap-2">
												{article.tags.map((tag) => (
													<Link
														key={tag}
														href={`${basePath}/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
														className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-secondary/80 border border-slate-200 hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary transition-all duration-300 hover:shadow-sm"
													>
														<span className="text-muted-foreground">#</span>
														<span>{tag}</span>
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							</motion.div>
						)}

						{/* Mobile Social Share */}
						<div className="lg:hidden mt-10 pt-8 border-t border-border">
							<div className="flex items-center gap-4 flex-wrap">
								<span className="text-sm font-medium text-secondary">
									Dela:
								</span>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										className="h-10 w-10 rounded-full"
										onClick={() => handleShare("facebook")}
									>
										<Facebook className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="h-10 w-10 rounded-full"
										onClick={() => handleShare("twitter")}
									>
										<Twitter className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="h-10 w-10 rounded-full"
										onClick={() => handleShare("linkedin")}
									>
										<Linkedin className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="h-10 w-10 rounded-full"
										onClick={handleCopyLink}
									>
										<LinkIcon className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
