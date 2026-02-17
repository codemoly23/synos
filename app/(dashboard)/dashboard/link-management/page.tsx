"use client";

import { Palette, BarChart3, ScanSearch, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Custom404Form } from "./custom-404-form";
import { FourOhFourLogsTable } from "./four-oh-four-logs-table";
import { LinkAuditTab } from "./link-audit-tab";
import { ExternalLinksTab } from "./external-links-tab";

export default function LinkManagementPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Link Management
				</h1>
				<p className="text-muted-foreground">
					Manage links, audit link health, and customize the 404 error page.
				</p>
			</div>

			<Tabs defaultValue="link-audit" className="space-y-6">
				<TabsList>
					<TabsTrigger value="link-audit" className="gap-2">
						<ScanSearch className="h-4 w-4" />
						Automated Link Checking
					</TabsTrigger>
					<TabsTrigger value="external-links" className="gap-2">
						<ExternalLink className="h-4 w-4" />
						External Link Validation
					</TabsTrigger>
					<TabsTrigger value="custom-404" className="gap-2">
						<Palette className="h-4 w-4" />
						Custom 404 Page
					</TabsTrigger>
					<TabsTrigger value="404-monitoring" className="gap-2">
						<BarChart3 className="h-4 w-4" />
						404 Monitoring
					</TabsTrigger>
				</TabsList>

				<TabsContent value="link-audit">
					<LinkAuditTab />
				</TabsContent>

				<TabsContent value="external-links">
					<ExternalLinksTab />
				</TabsContent>

				<TabsContent value="custom-404">
					<Custom404Form />
				</TabsContent>

				<TabsContent value="404-monitoring">
					<FourOhFourLogsTable />
				</TabsContent>
			</Tabs>
		</div>
	);
}
