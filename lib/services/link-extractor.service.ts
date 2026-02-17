import * as cheerio from "cheerio";
import { connectMongoose } from "@/lib/db/db-connect";
import { getSiteUrl } from "@/config/site";

// Model sync getters
import { getHomePageModelSync } from "@/models/home-page.model";
import { getAboutPageModelSync } from "@/models/about-page.model";
import { getTeamPageModelSync } from "@/models/team-page.model";
import { getLegalPageModelSync } from "@/models/legal-page.model";
import { getPrivacyPageModelSync } from "@/models/privacy-page.model";
import { getCareersPageModelSync } from "@/models/careers-page.model";
import { getStartaEgetPageModelSync } from "@/models/starta-eget-page.model";
import { getVarforValjaSynosPageModelSync } from "@/models/varfor-valja-synos-page.model";
import { getKopguidePageModelSync } from "@/models/kopguide-page.model";
import { getMiniutbildningPageModelSync } from "@/models/miniutbildning-page.model";
import { getTrainingPageModelSync } from "@/models/training-page.model";
import { getFAQPageModelSync } from "@/models/faq-page.model";
import { getKontaktPageModelSync } from "@/models/kontakt-page.model";
import { getBlogPostModelSync } from "@/models/blog-post.model";
import { getProductModelSync } from "@/models/product.model";
import { getSiteSettingsModelSync } from "@/models/site-settings.model";

/**
 * Extracted link from content
 */
export interface ExtractedLink {
	url: string;
	sourceModel: string;
	sourceField: string;
	sourceId?: string;
	sourceTitle?: string;
	isExternal: boolean;
	isMixedContent: boolean;
	rel?: string;
}

const siteUrl = getSiteUrl();
const siteHost = new URL(siteUrl).hostname;

/**
 * Check if a URL is external
 */
function isExternalUrl(url: string): boolean {
	try {
		if (url.startsWith("/") || url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:")) {
			return false;
		}
		const parsed = new URL(url);
		return parsed.hostname !== siteHost && parsed.hostname !== "localhost";
	} catch {
		return false;
	}
}

/**
 * Check if URL is mixed content (HTTP on HTTPS site)
 */
function isMixedContent(url: string): boolean {
	if (!siteUrl.startsWith("https://")) return false;
	return url.startsWith("http://");
}

/**
 * Check if a URL is valid and should be checked
 */
function isCheckableUrl(url: string): boolean {
	if (!url || url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("javascript:") || url.startsWith("data:")) {
		return false;
	}
	return true;
}

/**
 * Normalize a URL to absolute
 */
function normalizeUrl(url: string): string {
	if (url.startsWith("//")) return `https:${url}`;
	if (url.startsWith("/")) return `${siteUrl}${url}`;
	return url;
}

/**
 * Extract links from HTML content using cheerio
 */
function extractLinksFromHtml(
	html: string,
	sourceModel: string,
	sourceField: string,
	sourceId?: string,
	sourceTitle?: string
): ExtractedLink[] {
	if (!html) return [];
	const links: ExtractedLink[] = [];
	const $ = cheerio.load(html);

	// Extract <a href="..."> links
	$("a[href]").each((_, el) => {
		const href = $(el).attr("href") || "";
		const rel = $(el).attr("rel") || "";
		if (isCheckableUrl(href)) {
			const normalized = normalizeUrl(href);
			links.push({
				url: normalized,
				sourceModel,
				sourceField,
				sourceId,
				sourceTitle,
				isExternal: isExternalUrl(href),
				isMixedContent: isMixedContent(normalized),
				rel,
			});
		}
	});

	// Extract <img src="..."> image URLs
	$("img[src]").each((_, el) => {
		const src = $(el).attr("src") || "";
		if (isCheckableUrl(src)) {
			const normalized = normalizeUrl(src);
			links.push({
				url: normalized,
				sourceModel,
				sourceField: `${sourceField} (image)`,
				sourceId,
				sourceTitle,
				isExternal: isExternalUrl(src),
				isMixedContent: isMixedContent(normalized),
			});
		}
	});

	// Extract <iframe src="...">
	$("iframe[src]").each((_, el) => {
		const src = $(el).attr("src") || "";
		if (isCheckableUrl(src)) {
			const normalized = normalizeUrl(src);
			links.push({
				url: normalized,
				sourceModel,
				sourceField: `${sourceField} (iframe)`,
				sourceId,
				sourceTitle,
				isExternal: isExternalUrl(src),
				isMixedContent: isMixedContent(normalized),
			});
		}
	});

	return links;
}

/**
 * Add a plain URL field to the links list
 */
function addUrlField(
	links: ExtractedLink[],
	url: string | undefined,
	sourceModel: string,
	sourceField: string,
	sourceId?: string,
	sourceTitle?: string
): void {
	if (!url || !isCheckableUrl(url)) return;
	const normalized = normalizeUrl(url);
	links.push({
		url: normalized,
		sourceModel,
		sourceField,
		sourceId,
		sourceTitle,
		isExternal: isExternalUrl(url),
		isMixedContent: isMixedContent(normalized),
	});
}

