/**
 * Per-product custom feature sections content.
 *
 * Option-B implementation (prop-driven components, content isolated to this file).
 * In a future phase this can be migrated to a CMS / admin dashboard.
 *
 * Add a new entry keyed by product `slug` to enable feature sections for a product.
 */

import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Icons used directly in the hardcoded build functions below
const {
	MonitorSmartphone,
	Hand,
	Layers,
	Shield,
	SlidersHorizontal,
	Snowflake,
	Cable,
	TrendingUp,
	Headphones,
	Workflow,
	Smartphone,
	Sliders,
	Settings2,
	Zap,
	HeartHandshake,
	BadgeCheck,
	Target,
	Leaf,
	Activity,
	Clock,
	MousePointer2,
	Wrench,
	ServerCog,
} = LucideIcons;

/**
 * Map of icon name strings (stored in DB) → Lucide icon components.
 * Includes all ~1000+ icons from lucide-react available in the dashboard dropdown.
 * Excludes the aliased *Icon duplicates and non-component exports.
 */
export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
	Object.entries(LucideIcons).filter(
		([key]) => !key.endsWith("Icon") && /^[A-Z]/.test(key)
	)
) as Record<string, LucideIcon>;

/** Sorted list of icon names for the dashboard dropdown */
export const ICON_NAMES = Object.keys(ICON_MAP).sort();

/** Resolve an icon name string to a LucideIcon, falling back to Shield */
function resolveIcon(name: string | undefined): LucideIcon {
	if (!name) return Shield;
	return ICON_MAP[name] ?? Shield;
}

import type { ProductFeatureSplitProps } from "@/components/products/sections/ProductFeatureSplit";
import type { ProductFeatureImageListProps } from "@/components/products/sections/ProductFeatureImageList";
import type { ProductFeatureGridProps } from "@/components/products/sections/ProductFeatureGrid";
import type { FeatureSections } from "@/types/product";

export interface ProductCustomSections {
	section1: ProductFeatureSplitProps;
	section2: ProductFeatureImageListProps;
	section3: ProductFeatureGridProps;
}

