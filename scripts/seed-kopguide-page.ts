/**
 * Seed script for Köpguide Page data
 * Run with: npx tsx scripts/seed-kopguide-page.ts
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

// Köpguide page data based on current static page
const kopguidePageData = {
	sectionVisibility: {
		hero: true,
		steps: true,
		checklist: true,
		cta: true,
		contactForm: true,
		richContent: false,
	},

	// Hero Section
	hero: {
		badge: "Köpguide",
		title: "Din guide till rätt",
		titleHighlight: "klinikutrustning",
		subtitle:
			"Att investera i klinikutrustning är ett stort beslut. Den här guiden hjälper dig att navigera processen och göra ett välgrundat val.",
	},

	// Steps Section
	stepsSection: {
		title: "4 steg till rätt beslut",
		subtitle:
			"Följ dessa steg för att säkerställa att du väljer rätt utrustning för din verksamhet.",
		steps: [
			{
				number: "01",
				icon: "Target",
				title: "Definiera dina mål",
				description:
					"Börja med att definiera vilka behandlingar du vill erbjuda och vilken målgrupp du vänder dig till. Detta hjälper dig att välja rätt utrustning.",
			},
			{
				number: "02",
				icon: "Lightbulb",
				title: "Utforska alternativ",
				description:
					"Undersök olika maskiner och teknologier. Jämför specifikationer, behandlingsområden och långsiktiga kostnader.",
			},
			{
				number: "03",
				icon: "Scale",
				title: "Jämför leverantörer",
				description:
					"Utvärdera leverantörer baserat på produktkvalitet, utbildning, support och servicenivå. Certifieringar som MDR är avgörande.",
			},
			{
				number: "04",
				icon: "FileText",
				title: "Planera finansiering",
				description:
					"Utforska finansieringsalternativ som leasing eller avbetalning. En bra leverantör hjälper dig med detta.",
			},
		],
	},

	// Checklist Section
	checklistSection: {
		title: "Checklista vid köp",
		subtitle:
			"Använd den här checklistan när du utvärderar leverantörer och produkter.",
		items: [
			"Är produkten MDR-certifierad?",
			"Vilken utbildning ingår vid köp?",
			"Hur ser serviceavtalet ut?",
			"Finns det garanti och försäkringsmöjligheter?",
			"Vilken support erbjuds efter köp?",
			"Finns det referenskunder jag kan kontakta?",
			"Hur lång är leveranstiden?",
			"Vilka finansieringsalternativ finns?",
		],
	},

	// CTA Section
	ctaSection: {
		title: "Vill du veta mer?",
		subtitle:
			"Boka en kostnadsfri konsultation med en av våra experter. Vi hjälper dig att hitta den perfekta lösningen för din klinik.",
		primaryButtonText: "Boka konsultation",
		primaryButtonHref: "/kontakt",
		secondaryButtonText: "Kostnadsfri miniutbildning",
		secondaryButtonHref: "/starta-eget/miniutbildning",
	},

	// Rich Content (empty by default)
	richContent: "",

	// SEO
	seo: {
		title: "Köpguide | Synos Medical",
		description:
			"Din kompletta guide till att köpa rätt klinikutrustning. Lär dig vad du ska tänka på innan du investerar i lasermaskiner och medicinsk utrustning.",
		ogImage: "",
	},
};

async function seedKopguidePage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("kopguide_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Köpguide page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...kopguidePageData, updatedAt: new Date() } }
			);
			console.log("Köpguide page document updated successfully!");
		} else {
			console.log("Creating new Köpguide page document...");
			await collection.insertOne({
				...kopguidePageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Köpguide page document created successfully!");
		}

		console.log("\n========================================");
		console.log("KÖPGUIDE PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error seeding Köpguide page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedKopguidePage();
