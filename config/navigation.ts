export interface NavItem {
	title: string;
	href: string;
	description?: string;
	items?: NavItem[];
}

export const mainNav: NavItem[] = [
	{
		title: "Produkter",
		href: "/produkter",
		items: [
			{
				title: "Hårborttagning",
				href: "/produkter/harborttagning",
				items: [
					{
						title: "MOTUS PRO",
						href: "/produkter/produkt/motus-pro",
					},
					{
						title: "Again PRO PLUS",
						href: "/produkter/produkt/again-pro-plus",
					},
					{
						title: "Motus AX",
						href: "/produkter/produkt/motus-ax",
					},
					{
						title: "Motus AY",
						href: "/produkter/produkt/motus-ay",
					},
				],
			},
			{
				title: "Tatueringsborttagning",
				href: "/produkter/tatueringsborttagning",
				items: [
					{
						title: "TORO Pico Laser",
						href: "/produkter/produkt/pico",
					},
					{
						title: "QTERRA Q10 Q-Switch",
						href: "/produkter/produkt/qterra-q10",
					},
					{
						title: "SmartPICO",
						href: "/produkter/produkt/smartpico",
					},
				],
			},
			{
				title: "Hudföryngring / Hudåtstramning",
				href: "/produkter/hudforyngring-hudatstramning",
				items: [
					{
						title: "Tetra PRO CO₂ Laser",
						href: "/produkter/produkt/tetra-pro-co2-laser",
					},
					{
						title: "Jovena",
						href: "/produkter/produkt/jovena",
					},
					{
						title: "RedTouch PRO",
						href: "/produkter/produkt/redtouch-pro",
					},
					{
						title: "DUOGlide",
						href: "/produkter/produkt/duoglide",
					},
					{
						title: "SmartXide Punto",
						href: "/produkter/produkt/smartxide-punto",
					},
					{
						title: "Vivace RF",
						href: "/produkter/produkt/vivace-rf",
					},
				],
			},
			{
				title: "CO₂ fraktionerad laser",
				href: "/produkter/co2-fraktionerad-laser",
				items: [
					{
						title: "Tetra PRO CO₂ Laser",
						href: "/produkter/produkt/tetra-pro-co2-laser",
					},
					{
						title: "DUOGlide",
						href: "/produkter/produkt/duoglide",
					},
					{
						title: "SmartXide Punto",
						href: "/produkter/produkt/smartxide-punto",
					},
				],
			},
			{
				title: "Kropp, muskler & fett",
				href: "/produkter/kropp-muskler-fett",
				items: [
					{
						title: "Jovena",
						href: "/produkter/produkt/jovena",
					},
					{
						title: "Onda Coolwaves PRO",
						href: "/produkter/produkt/onda-coolwaves-pro",
					},
				],
			},
			{
				title: "Ansiktsbehandlingar",
				href: "/produkter/ansiktsbehandlingar",
				items: [
					{
						title: "Tetra PRO CO₂ Laser",
						href: "/produkter/produkt/tetra-pro-co2-laser",
					},
					{
						title: "Jovena",
						href: "/produkter/produkt/jovena",
					},
					{
						title: "RedTouch PRO",
						href: "/produkter/produkt/redtouch-pro",
					},
					{
						title: "Vivace RF",
						href: "/produkter/produkt/vivace-rf",
					},
				],
			},
			{
				title: "Pigmentfläckar",
				href: "/produkter/pigmentflackar",
				items: [
					{
						title: "TORO Pico Laser",
						href: "/produkter/produkt/pico",
					},
					{
						title: "MOTUS PRO",
						href: "/produkter/produkt/motus-pro",
					},
					{
						title: "Jovena",
						href: "/produkter/produkt/jovena",
					},
				],
			},
			{
				title: "Akne, ärr och hudbristningar",
				href: "/produkter/akne-arr-hudbristningar",
				items: [
					{
						title: "Tetra PRO CO₂ Laser",
						href: "/produkter/produkt/tetra-pro-co2-laser",
					},
					{
						title: "Vivace RF",
						href: "/produkter/produkt/vivace-rf",
					},
				],
			},
			{
				title: "Ytliga blodkärl/angiom",
				href: "/produkter/ytliga-blodkarl-angiom",
				items: [
					{
						title: "MOTUS PRO",
						href: "/produkter/produkt/motus-pro",
					},
				],
			},
			{
				title: "Kirurgi",
				href: "/produkter/kirurgi",
				items: [
					{
						title: "Tetra PRO CO₂ Laser",
						href: "/produkter/produkt/tetra-pro-co2-laser",
					},
				],
			},
		],
	},
	{
		title: "Starta Eget",
		href: "/starta-eget",
		items: [
			{
				title: "Varför välja Synos?",
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
		title: "Blogg",
		href: "/blogg",
	},
	{
		title: "Kontakt",
		href: "/kontakt",
	},
];
