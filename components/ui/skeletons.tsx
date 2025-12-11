import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

/**
 * Stats Card Skeleton
 * Use for dashboard stat cards (total, published, draft, etc.)
 */
export function StatsCardSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"rounded-xl border bg-card text-card-foreground shadow-sm",
				className
			)}
		>
			<div className="pt-6 px-6 pb-6">
				<Skeleton className="h-8 w-16 mb-2" />
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
	);
}

/**
 * Stats Cards Grid Skeleton
 * Use for grid of 4 stat cards
 */
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<StatsCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Product Row Skeleton
 * Use for product list items with thumbnail, title, badges
 */
export function ProductRowSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 border rounded-lg">
			{/* Thumbnail */}
			<Skeleton className="w-16 h-16 rounded shrink-0" />

			{/* Info */}
			<div className="flex-1 min-w-0 space-y-2">
				<Skeleton className="h-5 w-48" />
				<Skeleton className="h-4 w-32" />
				<div className="flex gap-2">
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>
			</div>

			{/* Categories */}
			<div className="hidden md:flex gap-1">
				<Skeleton className="h-5 w-20 rounded-full" />
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>

			{/* Date */}
			<Skeleton className="h-4 w-24 hidden lg:block" />

			{/* Action button */}
			<Skeleton className="h-8 w-8 rounded" />
		</div>
	);
}

/**
 * Product List Skeleton
 * Use for product listing with multiple rows
 */
export function ProductListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<ProductRowSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Inquiry Row Skeleton
 * Use for submission/inquiry list items
 */
export function InquiryRowSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 border rounded-lg">
			{/* Checkbox */}
			<Skeleton className="w-4 h-4 rounded" />

			{/* Contact Info */}
			<div className="flex-1 min-w-0 space-y-2">
				<Skeleton className="h-5 w-40" />
				<div className="flex gap-3">
					<Skeleton className="h-4 w-36" />
					<Skeleton className="h-4 w-28" />
				</div>
			</div>

			{/* Type Badge */}
			<Skeleton className="h-6 w-28 rounded-full hidden md:block" />

			{/* Status Badge */}
			<Skeleton className="h-5 w-16 rounded-full hidden lg:block" />

			{/* Date */}
			<Skeleton className="h-4 w-24 hidden lg:block" />

			{/* Action button */}
			<Skeleton className="h-8 w-8 rounded" />
		</div>
	);
}

/**
 * Inquiry List Skeleton
 * Use for inquiry listing with header row
 */
export function InquiryListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{/* Header row */}
			<div className="flex items-center gap-4 px-4 py-2 border-b">
				<Skeleton className="w-4 h-4 rounded" />
				<Skeleton className="h-4 w-24 flex-1" />
				<Skeleton className="h-4 w-16 hidden md:block" />
				<Skeleton className="h-4 w-16 hidden lg:block" />
				<Skeleton className="h-4 w-20 hidden lg:block" />
				<Skeleton className="w-10 h-4" />
			</div>
			{Array.from({ length: count }).map((_, i) => (
				<InquiryRowSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Category Tree Node Skeleton
 */
export function CategoryNodeSkeleton({ level = 0 }: { level?: number }) {
	return (
		<div
			className="flex items-center gap-2 py-2 px-3"
			style={{ marginLeft: `${level * 24}px` }}
		>
			<Skeleton className="w-6 h-6 rounded" />
			<Skeleton className="w-5 h-5 rounded" />
			<Skeleton className="h-5 flex-1 max-w-[200px]" />
			<Skeleton className="h-4 w-24 hidden md:block" />
		</div>
	);
}

/**
 * Category Tree Skeleton
 * Use for hierarchical category list
 */
export function CategoryTreeSkeleton() {
	return (
		<div className="space-y-1">
			<CategoryNodeSkeleton level={0} />
			<CategoryNodeSkeleton level={1} />
			<CategoryNodeSkeleton level={1} />
			<CategoryNodeSkeleton level={2} />
			<CategoryNodeSkeleton level={0} />
			<CategoryNodeSkeleton level={1} />
			<CategoryNodeSkeleton level={0} />
		</div>
	);
}

/**
 * Dashboard Welcome Skeleton
 */
export function DashboardWelcomeSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<Skeleton className="h-9 w-72 mb-2" />
			<Skeleton className="h-5 w-96" />
		</div>
	);
}

/**
 * Dashboard Stats Card Skeleton (larger variant)
 */
export function DashboardStatCardSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<Skeleton className="h-4 w-20 mb-2" />
			<Skeleton className="h-7 w-40" />
			<Skeleton className="h-4 w-24 mt-1" />
		</div>
	);
}

