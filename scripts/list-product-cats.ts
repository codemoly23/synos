/**
 * One-off: show each product with its category slugs
 * Run with: npx tsx scripts/list-product-cats.ts
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
				) value = value.slice(1, -1);
				if (!process.env[key]) process.env[key] = value;
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("MONGODB_URI not defined"); process.exit(1); }

async function run() {
	await mongoose.connect(MONGODB_URI!);
	const db = mongoose.connection.db!;

	const cats = await db.collection("categories").find({}, { projection: { _id: 1, name: 1, slug: 1 } }).toArray();
	const catMap = new Map(cats.map((c) => [c._id.toString(), { name: c.name, slug: c.slug }]));

	const prods = await db.collection("products").find(
		{},
		{ projection: { title: 1, slug: 1, categories: 1, primaryCategory: 1, isPublished: 1 } }
	).sort({ title: 1 }).toArray();

	for (const p of prods) {
		const catIds: string[] = (p.categories || []).map((c: unknown) =>
			typeof c === "string" ? c : (c as { toString(): string }).toString()
		);
		const catSlugs = catIds.map((id) => {
			const cat = catMap.get(id);
			return cat ? `${cat.slug} (${cat.name})` : id;
		});
		const primaryCat = p.primaryCategory ? catMap.get(p.primaryCategory.toString()) : null;
		console.log(`"${p.title}"`);
		console.log(`  slug: ${p.slug}`);
		console.log(`  published: ${p.isPublished}`);
		console.log(`  primaryCategory: ${primaryCat ? `${primaryCat.slug} (${primaryCat.name})` : "none"}`);
		console.log(`  categories: ${catSlugs.join(", ") || "none"}`);
		console.log();
	}

	await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
