/**
 * Seed script for Miniutbildning Page data
 * Run with: npx tsx scripts/seed-miniutbildning-page.ts
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

// Miniutbildning page data based on current static page
const miniutbildningPageData = {
	sectionVisibility: {
		hero: true,
		benefits: true,
		learnings: true,
		process: true,
		contactForm: true,
		richContent: false,
	},

	// Hero Section
	hero: {
		badge: "Kostnadsfri utbildning",
		title: "Kostnadsfri",
		titleHighlight: "miniutbildning",
		subtitle:
			"Få kunskapen att välja rätt laser. Vår kostnadsfria miniutbildning ger dig verktygen att jämföra olika modeller på marknaden och fatta ett välgrundat beslut.",
		buttonText: "Boka miniutbildning",
		buttonHref: "#kontakt",
	},

	// Benefits Section
	benefits: [
		{
			icon: "Clock",
			title: "Flexibelt format",
			description:
				"Utbildningen anpassas efter dina behov och kan genomföras digitalt eller på plats.",
		},
		{
			icon: "GraduationCap",
			title: "Expertledda sessioner",
			description:
				"Våra certifierade utbildare har mångårig erfarenhet inom laserteknik och estetisk medicin.",
		},
		{
			icon: "Users",
			title: "Personlig rådgivning",
			description:
				"Få individuell rådgivning baserat på dina specifika behov och verksamhetsmål.",
		},
	],

	// Learnings Section
	learningsSection: {
		title: "Vad du kommer lära dig",
		subtitle:
			"Miniutbildningen täcker de viktigaste grunderna för att göra ett informerat val.",
		items: [
			"Grundläggande laserfysik och hur olika våglängder påverkar behandlingar",
			"Skillnader mellan olika lasertyper (diod, Alexandrit, Nd:YAG)",
			"Vad du ska titta på när du jämför maskiner",
			"Säkerhetskrav och certifieringar (MDR, CE)",
			"Hur du beräknar ROI på din investering",
			"Vanliga misstag att undvika vid köp",
		],
	},

	// Process Section
	processSection: {
		badge: "Snabb start",
		title: "Så här går det till",
		subtitle:
			"Miniutbildningen är helt kostnadsfri och utan förpliktelser. Du bestämmer själv om du vill fortsätta samarbetet efter utbildningen.",
		steps: [
			{
				number: "1",
				title: "Boka tid",
				description:
					"Fyll i formuläret så kontaktar vi dig för att boka en tid som passar.",
			},
			{
				number: "2",
				title: "Delta i utbildningen",
				description:
					"Välj mellan digitalt möte eller besök på vårt showroom.",
			},
			{
				number: "3",
				title: "Få personlig rådgivning",
				description:
					"Diskutera dina behov och få rekommendationer anpassade för dig.",
			},
		],
		highlightTitle: "100% kostnadsfritt",
		highlightSubtitle:
			"Ingen förpliktelse att köpa. Lär dig grunderna och fatta sedan ditt eget beslut.",
		highlightButtonText: "Boka din plats",
		highlightButtonHref: "#kontakt",
	},

	// Rich Content (empty by default)
	richContent: "",

	// SEO
	seo: {
		title: "Miniutbildning | Synos Medical",
		description:
			"Kostnadsfri miniutbildning om laserteknik och klinikutrustning. Lär dig grunderna för att fatta rätt beslut om din investering.",
		ogImage: "",
	},
};

async function seedMiniutbildningPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("miniutbildning_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Miniutbildning page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...miniutbildningPageData, updatedAt: new Date() } }
			);
			console.log("Miniutbildning page document updated successfully!");
		} else {
			console.log("Creating new Miniutbildning page document...");
			await collection.insertOne({
				...miniutbildningPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Miniutbildning page document created successfully!");
		}

		console.log("\n========================================");
		console.log("MINIUTBILDNING PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error seeding Miniutbildning page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedMiniutbildningPage();
