import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	variant?: "default" | "light";
}

export function Breadcrumb({ items, variant = "default" }: BreadcrumbProps) {
	const isLight = variant === "light";

	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex flex-wrap items-center gap-2 text-sm">
				<li>
					<Link
						href="/"
						className={cn(
							"transition-colors",
							isLight
								? "text-white/60 hover:text-primary"
								: "text-secondary/70 hover:text-primary/70"
						)}
					>
						Hem
					</Link>
				</li>
				{items.map((item, index) => (
					<li key={index} className="flex items-center gap-2">
						<ChevronRight className={cn("h-4 w-4", isLight ? "text-white/40" : "text-primary")} />
						{item.href && index < items.length - 1 ? (
							<Link
								href={item.href}
								className={cn(
									"transition-colors",
									isLight
										? "text-white/60 hover:text-primary"
										: "text-muted-foreground hover:text-primary"
								)}
							>
								{item.label}
							</Link>
						) : (
							<span className={cn("font-medium", isLight ? "text-white" : "text-secondary")}>
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
