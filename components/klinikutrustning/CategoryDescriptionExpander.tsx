"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
	html: string;
}

export function CategoryDescriptionExpander({ html }: Props) {
	const [expanded, setExpanded] = useState(false);
	const [clamped, setClamped] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (el) {
			setClamped(el.scrollHeight > el.clientHeight + 2);
		}
	}, [html]);

	return (
		<div className="mt-10 pt-8 border-t border-slate-200">
			<div
				ref={ref}
				className={`prose prose-lg max-w-none text-foreground [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-muted-foreground transition-all duration-300 ${
					expanded ? "" : "line-clamp-6"
				}`}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			{(clamped || expanded) && (
				<Button
					variant="ghost"
					size="sm"
					className="mt-3 text-primary hover:text-primary/80 px-0"
					onClick={() => setExpanded((prev) => !prev)}
				>
					{expanded ? (
						<>
							Visa mindre <ChevronUp className="ml-1 h-4 w-4" />
						</>
					) : (
						<>
							Visa mer <ChevronDown className="ml-1 h-4 w-4" />
						</>
					)}
				</Button>
			)}
		</div>
	);
}
