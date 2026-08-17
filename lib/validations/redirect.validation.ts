import { z } from "zod";

/**
 * Schema for creating a redirect
 */
export const createRedirectSchema = z.object({
	fromUrl: z
		.string()
		.min(1)
		.max(2000)
		.startsWith("/", "fromUrl must be a relative path starting with /"),
	toUrl: z.string().min(1).max(2000),
	statusCode: z.union([z.literal(301), z.literal(302)]).optional(),
});

/**
 * Schema for updating a redirect
 */
export const updateRedirectSchema = z.object({
	toUrl: z.string().min(1).max(2000).optional(),
	statusCode: z.union([z.literal(301), z.literal(302)]).optional(),
	isActive: z.boolean().optional(),
});

/**
 * Schema for list query parameters
 */
export const redirectListQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	search: z.string().optional(),
	sort: z.string().optional().default("-createdAt"),
});

// Type exports
export type CreateRedirectValidatedInput = z.infer<
	typeof createRedirectSchema
>;
export type UpdateRedirectValidatedInput = z.infer<
	typeof updateRedirectSchema
>;
export type RedirectListQuery = z.infer<typeof redirectListQuerySchema>;
