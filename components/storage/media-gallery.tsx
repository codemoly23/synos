"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
	FileIcon,
	ImageIcon,
	Upload,
	ExternalLink,
	RefreshCw,
	Loader2,
	Check,
	Copy,
	FileText,
	X,
	Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";
import type {
	FileMetadata,
	StorageFolder,
	StorageFile,
} from "@/lib/storage/client";
import {
	STORAGE_API_ROUTES,
	formatFileSize,
	ALLOWED_IMAGE_TYPES,
	ALLOWED_DOCUMENT_TYPES,
	FILE_SIZE_LIMITS,
} from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";
import Link from "next/link";

export type MediaType = "image" | "document";

interface MediaGalleryProps {
	/** Whether the gallery dialog is open */
	open: boolean;
	/** Callback when dialog open state changes */
	onOpenChange: (open: boolean) => void;
	/** Type of media to display/accept */
	type: MediaType;
	/** Callback when a file is selected (single select mode) */
	onSelect?: (file: FileMetadata) => void;
	/** Callback when files are selected (multi-select mode) */
	onMultiSelect?: (files: FileMetadata[]) => void;
	/** Enable multi-select mode */
	multiSelect?: boolean;
	/** Currently selected file URL (for highlighting in single mode) */
	selectedUrl?: string | null;
	/** Currently selected file URLs (for highlighting in multi mode) */
	selectedUrls?: string[];
	/** Dialog title override */
	title?: string;
	/** Items per page (default: 32) */
	pageSize?: number;
}

interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
	const ext = filename.split(".").pop()?.toUpperCase() || "";
	return ext;
}

/**
 * Get MIME type display name
 */
function getMimeTypeDisplay(mimeType: string): string {
	const mimeMap: Record<string, string> = {
		"image/jpeg": "JPEG Image",
		"image/jpg": "JPEG Image",
		"image/png": "PNG Image",
		"image/webp": "WebP Image",
		"image/gif": "GIF Image",
		"image/svg+xml": "SVG Image",
		"application/pdf": "PDF Document",
		"application/msword": "Word Document",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			"Word Document",
	};
	return mimeMap[mimeType] || mimeType;
}

/**
 * Get document icon color based on MIME type
 */
function getDocumentIconClass(mimeType: string): string {
	if (mimeType === "application/pdf") {
		return "text-red-500";
	}
	if (
		mimeType === "application/msword" ||
		mimeType ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return "text-blue-500";
	}
	return "text-muted-foreground";
}

