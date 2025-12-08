"use client";

import { useState, useCallback } from "react";
import { ImageIcon, FileText, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MediaGallery, type MediaType } from "./media-gallery";
import type { FileMetadata } from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";

interface MediaPickerProps {
	/** Type of media to pick */
	type: MediaType;
	/** Current value (file URL) */
	value?: string | null;
	/** Callback when value changes */
	onChange: (url: string | null) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Additional class name */
	className?: string;
	/** Disable the picker */
	disabled?: boolean;
	/** Show preview of selected file */
	showPreview?: boolean;
	/** Gallery dialog title */
	galleryTitle?: string;
}

export function MediaPicker({
	type,
	value,
	onChange,
	placeholder,
	className,
	disabled = false,
	showPreview = true,
	galleryTitle,
}: MediaPickerProps) {
	const [isOpen, setIsOpen] = useState(false);

	const isImage = type === "image";
	const defaultPlaceholder = isImage ? "Select image" : "Select document";

	const handleSelect = useCallback(
		(file: FileMetadata) => {
			onChange(file.url);
		},
		[onChange]
	);

	const handleClear = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onChange(null);
		},
		[onChange]
	);

	return (
		<>
			<div className={cn("w-full", className)}>
				{showPreview && value ? (
					// Show preview when value exists
					<div className="relative group">
						{isImage ? (
							<div className="relative aspect-video w-full rounded-lg border border-border overflow-hidden bg-muted">
								<ImageComponent
									src={value}
									alt="Selected"
									className="h-full w-full object-cover"
									height={"100"}
									width={"100"}
								/>
								{/* Overlay actions */}
								<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
									<Button
										type="button"
										variant="secondary"
										size="sm"
										onClick={() => setIsOpen(true)}
										disabled={disabled}
									>
										<Pencil className="h-4 w-4 mr-2" />
										Change
									</Button>
									<Button
										type="button"
										variant="secondary"
										size="sm"
										onClick={handleClear}
										disabled={disabled}
									>
										<X className="h-4 w-4 mr-2" />
										Remove
									</Button>
								</div>
							</div>
						) : (
							<div className="relative flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
								<FileText className="h-8 w-8 text-muted-foreground shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">
										{value.split("/").pop()}
									</p>
									<p className="text-xs text-muted-foreground">
										Document selected
									</p>
								</div>
								<div className="flex gap-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => setIsOpen(true)}
										disabled={disabled}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 hover:text-destructive"
										onClick={handleClear}
										disabled={disabled}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</div>
				) : (
					// Show picker button when no value
					<Button
						type="button"
						variant="outline"
						className={cn(
							"w-full h-auto py-8 flex flex-col gap-2",
							disabled && "opacity-50 cursor-not-allowed"
						)}
						onClick={() => setIsOpen(true)}
						disabled={disabled}
					>
						{isImage ? (
							<ImageIcon className="h-8 w-8 text-muted-foreground" />
						) : (
							<FileText className="h-8 w-8 text-muted-foreground" />
						)}
						<span className="text-sm text-muted-foreground">
							{placeholder || defaultPlaceholder}
						</span>
					</Button>
				)}
			</div>

			<MediaGallery
				open={isOpen}
				onOpenChange={setIsOpen}
				type={type}
				onSelect={handleSelect}
				selectedUrl={value}
				title={galleryTitle}
			/>
		</>
	);
}
