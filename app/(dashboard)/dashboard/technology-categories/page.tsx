"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Check, X, GripVertical, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";

interface TechGroup {
	_id: string;
	name: string;
	isActive: boolean;
	order: number;
}

export default function TechnologyCategoriesPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [groups, setGroups] = React.useState<TechGroup[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [newName, setNewName] = React.useState("");
	const [isAdding, setIsAdding] = React.useState(false);
	const [editingId, setEditingId] = React.useState<string | null>(null);
	const [editingName, setEditingName] = React.useState("");

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

	const handleAdd = async () => {
		if (!newName.trim()) return;
		setIsAdding(true);
		try {
			const res = await fetch("/api/technology-groups", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: newName.trim(), order: groups.length }),
			});
			const data = await res.json();
			if (data.success) {
				toast.success("Technology group added");
				setNewName("");
				fetchGroups();
			} else {
				toast.error(data.message || "Failed to add group");
			}
		} catch {
			toast.error("Failed to add group");
		} finally {
			setIsAdding(false);
		}
	};

	const handleEdit = async (id: string) => {
		if (!editingName.trim()) return;
		try {
			const res = await fetch(`/api/technology-groups/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: editingName.trim() }),
			});
			const data = await res.json();
			if (data.success) {
				toast.success("Technology group updated");
				setEditingId(null);
				fetchGroups();
			} else {
				toast.error(data.message || "Failed to update group");
			}
		} catch {
			toast.error("Failed to update group");
		}
	};

	const handleToggleActive = async (group: TechGroup) => {
		try {
			const res = await fetch(`/api/technology-groups/${group._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive: !group.isActive }),
			});
			const data = await res.json();
			if (data.success) {
				toast.success(group.isActive ? "Group deactivated" : "Group activated");
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
			description: `Are you sure you want to delete "${name}"? This will not remove the tag from existing products.`,
			confirmText: "Delete",
		});
		if (!confirmed) return;

		try {
			const res = await fetch(`/api/technology-groups/${id}`, { method: "DELETE" });
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
							Manage technology groups shown on the /produkter page sidebar
						</p>
					</div>
					<Badge variant="outline" className="text-base px-3 py-1">
						{groups.length} groups
					</Badge>
				</div>

				{/* Add New Group */}
				<Card>
					<CardHeader>
						<CardTitle>Add Technology Group</CardTitle>
						<CardDescription>
							New groups will appear in the Teknologikategori sidebar on /produkter
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							<Input
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								placeholder="e.g. Alexandrit Laser, Nd:YAG, IPL..."
								onKeyDown={(e) => e.key === "Enter" && handleAdd()}
								className="max-w-sm"
							/>
							<Button onClick={handleAdd} disabled={isAdding || !newName.trim()}>
								<Plus className="h-4 w-4 mr-2" />
								Add
							</Button>
						</div>
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
									<div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />
								))}
							</div>
						) : groups.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								<p>No technology groups yet</p>
								<p className="text-sm mt-1">Add your first group above</p>
							</div>
						) : (
							<div className="space-y-1">
								{groups.map((group) => (
									<div
										key={group._id}
										className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 group"
									>
										<GripVertical className="h-4 w-4 text-slate-300 shrink-0" />

										{editingId === group._id ? (
											<>
												<Input
													value={editingName}
													onChange={(e) => setEditingName(e.target.value)}
													className="h-8 flex-1 max-w-sm"
													autoFocus
													onKeyDown={(e) => {
														if (e.key === "Enter") handleEdit(group._id);
														if (e.key === "Escape") setEditingId(null);
													}}
												/>
												<Button
													size="icon"
													variant="ghost"
													className="h-8 w-8"
													onClick={() => handleEdit(group._id)}
												>
													<Check className="h-4 w-4 text-green-600" />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													className="h-8 w-8"
													onClick={() => setEditingId(null)}
												>
													<X className="h-4 w-4 text-red-500" />
												</Button>
											</>
										) : (
											<>
												<span className="flex-1 font-medium">{group.name}</span>
												{!group.isActive && (
													<Badge variant="secondary" className="text-xs">
														Inactive
													</Badge>
												)}
												<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8"
														onClick={() => {
															setEditingId(group._id);
															setEditingName(group.name);
														}}
													>
														<Edit2 className="h-4 w-4" />
													</Button>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8"
														onClick={() => handleToggleActive(group)}
														title={group.isActive ? "Deactivate" : "Activate"}
													>
														{group.isActive ? (
															<EyeOff className="h-4 w-4 text-slate-500" />
														) : (
															<Eye className="h-4 w-4 text-green-600" />
														)}
													</Button>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
														onClick={() => handleDelete(group._id, group.name)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</>
										)}
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
