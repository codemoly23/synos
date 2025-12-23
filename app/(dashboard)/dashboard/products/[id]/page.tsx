"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ProductForm,
	type ProductFormData,
	type ProductFormResult,
	normalizeCategories,
} from "@/components/admin/ProductForm";
import type { IProduct } from "@/models/product.model";
import type { ICategoryTreeNode } from "@/models/category.model";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Edit Product Page
 */
export default function EditProductPage() {
	const router = useRouter();
	const params = useParams();
	const productId = params.id as string;
	const { data: session, isPending } = authClient.useSession();

	const [product, setProduct] = useState<IProduct | null>(null);
	const [categoryTree, setCategoryTree] = useState<ICategoryTreeNode[]>([]);
	const [treatmentSuggestions, setTreatmentSuggestions] = useState<string[]>(
		[]
	);
	const [certificationSuggestions, setCertificationSuggestions] = useState<
		string[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	// Track if initial data has been fetched to prevent refetching on tab switch
	const hasFetchedRef = useRef(false);

	// Redirect if not authenticated
	useEffect(() => {
		if (!isPending && !session) {
			router.push(`/login?callbackUrl=/dashboard/products/${productId}`);
		}
	}, [session, isPending, router, productId]);

	// Format validation errors for user-friendly display
	const formatValidationErrors = (
		errors: unknown
	): { summary: string; details: string[] } => {
		if (!errors) return { summary: "", details: [] };

		if (Array.isArray(errors)) {
			// Formatted validation errors: { field, message, path }
			const details = errors.map(
				(err: {
					field?: string;
					message?: string;
					path?: (string | number)[];
				}) => {
					// Use field (formatted label) if available, otherwise join path array
					const field =
						err.field ||
						(Array.isArray(err.path) ? err.path.join(".") : "Field");
					return `• ${field}: ${err.message || "Invalid value"}`;
				}
			);
			return {
				summary:
					errors.length === 1
						? `Valideringsfel: ${errors[0]?.field || "Okänt fält"}`
						: `${errors.length} valideringsfel hittades`,
				details,
			};
		}

		if (typeof errors === "object") {
			const details = Object.entries(errors).map(
				([field, msg]) => `• ${field}: ${msg}`
			);
			return {
				summary: `${details.length} valideringsfel hittades`,
				details,
			};
		}

		return { summary: String(errors), details: [] };
	};

	// Fetch product and related data - only once when authenticated
	useEffect(() => {
		// Skip if already fetched or no session yet
		if (hasFetchedRef.current || !session || !productId) {
			return;
		}

		const fetchData = async () => {
			hasFetchedRef.current = true;
			setIsLoading(true);
			try {
				const [productRes, treeRes, tagsRes] = await Promise.all([
					fetch(`/api/products/${productId}`),
					fetch("/api/categories/tree"),
					fetch("/api/products/tags"),
				]);

				const productData = await productRes.json();
				const treeData = await treeRes.json();
				const tagsData = await tagsRes.json();

				if (productData.success) {
					setProduct(productData.data);
				} else {
					// alert("Product not found");
					toast.error("Product not found");
					router.push("/dashboard/products");
				}

				if (treeData.success) {
					setCategoryTree(treeData.data);
				}
				if (tagsData.success) {
					setTreatmentSuggestions(tagsData.data.treatments || []);
					setCertificationSuggestions(tagsData.data.certifications || []);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
				// alert("Failed to load product");
				toast.error("Failed to load product");
				router.push("/dashboard/products");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [session, productId, router]);

	// Handle save draft
	const handleSaveDraft = async (
		data: ProductFormData
	): Promise<ProductFormResult> => {
		setIsSaving(true);
		try {
			const payload = {
				...data,
				categories: normalizeCategories(data.categories),
			};

			const response = await fetch(`/api/products/${productId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (result.success) {
				setProduct(result.data);
				toast.success("Product saved successfully");
				return { success: true, data: result.data };
			} else {
				const { summary, details } = result.errors
					? formatValidationErrors(result.errors)
					: { summary: "", details: [] };
				const errorMessage =
					summary || result.message || "Failed to save product";

				if (details.length > 0) {
					toast.error(errorMessage, {
						description: details.join("\n"),
						duration: 8000,
					});
				} else {
					toast.error(errorMessage);
				}
				return {
					success: false,
					errors: result.errors,
					message: result.message,
				};
			}
		} catch (error) {
			console.error("Failed to save product:", error);
			toast.error("Failed to save product", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
			return { success: false, message: "Failed to save product" };
		} finally {
			setIsSaving(false);
		}
	};

	// Handle publish
	const handlePublish = async (
		data: ProductFormData
	): Promise<ProductFormResult> => {
		setIsSaving(true);
		try {
			// First save the current data
			const payload = {
				...data,
				categories: normalizeCategories(data.categories),
			};

			const saveResponse = await fetch(`/api/products/${productId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const saveResult = await saveResponse.json();

			if (!saveResult.success) {
				const { summary, details } = saveResult.errors
					? formatValidationErrors(saveResult.errors)
					: { summary: "", details: [] };
				const errorMessage =
					summary || saveResult.message || "Failed to save product";

				if (details.length > 0) {
					toast.error(errorMessage, {
						description: details.join("\n"),
						duration: 8000,
					});
				} else {
					toast.error(errorMessage);
				}
				return {
					success: false,
					errors: saveResult.errors,
					message: saveResult.message,
				};
			}

			// Then publish
			const publishResponse = await fetch(
				`/api/products/${productId}/publish`,
				{ method: "POST" }
			);

			const publishResult = await publishResponse.json();

			if (publishResult.success) {
				setProduct(publishResult.data.product);
				toast.success("Product published successfully");
				return {
					success: true,
					data: publishResult.data.product,
					warnings: publishResult.data.warnings,
				};
			} else {
				// Format and show validation errors
				const { summary, details } = publishResult.errors
					? formatValidationErrors(publishResult.errors)
					: { summary: "", details: [] };
				const errorMessage =
					summary || publishResult.message || "Failed to publish product";

				if (details.length > 0) {
					toast.error(errorMessage, {
						description: details.join("\n"),
						duration: 8000,
					});
				} else {
					toast.error(errorMessage);
				}
				return {
					success: false,
					errors: publishResult.errors,
					message: publishResult.message,
				};
			}
		} catch (error) {
			console.error("Failed to publish product:", error);
			toast.error("Failed to publish product", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
			return { success: false, message: "Failed to publish product" };
		} finally {
			setIsSaving(false);
		}
	};

	// Handle validate
	const handleValidate = async (id: string) => {
		const response = await fetch(`/api/products/${id}/validate`);
		const result = await response.json();

		if (result.success) {
			return result.data;
		} else {
			throw new Error(result.message || "Failed to validate");
		}
	};

	if (isPending || isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!session || !product) {
		return null;
	}

	return (
		<div className="_container py-8">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/products">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">{product.title}</h1>
							<p className="text-slate-600">/{product.slug}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge
							variant={
								product.publishType === "publish"
									? "default"
									: "secondary"
							}
						>
							{product.publishType}
						</Badge>
						{product.visibility === "hidden" && (
							<Badge variant="outline">Hidden</Badge>
						)}
						{product.visibility == "public" &&
							product.publishType == "publish" && (
								<Link
									href={`/produkter/produkt/${product.slug}`}
									target="_blank"
								>
									<Button variant="outline" size="sm">
										View Live
									</Button>
								</Link>
							)}
					</div>
				</div>

				{/* Form */}
				<ProductForm
					product={product}
					categoryTree={categoryTree}
					treatmentSuggestions={treatmentSuggestions}
					certificationSuggestions={certificationSuggestions}
					onSaveDraft={handleSaveDraft}
					onPublish={handlePublish}
					onValidate={handleValidate}
					onCancel={() => router.push("/dashboard/products")}
					isLoading={isSaving}
				/>
			</div>
		</div>
	);
}