/**
 * Dashboard Profile Section Skeleton
 */
export function DashboardProfileSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<div className="flex items-center justify-between mb-4">
				<Skeleton className="h-7 w-48" />
				<Skeleton className="h-9 w-28 rounded-md" />
			</div>
			<div className="space-y-4">
				<div>
					<Skeleton className="h-4 w-12 mb-1" />
					<Skeleton className="h-5 w-40" />
				</div>
				<div>
					<Skeleton className="h-4 w-12 mb-1" />
					<Skeleton className="h-5 w-52" />
				</div>
			</div>
		</div>
	);
}

/**
 * Dashboard Quick Actions Skeleton
 */
export function DashboardQuickActionsSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<Skeleton className="h-7 w-36 mb-4" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="p-4 border rounded-lg">
					<Skeleton className="h-5 w-32 mb-1" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="p-4 border rounded-lg">
					<Skeleton className="h-5 w-28 mb-1" />
					<Skeleton className="h-4 w-36" />
				</div>
			</div>
		</div>
	);
}

/**
 * Full Dashboard Page Skeleton
 */
export function DashboardPageSkeleton() {
	return (
		<div className="space-y-8">
			<DashboardWelcomeSkeleton />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<DashboardStatCardSkeleton />
				<DashboardStatCardSkeleton />
				<DashboardStatCardSkeleton />
			</div>
			<DashboardProfileSkeleton />
			<DashboardQuickActionsSkeleton />
		</div>
	);
}

/**
 * Search/Filter Bar Skeleton
 */
export function FilterBarSkeleton() {
	return (
		<div className="rounded-xl border bg-card shadow-sm">
			<div className="pt-6 px-6 pb-6">
				<div className="flex gap-4">
					<Skeleton className="h-11 flex-1" />
					<Skeleton className="h-11 w-36" />
				</div>
			</div>
		</div>
	);
}

/**
 * Table Header Skeleton
 */
export function TableHeaderSkeleton() {
	return (
		<div className="flex items-center justify-between mb-4">
			<div>
				<Skeleton className="h-6 w-32 mb-1" />
				<Skeleton className="h-4 w-24" />
			</div>
			<Skeleton className="h-9 w-24 rounded-md" />
		</div>
	);
}

/**
 * Page Header Skeleton
 */
export function PageHeaderSkeleton() {
	return (
		<div className="flex justify-between items-center">
			<div>
				<Skeleton className="h-9 w-40 mb-2" />
				<Skeleton className="h-5 w-56" />
			</div>
			<Skeleton className="h-10 w-32 rounded-md" />
		</div>
	);
}

/**
 * Card with Header and Content Skeleton
 */
export function CardSkeleton({
	headerHeight = 6,
	contentLines = 3,
}: {
	headerHeight?: number;
	contentLines?: number;
}) {
	return (
		<div className="rounded-xl border bg-card shadow-sm">
			<div className="p-6 border-b">
				<Skeleton className={`h-${headerHeight} w-40 mb-1`} />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="p-6 space-y-3">
				{Array.from({ length: contentLines }).map((_, i) => (
					<Skeleton key={i} className="h-4 w-full" style={{ width: `${100 - i * 15}%` }} />
				))}
			</div>
		</div>
	);
}

/**
 * Form Field Skeleton
 */
export function FormFieldSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton className="h-4 w-20" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	);
}

/**
 * Form Skeleton
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
	return (
		<div className="space-y-6">
			{Array.from({ length: fields }).map((_, i) => (
				<FormFieldSkeleton key={i} />
			))}
			<Skeleton className="h-10 w-28 rounded-md" />
		</div>
	);
}

/**
 * Image Gallery Skeleton
 */
export function ImageGallerySkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton key={i} className="aspect-square rounded-lg" />
			))}
		</div>
	);
}

/**
 * Product Card Skeleton (for public product grid)
 */
export function ProductCardSkeleton() {
	return (
		<div className="rounded-lg border bg-card overflow-hidden">
			<Skeleton className="aspect-[4/3] w-full" />
			<div className="p-4 space-y-2">
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
				<div className="flex gap-2 mt-3">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>
			</div>
		</div>
	);
}

/**
 * Product Grid Skeleton (for public product listing)
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Pagination Skeleton
 */
