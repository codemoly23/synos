import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { redirectService } from "@/lib/services/redirect.service";
import {
	createRedirectSchema,
	redirectListQuerySchema,
} from "@/lib/validations/redirect.validation";
import { logger } from "@/lib/utils/logger";
import {
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
	paginatedResponse,
	conflictResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/redirects
 * List redirects with pagination (requires authentication)
 */
export async function GET(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse("You must be logged in to view redirects");
		}

		const { searchParams } = new URL(request.url);
		const queryResult = redirectListQuerySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "20",
			search: searchParams.get("search") || undefined,
			sort: searchParams.get("sort") || "-createdAt",
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const result = await redirectService.getRedirects(queryResult.data);

		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Redirects retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching redirects", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch redirects";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/redirects
 * Create a new redirect (requires authentication)
 */
export async function POST(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse(
				"You must be logged in to create redirects"
			);
		}

		const body = await request.json();
		const validationResult = createRedirectSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const redirect = await redirectService.createRedirect({
			...validationResult.data,
			source: "manual",
			createdBy: session.user.id,
		});

		logger.info("Redirect created", {
			redirectId: redirect._id,
			fromUrl: redirect.fromUrl,
			createdBy: session.user.id,
		});

		return createdResponse(redirect, "Redirect created successfully");
	} catch (error: unknown) {
		logger.error("Error creating redirect", error);

		if (
			error &&
			typeof error === "object" &&
			"code" in error &&
			(error as { code: number }).code === 11000
		) {
			return conflictResponse("A redirect for this URL already exists");
		}

		const message =
			error instanceof Error ? error.message : "Failed to create redirect";
		return internalServerErrorResponse(message);
	}
}
