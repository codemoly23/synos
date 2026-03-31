/**
 * One-off script to list all category and product slugs from the database
 * Run with: npx tsx scripts/list-slugs.ts
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

	// List all categories
	const categories = await db
		.collection("categories")
		.find({}, { projection: { name: 1, slug: 1, isActive: 1 } })
		.sort({ name: 1 })
		.toArray();

	console.log("\n=== CATEGORIES ===");
	for (const cat of categories) {
		console.log(`  ${cat.isActive ? "✓" : "✗"} "${cat.name}" → slug: "${cat.slug}"`);
	}

	// List all products
	const products = await db
		.collection("products")
		.find({}, { projection: { title: 1, slug: 1, isPublished: 1, primaryCategory: 1 } })
		.sort({ title: 1 })
		.toArray();

	console.log("\n=== PRODUCTS ===");
	for (const prod of products) {
		console.log(`  ${prod.isPublished ? "✓" : "✗"} "${prod.title}" → slug: "${prod.slug}"`);
	}

	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
// already have what we need
