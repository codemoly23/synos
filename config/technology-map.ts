/**
 * Static technology-to-machine mapping for the UTRUSTNING mega menu.
 * Groups laser/device products by technology type.
 * Products not yet in the database are omitted — add them when created.
 */

export interface TechMachine {
	title: string;
	href: string;
}

export interface TechGroup {
	name: string;
	machines: TechMachine[];
}

export const technologyMap: TechGroup[] = [
	{
		name: "Alexandrit & Nd:YAG",
		machines: [
			{ title: "MOTUS PRO", href: "/kategori/harborttagning/motus-pro" },
			{
				title: "Motus AX",
				href: "/kategori/harborttagning/harborttagningslaser-kopa-motus-ax",
			},
			{ title: "Motus AY", href: "/kategori/harborttagning/motus-ay" },
			{ title: "Again PRO PLUS", href: "/kategori/harborttagning/again-pro" },
		],
	},
	{
		name: "Pico & Q-Switched",
		machines: [
			{
				title: "QTERRA Q10",
				href: "/kategori/tatueringsborttagning/qterra-q10-tatueringsborttagning-laser-sverige",
			},
			{ title: "TORO Pico Laser", href: "/kategori/tatueringsborttagning/toro" },
			{ title: "SmartPICO", href: "/kategori/tatueringsborttagning/smartpico" },
		],
	},
	{
		name: "CO₂ Fraktionerad laser",
		machines: [
			{ title: "Tetra PRO", href: "/kategori/co2laser/tetra-pro" },
			{ title: "SmartXide Punto", href: "/kategori/co2laser/ny-smartxide-punto" },
			{ title: "DuoGlide", href: "/kategori/co2laser/duoglide" },
		],
	},
	{
		name: "Fraktionerad Redium 675 nm",
		machines: [
			{ title: "RedTouch PRO", href: "/kategori/hudforyngring/redium" },
		],
	},
	{
		name: "RF Microneedling",
		machines: [
			{ title: "Vivace RF", href: "/kategori/hudforyngring/vivace-rf-microneedling" },
		],
	},
	{
		name: "Plasma",
		machines: [
			{ title: "Jovena", href: "/kategori/ansiktsbehandlingar/jovena" },
		],
	},
	{
		name: "Body Contouring",
		machines: [
			{
				title: "Onda Coolwaves PRO",
				href: "/kategori/kropp-muskler-fett/onda-coolwaves-pro",
			},
		],
	},
];
