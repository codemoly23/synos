export interface NavItem {
	title: string;
	href: string;
	description?: string;
	items?: NavItem[];
	isDynamic?: boolean; // Flag for items that load from database
}

/**
 * Main Navigation Configuration
 *
 * Updated per feedback:
 * - All items in UPPERCASE
 * - Produkter renamed to UTRUSTNING
 * - Added KATEGORI
 * - Team page under Om Oss
 *
 * Navigation Order: NYHETER | UTRUSTNING | KATEGORI | STARTA EGET | UTBILDNINGAR | OM OSS | KONTAKT
 *
 * Old WordPress URLs are redirected in next.config.ts
 */
export const mainNavNew: NavItem[] = [
	// NYHETER - News/Blog section
	{
		title: "NYHETER",
		href: "/nyheter",
	},

	// UTRUSTNING (formerly Produkter) - Equipment/Products
	{
		title: "UTRUSTNING",
		href: "/produkter",
		isDynamic: true, // This item loads categories/products from database
	},

	// KATEGORI - Categories
	{
		title: "KATEGORI",
		href: "/kategori",
		isDynamic: true, // This item loads categories from database
	},

	// STARTA EGET - Start Your Own Business
	{
		title: "STARTA EGET",
		href: "/starta-eget",
		items: [
			{
				title: "Varför välja Synos Medical?",
				href: "/starta-eget/varfor-valja-synos",
			},
			{
				title: "Köpguide",
				href: "/starta-eget/kopguide",
			},
			{
				title: "Miniutbildning",
				href: "/starta-eget/miniutbildning",
			},
		],
	},

	// UTBILDNINGAR - Training/Education
	{
		title: "UTBILDNINGAR",
		href: "/utbildningar",
	},

	// OM OSS - About Us (with Team page as submenu)
	{
		title: "OM OSS",
		href: "/om-oss",
		items: [
			{
				title: "Vårt Team",
				href: "/om-oss/team",
			},
			{
				title: "FAQ",
				href: "/faq",
			},
			{
				title: "Lediga tjänster",
				href: "/om-oss/lediga-tjanster",
			},
			{
				title: "Juridisk information",
				href: "/om-oss/juridisk-information",
			},
		],
	},

	// KONTAKT - Contact
	{
		title: "KONTAKT",
		href: "/kontakt",
	},
];
