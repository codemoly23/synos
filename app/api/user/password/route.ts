import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	badRequestResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";
import { updatePasswordSchema } from "@/lib/validations/user.validation";

/**
 * PUT /api/user/password
 * Update user password
 */
export async function PUT(request: NextRequest) {
	try {
		console.log("=== PUT /api/user/password ===");

		// Get session from Better Auth
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		// Check if user is authenticated
		if (!session || !session.user) {
			logger.warn("Unauthenticated access attempt to /api/user/password");
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		console.log("✅ User authenticated:", session.user.id);

		// Parse request body
		const body = await request.json();
		console.log("📦 Request body received (passwords hidden)");

		// Validate input
		const validation = updatePasswordSchema.safeParse(body);
		if (!validation.success) {
			console.log("❌ Validation failed:", validation.error);
			return badRequestResponse("Validation failed", validation.error);
		}

		console.log("✅ Validation passed");

		// Use Better Auth's change password method
		try {
			await auth.api.changePassword({
				body: {
					// userId: session.user.id,
					newPassword: validation.data.newPassword,
					currentPassword: validation.data.currentPassword,
					revokeOtherSessions: true,
				},
			});

			console.log("✅ Password updated successfully");

			logger.info("Password updated successfully", {
				userId: session.user.id,
			});

			return successResponse(
				{ success: true },
				"Password updated successfully"
			);
		} catch (error: any) {
			console.log("❌ Password update failed:", error.message);

			if (
				error.message?.includes("Invalid current password") ||
				error.message?.includes("incorrect")
			) {
				return badRequestResponse("Current password is incorrect");
			}

			throw error;
		}
	} catch (error) {
		console.log("❌ Error updating password:", error);
		logger.error("Error in PUT /api/user/password", error);
		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}
