"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	TechnologyGroupForm,
	type TechnologyGroupFormData,
} from "@/components/admin/TechnologyGroupForm";

export default function NewTechnologyGroupPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const [isSaving, setIsSaving] = React.useState(false);

	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/technology-categories/new");
		}
	}, [session, isPending, router]);

	const handleSubmit = async (data: TechnologyGroupFormData) => {
		setIsSaving(true);
		try {
			const res = await fetch("/api/technology-groups", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const result = await res.json();

			if (result.success) {
				toast.success("Technology group created");
				router.push(`/dashboard/technology-categories/${result.data._id}`);
			} else {
				toast.error(result.message || "Failed to create group");
			}
		} catch (error) {
			toast.error("Failed to create group", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
		} finally {
			setIsSaving(false);
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
		<div className="_container py-8">
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Link href="/dashboard/technology-categories">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">Create Technology Group</h1>
						<p className="text-slate-600">
							Add a new technology group with details, image and SEO
						</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Group Details</CardTitle>
					</CardHeader>
					<CardContent>
						<TechnologyGroupForm
							onSubmit={handleSubmit}
							onCancel={() => router.push("/dashboard/technology-categories")}
							isLoading={isSaving}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
