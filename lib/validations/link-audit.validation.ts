import { z } from "zod";

/**
 * Schema for starting a new audit
 */
export const startAuditSchema = z.object({
	type: z.enum(["full", "internal", "external"]).default("full"),
});

/**
 * Schema for audit list query
 */
export const auditListQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(50).default(10),
});

/**
 * Schema for audit links filter
 */
export const auditLinksFilterSchema = z.object({
	status: z
		.enum(["ok", "broken", "redirect", "mixed-content", "timeout", "error", "all"])
		.default("all"),
	isExternal: z.enum(["true", "false", "all"]).default("all"),
	search: z.string().optional(),
});

/**
 * Schema for updating external link (add nofollow, remove, etc.)
 */
export const updateExternalLinkSchema = z.object({
	action: z.enum(["add-nofollow", "remove-nofollow", "ignore"]),
});

// Type exports
export type StartAuditInput = z.infer<typeof startAuditSchema>;
export type AuditListQuery = z.infer<typeof auditListQuerySchema>;
export type AuditLinksFilter = z.infer<typeof auditLinksFilterSchema>;
