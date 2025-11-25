"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
	view: "grid" | "list";
	onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
	return (
		<div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background p-1">
			<Button
				variant={view === "grid" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("grid")}
				className={
					view === "grid"
						? "bg-primary text-primary-foreground hover:bg-primary-hover"
						: "text-foreground hover:bg-muted hover:text-foreground"
				}
				aria-label="Grid view"
			>
				<LayoutGrid className="h-4 w-4" />
			</Button>
			<Button
				variant={view === "list" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("list")}
				className={
					view === "list"
						? "bg-primary text-primary-foreground hover:bg-primary-hover"
						: "text-foreground hover:bg-muted hover:text-foreground"
				}
				aria-label="List view"
			>
				<List className="h-4 w-4" />
			</Button>
		</div>
	);
}
