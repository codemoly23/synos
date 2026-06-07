/**
 * Find and delete blog posts that are NOT in the WordPress XML export.
 * Usage: npx tsx scripts/find-extra-posts.ts
 */

import "dotenv/config";
import fs from "fs";
import * as cheerio from "cheerio";
import { connectMongoose } from "@/lib/db/db-connect";
import { getBlogPostModel } from "@/models/blog-post.model";
import mongoose from "mongoose";

const XML_FILE_PATH =
  "C:/Users/CodeMoly-Shagor/Downloads/synos.WordPress.2026-06-07.xml";

function extractSlugFromLink(link: string): string {
  try {
    const url = new URL(link.trim());
    const parts = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || "");
  } catch {
    return "";
  }
}

function getText($: cheerio.CheerioAPI, parent: cheerio.Element, selector: string): string {
  return $(parent).find(selector).first().text().trim();
}

async function main() {
  console.log("=".repeat(60));
  console.log("Find Extra Posts (not in WordPress XML)");
  console.log("=".repeat(60));

  // Parse XML — collect all published slugs
  const xml = fs.readFileSync(XML_FILE_PATH, "utf-8");
  const $ = cheerio.load(xml, { xmlMode: true });

  const xmlSlugs = new Set<string>();
  const xmlTitles = new Map<string, string>();

  $("item").each((_, el) => {
    if (
      getText($, el, "wp\\:post_type") !== "post" ||
      getText($, el, "wp\\:status") !== "publish"
    ) return;

    const link = getText($, el, "link");
    const slug = extractSlugFromLink(link) || decodeURIComponent(getText($, el, "wp\\:post_name"));
    const title = getText($, el, "title");
    if (slug) {
      xmlSlugs.add(slug);
      xmlTitles.set(slug, title);
    }
  });

  console.log(`\nXML published posts: ${xmlSlugs.size}`);

  // Connect DB
  await connectMongoose();
  const BlogPost = await getBlogPostModel();

  const allDbPosts = await BlogPost.find({}, { title: 1, slug: 1, publishType: 1 }).lean();
  console.log(`DB total posts: ${allDbPosts.length}`);

  // Find posts in DB NOT in XML
  const extraPosts = allDbPosts.filter((p) => !xmlSlugs.has(p.slug));

  console.log(`\nExtra posts (in DB but NOT in XML): ${extraPosts.length}`);
  console.log("-".repeat(60));
  extraPosts.forEach((p, i) => {
    console.log(`${i + 1}. "${p.title}"`);
    console.log(`   slug: ${p.slug}`);
    console.log(`   status: ${p.publishType}`);
    console.log(`   _id: ${p._id}`);
  });

  if (extraPosts.length === 0) {
    console.log("Nothing to delete.");
    await mongoose.disconnect();
    return;
  }

  // Delete them
  console.log("\nDeleting extra posts...");
  const ids = extraPosts.map((p) => p._id);
  const result = await BlogPost.deleteMany({ _id: { $in: ids } });
  console.log(`Deleted: ${result.deletedCount} posts`);

  // Verify
  const remaining = await BlogPost.countDocuments();
  console.log(`\nDB now has: ${remaining} posts`);

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