/**
 * Extract ALL links from ALL site content
 */
export async function extractAllLinks(): Promise<ExtractedLink[]> {
	await connectMongoose();
	const links: ExtractedLink[] = [];

	// ================================================================
	// BLOG POSTS
	// ================================================================
	const BlogPost = getBlogPostModelSync();
	const blogPosts = await BlogPost.find({}).lean();
	for (const post of blogPosts) {
		const p = post as unknown as Record<string, unknown>;
		const id = String(p._id);
		const title = (p.title as string) || "Untitled Post";

		// Rich HTML content
		if (p.content) {
			links.push(...extractLinksFromHtml(p.content as string, "Blog Post", "content", id, title));
		}
		// Image URLs
		const featuredImage = p.featuredImage as Record<string, unknown> | undefined;
		addUrlField(links, featuredImage?.url as string, "Blog Post", "featuredImage", id, title);
		const headerImage = p.headerImage as Record<string, unknown> | undefined;
		addUrlField(links, headerImage?.url as string, "Blog Post", "headerImage", id, title);
		// SEO
		const seo = p.seo as Record<string, unknown> | undefined;
		addUrlField(links, seo?.ogImage as string, "Blog Post", "seo.ogImage", id, title);
		addUrlField(links, seo?.canonicalUrl as string, "Blog Post", "seo.canonicalUrl", id, title);
	}

	// ================================================================
	// PRODUCTS
	// ================================================================
	const Product = getProductModelSync();
	const products = await Product.find({}).lean();
	for (const prod of products) {
		const p = prod as unknown as Record<string, unknown>;
		const id = String(p._id);
		const title = (p.title as string) || "Untitled Product";

		// Rich HTML fields
		if (p.description) links.push(...extractLinksFromHtml(p.description as string, "Product", "description", id, title));
		if (p.productDescription) links.push(...extractLinksFromHtml(p.productDescription as string, "Product", "productDescription", id, title));
		if (p.hiddenDescription) links.push(...extractLinksFromHtml(p.hiddenDescription as string, "Product", "hiddenDescription", id, title));

		// Purchase info
		const purchaseInfo = p.purchaseInfo as Record<string, unknown> | undefined;
		if (purchaseInfo?.description) links.push(...extractLinksFromHtml(purchaseInfo.description as string, "Product", "purchaseInfo.description", id, title));

		// SEO accordions
		const seoAccordions = p.seoAccordions as Array<Record<string, unknown>> | undefined;
		if (seoAccordions) {
			for (const acc of seoAccordions) {
				if (acc.content) links.push(...extractLinksFromHtml(acc.content as string, "Product", "seoAccordions.content", id, title));
			}
		}

		// Image URLs
		const images = p.productImages as string[] | undefined;
		if (images) {
			for (const img of images) addUrlField(links, img, "Product", "productImages", id, title);
		}
		addUrlField(links, p.overviewImage as string, "Product", "overviewImage", id, title);
		addUrlField(links, p.youtubeUrl as string, "Product", "youtubeUrl", id, title);

		// Documentation
		const docs = p.documentation as Array<Record<string, unknown>> | undefined;
		if (docs) {
			for (const doc of docs) addUrlField(links, doc.url as string, "Product", "documentation.url", id, title);
		}

		// SEO
		const seo = p.seo as Record<string, unknown> | undefined;
		addUrlField(links, seo?.ogImage as string, "Product", "seo.ogImage", id, title);
		addUrlField(links, seo?.canonicalUrl as string, "Product", "seo.canonicalUrl", id, title);
	}

	// ================================================================
	// CMS PAGES (singleton pages)
	// ================================================================
	await extractCmsPageLinks(links);

	// ================================================================
	// SITE SETTINGS
	// ================================================================
	const SiteSettings = getSiteSettingsModelSync();
	const settings = await SiteSettings.findOne().lean();
	if (settings) {
		const s = settings as unknown as Record<string, unknown>;
		// Social media
		const social = s.socialMedia as Record<string, unknown> | undefined;
		if (social) {
			addUrlField(links, social.facebook as string, "Site Settings", "socialMedia.facebook");
			addUrlField(links, social.instagram as string, "Site Settings", "socialMedia.instagram");
			addUrlField(links, social.linkedin as string, "Site Settings", "socialMedia.linkedin");
			addUrlField(links, social.twitter as string, "Site Settings", "socialMedia.twitter");
			addUrlField(links, social.youtube as string, "Site Settings", "socialMedia.youtube");
		}
		// Branding
		const branding = s.branding as Record<string, unknown> | undefined;
		addUrlField(links, branding?.logoUrl as string, "Site Settings", "branding.logoUrl");
		addUrlField(links, branding?.faviconUrl as string, "Site Settings", "branding.faviconUrl");
		// Footer links
		const footer = s.footer as Record<string, unknown> | undefined;
		if (footer) {
			const quickLinks = footer.quickLinks as Array<Record<string, unknown>> | undefined;
			if (quickLinks) {
				for (const link of quickLinks) addUrlField(links, link.href as string, "Site Settings", "footer.quickLinks.href");
			}
			const bottomLinks = footer.bottomLinks as Array<Record<string, unknown>> | undefined;
			if (bottomLinks) {
				for (const link of bottomLinks) addUrlField(links, link.href as string, "Site Settings", "footer.bottomLinks.href");
			}
		}
		// Offices
		const offices = s.offices as Array<Record<string, unknown>> | undefined;
		if (offices) {
			for (const office of offices) addUrlField(links, office.mapEmbedUrl as string, "Site Settings", "offices.mapEmbedUrl");
		}
		// SEO
		const seo = s.seo as Record<string, unknown> | undefined;
		addUrlField(links, seo?.ogImage as string, "Site Settings", "seo.ogImage");
	}

	return links;
}

