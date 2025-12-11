import { NextResponse } from "next/server";
import { HTTP_STATUS } from "./constants";

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
	};
	errors?: any;
}

/**
 * Create a success response
 */
export function successResponse<T>(
	data?: T,
	message: string = "Success",
	statusCode: number = HTTP_STATUS.OK,
	meta?: ApiResponse["meta"]
): NextResponse<ApiResponse<T>> {
	const response: ApiResponse<T> = {
		success: true,
		message,
		...(data !== undefined && { data }),
		...(meta && { meta }),
	};

	return NextResponse.json(response, { status: statusCode });
}

/**
 * Create an error response
 */
export function errorResponse(
	message: string = "Error",
	statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
	errors?: any
): NextResponse<ApiResponse> {
	const response: ApiResponse = {
		success: false,
		message,
		...(errors && { errors }),
	};

	return NextResponse.json(response, { status: statusCode });
}

/**
 * Create a created response (201)
 */
export function createdResponse<T>(
	data?: T,
	message: string = "Created successfully"
): NextResponse<ApiResponse<T>> {
	return successResponse(data, message, HTTP_STATUS.CREATED);
}

/**
 * Create a no content response (204)
 */
export function noContentResponse(): NextResponse {
	return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
}

/**
 * Create a bad request response (400)
 */
export function badRequestResponse(
	message: string = "Bad request",
	errors?: any
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.BAD_REQUEST, errors);
}

/**
 * Create an unauthorized response (401)
 */
export function unauthorizedResponse(
	message: string = "Unauthorized"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Create a forbidden response (403)
 */
export function forbiddenResponse(
	message: string = "Forbidden"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.FORBIDDEN);
}

/**
 * Create a not found response (404)
 */
export function notFoundResponse(
	message: string = "Resource not found"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.NOT_FOUND);
}

/**
 * Create a conflict response (409)
 */
export function conflictResponse(
	message: string = "Resource conflict"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.CONFLICT);
}

/**
 * Create a validation error response (422)
 */
export function validationErrorResponse(
	message: string = "Validation failed",
	errors?: any
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
}

/**
 * Create an internal server error response (500)
 */
export function internalServerErrorResponse(
	message: string = "Internal server error"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
	data: T[],
	page: number,
	limit: number,
	total: number,
	message: string = "Success"
): NextResponse<ApiResponse<T[]>> {
	const totalPages = Math.ceil(total / limit);

	return successResponse(
		data,
		message,
		HTTP_STATUS.OK,
		{
			page,
			limit,
			total,
			totalPages,
		}
	);
}
