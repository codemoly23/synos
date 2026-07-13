import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { reorderProductsSchema } from "@/lib/validations/product.validation";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { logger } from "@/lib/utils/logger";
import { revalidateAllProducts } from "@/lib/revalidation/actions";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * PATCH /api/products/reorder
 * Bulk update product display order (admin drag-and-drop reordering)
 */
export async function PATCH(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to reorder products");
			return unauthorizedResponse(
				"You must be logged in to reorder products"
			);
		}

		const body = await request.json();
		const validationResult = reorderProductsSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Invalid reorder payload",
				validationResult.error.issues
			);
		}

		const { updates } = validationResult.data;

		if (updates.some((u) => !isValidObjectId(u.id))) {
			return badRequestResponse("Invalid product ID format");
		}

		await productService.bulkUpdateOrder(updates);
		await revalidateAllProducts();

		logger.info("Product order updated", {
			count: updates.length,
			updatedBy: session.user.id,
		});

		return successResponse(null, "Product order updated successfully");
	} catch (error: unknown) {
		logger.error("Error reordering products", error);
		const message =
			error instanceof Error ? error.message : "Failed to reorder products";
		return internalServerErrorResponse(message);
	}
}
