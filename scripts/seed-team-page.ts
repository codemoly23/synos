/**
 * Seed script for Team Page (Vårt Team) data
 * Run with: npx tsx scripts/seed-team-page.ts
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

// Team page data based on Synos Medical
const teamPageData = {
	sectionVisibility: {
		hero: true,
		stats: true,
		teamMembers: true,
		values: true,
		joinUs: true,
		contact: true,
		richContent: false,
	},

	// Hero Section
	hero: {
		badge: "Vårt Team",
		title: "Möt experterna bakom Synos Medical",
		subtitle:
			"Vi är ett dedikerat team av professionella med mångårig erfarenhet inom estetisk medicinteknologi och kundsupport.",
	},

	// Stats Section
	stats: [
		{
			value: "15+",
			label: "År i branschen",
		},
		{
			value: "500+",
			label: "Nöjda kunder",
		},
		{
			value: "10+",
			label: "Experter i teamet",
		},
		{
			value: "48h",
			label: "Service-garanti",
		},
	],

	// Team Members - Using professional headshot photos
	teamMembers: [
		{
			name: "Johan Andersson",
			role: "CEO & Founder",
			department: "Management",
			bio: "Johan har över 15 års erfarenhet inom medicinteknologi och har byggt upp Synos Medical till att bli en ledande leverantör av klinikutrustning i Skandinavien.",
			image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face",
			email: "johan@synosmedical.se",
			linkedin: "https://linkedin.com/in/",
			phone: "010-205 15 01",
		},
		{
			name: "Maria Svensson",
			role: "Sales Manager",
			department: "Sales",
			bio: "Maria leder vårt säljteam och ansvarar för att våra kunder alltid får den bästa rådgivningen och supporten.",
			image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
			email: "maria@synosmedical.se",
			linkedin: "https://linkedin.com/in/",
		},
		{
			name: "Erik Lindqvist",
			role: "Technical Director",
			department: "Service",
			bio: "Erik och hans team säkerställer att alla maskiner fungerar optimalt. Han har över 10 års erfarenhet av laserteknik.",
			image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
			email: "erik@synosmedical.se",
			linkedin: "https://linkedin.com/in/",
		},
		{
			name: "Anna Bergström",
			role: "Training Manager",
			department: "Education",
			bio: "Anna ansvarar för alla våra utbildningsprogram och ser till att våra kunder får den kunskap de behöver för att använda utrustningen på bästa sätt.",
			image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
			email: "anna@synosmedical.se",
			linkedin: "https://linkedin.com/in/",
			phone: "010-205 15 02",
		},
		{
			name: "Peter Holm",
			role: "Customer Support Lead",
			department: "Support",
			bio: "Peter är första kontakten för våra kunder och ser till att alla frågor besvaras snabbt och professionellt.",
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
			email: "support@synosmedical.se",
			phone: "010-205 15 01",
		},
		{
			name: "Lisa Karlsson",
			role: "Product Manager",
			department: "Product",
			bio: "Lisa ansvarar för produktutveckling och säkerställer att vi alltid erbjuder de bästa lösningarna på marknaden.",
			image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
			email: "lisa@synosmedical.se",
			linkedin: "https://linkedin.com/in/",
		},
	],

	// Values Section
	valuesSection: {
		title: "Våra värderingar",
		subtitle:
			"Det som driver oss varje dag är att hjälpa våra kunder lyckas med sina verksamheter.",
		values: [
			{
				title: "Kundfokus",
				description:
					"Vi sätter alltid kunden först och strävar efter att överträffa förväntningarna i varje interaktion.",
			},
			{
				title: "Kvalitet",
				description:
					"Vi erbjuder endast produkter och tjänster av högsta kvalitet, noggrant utvalda och testade.",
			},
			{
				title: "Innovation",
				description:
					"Vi ligger alltid i framkant med den senaste tekniken och utvecklingen inom lasermedicin.",
			},
			{
				title: "Tillgänglighet",
				description:
					"Vi finns alltid tillgängliga för våra kunder med snabb service och support.",
			},
		],
	},

	// Join Us Section
	joinUs: {
		title: "Vill du bli en del av vårt team?",
		description:
			"Vi söker alltid efter talangfulla personer som delar vår passion för medicinteknologi och kundservice. Se våra lediga tjänster och ta nästa steg i din karriär.",
		primaryCta: {
			text: "Se lediga tjänster",
			href: "/om-oss/lediga-tjanster",
		},
		secondaryCta: {
			text: "Skicka spontanansökan",
			href: "/kontakt",
		},
	},

	// Contact Section
	contact: {
		title: "Kontakta oss",
		description:
			"Har du frågor eller vill veta mer om vårt team? Vi finns här för dig.",
		phone: "010-205 15 01",
		email: "info@synosmedical.se",
	},

	// Rich Content (HTML)
	richContent: "",

	// SEO
	seo: {
		title: "Vårt Team | Synos Medical",
		description:
			"Möt teamet bakom Synos Medical - experter inom estetisk medicinteknologi med mångårig erfarenhet och passion för kundsupport.",
		ogImage: "/storage/images/og-team.jpg",
	},
};

async function seedTeamPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("team_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Team page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...teamPageData, updatedAt: new Date() } }
			);
			console.log("Team page document updated successfully!");
		} else {
			console.log("Creating new team page document...");
			await collection.insertOne({
				...teamPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Team page document created successfully!");
		}

		console.log("\n========================================");
		console.log("TEAM PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
		console.log("Preview at: /om-oss/team");
	} catch (error) {
		console.error("Error seeding team page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedTeamPage();
