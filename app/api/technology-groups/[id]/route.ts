import { NextRequest } from "next/server";
import { getTechnologyGroupModel } from "@/models/technology-group.model";
import { successResponse, internalServerErrorResponse, notFoundResponse, badRequestResponse } from "@/lib/utils/api-response";
import { revalidateTag } from "next/cache";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { name, isActive, order } = body;

		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.findById(id);
		if (!group) return notFoundResponse("Technology group not found");

		if (name !== undefined) group.name = name.trim();
		if (isActive !== undefined) group.isActive = isActive;
		if (order !== undefined) group.order = order;

		await group.save();

		revalidateTag("technology-groups");
		revalidateTag("products");

		return successResponse(group, "Technology group updated successfully");
	} catch (error: unknown) {
		if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000) {
			return badRequestResponse("A technology group with this name already exists");
		}
		return internalServerErrorResponse("Failed to update technology group");
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const TechnologyGroup = await getTechnologyGroupModel();
		const group = await TechnologyGroup.findByIdAndDelete(id);
		if (!group) return notFoundResponse("Technology group not found");

		revalidateTag("technology-groups");
		revalidateTag("products");

		return successResponse(null, "Technology group deleted successfully");
	} catch (error) {
		return internalServerErrorResponse("Failed to delete technology group");
	}
}
