import "server-only";

import path from "path";
import {
	PutObjectCommand,
	DeleteObjectCommand,
	ListObjectsV2Command,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "./r2";
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
	getFileUrl,
	getUserAvatarUrl,
	isAllowedMimeType,
	isValidFileSize,
	verifyMagicBytes,
	inferFolder,
	sanitizeFilename,
	getMimeFromExtension,
	getExtensionFromMime,
	getExtensionFromFilename,
} from "./utils";

class StorageService {
	async upload(request: UploadRequest): Promise<StorageFile> {
		const {
			buffer,
			originalName,
			mimeType,
			size,
			folder: requestedFolder,
		} = request;

		const safeOriginalName = sanitizeFilename(originalName);

		logger.debug("Processing upload", {
			originalName: safeOriginalName,
			mimeType,
			size,
		});

		if (!isAllowedMimeType(mimeType)) {
			throw new StorageError(
				STORAGE_MESSAGES.INVALID_MIME_TYPE,
				"INVALID_MIME_TYPE",
				400,
				{ field: "mimeType", value: mimeType }
			);
		}

		if (!isValidFileSize(size, mimeType)) {
			throw new StorageError(
				STORAGE_MESSAGES.FILE_TOO_LARGE,
				"FILE_TOO_LARGE",
				400,
				{ field: "size", value: size }
			);
		}

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

		const folder: StorageFolder = requestedFolder || inferFolder(mimeType);

		const filename = await generateUniqueFilename(
			safeOriginalName,
			mimeType,
			folder,
			this.exists.bind(this)
		);

		const id = slugify(path.basename(filename, path.extname(filename)));
		const key = `${folder}/${filename}`;

		try {
			await r2.send(
				new PutObjectCommand({
					Bucket: R2_BUCKET,
					Key: key,
					Body: buffer,
					ContentType: mimeType,
					ContentLength: size,
				})
			);

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
			logger.error("Failed to upload file to R2", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	async delete(filename: string, folder: StorageFolder): Promise<void> {
		const key = `${folder}/${filename}`;

		const fileExists = await this.exists(filename, folder);
		if (!fileExists) {
			throw new StorageError(
				STORAGE_MESSAGES.FILE_NOT_FOUND,
				"FILE_NOT_FOUND",
				404,
				{ field: "filename", value: filename }
			);
		}

		try {
			await r2.send(
				new DeleteObjectCommand({
					Bucket: R2_BUCKET,
					Key: key,
				})
			);

			logger.info("File deleted successfully", { filename, folder });
		} catch (error) {
			logger.error("Failed to delete file from R2", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	async list(
		folder: StorageFolder,
		page: number = STORAGE_CONFIG.DEFAULT_PAGE,
		limit: number = STORAGE_CONFIG.DEFAULT_LIMIT,
		sort: "asc" | "desc" = "desc"
	): Promise<ListResult> {
		try {
			const allObjects: FileMetadata[] = [];
			let continuationToken: string | undefined;

			do {
				const response = await r2.send(
					new ListObjectsV2Command({
						Bucket: R2_BUCKET,
						Prefix: `${folder}/`,
						ContinuationToken: continuationToken,
						MaxKeys: 1000,
					})
				);

				for (const obj of response.Contents || []) {
					if (!obj.Key || !obj.Size || !obj.LastModified) continue;

					const filename = obj.Key.replace(`${folder}/`, "");
					// Skip subfolder entries (e.g. avatars/userId/avatar.jpg)
					if (!filename || filename.includes("/")) continue;

					const extension = getExtensionFromFilename(filename);
					const mimeType =
						getMimeFromExtension(extension) || "application/octet-stream";

					allObjects.push({
						filename,
						mimeType,
						size: obj.Size,
						folder,
						url: getFileUrl(folder, filename),
						modifiedAt: obj.LastModified,
						createdAt: obj.LastModified,
					});
				}

				continuationToken = response.IsTruncated
					? response.NextContinuationToken
					: undefined;
			} while (continuationToken);

			allObjects.sort((a, b) => {
				const comparison = a.createdAt.getTime() - b.createdAt.getTime();
				return sort === "asc" ? comparison : -comparison;
			});

			const total = allObjects.length;
			const totalPages = Math.ceil(total / limit);
			const startIndex = (page - 1) * limit;
			const files = allObjects.slice(startIndex, startIndex + limit);

			return { files, page, limit, total, totalPages };
		} catch (error) {
			logger.error("Failed to list files from R2", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	async exists(filename: string, folder: StorageFolder): Promise<boolean> {
		try {
			await r2.send(
				new HeadObjectCommand({
					Bucket: R2_BUCKET,
					Key: `${folder}/${filename}`,
				})
			);
			return true;
		} catch {
			return false;
		}
	}

	async getMetadata(
		filename: string,
		folder: StorageFolder
	): Promise<FileMetadata> {
		try {
			const response = await r2.send(
				new HeadObjectCommand({
					Bucket: R2_BUCKET,
					Key: `${folder}/${filename}`,
				})
			);

			const extension = getExtensionFromFilename(filename);
			const mimeType =
				response.ContentType ||
				getMimeFromExtension(extension) ||
				"application/octet-stream";
			const lastModified = response.LastModified || new Date();

			return {
				filename,
				mimeType,
				size: response.ContentLength || 0,
				folder,
				url: getFileUrl(folder, filename),
				modifiedAt: lastModified,
				createdAt: lastModified,
			};
		} catch {
			throw new StorageError(
				STORAGE_MESSAGES.FILE_NOT_FOUND,
				"FILE_NOT_FOUND",
				404,
				{ field: "filename", value: filename }
			);
		}
	}

	async getUsage(
		folder: StorageFolder
	): Promise<{ count: number; totalSize: number }> {
		const result = await this.list(folder, 1, 10000);
		const totalSize = result.files.reduce((sum, file) => sum + file.size, 0);
		return { count: result.total, totalSize };
	}

	// =========================================================================
	// User Avatar Methods
	// =========================================================================

	async uploadUserAvatar(
		userId: string,
		buffer: Buffer,
		mimeType: string,
		size: number
	): Promise<{ url: string; filename: string }> {
		if (!mimeType.startsWith("image/") || !isAllowedMimeType(mimeType)) {
			throw new StorageError(
				"Only image files are allowed for avatars",
				"INVALID_MIME_TYPE",
				400,
				{ field: "mimeType", value: mimeType }
			);
		}

		if (!isValidFileSize(size, mimeType)) {
			throw new StorageError(
				STORAGE_MESSAGES.FILE_TOO_LARGE,
				"FILE_TOO_LARGE",
				400,
				{ field: "size", value: size }
			);
		}

		if (!verifyMagicBytes(buffer, mimeType)) {
			throw new StorageError(
				STORAGE_MESSAGES.MIME_MISMATCH,
				"MIME_MISMATCH",
				400,
				{ field: "file", value: mimeType }
			);
		}

		// Delete existing avatar(s) for this user before uploading new one
		try {
			const existing = await r2.send(
				new ListObjectsV2Command({
					Bucket: R2_BUCKET,
					Prefix: `avatars/${userId}/avatar.`,
				})
			);

			for (const obj of existing.Contents || []) {
				if (obj.Key) {
					await r2.send(
						new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: obj.Key })
					);
					logger.info("Deleted existing avatar", { userId, key: obj.Key });
				}
			}
		} catch (error) {
			logger.warn("Error cleaning up existing avatars", error);
		}

		const extension = getExtensionFromMime(mimeType) || ".jpg";
		const filename = `avatar${extension}`;
		const key = `avatars/${userId}/${filename}`;

		try {
			await r2.send(
				new PutObjectCommand({
					Bucket: R2_BUCKET,
					Key: key,
					Body: buffer,
					ContentType: mimeType,
					ContentLength: size,
				})
			);

			const url = getUserAvatarUrl(userId, filename);

			logger.info("User avatar uploaded successfully", {
				userId,
				filename,
				size,
				mimeType,
			});

			return { url, filename };
		} catch (error) {
			logger.error("Failed to upload avatar to R2", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	async deleteUserAvatar(userId: string): Promise<void> {
		try {
			const existing = await r2.send(
				new ListObjectsV2Command({
					Bucket: R2_BUCKET,
					Prefix: `avatars/${userId}/avatar.`,
				})
			);

			const avatarFiles = (existing.Contents || []).filter((obj) => obj.Key);

			if (avatarFiles.length === 0) {
				throw new StorageError(
					"No avatar found for this user",
					"FILE_NOT_FOUND",
					404,
					{ field: "userId", value: userId }
				);
			}

			for (const obj of avatarFiles) {
				await r2.send(
					new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: obj.Key! })
				);
				logger.info("Deleted user avatar", { userId, key: obj.Key });
			}
		} catch (error) {
			if (error instanceof StorageError) throw error;
			logger.error("Failed to delete avatar from R2", error);
			throw new StorageError(
				STORAGE_MESSAGES.STORAGE_ERROR,
				"STORAGE_ERROR",
				500
			);
		}
	}

	async getUserAvatarUrl(userId: string): Promise<string | null> {
		try {
			const existing = await r2.send(
				new ListObjectsV2Command({
					Bucket: R2_BUCKET,
					Prefix: `avatars/${userId}/avatar.`,
				})
			);

			const avatarFile = (existing.Contents || []).find((obj) => obj.Key);
			if (!avatarFile?.Key) return null;

			const filename = avatarFile.Key.split("/").pop()!;
			return getUserAvatarUrl(userId, filename);
		} catch {
			return null;
		}
	}
}

export const storageService = new StorageService();
export { StorageService };
