/**
 * Storage Service
 * Core file storage operations: upload, delete, list
 */

import fs from "fs/promises";
import path from "path";
import { logger } from "@/lib/utils/logger";
import { STORAGE_CONFIG, STORAGE_MESSAGES } from "./constants";
import type {
	StorageFile,
	FileMetadata,
	StorageFolder,
	ListResult,
	UploadRequest,
} from "./types";
import {
	StorageError,
	generateUniqueFilename,
	slugify,
	getStorageBasePath,
	getFolderPath,
	getFilePath,
	getFileUrl,
	isAllowedMimeType,
	isValidFileSize,
	verifyMagicBytes,
	inferFolder,
	sanitizeFilename,
	getMimeFromExtension,
	getExtensionFromFilename,
} from "./utils";

/**
 * Storage Service Class
 * Handles all file storage operations
 */
class StorageService {
	private initialized = false;

	/**
	 * Initialize storage folders
	 * Creates the storage directory structure if it doesn't exist
	 */
	async initialize(): Promise<void> {
		if (this.initialized) return;

		try {
			const basePath = getStorageBasePath();

			// Create base storage folder
			await fs.mkdir(basePath, { recursive: true });

			// Create subfolders
			for (const folder of Object.values(STORAGE_CONFIG.FOLDERS)) {
				const folderPath = path.join(basePath, folder);
				await fs.mkdir(folderPath, { recursive: true });
			}

			this.initialized = true;
			logger.info("Storage system initialized", { basePath });
		} catch (error) {
			logger.error("Failed to initialize storage", error);
			throw new StorageError(
				"Failed to initialize storage system",
				"STORAGE_ERROR",
				500
			);
		}
	}

	/**
	 * Ensure storage is initialized before operations
	 */
	private async ensureInitialized(): Promise<void> {
		if (!this.initialized) {
			await this.initialize();
		}
	}

