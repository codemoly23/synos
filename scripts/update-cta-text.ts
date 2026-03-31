/**
 * One-off script to update productShowcase ctaText in the database
 * Run with: npx tsx scripts/update-cta-text.ts
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
				) {
					value = value.slice(1, -1);
				}
				if (!process.env[key]) process.env[key] = value;
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined");
	process.exit(1);
}

async function run() {
	await mongoose.connect(MONGODB_URI!);
	const db = mongoose.connection.db!;

	const result = await db.collection("home_page").updateOne(
		{},
		{ $set: { "productShowcase.ctaText": "Alla Utrustning" } }
	);

	if (result.matchedCount === 0) {
		console.log("No home page document found.");
	} else {
		console.log("Updated productShowcase.ctaText to 'Alla Utrustning'");
	}

	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
