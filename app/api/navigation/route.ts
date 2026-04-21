import { unstable_cache } from "next/cache";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { PRODUCTS_CACHE_TAG, CATEGORIES_CACHE_TAG } from "@/lib/services/product-cache.service";

export interface NavProduct {
	_id: string;
	title: string;
	slug: string;
	primaryCategorySlug: string | null;
}

export interface NavCategory {
	_id: string;
	name: string;
	slug: string;
	products: NavProduct[];
}

export interface NavTechProduct {
	_id: string;
	title: string;
	slug: string;
	primaryCategorySlug: string;
}

export interface NavTechGroup {
	name: string;
	products: NavTechProduct[];
}

export interface NavigationData {
	categories: NavCategory[];
	technologyGroups: NavTechGroup[];
}

const fetchNavigationData = unstable_cache(
	async (): Promise<NavigationData> => {
		const categories = await categoryRepository.findActiveCategories();
		const { data: products } = await productRepository.findPublished({ limit: 200 });
		return buildNavigationData(categories, products);
	},
	["navigation-data"],
	{ tags: [PRODUCTS_CACHE_TAG, CATEGORIES_CACHE_TAG], revalidate: 86400 }
);

function buildNavigationData(
	categories: Awaited<ReturnType<typeof categoryRepository.findActiveCategories>>,
	products: Awaited<ReturnType<typeof productRepository.findPublished>>["data"]
): NavigationData {

	const getCategoryId = (cat: unknown): string | null => {
		if (!cat) return null;
		if (typeof cat === "string") return cat;
		if (typeof cat === "object" && cat !== null) {
			if ("_id" in cat) {
				const id = (cat as { _id: unknown })._id;
				if (typeof id === "string") return id;
				if (typeof id === "object" && id !== null && "toString" in id) {
					return (id as { toString(): string }).toString();
				}
			}
			if ("toString" in cat) return (cat as { toString(): string }).toString();
		}
		return null;
	};

	const getCategorySlug = (cat: unknown): string | null => {
		if (!cat) return null;
		if (typeof cat === "object" && cat !== null && "slug" in cat) {
			return (cat as { slug: string }).slug;
		}
		return null;
	};

	const navCategories: NavCategory[] = categories.map((category) => {
		const categoryProducts = products.filter((product) => {
			if (!product.categories?.length) return false;
			return product.categories.some((cat) => getCategoryId(cat) === category._id.toString());
		});

		const navProducts: NavProduct[] = categoryProducts.map((product) => {
			let primaryCategorySlug: string | null = getCategorySlug(product.primaryCategory);
			if (!primaryCategorySlug && product.categories?.length > 0) {
				primaryCategorySlug = getCategorySlug(product.categories[0]);
			}
			if (!primaryCategorySlug) primaryCategorySlug = category.slug;
			return { _id: product._id.toString(), title: product.title, slug: product.slug, primaryCategorySlug };
		});

		return { _id: category._id.toString(), name: category.name, slug: category.slug, products: navProducts };
	});

	const filteredCategories = navCategories.filter((cat) => cat.products.length > 0);

	const techGroupMap = new Map<string, NavTechProduct[]>();
	for (const product of products) {
		const groups = (product as unknown as { technologyGroups?: string[] }).technologyGroups;
		if (!groups?.length) continue;

		let primaryCategorySlug = getCategorySlug(product.primaryCategory) || "";
		if (!primaryCategorySlug && product.categories?.length > 0) {
			primaryCategorySlug = getCategorySlug(product.categories[0]) || "";
		}

		const navProduct: NavTechProduct = {
			_id: product._id.toString(),
			title: product.title,
			slug: product.slug,
			primaryCategorySlug,
		};

		for (const group of groups) {
			const existing = techGroupMap.get(group) || [];
			existing.push(navProduct);
			techGroupMap.set(group, existing);
		}
	}

	const technologyGroups: NavTechGroup[] = Array.from(techGroupMap.entries())
		.map(([name, techProducts]) => ({ name, products: techProducts }))
		.sort((a, b) => a.name.localeCompare(b.name, "sv"));

	return { categories: filteredCategories, technologyGroups };
}

/**
 * GET /api/navigation
 */
export async function GET() {
	try {
		const navigationData = await fetchNavigationData();
		return successResponse(navigationData, "Navigation data retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching navigation data", error);
		const message = error instanceof Error ? error.message : "Failed to fetch navigation data";
		return internalServerErrorResponse(message);
	}
}
