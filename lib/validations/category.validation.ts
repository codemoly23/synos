import { z } from "zod";

/**
 * Slug validation
 */
const slugSchema = z
	.string()
	.min(1, "Slug is required")
	.max(120, "Slug cannot exceed 120 characters")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug must be lowercase, alphanumeric with hyphens only"
	);

/**
 * Optional URL validation
 */
const optionalUrlSchema = z
	.string()
	.nullable()
	.optional()
	.refine(
		(url) => {
			if (!url || url.trim() === "") return true;
			try {
				const parsed = new URL(url);
				return ["http:", "https:"].includes(parsed.protocol);
			} catch {
				return false;
			}
		},
		{ message: "URL must use http or https protocol" }
	);

/**
 * Create Category Schema
 */
export const createCategorySchema = z.object({
	name: z
		.string()
		.min(1, "Category name is required")
		.max(100, "Category name cannot exceed 100 characters"),
	slug: slugSchema.optional(), // Auto-generated if not provided
	description: z
		.string()
		.max(500, "Description cannot exceed 500 characters")
		.optional()
		.default(""),
	parent: z.string().nullable().optional().default(null), // ObjectId string or null
	image: optionalUrlSchema,
	order: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

/**
 * Update Category Schema
 */
export const updateCategorySchema = z.object({
	name: z
		.string()
		.min(1, "Category name is required")
		.max(100, "Category name cannot exceed 100 characters")
		.optional(),
	slug: slugSchema.optional(),
	description: z
		.string()
		.max(500, "Description cannot exceed 500 characters")
		.optional(),
	parent: z.string().nullable().optional(), // ObjectId string or null
	image: optionalUrlSchema,
	order: z.number().int().optional(),
	isActive: z.boolean().optional(),
});

/**
 * Category list query params
 */
export const categoryListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(50),
	parent: z.string().nullable().optional(), // Filter by parent
	isActive: z
		.string()
		.transform((val) => val === "true")
		.optional(),
	tree: z
		.string()
		.default("false")
		.transform((val) => val === "true"), // Return as tree structure
	search: z.string().optional(),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
