"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ICategoryTreeNode } from "@/models/category.model";
/**
 * New Product Page
 */
export default function NewProductPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [categoryTree, setCategoryTree] = React.useState<ICategoryTreeNode[]>([]);
	const [treatmentSuggestions, setTreatmentSuggestions] = React.useState<string[]>([]);
	const [certificationSuggestions, setCertificationSuggestions] = React.useState<string[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/products/new");
		}
	}, [session, isPending, router]);

	// Fetch category tree and tags
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const [treeRes, tagsRes] = await Promise.all([
					fetch("/api/categories/tree"),
					fetch("/api/products/tags"),
				]);

				const treeData = await treeRes.json();
				const tagsData = await tagsRes.json();

				if (treeData.success) {
					setCategoryTree(treeData.data);
				}
				if (tagsData.success) {
					setTreatmentSuggestions(tagsData.data.treatments || []);
					setCertificationSuggestions(tagsData.data.certifications || []);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		if (session) {
			fetchData();
		}
	}, [session]);

	// Handle save draft
	const handleSaveDraft = async (data: Record<string, unknown>) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				router.push(`/dashboard/products/${result.data._id}`);
			} else {
				alert(result.message || "Failed to create product");
			}
		} catch (error) {
			console.error("Failed to create product:", error);
			alert("Failed to create product");
		} finally {
			setIsLoading(false);
		}
	};

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="_container py-8">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Link href="/dashboard/products">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">Create Product</h1>
						<p className="text-slate-600">Add a new product to your catalog</p>
					</div>
				</div>

				{/* Form */}
				<ProductForm
					categoryTree={categoryTree}
					treatmentSuggestions={treatmentSuggestions}
					certificationSuggestions={certificationSuggestions}
					onSaveDraft={handleSaveDraft}
					onCancel={() => router.push("/dashboard/products")}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
