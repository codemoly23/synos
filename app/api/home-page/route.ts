import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { homePageRepository } from "@/lib/repositories/home-page.repository";
import { updateHomePageSchema } from "@/lib/validations/home-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { HOME_PAGE_CACHE_TAG } from "@/lib/services/home-page.service";

/**
 * GET /api/home-page
 * Get home page content (public endpoint for reading)
 */
export async function GET() {
	try {
		const homePage = await homePageRepository.get();

		return successResponse(homePage, "Home page content retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching home page content", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch home page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/home-page
 * Update home page content (requires authentication)
 */
export async function PUT(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update home page");
			return unauthorizedResponse(
				"You must be logged in to update home page content"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateHomePageSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Home page update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Update home page
		const homePage = await homePageRepository.update(validationResult.data);

		logger.info("Home page content updated", {
			updatedBy: session.user.id,
		});

		// Revalidate cache tag for all home page queries
		revalidateTag(HOME_PAGE_CACHE_TAG, "default");

		// Revalidate home page
		revalidatePath("/", "page");

		return successResponse(homePage, "Home page content updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating home page content", error);
		const message =
			error instanceof Error ? error.message : "Failed to update home page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PATCH /api/home-page
 * Partial update home page content (requires authentication)
 */
export async function PATCH(request: NextRequest) {
	// PATCH uses the same logic as PUT for partial updates
	return PUT(request);
}