export function PaginationSkeleton() {
	return (
		<div className="flex justify-center gap-2 pt-4">
			<Skeleton className="h-9 w-24 rounded-md" />
			<Skeleton className="h-9 w-28" />
			<Skeleton className="h-9 w-20 rounded-md" />
		</div>
	);
}

/**
 * File Card Skeleton (for storage/media grid)
 */
export function FileCardSkeleton() {
	return (
		<div className="rounded-lg border bg-muted/30 overflow-hidden">
			<Skeleton className="aspect-square w-full" />
			<div className="p-3 space-y-1.5">
				<Skeleton className="h-4 w-3/4" />
				<div className="flex justify-between">
					<Skeleton className="h-3 w-12" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
		</div>
	);
}

/**
 * File List Grid Skeleton (for storage manager)
 */
export function FileListSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<FileCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Storage Page Skeleton
 */
export function StoragePageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<Skeleton className="h-8 w-32 mb-1" />
				<Skeleton className="h-4 w-72" />
			</div>

			{/* Tabs and content */}
			<div className="space-y-6">
				{/* Tab buttons */}
				<div className="flex gap-2">
					<Skeleton className="h-9 w-24 rounded-md" />
					<Skeleton className="h-9 w-28 rounded-md" />
				</div>

				{/* Upload area */}
				<div className="rounded-xl border bg-card shadow-sm p-6">
					<div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
						<Skeleton className="h-12 w-12 rounded-full mb-4" />
						<Skeleton className="h-5 w-48 mb-2" />
						<Skeleton className="h-4 w-36" />
					</div>
				</div>

				{/* File list card */}
				<div className="rounded-xl border bg-card shadow-sm">
					<div className="p-6 border-b flex justify-between items-center">
						<div>
							<Skeleton className="h-6 w-36 mb-1" />
							<Skeleton className="h-4 w-48" />
						</div>
						<Skeleton className="h-9 w-24 rounded-md" />
					</div>
					<div className="p-6">
						<FileListSkeleton count={8} />
					</div>
				</div>
			</div>

			{/* Info card */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<Skeleton className="h-6 w-40 mb-4" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Skeleton className="h-5 w-16 mb-2" />
						<Skeleton className="h-4 w-40 mb-1" />
						<Skeleton className="h-4 w-32" />
					</div>
					<div>
						<Skeleton className="h-5 w-24 mb-2" />
						<Skeleton className="h-4 w-36 mb-1" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * User Table Row Skeleton
 */
export function UserRowSkeleton() {
	return (
		<tr>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-5 w-32" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-4 w-44" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-5 w-16 rounded-full" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-4 w-28" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-4 w-28" />
			</td>
		</tr>
	);
}

/**
 * Users Table Skeleton
 */
export function UsersTableSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-12" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-12" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-14" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-16" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-20" />
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{Array.from({ length: count }).map((_, i) => (
						<UserRowSkeleton key={i} />
					))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * Users Page Skeleton
 */
export function UsersPageSkeleton() {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm border">
				{/* Header */}
				<div className="border-b px-6 py-4 flex items-center justify-between">
					<div>
						<Skeleton className="h-8 w-44 mb-1" />
						<Skeleton className="h-4 w-52" />
					</div>
					<Skeleton className="h-10 w-32 rounded-md" />
				</div>

				{/* Users Table */}
				<div className="px-6 py-6">
					<Skeleton className="h-6 w-32 mb-4" />
					<UsersTableSkeleton count={5} />
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// CLIENT-SIDE PAGE SKELETONS
// ============================================================================

/**
 * Product Detail Hero Skeleton
 * For the hero section of product detail pages
 */
export function ProductDetailHeroSkeleton() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-primary/10 pt-24 md:pt-28 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Back button */}
				<Skeleton className="h-9 w-44 rounded-md mb-6" />

				{/* Treatment badges */}
				<div className="flex gap-2 mb-4">
					<Skeleton className="h-6 w-24 rounded-full" />
					<Skeleton className="h-6 w-28 rounded-full" />
				</div>

				{/* Title */}
				<Skeleton className="h-12 w-3/4 max-w-2xl mb-6" />

				{/* Short description */}
				<Skeleton className="h-6 w-full max-w-3xl mb-2" />
				<Skeleton className="h-6 w-2/3 max-w-2xl mb-8" />

				{/* Certifications row */}
				<div className="flex flex-wrap items-center gap-4 mb-8">
					<Skeleton className="h-8 w-32 rounded-full" />
					<Skeleton className="h-8 w-28 rounded-full" />
					<Skeleton className="h-8 w-8 rounded-full ml-auto" />
				</div>

				{/* Main image gallery */}
				<Skeleton className="w-full aspect-video md:aspect-[21/9] rounded-2xl" />
			</div>
		</section>
	);
}

