/**
 * Per-product custom feature sections content.
 *
 * Option-B implementation (prop-driven components, content isolated to this file).
 * In a future phase this can be migrated to a CMS / admin dashboard.
 *
 * Add a new entry keyed by product `slug` to enable feature sections for a product.
 */

import {
	// Section 1 — numbered features
	MonitorSmartphone,
	Hand,
	Layers,
	// Section 1 — benefit chips
	Shield,
	SlidersHorizontal,
	Snowflake,
	Cable,
	TrendingUp,
	Headphones,
	// Section 2 — numbered list (top)
	Workflow,
	Smartphone,
	Sliders,
	Settings2,
	// Section 2 — feature list (bottom)
	Zap,
	HeartHandshake,
	BadgeCheck,
	// Section 3 — 2×2 grid
	Target,
	Leaf,
	Activity,
	Clock,
	// Section 3 — bottom horizontal features
	MousePointer2,
	Wrench,
	ServerCog,
} from "lucide-react";

import type { ProductFeatureSplitProps } from "@/components/products/sections/ProductFeatureSplit";
import type { ProductFeatureImageListProps } from "@/components/products/sections/ProductFeatureImageList";
import type { ProductFeatureGridProps } from "@/components/products/sections/ProductFeatureGrid";

export interface ProductCustomSections {
	section1: ProductFeatureSplitProps;
	section2: ProductFeatureImageListProps;
	section3: ProductFeatureGridProps;
}

/**
 * Build Motus AY content. Pass the product's main image so it shows in section 1.
 * Lifestyle / UI close-up images fall back to /placeholder.avif (replace with real
 * uploads when available).
 */
