import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { klinikutrustningPageRepository } from "@/lib/repositories/klinikutrustning-page.repository";
import { updateKlinikutrustningPageSchema } from "@/lib/validations/klinikutrustning-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidateKlinikutrustningPage } from "@/lib/revalidation/actions";

/**
 * GET /api/klinikutrustning-page
 * Get klinikutrustning page content (public endpoint for reading)
 */
export async function GET() {
	try {
		const page = await klinikutrustningPageRepository.get();
		return successResponse(page, "Klinikutrustning page content retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching klinikutrustning page content", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch klinikutrustning page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/klinikutrustning-page
 * Update klinikutrustning page content (requires authentication)
 */
export async function PUT(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update klinikutrustning page");
			return unauthorizedResponse(
				"You must be logged in to update klinikutrustning page content"
			);
		}

		const body = await request.json();
		const validationResult = updateKlinikutrustningPageSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Klinikutrustning page update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const page = await klinikutrustningPageRepository.update(
			validationResult.data
		);

		logger.info("Klinikutrustning page content updated", {
			updatedBy: session.user.id,
		});

		await revalidateKlinikutrustningPage();

		return successResponse(page, "Klinikutrustning page content updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating klinikutrustning page content", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to update klinikutrustning page content";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
