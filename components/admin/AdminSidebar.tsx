"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Package,
	FolderTree,
	Users,
	HardDrive,
	UserCircle,
	ChevronLeft,
	ChevronRight,
	LogOut,
	Home,
	Menu,
	X,
	MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/logo";

interface NavItem {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	badge?: string;
}

const navItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Products",
		href: "/dashboard/products",
		icon: Package,
	},
	{
		title: "Categories",
		href: "/dashboard/categories",
		icon: FolderTree,
	},
	{
		title: "Inquiries",
		href: "/dashboard/inquiries",
		icon: MessageSquare,
	},
	{
		title: "Users",
		href: "/dashboard/users",
		icon: Users,
	},
	{
		title: "Storage",
		href: "/dashboard/storage",
		icon: HardDrive,
	},
];

const bottomNavItems: NavItem[] = [
	{
		title: "Profile",
		href: "/dashboard/profile",
		icon: UserCircle,
	},
];

interface AdminSidebarProps {
	className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const isActive = (href: string) => {
		if (href === "/dashboard") {
			return pathname === "/dashboard";
		}
		return pathname.startsWith(href);
	};

	const handleSignOut = async () => {
		await authClient.signOut();
		window.location.href = "/";
	};

	const closeMobile = () => setIsMobileOpen(false);

	const renderNavLink = (item: NavItem) => {
		const active = isActive(item.href);

		return (
			<Link
				key={item.href}
				href={item.href}
				onClick={closeMobile}
				className={cn(
					"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
					active
						? "bg-primary text-white shadow-md shadow-primary/20"
						: "text-slate-600 hover:text-slate-900 hover:bg-primary/10"
				)}
			>
				<item.icon
					className={cn(
						"h-5 w-5 shrink-0",
						active ? "text-white" : "text-slate-500"
					)}
				/>
				{!isCollapsed && <span className="truncate">{item.title}</span>}
				{!isCollapsed && item.badge && (
					<span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
						{item.badge}
					</span>
				)}
			</Link>
		);
	};

	const sidebarContent = (
		<>
			{/* Logo */}
			<div className="p-4 border-b border-slate-200">
				<Link
					href="/dashboard"
					className="flex items-center gap-3"
					onClick={closeMobile}
				>
					{isCollapsed ? (
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">S</span>
						</div>
					) : (
						<Logo asLink={false} />
					)}
				</Link>
			</div>

			{/* Main Navigation */}
			<nav className="flex-1 p-3 space-y-1 overflow-y-auto">
				<div className="mb-2">
					{!isCollapsed && (
						<p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
							Main Menu
						</p>
					)}
				</div>
				{navItems.map(renderNavLink)}
			</nav>

			{/* Bottom Navigation */}
			<div className="p-3 border-t border-slate-200 space-y-1">
				{bottomNavItems.map(renderNavLink)}

				{/* Back to Site */}
				<Link
					href="/"
					onClick={closeMobile}
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
						"text-slate-600 hover:text-slate-900 hover:bg-slate-100"
					)}
				>
					<Home className="h-5 w-5 shrink-0 text-slate-500" />
					{!isCollapsed && <span>Back to Site</span>}
				</Link>

				{/* Sign Out */}
				<button
					onClick={handleSignOut}
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full",
						"text-red-600 hover:text-red-700 hover:bg-red-50"
					)}
				>
					<LogOut className="h-5 w-5 shrink-0" />
					{!isCollapsed && <span>Sign Out</span>}
				</button>
			</div>

			{/* Collapse Toggle - Desktop only */}
			<div className="hidden lg:block p-3 border-t border-slate-200">
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="flex items-center justify-center w-full py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
				>
					{isCollapsed ? (
						<ChevronRight className="h-5 w-5" />
					) : (
						<>
							<ChevronLeft className="h-5 w-5" />
							<span className="ml-2 text-sm">Collapse</span>
						</>
					)}
				</button>
			</div>
		</>
	);

	return (
		<>
			{/* Mobile Menu Button - only show when sidebar is closed */}
			{!isMobileOpen && (
				<Button
					variant="outline"
					size="icon"
					className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
					onClick={() => setIsMobileOpen(true)}
				>
					<Menu className="h-5 w-5" />
				</Button>
			)}

			{/* Mobile Overlay */}
			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={closeMobile}
				/>
			)}

			{/* Mobile Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
					isMobileOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<button
					onClick={closeMobile}
					className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 z-10"
				>
					<X className="h-5 w-5 text-slate-500" />
				</button>
				<div className="flex flex-col h-full">{sidebarContent}</div>
			</aside>

			{/* Desktop Sidebar */}
			<aside
				className={cn(
					"hidden lg:flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 transition-all duration-300 shrink-0",
					isCollapsed ? "w-[72px]" : "w-64",
					className
				)}
			>
				{sidebarContent}
			</aside>
		</>
	);
}
