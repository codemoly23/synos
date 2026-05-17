"use client";

import { cn } from "@/lib/utils/cn";

interface EyebrowTagProps {
	children: React.ReactNode;
	className?: string;
}

export function EyebrowTag({ children, className }: EyebrowTagProps) {
	return (
		<p
			className={cn(
				"text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-primary",
				className
			)}
		>
			{children}
		</p>
	);
}
