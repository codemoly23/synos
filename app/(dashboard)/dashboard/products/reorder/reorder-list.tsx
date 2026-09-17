"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, GripVertical, Loader2 } from "lucide-react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageComponent } from "@/components/common/image-component";

interface ReorderProduct {
	_id: string;
	title: string;
	slug: string;
	publishType: "publish" | "draft" | "pending" | "private";
	productImages: string[];
	order: number;
}

interface ReorderProductsListProps {
	initialProducts: ReorderProduct[];
}

function SortableProductRow({ product }: { product: ReorderProduct }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: product._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-4 p-4 border rounded-lg bg-background ${
				isDragging ? "z-10 shadow-lg" : "hover:bg-slate-50"
			}`}
		>
			<button
				type="button"
				className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing shrink-0"
				aria-label="Drag to reorder"
				{...attributes}
				{...listeners}
			>
				<GripVertical className="h-5 w-5" />
			</button>

			<div className="w-14 h-14 bg-slate-100 rounded overflow-hidden shrink-0">
				{product.productImages?.[0] ? (
					<ImageComponent
						src={product.productImages[0]}
						alt={product.title}
						className="w-full h-full object-cover"
						height={1000}
						width={1000}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<FileText className="h-5 w-5 text-slate-400" />
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<h3 className="font-medium truncate">{product.title}</h3>
				<p className="text-sm text-slate-500 truncate">/{product.slug}</p>
			</div>

			<Badge variant={product.publishType === "publish" ? "default" : "secondary"}>
				{product.publishType}
			</Badge>
		</div>
	);
}

export function ReorderProductsList({ initialProducts }: ReorderProductsListProps) {
	const [products, setProducts] = React.useState(initialProducts);
	const [isSaving, setIsSaving] = React.useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		})
	);

	async function persistOrder(ordered: ReorderProduct[]) {
		setIsSaving(true);
		try {
			const response = await fetch("/api/products/reorder", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					updates: ordered.map((p, index) => ({ id: p._id, order: index })),
				}),
			});
			const data = await response.json();
			if (!response.ok || !data.success) {
				throw new Error(data.message || "Failed to save order");
			}
			toast.success("Display order saved");
		} catch (error) {
			console.error("Failed to save product order:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save order"
			);
		} finally {
			setIsSaving(false);
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setProducts((current) => {
			const oldIndex = current.findIndex((p) => p._id === active.id);
			const newIndex = current.findIndex((p) => p._id === over.id);
			if (oldIndex === -1 || newIndex === -1) return current;

			const reordered = [...current];
			const [moved] = reordered.splice(oldIndex, 1);
			reordered.splice(newIndex, 0, moved);

			persistOrder(reordered);
			return reordered;
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Link
						href="/dashboard/products"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to products
					</Link>
					<h1 className="text-3xl font-bold">Reorder Machines</h1>
					<p className="text-slate-600">
						Drag products to control the order they appear in on /klinikutrustning.
					</p>
				</div>
				{isSaving && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						Saving...
					</div>
				)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Products</CardTitle>
					<CardDescription>
						{products.length} products &middot; drag to reorder
					</CardDescription>
				</CardHeader>
				<CardContent>
					{products.length === 0 ? (
						<div className="text-center py-8 text-slate-500">
							No products found
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={products.map((p) => p._id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-2">
									{products.map((product) => (
										<SortableProductRow key={product._id} product={product} />
									))}
								</div>
							</SortableContext>
						</DndContext>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
