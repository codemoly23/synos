"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ExpandableSectionProps {
	children: ReactNode;
	className?: string;
	/** Tailwind line-clamp class applied while collapsed. */
	clampClassName?: string;
	expandLabel?: string;
	collapseLabel?: string;
}

/**
 * Generalizes CategoryDescriptionExpander's clamp+toggle pattern with a
 * fade/gradient overlay over the hidden content and a caller-supplied label.
 */
export function ExpandableSection({
	children,
	className,
	clampClassName = "line-clamp-6",
	expandLabel = "Läs mer",
	collapseLabel = "Visa mindre",
}: ExpandableSectionProps) {
	const [expanded, setExpanded] = useState(false);
	const [clamped, setClamped] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (el) {
			setClamped(el.scrollHeight > el.clientHeight + 2);
		}
	}, [children]);

	return (
		<div className="relative">
			<div
				ref={ref}
				className={cn(
					className,
					"transition-all duration-300",
					!expanded && clampClassName
				)}
			>
				{children}
			</div>
			{!expanded && clamped && (
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
			)}
			{(clamped || expanded) && (
				<div className="mt-3 flex justify-center">
					<Button
						variant="outline"
						size="sm"
						className="rounded-full text-primary hover:text-primary/80"
						onClick={() => setExpanded((prev) => !prev)}
					>
						{expanded ? (
							<>
								{collapseLabel} <ChevronUp className="ml-1 h-4 w-4" />
							</>
						) : (
							<>
								{expandLabel} <ChevronDown className="ml-1 h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