/**
 * Extract links from all CMS singleton pages
 */
async function extractCmsPageLinks(links: ExtractedLink[]): Promise<void> {
	// Helper for pages with richContent + CTA href patterns
	const pageConfigs = [
		{ getter: getHomePageModelSync, name: "Home Page", hasRichContent: true },
		{ getter: getAboutPageModelSync, name: "About Page", hasRichContent: false },
		{ getter: getTeamPageModelSync, name: "Team Page", hasRichContent: true },
		{ getter: getLegalPageModelSync, name: "Legal Page", hasRichContent: false },
		{ getter: getPrivacyPageModelSync, name: "Privacy Page", hasRichContent: false },
		{ getter: getCareersPageModelSync, name: "Careers Page", hasRichContent: false },
		{ getter: getStartaEgetPageModelSync, name: "Starta Eget Page", hasRichContent: true },
		{ getter: getVarforValjaSynosPageModelSync, name: "Varför Välja Synos Page", hasRichContent: true },
		{ getter: getKopguidePageModelSync, name: "Köpguide Page", hasRichContent: true },
		{ getter: getMiniutbildningPageModelSync, name: "Miniutbildning Page", hasRichContent: true },
		{ getter: getTrainingPageModelSync, name: "Training Page", hasRichContent: true },
		{ getter: getFAQPageModelSync, name: "FAQ Page", hasRichContent: true },
		{ getter: getKontaktPageModelSync, name: "Contact Page", hasRichContent: true },
	];

	for (const config of pageConfigs) {
		try {
			const Model = config.getter();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const page = await (Model as any).findOne().lean();
			if (!page) continue;

			const p = page as Record<string, unknown>;

			// Rich content
			if (config.hasRichContent && p.richContent) {
				links.push(...extractLinksFromHtml(p.richContent as string, config.name, "richContent"));
			}

			// SEO ogImage
			const seo = p.seo as Record<string, unknown> | undefined;
			addUrlField(links, seo?.ogImage as string, config.name, "seo.ogImage");

			// Recursively extract all href/url/src fields from the page object
			extractUrlFieldsRecursive(p, config.name, "", links);
		} catch {
			// Skip if model fails to load
		}
	}
}

/**
 * Recursively walk through an object and extract any field that looks like a URL
 */
function extractUrlFieldsRecursive(
	obj: Record<string, unknown>,
	sourceModel: string,
	prefix: string,
	links: ExtractedLink[],
	depth = 0
): void {
	if (depth > 5) return; // Prevent infinite recursion

	for (const [key, value] of Object.entries(obj)) {
		// Skip internal fields
		if (key.startsWith("_") || key === "id" || key === "__v" || key === "createdAt" || key === "updatedAt" || key === "seo" || key === "richContent" || key === "sectionVisibility") {
			continue;
		}

		const fieldPath = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "string") {
			// Check if this string looks like a URL
			const urlKeys = ["href", "url", "link", "src", "image", "mobileImage", "mobileUrl", "mobileSrc", "backgroundImage", "videoUrl", "youtubeUrl", "mapEmbedUrl", "logoUrl", "faviconUrl", "ogImage", "canonicalUrl", "applyLink", "buttonLink", "linkedin"];
			if (urlKeys.includes(key) && isCheckableUrl(value) && (value.startsWith("/") || value.startsWith("http"))) {
				addUrlField(links, value, sourceModel, fieldPath);
			}
			// Check if it might be HTML content
			const htmlKeys = ["content", "description", "answer"];
			if (htmlKeys.includes(key) && value.includes("<")) {
				links.push(...extractLinksFromHtml(value, sourceModel, fieldPath));
			}
		} else if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				const item = value[i];
				if (typeof item === "string") {
					// Array of URLs (e.g., productImages)
					if (key.toLowerCase().includes("image") && isCheckableUrl(item) && (item.startsWith("/") || item.startsWith("http"))) {
						addUrlField(links, item, sourceModel, `${fieldPath}[${i}]`);
					}
				} else if (item && typeof item === "object") {
					extractUrlFieldsRecursive(item as Record<string, unknown>, sourceModel, `${fieldPath}[${i}]`, links, depth + 1);
				}
			}
		} else if (value && typeof value === "object") {
			extractUrlFieldsRecursive(value as Record<string, unknown>, sourceModel, fieldPath, links, depth + 1);
		}
	}
}
