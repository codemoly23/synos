/**
 * Seed script for FAQ Page data
 * Run with: npx tsx scripts/seed-faq-page.ts
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env file manually (since we're outside Next.js)
function loadEnvFile() {
	const envFiles = [".env.local", ".env"];

	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
			console.log(`Loading environment from ${envFile}...`);
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
				) {
					value = value.slice(1, -1);
				}
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined in environment variables");
	process.exit(1);
}

// FAQ page data based on reference website synos.se/faq (screenshot 2)
const faqPageData = {
	sectionVisibility: {
		hero: true,
		faqContent: true,
		sidebar: true,
		newsletter: true,
		richContent: true,
	},

	// Hero Section
	hero: {
		badge: "FAQ",
		title: "Vanliga frågor och svar om köp av",
		titleHighlight: "klinikutrustning",
		subtitle:
			"Här får du svar på de vanligaste frågorna som ställs inför köp av microneedling, medicinsk laser, co2-laser med mera",
		stats: [
			{ value: "50+", label: "Besvarade frågor" },
			{ value: "24h", label: "Svarstid" },
			{ value: "10+", label: "År erfarenhet" },
		],
	},

	// FAQ Content Section
	faqContent: {
		searchPlaceholder: "Sök bland vanliga frågor...",
		noResultsText: "Inga resultat hittades. Prova att söka på något annat.",
		helpText: "Hittar du inte svaret på din fråga?",
		helpButtonText: "Kontakta oss",
		helpButtonHref: "/kontakt",
		categories: [
			{ id: "general", name: "Allmänt", icon: "HelpCircle", order: 0 },
			{ id: "training", name: "Utbildning", icon: "GraduationCap", order: 1 },
			{ id: "products", name: "Produkter", icon: "Package", order: 2 },
			{ id: "safety", name: "Säkerhet", icon: "Shield", order: 3 },
			{ id: "support", name: "Support", icon: "HeadphonesIcon", order: 4 },
		],
		items: [
			// General Questions
			{
				question: "Vad är Synos Medical?",
				answer:
					"Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien. Våra maskiner är högtestade och sålda, vid testade och säkrade i linje med den senaste medicinska forskningen. Vi jobbar med leverantörer från några av världens främsta lasertillverkare och sjukleverantörer som finns masterbehandlingar för alla sorters laserbehandlingar.",
				category: "general",
				order: 0,
			},
			{
				question: "Erbjuder Synos Medical laserutbildningar? Vad kostar utbildningar?",
				answer:
					"Tyvärr erbjuder vi inga utbildningar separat från maskinköp, en grundlig utbildning ingår alltid i priset vid köp av en maskin. Vi är medvetna om att väl utrustning används av personer med olika bakgrunder, erfarenheter och kunskap. Därför vi alltid skräddarsyr utbildningen efter deltagarnas förutsättningar och behov. Vi går inte bara igenom själva användandet av den specifika maskinen utan även andra viktiga aspekter, exempelvis maskinvals och patientskärhet.",
				category: "training",
				order: 0,
			},
			{
				question: "Jag tänker att starta verksamhet inom laserhårborttagning/tatueringsborttagning, var ska jag börja?",
				answer:
					"På många sätt är det bättre att du börjar med att höra av dig till oss för att boka ett möte. Då kan vi tillsammans gå igenom vilka förutsättningar, behov och förväntningar du har. Vi kan försla maskiner och utrustning som passar just er. Med hjälp av vår utbildning kan du skickskärta att personalen använder maskinen på rätt sätt och att patienterna får en effektiv och säker behandling.",
				category: "general",
				order: 1,
			},
			{
				question: "Vilka märken erbjuder ni?",
				answer:
					"Vi på Synos Medical AB har samlat ihop de absolut bästa maskinerna inom sina respektive områden. Synos Medical är återförsäljare av DEKA Lasers, Asclepion Laser, Jena surgical och IDS LTD.",
				category: "products",
				order: 0,
			},
			{
				question: "Säljer ni maskiner med microneedling?",
				answer:
					"Hos oss kan du köpa Vivace Fractional Micro Needle RF (av Dermascope Magazine utsedd till 'Bästa microneedling RF' år 2022) som levererar fraktionerad radiofrekvens med hjälp av microneedlingsnålar. Maskinen kombinerar det bästa med microneedlingstekniken och den fraktionerade radiofrekvensen på ett sätt som ger helt oslagbara resultat vid hudföryngring och förtsynning. Läs mer om Vivace här!",
				category: "products",
				order: 1,
			},
			{
				question: "Hur vet jag att era produkter är säkra?",
				answer:
					"Utrustning genomgår kliniska studier och är bevisat effektiva för att skicksäkerlla att de verkligen ger de resultat som vi garanterar vara kunder. Vår utrustning används då att hjälpa människor i hela Skandinavien. Det innebär att det ligger ett stort ansvar på oss och de maskiner vi erbjuder. Vi säkerställer alltid att våra produkter är säkra, effektiva och att det finns forskning som stödjer maskinernas funktion och användning. Vi utför även egna tester för att säkerställa att maskinerna levererar ett tillförlitligt resultat. Om vi hittar att en viss teknik eller maskin inte fyller våra högt ställda krav så tar vi helt enkelt inte in dessa produkter till vårt sortiment. För oss är det yttersta att värt att utrustning håller precis vad vi lovar. Detta är ett skäkerhet både för dig som kund och för de patienter som i sluttändan kommer att behandlas med vår utrustning.",
				category: "safety",
				order: 0,
			},
		],
	},

	// Sidebar Section
	sidebar: {
		contactTitle: "Behöver du hjälp?",
		contactDescription:
			"Vårt team finns här för att svara på dina frågor och hjälpa dig hitta rätt lösning.",
		phone: "010-205 15 01",
		email: "info@synos.se",
		officeHours: "Mån-Fre 09:00-17:00",
		contactButtonText: "Kontakta oss",
		contactButtonHref: "/kontakt",
		quickLinksTitle: "Snabblänkar",
		quickLinks: [
			{ label: "Kontaktkort", href: "/kontakt" },
			{ label: "Andreas Tanzi", href: "/team#andreas" },
			{ label: "Jakob Malmsten", href: "/team#jakob" },
			{ label: "Hitta rätt utrustning", href: "/klinikutrustning" },
			{ label: "Köpguide för privatkunder", href: "/privatkunder" },
		],
		officesTitle: "Våra kontor",
		offices: [
			{ name: "Stockholm", address: "Gävlegatan 12A, 113 30 Stockholm" },
			{ name: "Linköping", address: "Brigadgatan 16, 587 58 Linköping" },
		],
	},

	// Newsletter Section
	newsletter: {
		title: "Håll dig uppdaterad",
		subtitle:
			"Prenumerera på vårt nyhetsbrev för de senaste nyheterna om klinikutrustning och branschtrender.",
		inputPlaceholder: "Din e-postadress",
		buttonText: "Prenumerera",
		loadingText: "Skickar...",
		successText: "Tack för din prenumeration!",
		privacyNote:
			"Genom att prenumerera godkänner du vår integritetspolicy. Du kan avsluta prenumerationen när som helst.",
	},

	// Rich Content (from WordPress text editor - the main FAQ content)
	richContent: `
<h2>Vad är Synos Medical?</h2>
<p>Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien. Våra maskiner är högtestade, väl testade och säkrade i linje med den senaste medicinska forskningen. Vi jobbar med leverantörer från några av världens främsta <a href="/klinikutrustning">lasertillverkare</a> och sjukleverantörer som finns masterbehandlingar för alla sorters laserbehandlingar.</p>

<h2>Erbjuder Synos Medical laserutbildningar? Vad kostar utbildningar?</h2>
<p>Tyvärr erbjuder vi inga utbildningar separat från maskinköp, en grundlig utbildning ingår alltid i priset vid köp av en maskin. Vi är medvetna om att väl utrustning används av personer med olika bakgrunder, erfarenheter och kunskap. Därför vi alltid skräddarsyr utbildningen efter deltagarnas förutsättningar och behov. Vi går inte bara <a href="/utbildningar">igenom</a> själva användandet av den specifika maskinen utan även andra viktiga aspekter, exempelvis maskinvals och patientskärhet.</p>

<h2>Jag tänker att starta verksamhet inom laserhårborttagning/tatueringsborttagning, var ska jag börja?</h2>
<p>På många sätt är det bättre att du börjar med att höra av dig till oss för att boka ett möte. Då kan vi tillsammans gå igenom vilka förutsättningar, behov och förväntningar du har. Vi kan försla maskiner och utrustning som passar just er. Med hjälp av vår utbildning kan du skickskärta att personalen använder maskinen på rätt sätt och att patienterna får en effektiv och säker behandling.</p>

<h2>Vilka märken erbjuder ni?</h2>
<p>Vi på Synos Medical AB har samlat ihop de absolut bästa maskinerna inom sina respektive områden. Synos Medical är återförsäljare av DEKA Lasers, Asclepion Laser, Jena surgical och IDS LTD.</p>

<h2>Säljer ni maskiner med microneedling?</h2>
<p>Hos oss kan du köpa <a href="/produkter/vivace">Vivace</a> Fractional Micro Needle RF (av Dermascope Magazine utsedd till "Bästa microneedling RF" år 2022) som levererar fraktionerad radiofrekvens med hjälp av <a href="/behandlingar/microneedling">microneedlingsnålar</a>. Maskinen kombinerar det bästa med <a href="/behandlingar/microneedling">microneedlingstekniken</a> och den fraktionerade radiofrekvensen på ett sätt som ger helt oslagbara resultat vid <a href="/behandlingar/hudföryngring">hudföryngring</a> och förtsynning. <a href="/produkter/vivace">Läs mer om Vivace här!</a></p>

<h2>Hur vet jag att era produkter är säkra?</h2>
<p>Utrustning genomgår kliniska studier och är bevisat effektiva för att säkerställa att de verkligen ger de resultat som vi garanterar vara kunder. Vår utrustning används då att hjälpa människor i hela Skandinavien. Det innebär att det ligger ett stort ansvar på oss och de maskiner vi erbjuder.</p>
<p>Vi säkerställer alltid att våra produkter är säkra, effektiva och att det finns forskning som stödjer maskinernas funktion och användning. Vi utför även egna tester för att säkerställa att maskinerna levererar ett tillförlitligt resultat. Om vi hittar att en viss teknik eller maskin inte fyller våra högt ställda krav så tar vi helt enkelt inte in dessa produkter till vårt sortiment. För oss är det yttersta att värt att utrustning håller precis vad vi lovar. Detta är ett säkerhet både för dig som kund och för de patienter som i sluttändan kommer att behandlas med vår utrustning.</p>
`,

	// SEO
	seo: {
		title: "Vanliga frågor och svar om köp av klinikutrustning",
		description:
			"Här får du svar på de vanligaste frågorna som ställs inför köp av microneedling, medicinsk laser, co2-laser med mera",
		keywords: [
			"FAQ",
			"vanliga frågor",
			"klinikutrustning",
			"laser",
			"microneedling",
			"Synos Medical",
		],
		ogImage: "/storage/images/og-faq.jpg",
	},
};

async function seedFAQPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("faq_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("FAQ page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...faqPageData, updatedAt: new Date() } }
			);
			console.log("FAQ page document updated successfully!");
		} else {
			console.log("Creating new FAQ page document...");
			await collection.insertOne({
				...faqPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("FAQ page document created successfully!");
		}

		console.log("\n========================================");
		console.log("FAQ PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error seeding FAQ page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedFAQPage();
