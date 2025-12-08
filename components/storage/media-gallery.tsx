"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
	FileIcon,
	ImageIcon,
	Upload,
	Trash2,
	ExternalLink,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Check,
	Copy,
	FileText,
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
	/** Callback when a file is selected */
	onSelect: (file: FileMetadata) => void;
	/** Currently selected file URL (for highlighting) */
	selectedUrl?: string | null;
	/** Dialog title override */
	title?: string;
	/** Items per page */
	pageSize?: number;
}

interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export function MediaGallery({
	open,
	onOpenChange,
	type,
	onSelect,
	selectedUrl,
	title,
	pageSize = 12,
}: MediaGalleryProps) {
	const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
	const [files, setFiles] = useState<FileMetadata[]>([]);
	const [meta, setMeta] = useState<PaginationMeta>({
		page: 1,
		limit: pageSize,
		total: 0,
		totalPages: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
	const [deletingFile, setDeletingFile] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
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

	// Fetch files
	const fetchFiles = useCallback(
		async (page: number = 1) => {
			setIsLoading(true);
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

				setFiles(data.data || []);
				setMeta(
					data.meta || {
						page: 1,
						limit: pageSize,
						total: 0,
						totalPages: 0,
					}
				);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to load files"
				);
			} finally {
				setIsLoading(false);
			}
		},
		[folder, pageSize]
	);

	// Fetch files when dialog opens or tab changes
	useEffect(() => {
		if (open && activeTab === "library") {
			fetchFiles(1);
			// Reset selected file when opening
			setSelectedFile(null);
		}
	}, [open, activeTab, fetchFiles]);

	// Handle file selection
	const handleFileClick = useCallback((file: FileMetadata) => {
		setSelectedFile(file);
	}, []);

	// Confirm selection
	const handleConfirmSelect = useCallback(() => {
		if (selectedFile) {
			onSelect(selectedFile);
			onOpenChange(false);
		}
	}, [selectedFile, onSelect, onOpenChange]);

	// Delete file
	const handleDelete = useCallback(
		async (filename: string, e: React.MouseEvent) => {
			e.stopPropagation();
			setDeletingFile(filename);

			try {
				const response = await fetch(STORAGE_API_ROUTES.DELETE, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ filename, folder }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to delete file");
				}

				toast.success("File deleted");

				// Clear selection if deleted file was selected
				if (selectedFile?.filename === filename) {
					setSelectedFile(null);
				}

				// Refresh the list
				fetchFiles(meta.page);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to delete file"
				);
			} finally {
				setDeletingFile(null);
			}
		},
		[folder, meta.page, fetchFiles, selectedFile]
	);

	// Copy URL
	const handleCopyUrl = useCallback((url: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const fullUrl = window.location.origin + url;
		navigator.clipboard.writeText(fullUrl);
		toast.success("URL copied");
	}, []);

	// Pagination
	const handlePageChange = useCallback(
		(newPage: number) => {
			if (newPage >= 1 && newPage <= meta.totalPages) {
				fetchFiles(newPage);
			}
		},
		[meta.totalPages, fetchFiles]
	);

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
				setSelectedFile({
					filename: uploadedFile.filename,
					mimeType: uploadedFile.mimeType,
					size: uploadedFile.size,
					folder: uploadedFile.folder,
					url: uploadedFile.url,
					modifiedAt: uploadedFile.createdAt,
					createdAt: uploadedFile.createdAt,
				});
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
		[type, maxFileSize, folder, fetchFiles]
	);

	const handleFileInputChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;
			await handleUpload(files[0]);
		},
		[handleUpload]
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
			await handleUpload(files[0]);
		},
		[handleUpload]
	);

	const isImage = type === "image";
	const dialogTitle = title || (isImage ? "Select Image" : "Select Document");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
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
						{isImage
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

						{/* File Grid */}
						<div className="flex-1 overflow-auto min-h-[300px]">
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
										Upload your first {isImage ? "image" : "document"}
									</Button>
								</div>
							) : (
								<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
									{files.map((file) => {
										const isSelected =
											selectedFile?.filename === file.filename;
										const isCurrentlySelected =
											selectedUrl === file.url;

										return (
											<div
												key={file.filename}
												onClick={() => handleFileClick(file)}
												className={cn(
													"group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all",
													isSelected
														? "border-primary ring-2 ring-primary/20"
														: "border-border hover:border-primary/50",
													isCurrentlySelected &&
														!isSelected &&
														"border-green-500/50",
													deletingFile === file.filename &&
														"opacity-50 pointer-events-none"
												)}
											>
												{/* Preview */}
												<div className="absolute inset-0 bg-muted">
													{isImage ? (
														<ImageComponent
															src={file.url}
															alt={file.filename}
															className="h-full w-full object-cover"
															height={"100"}
															width={"100"}
														/>
													) : (
														<div className="flex h-full w-full items-center justify-center">
															<FileIcon className="h-10 w-10 text-muted-foreground" />
														</div>
													)}
												</div>

												{/* Selection indicator */}
												{isSelected && (
													<div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
														<Check className="h-3 w-3" />
													</div>
												)}

												{/* Current selection badge */}
												{isCurrentlySelected && !isSelected && (
													<div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">
														Current
													</div>
												)}

												{/* Actions overlay */}
												<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
													<Button
														variant="secondary"
														size="icon"
														className="h-8 w-8"
														onClick={(e) =>
															handleCopyUrl(file.url, e)
														}
														title="Copy URL"
													>
														<Copy className="h-4 w-4" />
													</Button>
													<Button
														variant="secondary"
														size="icon"
														className="h-8 w-8"
														asChild
													>
														<Link
															href={file.url}
															target="_blank"
															rel="noopener noreferrer"
															onClick={(e) =>
																e.stopPropagation()
															}
															title="Open"
														>
															<ExternalLink className="h-4 w-4" />
														</Link>
													</Button>
													<Button
														variant="secondary"
														size="icon"
														className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
														onClick={(e) =>
															handleDelete(file.filename, e)
														}
														disabled={
															deletingFile === file.filename
														}
														title="Delete"
													>
														{deletingFile === file.filename ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4" />
														)}
													</Button>
												</div>

												{/* File info */}
												<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 pt-6">
													<p className="text-[10px] flex flex-col text-slate-800 truncate bg-slate-300/50 glass rounded-sm p-1">
														<span className="text-xs text-wrap">
															{file.filename}
														</span>
														<span className="text-[10px]">
															{formatFileSize(file.size)}
														</span>
													</p>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Pagination */}
						{meta.totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 pt-4 border-t mt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(meta.page - 1)}
									disabled={meta.page <= 1}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<span className="text-sm text-muted-foreground">
									{meta.page} / {meta.totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(meta.page + 1)}
									disabled={meta.page >= meta.totalPages}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
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
											Drop {isImage ? "image" : "document"} here or
											click to browse
										</p>
										<p className="text-sm text-muted-foreground mt-2">
											{isImage
												? "Supports JPG, PNG, WebP, GIF (max 5MB)"
												: "Supports PDF, DOC, DOCX (max 20MB)"}
										</p>
									</div>
								</>
							)}
						</div>
					</TabsContent>
				</Tabs>

				{/* Footer with selection info */}
				<DialogFooter className="border-t pt-4 mt-4">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-3">
							{selectedFile && (
								<>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Check className="h-4 w-4 text-primary" />
										<span className="truncate max-w-[200px]">
											{selectedFile.filename}
										</span>
										<span>({formatFileSize(selectedFile.size)})</span>
									</div>
								</>
							)}
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleConfirmSelect}
								disabled={!selectedFile}
							>
								Select {isImage ? "Image" : "Document"}
							</Button>
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
