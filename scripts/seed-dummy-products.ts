/**
 * Seed dummy products for technologies without dedicated product pages.
 * Creates: Tridi Wave, Prisma, Helix, BodyStim Pro, HIFU Ultraskin S, Plasmage
 *
 * Run with: npx tsx scripts/seed-dummy-products.ts
 */
import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile() {
	const envFiles = [".env.local", ".env"];
	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				)
					value = value.slice(1, -1);
				if (!process.env[key]) process.env[key] = value;
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
	console.error("MONGODB_URI not defined");
	process.exit(1);
}

interface DummyProduct {
	title: string;
	slug: string;
	shortDescription: string;
	description: string;
	productDescription: string;
	benefits: string[];
	certifications: string[];
	treatments: string[];
	categorySlugs: string[];
	primaryCategorySlug: string;
	overviewImage: string;
	productImages: string[];
}

const DUMMY_PRODUCTS: DummyProduct[] = [
	{
		title: "Tridi Wave",
		slug: "tridi-wave",
		shortDescription:
			"Avancerad diodlaser för effektiv och skonsam permanent hårborttagning. Passar alla hudtyper året om.",
		description:
			"<p><strong>Tridi Wave</strong> är en professionell diodlaser som kombinerar tre våglängder (755nm, 808nm, 1064nm) för optimal behandling av alla hudtyper och hårtyper. Maskinen erbjuder snabb, säker och effektiv hårborttagning med minimal smärta.</p><p>Med sitt avancerade kylsystem och höga energiuttag är Tridi Wave idealisk för professionella kliniker som söker en mångsidig hårborttagningslösning.</p>",
		productDescription:
			"<p>Tridi Wave är utrustad med den senaste tekniken inom diodlaserbehandling och levererar konsekventa resultat behandling efter behandling.</p>",
		benefits: [
			"Tre våglängder för alla hudtyper",
			"Permanent hårborttagning",
			"Snabb behandlingstid",
			"Inbyggt kylsystem för komfort",
			"Säkert året om",
		],
		certifications: ["CE", "MDR-certifierad"],
		treatments: ["Hårborttagning", "Permanent hårreduktion"],
		categorySlugs: ["harborttagning"],
		primaryCategorySlug: "harborttagning",
		overviewImage: "/storage/images/motus-ax-3-600x500.webp",
		productImages: ["/storage/images/motus-ax-3-600x500.webp"],
	},
	{
		title: "Prisma IPL",
		slug: "prisma",
		shortDescription:
			"Avancerad IPL-maskin för hårborttagning, hudföryngring och pigmentbehandlingar. Ett mångsidigt verktyg för din klinik.",
		description:
			"<p><strong>Prisma</strong> är en högpresterande IPL-plattform (Intense Pulsed Light) designad för professionell användning. Maskinen hanterar ett brett spektrum av estetiska behandlingar från hårborttagning till hudföryngring.</p><p>Med utbytbara filter och justerbara parametrar kan Prisma anpassas för olika behandlingar och hudtyper.</p>",
		productDescription:
			"<p>Prisma erbjuder snabba resultat med hög säkerhet tack vare dess intelligenta energikontroll och kylteknologi.</p>",
		benefits: [
			"Mångsidig IPL-plattform",
			"Hårborttagning och hudföryngring",
			"Pigmentbehandlingar",
			"Behandling av kärl",
			"Utbytbara filter",
		],
		certifications: ["CE", "MDR-certifierad"],
		treatments: ["Hårborttagning", "Hudföryngring", "Pigmentbehandling"],
		categorySlugs: ["harborttagning", "hudforyngring", "pigmentflackar"],
		primaryCategorySlug: "hudforyngring",
		overviewImage: "/storage/images/motus-ax-3-600x500.webp",
		productImages: ["/storage/images/motus-ax-3-600x500.webp"],
	},
	{
		title: "Helix",
		slug: "helix",
		shortDescription:
			"Multi-våglängd fraktionerad laser med både 1540/1570nm och CO₂-funktion för omfattande hudbehandlingar.",
		description:
			"<p><strong>Helix</strong> är en avancerad fraktionerad laserplattform som kombinerar 1540/1570nm och CO₂-våglängder i en enda maskin. Denna mångsidighet gör den till ett idealiskt val för kliniker som erbjuder ett brett spektrum av hudföryngringsbehandlingar.</p><p>Helix kan användas för ärrbehandling, hudföryngring, akneärr, rynkor och mycket mer.</p>",
		productDescription:
			"<p>Med dubbla våglängder och intelligent kontrollsystem levererar Helix exceptionella resultat vid varje behandling.</p>",
		benefits: [
			"Dubbla våglängder (1540/1570nm + CO₂)",
			"Ärrbehandling och hudföryngring",
			"Minimal downtime",
			"Fraktionerad teknologi",
			"Anpassningsbara behandlingsprofiler",
		],
		certifications: ["CE", "MDR-certifierad"],
		treatments: ["Hudföryngring", "Ärrbehandling", "Akneärr", "Rynkor"],
		categorySlugs: ["hudforyngring", "co2laser", "akne"],
		primaryCategorySlug: "hudforyngring",
		overviewImage: "/storage/images/motus-ax-3-600x500.webp",
		productImages: ["/storage/images/motus-ax-3-600x500.webp"],
	},
	{
		title: "BodyStim Pro",
		slug: "bodystim-pro",
		shortDescription:
			"EMS-baserad kroppsformningsteknologi för muskeltoning, fettreduktion och förbättrad kroppskontur.",
		description:
			"<p><strong>BodyStim Pro</strong> använder avancerad HI-EMT-teknologi (High-Intensity Focused Electromagnetic) för att simultant bygga muskelmassa och reducera fett. En enda 30-minuters behandling motsvarar tusentals muskelsammandragningar.</p><p>BodyStim Pro är perfekt för kliniker som erbjuder icke-invasiv kroppsformning och muskeltoning.</p>",
		productDescription:
			"<p>Med fyra applikatorer kan BodyStim Pro behandla flera områden samtidigt för maximal effektivitet.</p>",
		benefits: [
			"Muskeltoning och fettreduktion",
			"Icke-invasiv behandling",
			"Fyra applikatorer samtidigt",
			"Inga nålar eller downtime",
			"Synliga resultat efter 4 sessioner",
		],
		certifications: ["CE", "MDR-certifierad"],
		treatments: ["Kroppsformning", "Muskeltoning", "Fettreduktion"],
		categorySlugs: ["kropp-muskler-fett"],
		primaryCategorySlug: "kropp-muskler-fett",
		overviewImage: "/storage/images/motus-ax-3-600x500.webp",
		productImages: ["/storage/images/motus-ax-3-600x500.webp"],
	},
	{
		title: "HIFU Ultraskin S",
		slug: "hifu-ultraskin-s",
		shortDescription:
			"High-Intensity Focused Ultrasound för ansiktslyft, huduppstramning och kroppsformning utan kirurgi.",
		description:
			"<p><strong>HIFU Ultraskin S</strong> använder högintensivt fokuserat ultraljud för att stimulera kollagenproduktion och strama upp huden på djupet. Behandlingen är icke-invasiv och ger resultat liknande kirurgisk ansiktslyftning.</p><p>Systemet har flera utbytbara patroner för behandling av olika djup och kroppsområden.</p>",
		productDescription:
			"<p>HIFU Ultraskin S erbjuder precisionsbehandling på tre olika djup (1.5mm, 3.0mm, 4.5mm) för optimal anpassning efter behov.</p>",
		benefits: [
			"Icke-invasiv ansiktslyft",
			"Huduppstramning",
			"Kollagenstimulering",
			"Tre behandlingsdjup",
			"Både ansikte och kropp",
		],
		certifications: ["CE", "MDR-certifierad"],
		treatments: [
			"Huduppstramning",
			"Ansiktslyft",
			"Kroppsformning",
			"Kollagenstimulering",
		],
		categorySlugs: ["kropp-muskler-fett", "hudforyngring", "ansiktsbehandlingar"],
		primaryCategorySlug: "hudforyngring",
		overviewImage: "/storage/images/motus-ax-3-600x500.webp",
		productImages: ["/storage/images/motus-ax-3-600x500.webp"],
	},
	{
		title: "Plasmage",
		slug: "plasmage",
		shortDescription:
			"Plasmabaserad enhet för ögonlocksbehandling, rynkreduktion och precisionsbehandling av huden.",
		description:
			"<p><strong>Plasmage</strong> är en innovativ plasmaenhet som använder joniserad gas för att skapa mikro-exfolierande effekter på huden. Perfekt för ögonlocksbehandling (utan kirurgi), rynkreduktion och behandling av pigmentfläckar.</p><p>Tack vare dess precision kan Plasmage behandla områden där andra tekniker inte når.</p>",
		productDescription:
			"<p>Plasmage är ett utmärkt komplement till andra behandlingar och erbjuder resultat som tidigare krävde kirurgiska ingrepp.</p>",
		benefits: [
			"Icke-kirurgisk ögonlocksbehandling",
			"Precision för små områden",
			"Rynkreduktion",
			"Borttagning av fibrom",
			"Minimal downtime",
		],
		certifications: ["CE", "MDR-certifierad"],
		treatments: [
			"Ögonlocksbehandling",
			"Rynkreduktion",
			"Fibromborttagning",
			"Hudföryngring",
		],
		categorySlugs: ["ansiktsbehandlingar", "hudforyngring"],
		primaryCategorySlug: "ansiktsbehandlingar",
		overviewImage: "/storage/images/motus-ax-3-600x500.webp",
		productImages: ["/storage/images/motus-ax-3-600x500.webp"],
	},
];

