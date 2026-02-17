"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Loader2,
	Play,
	CheckCircle2,
	XCircle,
	ArrowRight,
	AlertTriangle,
	Shield,
	Clock,
	ExternalLink,
	RefreshCw,
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
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// ============================================================================
// TYPES
// ============================================================================
interface AuditedLink {
	_id: string;
	url: string;
	sourceModel: string;
	sourceField: string;
	sourceId?: string;
	sourceTitle?: string;
	statusCode?: number;
	status: "ok" | "broken" | "redirect" | "mixed-content" | "timeout" | "error";
	redirectChain?: string[];
	isExternal: boolean;
	isMixedContent: boolean;
	responseTime?: number;
	error?: string;
}

interface AuditReport {
	_id: string;
	status: "running" | "completed" | "failed";
	type: string;
	totalLinks: number;
	checkedLinks: number;
	brokenLinks: number;
	redirectLinks: number;
	mixedContentLinks: number;
	externalBrokenLinks: number;
	okLinks: number;
	timeoutLinks: number;
	duration?: number;
	links?: AuditedLink[];
	startedAt: string;
	completedAt?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================
export function LinkAuditTab() {
	const [audit, setAudit] = useState<AuditReport | null>(null);
	const [loading, setLoading] = useState(true);
	const [starting, setStarting] = useState(false);
	const [filter, setFilter] = useState("all");
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [scanType, setScanType] = useState<"full" | "internal" | "external">("full");

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => setSearch(searchInput), 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	// Fetch latest audit
	const fetchLatestAudit = useCallback(async () => {
		try {
			const res = await fetch("/api/link-management/audit?latest=true");
			if (res.ok) {
				const data = await res.json();
				if (data) {
					// If we have an audit ID, fetch full data with links
					const fullRes = await fetch(`/api/link-management/audit/${data._id}`);
					if (fullRes.ok) {
						setAudit(await fullRes.json());
					}
				}
			}
		} catch {
			// Ignore
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLatestAudit();
	}, [fetchLatestAudit]);

	// Poll for progress if audit is running
	useEffect(() => {
		if (!audit || audit.status !== "running") return;

		const interval = setInterval(async () => {
			try {
				const res = await fetch("/api/link-management/audit/status");
				if (res.ok) {
					const data = await res.json();
					if (data.audit) {
						if (data.audit.status === "completed") {
							// Fetch full audit with links
							const fullRes = await fetch(`/api/link-management/audit/${data.audit._id}`);
							if (fullRes.ok) {
								setAudit(await fullRes.json());
							}
							clearInterval(interval);
						} else {
							setAudit((prev) =>
								prev
									? {
											...prev,
											...data.audit,
										}
									: null
							);
						}
					}
				}
			} catch {
				// Ignore polling errors
			}
		}, 2000);

		return () => clearInterval(interval);
	}, [audit?.status, audit?._id]);

	// Start new audit
	async function handleStartAudit() {
		setStarting(true);
		try {
			const res = await fetch("/api/link-management/audit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: scanType }),
			});

			if (res.status === 409) {
				toast.error("An audit is already running");
				return;
			}

			if (res.ok) {
				const data = await res.json();
				setAudit({ ...data, links: [] });
				toast.success("Link audit started");
			} else {
				toast.error("Failed to start audit");
			}
		} catch {
			toast.error("Failed to start audit");
		} finally {
			setStarting(false);
		}
	}

	// Filter links
	const filteredLinks = (audit?.links || []).filter((link) => {
		if (filter !== "all" && link.status !== filter) return false;
		if (search && !link.url.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});

	// Status badge
	function getStatusBadge(status: string) {
		switch (status) {
			case "ok":
				return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">OK</Badge>;
			case "broken":
				return <Badge variant="destructive">Broken</Badge>;
			case "redirect":
				return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Redirect</Badge>;
			case "mixed-content":
				return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Mixed HTTP</Badge>;
			case "timeout":
				return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Timeout</Badge>;
			case "error":
				return <Badge variant="secondary">Error</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	}

	function formatDuration(ms?: number) {
		if (!ms) return "—";
		if (ms < 1000) return `${ms}ms`;
		return `${(ms / 1000).toFixed(1)}s`;
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Start Scan Card */}
			<Card>
				<CardHeader>
					<CardTitle>Link Audit</CardTitle>
					<CardDescription>
						Scan all site content for broken links, redirect chains, mixed HTTP/HTTPS, and external broken links.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<Select value={scanType} onValueChange={(v) => setScanType(v as typeof scanType)}>
							<SelectTrigger className="w-[200px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="full">Full Scan (All Links)</SelectItem>
								<SelectItem value="internal">Internal Links Only</SelectItem>
								<SelectItem value="external">External Links Only</SelectItem>
							</SelectContent>
						</Select>
						<Button
							onClick={handleStartAudit}
							disabled={starting || audit?.status === "running"}
						>
							{starting || audit?.status === "running" ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Play className="h-4 w-4 mr-2" />
							)}
							{audit?.status === "running" ? "Scanning..." : "Start Scan"}
						</Button>
					</div>

					{/* Progress Bar */}
					{audit?.status === "running" && (
						<div className="mt-4 space-y-2">
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<span>
									Checking links: {audit.checkedLinks || 0} / {audit.totalLinks || "..."}
								</span>
								<span>
									{audit.totalLinks
										? `${Math.round(((audit.checkedLinks || 0) / audit.totalLinks) * 100)}%`
										: "Extracting..."}
								</span>
							</div>
							<Progress
								value={
									audit.totalLinks
										? ((audit.checkedLinks || 0) / audit.totalLinks) * 100
										: 0
								}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results */}
			{audit && audit.status !== "running" && (
				<>
					{/* Stats Cards */}
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs">Total</CardDescription>
								<CardTitle className="text-xl">{audit.totalLinks}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs flex items-center gap-1">
									<CheckCircle2 className="h-3 w-3 text-green-500" /> OK
								</CardDescription>
								<CardTitle className="text-xl text-green-600">{audit.okLinks}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs flex items-center gap-1">
									<XCircle className="h-3 w-3 text-red-500" /> Broken
								</CardDescription>
								<CardTitle className="text-xl text-red-600">{audit.brokenLinks}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs flex items-center gap-1">
									<ArrowRight className="h-3 w-3 text-yellow-500" /> Redirects
								</CardDescription>
								<CardTitle className="text-xl text-yellow-600">{audit.redirectLinks}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs flex items-center gap-1">
									<Shield className="h-3 w-3 text-orange-500" /> Mixed HTTP
								</CardDescription>
								<CardTitle className="text-xl text-orange-600">{audit.mixedContentLinks}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs flex items-center gap-1">
									<ExternalLink className="h-3 w-3 text-red-500" /> Ext. Broken
								</CardDescription>
								<CardTitle className="text-xl text-red-600">{audit.externalBrokenLinks}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2 pt-4 px-4">
								<CardDescription className="text-xs flex items-center gap-1">
									<Clock className="h-3 w-3" /> Duration
								</CardDescription>
								<CardTitle className="text-xl">{formatDuration(audit.duration)}</CardTitle>
							</CardHeader>
						</Card>
					</div>

					{/* Links Table */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Audit Results</CardTitle>
									<CardDescription>
										{audit.status === "completed"
											? `Scanned ${audit.totalLinks} links`
											: `Scan ${audit.status}`}
										{audit.completedAt &&
											` — ${new Date(audit.completedAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}`}
									</CardDescription>
								</div>
								<Button variant="outline" size="sm" onClick={fetchLatestAudit}>
									<RefreshCw className="h-4 w-4 mr-1" />
									Refresh
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{/* Filters */}
							<div className="flex gap-3 mb-4">
								<Select value={filter} onValueChange={setFilter}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Filter by status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Links</SelectItem>
										<SelectItem value="broken">Broken</SelectItem>
										<SelectItem value="redirect">Redirects</SelectItem>
										<SelectItem value="mixed-content">Mixed HTTP</SelectItem>
										<SelectItem value="timeout">Timeout</SelectItem>
										<SelectItem value="error">Errors</SelectItem>
										<SelectItem value="ok">OK</SelectItem>
									</SelectContent>
								</Select>
								<Input
									placeholder="Search URLs..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									className="flex-1"
								/>
							</div>

							{/* Table */}
							{filteredLinks.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
									<p>{filter !== "all" ? "No links match this filter" : "No links found"}</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b text-left">
												<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">Status</th>
												<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">URL</th>
												<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">Source</th>
												<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">Code</th>
												<th className="pb-3 font-medium text-sm text-muted-foreground">Time</th>
											</tr>
										</thead>
										<tbody>
											{filteredLinks.slice(0, 100).map((link, idx) => (
												<tr key={`${link.url}-${idx}`} className="border-b last:border-0">
													<td className="py-2.5 pr-3">
														{getStatusBadge(link.status)}
													</td>
													<td className="py-2.5 pr-3">
														<div className="max-w-[400px]">
															<span className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
																{link.url.length > 80 ? `${link.url.slice(0, 80)}...` : link.url}
															</span>
															{link.isExternal && (
																<ExternalLink className="inline h-3 w-3 ml-1 text-muted-foreground" />
															)}
															{link.error && (
																<span className="block text-xs text-destructive mt-0.5">{link.error}</span>
															)}
															{link.redirectChain && link.redirectChain.length > 0 && (
																<span className="block text-xs text-muted-foreground mt-0.5">
																	Chain: {link.redirectChain.length} redirect{link.redirectChain.length > 1 ? "s" : ""}
																</span>
															)}
														</div>
													</td>
													<td className="py-2.5 pr-3">
														<span className="text-xs text-muted-foreground">
															{link.sourceModel}
														</span>
														{link.sourceTitle && (
															<span className="block text-xs text-muted-foreground truncate max-w-[150px]">
																{link.sourceTitle}
															</span>
														)}
													</td>
													<td className="py-2.5 pr-3">
														<span className="text-sm font-mono">
															{link.statusCode || "—"}
														</span>
													</td>
													<td className="py-2.5">
														<span className="text-xs text-muted-foreground">
															{formatDuration(link.responseTime)}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
									{filteredLinks.length > 100 && (
										<p className="text-sm text-muted-foreground text-center mt-4">
											Showing 100 of {filteredLinks.length} links. Use filters to narrow results.
										</p>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
