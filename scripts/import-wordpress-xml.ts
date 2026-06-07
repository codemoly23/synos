/**
 * WordPress XML Import Script
 *
 * Imports all published blog posts from a WordPress WXR export file into MongoDB.
 * Handles:
 *   - [caption] shortcode → <figure><figcaption> conversion
 *   - WordPress class/attribute cleanup (wp-image-*, alignnone, data-start, etc.)
 *   - Category and tag creation
 *   - Featured image URL resolution from attachment map
 *   - SEO meta extraction (Yoast / RankMath)
 *   - Full slug extraction from post link (avoids truncated wp:post_name)
 *
 * Usage:
 *   npx tsx scripts/import-wordpress-xml.ts
 */

import "dotenv/config";
import fs from "fs";
import * as cheerio from "cheerio";
import { connectMongoose } from "@/lib/db/db-connect";
import { getBlogCategoryModel } from "@/models/blog-category.model";
import { getBlogPostModel } from "@/models/blog-post.model";
import mongoose from "mongoose";

const XML_FILE_PATH =
  "C:/Users/CodeMoly-Shagor/Downloads/synos.WordPress.2026-06-07.xml";

// ─── Content Cleaning ────────────────────────────────────────────────────────

function convertCaptionShortcodes(content: string): string {
  return content.replace(
    /\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi,
    (_match, inner) => {
      const imgMatch = inner.match(/<img[^>]*>/i);
      const img = imgMatch ? imgMatch[0] : "";
      const captionText = inner.replace(/<img[^>]*>/i, "").trim();
      return `<figure>${img}${captionText ? `<figcaption>${captionText}</figcaption>` : ""}</figure>`;
    }
  );
}

function removeRemainingShortcodes(content: string): string {
  // Remove [gallery], [embed], [video], etc. but keep content inside [/...]
  return content.replace(/\[[a-z_]+[^\]]*\]/gi, "").replace(/\[\/[a-z_]+\]/gi, "");
}

const WP_CLASSES = [
  "alignnone",
  "aligncenter",
  "alignleft",
  "alignright",
  "size-full",
  "size-medium",
  "size-large",
  "size-thumbnail",
  "wp-caption",
  "wp-caption-text",
];

function cleanClassAttribute(classes: string): string {
  let result = classes;
  WP_CLASSES.forEach((cls) => {
    result = result.replace(new RegExp(`\\b${cls}\\b`, "g"), "");
  });
  result = result.replace(/\bwp-image-\d+\b/g, "");
  return result.trim().replace(/\s+/g, " ");
}

function cleanWordPressContent(raw: string): string {
  if (!raw) return "";

  let content = raw;

  // Shortcodes
  content = convertCaptionShortcodes(content);
  content = removeRemainingShortcodes(content);

  // WordPress data attributes
  content = content.replace(/\s+data-start="[^"]*"/g, "");
  content = content.replace(/\s+data-end="[^"]*"/g, "");
  content = content.replace(/\s+data-col-size="[^"]*"/g, "");
  content = content.replace(/\s+data-sentry[^=]*="[^"]*"/g, "");

  // Clean class attributes
  content = content.replace(/class="([^"]*)"/g, (_match, classes) => {
    const cleaned = cleanClassAttribute(classes);
    return cleaned ? `class="${cleaned}"` : "";
  });

  // Remove leftover empty class attrs
  content = content.replace(/\s+class=""\s*/g, " ");

  return content.trim();
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function generateExcerpt(content: string, maxLength = 490): string {
  const text = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractSlugFromLink(link: string): string {
  try {
    const url = new URL(link.trim());
    const parts = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || "");
  } catch {
    return "";
  }
}

function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── XML Parsing Helpers ─────────────────────────────────────────────────────

