"use client";

import { Palette, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Custom404Form } from "./custom-404-form";
import { FourOhFourLogsTable } from "./four-oh-four-logs-table";

export default function LinkManagementPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Link Management
				</h1>
				<p className="text-muted-foreground">
					Customize the 404 error page and monitor broken links.
				</p>
			</div>

			<Tabs defaultValue="custom-404" className="space-y-6">
				<TabsList>
					<TabsTrigger value="custom-404" className="gap-2">
						<Palette className="h-4 w-4" />
						Custom 404 Page
					</TabsTrigger>
					<TabsTrigger value="404-monitoring" className="gap-2">
						<BarChart3 className="h-4 w-4" />
						404 Monitoring
					</TabsTrigger>
				</TabsList>

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