async function run() {
	await mongoose.connect(MONGODB_URI!);
	const db = mongoose.connection.db!;

	const cats = await db
		.collection("categories")
		.find({}, { projection: { _id: 1, slug: 1 } })
		.toArray();
	const catSlugToId = new Map(cats.map((c) => [c.slug, c._id]));

	console.log(`Found ${cats.length} categories`);
	console.log("---");

	let created = 0;
	let skipped = 0;

	for (const prod of DUMMY_PRODUCTS) {
		const existing = await db
			.collection("products")
			.findOne({ slug: prod.slug });
		if (existing) {
			console.log(`⏭️  Skipped: ${prod.title} (slug "${prod.slug}" exists)`);
			skipped++;
			continue;
		}

		const categoryIds = prod.categorySlugs
			.map((s) => catSlugToId.get(s))
			.filter(Boolean);
		const primaryCategoryId = catSlugToId.get(prod.primaryCategorySlug);

		if (categoryIds.length === 0) {
			console.log(
				`❌  Skipped: ${prod.title} — no matching categories found`
			);
			continue;
		}

		const now = new Date();
		const doc = {
			title: prod.title,
			slug: prod.slug,
			description: prod.description,
			shortDescription: prod.shortDescription,
			productDescription: prod.productDescription,
			hiddenDescription: "",
			benefits: prod.benefits,
			certifications: prod.certifications,
			treatments: prod.treatments,
			productImages: prod.productImages,
			overviewImage: prod.overviewImage,
			beforeAfterImages: [],
			techSpecifications: [],
			documentation: [],
			purchaseInfo: {
				title: "Begär offert",
				description:
					"<p>Kontakta oss för prisförfrågan och mer information om denna produkt.</p>",
			},
			seo: {
				title: `${prod.title} | Synos Medical`,
				description: prod.shortDescription.slice(0, 160),
				ogImage: "",
				canonicalUrl: "",
				noindex: false,
			},
			categories: categoryIds,
			primaryCategory: primaryCategoryId,
			faqTitle: "Vanliga frågor",
			qa: [
				{
					question: `Vad är ${prod.title}?`,
					answer: prod.shortDescription,
					visible: true,
				},
				{
					question: "Är behandlingen säker?",
					answer:
						"Ja, alla våra maskiner är CE- och MDR-certifierade och anses säkra vid användning av utbildad personal.",
					visible: true,
				},
			],
			seoAccordions: [],
			youtubeUrl: "",
			videoThumbnail: "",
			rubric: "",
			publishType: "publish",
			visibility: "public",
			publishedAt: now,
			createdAt: now,
			updatedAt: now,
		};

		await db.collection("products").insertOne(doc);
		console.log(`✅  Created: ${prod.title} (/${prod.primaryCategorySlug}/${prod.slug})`);
		created++;
	}

	console.log("---");
	console.log(`Done. Created: ${created}, Skipped: ${skipped}`);
	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
