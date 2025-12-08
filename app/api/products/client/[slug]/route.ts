import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
// import { isValidObjectId } from "@/lib/utils/product-helpers";
import {
	successResponse,
	// badRequestResponse,
	// unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	// noContentResponse,
	// conflictResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ slug: string }>;
}
/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params;
		// console.log("GET");
		// console.log("params  => ", await params);

		// if (!isValidObjectId(slug)) {
		// 	return badRequestResponse("Invalid product slug format");
		// }

		const product = await productService.getProductBySlug(slug);

		return successResponse(product, "Product retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Product not found");
		}

		const message =
			error instanceof Error ? error.message : "Failed to fetch product";
		return internalServerErrorResponse(message);
	}
}
