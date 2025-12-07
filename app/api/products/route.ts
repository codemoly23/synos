import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import {
	createProductDraftSchema,
	productListQuerySchema,
} from "@/lib/validations/product.validation";
import { logger } from "@/lib/utils/logger";
import {
	// successResponse,
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
	paginatedResponse,
	conflictResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/products
 * List products with filtering and pagination
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Parse query params
		const queryResult = productListQuerySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
			search: searchParams.get("search"),
			category: searchParams.get("category"),
			publishType: searchParams.get("publishType"),
			visibility: searchParams.get("visibility"),
			sort: searchParams.get("sort") || "-createdAt",
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const { page, limit, search, category, publishType, visibility, sort } =
			queryResult.data;

		const result = await productService.getProducts({
			page,
			limit,
			search,
			category,
			publishType,
			visibility,
			sort,
		});

		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Products retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching products", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch products";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/products
 * Create a new product (requires authentication)
 */
export async function POST(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to create product");
			return unauthorizedResponse(
				"You must be logged in to create products"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = createProductDraftSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Product creation validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Create product
		const product = await productService.createProduct(
			validationResult.data,
			session.user.id
		);

		logger.info("Product created", {
			productId: product._id,
			title: product.title,
			createdBy: session.user.id,
		});

		return createdResponse(product, "Product created successfully");
	} catch (error: unknown) {
		logger.error("Error creating product", error);

		if (error instanceof Error) {
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
			if (error.message.includes("not found")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to create product";
		return internalServerErrorResponse(message);
	}
}
