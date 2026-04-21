import { unstable_cache } from "next/cache";
import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { getTechnologyGroupModel } from "@/models/technology-group.model";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Cache tags for products and categories
 * Use these to revalidate when content changes
 */
export const PRODUCTS_CACHE_TAG = "products";
export const CATEGORIES_CACHE_TAG = "categories";
export const TECHNOLOGY_GROUPS_CACHE_TAG = "technology-groups";

// 24 hours in seconds
const CACHE_REVALIDATE = 86400;

/**
 * Get published products with ISR caching (24 hours)
 * For use on /produkter and /kategori pages
 */
export const getPublishedProducts = unstable_cache(
	async (options?: {
		limit?: number;
		sort?: string;
	}): Promise<IProduct[]> => {
		const { data } = await productRepository.findPublished({
			limit: options?.limit ?? 100,
			sort: options?.sort,
		});
		return data;
	},
	["published-products"],
	{
		tags: [PRODUCTS_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get published products sorted by newest first
 * For /produkter page
 */
export const getNewestProducts = unstable_cache(
	async (limit: number = 100): Promise<IProduct[]> => {
		const { data } = await productRepository.findPublished({
			limit,
			sort: "-createdAt",
		});
		return data;
	},
	["newest-products"],
	{
		tags: [PRODUCTS_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get active categories with ISR caching (24 hours)
 * For use on sidebar filters
 */
export const getActiveCategories = unstable_cache(
	async (): Promise<ICategory[]> => {
		return categoryRepository.findActiveCategories();
	},
	["active-categories"],
	{
		tags: [CATEGORIES_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get products by category with ISR caching (24 hours)
 */
export const getProductsByCategory = unstable_cache(
	async (
		categoryId: string,
		limit: number = 100
	): Promise<IProduct[]> => {
		const { data } = await productRepository.findByCategory(categoryId, {
			limit,
			publishedOnly: true,
		});
		return data;
	},
	["products-by-category"],
	{
		tags: [PRODUCTS_CACHE_TAG, CATEGORIES_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

export interface TechGroupProduct {
	title: string;
	slug: string;
	primaryCategorySlug: string;
}

export interface TechGroup {
	name: string;
	products: TechGroupProduct[];
}

/**
 * Get technology groups aggregated from products' technologyGroup field
 */
export const getTechnologyGroups = unstable_cache(
	async (): Promise<TechGroup[]> => {
		const { data: products } = await productRepository.findPublished({ limit: 200 });

		const techGroupMap = new Map<string, TechGroupProduct[]>();

		for (const product of products) {
			const groups = (product as unknown as { technologyGroups?: string[] }).technologyGroups;
			if (!groups?.length) continue;

			const primaryCat = product.primaryCategory as unknown as { slug?: string };
			let primaryCategorySlug = primaryCat?.slug || "";
			if (!primaryCategorySlug && product.categories?.length > 0) {
				const firstCat = product.categories[0] as unknown as { slug?: string };
				primaryCategorySlug = firstCat?.slug || "";
			}

			const techProduct = { title: product.title, slug: product.slug, primaryCategorySlug };
			for (const group of groups) {
				const existing = techGroupMap.get(group) || [];
				existing.push(techProduct);
				techGroupMap.set(group, existing);
			}
		}

		return Array.from(techGroupMap.entries())
			.map(([name, products]) => ({ name, products }))
			.sort((a, b) => a.name.localeCompare(b.name, "sv"));
	},
	["technology-groups"],
	{ tags: [PRODUCTS_CACHE_TAG], revalidate: CACHE_REVALIDATE }
);

/**
 * Get active technology group names from the TechnologyGroup collection
 * Used by /produkter sidebar "Teknologikategori" section
 */
export const getActiveTechnologyGroupNames = unstable_cache(
	async (): Promise<{ _id: string; name: string; order: number }[]> => {
		const TechnologyGroup = await getTechnologyGroupModel();
		const groups = await TechnologyGroup.find({ isActive: true })
			.sort({ order: 1, name: 1 })
			.select("_id name order")
			.lean();
		return groups.map((g) => ({
			_id: g._id.toString(),
			name: g.name,
			order: g.order,
		}));
	},
	["active-technology-group-names"],
	{
		tags: [TECHNOLOGY_GROUPS_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get category by slug with ISR caching (24 hours)
 */
export const getCategoryBySlug = unstable_cache(
	async (slug: string): Promise<ICategory | null> => {
		return categoryRepository.findBySlug(slug);
	},
	["category-by-slug"],
	{
		tags: [CATEGORIES_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);
