import { z } from "zod";

/**
 * Schema for logging a 404 hit (POST from client)
 */
export const logHitSchema = z.object({
	url: z.string().min(1).max(2000),
	referrer: z.string().max(2000).optional(),
	userAgent: z.string().max(1000).optional(),
});

/**
 * Schema for adding/updating a redirect URL
 */
export const addRedirectSchema = z.object({
	redirectUrl: z.string().min(1).max(2000),
});

/**
 * Schema for list query parameters
 */
export const fourOhFourLogListQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	search: z.string().optional(),
	sort: z.string().optional().default("-hits"),
});

// Type exports
export type LogHitInput = z.infer<typeof logHitSchema>;
export type AddRedirectInput = z.infer<typeof addRedirectSchema>;
export type FourOhFourLogListQuery = z.infer<
	typeof fourOhFourLogListQuerySchema
>;
