import { z } from "zod";

export const klinikFaqSchema = z.object({
	_id: z.string().optional(),
	question: z.string().min(1, "Question is required").max(500),
	answer: z.string().min(1, "Answer is required").max(10000),
	visible: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

export const klinikFaqSectionSchema = z.object({
	title: z.string().max(200).optional(),
	faqs: z.array(klinikFaqSchema).optional(),
});

export const updateKlinikutrustningPageSchema = z.object({
	faqSection: klinikFaqSectionSchema.optional(),
});

export type UpdateKlinikutrustningPageData = z.infer<
	typeof updateKlinikutrustningPageSchema
>;
export type KlinikFaqInput = z.infer<typeof klinikFaqSchema>;
