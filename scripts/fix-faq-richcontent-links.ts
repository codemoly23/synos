/**
 * One-off script to fix 3 dead internal links inside the FAQ page's
 * `richContent` field (flagged by the admin Link Audit tool).
 *
 * Run with: npx tsx scripts/fix-faq-richcontent-links.ts
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

// [deadHref, replacementHref] — replacement targets verified live (200 OK)
const REPLACEMENTS: Array<[string, string]> = [
	['href="/produkter/vivace"', 'href="/klinikutrustning/akne/vivace-rf-microneedling"'],
	['href="/behandlingar/microneedling"', 'href="/klinikutrustning/akne/vivace-rf-microneedling"'],
	['href="/behandlingar/hudföryngring"', 'href="/klinikutrustning/hudforyngring"'],
];

async function run() {
	await mongoose.connect(MONGODB_URI!);
	const db = mongoose.connection.db!;

	const doc = await db.collection("faq_page").findOne({});
	if (!doc || typeof doc.richContent !== "string") {
		console.log("No FAQ page document (or no richContent field) found.");
		await mongoose.disconnect();
		return;
	}

	let updated = doc.richContent as string;
	let replacedCount = 0;
	for (const [dead, replacement] of REPLACEMENTS) {
		const occurrences = updated.split(dead).length - 1;
		if (occurrences > 0) {
			updated = updated.split(dead).join(replacement);
			replacedCount += occurrences;
			console.log(`Replaced ${occurrences}x: ${dead} -> ${replacement}`);
		}
	}

	if (replacedCount === 0) {
		console.log("No matching dead links found — nothing to update.");
		await mongoose.disconnect();
		return;
	}

	await db.collection("faq_page").updateOne({ _id: doc._id }, { $set: { richContent: updated } });
	console.log(`Done. ${replacedCount} link(s) fixed in faq_page.richContent.`);

	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
