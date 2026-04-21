"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	TechnologyGroupForm,
	type TechnologyGroupFormData,
	type ITechnologyGroupInput,
} from "@/components/admin/TechnologyGroupForm";

export default function EditTechnologyGroupPage() {
	const router = useRouter();
	const params = useParams();
	const groupId = params.id as string;
	const { data: session, isPending } = authClient.useSession();

	const [group, setGroup] = React.useState<ITechnologyGroupInput | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);
	const [hasFetched, setHasFetched] = React.useState(false);

	React.useEffect(() => {
		if (!isPending && !session) {
			router.push(`/login?callbackUrl=/dashboard/technology-categories/${groupId}`);
		}
	}, [session, isPending, router, groupId]);

	React.useEffect(() => {
		if (!session || !groupId || hasFetched) return;

		const fetchData = async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/technology-groups/${groupId}`);
				const data = await res.json();
				if (data.success) {
					setGroup(data.data);
				} else {
					toast.error("Technology group not found");
					router.push("/dashboard/technology-categories");
				}
			} catch {
				toast.error("Failed to load group");
				router.push("/dashboard/technology-categories");
			} finally {
				setIsLoading(false);
				setHasFetched(true);
			}
		};

		fetchData();
	}, [session, groupId, router, hasFetched]);

	const handleSubmit = async (data: TechnologyGroupFormData) => {
		setIsSaving(true);
		try {
			const res = await fetch(`/api/technology-groups/${groupId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const result = await res.json();

			if (result.success) {
				setGroup(result.data);
				toast.success("Technology group updated");
			} else {
				toast.error(result.message || "Failed to update group");
			}
		} catch (error) {
			toast.error("Failed to update group", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isPending || isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!session || !group) return null;

	return (
		<div className="_container py-8">
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/technology-categories">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">{group.name}</h1>
							<p className="text-slate-600">/{group.slug}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{!group.isActive && <Badge variant="secondary">Inactive</Badge>}
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Group Details</CardTitle>
					</CardHeader>
					<CardContent>
						<TechnologyGroupForm
							key={group._id}
							group={group}
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
