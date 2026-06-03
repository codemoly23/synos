"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { Article } from "@/types/article";
import { ImageComponent } from "@/components/common/image-component";
import { fadeUp } from "@/lib/animations";

interface NyheterAuthorCardProps {
	article: Article;
}

/**
 * NyheterAuthorCard Component
 *
 * Compact author card displayed at the bottom of blog posts.
 * Shows author info, publish date, and reading time.
 */
export function NyheterAuthorCard({ article }: NyheterAuthorCardProps) {
	const publishedDate = new Date(article.publishedAt).toLocaleDateString(
		"sv-SE",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	const wordCount = article.content.split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / 200);

	return (
		<motion.div
			initial="initial"
			whileInView="animate"
			viewport={{ once: true }}
			variants={fadeUp}
			className="rounded-2xl border border-border/50 bg-slate-50/50 p-5 sm:p-6"
		>
			<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
				{/* Author Image */}
				<div className="flex-shrink-0">
					{article.author.image ? (
						<div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full ring-2 ring-primary/10">
							<ImageComponent
								src={article.author.image}
								alt={article.author.name}
								height={0}
								width={0}
								sizes="80px"
								wrapperClasses="w-full h-full"
								className="object-cover w-full h-full"
							/>
						</div>
					) : (
						<div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10">
							<User className="h-8 w-8 text-primary" />
						</div>
					)}
				</div>

				{/* Author Info */}
				<div className="flex-1 min-w-0">
					<p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
						Skriven av
					</p>
					<h3 className="text-lg font-semibold text-secondary mb-1">
						{article.author.name}
					</h3>
					{article.author.role && (
						<p className="text-sm text-muted-foreground mb-3">
							{article.author.role}
						</p>
					)}

					{/* Meta info */}
					<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<Calendar className="h-3.5 w-3.5" />
							<time dateTime={article.publishedAt}>{publishedDate}</time>
						</div>
						<span className="text-border">|</span>
						<div className="flex items-center gap-1.5">
							<Clock className="h-3.5 w-3.5" />
							<span>{readingTime} min läsning</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
