export interface CategoryHeroConfig {
	title: string;
	subtitle: string;
	bulletPoints: string[];
	desktopImage: string;
	mobileImage: string;
}

export const categoryHeroConfig: Record<string, CategoryHeroConfig> = {
	harborttagning: {
		title: "Permanent Hårborttagning",
		subtitle: "Avancerad laserteknik för effektiv och permanent hårborttagning",
		bulletPoints: [
			"Effektiv på alla hudtyper och hårfärger",
			"Smärtfri behandling med MOVEO-teknik",
			"MDR-certifierad utrustning",
			"Snabb behandling med synliga resultat",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	tatueringsborttagning: {
		title: "Tatueringsborttagning",
		subtitle: "Precis och effektiv borttagning av tatueringar med Pico-teknik",
		bulletPoints: [
			"Effektiv på alla färger och hudtyper",
			"Minimal risk för ärrbildning",
			"Snabbare läkning med picosekundpulser",
			"MDR-certifierad utrustning",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	hudforyngring: {
		title: "Hudföryngring",
		subtitle: "Professionell hudföryngring med avancerad laserteknik",
		bulletPoints: [
			"Stimulerar hudens naturliga kollagenproduktion",
			"Effektiv mot fina linjer och rynkor",
			"Minimal återhämtningstid",
			"Synliga resultat från första behandlingen",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	co2laser: {
		title: "CO₂ Fraktionerad Laser",
		subtitle: "Avancerad skin resurfacing för djupgående hudförbättring",
		bulletPoints: [
			"Effektiv mot ärr, rynkor och fina linjer",
			"Stimulerar kollagen och elastinproduktion",
			"Djupgående hudförbättring med precision",
			"Anpassade behandlingsprotokoll",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	"kropp-muskler-fett": {
		title: "Kropp, Muskler & Fett",
		subtitle: "Professionell kroppsformning och fettreduktion utan kirurgi",
		bulletPoints: [
			"Effektiv fettreduktion utan kirurgi",
			"Muskelstimulering och toning med EMS",
			"Behandling av celluliter",
			"Snabba och synliga resultat",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	ansiktsbehandlingar: {
		title: "Ansiktsbehandlingar",
		subtitle: "Avancerade plasma- och ansiktsbehandlingar för professionella kliniker",
		bulletPoints: [
			"Effektiv mot acne, ärr och pigmentfläckar",
			"Plasma-teknologi för hudföryngring",
			"Minimal återhämtningstid",
			"MDR-certifierade behandlingar",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	pigmentflackar: {
		title: "Pigmentfläckar",
		subtitle: "Effektiv behandling av pigmentfläckar och missfärgningar",
		bulletPoints: [
			"Precisionsbehandling med Q-switch teknik",
			"Effektiv på alla typer av pigmentfläckar",
			"Minimal risk för biverkningar",
			"MDR-certifierade maskiner",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	"akne-arr-och-hudbristningar": {
		title: "Akne, Ärr & Hudbristningar",
		subtitle: "Effektiv behandling av acne, ärr och hudbristningar",
		bulletPoints: [
			"Behandlar aktiv acne och acneärr",
			"Reducerar synligheten av hudbristningar",
			"Stimulerar hudens läkningsprocess",
			"Synliga resultat utan lång återhämtning",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
	"ytliga-blodkarl-angiom": {
		title: "Ytliga Blodkärl & Angiom",
		subtitle: "Effektiv behandling av ytliga blodkärl och kärlförändringar",
		bulletPoints: [
			"Precis behandling av ytliga blodkärl",
			"Effektiv mot couperose och angiom",
			"Skonsam teknik med minimal obehag",
			"MDR-certifierad utrustning",
		],
		desktopImage: "/images/motus.png",
		mobileImage: "/images/motus-ax-3.jpg",
	},
};
