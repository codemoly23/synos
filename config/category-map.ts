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
	{ name: "Permanent Hårborttagning", href: "/kategori/harborttagning" },
	{ name: "Tatueringsborttagning", href: "/kategori/tatueringsborttagning" },
	{ name: "Hudföryngring", href: "/kategori/hudforyngring" },
	{ name: "Pigmentbehandling", href: "/kategori/pigmentflackar" },
	{ name: "Kärlbehandling", href: "/kategori/ytliga-blodkarl-angiom" },
	{ name: "Akne & Ärrbehandling", href: "/kategori/akne" },
	{ name: "Kroppsformning & Fettbehandling", href: "/kategori/kropp-muskler-fett" },

	// NEW — create these categories in admin panel
	{ name: "Skin Resurfacing", href: "/kategori/skin-resurfacing" },
	{ name: "Huduppstramning", href: "/kategori/huduppstramning" },
	{ name: "Hudbristningar", href: "/kategori/hudbristningar" },
	{ name: "Muskeltoning", href: "/kategori/muskeltoning" },
	{ name: "Cellulitbehandling", href: "/kategori/cellulitbehandling" },
];
