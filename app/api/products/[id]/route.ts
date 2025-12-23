import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validations/product.validation";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { revalidateProduct } from "@/lib/revalidation/actions";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	noContentResponse,
	conflictResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		const product = await productService.getProductById(id);

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

/**
 * PUT /api/products/[id]
 * Update a product (requires authentication)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update product");
			return unauthorizedResponse(
				"You must be logged in to update products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateProductSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Product update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Update product
		const product = await productService.updateProduct(
			id,
			validationResult.data,
			session.user.id
		);

		// Revalidate ISR cache for this product
		const categorySlug = (
			product.categories as unknown as Array<{ slug?: string }>
		)?.[0]?.slug;
		await revalidateProduct(product.slug, categorySlug);

		logger.info("Product updated", {
			productId: id,
			updatedBy: session.user.id,
			updates: Object.keys(validationResult.data),
		});

		return successResponse(product, "Product updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating product", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to update product";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/products/[id]
 * Delete a product (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete product");
			return unauthorizedResponse(
				"You must be logged in to delete products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Get product info before deletion for revalidation
		const productToDelete = await productService.getProductById(id);
		const productSlug = productToDelete?.slug;
		const categorySlug = (
			productToDelete?.categories as unknown as Array<{ slug?: string }>
		)?.[0]?.slug;

		// Delete product
		await productService.deleteProduct(id);

		// Revalidate ISR cache
		if (productSlug) {
			await revalidateProduct(productSlug, categorySlug);
		}

		logger.info("Product deleted", {
			productId: id,
			deletedBy: session.user.id,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to delete product";
		return internalServerErrorResponse(message);
	}
}
