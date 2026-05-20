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

export const klinikHeroSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(400).optional(),
	bulletPoints: z.array(z.string().max(150)).max(6).optional(),
	bgMobile: z.string().max(500).optional(),
	bgDesktop: z.string().max(500).optional(),
});

export const updateKlinikutrustningPageSchema = z.object({
	faqSection: klinikFaqSectionSchema.optional(),
	heroSection: klinikHeroSectionSchema.optional(),
});

export type UpdateKlinikutrustningPageData = z.infer<
	typeof updateKlinikutrustningPageSchema
>;
export type KlinikFaqInput = z.infer<typeof klinikFaqSchema>;
