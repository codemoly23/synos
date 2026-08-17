import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { redirectService } from "@/lib/services/redirect.service";
import { updateRedirectSchema } from "@/lib/validations/redirect.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	noContentResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * PATCH /api/redirects/[id]
 * Update a redirect (requires authentication)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse(
				"You must be logged in to update redirects"
			);
		}

		const { id } = await params;
		const body = await request.json();
		const validationResult = updateRedirectSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const redirect = await redirectService.updateRedirect(
			id,
			validationResult.data
		);

		if (!redirect) {
			return notFoundResponse("Redirect not found");
		}

		logger.info("Redirect updated", {
			redirectId: id,
			updatedBy: session.user.id,
		});

		return successResponse(redirect, "Redirect updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating redirect", error);
		const message =
			error instanceof Error ? error.message : "Failed to update redirect";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/redirects/[id]
 * Delete a redirect (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse(
				"You must be logged in to delete redirects"
			);
		}

		const { id } = await params;
		await redirectService.deleteRedirect(id);

		logger.info("Redirect deleted", {
			redirectId: id,
			deletedBy: session.user.id,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting redirect", error);
		const message =
			error instanceof Error ? error.message : "Failed to delete redirect";
		return internalServerErrorResponse(message);
	}
}
