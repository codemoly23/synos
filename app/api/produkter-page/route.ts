import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { produkterPageRepository } from "@/lib/repositories/produkter-page.repository";
import { updateProdukterPageSchema } from "@/lib/validations/produkter-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidateProdukterPage } from "@/lib/revalidation/actions";

/**
 * GET /api/produkter-page
 * Get produkter page content (public endpoint for reading)
 */
export async function GET() {
	try {
		const page = await produkterPageRepository.get();
		return successResponse(page, "Produkter page content retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching produkter page content", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch produkter page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/produkter-page
 * Update produkter page content (requires authentication)
 */
export async function PUT(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update produkter page");
			return unauthorizedResponse(
				"You must be logged in to update produkter page content"
			);
		}

		const body = await request.json();
		const validationResult = updateProdukterPageSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Produkter page update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const page = await produkterPageRepository.update(validationResult.data);

		logger.info("Produkter page content updated", {
			updatedBy: session.user.id,
		});

		await revalidateProdukterPage();

		return successResponse(page, "Produkter page content updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating produkter page content", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to update produkter page content";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
