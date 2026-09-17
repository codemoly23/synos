"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	EyeOff,
	Tag,
	Settings,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";

interface TechGroup {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	isActive: boolean;
	order: number;
}

export default function TechnologyCategoriesPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [groups, setGroups] = React.useState<TechGroup[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);

	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/technology-categories");
		}
	}, [session, isPending, router]);

	const fetchGroups = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/technology-groups");
			const data = await res.json();
			if (data.success) setGroups(data.data);
		} catch {
			toast.error("Failed to load technology groups");
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (session) fetchGroups();
	}, [session, fetchGroups]);

	const handleToggleActive = async (group: TechGroup) => {
		try {
			const res = await fetch(`/api/technology-groups/${group._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive: !group.isActive }),
			});
			const data = await res.json();
			if (data.success) {
				toast.success(
					group.isActive
						? "Group deactivated successfully"
						: "Group activated successfully"
				);
				fetchGroups();
			} else {
				toast.error(data.message || "Failed to update group");
			}
		} catch {
			toast.error("Failed to update group");
		}
	};

	const handleDelete = async (id: string, name: string) => {
		const confirmed = await confirm({
			title: "Delete Technology Group",
			description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
			confirmText: "Delete",
		});
		if (!confirmed) return;

		try {
			const res = await fetch(`/api/technology-groups/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success) {
				toast.success("Technology group deleted");
				fetchGroups();
			} else {
				toast.error(data.message || "Failed to delete group");
			}
		} catch {
			toast.error("Failed to delete group");
		}
	};

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	if (!session) return null;

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Technology Categories</h1>
						<p className="text-slate-600">
							Manage technology groups shown on the /produkter page
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link href="/dashboard/technology-categories/settings">
							<Button variant="outline">
								<Settings className="h-4 w-4 mr-2" />
								Setting
							</Button>
						</Link>
						<Link href="/dashboard/technology-categories/new">
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Group
							</Button>
						</Link>
					</div>
				</div>

				{/* Stats */}
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{groups.length}</div>
						<p className="text-sm text-slate-600">Total Technology Groups</p>
					</CardContent>
				</Card>

				{/* Groups List */}
				<Card>
					<CardHeader>
						<CardTitle>Technology Groups</CardTitle>
						<CardDescription>
							Active groups are visible in the /produkter sidebar. Products are tagged with these group names.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-14 bg-slate-100 animate-pulse rounded-lg"
									/>
								))}
							</div>
						) : groups.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								<p>No technology groups yet</p>
								<Link href="/dashboard/technology-categories/new">
									<Button variant="outline" className="mt-4">
										Create your first group
									</Button>
								</Link>
							</div>
						) : (
							<div className="space-y-1">
								{groups.map((group) => (
									<div
										key={group._id}
										className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-50 group"
									>
										<Tag className="h-5 w-5 text-slate-400 shrink-0" />

										<button
											type="button"
											onClick={() =>
												router.push(
													`/dashboard/technology-categories/${group._id}`
												)
											}
											className="flex-1 text-left font-medium hover:text-primary transition-colors"
										>
											{group.name}
										</button>

										<Badge variant="outline" className="text-xs font-mono">
											{group.order}
										</Badge>

										{!group.isActive && (
											<Badge variant="secondary" className="text-xs">
												Inactive
											</Badge>
										)}

										<span className="text-sm text-slate-500 hidden md:block">
											/{group.slug}
										</span>

										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent align="end" className="w-40">
												<div className="space-y-1">
													<button
														onClick={() =>
															router.push(
																`/dashboard/technology-categories/${group._id}`
															)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Edit className="h-4 w-4" />
														Edit
													</button>
													<button
														onClick={() => handleToggleActive(group)}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														{group.isActive ? (
															<>
																<EyeOff className="h-4 w-4" />
																Deactivate
															</>
														) : (
															<>
																<Eye className="h-4 w-4" />
																Activate
															</>
														)}
													</button>
													<button
														onClick={() =>
															handleDelete(group._id, group.name)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600 w-full"
													>
														<Trash2 className="h-4 w-4" />
														Delete
													</button>
												</div>
											</PopoverContent>
										</Popover>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
