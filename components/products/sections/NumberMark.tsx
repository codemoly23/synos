"use client";

import { cn } from "@/lib/utils/cn";

type NumberMarkVariant = "inline" | "list" | "huge";

interface NumberMarkProps {
	number: string;
	variant?: NumberMarkVariant;
	className?: string;
}

/**
 * Decorative "01" / "02" / "03" mark used across feature sections.
 *
 * - `inline` (default): mid-size brand-colored numeral above feature title
 * - `list`: smaller bold numeral, paired with a list item title
 * - `huge`: very large, ultra-light, muted numeral (used as section anchor)
 */
export function NumberMark({
	number,
	variant = "inline",
	className,
}: NumberMarkProps) {
	if (variant === "huge") {
		return (
			<span
				className={cn(
					"block text-slate-300 leading-none select-none",
					"text-7xl sm:text-8xl md:text-[7rem] lg:text-[8rem]",
					className
				)}
				style={{ fontFamily: "var(--font-roboto)", fontWeight: 300 }}
			>
				{number}
			</span>
		);
	}

	if (variant === "list") {
		return (
			<span
				className={cn(
					"text-[#98a7b5] tracking-tight leading-none",
					"text-xl sm:text-2xl",
					className
				)}
				style={{ fontFamily: "var(--font-roboto)", fontWeight: 300 }}
			>
				{number}
			</span>
		);
	}

	return (
		<span
			className={cn(
				"block text-[#98a7b5] tracking-tight leading-none",
				"text-3xl sm:text-4xl",
				className
			)}
			style={{ fontFamily: "var(--font-roboto)", fontWeight: 300 }}
		>
			{number}
		</span>
	);
}