/**
 * Product Specifications Skeleton
 */
export function ProductSpecificationsSkeleton() {
	return (
		<div className="mb-12">
			<Skeleton className="h-8 w-64 mb-6" />
			<div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
				<div className="divide-y divide-slate-100">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex justify-between items-center py-4 px-6">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-5 w-40" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Product Sidebar Skeleton
 */
export function ProductDetailSidebarSkeleton() {
	return (
		<div className="space-y-4">
			{/* Benefits card */}
			<div className="rounded-2xl bg-white border p-6">
				<Skeleton className="h-6 w-24 mb-4" />
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-start gap-3">
							<Skeleton className="h-5 w-5 rounded-full shrink-0" />
							<Skeleton className="h-5 flex-1" />
						</div>
					))}
				</div>
			</div>

			{/* Video/Brochure card */}
			<div className="rounded-2xl bg-white border p-6">
				<Skeleton className="h-6 w-28 mb-4" />
				<Skeleton className="h-10 w-full rounded-md mb-3" />
				<Skeleton className="h-10 w-full rounded-md" />
			</div>
		</div>
	);
}

/**
 * Product FAQ Skeleton
 */
export function ProductFAQSkeleton() {
	return (
		<section className="py-12 md:py-16 bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<Skeleton className="h-8 w-48 mb-8" />
				<div className="space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="rounded-lg bg-white border p-4">
							<div className="flex justify-between items-center">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-5 w-5 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Product Inquiry Form Skeleton
 */
export function ProductInquiryFormSkeleton() {
	return (
		<section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<Skeleton className="h-8 w-64 mx-auto mb-4" />
					<Skeleton className="h-5 w-96 mx-auto" />
				</div>
				<div className="rounded-2xl bg-white border shadow-lg p-6 md:p-8">
					<div className="grid gap-6 md:grid-cols-2">
						<FormFieldSkeleton />
						<FormFieldSkeleton />
						<FormFieldSkeleton />
						<FormFieldSkeleton />
					</div>
					<div className="mt-6">
						<Skeleton className="h-32 w-full rounded-md mb-6" />
						<Skeleton className="h-11 w-full rounded-md" />
					</div>
				</div>
			</div>
		</section>
	);
}

/**
 * Full Product Detail Page Skeleton
 */
export function ProductDetailPageSkeleton() {
	return (
		<div className="min-h-screen">
			<ProductDetailHeroSkeleton />

			{/* Main content section */}
			<section className="py-12 md:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-[1fr_340px]">
						{/* Main content */}
						<div>
							{/* Description */}
							<div className="mb-12">
								<Skeleton className="h-8 w-48 mb-6" />
								<div className="space-y-4">
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-3/4" />
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-5/6" />
								</div>
							</div>

							{/* Specifications */}
							<ProductSpecificationsSkeleton />
						</div>

						{/* Sidebar */}
						<aside>
							<div className="sticky top-24">
								<ProductDetailSidebarSkeleton />
							</div>
						</aside>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<ProductFAQSkeleton />

			{/* Inquiry Form */}
			<ProductInquiryFormSkeleton />
		</div>
	);
}

/**
 * Products Listing Sidebar Skeleton
 */
export function ProductSidebarSkeleton() {
	return (
		<div className="space-y-6">
			{/* Search */}
			<div className="rounded-2xl bg-white border p-4">
				<Skeleton className="h-10 w-full rounded-md" />
			</div>

			{/* Categories */}
			<div className="rounded-2xl bg-white border p-4">
				<Skeleton className="h-5 w-24 mb-4" />
				<div className="space-y-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4 rounded" />
							<Skeleton className="h-4 flex-1" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Products Listing Page Skeleton
 */
export function ProductsListingPageSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-100 to-primary/10">
			<div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6">
					<Skeleton className="h-4 w-20" />
				</div>

				{/* Header */}
				<div className="mb-8">
					<Skeleton className="h-12 w-64 mb-3" />
					<Skeleton className="h-6 w-full max-w-3xl mb-1" />
					<Skeleton className="h-6 w-2/3 max-w-2xl" />
				</div>

				{/* Main layout */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="w-full lg:w-80 lg:shrink-0 hidden sm:block">
						<ProductSidebarSkeleton />
					</div>

					{/* Main content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6">
							<Skeleton className="h-5 w-32" />
						</div>

						{/* Products grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Blog Card Skeleton (for listings)
 */
export function BlogCardSkeleton() {
	return (
		<div className="rounded-2xl bg-white border overflow-hidden">
			<Skeleton className="aspect-[16/10] w-full" />
			<div className="p-5">
				{/* Category & date */}
				<div className="flex items-center gap-3 mb-3">
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
				{/* Title */}
				<Skeleton className="h-6 w-full mb-2" />
				<Skeleton className="h-6 w-3/4 mb-3" />
				{/* Excerpt */}
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-5/6 mb-4" />
				{/* Author */}
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		</div>
	);
}

/**
 * Blog Listing Hero Skeleton
 */
export function BlogHeroSkeleton() {
	return (
		<section className="relative bg-gradient-to-b from-slate-50 to-white pt-24 md:pt-28 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<Skeleton className="h-5 w-20 rounded-full mx-auto mb-4" />
				<Skeleton className="h-12 w-64 mx-auto mb-4" />
				<Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2" />
				<Skeleton className="h-6 w-3/4 max-w-xl mx-auto mb-8" />
				{/* Search */}
				<Skeleton className="h-12 w-full max-w-md mx-auto rounded-full" />
			</div>
		</section>
	);
}

/**
 * Blog Listing Page Skeleton
 */
export function BlogListingPageSkeleton() {
	return (
		<div className="min-h-screen">
			<BlogHeroSkeleton />

			<section className="py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-[1fr_300px]">
						{/* Main content */}
						<div>
							{/* Category tabs */}
							<div className="flex gap-2 mb-8 flex-wrap">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-9 w-24 rounded-full" />
								))}
							</div>

							{/* Blog grid */}
							<div className="grid gap-6 md:grid-cols-2">
								{Array.from({ length: 4 }).map((_, i) => (
									<BlogCardSkeleton key={i} />
								))}
							</div>
						</div>

						{/* Sidebar */}
						<aside className="hidden lg:block">
							<div className="sticky top-24 space-y-6">
								<div className="rounded-2xl bg-white border p-5">
									<Skeleton className="h-5 w-32 mb-4" />
									<div className="space-y-3">
										{Array.from({ length: 4 }).map((_, i) => (
											<div key={i} className="flex gap-3">
												<Skeleton className="h-16 w-16 rounded-lg shrink-0" />
												<div className="flex-1">
													<Skeleton className="h-4 w-full mb-1" />
													<Skeleton className="h-3 w-20" />
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</section>
		</div>
	);
}

/**
 * Blog Detail Hero Skeleton
 */
export function BlogDetailHeroSkeleton() {
	return (
		<section className="relative bg-gradient-to-b from-slate-50 to-white pt-24 md:pt-28 pb-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back button */}
				<Skeleton className="h-9 w-36 rounded-md mb-6" />

				{/* Category & date */}
				<div className="flex items-center gap-4 mb-4">
					<Skeleton className="h-6 w-24 rounded-full" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Title */}
				<Skeleton className="h-10 w-full mb-2" />
				<Skeleton className="h-10 w-3/4 mb-6" />

				{/* Excerpt */}
				<Skeleton className="h-6 w-full mb-1" />
				<Skeleton className="h-6 w-5/6 mb-8" />

				{/* Author */}
				<div className="flex items-center gap-4 mb-8">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div>
						<Skeleton className="h-5 w-32 mb-1" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>

				{/* Featured image */}
				<Skeleton className="w-full aspect-video rounded-2xl" />
			</div>
		</section>
	);
}

/**
 * Blog Detail Page Skeleton
 */
export function BlogDetailPageSkeleton() {
	return (
		<div className="min-h-screen">
			<BlogDetailHeroSkeleton />

			{/* Content */}
			<section className="py-16">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-5 w-full"
								style={{ width: `${100 - (i % 3) * 10}%` }}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Author section */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-start gap-6">
						<Skeleton className="h-20 w-20 rounded-full shrink-0" />
						<div className="flex-1">
							<Skeleton className="h-6 w-40 mb-2" />
							<Skeleton className="h-4 w-24 mb-3" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					</div>
				</div>
			</section>

			{/* Related posts */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Skeleton className="h-8 w-48 mb-8" />
					<div className="grid gap-6 md:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<BlogCardSkeleton key={i} />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
