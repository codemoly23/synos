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
		const { name, slug, description, image, isActive = true, order = 0, seo } = body;

		if (!name?.trim()) {
			return badRequestResponse("Name is required");
		}

		const finalSlug = (slug?.trim() || generateSlug(name)).toLowerCase();

		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.create({
			name: name.trim(),
			slug: finalSlug,
			description: description || "",
			image: image || null,
			isActive,
			order,
			seo: seo || {},
		});

		revalidateTag("technology-groups", "default");
		revalidateTag("products", "default");
		revalidatePath("/produkter");

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