function getText($: cheerio.CheerioAPI, parent: cheerio.Element, selector: string): string {
  return $(parent).find(selector).first().text().trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

interface WPPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  postDate: string;
  featuredImageUrl: string;
  seo: { title: string; description: string; keywords: string[] };
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("WordPress XML → MongoDB Import");
  console.log("=".repeat(60));

  // Read XML
  console.log(`\nReading: ${XML_FILE_PATH}`);
  const xml = fs.readFileSync(XML_FILE_PATH, "utf-8");
  console.log(`Size: ${(xml.length / 1024).toFixed(1)} KB`);

  // Parse
  const $ = cheerio.load(xml, { xmlMode: true });

  // Build attachment ID → URL map
  const attachmentMap = new Map<string, string>();
  $("item").each((_, el) => {
    if (getText($, el, "wp\\:post_type") === "attachment") {
      const id = getText($, el, "wp\\:post_id");
      const url =
        getText($, el, "wp\\:attachment_url") || getText($, el, "guid");
      if (id && url) attachmentMap.set(id, url);
    }
  });
  console.log(`Attachments mapped: ${attachmentMap.size}`);

  // Collect published posts
  const posts: WPPost[] = [];

  $("item").each((_, el) => {
    if (
      getText($, el, "wp\\:post_type") !== "post" ||
      getText($, el, "wp\\:status") !== "publish"
    )
      return;

    const title = getText($, el, "title");
    const link = getText($, el, "link");
    const wpSlug = getText($, el, "wp\\:post_name");
    const postDate = getText($, el, "wp\\:post_date");
    const rawContent = getText($, el, "content\\:encoded");
    const rawExcerpt = getText($, el, "excerpt\\:encoded");

    const categories: string[] = [];
    const tags: string[] = [];
    $(el)
      .find("category")
      .each((_, cat) => {
        const domain = $(cat).attr("domain");
        const name = $(cat).text().trim();
        if (!name) return;
        if (domain === "category") categories.push(name);
        if (domain === "post_tag") tags.push(name);
      });

    // Featured image
    let thumbnailId = "";
    // SEO meta
    let seoTitle = "";
    let seoDesc = "";
    let seoKw: string[] = [];

    $(el)
      .find("wp\\:postmeta")
      .each((_, meta) => {
        const key = getText($, meta, "wp\\:meta_key");
        const val = getText($, meta, "wp\\:meta_value");
        if (key === "_thumbnail_id") thumbnailId = val;
        if (key === "_yoast_wpseo_title" || key === "_rank_math_title")
          seoTitle = val;
        if (
          key === "_yoast_wpseo_metadesc" ||
          key === "_rank_math_description"
        )
          seoDesc = val;
        if (key === "_yoast_wpseo_focuskw" && val) seoKw = [val];
      });

    // Resolve slug — prefer link-extracted (avoids wp:post_name truncation)
    const slug =
      extractSlugFromLink(link) ||
      decodeURIComponent(wpSlug) ||
      slugFromTitle(title);

    const cleanedContent = cleanWordPressContent(rawContent);
    const cleanedExcerpt = rawExcerpt
      ? cleanWordPressContent(rawExcerpt).substring(0, 490)
      : generateExcerpt(cleanedContent);

    const featuredImageUrl = thumbnailId
      ? attachmentMap.get(thumbnailId) || ""
      : "";

    posts.push({
      title,
      slug,
      content: cleanedContent,
      excerpt: cleanedExcerpt,
      categories,
      tags,
      postDate,
      featuredImageUrl,
      seo: {
        title: seoTitle,
        description: seoDesc,
        keywords: seoKw,
      },
    });
  });

  console.log(`\nPublished posts found in XML: ${posts.length}`);

  // Connect DB
  console.log("\nConnecting to MongoDB...");
  await connectMongoose();
  console.log("Connected.");

  const BlogCategory = await getBlogCategoryModel();
  const BlogPost = await getBlogPostModel();

  // Default author
  const User =
    mongoose.models.User ||
    mongoose.model("User", new mongoose.Schema({}, { strict: false }), "user");
  const author = await User.findOne({});
  if (!author) {
    console.error("\nERROR: No users found. Create a user first.");
    process.exit(1);
  }
  console.log(`Author: ${author._id}`);

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log("\nCreating categories...");
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  const allCategoryNames = [...new Set(posts.flatMap((p) => p.categories))];

  for (const name of allCategoryNames) {
    const slug = categorySlug(name);
    let cat = await BlogCategory.findOne({ slug });
    if (!cat) {
      cat = await BlogCategory.create({
        name,
        slug,
        description: "",
        parent: null,
        isActive: true,
        order: 0,
      });
      console.log(`  + Created: ${name}`);
    } else {
      console.log(`  ~ Exists:  ${name}`);
    }
    categoryMap.set(name, cat._id);
  }

  // ── Posts ───────────────────────────────────────────────────────────────────
  console.log("\nImporting posts...");
  const stats = { created: 0, existing: 0, errors: 0 };

  for (const post of posts) {
    try {
      const existing = await BlogPost.findOne({ slug: post.slug });
      if (existing) {
        console.log(`  ~ EXISTS:    ${post.title}`);
        stats.existing++;
        continue;
      }

      const categoryIds = post.categories
        .map((n) => categoryMap.get(n))
        .filter((id): id is mongoose.Types.ObjectId => id !== undefined);

      await BlogPost.create({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt.substring(0, 490),
        content: post.content,
        featuredImage: post.featuredImageUrl
          ? { url: post.featuredImageUrl, alt: post.title }
          : undefined,
        author: author._id,
        categories: categoryIds,
        tags: post.tags,
        seo: {
          title: post.seo.title || post.title,
          description: post.seo.description || post.excerpt.substring(0, 155),
          keywords: post.seo.keywords,
          ogImage: post.featuredImageUrl || "",
          canonicalUrl: "",
          noindex: false,
        },
        publishType: "publish",
        publishedAt: post.postDate ? new Date(post.postDate) : new Date(),
      });

      console.log(`  + IMPORTED:  ${post.title}`);
      stats.created++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ERROR:     ${post.title} — ${msg}`);
      stats.errors++;
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));
  console.log(`  Imported:       ${stats.created}`);
  console.log(`  Already existed: ${stats.existing}`);
  console.log(`  Errors:         ${stats.errors}`);
  console.log("\nDone.");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
