"use client";

import * as React from "react";
import { Plus, Trash2, GripVertical, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaGallery } from "@/components/storage";
import { ImageComponent } from "@/components/common/image-component";
import type { FileMetadata } from "@/lib/storage/client";

export interface BeforeAfterPair {
	beforeImage: string;
	afterImage: string;
	label?: string;
}

interface BeforeAfterGalleryProps {
	pairs: BeforeAfterPair[];
	onChange: (pairs: BeforeAfterPair[]) => void;
	disabled?: boolean;
}

type ImageSelectType = "before" | "after";

/**
 * BeforeAfterGallery Component
 * Manages before/after image pairs with:
 * - Add new pairs
 * - Remove pairs
 * - Drag to reorder
 * - Optional label for each pair
 */
export function BeforeAfterGallery({
	pairs = [],
	onChange,
	disabled = false,
}: BeforeAfterGalleryProps) {
	const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
	const [selectingFor, setSelectingFor] = React.useState<{
		index: number;
		type: ImageSelectType;
	} | null>(null);
	const [dragIndex, setDragIndex] = React.useState<number | null>(null);

	// Add a new empty pair
	const handleAddPair = () => {
		onChange([...pairs, { beforeImage: "", afterImage: "", label: "" }]);
	};

	// Remove a pair
	const handleRemovePair = (index: number) => {
		onChange(pairs.filter((_, i) => i !== index));
	};

	// Update a pair's field
	const handleUpdatePair = (
		index: number,
		field: keyof BeforeAfterPair,
		value: string
	) => {
		const newPairs = [...pairs];
		newPairs[index] = { ...newPairs[index], [field]: value };
		onChange(newPairs);
	};

	// Open gallery for selecting before/after image
	const openGalleryFor = (index: number, type: ImageSelectType) => {
		setSelectingFor({ index, type });
		setIsGalleryOpen(true);
	};

	// Handle image selection from gallery
	const handleImageSelect = (file: FileMetadata) => {
		if (selectingFor) {
			const field =
				selectingFor.type === "before" ? "beforeImage" : "afterImage";
			handleUpdatePair(selectingFor.index, field, file.url);
		}
		setIsGalleryOpen(false);
		setSelectingFor(null);
	};

	// Clear an image from a pair
	const handleClearImage = (index: number, type: ImageSelectType) => {
		const field = type === "before" ? "beforeImage" : "afterImage";
		handleUpdatePair(index, field, "");
	};

	// Drag and drop handlers
	const handleDragStart = (index: number) => {
		setDragIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (dragIndex === null || dragIndex === index) return;

		const newPairs = [...pairs];
		const [draggedItem] = newPairs.splice(dragIndex, 1);
		newPairs.splice(index, 0, draggedItem);
		onChange(newPairs);
		setDragIndex(index);
	};

	const handleDragEnd = () => {
		setDragIndex(null);
	};

	return (
		<div className="space-y-4">
			{/* Pairs List */}
			{pairs.length > 0 && (
				<div className="space-y-4">
					{pairs.map((pair, index) => (
						<div
							key={index}
							draggable={!disabled}
							onDragStart={() => handleDragStart(index)}
							onDragOver={(e) => handleDragOver(e, index)}
							onDragEnd={handleDragEnd}
							className={cn(
								"relative p-4 border rounded-lg bg-slate-50/50 transition-all",
								dragIndex === index && "opacity-50 border-primary",
								!disabled && "cursor-move"
							)}
						>
							{/* Header Row */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									{!disabled && (
										<div className="p-1 text-slate-400">
											<GripVertical className="h-4 w-4" />
										</div>
									)}
									<span className="text-sm font-medium text-slate-700">
										Pair #{index + 1}
									</span>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => handleRemovePair(index)}
									disabled={disabled}
									className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>

							{/* Images Row */}
							<div className="grid grid-cols-2 gap-4 mb-4">
								{/* Before Image */}
								<div className="space-y-2">
									<Label className="text-xs text-slate-600 uppercase tracking-wide">
										Before Image{" "}
										<span className="text-red-500">*</span>
									</Label>
									{pair.beforeImage ? (
										<div className="relative aspect-video rounded-md overflow-hidden border bg-white group">
											<ImageComponent
												src={pair.beforeImage}
												alt="Before"
												className="w-full h-full object-cover"
												width={300}
												height={200}
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
												<div className="flex gap-2">
													<Button
														type="button"
														variant="secondary"
														size="sm"
														onClick={() =>
															openGalleryFor(index, "before")
														}
														disabled={disabled}
														className="h-8 text-xs"
													>
														Change
													</Button>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() =>
															handleClearImage(index, "before")
														}
														disabled={disabled}
														className="h-8"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
											<div className="absolute top-2 left-2 bg-slate-800/80 text-white text-[10px] px-2 py-0.5 rounded uppercase font-medium">
												Before
											</div>
										</div>
									) : (
										<button
											type="button"
											onClick={() => openGalleryFor(index, "before")}
											disabled={disabled}
											className="w-full aspect-video rounded-md border-2 border-dashed border-slate-300 hover:border-primary/50 bg-white flex flex-col items-center justify-center gap-2 transition-colors"
										>
											<ImageIcon className="h-8 w-8 text-slate-400" />
											<span className="text-xs text-slate-500">
												Select Before Image
											</span>
										</button>
									)}
								</div>

								{/* After Image */}
								<div className="space-y-2">
									<Label className="text-xs text-slate-600 uppercase tracking-wide">
										After Image{" "}
										<span className="text-red-500">*</span>
									</Label>
									{pair.afterImage ? (
										<div className="relative aspect-video rounded-md overflow-hidden border bg-white group">
											<ImageComponent
												src={pair.afterImage}
												alt="After"
												className="w-full h-full object-cover"
												width={300}
												height={200}
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
												<div className="flex gap-2">
													<Button
														type="button"
														variant="secondary"
														size="sm"
														onClick={() =>
															openGalleryFor(index, "after")
														}
														disabled={disabled}
														className="h-8 text-xs"
													>
														Change
													</Button>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() =>
															handleClearImage(index, "after")
														}
														disabled={disabled}
														className="h-8"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
											<div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] px-2 py-0.5 rounded uppercase font-medium">
												After
											</div>
										</div>
									) : (
										<button
											type="button"
											onClick={() => openGalleryFor(index, "after")}
											disabled={disabled}
											className="w-full aspect-video rounded-md border-2 border-dashed border-slate-300 hover:border-primary/50 bg-white flex flex-col items-center justify-center gap-2 transition-colors"
										>
											<ImageIcon className="h-8 w-8 text-slate-400" />
											<span className="text-xs text-slate-500">
												Select After Image
											</span>
										</button>
									)}
								</div>
							</div>

							{/* Label Input */}
							<div className="space-y-2">
								<Label
									htmlFor={`pair-label-${index}`}
									className="text-xs text-slate-600"
								>
									Label (optional)
								</Label>
								<Input
									id={`pair-label-${index}`}
									value={pair.label || ""}
									onChange={(e) =>
										handleUpdatePair(index, "label", e.target.value)
									}
									placeholder="e.g., After 1 treatment, Day 30 results..."
									disabled={disabled}
									className="h-9 text-sm"
								/>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Add Pair Button */}
			<Button
				type="button"
				variant="outline"
				onClick={handleAddPair}
				disabled={disabled}
				className="w-full h-16 border-dashed"
			>
				<div className="flex items-center gap-2">
					<Plus className="h-5 w-5" />
					<span>Add Before & After Pair</span>
				</div>
			</Button>

			{/* Media Gallery Modal */}
			<MediaGallery
				open={isGalleryOpen}
				onOpenChange={(open) => {
					setIsGalleryOpen(open);
					if (!open) setSelectingFor(null);
				}}
				type="image"
				onSelect={handleImageSelect}
				selectedUrl={
					selectingFor
						? selectingFor.type === "before"
							? pairs[selectingFor.index]?.beforeImage
							: pairs[selectingFor.index]?.afterImage
						: undefined
				}
				title={`Select ${selectingFor?.type === "before" ? "Before" : "After"} Image`}
			/>
		</div>
	);
}
