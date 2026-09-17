"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// ============================================================================
// TYPES
// ============================================================================
interface RedirectEntry {
	_id: string;
	fromUrl: string;
	toUrl: string;
	statusCode: number;
	source: "manual" | "auto";
	isActive: boolean;
	createdAt: string;
}

// ============================================================================
// COMPONENT
// ============================================================================
export function RedirectsTab() {
	const [redirects, setRedirects] = useState<RedirectEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const { ConfirmModal, confirm } = useConfirmModal();

	const fetchRedirects = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: "20",
			});
			if (search) params.set("search", search);

			const res = await fetch(`/api/redirects?${params}`);
			if (res.ok) {
				const json: {
					data: RedirectEntry[];
					meta?: { total?: number; totalPages?: number };
				} = await res.json();
				setRedirects(json.data ?? []);
				setTotalPages(json.meta?.totalPages ?? 1);
				setTotal(json.meta?.total ?? 0);
			}
		} catch {
			toast.error("Failed to fetch redirects");
		} finally {
			setLoading(false);
		}
	}, [page, search]);

	useEffect(() => {
		fetchRedirects();
	}, [fetchRedirects]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(searchInput);
			setPage(1);
		}, 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	async function handleToggleActive(redirect: RedirectEntry) {
		try {
			const res = await fetch(`/api/redirects/${redirect._id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive: !redirect.isActive }),
			});
			if (res.ok) {
				fetchRedirects();
			} else {
				toast.error("Failed to update redirect");
			}
		} catch {
			toast.error("Failed to update redirect");
		}
	}

	async function handleDelete(id: string, fromUrl: string) {
		const confirmed = await confirm({
			title: "Delete Redirect",
			description: `Are you sure you want to delete the redirect for "${fromUrl}"?`,
			confirmText: "Delete",
			cancelText: "Cancel",
			variant: "destructive",
		});

		if (!confirmed) return;

		try {
			const res = await fetch(`/api/redirects/${id}`, { method: "DELETE" });
			if (res.ok) {
				toast.success("Redirect deleted");
				fetchRedirects();
			} else {
				toast.error("Failed to delete redirect");
			}
		} catch {
			toast.error("Failed to delete redirect");
		}
	}

	function formatDate(dateString: string) {
		if (!dateString) return "—";
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(dateString));
	}

	return (
		<div className="space-y-6">
			<ConfirmModal />

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between gap-4">
						<div>
							<CardTitle className="flex items-center gap-2">
								<ArrowRightLeft className="h-5 w-5" />
								Redirects
							</CardTitle>
							<CardDescription>
								Create and manage 301/302 redirects for this site.
							</CardDescription>
						</div>
						<AddRedirectDialog onSuccess={fetchRedirects} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<Input
							placeholder="Search redirects..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>

					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : redirects.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							<ArrowRightLeft className="h-10 w-10 mx-auto mb-3 opacity-50" />
							<p>No redirects found</p>
							{search && (
								<p className="text-sm mt-1">Try a different search term</p>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b text-left">
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground">
											From URL
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground">
											To URL
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground text-center">
											Status
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground text-center">
											Source
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground">
											Created
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground text-center">
											Active
										</th>
										<th className="pb-3 font-medium text-sm text-muted-foreground text-center">
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{redirects.map((redirect) => (
										<tr key={redirect._id} className="border-b last:border-0">
											<td className="py-3 pr-4">
												<span className="text-sm font-mono text-blue-600 dark:text-blue-400">
													{redirect.fromUrl}
												</span>
											</td>
											<td className="py-3 pr-4">
												<span className="text-sm font-mono text-green-600 dark:text-green-400 truncate max-w-[240px] block">
													{redirect.toUrl}
												</span>
											</td>
											<td className="py-3 pr-4 text-center">
												<Badge variant="secondary">
													{redirect.statusCode}
												</Badge>
											</td>
											<td className="py-3 pr-4 text-center">
												<Badge
													variant={
														redirect.source === "manual"
															? "outline"
															: "secondary"
													}
												>
													{redirect.source}
												</Badge>
											</td>
											<td className="py-3 pr-4 text-sm text-muted-foreground">
												{formatDate(redirect.createdAt)}
											</td>
											<td className="py-3 pr-4 text-center">
												<Switch
													checked={redirect.isActive}
													onCheckedChange={() =>
														handleToggleActive(redirect)
													}
												/>
											</td>
											<td className="py-3 text-center">
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:text-destructive"
													onClick={() =>
														handleDelete(redirect._id, redirect.fromUrl)
													}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-4 pt-4 border-t">
							<p className="text-sm text-muted-foreground">
								Page {page} of {totalPages} ({total} entries)
							</p>
							<div className="flex gap-2">
								{Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
									const pageNum = i + 1;
									return (
										<Button
											key={pageNum}
											variant={pageNum === page ? "primary" : "outline"}
											size="sm"
											onClick={() => setPage(pageNum)}
										>
											{pageNum}
										</Button>
									);
								})}
								{totalPages > 10 && (
									<span className="text-sm text-muted-foreground flex items-center px-2">
										... {totalPages}
									</span>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// ============================================================================
// ADD REDIRECT DIALOG
// ============================================================================
function AddRedirectDialog({ onSuccess }: { onSuccess: () => void }) {
	const [open, setOpen] = useState(false);
	const [fromUrl, setFromUrl] = useState("");
	const [toUrl, setToUrl] = useState("");
	const [saving, setSaving] = useState(false);

	async function handleSave() {
		if (!fromUrl.trim() || !toUrl.trim()) return;
		setSaving(true);
		try {
			const res = await fetch("/api/redirects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fromUrl: fromUrl.trim(),
					toUrl: toUrl.trim(),
				}),
			});
			if (res.ok) {
				toast.success("Redirect created");
				setOpen(false);
				setFromUrl("");
				setToUrl("");
				onSuccess();
			} else {
				const data = await res.json().catch(() => null);
				toast.error(data?.message || "Failed to create redirect");
			}
		} catch {
			toast.error("Failed to create redirect");
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					Add Redirect
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Redirect</DialogTitle>
					<DialogDescription>
						Create a 301 redirect from an old URL to a new one.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3">
					<div>
						<p className="text-sm font-medium mb-1">From URL</p>
						<Input
							placeholder="/old-page"
							value={fromUrl}
							onChange={(e) => setFromUrl(e.target.value)}
						/>
					</div>
					<div>
						<p className="text-sm font-medium mb-1">To URL</p>
						<Input
							placeholder="/new-page"
							value={toUrl}
							onChange={(e) => setToUrl(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSave()}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="ghost" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={saving || !fromUrl.trim() || !toUrl.trim()}
					>
						{saving ? (
							<Loader2 className="h-4 w-4 animate-spin mr-1" />
						) : null}
						Create Redirect
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
