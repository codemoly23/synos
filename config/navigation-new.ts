export interface NavItem {
	title: string;
	href: string;
	description?: string;
	items?: NavItem[];
	isDynamic?: boolean; // Flag for items that load from database
}

export const mainNavNew: NavItem[] = [
	{
		title: "Nyheter och artiklar",
		href: "/nyheter",
	},
	{
		title: "Produkter",
		href: "/produkter",
		isDynamic: true, // This item loads categories/products from database
	},
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
	{
		title: "Utbildningar",
		href: "/utbildningar",
	},
	{
		title: "Om Oss",
		href: "/om-oss",
		items: [
			{
				title: "Om Synos Medical",
				href: "/om-oss",
			},
			{
				title: "Vårt Team",
				href: "/om-oss/team",
			},
			{
				title: "FAQ",
				href: "/faq",
			},
			{
				title: "Lediga Tjänster",
				href: "/om-oss/lediga-tjanster",
			},
			{
				title: "Juridisk Information",
				href: "/om-oss/juridisk-information",
			},
		],
	},
	{
		title: "Kontakt",
		href: "/kontakt",
	},
];
