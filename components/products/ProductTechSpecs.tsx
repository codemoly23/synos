"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TechSpec {
	_id?: string;
	title: string;
	description: string;
}

interface ProductTechSpecsProps {
	specs: TechSpec[];
	limit?: number;
	showAllLabel?: string;
}

export function ProductTechSpecs({
	specs,
	limit,
	showAllLabel = "Visa hela specifikationen",
}: ProductTechSpecsProps) {
	const [showAll, setShowAll] = useState(false);

	if (!specs || specs.length === 0) return null;

	const hasToggle = !!limit && specs.length > limit;
	const isCapped = !showAll && hasToggle;
	const visibleSpecs = hasToggle ? specs.slice(0, limit) : specs;
	const hiddenSpecs = hasToggle && showAll ? specs.slice(limit) : [];

	return (
		<div>
			<h2 className="text-2xl font-light text-secondary mb-6">Tekniska specifikationer</h2>
			<div className="overflow-hidden rounded-xl border border-primary/20">
				{/* First part - fades out at the bottom while capped */}
				<div className="relative">
					{visibleSpecs.map((spec, index) => (
						<div
							key={spec._id || index}
							className={`flex flex-col sm:flex-row gap-2 px-5 py-4 ${index % 2 === 0 ? "bg-primary/5" : "bg-white"}`}
						>
							<span className="text-sm font-semibold text-secondary w-full sm:w-2/5 shrink-0">{spec.title}</span>
							<span className="text-sm text-muted-foreground">{spec.description}</span>
						</div>
					))}
					{isCapped && (
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
					)}
				</div>

				{/* Everything below the first part - hidden until expanded */}
				{hiddenSpecs.length > 0 && (
					<div>
						{hiddenSpecs.map((spec, index) => (
							<div
								key={spec._id || `hidden-${index}`}
								className={`flex flex-col sm:flex-row gap-2 px-5 py-4 ${(visibleSpecs.length + index) % 2 === 0 ? "bg-primary/5" : "bg-white"}`}
							>
								<span className="text-sm font-semibold text-secondary w-full sm:w-2/5 shrink-0">{spec.title}</span>
								<span className="text-sm text-muted-foreground">{spec.description}</span>
							</div>
						))}
					</div>
				)}

				{/* Read more toggle - always at the bottom, after all currently visible rows */}
				{hasToggle && (
					<div className="flex justify-center py-3 border-t border-primary/10 bg-white">
						<Button
							variant="outline"
							size="sm"
							className="rounded-full text-primary hover:text-primary/80"
							onClick={() => setShowAll((prev) => !prev)}
						>
							{showAll ? (
								<>
									Visa färre <ChevronUp className="ml-1 h-4 w-4" />
								</>
							) : (
								<>
									{showAllLabel} <ChevronDown className="ml-1 h-4 w-4" />
								</>
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
