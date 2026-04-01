/**
 * Static technology-to-machine mapping for the UTRUSTNING mega menu and sidebar.
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
			{ title: "Motus AX / AY", href: "/kategori/harborttagning/harborttagningslaser-kopa-motus-ax" },
			{ title: "Again PRO PLUS", href: "/kategori/harborttagning/again-pro" },
		],
	},
	{
		name: "Pico & Q-Switched",
		machines: [
			{ title: "Q-terra Q10", href: "/kategori/tatueringsborttagning/qterra-q10-tatueringsborttagning-laser-sverige" },
			{ title: "Toro Pico Laser", href: "/kategori/tatueringsborttagning/toro" },
		],
	},
	{
		name: "Diodlaser",
		machines: [
			{ title: "Tridi Wave", href: "/produkter" },
		],
	},
	{
		name: "IPL",
		machines: [
			{ title: "Prisma", href: "/produkter" },
		],
	},
	{
		name: "Fraktionerad laser 1540/1570nm",
		machines: [
			{ title: "Helix", href: "/produkter" },
			{ title: "DuoGlide", href: "/kategori/co2laser/duoglide" },
		],
	},
	{
		name: "CO₂ Fraktionerad laser",
		machines: [
			{ title: "Helix", href: "/produkter" },
			{ title: "Tetra PRO", href: "/kategori/co2laser/tetra-pro" },
			{ title: "SmartXide PRO", href: "/kategori/co2laser/ny-smartxide-punto" },
			{ title: "Punto", href: "/kategori/co2laser/ny-smartxide-punto" },
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
		name: "HIFU",
		machines: [
			{ title: "HIFU Ultraskin S", href: "/produkter" },
		],
	},
	{
		name: "Plasma",
		machines: [
			{ title: "Jovena", href: "/kategori/ansiktsbehandlingar/jovena" },
			{ title: "Plasmage", href: "/produkter" },
		],
	},
	{
		name: "Body Contouring",
		machines: [
			{ title: "Onda Coolwaves PRO", href: "/kategori/kropp-muskler-fett/onda-coolwaves-pro" },
			{ title: "BodyStim Pro", href: "/produkter" },
			{ title: "HIFU Ultraskin S", href: "/produkter" },
		],
	},
	{
		name: "EMS",
		machines: [
			{ title: "BodyStim Pro", href: "/produkter" },
		],
	},
];
