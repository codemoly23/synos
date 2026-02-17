"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Loader2,
	Trash2,
	ExternalLink,
	Plus,
	AlertTriangle,
	BarChart3,
	ArrowUpDown,
	X,
	Check,
} from "lucide-react";

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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// ============================================================================
// TYPES
// ============================================================================
interface FourOhFourLogEntry {
	_id: string;
	url: string;
	hits: number;
	lastHitAt: string;
	firstHitAt: string;
	referrer?: string;
	redirectUrl?: string;
	isRedirectActive: boolean;
}

interface PaginatedResponse {
	data: FourOhFourLogEntry[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

interface Stats {
	totalEntries: number;
	totalHits: number;
	activeRedirects: number;
}

// ============================================================================
// COMPONENT
// ============================================================================
export function FourOhFourLogsTable() {
	const [logs, setLogs] = useState<FourOhFourLogEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("-hits");
	const [stats, setStats] = useState<Stats>({
		totalEntries: 0,
		totalHits: 0,
		activeRedirects: 0,
	});

	const { ConfirmModal, confirm } = useConfirmModal();

	// Fetch logs
	const fetchLogs = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: "20",
				sort,
			});
			if (search) params.set("search", search);

			const res = await fetch(`/api/404-logs?${params}`);
			if (res.ok) {
				const data: PaginatedResponse = await res.json();
				setLogs(data.data);
				setTotalPages(data.totalPages);
				setTotal(data.total);
			}
		} catch {
			toast.error("Failed to fetch 404 logs");
		} finally {
			setLoading(false);
		}
	}, [page, search, sort]);

	// Fetch stats
	const fetchStats = useCallback(async () => {
		try {
			const res = await fetch("/api/404-logs?page=1&limit=1");
			if (res.ok) {
				const data = await res.json();
				// Calculate stats from response
				setStats({
					totalEntries: data.total || 0,
					totalHits: 0, // Will be shown from individual entries
					activeRedirects: 0,
				});
			}
		} catch {
			// Ignore stats fetch errors
		}
	}, []);

	useEffect(() => {
		fetchLogs();
	}, [fetchLogs]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	// Handle search with debounce
	const [searchInput, setSearchInput] = useState("");
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(searchInput);
			setPage(1);
		}, 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	// Delete a log entry
	async function handleDelete(id: string, url: string) {
		const confirmed = await confirm({
			title: "Delete 404 Log",
			description: `Are you sure you want to delete the log entry for "${url}"?`,
			confirmText: "Delete",
			cancelText: "Cancel",
			variant: "destructive",
		});

		if (!confirmed) return;

		try {
			const res = await fetch(`/api/404-logs/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				toast.success("Log entry deleted");
				fetchLogs();
				fetchStats();
			} else {
				toast.error("Failed to delete log entry");
			}
		} catch {
			toast.error("Failed to delete log entry");
		}
	}

	// Format date
	function formatDate(dateString: string) {
		if (!dateString) return "—";
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	}

	// Toggle sort
	function toggleSort() {
		setSort((prev) => (prev === "-hits" ? "-lastHitAt" : "-hits"));
		setPage(1);
	}

	return (
		<div className="space-y-6">
			<ConfirmModal />

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Total 404 URLs</CardDescription>
						<CardTitle className="text-2xl">
							{total}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Active Redirects</CardDescription>
						<CardTitle className="text-2xl">
							{logs.filter((l) => l.isRedirectActive).length}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Total Hits</CardDescription>
						<CardTitle className="text-2xl">
							{logs.reduce((sum, l) => sum + l.hits, 0)}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			{/* Header & Search */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5" />
								404 Logs
							</CardTitle>
							<CardDescription>
								Track instances of page not found errors faced
								by users on your website.
							</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={toggleSort}
							className="gap-2"
						>
							<ArrowUpDown className="h-4 w-4" />
							{sort === "-hits"
								? "Sort by Hits"
								: "Sort by Date"}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="mb-4">
						<Input
							placeholder="Search URLs..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>

					{/* Table */}
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : logs.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							<BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-50" />
							<p>No 404 logs found</p>
							{search && (
								<p className="text-sm mt-1">
									Try a different search term
								</p>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b text-left">
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground">
											URL
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground text-center">
											Hits
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground">
											Last Hit Date
										</th>
										<th className="pb-3 pr-4 font-medium text-sm text-muted-foreground">
											Redirection Link
										</th>
										<th className="pb-3 font-medium text-sm text-muted-foreground text-center">
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{logs.map((log) => (
										<tr
											key={log._id}
											className="border-b last:border-0"
										>
											<td className="py-3 pr-4">
												<span className="text-sm font-mono text-blue-600 dark:text-blue-400">
													{log.url}
												</span>
												{log.referrer && (
													<span className="block text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
														From: {log.referrer}
													</span>
												)}
											</td>
											<td className="py-3 pr-4 text-center">
												<Badge variant="secondary">
													{log.hits}
												</Badge>
											</td>
											<td className="py-3 pr-4 text-sm text-muted-foreground">
												{formatDate(log.lastHitAt)}
											</td>
											<td className="py-3 pr-4">
												{log.isRedirectActive &&
												log.redirectUrl ? (
													<div className="flex items-center gap-2">
														<span className="text-sm text-green-600 dark:text-green-400 truncate max-w-[200px]">
															{log.redirectUrl}
														</span>
														<RemoveRedirectButton
															id={log._id}
															onSuccess={() => {
																fetchLogs();
																fetchStats();
															}}
														/>
													</div>
												) : (
													<AddRedirectButton
														id={log._id}
														onSuccess={() => {
															fetchLogs();
															fetchStats();
														}}
													/>
												)}
											</td>
											<td className="py-3 text-center">
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:text-destructive"
													onClick={() =>
														handleDelete(
															log._id,
															log.url
														)
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

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-4 pt-4 border-t">
							<p className="text-sm text-muted-foreground">
								Page {page} of {totalPages} ({total} entries)
							</p>
							<div className="flex gap-2">
								{Array.from(
									{ length: Math.min(totalPages, 10) },
									(_, i) => {
										const pageNum = i + 1;
										return (
											<Button
												key={pageNum}
												variant={
													pageNum === page
														? "primary"
														: "outline"
												}
												size="sm"
												onClick={() =>
													setPage(pageNum)
												}
											>
												{pageNum}
											</Button>
										);
									}
								)}
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
// ADD REDIRECT BUTTON (Popover with input)
// ============================================================================
function AddRedirectButton({
	id,
	onSuccess,
}: {
	id: string;
	onSuccess: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");
	const [saving, setSaving] = useState(false);

	async function handleSave() {
		if (!url.trim()) return;
		setSaving(true);
		try {
			const res = await fetch(`/api/404-logs/${id}/redirect`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ redirectUrl: url.trim() }),
			});
			if (res.ok) {
				toast.success("Redirect added");
				setOpen(false);
				setUrl("");
				onSuccess();
			} else {
				toast.error("Failed to add redirect");
			}
		} catch {
			toast.error("Failed to add redirect");
		} finally {
			setSaving(false);
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1">
					<Plus className="h-3 w-3" />
					Add Link
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="start">
				<div className="space-y-3">
					<div>
						<p className="text-sm font-medium mb-1">
							Redirect URL
						</p>
						<p className="text-xs text-muted-foreground mb-2">
							Enter the URL to redirect this 404 path to.
						</p>
					</div>
					<Input
						placeholder="/new-page or https://..."
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						onKeyDown={(e) =>
							e.key === "Enter" && handleSave()
						}
					/>
					<div className="flex gap-2 justify-end">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={saving || !url.trim()}
						>
							{saving ? (
								<Loader2 className="h-3 w-3 animate-spin mr-1" />
							) : (
								<Check className="h-3 w-3 mr-1" />
							)}
							Save
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

// ============================================================================
// REMOVE REDIRECT BUTTON
// ============================================================================
function RemoveRedirectButton({
	id,
	onSuccess,
}: {
	id: string;
	onSuccess: () => void;
}) {
	const [removing, setRemoving] = useState(false);

	async function handleRemove() {
		setRemoving(true);
		try {
			const res = await fetch(`/api/404-logs/${id}/redirect`, {
				method: "DELETE",
			});
			if (res.ok) {
				toast.success("Redirect removed");
				onSuccess();
			} else {
				toast.error("Failed to remove redirect");
			}
		} catch {
			toast.error("Failed to remove redirect");
		} finally {
			setRemoving(false);
		}
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-6 w-6 text-muted-foreground hover:text-destructive"
			onClick={handleRemove}
			disabled={removing}
		>
			{removing ? (
				<Loader2 className="h-3 w-3 animate-spin" />
			) : (
				<X className="h-3 w-3" />
			)}
		</Button>
	);
}
