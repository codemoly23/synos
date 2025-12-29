/**
 * Seed script for About Page (Om Oss) data
 * Run with: npx tsx scripts/seed-about-page.ts
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

// About page data based on reference website synos.se/om-oss
const aboutPageData = {
	sectionVisibility: {
		hero: true,
		contentSections: true, // Enable content sections
		contactSection: true,
		featureCards: true,
		companyInfo: true,
		richContent: true,
	},

	// Hero Section
	hero: {
		title: "Om Synos Medical",
		subtitle:
			"Sveriges främsta leverantör av klinikutrustning - alltid med kunden i fokus!",
	},

	// Rich Content - HTML from the WordPress text editor
	richContent: `
<h2>Professionell leverantör</h2>
<p>Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien. Alla våra lasermaskiner är testade för bästa funktionalitet inom sitt specifika användningsområde. När du beställer utrustning från oss får du en produkt som är tillverkad i enlighet med den senaste forskningen.</p>

<h2>Med kunden i fokus</h2>
<p>Vi vet hur viktigt det är att kunna erbjuda allra bästa kvalitet och service till sina kunder. Med våra lasermaskiner kan du garantera dina patienter behandlingar med deras trygghet och hälsa i fokus.</p>
<p>En lyckad behandling är alltid i slutändan ett resultat av seriös forskning. Därför genomgår alla våra produkter noggranna undersökningar och tester innan de får ut på marknaden. Med medicinsk laserutrustning från Synos kan du vara säker på att kunna erbjuda det bästa till dina kunder!</p>

<h2>Utbildning och service</h2>
<p>Vi vill att du som beställer en lasermaskin från Synos Medical ska känna dig trygg med att använda din laserutrustning på rätt sätt. Oavsett om du är kirurg, sjuksköterska eller laserterapeut får du den utbildning du behöver för att kunna erbjuda laserbehandling av bästa kvalitet.</p>
<p>Vi lagar din maskin inom 48 arbetstimmar samt erbjuder automatisk service beroende på vilken typ av laserutrustning du använder. Allt för att du ska känna dig trygg med att dina lasermaskiner fungerar i alla lägen.</p>

<h2>Kontakta oss</h2>
<p>Synos Medical ligger alltid i framkant när det gäller teknisk utveckling inom lasermedicin. Vill du veta mer om vår verksamhet? Ring oss eller maila så berättar vi mer om våra <a href="/klinikutrustning">lasermaskiner</a>.</p>

<hr/>

<h3>Fördelar med Synos Medical</h3>
<ul>
<li><strong>Helhetslösning</strong> – Alla kunder har olika behov vilket vi är fullt medvetna om. Därför kan vi erbjuda flera olika lösningar. Köp, leasa eller hyr din utrustning.</li>
<li><strong>Service och kunskap</strong> – Vid ett köp får du alltid 2 års fullservice på plats hos er, 2 års garanti och livstidssupport.</li>
<li><strong>Lång erfarenhet</strong> – Många år i branschen har gett oss djupgående kunskap och förståelse för vad kunder söker.</li>
<li><strong>Utbildning</strong> – Full utbildning för 2 personer ingår alltid för att ni tryggt ska kunna använda utrustningen.</li>
<li><strong>Försäkringar</strong> – Efter genomgången utbildning finns möjlighet att skaffa maskin- och patientansvarsförsäkring.</li>
</ul>
`,

	// Content Sections - Text sections with titles and content
	contentSections: [
		{
			title: "Professionell leverantör",
			content: `Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien. Alla våra lasermaskiner är testade för bästa funktionalitet inom sitt specifika användningsområde. När du beställer utrustning från oss får du en produkt som är tillverkad i enlighet med den senaste forskningen.`,
			highlighted: false,
		},
		{
			title: "Med kunden i fokus",
			content: `Vi vet hur viktigt det är att kunna erbjuda allra bästa kvalitet och service till sina kunder. Med våra lasermaskiner kan du garantera dina patienter behandlingar med deras trygghet och hälsa i fokus.

En lyckad behandling är alltid i slutändan ett resultat av seriös forskning. Därför genomgår alla våra produkter noggranna undersökningar och tester innan de får ut på marknaden. Med medicinsk laserutrustning från Synos kan du vara säker på att kunna erbjuda det bästa till dina kunder!`,
			highlighted: true,
		},
		{
			title: "Utbildning och service",
			content: `Vi vill att du som beställer en lasermaskin från Synos Medical ska känna dig trygg med att använda din laserutrustning på rätt sätt. Oavsett om du är kirurg, sjuksköterska eller laserterapeut får du den utbildning du behöver för att kunna erbjuda laserbehandling av bästa kvalitet.

Vi lagar din maskin inom 48 arbetstimmar samt erbjuder automatisk service beroende på vilken typ av laserutrustning du använder. Allt för att du ska känna dig trygg med att dina lasermaskiner fungerar i alla lägen.`,
			highlighted: false,
		},
	],

	// Contact Section
	contactSection: {
		title: "Kontakta oss",
		description:
			"Synos Medical ligger alltid i framkant när det gäller teknisk utveckling inom lasermedicin. Vill du veta mer om vår verksamhet? Ring oss eller maila så berättar vi mer om våra lasermaskiner.",
		primaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
			variant: "primary",
		},
		secondaryCta: {
			text: "010-205 15 01",
			href: "tel:010-205 15 01",
			variant: "outline",
		},
	},

	// Feature Cards (Sidebar Quick Links from reference)
	featureCards: [
		{
			icon: "Search",
			title: "Känner du dig osäker?",
			description:
				"Vi hjälper dig att hitta rätt utrustning för din verksamhet.",
			ctaText: "Hitta rätt utrustning",
			ctaHref: "/klinikutrustning",
		},
		{
			icon: "Zap",
			title: "Hjälp att starta eget",
			description:
				"Drömmer du om att starta egen klinik? Vi guidar dig genom hela processen.",
			ctaText: "Läs mer",
			ctaHref: "/starta-eget",
		},
		{
			icon: "BookOpen",
			title: "Utbildning i världsklass",
			description:
				"Få certifierad utbildning på din utrustning med våra experter.",
			ctaText: "Se utbildningar",
			ctaHref: "/utbildningar",
		},
	],

	// Company Info
	companyInfo: {
		companyName: "Synos Medical AB",
		organizationNumber: "556871-8075",
		addresses: [
			"Stockholm: Gävlegatan 12A, 113 30 Stockholm",
			"Linköping: Brigadgatan 16, 587 58 Linköping",
		],
	},

	// SEO
	seo: {
		title: "Synos Medical | Sveriges främsta leverantör av klinikutrustning",
		description:
			"Funderar du på att köpa medicinsk laserutrustning? Vi på Synos erbjuder marknadens bästa lasermaskiner - alltid med kunden i fokus!",
		ogImage: "/storage/images/og-about.jpg",
	},
};

async function seedAboutPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("about_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("About page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...aboutPageData, updatedAt: new Date() } }
			);
			console.log("About page document updated successfully!");
		} else {
			console.log("Creating new about page document...");
			await collection.insertOne({
				...aboutPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("About page document created successfully!");
		}

		console.log("\n========================================");
		console.log("ABOUT PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");

		console.log("OPTIONAL: Add the following image for OG sharing:");
		console.log("  - public/storage/images/og-about.jpg");
		console.log("\n========================================\n");
	} catch (error) {
		console.error("Error seeding about page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedAboutPage();
