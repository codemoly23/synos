import { NextRequest } from "next/server";
import { getTechnologyGroupModel } from "@/models/technology-group.model";
import { successResponse, internalServerErrorResponse, badRequestResponse } from "@/lib/utils/api-response";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const TechnologyGroup = await getTechnologyGroupModel();
		const groups = await TechnologyGroup.find({}).sort({ order: 1, name: 1 }).lean();
		return successResponse(groups, "Technology groups retrieved successfully");
	} catch (error) {
		return internalServerErrorResponse("Failed to fetch technology groups");
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, isActive = true, order = 0 } = body;

		if (!name?.trim()) {
			return badRequestResponse("Name is required");
		}

		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.create({ name: name.trim(), isActive, order });

		revalidateTag("technology-groups", "default");
		revalidateTag("products", "default");

		return successResponse(group, "Technology group created successfully");
	} catch (error: unknown) {
		if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000) {
			return badRequestResponse("A technology group with this name already exists");
		}
		return internalServerErrorResponse("Failed to create technology group");
	}
}
