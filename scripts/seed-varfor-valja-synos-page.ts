/**
 * Seed script for Varför Välja Synos Page data
 * Run with: npx tsx scripts/seed-varfor-valja-synos-page.ts
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

// Varför Välja Synos page data based on current static page
const varforValjaSynosPageData = {
	sectionVisibility: {
		hero: true,
		reasons: true,
		benefits: true,
		cta: true,
		contactForm: true,
		richContent: false,
	},

	// Hero Section
	hero: {
		badge: "Din partner för framgång",
		title: "Varför välja",
		titleHighlight: "Synos Medical?",
		subtitle:
			"Vi är mer än en leverantör – vi är din partner på resan mot en framgångsrik klinik. Med över 15 års erfarenhet och hundratals nöjda kunder vet vi vad som krävs för att lyckas.",
	},

	// Reasons Section
	reasons: [
		{
			icon: "Shield",
			title: "MDR-certifierad utrustning",
			description:
				"Alla våra produkter är certifierade enligt EU:s medicintekniska förordning (MDR), vilket garanterar högsta säkerhet och kvalitet.",
		},
		{
			icon: "Award",
			title: "Världsledande varumärken",
			description:
				"Vi är stolta representanter för DEKA, en av världens ledande tillverkare av medicinska lasrar med över 50 års erfarenhet.",
		},
		{
			icon: "Users",
			title: "Personlig utbildning",
			description:
				"Varje kund får skräddarsydd utbildning av våra certifierade experter. Vi säkerställer att du känner dig trygg och säker.",
		},
		{
			icon: "HeartHandshake",
			title: "Livstids support",
			description:
				"Vi är med dig hela vägen. Vår support är alltid tillgänglig för att hjälpa dig med frågor och felsökning.",
		},
	],

	// Benefits Section
	benefitsSection: {
		title: "Fördelar med att välja Synos",
		subtitle:
			"Som kund hos Synos Medical får du tillgång till ett komplett ekosystem av tjänster och support.",
		items: [
			"Service inom 48 arbetstimmar",
			"Kostnadsfri konsultation",
			"Finansieringslösningar",
			"Försäkringsalternativ",
			"Marknadsföringsstöd",
			"Nätverksmöjligheter",
		],
	},

	// CTA Section
	ctaSection: {
		title: "Redo att ta nästa steg?",
		subtitle:
			"Kontakta oss idag för en kostnadsfri konsultation. Vi hjälper dig att hitta rätt lösning för din verksamhet.",
		primaryButtonText: "Kontakta oss",
		primaryButtonHref: "/kontakt",
		secondaryButtonText: "Se vår utrustning",
		secondaryButtonHref: "/utrustning",
	},

	// Rich Content (empty by default)
	richContent: "",

	// SEO
	seo: {
		title: "Varför välja Synos? | Synos Medical",
		description:
			"Upptäck varför Synos Medical är rätt val för din klinik. MDR-certifierad utrustning, världsledande utbildning och livstids support.",
		ogImage: "",
	},
};

async function seedVarforValjaSynosPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("varfor_valja_synos_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Varför Välja Synos page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...varforValjaSynosPageData, updatedAt: new Date() } }
			);
			console.log("Varför Välja Synos page document updated successfully!");
		} else {
			console.log("Creating new Varför Välja Synos page document...");
			await collection.insertOne({
				...varforValjaSynosPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Varför Välja Synos page document created successfully!");
		}

		console.log("\n========================================");
		console.log("VARFÖR VÄLJA SYNOS PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error seeding Varför Välja Synos page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedVarforValjaSynosPage();
