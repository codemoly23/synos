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
	showAllLabel = "Visa alla specifikationer",
}: ProductTechSpecsProps) {
	const [showAll, setShowAll] = useState(false);

	if (!specs || specs.length === 0) return null;

	const isCapped = !showAll && !!limit && specs.length > limit;
	const displayedSpecs = isCapped ? specs.slice(0, limit) : specs;

	const [firstSpec, ...restSpecs] = displayedSpecs;
	const hasToggle = !!limit && specs.length > limit;

	return (
		<div>
			<h2 className="text-2xl font-light text-secondary mb-6">Tekniska specifikationer</h2>
			<div className="overflow-hidden rounded-xl border border-primary/20">
				{firstSpec && (
					<div className="flex flex-col sm:flex-row gap-2 px-5 py-4 bg-primary/5">
						<span className="text-sm font-semibold text-secondary w-full sm:w-2/5 shrink-0">{firstSpec.title}</span>
						<span className="text-sm text-muted-foreground">{firstSpec.description}</span>
					</div>
				)}

				{/* Show-all toggle sits directly under the first row */}
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

				<div className="relative">
					{restSpecs.map((spec, index) => (
						<div
							key={spec._id || index}
							className={`flex flex-col sm:flex-row gap-2 px-5 py-4 ${index % 2 === 0 ? "bg-white" : "bg-primary/5"}`}
						>
							<span className="text-sm font-semibold text-secondary w-full sm:w-2/5 shrink-0">{spec.title}</span>
							<span className="text-sm text-muted-foreground">{spec.description}</span>
						</div>
					))}
					{isCapped && (
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
					)}
				</div>
			</div>
		</div>
	);
}
