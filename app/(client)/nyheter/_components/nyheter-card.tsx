"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Article } from "@/types/article";
import { fadeUp } from "@/lib/animations";
import { ImageComponent } from "@/components/common/image-component";

interface NyheterCardProps {
	article: Article;
	index?: number;
	basePath?: string;
}

/**
 * NyheterCard Component
 *
 * Minimal, modern blog card with subtle hover animations.
 */
export function NyheterCard({
	article,
	index = 0,
	basePath = "/nyheter",
}: NyheterCardProps) {
	const publishedDate = new Date(article.publishedAt).toLocaleDateString(
		"sv-SE",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	return (
		<motion.article
			variants={fadeUp}
			initial="initial"
			whileInView="animate"
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.08 }}
			className="group h-full"
		>
			<Link href={`${basePath}/${article.slug}`} className="block h-full">
				<div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-primary/10">
					{/* Image */}
					{/* {article.featuredImage && ( */}
					<div className="relative aspect-4/3 w-full overflow-hidden">
						<div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
							<ImageComponent
								src={article?.featuredImage?.url}
								alt={article?.featuredImage?.alt ?? ""}
								height={0}
								width={0}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
								wrapperClasses="w-full h-full"
								className="object-cover w-full h-full"
							/>
						</div>
					</div>
					{/* )} */}

					{/* Content */}
					<div className="flex flex-1 flex-col p-4">
						{/* Date */}
						<div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
							<Calendar className="h-3.5 w-3.5 shrink-0" />
							<time dateTime={article.publishedAt}>{publishedDate}</time>
						</div>

						{/* Title */}
						<h3 className="mb-auto text-base leading-snug font-semibold text-secondary transition-colors duration-300 group-hover:text-primary line-clamp-2 text-wrap">
							{article.title}
						</h3>

						{/* Read More */}
						<div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-medium text-primary">
							<span className="transition-all duration-300 group-hover:tracking-wide">
								Läs mer
							</span>
							<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
						</div>
					</div>
				</div>
			</Link>
		</motion.article>
	);
}
