import { z } from "zod";

export const produkterFaqSchema = z.object({
	_id: z.string().optional(),
	question: z.string().min(1, "Question is required").max(500),
	answer: z.string().min(1, "Answer is required").max(10000),
	visible: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

export const produkterFaqSectionSchema = z.object({
	title: z.string().max(200).optional(),
	faqs: z.array(produkterFaqSchema).optional(),
});

export const updateProdukterPageSchema = z.object({
	faqSection: produkterFaqSectionSchema.optional(),
});

export type UpdateProdukterPageData = z.infer<
	typeof updateProdukterPageSchema
>;
export type ProdukterFaqInput = z.infer<typeof produkterFaqSchema>;
