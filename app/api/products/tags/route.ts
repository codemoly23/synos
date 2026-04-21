import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { getTechnologyGroupModel } from "@/models/technology-group.model";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/products/tags
 * Get all unique treatments, certifications and technology group tags
 */
export async function GET(_request: NextRequest) {
	try {
		const TechnologyGroup = await getTechnologyGroupModel();
		const [treatments, certifications, productGroups, cmsGroups] = await Promise.all([
			productService.getAllTreatments(),
			productService.getAllCertifications(),
			productService.getAllTechnologyGroups(),
			TechnologyGroup.find({}).sort({ order: 1, name: 1 }).select("name").lean(),
		]);

		// Merge CMS-managed groups with groups already used on products
		const technologyGroups = Array.from(
			new Set([...cmsGroups.map((g) => g.name), ...productGroups])
		).sort((a, b) => a.localeCompare(b, "sv"));

		return successResponse(
			{ treatments, certifications, technologyGroups },
			"Tags retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching tags", error);
		const message = error instanceof Error ? error.message : "Failed to fetch tags";
		return internalServerErrorResponse(message);
	}
}