function buildMotusAyContent(productImage: string): ProductCustomSections {
	// TODO: replace with real lifestyle/treatment photos when available.
	// For now we reuse the product image so the layout doesn't show broken placeholders.
	const lifestyleImage = productImage || "/placeholder.avif";
	const touchscreenImage = productImage || "/placeholder.avif";

	return {
		section1: {
			eyebrow: "VARFÖR MOTUS AY",
			heading: "Byggd för moderna kliniker",
			paragraphs: [
				"Motus AY är utvecklad för kliniker som kräver driftsäkerhet, användarvänlighet och konsekvent höga behandlingsresultat. Varje detalj — från intuitiv styrning till komponenternas kvalitet — är designad för att förenkla arbetet, minska oönskad väntetid och ge optimala resultat, varje dag.",
				"Den modulära plattformen gör det enkelt att integrera Motus AY i din klinikmiljö och anpassa systemet efter dina behov, idag och i framtiden.",
			],
			image: productImage,
			imageAlt: "Motus AY laser",
			numberedFeatures: [
				{
					icon: MonitorSmartphone,
					title: "Tydlig touchskärm",
					description:
						"Stor, responsiv touchskärm med tydligt gränssnitt ger snabb åtkomst till alla funktioner och behandlingsprotokoll.",
				},
				{
					icon: Hand,
					title: "Ergonomiskt handstycke",
					description:
						"Lätt, balanserat och designat för maximal precision och användarkomfort, även under långa behandlingsdagar.",
				},
				{
					icon: Layers,
					title: "Stabil plattform",
					description:
						"Robust stationär enhet med solid uppbyggnad för att alltid leverera pålitliga resultat, behandling efter behandling.",
				},
			],
			benefits: [
				{
					icon: Shield,
					title: "Hög driftsäkerhet",
					description: "Konstruerad för dagligt bruk utan driftavbrott.",
				},
				{
					icon: SlidersHorizontal,
					title: "Flexibla inställningar",
					description: "Anpassningsbara behandlingsparametrar.",
				},
				{
					icon: Snowflake,
					title: "Effektiv kylning",
					description: "Integrerad kylning för trygg behandling.",
				},
				{
					icon: Cable,
					title: "Enkel integration",
					description: "Plug-and-play kompatibilitet med klinikmiljön.",
				},
				{
					icon: TrendingUp,
					title: "Resultat som märks",
					description: "Konsekventa och synliga behandlingsresultat.",
				},
				{
					icon: Headphones,
					title: "Pålitlig support",
					description: "Snabb teknisk support från Synos team.",
				},
			],
		},

		section2: {
			eyebrow: "KLINISK KONTROLL · ANVÄNDARVÄNLIGHET · KOMFORT",
			heading: "Utvecklad för precision och komfort",
			description:
				"Motus AY kombinerar avancerad laserteknologi med ett intuitivt arbetsflöde som ger dig klinisk kontroll, hög patientsäkerhet och perfekt komfort i varje behandling.",
			topBlock: {
				image: touchscreenImage,
				imageAlt: "Motus AY touchskärm",
				items: [
					{
						icon: Workflow,
						title: "Intuitivt arbetsflöde",
						description:
							"Allt-i-ett systemet är designat för optimal användarvänlighet. Tydliga menyer, snabba inställningar och övervakade behandlingsdata gör varje behandling kontrollerad.",
					},
					{
						icon: Smartphone,
						title: "Tydlig touchskärm",
						description:
							"Stor, responsiv touchskärm med tydligt grafiskt gränssnitt ger snabb åtkomst till funktioner och protokoll.",
					},
					{
						icon: Sliders,
						title: "Snabb parameterjustering",
						description:
							"Justera kraft, frekvens, pulsbredd och kylning i farten — anpassa varje behandling efter hudtyp och behandlingsmål.",
					},
					{
						icon: Settings2,
						title: "Flexibel behandlingsplan",
						description:
							"Bygg och spara individuella behandlingsplaner per patient. Motus AY följer din rutin och ger flexibilitet.",
					},
				],
			},
			bottomBlock: {
				sectionNumber: "02",
				title: "Skonsam energi, hög effekt",
				description:
					"Motus AY kombinerar kraftfull och skonsam laserterapi som ger imponerande resultat utan kompromiss på patientsäkerhet — för permanent hårborttagning, hudföryngring och pigmentbehandlingar.",
				items: [
					{
						icon: Zap,
						title: "Optimal balans mellan effekt och säkerhet",
						description:
							"Avancerad pulsteknologi ger optimal energifördelning som skonar huden samtidigt som den effektivt eliminerar hårstrukturen.",
					},
					{
						icon: HeartHandshake,
						title: "Komfort för patienten",
						description:
							"Kort pulslängd och balanserad energi minimerar obehag under behandling — ett naturligt val även för känslig hud.",
					},
					{
						icon: BadgeCheck,
						title: "Pålitliga, reproducerbara resultat",
						description:
							"Varje puls är noggrant kalibrerad för konsekvent behandling över tid — mätbara resultat i färre behandlingstillfällen.",
					},
				],
				image: lifestyleImage,
				imageAlt: "Laserbehandling av patient",
			},
		},

		section3: {
			eyebrow: "VARFÖR MOTUS AY",
			heading: "Tekniska fördelar som märks i vardagen",
			description:
				"Motus AY är utvecklad för att ge dig full kontroll, hög patientsäkerhet och förutsägbara resultat — varje behandling, varje gång.",
			image: lifestyleImage,
			imageAlt: "Klinisk laserbehandling med Motus AY",
			features: [
				{
					icon: Target,
					title: "Precisionskontroll",
					description:
						"Avancerad styrning och frekvensreglerad energi möjliggör skonsam behandling med minimal påverkan på omgivande vävnad.",
				},
				{
					icon: Leaf,
					title: "Behandlingskomfort",
					description:
						"Snabb kylteknik och intelligent energihantering minskar obehag och skyddar patientens hud.",
				},
				{
					icon: Activity,
					title: "Klinisk flexibilitet",
					description:
						"Justerbara parametrar och flera behandlingslägen gör att kliniken kan anpassa behandling efter olika hudtyper och behov.",
				},
				{
					icon: Clock,
					title: "Effektivt arbetsflöde",
					description:
						"Stabilt uppstartsläge, snabbresponsivt gränssnitt och korta behandlingstider optimerar verksamheten och höjer produktiviteten.",
				},
			],
			bottomBlock: {
				sectionNumber: "03",
				title: "Byggd för moderna kliniker",
				description:
					"Varje detalj i Motus AY är designad för pålitlighet, säkerhet och enkel integration i en modern klinikmiljö.",
				items: [
					{
						icon: MousePointer2,
						title: "Touchscreen",
						description:
							"Intuitivt gränssnitt för snabb och enkel styrning.",
					},
					{
						icon: Wrench,
						title: "Ergonomiskt handstycke",
						description:
							"Lätt, balanserat och designat för minimal trötthet.",
					},
					{
						icon: ServerCog,
						title: "Stabil plattform",
						description:
							"Robust uppbyggnad för långsiktig livslängd och pålitlig drift.",
					},
				],
			},
		},
	};
}

