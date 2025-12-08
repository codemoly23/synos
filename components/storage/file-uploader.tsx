"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Upload, X, FileIcon, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StorageFile, StorageFolder } from "@/lib/storage/client";
import {
	ALLOWED_IMAGE_TYPES,
	ALLOWED_DOCUMENT_TYPES,
	FILE_SIZE_LIMITS,
	STORAGE_API_ROUTES,
} from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";

interface FileUploaderProps {
	/** Target folder (images or documents) */
	folder?: StorageFolder;
	/** Callback when file is uploaded successfully */
	onUpload?: (file: StorageFile) => void;
	/** Callback when upload fails */
	onError?: (error: string) => void;
	/** Whether to allow multiple files */
	multiple?: boolean;
	/** Custom accepted file types */
	accept?: string;
	/** Additional class name */
	className?: string;
	/** Disable the uploader */
	disabled?: boolean;
}

export function FileUploader({
	folder,
	onUpload,
	onError,
	multiple = false,
	accept,
	className,
	disabled = false,
}: FileUploaderProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Determine accepted types based on folder
	const acceptedTypes = accept
		? accept
		: folder === "images"
		? ALLOWED_IMAGE_TYPES.join(",")
		: folder === "documents"
		? ALLOWED_DOCUMENT_TYPES.join(",")
		: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES].join(",");

	const handleUpload = useCallback(
		async (file: File) => {
			// Client-side validation
			const isImage = file.type.startsWith("image/");
			const maxSize = isImage
				? FILE_SIZE_LIMITS.IMAGE
				: FILE_SIZE_LIMITS.DOCUMENT;

			if (file.size > maxSize) {
				const maxMB = Math.round(maxSize / (1024 * 1024));
				const errorMsg = `File size exceeds ${maxMB}MB limit`;
				toast.error(errorMsg);
				onError?.(errorMsg);
				return;
			}

			setIsUploading(true);

			// Show preview for images
			if (isImage) {
				const reader = new FileReader();
				reader.onload = (e) => setPreview(e.target?.result as string);
				reader.readAsDataURL(file);
			}

			const formData = new FormData();
			formData.append("file", file);
			if (folder) {
				formData.append("folder", folder);
			}

			try {
				const response = await fetch(STORAGE_API_ROUTES.UPLOAD, {
					method: "POST",
					body: formData,
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Upload failed");
				}

				toast.success("File uploaded successfully");
				onUpload?.(data.data);
				setPreview(null);
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Upload failed";
				toast.error(errorMsg);
				onError?.(errorMsg);
				setPreview(null);
			} finally {
				setIsUploading(false);
				// Reset file input
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		},
		[folder, onUpload, onError]
	);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;

			if (multiple) {
				for (const file of Array.from(files)) {
					await handleUpload(file);
				}
			} else {
				await handleUpload(files[0]);
			}
		},
		[handleUpload, multiple]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const files = e.dataTransfer.files;
			if (!files || files.length === 0) return;

			if (multiple) {
				for (const file of Array.from(files)) {
					await handleUpload(file);
				}
			} else {
				await handleUpload(files[0]);
			}
		},
		[handleUpload, multiple]
	);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const clearPreview = useCallback(() => {
		setPreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	return (
		<div className={cn("w-full", className)}>
			<input
				ref={fileInputRef}
				type="file"
				accept={acceptedTypes}
				multiple={multiple}
				onChange={handleFileChange}
				className="hidden"
				disabled={disabled || isUploading}
			/>

			<div
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
					isDragging
						? "border-primary bg-primary/5"
						: "border-border hover:border-primary/50",
					disabled && "opacity-50 cursor-not-allowed",
					isUploading && "pointer-events-none"
				)}
			>
				{isUploading ? (
					<>
						<Loader2 className="h-10 w-10 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">Uploading...</p>
					</>
				) : preview ? (
					<>
						<div className="relative">
							<ImageComponent
								src={preview}
								alt="Preview"
								className="max-h-32 max-w-full rounded-md object-contain"
								height={"100"}
								width={"100"}
							/>
							<button
								onClick={(e) => {
									e.stopPropagation();
									clearPreview();
								}}
								className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</>
				) : (
					<>
						<div className="flex items-center gap-2">
							{folder === "images" ? (
								<ImageIcon className="h-10 w-10 text-muted-foreground" />
							) : folder === "documents" ? (
								<FileIcon className="h-10 w-10 text-muted-foreground" />
							) : (
								<Upload className="h-10 w-10 text-muted-foreground" />
							)}
						</div>
						<div className="text-center">
							<p className="text-sm font-medium">
								Drag & drop or click to upload
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{folder === "images"
									? "JPG, PNG, WebP, GIF (max 5MB)"
									: folder === "documents"
									? "PDF, DOC, DOCX (max 20MB)"
									: "Images or documents"}
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
