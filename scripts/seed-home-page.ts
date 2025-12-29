/**
 * Seed script for Home Page data
 * Run with: npx tsx scripts/seed-home-page.ts
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
				// Skip empty lines and comments
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				// Remove surrounding quotes if present
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				// Only set if not already defined (CLI env vars take precedence)
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

// Load env file before anything else
loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined in environment variables");
	process.exit(1);
}

// Home page data based on reference website synos.se
const homePageData = {
	sectionVisibility: {
		hero: true,
		features: true,
		productShowcase: true,
		imageGallery: true,
		processSteps: true,
		about: true,
		testimonials: true,
		cta: true,
	},

	// Hero Section
	hero: {
		badge: "Sveriges ledande leverantör",
		title: "Sveriges ledande leverantör av MDR-certifierad",
		titleHighlight: "klinikutrustning",
		subtitle:
			"Ledande leverantör av MDR-certifierad klinikutrustning. Lasrar för hårborttagning, tatueringsborttagning, hudföryngring. 20+ års erfarenhet inom branschen.",
		primaryCta: {
			text: "Se våra produkter",
			href: "/klinikutrustning",
			variant: "primary",
		},
		secondaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
			variant: "outline",
		},
		// NOTE: User needs to add these images to public/storage/images/
		backgroundImage: "/storage/images/hero-background.jpg",
		mainImage: "/storage/images/hero-main.png",
		trustIndicators: [
			{
				icon: "Shield",
				text: "MDR-certifierad",
			},
			{
				icon: "Award",
				text: "20+ års erfarenhet",
			},
			{
				icon: "Users",
				text: "1000+ nöjda kunder",
			},
		],
		floatingCard: {
			image: "/storage/images/floating-product.png",
			label: "Nyhet",
		},
		certificationCard: {
			title: "MDR-certifierad",
			subtitle: "EU Medical Device Regulation",
			progressLabel: "Kundnöjdhet",
			progressValue: "98%",
			progressPercentage: 98,
		},
	},

	// Features Section (8 USP items from reference site)
	features: [
		{
			icon: "Package",
			title: "Helhetslösning",
			description:
				"Hos oss får du en komplett lösning för din klinik. Allt från toppmodern utrustning och högkvalitativa produkter till digitala verktyg och kontinuerlig support.",
		},
		{
			icon: "GraduationCap",
			title: "Utbildning på maskin samt certifikat",
			description:
				"Nästan viktigare än själva maskinköpet är utbildningen. Legitim certifiering ingår alltid vid köp.",
		},
		{
			icon: "BookOpen",
			title: "Kostnadsfri miniutbildning",
			description:
				"Vi erbjuder er en kostnadsfri miniutbildning där du får grundkunskaperna inom önskat område.",
		},
		{
			icon: "Shield",
			title: "Försäkring",
			description:
				"Hos oss så har du möjligheten att teckna patientansvarsförsäkring samt maskinförsäkring vilken inte annars är möjligt.",
		},
		{
			icon: "Star",
			title: "Världsledande maskiner",
			description:
				"Vi fokuserar på maskiner som ger det lilla extra. Alla våra maskiner är UNIKA!",
		},
		{
			icon: "Building",
			title: "Professionell leverantör",
			description:
				"Världsledande utrustning, kundfokus och alltid det senaste hittar du hos oss!",
		},
		{
			icon: "Wrench",
			title: "Service och kunskap",
			description:
				"Med över 20 års kunskap kan ni vara säkra på att er utrustning alltid är i goda händer.",
		},
		{
			icon: "FileText",
			title: "Köpguide för privata kunder",
			description:
				"Ladda ner vår köpguide för att påbörja din resa, boka sedan en kostnadsfri miniutbildning för att utöka din kunskap.",
		},
	],

	// Product Showcase Section
	productShowcase: {
		title: "Utvalda produkter",
		subtitle:
			"Upptäck vårt sortiment av världsledande klinikutrustning för estetiska behandlingar",
		ctaText: "Se alla produkter",
		ctaHref: "/klinikutrustning",
		products: [
			{
				name: "Jovena",
				category: "Hudföryngring & Muskeltoning",
				description:
					"JOVENA - komplett dual-energy system för hudföryngring och muskeltoning. Med fyra innovativa handtag erbjuder systemet skräddarsydda behandlingar för ansikte och kropp.",
				status: "Nyhet",
				// NOTE: User needs to add this image
				image: "/storage/images/products/jovena.png",
				href: "/klinikutrustning/arr-hudbristningar/jovena",
			},
			{
				name: "Motus AX med MOVEO 3000 Watt",
				category: "Hårborttagning",
				description:
					"Revolutionerande Alexandrit Laser från DEKA. DEKA presenterar världens första smärtfria alexandrit laser för hårborttagning. Med över 40 års expertis inom laserteknologi har DEKA utvecklat en kristallbaserad laser som erbjuder 100% smärtfri behandling.",
				status: "Populär",
				image: "/storage/images/products/motus-ax.png",
				href: "/klinikutrustning/harborttagning/motus-ax-med-moveo-3000-watt",
			},
			{
				name: "Motus AY",
				category: "Alexandrit/Nd:YAG",
				description:
					"Det världsledande laserplattform företaget DEKA har lyckats skapa en universaliserande MultiPulse och mångsidig maskin som omedelbart kommer att uppskattas av dina patienter. Motus AY Alexandrite laser har väsentliga egenskaper för hårborttagning och Nd:YAG laser för behandling av vaskulära lesioner.",
				status: "",
				image: "/storage/images/products/motus-ay.png",
				href: "/klinikutrustning/harborttagning/motus-ay",
			},
			{
				name: "Q-terra Q10",
				category: "Tatueringsborttagning",
				description:
					"Q-terra Q10 är idag den mest optimerade tatueringsborttagningsplattformen som någonsin har byggts. Den levererar utarbetade till 2 våglängder och en extra kapslad Q-switch laser med unika egenskaper via det gäller tatueringsborttagning, 4-6 våglängder 1064nm, 650, 585nm samt 532nm gör det möjligt att behandla den bredaste bilden över färger behandling.",
				status: "PRISTINOX",
				image: "/storage/images/products/q-terra-q10.png",
				href: "/klinikutrustning/tatueringsborttagning/q-terra-q10",
			},
		],
	},

	// Image Gallery Section
	imageGallery: {
		badge: "Varför välja Synos",
		title: "Vi hjälper dig hela vägen",
		subtitle:
			"Från första kontakt till framgångsrik klinik - vi finns med dig genom hela resan",
		images: [
			{
				// NOTE: User needs to add this image
				src: "/storage/images/gallery/utbildning.jpg",
				title: "Utbildningar - världsklass",
				subtitle:
					"Våra utbildningar är uppbyggda från grunden och innehåller allt som en verksamhet behöver.",
			},
			{
				src: "/storage/images/gallery/starta-eget.jpg",
				title: "Hjälp att starta eget",
				subtitle:
					"Drömmer du om att starta eget men saknar den praktiska kunskapen som krävs? Vi guidar dig steg för steg.",
			},
			{
				src: "/storage/images/gallery/miniutbildning.jpg",
				title: "Miniutbildning",
				subtitle:
					"Vi erbjuder alla kunder en kostnadsfri miniutbildning där man får en bred kunskap gällande laser.",
			},
			{
				src: "/storage/images/gallery/uppdaterad.jpg",
				title: "Hålla sig uppdaterad",
				subtitle:
					"Vi hjälper dig att hålla dig uppdaterad i allt, i en bransch eller kontakta oss direkt för en kostnadsfri miniutbildning.",
			},
		],
		ctaTitle: "Laserutrustning av högsta kvalitet - Synos",
		ctaSubtitle:
			"Synos Medical vill göra ägandet av laserutrustning så enkel som möjligt och finns alltid där för dig!",
		ctaButtonText: "Kontakta oss",
	},

	// Process Steps Section
	processStepsSection: {
		badge: "Så fungerar det",
		title: "Din resa mot en framgångsrik klinik",
		subtitle: "Vi guidar dig genom varje steg på vägen",
		steps: [
			{
				stepNumber: "01",
				title: "Kontakta oss",
				description:
					"Ta första steget och kontakta oss för en kostnadsfri konsultation om dina behov och mål.",
				icon: "Phone",
			},
			{
				stepNumber: "02",
				title: "Rådgivning & demo",
				description:
					"Vi hjälper dig välja rätt utrustning och erbjuder kostnadsfri demo utan förpliktelser.",
				icon: "Users",
			},
			{
				stepNumber: "03",
				title: "Utbildning",
				description:
					"Få certifierad utbildning på din nya utrustning med full support från våra experter.",
				icon: "GraduationCap",
			},
			{
				stepNumber: "04",
				title: "Kom igång",
				description:
					"Starta din verksamhet med trygghet - vi finns alltid tillgängliga för support och service.",
				icon: "Rocket",
			},
		],
	},

	// About Section
	aboutSection: {
		badge: "Om Synos Medical",
		title: "Medicinsk laserutrustning för sjukhus och",
		titleHighlight: "skönhetskliniker",
		content: `Synos Medical är Sveriges mest professionella leverantör av laserutrustning till sjukhus och skönhetskliniker. Vi säljer världsledande lasermaskiner som gör att du alltid kan garantera patienterna att deras behandling kommer att utföras på ett tryggt sätt med fokus på hälsan.

Innan någon typ av laserutrustning får släppas på marknaden måste de genomgå en mängd tester och undersökningar, vilket är ett resultat av seriös forskning.

Vi säljer endast medicinsk laser från välkända tillverkare i flera storlekar, modeller som klarar av att utföra en stor variation av behandlingar.

Vill du vara säker på att enbart kunna erbjuda det bästa till dina patienter? I så fall har du kommit rätt. Synos är en seriös aktör på marknaden som säljer lasermaskiner som kan användas till ingrepp som hårborttagning, behandling av värtor och fettreducering för att nämna några exempel.`,
		// NOTE: User needs to add this image
		image: "/storage/images/about-section.jpg",
		benefits: [
			"Helhetslösning – Alla kunder har olika behov vilket vi är fullt medvetna om. Därför kan vi erbjuda flera olika lösningar. Köp, leasa eller hyr din utrustning.",
			"Service och kunskap – Vid ett köp får du alltid 2 års fullservice på plats hos er, 2 års garanti och livstidssupport.",
			"Lång erfarenhet – Många år i branschen har gett oss djupgående kunskap och förståelse för vad kunder söker.",
			"Utbildning – Full utbildning för 2 personer ingår alltid för att ni tryggt ska kunna använda utrustningen.",
			"Försäkringar – Efter genomgången utbildning finns möjlighet att skaffa maskin- och patientansvarsförsäkring.",
		],
		primaryCta: {
			text: "Läs mer om oss",
			href: "/om-oss",
			variant: "primary",
		},
		secondaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
			variant: "outline",
		},
		certificationBadge: {
			title: "MDR-certifierad",
			description: "Alla våra produkter uppfyller EU:s medicinska krav",
		},
	},

	// Testimonials Section (generated - no actual testimonials in screenshots)
	testimonialsSection: {
		title: "Vad våra kunder säger",
		subtitle:
			"Läs vad andra klinikägare tycker om att samarbeta med Synos Medical",
		testimonials: [
			{
				quote:
					"Synos Medical har varit en fantastisk partner för vår klinik. Deras support och utbildning har varit ovärderlig för vår framgång.",
				author: "Maria Lindström",
				role: "Klinikägare",
				company: "Estetik Stockholm",
			},
			{
				quote:
					"Kvaliteten på utrustningen och den professionella servicen har överträffat alla våra förväntningar. Rekommenderar starkt!",
				author: "Johan Andersson",
				role: "Grundare",
				company: "Nordic Beauty Center",
			},
			{
				quote:
					"Tack vare Synos kunde vi starta vår klinik med full trygghet. Utbildningen och supporten har varit förstklassig.",
				author: "Emma Karlsson",
				role: "VD",
				company: "Laser & Hudvård Göteborg",
			},
		],
	},

	// CTA Section
	ctaSection: {
		title: "Redo att ta nästa steg?",
		subtitle:
			"Kontakta oss idag för en kostnadsfri konsultation och upptäck hur vi kan hjälpa dig att nå dina mål.",
		phoneTitle: "Ring oss",
		phoneSubtitle: "010-205 15 01",
		emailTitle: "Maila oss",
		emailSubtitle: "info@synos.se",
		formTitle: "Boka en demo",
		formSubtitle: "Fyll i formuläret så kontaktar vi dig inom 24 timmar",
		formCtaText: "Skicka förfrågan",
	},

	// SEO
	seo: {
		title: "Sveriges ledande leverantör av MDR-certifierad klinikutrustning",
		description:
			"Ledande leverantör av MDR-certifierad klinikutrustning. Lasrar för hårborttagning, tatueringsborttagning, hudföryngring. 20+ års erfarenhet",
		ogImage: "/storage/images/og-image.jpg",
	},
};

async function seedHomePage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("home_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Home page document already exists. Updating...");
			await collection.updateOne({}, { $set: homePageData });
			console.log("Home page document updated successfully!");
		} else {
			console.log("Creating new home page document...");
			await collection.insertOne({
				...homePageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Home page document created successfully!");
		}

		console.log("\n========================================");
		console.log("HOME PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");

		console.log("IMPORTANT: You need to add the following images to your project:");
		console.log("\nHero Section:");
		console.log("  - public/storage/images/hero-background.jpg");
		console.log("  - public/storage/images/hero-main.png");
		console.log("  - public/storage/images/floating-product.png");
		console.log("\nProduct Images:");
		console.log("  - public/storage/images/products/jovena.png");
		console.log("  - public/storage/images/products/motus-ax.png");
		console.log("  - public/storage/images/products/motus-ay.png");
		console.log("  - public/storage/images/products/q-terra-q10.png");
		console.log("\nGallery Images:");
		console.log("  - public/storage/images/gallery/utbildning.jpg");
		console.log("  - public/storage/images/gallery/starta-eget.jpg");
		console.log("  - public/storage/images/gallery/miniutbildning.jpg");
		console.log("  - public/storage/images/gallery/uppdaterad.jpg");
		console.log("\nAbout Section:");
		console.log("  - public/storage/images/about-section.jpg");
		console.log("\nSEO:");
		console.log("  - public/storage/images/og-image.jpg");
		console.log("\n========================================\n");
	} catch (error) {
		console.error("Error seeding home page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedHomePage();
