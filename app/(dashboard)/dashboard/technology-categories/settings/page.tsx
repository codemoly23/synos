"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";

const TextEditor = dynamic(() => import("@/components/common/TextEditor"), { ssr: false });

export default function TechnologyCategoriesSettingsPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [isLoading, setIsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);
	const [description, setDescription] = React.useState("");

	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/technology-categories/settings");
		}
	}, [session, isPending, router]);

	React.useEffect(() => {
		if (!session) return;
		async function fetchData() {
			try {
				const res = await fetch("/api/technology-categories-page");
				if (res.ok) {
					const json = await res.json();
					const data = json?.data ?? json;
					setDescription(data?.description ?? "");
				} else {
					toast.error("Failed to fetch settings");
				}
			} catch {
				toast.error("Failed to fetch settings");
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [session]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const res = await fetch("/api/technology-categories-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ description }),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success("Settings saved successfully");
				setDescription(data?.data?.description ?? data?.description ?? description);
			} else {
				toast.error(data?.message || "Failed to save settings");
			}
		} catch {
			toast.error("Failed to save settings");
		} finally {
			setIsSaving(false);
		}
	};

	if (isPending || isLoading) return <CMSPageSkeleton />;
	if (!session) return null;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<Link href="/dashboard/technology-categories">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Technology Categories Settings</h1>
						<p className="text-muted-foreground">
							Manage the description shown below the product grid on the Klinikutrustning page.
						</p>
					</div>
				</div>
				<a
					href="/klinikutrustning"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			{/* Description Card */}
			<Card>
				<CardHeader>
					<CardTitle>Page Description</CardTitle>
					<CardDescription>
						This content is displayed below the product grid on the /klinikutrustning page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TextEditor
						name="description"
						defaultValue={description}
						onChange={(value) => setDescription(value)}
						placeholder="Enter description for the technology categories page..."
						variant="detailedAdvance"
						height="400px"
					/>
				</CardContent>
			</Card>

			{/* Save Button */}
			<div className="flex justify-end">
				<Button onClick={handleSave} disabled={isSaving} size="lg">
					{isSaving ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Saving...
						</>
					) : (
						"Save Changes"
					)}
				</Button>
			</div>
		</div>
	);
}