function buildMotusAyContent(
	section1Image: string,
	section2TopImage: string,
	section2BottomImage: string,
	section3Image: string
): ProductCustomSections {
	const touchscreenImage = section2TopImage || "/placeholder.avif";

	return {
		section1: {
			eyebrow: "VARFÖR MOTUS AY",
			heading: "Byggd för moderna kliniker",
			paragraphs: [
				"Motus AY är utvecklad för kliniker som kräver driftsäkerhet, användarvänlighet och konsekvent höga behandlingsresultat. Varje detalj — från intuitiv styrning till komponenternas kvalitet — är designad för att förenkla arbetet, minska oönskad väntetid och ge optimala resultat, varje dag.",
				"Den modulära plattformen gör det enkelt att integrera Motus AY i din klinikmiljö och anpassa systemet efter dina behov, idag och i framtiden.",
			],
			image: section1Image,
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
				image: section2BottomImage,
				imageAlt: "Laserbehandling av patient",
			},
		},

		section3: {
			eyebrow: "VARFÖR MOTUS AY",
			heading: "Tekniska fördelar som märks i vardagen",
			description:
				"Motus AY är utvecklad för att ge dig full kontroll, hög patientsäkerhet och förutsägbara resultat — varje behandling, varje gång.",
			image: section3Image,
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
	section1Image: string,
	section2TopImage: string,
	section2BottomImage: string,
	section3Image: string
): ProductCustomSections {
	const touchscreenImage = section2TopImage || "/placeholder.avif";
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
			image: section1Image,
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
				image: section2BottomImage,
				imageAlt: "Klinisk behandling",
			},
		},

		section3: {
			eyebrow: `VARFÖR ${upperName}`,
			heading: "Tekniska fördelar som märks i vardagen",
			description: `${safeName} är utvecklad för att ge dig full kontroll, hög patientsäkerhet och förutsägbara resultat — varje behandling, varje gång.`,
			image: section3Image,
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
 * Build sections from CMS data (featureSections field on product).
 * Falls back to generic content for any section that has no CMS heading set.
 */
function buildFromCmsData(
	cmsData: FeatureSections,
	productName: string,
	productImage: string
): ProductCustomSections {
	const generic = buildGenericContent(productName, productImage, productImage, productImage, productImage);
	const s1 = cmsData.section1;
	const s2 = cmsData.section2;
	const s3 = cmsData.section3;

	const section1: ProductFeatureSplitProps = s1?.heading
		? {
				eyebrow: s1.eyebrow || generic.section1.eyebrow,
				heading: s1.heading,
				paragraphs: [s1.paragraph1 || "", s1.paragraph2 || ""].filter(Boolean),
				image: productImage,
				imageAlt: productName,
				numberedFeatures: (s1.numberedFeatures ?? []).map((f) => ({
					icon: resolveIcon(f.iconName),
					title: f.title,
					description: f.description,
				})),
				benefits: (s1.benefits ?? []).map((b) => ({
					icon: resolveIcon(b.iconName),
					title: b.title,
					description: b.description,
				})),
		  }
		: generic.section1;

	const section2: ProductFeatureImageListProps = s2?.heading
		? {
				eyebrow: s2.eyebrow || generic.section2.eyebrow,
				heading: s2.heading,
				description: s2.description,
				topBlock: {
					image: productImage,
					imageAlt: productName,
					items: (s2.topItems ?? []).map((f) => ({
						icon: resolveIcon(f.iconName),
						title: f.title,
						description: f.description,
					})),
				},
				bottomBlock: {
					sectionNumber: "02",
					title: s2.bottomTitle || generic.section2.bottomBlock.title,
					description: s2.bottomDescription,
					items: (s2.bottomItems ?? []).map((f) => ({
						icon: resolveIcon(f.iconName),
						title: f.title,
						description: f.description,
					})),
					image: productImage,
					imageAlt: productName,
				},
		  }
		: generic.section2;

	const section3: ProductFeatureGridProps = s3?.heading
		? {
				eyebrow: s3.eyebrow || generic.section3.eyebrow,
				heading: s3.heading,
				description: s3.description,
				image: productImage,
				imageAlt: productName,
				features: (s3.gridFeatures ?? []).map((f) => ({
					icon: resolveIcon(f.iconName),
					title: f.title,
					description: f.description,
				})),
				bottomBlock: {
					sectionNumber: "03",
					title: s3.bottomTitle || generic.section3.bottomBlock?.title || "",
					description: s3.bottomDescription,
					items: (s3.bottomItems ?? []).map((f) => ({
						icon: resolveIcon(f.iconName),
						title: f.title,
						description: f.description,
					})),
				},
		  }
		: generic.section3;

	return { section1, section2, section3 };
}

export interface SectionImages {
	section1Image?: string;
	section2TopImage?: string;
	section2BottomImage?: string;
	section3Image?: string;
}

/**
 * Returns custom section content for a given product.
 *
 * Priority order:
 * 1. CMS data from featureSections (if any section heading is set)
 * 2. Hardcoded per-product builder (e.g. motus-ay)
 * 3. Generic fallback builder
 *
 * sectionImages: per-section images set in the Media tab of the dashboard.
 * Each falls back to productImage (overviewImage) if not set.
 */
export function getProductCustomSections(
	slug: string,
	productName: string,
	productImage: string,
	cmsData?: FeatureSections,
	sectionImages?: SectionImages
): ProductCustomSections | null {
	const s1img = sectionImages?.section1Image || productImage;
	const s2topImg = sectionImages?.section2TopImage || productImage;
	const s2botImg = sectionImages?.section2BottomImage || productImage;
	const s3img = sectionImages?.section3Image || productImage;

	// If CMS data has at least one section with a heading, use CMS data
	if (cmsData && (cmsData.section1?.heading || cmsData.section2?.heading || cmsData.section3?.heading)) {
		const result = buildFromCmsData(cmsData, productName, productImage);
		result.section1.image = s1img;
		result.section2.topBlock.image = s2topImg;
		result.section2.bottomBlock.image = s2botImg;
		result.section3.image = s3img;
		applySectionCta(result);
		return result;
	}

	// Fall back to hardcoded or generic content
	const result =
		slug === "motus-ay"
			? buildMotusAyContent(s1img, s2topImg, s2botImg, s3img)
			: buildGenericContent(productName, s1img, s2topImg, s2botImg, s3img);
	applySectionCta(result);
	return result;
}

/**
 * Every product's section2 ("Byggd för ..." style block) links to the
 * inquiry form — matches the "Begär offert" CTA convention used elsewhere
 * on the site (hero, sidebar) for the same scroll-to-inquiry-form action.
 */
function applySectionCta(sections: ProductCustomSections): void {
	sections.section2.ctaText = "Begär offert";
	sections.section2.ctaHref = "#product-inquiry-form";
}
