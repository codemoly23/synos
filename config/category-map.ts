/**
 * Static category list for the KATEGORI mega menu.
 * Display names may differ from DB category names — slugs must match DB.
 * Categories marked "NEW" need to be created in the admin panel.
 */

export interface CategoryItem {
	name: string;
	href: string;
}

export const categoryMap: CategoryItem[] = [
	// Existing DB categories (slug confirmed)
	{ name: "Permanent Hårborttagning", href: "/klinikutrustning/harborttagning" },
	{ name: "Tatueringsborttagning", href: "/klinikutrustning/tatueringsborttagning" },
	{ name: "Hudföryngring", href: "/klinikutrustning/hudforyngring" },
	{ name: "Pigmentbehandling", href: "/klinikutrustning/pigmentflackar" },
	{ name: "Kärlbehandling", href: "/klinikutrustning/ytliga-blodkarl-angiom" },
	{ name: "Akne & Ärrbehandling", href: "/klinikutrustning/akne" },
	{ name: "Kroppsformning & Fettbehandling", href: "/klinikutrustning/kropp-muskler-fett" },

	// NEW — create these categories in admin panel
	{ name: "Skin Resurfacing", href: "/klinikutrustning/skin-resurfacing" },
	{ name: "Huduppstramning", href: "/klinikutrustning/huduppstramning" },
	{ name: "Hudbristningar", href: "/klinikutrustning/hudbristningar" },
	{ name: "Muskeltoning", href: "/klinikutrustning/muskeltoning" },
	{ name: "Cellulitbehandling", href: "/klinikutrustning/cellulitbehandling" },
];