	/**
	 * Upload a file
	 * @param request - Upload request containing file buffer and metadata
	 * @returns StorageFile with file info and public URL
	 */
	async upload(request: UploadRequest): Promise<StorageFile> {
		await this.ensureInitialized();

		const { buffer, originalName, mimeType, size, folder: requestedFolder } = request;

		// Sanitize original filename for logging
		const safeOriginalName = sanitizeFilename(originalName);

		logger.debug("Processing upload", {
			originalName: safeOriginalName,
			mimeType,
			size,
		});

		// Validate MIME type
		if (!isAllowedMimeType(mimeType)) {
			throw new StorageError(
				STORAGE_MESSAGES.INVALID_MIME_TYPE,
				"INVALID_MIME_TYPE",
				400,
				{ field: "mimeType", value: mimeType }
			);
		}

		// Validate file size
		if (!isValidFileSize(size, mimeType)) {
			throw new StorageError(
				STORAGE_MESSAGES.FILE_TOO_LARGE,
				"FILE_TOO_LARGE",
				400,
				{ field: "size", value: size }
			);
		}

		// Verify magic bytes match declared MIME type
		if (!verifyMagicBytes(buffer, mimeType)) {
			logger.warn("MIME type mismatch detected (possible spoofing)", {
				declaredMime: mimeType,
				originalName: safeOriginalName,
			});
			throw new StorageError(
				STORAGE_MESSAGES.MIME_MISMATCH,
				"MIME_MISMATCH",
				400,
				{ field: "file", value: mimeType }
			);
		}

		// Determine target folder
		const folder: StorageFolder = requestedFolder || inferFolder(mimeType);

		// Generate unique filename (slugified with duplicate handling)
		const filename = await generateUniqueFilename(
			safeOriginalName,
			mimeType,
			folder,
			this.exists.bind(this)
		);

		// Use slugified base name as ID
		const id = slugify(path.basename(filename, path.extname(filename)));

		// Get file path
		const filePath = getFilePath(folder, filename);

		try {
			// Write file to disk
			await fs.writeFile(filePath, buffer);

			const url = getFileUrl(folder, filename);
			const createdAt = new Date();

			logger.info("File uploaded successfully", {
				filename,
				folder,
				size,
				mimeType,
			});

			return {
				id,
				filename,
				originalName: safeOriginalName,
				mimeType,
				size,
				folder,
				url,
				createdAt,
			};
		} catch (error) {
			logger.error("Failed to write file", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	/**
	 * Delete a file
	 * @param filename - Name of file to delete
	 * @param folder - Storage folder
	 */
	async delete(filename: string, folder: StorageFolder): Promise<void> {
		await this.ensureInitialized();

		const filePath = getFilePath(folder, filename);

		try {
			// Check if file exists
			await fs.access(filePath);

			// Delete the file
			await fs.unlink(filePath);

			logger.info("File deleted successfully", { filename, folder });
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				throw new StorageError(
					STORAGE_MESSAGES.FILE_NOT_FOUND,
					"FILE_NOT_FOUND",
					404,
					{ field: "filename", value: filename }
				);
			}

			logger.error("Failed to delete file", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	/**
	 * List files in a folder
	 * @param folder - Storage folder to list
	 * @param page - Page number (1-indexed)
	 * @param limit - Items per page
	 * @param sort - Sort order by modification date
	 * @returns Paginated list of file metadata
	 */
	async list(
		folder: StorageFolder,
		page: number = STORAGE_CONFIG.DEFAULT_PAGE,
		limit: number = STORAGE_CONFIG.DEFAULT_LIMIT,
		sort: "asc" | "desc" = "desc"
	): Promise<ListResult> {
		await this.ensureInitialized();

		const folderPath = getFolderPath(folder);

		try {
			// Read directory contents
			const entries = await fs.readdir(folderPath, { withFileTypes: true });

			// Filter to files only and get metadata
			const filesPromises = entries
				.filter((entry) => entry.isFile())
				.map(async (entry): Promise<FileMetadata | null> => {
					try {
						const filePath = path.join(folderPath, entry.name);
						const stats = await fs.stat(filePath);
						const extension = getExtensionFromFilename(entry.name);
						const mimeType = getMimeFromExtension(extension) || "application/octet-stream";

						return {
							filename: entry.name,
							mimeType,
							size: stats.size,
							folder,
							url: getFileUrl(folder, entry.name),
							modifiedAt: stats.mtime,
							createdAt: stats.birthtime,
						};
					} catch {
						// Skip files we can't stat
						return null;
					}
				});

			const filesWithNull = await Promise.all(filesPromises);
			let files = filesWithNull.filter((f): f is FileMetadata => f !== null);

			// Sort by creation date
			files.sort((a, b) => {
				const comparison = a.createdAt.getTime() - b.createdAt.getTime();
				return sort === "asc" ? comparison : -comparison;
			});

			// Calculate pagination
			const total = files.length;
			const totalPages = Math.ceil(total / limit);
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;

			// Slice for current page
			files = files.slice(startIndex, endIndex);

			return {
				files,
				page,
				limit,
				total,
				totalPages,
			};
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				// Folder doesn't exist - return empty result
				return {
					files: [],
					page,
					limit,
					total: 0,
					totalPages: 0,
				};
			}

			logger.error("Failed to list files", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	/**
	 * Check if a file exists
	 * @param filename - Filename to check
	 * @param folder - Storage folder
	 */
	async exists(filename: string, folder: StorageFolder): Promise<boolean> {
		await this.ensureInitialized();

		try {
			const filePath = getFilePath(folder, filename);
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get file metadata
	 * @param filename - Filename
	 * @param folder - Storage folder
	 */
	async getMetadata(
		filename: string,
		folder: StorageFolder
	): Promise<FileMetadata> {
		await this.ensureInitialized();

		const filePath = getFilePath(folder, filename);

		try {
			const stats = await fs.stat(filePath);
			const extension = getExtensionFromFilename(filename);
			const mimeType = getMimeFromExtension(extension) || "application/octet-stream";

			return {
				filename,
				mimeType,
				size: stats.size,
				folder,
				url: getFileUrl(folder, filename),
				modifiedAt: stats.mtime,
				createdAt: stats.birthtime,
			};
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				throw new StorageError(
					STORAGE_MESSAGES.FILE_NOT_FOUND,
					"FILE_NOT_FOUND",
					404,
					{ field: "filename", value: filename }
				);
			}

			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	/**
	 * Get total storage usage for a folder
	 */
	async getUsage(folder: StorageFolder): Promise<{ count: number; totalSize: number }> {
		await this.ensureInitialized();

		const result = await this.list(folder, 1, 10000); // Get all files
		const totalSize = result.files.reduce((sum, file) => sum + file.size, 0);

		return {
			count: result.total,
			totalSize,
		};
	}
}

// Export singleton instance
export const storageService = new StorageService();

// Export class for testing
export { StorageService };
