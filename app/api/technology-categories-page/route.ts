import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { technologyCategoriesPageRepository } from "@/lib/repositories/technology-categories-page.repository";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidateTechnologyCategoriesPage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const page = await technologyCategoriesPageRepository.get();
		return successResponse(page, "Technology categories page content retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching technology categories page content", error);
		return internalServerErrorResponse("Failed to fetch technology categories page content");
	}
}

export async function PUT(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user?.id) {
			return unauthorizedResponse("You must be logged in to update this content");
		}

		const body = await request.json();
		if (typeof body.description !== "string") {
			return badRequestResponse("description must be a string", null);
		}

		const page = await technologyCategoriesPageRepository.update({
			description: body.description,
		});

		logger.info("Technology categories page updated", { updatedBy: session.user.id });
		await revalidateTechnologyCategoriesPage();

		return successResponse(page, "Technology categories page updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating technology categories page content", error);
		return internalServerErrorResponse("Failed to update technology categories page content");
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
