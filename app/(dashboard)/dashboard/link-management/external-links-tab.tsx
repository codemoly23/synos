"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Loader2,
	ExternalLink,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	Clock,
	RefreshCw,
	Play,
	Square,
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
interface ExternalLinkEntry {
	_id: string;
	url: string;
	sourceModel: string;
	sourceField: string;
	sourceId?: string;
	sourceTitle?: string;
	statusCode?: number;
	status: "ok" | "broken" | "redirect" | "mixed-content" | "timeout" | "error";
	isExternal: boolean;
	responseTime?: number;
	error?: string;
	rel?: string;
}

interface AuditData {
	_id: string;
	status: "running" | "completed" | "failed" | "cancelled";
	totalLinks: number;
	checkedLinks: number;
	externalBrokenLinks: number;
	duration?: number;
	completedAt?: string;
	links?: ExternalLinkEntry[];
}

// ============================================================================
// COMPONENT
// ============================================================================
export function ExternalLinksTab() {
	const [audit, setAudit] = useState<AuditData | null>(null);
	const [loading, setLoading] = useState(true);
	const [starting, setStarting] = useState(false);
	const [filter, setFilter] = useState("all");
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [cancelling, setCancelling] = useState(false);

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => setSearch(searchInput), 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	// Fetch latest audit (external links only)
	const fetchData = useCallback(async () => {
		try {
			const res = await fetch("/api/link-management/audit?latest=true");
			if (res.ok) {
				const data = await res.json();
				if (data?._id) {
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
		fetchData();
	}, [fetchData]);

	// Poll for progress
	useEffect(() => {
		if (!audit || audit.status !== "running") return;

		const interval = setInterval(async () => {
			try {
				const res = await fetch("/api/link-management/audit/status");
				if (res.ok) {
					const data = await res.json();
					if (data.audit?.status === "completed" || data.audit?.status === "cancelled" || data.audit?.status === "failed") {
						await fetchData();
						clearInterval(interval);
					} else if (data.audit) {
						setAudit((prev) => (prev ? { ...prev, ...data.audit } : null));
					}
				}
			} catch {
				// Ignore
			}
		}, 2000);

		return () => clearInterval(interval);
	}, [audit?.status, audit?._id, fetchData]);

	// Start external-only scan
	async function handleStartScan() {
		setStarting(true);
		try {
			const res = await fetch("/api/link-management/audit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: "external" }),
			});

			if (res.status === 409) {
				toast.error("An audit is already running");
				return;
			}

			if (res.ok) {
				const data = await res.json();
				setAudit({ ...data, links: [] });
				toast.success("External link scan started");
			} else {
				toast.error("Failed to start scan");
			}
		} catch {
			toast.error("Failed to start scan");
		} finally {
			setStarting(false);
		}
	}

	// Cancel running audit
	async function handleCancelAudit() {
		setCancelling(true);
		try {
			const res = await fetch("/api/link-management/audit/cancel", {
				method: "POST",
			});

			if (res.ok) {
				toast.success("Scan cancelled");
				setAudit((prev) => (prev ? { ...prev, status: "cancelled" } : null));
			} else {
				toast.error("Failed to cancel scan");
			}
		} catch {
			toast.error("Failed to cancel scan");
		} finally {
			setCancelling(false);
		}
	}

	// Get only external links from audit
	const externalLinks = (audit?.links || []).filter((l) => l.isExternal);

	// Apply filters
	const filteredLinks = externalLinks.filter((link) => {
		if (filter === "dead" && link.status !== "broken" && link.status !== "timeout" && link.status !== "error") return false;
		if (filter === "alive" && link.status !== "ok" && link.status !== "redirect") return false;
		if (filter === "redirect" && link.status !== "redirect") return false;
		if (search && !link.url.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});

	// Stats
	const totalExternal = externalLinks.length;
	const alive = externalLinks.filter((l) => l.status === "ok" || l.status === "redirect").length;
	const dead = externalLinks.filter((l) => l.status === "broken" || l.status === "timeout" || l.status === "error").length;
	const redirects = externalLinks.filter((l) => l.status === "redirect").length;
	const healthPercent = totalExternal > 0 ? Math.round((alive / totalExternal) * 100) : 0;

	function getStatusIcon(status: string) {
		switch (status) {
			case "ok":
				return <CheckCircle2 className="h-4 w-4 text-green-500" />;
			case "broken":
				return <XCircle className="h-4 w-4 text-red-500" />;
			case "redirect":
				return <RefreshCw className="h-4 w-4 text-yellow-500" />;
			case "timeout":
				return <Clock className="h-4 w-4 text-gray-500" />;
			default:
				return <AlertTriangle className="h-4 w-4 text-orange-500" />;
		}
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
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle>External Link Validation</CardTitle>
					<CardDescription>
						Scan outbound links across all content. Identify dead references, expired resources, and maintain clean external link health.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						{audit?.status === "running" ? (
							<Button
								variant="destructive"
								onClick={handleCancelAudit}
								disabled={cancelling}
							>
								{cancelling ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Square className="h-4 w-4 mr-2" />
								)}
								{cancelling ? "Cancelling..." : "Stop Scan"}
							</Button>
						) : (
							<Button
								onClick={handleStartScan}
								disabled={starting}
							>
								{starting ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Play className="h-4 w-4 mr-2" />
								)}
								Scan External Links
							</Button>
						)}
						{audit?.completedAt && (
							<span className="text-sm text-muted-foreground">
								Last scan:{" "}
								{new Date(audit.completedAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						)}
					</div>

					{/* Running progress */}
					{audit?.status === "running" && (
						<div className="mt-4 space-y-2">
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<span>Checking: {audit.checkedLinks || 0} / {audit.totalLinks || "..."}</span>
							</div>
							<Progress
								value={audit.totalLinks ? ((audit.checkedLinks || 0) / audit.totalLinks) * 100 : 0}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Health Overview */}
			{audit && audit.status === "completed" && totalExternal > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>External Links</CardDescription>
							<CardTitle className="text-2xl flex items-center gap-2">
								<ExternalLink className="h-5 w-5" />
								{totalExternal}
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Alive</CardDescription>
							<CardTitle className="text-2xl text-green-600 flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5" />
								{alive}
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Dead / Broken</CardDescription>
							<CardTitle className="text-2xl text-red-600 flex items-center gap-2">
								<XCircle className="h-5 w-5" />
								{dead}
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Health Score</CardDescription>
							<CardTitle className={`text-2xl ${healthPercent >= 80 ? "text-green-600" : healthPercent >= 50 ? "text-yellow-600" : "text-red-600"}`}>
								{healthPercent}%
							</CardTitle>
						</CardHeader>
					</Card>
				</div>
			)}

			{/* Links Table */}
			{audit && audit.status === "completed" && (
				<Card>
					<CardHeader>
						<CardTitle>External Links Health Report</CardTitle>
						<CardDescription>
							{dead > 0
								? `Found ${dead} dead external link${dead > 1 ? "s" : ""} that need attention`
								: "All external links are healthy"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Filters */}
						<div className="flex gap-3 mb-4">
							<Select value={filter} onValueChange={setFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All External</SelectItem>
									<SelectItem value="dead">Dead / Broken</SelectItem>
									<SelectItem value="alive">Alive</SelectItem>
									<SelectItem value="redirect">Redirects</SelectItem>
								</SelectContent>
							</Select>
							<Input
								placeholder="Search URLs..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="flex-1"
							/>
						</div>

						{filteredLinks.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<ExternalLink className="h-8 w-8 mx-auto mb-2 opacity-50" />
								<p>
									{filter !== "all"
										? "No links match this filter"
										: "No external links found. Run a scan first."}
								</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b text-left">
											<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground w-10">Status</th>
											<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">URL</th>
											<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">Found In</th>
											<th className="pb-3 pr-3 font-medium text-sm text-muted-foreground">HTTP</th>
											<th className="pb-3 font-medium text-sm text-muted-foreground">Response</th>
										</tr>
									</thead>
									<tbody>
										{filteredLinks.slice(0, 100).map((link, idx) => (
											<tr
												key={`${link.url}-${idx}`}
												className={`border-b last:border-0 ${
													link.status === "broken" || link.status === "error"
														? "bg-red-50/50 dark:bg-red-950/20"
														: ""
												}`}
											>
												<td className="py-2.5 pr-3">{getStatusIcon(link.status)}</td>
												<td className="py-2.5 pr-3">
													<div className="max-w-[350px]">
														<a
															href={link.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline break-all"
														>
															{link.url.length > 70 ? `${link.url.slice(0, 70)}...` : link.url}
														</a>
														{link.error && (
															<span className="block text-xs text-destructive mt-0.5">{link.error}</span>
														)}
														{link.rel && (
															<Badge variant="secondary" className="mt-1 text-[10px]">
																rel=&quot;{link.rel}&quot;
															</Badge>
														)}
													</div>
												</td>
												<td className="py-2.5 pr-3">
													<span className="text-xs text-muted-foreground">{link.sourceModel}</span>
													{link.sourceTitle && (
														<span className="block text-xs text-muted-foreground truncate max-w-[150px]">
															{link.sourceTitle}
														</span>
													)}
													<span className="block text-xs text-muted-foreground opacity-60">
														{link.sourceField}
													</span>
												</td>
												<td className="py-2.5 pr-3">
													<span
														className={`text-sm font-mono ${
															link.statusCode && link.statusCode >= 400
																? "text-red-600"
																: link.statusCode && link.statusCode >= 300
																	? "text-yellow-600"
																	: ""
														}`}
													>
														{link.statusCode || "—"}
													</span>
												</td>
												<td className="py-2.5">
													<span className="text-xs text-muted-foreground">
														{link.responseTime ? `${link.responseTime}ms` : "—"}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{filteredLinks.length > 100 && (
									<p className="text-sm text-muted-foreground text-center mt-4">
										Showing 100 of {filteredLinks.length} links.
									</p>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
