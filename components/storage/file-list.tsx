"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
	FileIcon,
	Trash2,
	ExternalLink,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { FileMetadata, StorageFolder } from "@/lib/storage/client";
import { STORAGE_API_ROUTES, formatFileSize } from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";

interface FileListProps {
	/** Storage folder to display */
	folder: StorageFolder;
	/** Title for the list */
	title?: string;
	/** Description for the list */
	description?: string;
	/** Callback when a file is deleted */
	onDelete?: (filename: string) => void;
	/** Callback when a file is selected */
	onSelect?: (file: FileMetadata) => void;
	/** Additional class name */
	className?: string;
	/** Items per page */
	pageSize?: number;
	/** Enable file selection mode */
	selectable?: boolean;
}

interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export function FileList({
	folder,
	title,
	description,
	onDelete,
	onSelect,
	className,
	pageSize = 12,
	selectable = false,
}: FileListProps) {
	const [files, setFiles] = useState<FileMetadata[]>([]);
	const [meta, setMeta] = useState<PaginationMeta>({
		page: 1,
		limit: pageSize,
		total: 0,
		totalPages: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [deletingFile, setDeletingFile] = useState<string | null>(null);

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

	useEffect(() => {
		fetchFiles(1);
	}, [fetchFiles]);

	const handleDelete = useCallback(
		async (filename: string) => {
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

				toast.success("File deleted successfully");
				onDelete?.(filename);

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
		[folder, meta.page, fetchFiles, onDelete]
	);

	const handleCopyUrl = useCallback((url: string) => {
		const fullUrl = window.location.origin + url;
		navigator.clipboard.writeText(fullUrl);
		toast.success("URL copied to clipboard");
	}, []);

	const handlePageChange = useCallback(
		(newPage: number) => {
			if (newPage >= 1 && newPage <= meta.totalPages) {
				fetchFiles(newPage);
			}
		},
		[meta.totalPages, fetchFiles]
	);

	const isImage = (mimeType: string) => mimeType.startsWith("image/");

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<div>
					<CardTitle>{title || `${folder} Files`}</CardTitle>
					{description && (
						<CardDescription className="mt-1">
							{description}
						</CardDescription>
					)}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => fetchFiles(meta.page)}
					disabled={isLoading}
				>
					<RefreshCw
						className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
					/>
					Refresh
				</Button>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : files.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
						<FileIcon className="h-12 w-12 mb-4" />
						<p>No files found</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{files.map((file) => (
								<div
									key={file.filename}
									className={cn(
										"group relative rounded-lg border border-border bg-muted/30 p-2 transition-colors",
										selectable &&
											"cursor-pointer hover:border-primary",
										deletingFile === file.filename && "opacity-50"
									)}
									onClick={() => selectable && onSelect?.(file)}
								>
									{/* Preview */}
									<div className="aspect-square w-full overflow-hidden rounded-md bg-muted mb-2">
										{isImage(file.mimeType) ? (
											<ImageComponent
												src={file.url}
												alt={file.filename}
												className="h-full w-full object-cover"
												height={"100"}
												width={"100"}
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center">
												<FileIcon className="h-12 w-12 text-muted-foreground" />
											</div>
										)}
									</div>

									{/* Info */}
									<div className="space-y-1">
										<p
											className="text-xs font-medium truncate"
											title={file.filename}
										>
											{file.filename}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatFileSize(file.size)}
										</p>
									</div>

									{/* Actions overlay */}
									<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="secondary"
											size="icon"
											className="h-7 w-7"
											onClick={(e) => {
												e.stopPropagation();
												handleCopyUrl(file.url);
											}}
											title="Copy URL"
										>
											<Copy className="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="secondary"
											size="icon"
											className="h-7 w-7"
											asChild
										>
											<a
												href={file.url}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												title="Open in new tab"
											>
												<ExternalLink className="h-3.5 w-3.5" />
											</a>
										</Button>
										<Button
											variant="secondary"
											size="icon"
											className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(file.filename);
											}}
											disabled={deletingFile === file.filename}
											title="Delete file"
										>
											{deletingFile === file.filename ? (
												<Loader2 className="h-3.5 w-3.5 animate-spin" />
											) : (
												<Trash2 className="h-3.5 w-3.5" />
											)}
										</Button>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{meta.totalPages > 1 && (
							<div className="flex items-center justify-between mt-6 pt-4 border-t">
								<p className="text-sm text-muted-foreground">
									Showing {files.length} of {meta.total} files
								</p>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handlePageChange(meta.page - 1)}
										disabled={meta.page <= 1}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<span className="text-sm">
										Page {meta.page} of {meta.totalPages}
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
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
