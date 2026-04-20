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
			{ title: "MOTUS PRO", href: "/klinikutrustning/harborttagning/motus-pro" },
			{ title: "Motus AX / AY", href: "/klinikutrustning/harborttagning/harborttagningslaser-kopa-motus-ax" },
			{ title: "Again PRO PLUS", href: "/klinikutrustning/harborttagning/again-pro" },
		],
	},
	{
		name: "Pico & Q-Switched",
		machines: [
			{ title: "Q-terra Q10", href: "/klinikutrustning/tatueringsborttagning/qterra-q10-tatueringsborttagning-laser-sverige" },
			{ title: "Toro Pico Laser", href: "/klinikutrustning/tatueringsborttagning/toro" },
		],
	},
	{
		name: "Diodlaser",
		machines: [
			{ title: "Tridi Wave", href: "/klinikutrustning/harborttagning/tridi-wave" },
		],
	},
	{
		name: "IPL",
		machines: [
			{ title: "Prisma", href: "/klinikutrustning/hudforyngring/prisma" },
		],
	},
	{
		name: "Fraktionerad laser 1540/1570nm",
		machines: [
			{ title: "Helix", href: "/klinikutrustning/hudforyngring/helix" },
			{ title: "DuoGlide", href: "/klinikutrustning/co2laser/duoglide" },
		],
	},
	{
		name: "CO₂ Fraktionerad laser",
		machines: [
			{ title: "Helix", href: "/klinikutrustning/hudforyngring/helix" },
			{ title: "Tetra PRO", href: "/klinikutrustning/co2laser/tetra-pro" },
			{ title: "SmartXide PRO", href: "/klinikutrustning/co2laser/ny-smartxide-punto" },
			{ title: "Punto", href: "/klinikutrustning/co2laser/ny-smartxide-punto" },
			{ title: "DuoGlide", href: "/klinikutrustning/co2laser/duoglide" },
		],
	},
	{
		name: "Fraktionerad Redium 675 nm",
		machines: [
			{ title: "RedTouch PRO", href: "/klinikutrustning/hudforyngring/redium" },
		],
	},
	{
		name: "RF Microneedling",
		machines: [
			{ title: "Vivace RF", href: "/klinikutrustning/hudforyngring/vivace-rf-microneedling" },
		],
	},
	{
		name: "HIFU",
		machines: [
			{ title: "HIFU Ultraskin S", href: "/klinikutrustning/hudforyngring/hifu-ultraskin-s" },
		],
	},
	{
		name: "Plasma",
		machines: [
			{ title: "Jovena", href: "/klinikutrustning/ansiktsbehandlingar/jovena" },
			{ title: "Plasmage", href: "/klinikutrustning/ansiktsbehandlingar/plasmage" },
		],
	},
	{
		name: "Body Contouring",
		machines: [
			{ title: "Onda Coolwaves PRO", href: "/klinikutrustning/kropp-muskler-fett/onda-coolwaves-pro" },
			{ title: "BodyStim Pro", href: "/klinikutrustning/kropp-muskler-fett/bodystim-pro" },
			{ title: "HIFU Ultraskin S", href: "/klinikutrustning/hudforyngring/hifu-ultraskin-s" },
		],
	},
	{
		name: "EMS",
		machines: [
			{ title: "BodyStim Pro", href: "/klinikutrustning/kropp-muskler-fett/bodystim-pro" },
		],
	},
];
