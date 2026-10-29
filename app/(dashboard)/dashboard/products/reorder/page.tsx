import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { ReorderProductsList } from "./reorder-list";

/**
 * Products Reorder Page - Server Component
 * Fetches every product (any publish state) sorted by its current
 * display order, so the admin can drag-and-drop the priority used
 * on /klinikutrustning.
 */
export default async function ReorderProductsPage() {
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	let products: Array<{
		_id: string;
		title: string;
		slug: string;
		publishType: "publish" | "draft" | "pending" | "private";
		productImages: string[];
		order: number;
	}> = [];

	if (session?.user?.id) {
		try {
			const result = await productService.getProducts({
				limit: 200,
				sort: "order",
			});
			products = result.data.map((p) => ({
				_id: p._id.toString(),
				title: p.title,
				slug: p.slug,
				publishType: p.publishType,
				productImages: p.productImages,
				order: p.order,
			}));
		} catch (error) {
			console.error("Failed to fetch products for reordering:", error);
		}
	}

	return <ReorderProductsList initialProducts={products} />;
}