/**
 * Generic fallback content used for any product that doesn't have a dedicated
 * builder. Product name is interpolated where relevant so the copy adapts.
 *
 * Designed to be safe for the broader medical / clinic equipment range (not
 * making strong claims about specific modalities like laser wavelengths).
 */
function buildGenericContent(
	productName: string,
	productImage: string
): ProductCustomSections {
	const lifestyleImage = productImage || "/placeholder.avif";
	const touchscreenImage = productImage || "/placeholder.avif";
	const upperName = (productName || "Produkten").toUpperCase();
	const safeName = productName || "Denna produkt";

	return {
		section1: {
			eyebrow: `VARFÖR ${upperName}`,
			heading: "Byggd för moderna kliniker",
			paragraphs: [
				`${safeName} är utvecklad för kliniker som kräver driftsäkerhet, användarvänlighet och konsekvent höga behandlingsresultat. Varje detalj — från intuitiv styrning till komponenternas kvalitet — är designad för att förenkla arbetet och ge optimala resultat, varje dag.`,
				`Den modulära plattformen gör det enkelt att integrera ${safeName} i din klinikmiljö och anpassa systemet efter dina behov, idag och i framtiden.`,
			],
			image: productImage,
			imageAlt: safeName,
			numberedFeatures: [
				{
					icon: MonitorSmartphone,
					title: "Tydlig touchskärm",
					description:
						"Stor, responsiv touchskärm med tydligt gränssnitt ger snabb åtkomst till alla funktioner och behandlingsprotokoll.",
				},
				{
					icon: Hand,
					title: "Ergonomiskt handstycke",
					description:
						"Lätt, balanserat och designat för maximal precision och användarkomfort, även under långa behandlingsdagar.",
				},
				{
					icon: Layers,
					title: "Stabil plattform",
					description:
						"Robust uppbyggnad för att alltid leverera pålitliga resultat, behandling efter behandling.",
				},
			],
			benefits: [
				{
					icon: Shield,
					title: "Hög driftsäkerhet",
					description: "Konstruerad för dagligt bruk utan driftavbrott.",
				},
				{
					icon: SlidersHorizontal,
					title: "Flexibla inställningar",
					description: "Anpassningsbara behandlingsparametrar.",
				},
				{
					icon: Snowflake,
					title: "Effektiv kylning",
					description: "Integrerad kylning för trygg behandling.",
				},
				{
					icon: Cable,
					title: "Enkel integration",
					description: "Plug-and-play kompatibilitet med klinikmiljön.",
				},
				{
					icon: TrendingUp,
					title: "Resultat som märks",
					description: "Konsekventa och synliga behandlingsresultat.",
				},
				{
					icon: Headphones,
					title: "Pålitlig support",
					description: "Snabb teknisk support från Synos team.",
				},
			],
		},

		section2: {
			eyebrow: "KLINISK KONTROLL · ANVÄNDARVÄNLIGHET · KOMFORT",
			heading: "Utvecklad för precision och komfort",
			description: `${safeName} kombinerar avancerad teknologi med ett intuitivt arbetsflöde som ger dig klinisk kontroll, hög patientsäkerhet och perfekt komfort i varje behandling.`,
			topBlock: {
				image: touchscreenImage,
				imageAlt: `${safeName} touchskärm`,
				items: [
					{
						icon: Workflow,
						title: "Intuitivt arbetsflöde",
						description:
							"Allt-i-ett systemet är designat för optimal användarvänlighet. Tydliga menyer, snabba inställningar och övervakade behandlingsdata gör varje behandling kontrollerad.",
					},
					{
						icon: Smartphone,
						title: "Tydlig touchskärm",
						description:
							"Stor, responsiv touchskärm med tydligt grafiskt gränssnitt ger snabb åtkomst till funktioner och protokoll.",
					},
					{
						icon: Sliders,
						title: "Snabb parameterjustering",
						description:
							"Justera behandlingsparametrar i farten — anpassa varje behandling efter patient och behandlingsmål.",
					},
					{
						icon: Settings2,
						title: "Flexibel behandlingsplan",
						description: `Bygg och spara individuella behandlingsplaner per patient. ${safeName} följer din rutin och ger flexibilitet.`,
					},
				],
			},
			bottomBlock: {
				sectionNumber: "02",
				title: "Effektiv prestanda, hög komfort",
				description: `${safeName} levererar konsekventa, pålitliga resultat utan kompromiss på patientsäkerhet — för dig och dina patienter, varje behandling.`,
				items: [
					{
						icon: Zap,
						title: "Optimal balans mellan effekt och säkerhet",
						description:
							"Avancerad teknik ger optimal prestanda som skonar patienten samtidigt som behandlingen är effektiv.",
					},
					{
						icon: HeartHandshake,
						title: "Komfort för patienten",
						description:
							"Balanserad energi och kort behandlingstid minimerar obehag — ett naturligt val även för känslig hud.",
					},
					{
						icon: BadgeCheck,
						title: "Pålitliga, reproducerbara resultat",
						description:
							"Varje behandling är noggrant kalibrerad för konsekvent resultat över tid — mätbart i färre behandlingstillfällen.",
					},
				],
				image: lifestyleImage,
				imageAlt: "Klinisk behandling",
			},
		},

		section3: {
			eyebrow: `VARFÖR ${upperName}`,
			heading: "Tekniska fördelar som märks i vardagen",
			description: `${safeName} är utvecklad för att ge dig full kontroll, hög patientsäkerhet och förutsägbara resultat — varje behandling, varje gång.`,
			image: lifestyleImage,
			imageAlt: `${safeName} i klinisk användning`,
			features: [
				{
					icon: Target,
					title: "Precisionskontroll",
					description:
						"Avancerad styrning och reglerad energi möjliggör skonsam behandling med minimal påverkan på omgivande vävnad.",
				},
				{
					icon: Leaf,
					title: "Behandlingskomfort",
					description:
						"Snabb och intelligent energihantering minskar obehag och skyddar patientens hud.",
				},
				{
					icon: Activity,
					title: "Klinisk flexibilitet",
					description:
						"Justerbara parametrar och flera behandlingslägen gör att kliniken kan anpassa behandling efter olika behov.",
				},
				{
					icon: Clock,
					title: "Effektivt arbetsflöde",
					description:
						"Stabilt uppstartsläge, snabbresponsivt gränssnitt och korta behandlingstider höjer produktiviteten.",
				},
			],
			bottomBlock: {
				sectionNumber: "03",
				title: "Byggd för moderna kliniker",
				description: `Varje detalj i ${safeName} är designad för pålitlighet, säkerhet och enkel integration i en modern klinikmiljö.`,
				items: [
					{
						icon: MousePointer2,
						title: "Touchscreen",
						description:
							"Intuitivt gränssnitt för snabb och enkel styrning.",
					},
					{
						icon: Wrench,
						title: "Ergonomiskt handstycke",
						description:
							"Lätt, balanserat och designat för minimal trötthet.",
					},
					{
						icon: ServerCog,
						title: "Stabil plattform",
						description:
							"Robust uppbyggnad för långsiktig livslängd och pålitlig drift.",
					},
				],
			},
		},
	};
}

/**
 * Returns custom section content for a given product. Falls back to a generic
 * builder so every product detail page shows the feature sections.
 *
 * To override a product with custom copy, add a `case` to the switch returning
 * a dedicated builder (see `buildMotusAyContent`).
 */
export function getProductCustomSections(
	slug: string,
	productName: string,
	productImage: string
): ProductCustomSections | null {
	switch (slug) {
		case "motus-ay":
			return buildMotusAyContent(productImage);
		default:
			return buildGenericContent(productName, productImage);
	}
}
