import type { Product } from "@/types/product";

export const featuredProducts: Product[] = [
  {
    id: "motus-pro",
    slug: "motus-pro",
    name: "MOTUS PRO",
    description:
      "Revolutionerande Moveo-teknologi för smärtfri hårborttagning på alla hudtyper",
    longDescription:
      "MOTUS PRO är en banbrytande alexandritlaser med unik Moveo-teknologi som möjliggör snabb, säker och nästan smärtfri hårborttagning. Perfekt för alla hudtyper och hårfärger.",
    categories: ["hair-removal", "pigmentation", "vascular"],
    treatments: ["Hårborttagning", "Pigmentfläckar", "Ytliga blodkärl"],
    features: [
      {
        title: "Moveo-teknologi",
        description:
          "Unik teknologi för kontinuerlig rörelse och jämn energifördelning",
      },
      {
        title: "Alla hudtyper",
        description: "Säker behandling på alla hudtyper, även mörk hud",
      },
      {
        title: "Snabb behandling",
        description: "Stora behandlingsytor på kort tid",
      },
      {
        title: "Smärtfri",
        description: "Minimal obehag tack vare avancerad kylning",
      },
    ],
    specifications: [
      { label: "Våglängd", value: "755 nm (Alexandrit)" },
      { label: "Energi", value: "Upp till 20 J/cm²" },
      { label: "Repetitionsfrekvens", value: "Upp till 10 Hz" },
      { label: "Spotsize", value: "9-15 mm" },
    ],
    images: [
      {
        url: "/images/products/motus-pro.jpg",
        alt: "MOTUS PRO Laser",
        width: 800,
        height: 600,
        isPrimary: true,
      },
    ],
    seo: {
      title: "MOTUS PRO - Alexandritlaser för hårborttagning | Synos Medical",
      description:
        "MOTUS PRO med Moveo-teknologi - Smärtfri hårborttagning på alla hudtyper. Snabb, säker och effektiv behandling.",
      keywords: ["MOTUS PRO", "alexandritlaser", "hårborttagning", "Moveo"],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "toro-pico",
    slug: "toro-pico-laser",
    name: "TORO Pico Laser",
    description:
      "Avancerad picolaser för tatueringsborttagning och hudföryngring",
    longDescription:
      "TORO Pico Laser är en toppmodern picolaser som levererar ultrakort pulsenergi för effektiv tatueringsborttagning och hudföryngring med minimal vävnadsskada.",
    categories: ["tattoo-removal", "skin-rejuvenation", "pigmentation"],
    treatments: [
      "Tatueringsborttagning",
      "Hudföryngring",
      "Pigmentfläckar",
    ],
    features: [
      {
        title: "Picosekund-teknologi",
        description: "Ultrakort pulsenergi för optimal fragmentering",
      },
      {
        title: "Alla färger",
        description: "Effektiv på alla tatueringsfärger",
      },
      {
        title: "Minimal skada",
        description: "Skonsam mot omgivande vävnad",
      },
      {
        title: "Snabb läkning",
        description: "Kortare återhämtningstid",
      },
    ],
    specifications: [
      { label: "Våglängder", value: "532 nm, 1064 nm" },
      { label: "Pulslängd", value: "450-750 ps" },
      { label: "Energi", value: "Upp till 800 mJ" },
      { label: "Repetitionsfrekvens", value: "1-10 Hz" },
    ],
    images: [
      {
        url: "/images/products/toro-pico.jpg",
        alt: "TORO Pico Laser",
        width: 800,
        height: 600,
        isPrimary: true,
      },
    ],
    seo: {
      title: "TORO Pico Laser - Tatueringsborttagning | Synos Medical",
      description:
        "TORO Pico Laser med picosekund-teknologi för effektiv tatueringsborttagning och hudföryngring. Minimal vävnadsskada.",
      keywords: ["TORO", "picolaser", "tatueringsborttagning", "picosekund"],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "tetra-pro-co2",
    slug: "tetra-pro-co2-laser",
    name: "Tetra PRO CO₂ Laser",
    description:
      "Fraktionerad CO₂ laser för hudföryngring, ärr och kirurgi",
    longDescription:
      "Tetra PRO är en avancerad fraktionerad CO₂ laser som kombinerar precision med effektivitet för hudföryngring, ärrbehandling och kirurgiska ingrepp.",
    categories: [
      "skin-rejuvenation",
      "co2-fractional",
      "facial-treatments",
      "acne-scars",
      "surgery",
      "pigmentation",
    ],
    treatments: [
      "Hudföryngring",
      "Hudåtstramning",
      "Ärrbehandling",
      "Kirurgi",
      "Pigmentfläckar",
    ],
    features: [
      {
        title: "Fraktionerad teknologi",
        description: "Precision och kontroll för optimala resultat",
      },
      {
        title: "Multifunktionell",
        description: "Hudföryngring, ärr och kirurgi i ett system",
      },
      {
        title: "Snabb läkning",
        description: "Minimal downtime tack vare fraktionerad behandling",
      },
      {
        title: "Anpassningsbar",
        description: "Flexibla inställningar för olika behandlingar",
      },
    ],
    specifications: [
      { label: "Våglängd", value: "10600 nm (CO₂)" },
      { label: "Effekt", value: "Upp till 60W" },
      { label: "Pulsläge", value: "Kontinuerlig, pulsad, fraktionerad" },
      { label: "Spotsize", value: "0.12-2.0 mm" },
    ],
    images: [
      {
        url: "/images/products/tetra-pro.jpg",
        alt: "Tetra PRO CO₂ Laser",
        width: 800,
        height: 600,
        isPrimary: true,
      },
    ],
    seo: {
      title: "Tetra PRO CO₂ Laser - Hudföryngring & Kirurgi | Synos Medical",
      description:
        "Tetra PRO fraktionerad CO₂ laser för hudföryngring, ärrbehandling och kirurgi. Precision och effektivitet i ett system.",
      keywords: ["Tetra PRO", "CO2 laser", "fraktionerad", "hudföryngring"],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "jovena",
    slug: "jovena",
    name: "Jovena",
    description:
      "Multifunktionell plattform för hudföryngring och kroppsskulptering",
    longDescription:
      "Jovena är en innovativ multifunktionell plattform som kombinerar flera teknologier för hudföryngring, kroppsskulptering och ansiktsbehandlingar.",
    categories: [
      "skin-rejuvenation",
      "body-sculpting",
      "facial-treatments",
      "pigmentation",
    ],
    treatments: [
      "Hudföryngring",
      "Kroppsskulptering",
      "Ansiktsbehandlingar",
      "Pigmentfläckar",
    ],
    features: [
      {
        title: "Multifunktionell",
        description: "Flera behandlingar i ett system",
      },
      {
        title: "Icke-invasiv",
        description: "Säkra behandlingar utan kirurgi",
      },
      {
        title: "Synliga resultat",
        description: "Dokumenterade resultat efter behandling",
      },
      {
        title: "Flexibel",
        description: "Anpassningsbar för olika behandlingsområden",
      },
    ],
    specifications: [
      { label: "Teknologier", value: "RF, LED, Ultraljud" },
      { label: "Behandlingsområden", value: "Ansikte och kropp" },
      { label: "Handstycken", value: "Flera specialiserade handstycken" },
    ],
    images: [
      {
        url: "/images/products/jovena.jpg",
        alt: "Jovena",
        width: 800,
        height: 600,
        isPrimary: true,
      },
    ],
    seo: {
      title: "Jovena - Multifunktionell hudföryngring | Synos Medical",
      description:
        "Jovena multifunktionell plattform för hudföryngring, kroppsskulptering och ansiktsbehandlingar. Flera teknologier i ett system.",
      keywords: ["Jovena", "hudföryngring", "kroppsskulptering", "RF"],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "onda-coolwaves-pro",
    slug: "onda-coolwaves-pro",
    name: "Onda Coolwaves PRO",
    description:
      "Revolutionerande Coolwaves-teknologi för fettreducering och cellulitbehandling",
    longDescription:
      "Onda Coolwaves PRO använder unik mikrovågsteknologi för effektiv fettreducering och cellulitbehandling utan kirurgi.",
    categories: ["body-sculpting"],
    treatments: ["Fettreducering", "Cellulitbehandling", "Kroppsskulptering"],
    features: [
      {
        title: "Coolwaves-teknologi",
        description: "Unik mikrovågsteknologi för fettceller",
      },
      {
        title: "Icke-invasiv",
        description: "Ingen kirurgi eller downtime",
      },
      {
        title: "Effektiv",
        description: "Dokumenterade resultat på fett och cellulit",
      },
      {
        title: "Säker",
        description: "Skonsam behandling med minimal obehag",
      },
    ],
    specifications: [
      { label: "Frekvens", value: "2.45 GHz" },
      { label: "Effekt", value: "Upp till 100W" },
      { label: "Behandlingsområden", value: "Kropp" },
    ],
    images: [
      {
        url: "/images/products/onda-coolwaves.jpg",
        alt: "Onda Coolwaves PRO",
        width: 800,
        height: 600,
        isPrimary: true,
      },
    ],
    seo: {
      title: "Onda Coolwaves PRO - Fettreducering | Synos Medical",
      description:
        "Onda Coolwaves PRO med mikrovågsteknologi för effektiv fettreducering och cellulitbehandling. Icke-invasiv kroppsskulptering.",
      keywords: ["Onda", "Coolwaves", "fettreducering", "cellulit"],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "vivace-rf",
    slug: "vivace-rf",
    name: "Vivace RF",
    description:
      "Microneedling med RF för hudföryngring och åtstramning",
    longDescription:
      "Vivace RF kombinerar microneedling med radiofrekvens för djupgående hudföryngring, åtstramning och förbättrad hudkvalitet.",
    categories: ["skin-rejuvenation", "facial-treatments", "acne-scars"],
    treatments: ["Hudföryngring", "Hudåtstramning", "Ärrbehandling"],
    features: [
      {
        title: "RF Microneedling",
        description: "Kombinerad teknologi för optimala resultat",
      },
      {
        title: "Djupgående",
        description: "Når djupare hudlager för bättre resultat",
      },
      {
        title: "Minimal downtime",
        description: "Snabb återhämtning efter behandling",
      },
      {
        title: "Synliga resultat",
        description: "Förbättrad hudkvalitet och fasthet",
      },
    ],
    specifications: [
      { label: "Teknologi", value: "Microneedling + RF" },
      { label: "Nåldjup", value: "0.5-3.5 mm" },
      { label: "RF-frekvens", value: "1 MHz" },
    ],
    images: [
      {
        url: "/images/products/vivace-rf.jpg",
        alt: "Vivace RF",
        width: 800,
        height: 600,
        isPrimary: true,
      },
    ],
    seo: {
      title: "Vivace RF - Microneedling med RF | Synos Medical",
      description:
        "Vivace RF kombinerar microneedling med radiofrekvens för hudföryngring och åtstramning. Synliga resultat med minimal downtime.",
      keywords: ["Vivace", "RF microneedling", "hudföryngring", "åtstramning"],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return featuredProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return featuredProducts.filter((product) =>
    product.categories.includes(categoryId)
  );
}

export function getFeaturedProducts(limit?: number): Product[] {
  const products = featuredProducts.slice(0, limit);
  return products;
}

