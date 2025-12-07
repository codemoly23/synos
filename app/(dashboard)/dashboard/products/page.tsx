"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	Copy,
	Send,
	FileText,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface Product {
	_id: string;
	title: string;
	slug: string;
	publishType: "publish" | "draft" | "private";
	visibility: "public" | "hidden";
	productImages: string[];
	categories: { _id: string; name: string; slug: string }[];
	updatedAt: string;
	createdAt: string;
}

interface ProductStats {
	total: number;
	published: number;
	draft: number;
	private: number;
}

/**
 * Products Dashboard Page
 * Lists all products with filtering and management actions
 */
export default function ProductsPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [products, setProducts] = React.useState<Product[]>([]);
	const [stats, setStats] = React.useState<ProductStats | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [filterStatus, setFilterStatus] = React.useState<string>("all");
	const [page, setPage] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(1);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/products");
		}
	}, [session, isPending, router]);

	// Fetch products
	const fetchProducts = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: "10",
			});
			if (searchQuery) params.append("search", searchQuery ?? "");
			if (filterStatus !== "all") params.append("publishType", filterStatus);

			const response = await fetch(`/api/products?${params}`);
			const data = await response.json();

			if (data.success) {
				setProducts(data.data);
				setTotalPages(data.meta?.totalPages || 1);
			}
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setIsLoading(false);
		}
	}, [page, searchQuery, filterStatus]);

	// Fetch stats
	const fetchStats = React.useCallback(async () => {
		try {
			const response = await fetch("/api/products/stats");
			const data = await response.json();
			if (data.success) {
				setStats(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}, []);

	React.useEffect(() => {
		if (session) {
			fetchProducts();
			fetchStats();
		}
	}, [session, fetchProducts, fetchStats]);

	// Handle delete
	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;

		try {
			const response = await fetch(`/api/products/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				fetchProducts();
				fetchStats();
			}
		} catch (error) {
			console.error("Failed to delete product:", error);
		}
	};

	// Handle duplicate
	const handleDuplicate = async (id: string) => {
		try {
			const response = await fetch(`/api/products/${id}/duplicate`, {
				method: "POST",
			});
			const data = await response.json();
			if (data.success) {
				router.push(`/dashboard/products/${data.data._id}`);
			}
		} catch (error) {
			console.error("Failed to duplicate product:", error);
		}
	};

	// Handle publish
	const handlePublish = async (id: string) => {
		try {
			const response = await fetch(`/api/products/${id}/publish`, {
				method: "POST",
			});
			const data = await response.json();
			if (data.success) {
				fetchProducts();
				fetchStats();
			} else {
				alert(data.message || "Failed to publish");
			}
		} catch (error) {
			console.error("Failed to publish product:", error);
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
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Products</h1>
						<p className="text-slate-600">Manage your product catalog</p>
					</div>
					<Link href="/dashboard/products/new">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Product
						</Button>
					</Link>
				</div>

				{/* Stats Cards */}
				{stats && (
					<div className="grid grid-cols-4 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold">{stats.total}</div>
								<p className="text-sm text-slate-600">Total Products</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-green-600">
									{stats.published}
								</div>
								<p className="text-sm text-slate-600">Published</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-yellow-600">
									{stats.draft}
								</div>
								<p className="text-sm text-slate-600">Drafts</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-slate-600">
									{stats.private}
								</div>
								<p className="text-sm text-slate-600">Private</p>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex gap-4">
							<SearchInput
								defaultValue={searchQuery}
								onSearch={(value) => {
									setSearchQuery(value);
									setPage(1);
								}}
								placeholder="Search products..."
								isLoading={isLoading}
								debounceMs={400}
								className="flex-1"
							/>
							<select
								value={filterStatus}
								onChange={(e) => {
									setFilterStatus(e.target.value);
									setPage(1);
								}}
								className="h-11 px-4 rounded-md border border-slate-200"
							>
								<option value="all">All Status</option>
								<option value="publish">Published</option>
								<option value="draft">Draft</option>
								<option value="private">Private</option>
							</select>
						</div>
					</CardContent>
				</Card>

				{/* Products List */}
				<Card>
					<CardHeader>
						<CardTitle>All Products</CardTitle>
						<CardDescription>
							{products.length} products found
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="text-center py-8">Loading...</div>
						) : products.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								No products found
							</div>
						) : (
							<div className="space-y-4">
								{products.map((product) => (
									<div
										key={product._id}
										className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50"
									>
										{/* Thumbnail */}
										<div className="w-16 h-16 bg-slate-100 rounded overflow-hidden shrink-0">
											{product.productImages?.[0] ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={product.productImages[0]}
													alt={product.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<FileText className="h-6 w-6 text-slate-400" />
												</div>
											)}
										</div>

										{/* Info */}
										<div className="flex-1 min-w-0">
											<h3 className="font-medium truncate">
												{product.title}
											</h3>
											<p className="text-sm text-slate-500 truncate">
												/{product.slug}
											</p>
											<div className="flex gap-2 mt-1">
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
											</div>
										</div>

										{/* Categories */}
										<div className="hidden md:flex gap-1 flex-wrap max-w-[200px]">
											{product.categories?.slice(0, 2).map((cat) => (
												<Badge key={cat._id} variant="outline">
													{cat.name}
												</Badge>
											))}
											{product.categories?.length > 2 && (
												<Badge variant="outline">
													+{product.categories.length - 2}
												</Badge>
											)}
										</div>

										{/* Date */}
										<div className="text-sm text-slate-500 hidden lg:block">
											{new Date(
												product.updatedAt
											).toLocaleDateString()}
										</div>

										{/* Actions */}
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent align="end" className="w-48">
												<div className="space-y-1">
													<Link
														href={`/dashboard/products/${product._id}`}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Edit className="h-4 w-4" />
														Edit
													</Link>
													<Link
														href={`/produkter/produkt/${product.slug}`}
														target="_blank"
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Eye className="h-4 w-4" />
														View
													</Link>
													<button
														onClick={() =>
															handleDuplicate(product._id)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Copy className="h-4 w-4" />
														Duplicate
													</button>
													{product.publishType !== "publish" && (
														<button
															onClick={() =>
																handlePublish(product._id)
															}
															className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
														>
															<Send className="h-4 w-4" />
															Publish
														</button>
													)}
													<button
														onClick={() =>
															handleDelete(product._id)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600 w-full"
													>
														<Trash2 className="h-4 w-4" />
														Delete
													</button>
												</div>
											</PopoverContent>
										</Popover>
									</div>
								))}

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="flex justify-center gap-2 pt-4">
										<Button
											variant="outline"
											disabled={page === 1}
											onClick={() => setPage((p) => p - 1)}
										>
											Previous
										</Button>
										<span className="flex items-center px-4">
											Page {page} of {totalPages}
										</span>
										<Button
											variant="outline"
											disabled={page === totalPages}
											onClick={() => setPage((p) => p + 1)}
										>
											Next
										</Button>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
