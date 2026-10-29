import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { logger } from "@/lib/utils/logger";
import { HTTP_STATUS } from "@/lib/utils/constants";
import { checkUploadRateLimit, recordUpload } from "@/lib/utils/rate-limit";
import {
	createdResponse,
	badRequestResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import {
	storageService,
	StorageError,
	storageFolderSchema,
	STORAGE_MESSAGES,
	inferFolderFromMime,
} from "@/lib/storage";
import type { StorageFolder, UploadRequest } from "@/lib/storage";

/**
 * POST /api/upload
 * Public endpoint - Upload a file to storage (rate limited)
 * Used by public-facing forms (careers application, training application) that have no logged-in session.
 */
export async function POST(request: NextRequest) {
	try {
		const headersList = await headers();
		const ip =
			headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			headersList.get("x-real-ip") ||
			"unknown";

		const withinLimit = await checkUploadRateLimit(ip);
		if (!withinLimit) {
			return NextResponse.json(
				{
					success: false,
					message: "För många uppladdningar. Försök igen om 15 minuter.",
				},
				{ status: HTTP_STATUS.TOO_MANY_REQUESTS }
			);
		}

		// Parse multipart form data
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const folderParam = formData.get("folder") as string | null;

		if (!file || !(file instanceof File)) {
			return badRequestResponse(STORAGE_MESSAGES.FILE_REQUIRED);
		}

		let folder: StorageFolder | undefined;
		if (folderParam) {
			const folderResult = storageFolderSchema.safeParse(folderParam);
			if (!folderResult.success) {
				return badRequestResponse(
					STORAGE_MESSAGES.INVALID_FOLDER,
					folderResult.error.issues
				);
			}
			folder = folderResult.data;
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadRequest: UploadRequest = {
			buffer,
			originalName: file.name,
			mimeType: file.type,
			size: file.size,
			folder: folder || inferFolderFromMime(file.type),
		};

		const result = await storageService.upload(uploadRequest);
		await recordUpload(ip);

		logger.info("Public file uploaded", {
			filename: result.filename,
			ip,
			folder: result.folder,
		});

		return createdResponse(result, STORAGE_MESSAGES.UPLOAD_SUCCESS);
	} catch (error) {
		if (error instanceof StorageError) {
			logger.warn("Public storage upload error", {
				code: error.code,
				message: error.message,
			});
			return badRequestResponse(error.message, error.details);
		}

		logger.error("Unexpected public upload error", error);
		return internalServerErrorResponse(
			error instanceof Error ? error.message : "Upload failed"
		);
	}
}