export function MediaGallery({
	open,
	onOpenChange,
	type,
	onSelect,
	onMultiSelect,
	multiSelect = false,
	selectedUrl,
	selectedUrls = [],
	title,
	pageSize = 32,
}: MediaGalleryProps) {
	const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
	const [files, setFiles] = useState<FileMetadata[]>([]);
	const [meta, setMeta] = useState<PaginationMeta>({
		page: 1,
		limit: pageSize,
		total: 0,
		totalPages: 0,
		hasMore: false,
	});
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	// Single select mode
	const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
	// Multi-select mode
	const [selectedFiles, setSelectedFiles] = useState<FileMetadata[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	// Preview/detail panel file
	const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Map type to folder
	const folder: StorageFolder = type === "image" ? "images" : "documents";

	// Accepted types based on media type
	const acceptedTypes =
		type === "image"
			? ALLOWED_IMAGE_TYPES.join(",")
			: ALLOWED_DOCUMENT_TYPES.join(",");

	const maxFileSize =
		type === "image" ? FILE_SIZE_LIMITS.IMAGE : FILE_SIZE_LIMITS.DOCUMENT;

	// Fetch files - supports both initial load and load more
	const fetchFiles = useCallback(
		async (page: number = 1, append: boolean = false) => {
			if (append) {
				setIsLoadingMore(true);
			} else {
				setIsLoading(true);
			}

			try {
				const params = new URLSearchParams({
					folder,
					page: page.toString(),
					limit: pageSize.toString(),
				});

				const response = await fetch(
					`${STORAGE_API_ROUTES.LIST}?${params.toString()}`
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch files");
				}

				const newFiles = data.data || [];
				const responseMeta = data.meta || {
					page: 1,
					limit: pageSize,
					total: 0,
					totalPages: 0,
				};

				if (append) {
					// Append new files to existing ones
					setFiles((prev) => [...prev, ...newFiles]);
				} else {
					// Replace files (initial load or refresh)
					setFiles(newFiles);
				}

				setMeta({
					...responseMeta,
					hasMore: responseMeta.page < responseMeta.totalPages,
				});
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to load files"
				);
			} finally {
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[folder, pageSize]
	);

	// Fetch files when dialog opens or tab changes
	useEffect(() => {
		if (open && activeTab === "library") {
			fetchFiles(1);
			// Reset selections when opening
			setSelectedFile(null);
			setSelectedFiles([]);
			setPreviewFile(null);
		}
	}, [open, activeTab, fetchFiles]);

	// Check if a file is selected (multi-select mode)
	const isFileSelected = useCallback(
		(file: FileMetadata): boolean => {
			return selectedFiles.some((f) => f.url === file.url);
		},
		[selectedFiles]
	);

	// Check if file is already in the parent's selection (for highlighting)
	const isAlreadySelected = useCallback(
		(file: FileMetadata): boolean => {
			if (multiSelect) {
				return selectedUrls.includes(file.url);
			}
			return selectedUrl === file.url;
		},
		[multiSelect, selectedUrls, selectedUrl]
	);

	// Handle file click - different behavior for single vs multi select
	const handleFileClick = useCallback(
		(file: FileMetadata) => {
			if (multiSelect) {
				// Toggle selection in multi-select mode
				setSelectedFiles((prev) => {
					const isSelected = prev.some((f) => f.url === file.url);
					if (isSelected) {
						return prev.filter((f) => f.url !== file.url);
					} else {
						return [...prev, file];
					}
				});
				// Set preview file
				setPreviewFile(file);
			} else {
				// Single select mode
				setSelectedFile(file);
				setPreviewFile(file);
			}
		},
		[multiSelect]
	);

	// Confirm selection
	const handleConfirmSelect = useCallback(() => {
		if (multiSelect) {
			if (selectedFiles.length > 0 && onMultiSelect) {
				onMultiSelect(selectedFiles);
				onOpenChange(false);
			}
		} else {
			if (selectedFile && onSelect) {
				onSelect(selectedFile);
				onOpenChange(false);
			}
		}
	}, [
		multiSelect,
		selectedFiles,
		selectedFile,
		onMultiSelect,
		onSelect,
		onOpenChange,
	]);

	// Clear all selections (multi-select mode)
	const handleClearSelection = useCallback(() => {
		setSelectedFiles([]);
	}, []);

	// Remove a single file from selection (multi-select mode)
	const handleRemoveFromSelection = useCallback((file: FileMetadata) => {
		setSelectedFiles((prev) => prev.filter((f) => f.url !== file.url));
	}, []);

	// Copy URL
	const handleCopyUrl = useCallback((url: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const fullUrl = window.location.origin + url;
		navigator.clipboard.writeText(fullUrl);
		toast.success("URL copied");
	}, []);

	// Load more files
	const handleLoadMore = useCallback(() => {
		if (meta.hasMore && !isLoadingMore) {
			fetchFiles(meta.page + 1, true);
		}
	}, [meta.hasMore, meta.page, isLoadingMore, fetchFiles]);

	// Upload handling
	const handleUpload = useCallback(
		async (file: File) => {
			// Validate file type
			const isCorrectType =
				type === "image"
					? file.type.startsWith("image/")
					: file.type.startsWith("application/");

			if (!isCorrectType) {
				toast.error(
					type === "image"
						? "Please select an image file"
						: "Please select a document file"
				);
				return;
			}

			if (file.size > maxFileSize) {
				const maxMB = Math.round(maxFileSize / (1024 * 1024));
				toast.error(`File size exceeds ${maxMB}MB limit`);
				return;
			}

			setIsUploading(true);

			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", folder);

			try {
				const response = await fetch(STORAGE_API_ROUTES.UPLOAD, {
					method: "POST",
					body: formData,
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Upload failed");
				}

				toast.success("File uploaded");

				// Switch to library tab and refresh
				setActiveTab("library");
				fetchFiles(1);

				// Auto-select the uploaded file
				const uploadedFile = data.data as StorageFile;
				const newFile: FileMetadata = {
					filename: uploadedFile.filename,
					mimeType: uploadedFile.mimeType,
					size: uploadedFile.size,
					folder: uploadedFile.folder,
					url: uploadedFile.url,
					modifiedAt: uploadedFile.createdAt,
					createdAt: uploadedFile.createdAt,
				};

				if (multiSelect) {
					setSelectedFiles((prev) => [...prev, newFile]);
				} else {
					setSelectedFile(newFile);
				}
				setPreviewFile(newFile);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Upload failed"
				);
			} finally {
				setIsUploading(false);
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		},
		[type, maxFileSize, folder, fetchFiles, multiSelect]
	);

	const handleFileInputChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;
			// In multi-select mode, allow uploading multiple files
			if (multiSelect) {
				for (const file of Array.from(files)) {
					await handleUpload(file);
				}
			} else {
				await handleUpload(files[0]);
			}
		},
		[handleUpload, multiSelect]
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

			if (multiSelect) {
				for (const file of Array.from(files)) {
					await handleUpload(file);
				}
			} else {
				await handleUpload(files[0]);
			}
		},
		[handleUpload, multiSelect]
	);

	const isImage = type === "image";
	const defaultTitle = multiSelect
		? isImage
			? "Select Images"
			: "Select Documents"
		: isImage
		? "Select Image"
		: "Select Document";
	const dialogTitle = title || defaultTitle;

	// Selection count for footer
	const selectionCount = multiSelect
		? selectedFiles.length
		: selectedFile
		? 1
		: 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{isImage ? (
							<ImageIcon className="h-5 w-5" />
						) : (
							<FileText className="h-5 w-5" />
						)}
						{dialogTitle}
					</DialogTitle>
					<DialogDescription>
						{multiSelect
							? `Choose ${
									isImage ? "images" : "documents"
							  } from the library or upload new ones. Click to select/deselect.`
							: isImage
							? "Choose an existing image or upload a new one"
							: "Choose an existing document or upload a new one"}
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={(v) => setActiveTab(v as "library" | "upload")}
					className="flex-1 flex flex-col min-h-0"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="library">Media Library</TabsTrigger>
						<TabsTrigger value="upload">Upload New</TabsTrigger>
					</TabsList>

					{/* Library Tab */}
					<TabsContent
						value="library"
						className="flex-1 flex flex-col min-h-0 mt-4"
					>
						<div className="flex items-center justify-between mb-4">
							<p className="text-sm text-muted-foreground">
								{meta.total} {isImage ? "images" : "documents"} in
								library
								{multiSelect && selectedFiles.length > 0 && (
									<span className="ml-2 text-primary font-medium">
										• {selectedFiles.length} selected
									</span>
								)}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => fetchFiles(meta.page)}
								disabled={isLoading}
							>
								<RefreshCw
									className={cn(
										"h-4 w-4 mr-2",
										isLoading && "animate-spin"
									)}
								/>
								Refresh
							</Button>
						</div>

						{/* Main Content Area - Grid + Preview Panel */}
						<div className="flex-1 flex gap-4 min-h-[350px]">
							{/* File Grid */}
							<div className="flex-1 overflow-auto">
								{isLoading ? (
									<div className="flex items-center justify-center h-full">
										<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
									</div>
								) : files.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
										{isImage ? (
											<ImageIcon className="h-12 w-12 mb-4" />
										) : (
											<FileIcon className="h-12 w-12 mb-4" />
										)}
										<p>No files found</p>
										<Button
											variant="ghost"
											className="mt-2 text-primary underline-offset-4 hover:underline"
											onClick={() => setActiveTab("upload")}
										>
											Upload your first{" "}
											{isImage ? "image" : "document"}
										</Button>
									</div>
								) : (
									<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
										{files.map((file) => {
											const isSelected = multiSelect
												? isFileSelected(file)
												: selectedFile?.filename === file.filename;
											const isCurrentlyInParent =
												isAlreadySelected(file);
											const isBeingPreviewed =
												previewFile?.filename === file.filename;

											return (
												<div
													key={file.filename}
													onClick={() => handleFileClick(file)}
													className={cn(
														"group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all",
														isSelected
															? "border-primary ring-2 ring-primary/20"
															: isBeingPreviewed
															? "border-blue-400"
															: "border-border hover:border-primary/50",
														isCurrentlyInParent &&
															!isSelected &&
															"border-green-500/50 bg-green-50/20"
													)}
												>
													{/* Preview */}
													<div className="absolute inset-0 bg-muted">
														{isImage ? (
															<ImageComponent
																src={file.url}
																alt={file.filename}
																className="h-full w-full object-cover"
																height={"150"}
																width={"150"}
															/>
														) : (
															<div className="flex h-full w-full items-center justify-center bg-slate-100">
																<FileText
																	className={cn(
																		"h-10 w-10",
																		getDocumentIconClass(
																			file.mimeType
																		)
																	)}
																/>
															</div>
														)}
													</div>

													{/* Selection checkbox indicator */}
													{multiSelect && (
														<div
															className={cn(
																"absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
																isSelected
																	? "bg-primary border-primary text-primary-foreground"
																	: "bg-white/80 border-slate-300"
															)}
														>
															{isSelected && (
																<Check className="h-3 w-3" />
															)}
														</div>
													)}

													{/* Single select indicator */}
													{!multiSelect && isSelected && (
														<div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
															<Check className="h-3 w-3" />
														</div>
													)}

													{/* Current selection badge (already in parent) */}
													{isCurrentlyInParent && !isSelected && (
														<div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
															Added
														</div>
													)}

													{/* Action buttons - always visible in top right (when no badge) */}
													{!isCurrentlyInParent && (
														<div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
															<Button
																variant="secondary"
																size="icon"
																className="h-6 w-6 bg-white/90 hover:bg-white shadow-sm"
																onClick={(e) =>
																	handleCopyUrl(file.url, e)
																}
																title="Copy URL"
															>
																<Copy className="h-3 w-3 text-black" />
															</Button>
															<Button
																variant="secondary"
																size="icon"
																className="h-6 w-6 bg-white/90 hover:bg-white shadow-sm"
																asChild
															>
																<Link
																	href={file.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	onClick={(e) =>
																		e.stopPropagation()
																	}
																	title="Open in new tab"
																>
																	<ExternalLink className="h-3 w-3 text-black" />
																</Link>
															</Button>
														</div>
													)}

													{/* File info overlay */}
													<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 pt-6">
														<div className="text-white">
															<p className="text-xs font-medium truncate">
																{file.filename}
															</p>
															<p className="text-[10px] opacity-80">
																{formatFileSize(file.size)}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>

							{/* Preview/Detail Panel */}
							{previewFile && (
								<div className="w-64 shrink-0 border rounded-lg p-4 bg-slate-50 space-y-4 overflow-hidden">
									<div className="flex items-center justify-between">
										<h4 className="text-sm font-medium flex items-center gap-1.5">
											<Info className="h-4 w-4" />
											File Details
										</h4>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={() => setPreviewFile(null)}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>

									{/* Preview */}
									<div className="aspect-video rounded-md overflow-hidden bg-white border">
										{isImage ? (
											<ImageComponent
												src={previewFile.url}
												alt={previewFile.filename}
												className="w-full h-full object-contain"
												width="256"
												height="144"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-slate-100">
												<FileText
													className={cn(
														"h-12 w-12",
														getDocumentIconClass(
															previewFile.mimeType
														)
													)}
												/>
											</div>
										)}
									</div>

									{/* File Info */}
									<div className="space-y-3 text-sm">
										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wide">
												Filename
											</p>
											<p className="font-medium break-all">
												{previewFile.filename}
											</p>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div>
												<p className="text-xs text-muted-foreground uppercase tracking-wide">
													Size
												</p>
												<p className="font-medium">
													{formatFileSize(previewFile.size)}
												</p>
											</div>
											<div>
												<p className="text-xs text-muted-foreground uppercase tracking-wide">
													Type
												</p>
												<p className="font-medium">
													{getFileExtension(previewFile.filename)}
												</p>
											</div>
										</div>

										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wide">
												Format
											</p>
											<p className="font-medium text-xs">
												{getMimeTypeDisplay(previewFile.mimeType)}
											</p>
										</div>

										{previewFile.createdAt && (
											<div>
												<p className="text-xs text-muted-foreground uppercase tracking-wide">
													Uploaded
												</p>
												<p className="font-medium text-xs">
													{new Date(
														previewFile.createdAt
													).toLocaleDateString("sv-SE", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})}
												</p>
											</div>
										)}

										{/* Actions */}
										<div className="flex gap-2 pt-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1 text-xs"
												onClick={(e) =>
													handleCopyUrl(previewFile.url, e)
												}
											>
												<Copy className="h-3 w-3 mr-1" />
												Copy URL
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="flex-1 text-xs"
												asChild
											>
												<Link
													href={previewFile.url}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="h-3 w-3 mr-1" />
													Open
												</Link>
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Load More */}
						{meta.hasMore && (
							<div className="flex flex-col items-center gap-2 pt-4 border-t mt-4">
								<Button
									variant="outline"
									onClick={handleLoadMore}
									disabled={isLoadingMore}
									className="min-w-[140px]"
								>
									{isLoadingMore ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Loading...
										</>
									) : (
										"Load More"
									)}
								</Button>
								<span className="text-xs text-muted-foreground">
									Showing {files.length} of {meta.total}
								</span>
							</div>
						)}
					</TabsContent>

					{/* Upload Tab */}
					<TabsContent value="upload" className="flex-1 mt-4">
						<input
							ref={fileInputRef}
							type="file"
							accept={acceptedTypes}
							onChange={handleFileInputChange}
							className="hidden"
							disabled={isUploading}
							multiple={multiSelect}
						/>

						<div
							onClick={() => fileInputRef.current?.click()}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							className={cn(
								"flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer min-h-[300px]",
								isDragging
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50",
								isUploading && "pointer-events-none opacity-50"
							)}
						>
							{isUploading ? (
								<>
									<Loader2 className="h-12 w-12 animate-spin text-primary" />
									<p className="text-sm text-muted-foreground">
										Uploading...
									</p>
								</>
							) : (
								<>
									<div className="rounded-full bg-muted p-4">
										<Upload className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="text-center">
										<p className="text-lg font-medium">
											Drop{" "}
											{isImage
												? multiSelect
													? "images"
													: "image"
												: multiSelect
												? "documents"
												: "document"}{" "}
											here or click to browse
										</p>
										<p className="text-sm text-muted-foreground mt-2">
											{isImage
												? "Supports JPG, PNG, WebP, GIF (max 5MB)"
												: "Supports PDF, DOC, DOCX (max 20MB)"}
										</p>
										{multiSelect && (
											<p className="text-xs text-muted-foreground mt-1">
												You can select multiple files
											</p>
										)}
									</div>
								</>
							)}
						</div>
					</TabsContent>
				</Tabs>

				{/* Footer with selection info */}
				<DialogFooter className="border-t pt-4 mt-4">
					<div className="flex items-center justify-between w-full gap-4">
						{/* Selection Preview */}
						<div className="flex-1 min-w-0">
							{multiSelect ? (
								// Multi-select mode footer
								selectedFiles.length > 0 ? (
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-1 flex-wrap max-w-[400px]">
											{selectedFiles.slice(0, 3).map((file) => (
												<div
													key={file.url}
													className="flex items-center gap-1 bg-slate-100 rounded px-2 py-1 text-xs"
												>
													<span className="truncate max-w-[100px]">
														{file.filename}
													</span>
													<button
														type="button"
														onClick={() =>
															handleRemoveFromSelection(file)
														}
														className="text-slate-500 hover:text-red-500"
													>
														<X className="h-3 w-3" />
													</button>
												</div>
											))}
											{selectedFiles.length > 3 && (
												<span className="text-xs text-muted-foreground">
													+{selectedFiles.length - 3} more
												</span>
											)}
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleClearSelection}
											className="text-xs shrink-0"
										>
											Clear all
										</Button>
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										Click images to select them
									</p>
								)
							) : (
								// Single select mode footer
								selectedFile && (
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Check className="h-4 w-4 text-primary" />
										<span className="truncate max-w-[200px]">
											{selectedFile.filename}
										</span>
										<span>({formatFileSize(selectedFile.size)})</span>
									</div>
								)
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 shrink-0">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleConfirmSelect}
								disabled={selectionCount === 0}
							>
								{multiSelect
									? `Select ${
											selectionCount > 0 ? `(${selectionCount})` : ""
									  } ${isImage ? "Images" : "Documents"}`
									: `Select ${isImage ? "Image" : "Document"}`}
							</Button>
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
