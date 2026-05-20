import { NextRequest } from "next/server";
import { getTechnologyGroupModel } from "@/models/technology-group.model";
import {
	successResponse,
	internalServerErrorResponse,
	notFoundResponse,
	badRequestResponse,
} from "@/lib/utils/api-response";
import { generateSlug } from "@/lib/utils/product-helpers";
import { logger } from "@/lib/utils/logger";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.findById(id).lean();
		if (!group) return notFoundResponse("Technology group not found");
		return successResponse(group, "Technology group retrieved");
	} catch {
		return internalServerErrorResponse("Failed to fetch technology group");
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { name, slug, description, image, heroTitle, heroSubtitle, heroBulletPoints, heroBgMobile, heroBgDesktop, inquiryBgMobile, inquiryBgDesktop, isActive, order, seo, faqTitle, faqs } = body;

		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.findById(id);
		if (!group) return notFoundResponse("Technology group not found");

		const oldName = group.name;

		if (name !== undefined && name !== null && String(name).trim()) {
			group.name = String(name).trim();
		}

		// Slug: use provided, else auto-generate from (updated) name
		const providedSlug = typeof slug === "string" ? slug.trim().toLowerCase() : "";
		if (providedSlug) {
			group.slug = providedSlug;
		} else if (!group.slug) {
			// Backfill slug for old docs without one
			group.slug = generateSlug(group.name);
		}

		if (description !== undefined) group.description = description;
		if (image !== undefined) group.image = image || null;
		if (heroTitle !== undefined) group.heroTitle = typeof heroTitle === "string" ? heroTitle.trim() : "";
		if (heroSubtitle !== undefined) group.heroSubtitle = typeof heroSubtitle === "string" ? heroSubtitle.trim() : "";
		if (heroBulletPoints !== undefined) {
			group.heroBulletPoints = Array.isArray(heroBulletPoints)
				? heroBulletPoints.filter((b: unknown) => typeof b === "string" && (b as string).trim()).slice(0, 6)
				: [];
		}
		if (heroBgMobile !== undefined) group.heroBgMobile = heroBgMobile || null;
		if (heroBgDesktop !== undefined) group.heroBgDesktop = heroBgDesktop || null;
		if (inquiryBgMobile !== undefined) group.inquiryBgMobile = inquiryBgMobile || null;
		if (inquiryBgDesktop !== undefined) group.inquiryBgDesktop = inquiryBgDesktop || null;
		if (isActive !== undefined) group.isActive = isActive;
		if (order !== undefined && !Number.isNaN(Number(order))) {
			group.order = Number(order);
		}
		if (seo !== undefined) group.seo = { ...(group.seo || {}), ...seo };

		// FAQ fields
		if (faqTitle !== undefined) {
			group.faqTitle = typeof faqTitle === "string" ? faqTitle.trim() : "";
		}
		if (faqs !== undefined) {
			if (!Array.isArray(faqs)) {
				return badRequestResponse("faqs must be an array");
			}
			// Sanitize and validate each FAQ item
			const sanitizedFaqs = faqs
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
			group.set("faqs", sanitizedFaqs);
		}

		await group.save();

		// If the name changed, update all products that reference the old name
		if (name !== undefined && String(name).trim() !== oldName) {
			const { getProductModel } = await import("@/models/product.model");
			const ProductModel = await getProductModel();
			await ProductModel.updateMany(
				{ technologyGroups: oldName },
				{ $set: { "technologyGroups.$[elem]": String(name).trim() } },
				{ arrayFilters: [{ elem: oldName }] }
			);
		}

		revalidateTag("technology-groups", "default");
		revalidateTag("products", "default");
		revalidatePath("/produkter");

		return successResponse(group, "Technology group updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating technology group", error);
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
		// Mongoose validation error
		if (
			typeof error === "object" &&
			error !== null &&
			"name" in error &&
			(error as { name: string }).name === "ValidationError"
		) {
			const message = error instanceof Error ? error.message : "Validation failed";
			return badRequestResponse(message);
		}
		const message = error instanceof Error ? error.message : "Failed to update technology group";
		return internalServerErrorResponse(message);
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.findByIdAndDelete(id);
		if (!group) return notFoundResponse("Technology group not found");

		revalidateTag("technology-groups", "default");
		revalidateTag("products", "default");
		revalidatePath("/produkter");

		return successResponse(null, "Technology group deleted successfully");
	} catch {
		return internalServerErrorResponse("Failed to delete technology group");
	}
}
