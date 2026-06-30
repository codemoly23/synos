/**
 * Backfill Technology Group Slugs
 *
 * Some technology_groups documents were created without a `slug` (the field is
 * optional in the schema and only auto-generated on `.save()`, which never ran
 * for docs created via other paths). The new technology landing route
 * `/klinikutrustning/teknologi/[slug]` resolves groups by slug, so every active
 * group needs a unique slug.
 *
 * This script finds every group missing a usable slug, generates one from its
 * name (identical logic to lib/utils/product-helpers.ts:generateSlug), ensures
 * uniqueness against existing slugs, and writes it back. Safe to re-run: docs
 * that already have a slug are left untouched.
 *
 * Usage: npx tsx scripts/backfill-technology-group-slugs.ts
 */

import * as fs from "fs";
import * as path from "path";
import { MongoClient } from "mongodb";

// --- Load .env (script runs outside Next.js) -------------------------------
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
				if (!process.env[key]) process.env[key] = value;
			}
			break;
		}
	}
}
loadEnvFile();

// --- Slug helpers (copied verbatim from lib/utils/product-helpers.ts) -------
function normalizeSpecialChars(text: string): string {
	const charMap: Record<string, string> = {
		"₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
		"₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
		"⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
		"⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
		"™": "", "®": "", "©": "",
		"–": "-", "—": "-",
		"‘": "", "’": "", "“": "", "”": "",
	};
	return text.replace(
		/[₀-₉⁰¹²³⁴-⁹™®©–—‘’“”]/g,
		(char) => charMap[char] ?? ""
	);
}

function generateSlug(text: string): string {
	if (!text || typeof text !== "string") return "";
	return normalizeSpecialChars(text)
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-+/g, "-")
		.slice(0, 120);
}

// --- Main ------------------------------------------------------------------
async function main() {
	const mongoUri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB || "synos-db";
	if (!mongoUri) {
		console.error("Error: MONGODB_URI is required (.env).");
		process.exit(1);
	}

	console.log("\nConnecting to MongoDB...");
	const client = new MongoClient(mongoUri);

	try {
		await client.connect();
		const db = client.db(dbName);
		const coll = db.collection("technology_groups");

		const groups = await coll
			.find({}, { projection: { name: 1, slug: 1 } })
			.toArray();

		// Existing usable slugs (string + non-empty) — to guarantee uniqueness.
		const usedSlugs = new Set<string>();
		for (const g of groups) {
			if (typeof g.slug === "string" && g.slug.trim()) {
				usedSlugs.add(g.slug.trim().toLowerCase());
			}
		}

		const missing = groups.filter(
			(g) => !(typeof g.slug === "string" && g.slug.trim())
		);

		console.log(`Total groups: ${groups.length}`);
		console.log(`Already have slug: ${groups.length - missing.length}`);
		console.log(`Missing slug: ${missing.length}\n`);

		if (missing.length === 0) {
			console.log("Nothing to backfill. All groups already have slugs.");
			return;
		}

		let updated = 0;
		for (const g of missing) {
			const base = generateSlug(String(g.name || ""));
			if (!base) {
				console.warn(`  SKIP (empty slug from name): "${g.name}" [${g._id}]`);
				continue;
			}
			// Ensure uniqueness: append -2, -3, ... if needed.
			let slug = base;
			let n = 2;
			while (usedSlugs.has(slug)) {
				slug = `${base}-${n}`;
				n += 1;
			}
			usedSlugs.add(slug);

			await coll.updateOne({ _id: g._id }, { $set: { slug } });
			updated += 1;
			console.log(`  ✅ "${g.name}"  ->  ${slug}`);
		}

		console.log(`\nBackfilled ${updated} slug(s).`);

		// Final verification
		const after = await coll
			.find({}, { projection: { name: 1, slug: 1 } })
			.sort({ name: 1 })
			.toArray();
		const stillMissing = after.filter(
			(g) => !(typeof g.slug === "string" && g.slug.trim())
		);
		console.log("\n=== Final state ===");
		for (const g of after) {
			console.log(`  "${g.name}"  ->  ${g.slug ?? "(none)"}`);
		}
		console.log(
			stillMissing.length === 0
				? "\n✅ All groups now have a slug."
				: `\n❌ ${stillMissing.length} still missing.`
		);
	} catch (error) {
		console.error("\nError during backfill:", error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
