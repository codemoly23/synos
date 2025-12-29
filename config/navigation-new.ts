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
 * Aligned with WordPress site structure for SEO consistency.
 * Old WordPress URLs are redirected in next.config.ts
 *
 * WordPress URL → Our URL (redirects configured):
 * - /blogg/ → /nyheter/
 * - /om-oss/varfor-valja-synos/ → /starta-eget/varfor-valja-synos
 * - /kopguide/ → /starta-eget/kopguide
 * - /utbildningar/miniutbildning-online/ → /starta-eget/miniutbildning
 * - /om-oss/jobba-hos-oss/ → /om-oss/lediga-tjanster
 * - /om-oss/integritetspolicy/ → /integritetspolicy
 */
export const mainNavNew: NavItem[] = [
	// WordPress: "NYHETER OCH ARTIKLAR" → /blogg/
	// Our site uses /nyheter/ with redirect from /blogg/
	{
		title: "Nyheter och artiklar",
		href: "/nyheter",
	},

	// WordPress: "PRODUKTER" (dropdown with categories)
	{
		title: "Produkter",
		href: "/produkter",
		isDynamic: true, // This item loads categories/products from database
	},

	// WordPress: "STARTA EGET" (dropdown)
	// Submenu items aligned with WordPress labels
	{
		title: "Starta Eget",
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

	// WordPress: "UTBILDNINGAR" → /utbildningar/
	{
		title: "Utbildningar",
		href: "/utbildningar",
	},

	// WordPress: "OM OSS" (dropdown)
	// Submenu items aligned with WordPress labels
	{
		title: "Om Oss",
		href: "/om-oss",
		items: [
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

	// WordPress: "KONTAKT" → /kontakt/
	{
		title: "Kontakt",
		href: "/kontakt",
	},
];
