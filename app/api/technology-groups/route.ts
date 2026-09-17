import { NextRequest } from "next/server";
import { getTechnologyGroupModel } from "@/models/technology-group.model";
import {
	successResponse,
	internalServerErrorResponse,
	badRequestResponse,
} from "@/lib/utils/api-response";
import { generateSlug } from "@/lib/utils/product-helpers";
import { logger } from "@/lib/utils/logger";
import { revalidateTag, revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const TechnologyGroup = await getTechnologyGroupModel();
		const groups = await TechnologyGroup.find({}).sort({ order: 1, name: 1 }).lean();
		return successResponse(groups, "Technology groups retrieved successfully");
	} catch {
		return internalServerErrorResponse("Failed to fetch technology groups");
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			name,
			slug,
			description,
			image,
			imageWidth,
			imageHeight,
			heroTitle,
			heroSubtitle,
			heroBulletPoints,
			heroBgMobile,
			heroBgDesktop,
			heroBgMobileWidth,
			heroBgMobileHeight,
			heroBgDesktopWidth,
			heroBgDesktopHeight,
			inquiryBgMobile,
			inquiryBgDesktop,
			inquiryBgMobileWidth,
			inquiryBgMobileHeight,
			inquiryBgDesktopWidth,
			inquiryBgDesktopHeight,
			isActive = true,
			order = 0,
			seo,
			faqTitle,
			faqs,
		} = body;

		if (!name?.trim()) {
			return badRequestResponse("Name is required");
		}

		const finalSlug = (slug?.trim() || generateSlug(name)).toLowerCase();

		// Sanitize FAQs (if provided)
		let sanitizedFaqs: Array<{
			question: string;
			answer: string;
			visible: boolean;
		}> = [];
		if (faqs !== undefined) {
			if (!Array.isArray(faqs)) {
				return badRequestResponse("faqs must be an array");
			}
			sanitizedFaqs = faqs
				.map((f: unknown) => {
					if (!f || typeof f !== "object") return null;
					const item = f as {
						question?: unknown;
						answer?: unknown;
						visible?: unknown;
					};
					const question =
						typeof item.question === "string" ? item.question.trim() : "";
					const answer =
						typeof item.answer === "string" ? item.answer.trim() : "";
					if (!question || !answer) return null;
					return {
						question,
						answer,
						visible: typeof item.visible === "boolean" ? item.visible : true,
					};
				})
				.filter(Boolean) as Array<{
				question: string;
				answer: string;
				visible: boolean;
			}>;
		}

		const sanitizedBulletPoints = Array.isArray(heroBulletPoints)
			? heroBulletPoints.filter((b: unknown) => typeof b === "string" && b.trim()).slice(0, 6)
			: [];

		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.create({
			name: name.trim(),
			slug: finalSlug,
			description: description || "",
			image: image || null,
			imageWidth: typeof imageWidth === "number" ? imageWidth : undefined,
			imageHeight: typeof imageHeight === "number" ? imageHeight : undefined,
			heroTitle: typeof heroTitle === "string" ? heroTitle.trim() : "",
			heroSubtitle: typeof heroSubtitle === "string" ? heroSubtitle.trim() : "",
			heroBulletPoints: sanitizedBulletPoints,
			heroBgMobile: heroBgMobile || null,
			heroBgDesktop: heroBgDesktop || null,
			heroBgMobileWidth: typeof heroBgMobileWidth === "number" ? heroBgMobileWidth : undefined,
			heroBgMobileHeight: typeof heroBgMobileHeight === "number" ? heroBgMobileHeight : undefined,
			heroBgDesktopWidth: typeof heroBgDesktopWidth === "number" ? heroBgDesktopWidth : undefined,
			heroBgDesktopHeight: typeof heroBgDesktopHeight === "number" ? heroBgDesktopHeight : undefined,
			inquiryBgMobile: inquiryBgMobile || null,
			inquiryBgDesktop: inquiryBgDesktop || null,
			inquiryBgMobileWidth: typeof inquiryBgMobileWidth === "number" ? inquiryBgMobileWidth : undefined,
			inquiryBgMobileHeight: typeof inquiryBgMobileHeight === "number" ? inquiryBgMobileHeight : undefined,
			inquiryBgDesktopWidth: typeof inquiryBgDesktopWidth === "number" ? inquiryBgDesktopWidth : undefined,
			inquiryBgDesktopHeight: typeof inquiryBgDesktopHeight === "number" ? inquiryBgDesktopHeight : undefined,
			isActive,
			order,
			seo: seo || {},
			faqTitle: typeof faqTitle === "string" ? faqTitle.trim() : "",
			faqs: sanitizedFaqs,
		});

		revalidateTag("technology-groups", "default");
		revalidateTag("products", "default");
		revalidatePath("/produkter");
			revalidatePath(`/klinikutrustning/teknologi/${finalSlug}`);

		return successResponse(group, "Technology group created successfully");
	} catch (error: unknown) {
		logger.error("Error creating technology group", error);
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code: number }).code === 11000
		) {
			return badRequestResponse(
				"A technology group with this name or slug already exists"
			);
		}
		if (
			typeof error === "object" &&
			error !== null &&
			"name" in error &&
			(error as { name: string }).name === "ValidationError"
		) {
			const message = error instanceof Error ? error.message : "Validation failed";
			return badRequestResponse(message);
		}
		const message = error instanceof Error ? error.message : "Failed to create technology group";
		return internalServerErrorResponse(message);
	}
}
