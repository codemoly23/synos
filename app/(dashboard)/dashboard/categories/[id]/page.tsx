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
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { ICategory, ICategoryTreeNode } from "@/models/category.model";

/**
 * Edit Category Page
 */
export default function EditCategoryPage() {
	const router = useRouter();
	const params = useParams();
	const categoryId = params.id as string;
	const { data: session, isPending } = authClient.useSession();

	const [category, setCategory] = React.useState<ICategory | null>(null);
	const [categoryTree, setCategoryTree] = React.useState<ICategoryTreeNode[]>(
		[]
	);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push(`/login?callbackUrl=/dashboard/categories/${categoryId}`);
		}
	}, [session, isPending, router, categoryId]);

	// Fetch category and tree
	React.useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [categoryRes, treeRes] = await Promise.all([
					fetch(`/api/categories/${categoryId}`),
					fetch("/api/categories/tree"),
				]);

				const categoryData = await categoryRes.json();
				const treeData = await treeRes.json();

				if (categoryData.success) {
					setCategory(categoryData.data);
				} else {
					toast.error("Category not found");
					router.push("/dashboard/categories");
				}

				if (treeData.success) {
					setCategoryTree(treeData.data);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
				toast.error("Failed to load category");
				router.push("/dashboard/categories");
			} finally {
				setIsLoading(false);
			}
		};

		if (session && categoryId) {
			fetchData();
		}
	}, [session, categoryId, router]);

	// Handle submit
	const handleSubmit = async (data: Record<string, unknown>) => {
		setIsSaving(true);
		try {
			const response = await fetch(`/api/categories/${categoryId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				setCategory(result.data);
				toast.success("Category updated successfully");
			} else {
				toast.error(result.message || "Failed to update category");
			}
		} catch (error) {
			console.error("Failed to update category:", error);
			toast.error("Failed to update category");
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

	if (!session || !category) {
		return null;
	}

	return (
		<div className="_container py-8">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/categories">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">{category.name}</h1>
							<p className="text-slate-600">/{category.slug}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{!category.isActive && (
							<Badge variant="secondary">Inactive</Badge>
						)}
					</div>
				</div>

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Category Details</CardTitle>
					</CardHeader>
					<CardContent>
						<CategoryForm
							category={category}
							categoryTree={categoryTree}
							onSubmit={handleSubmit}
							onCancel={() => router.push("/dashboard/categories")}
							isLoading={isSaving}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
