"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Package, GraduationCap, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
	{
		label: "Hem",
		href: "/",
		icon: Home,
	},
	{
		label: "Utrustning",
		href: "/produkter",
		icon: Package,
	},
	{
		label: "Utbildning",
		href: "/utbildningar",
		icon: GraduationCap,
	},
	{
		label: "Kontakt",
		href: "/kontakt",
		icon: Phone,
	},
];

export function MobileBottomNav() {
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	return (
		<>
			{/* Spacer to prevent content from being hidden behind the fixed nav */}
			<div className="h-20 md:hidden" aria-hidden="true" />

			{/* Fixed Bottom Navigation - Mobile Only */}
			<nav
				className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-border shadow-lg"
				aria-label="Mobile navigation"
			>
				<div className="flex items-center justify-around h-20 px-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const active = isActive(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[70px]",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
									active
										? "text-primary bg-primary/10"
										: "text-muted-foreground hover:text-primary hover:bg-primary/5"
								)}
								aria-current={active ? "page" : undefined}
							>
								<Icon
									className={cn(
										"w-6 h-6 transition-transform duration-200",
										active && "scale-110"
									)}
									aria-hidden="true"
								/>
								<span
									className={cn(
										"text-xs font-medium transition-all duration-200",
										active && "font-semibold"
									)}
								>
									{item.label}
								</span>
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}

