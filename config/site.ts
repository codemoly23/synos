/**
 * Site Configuration - Server-Side Only
 *
 * This file reads environment variables on the server and exports the config.
 * Use this in server components, API routes, and layouts.
 * For client components, pass config as props from the layout.
 */

// Type for company address
export interface CompanyAddress {
	name: string;
	street: string;
	postalCode: string;
	city: string;
	country: string;
	lat: number;
	lng: number;
}

// Site config type definition
export interface SiteConfigType {
	name: string;
	description: string;
	url: string;
	ogImage: string;
	links: {
		facebook: string;
		instagram: string;
		linkedin: string;
	};
	company: {
		name: string;
		orgNumber: string;
		email: string;
		phone: string;
		noreplyEmail: string;
		addresses: CompanyAddress[];
	};
}

// Default addresses (fallback if env not set)
const defaultAddresses: CompanyAddress[] = [
	{
		name: "Stockholm",
		street: "Turebergsvägen 5",
		postalCode: "19147",
		city: "Stockholm",
		country: "Sverige",
		lat: 59.4196154,
		lng: 17.9620161,
	},
	{
		name: "Linköping",
		street: "Datalinjen 5",
		postalCode: "58330",
		city: "Linköping",
		country: "Sverige",
		lat: 58.4196154,
		lng: 15.6620161,
	},
];

// Parse addresses from environment variable
function parseAddresses(): CompanyAddress[] {
	const addressesEnv = process.env.COMPANY_ADDRESSES;
	if (!addressesEnv) return defaultAddresses;

	try {
		// Remove surrounding quotes if present
		const cleaned = addressesEnv.replace(/^['"]|['"]$/g, "");
		return JSON.parse(cleaned) as CompanyAddress[];
	} catch {
		console.warn("Failed to parse COMPANY_ADDRESSES, using defaults");
		return defaultAddresses;
	}
}

// Get site URL with fallback
function getSiteUrl(): string {
	const url =
		process.env.SITE_URL ||
		process.env.BETTER_AUTH_URL ||
		"http://localhost:3000";

	// Remove trailing slash if present
	return url.replace(/\/$/, "");
}

// Get OG image URL (ensure it's absolute)
function getOgImage(): string {
	const ogImage = process.env.OG_IMAGE || "/og-image.jpg";
	const siteUrl = getSiteUrl();

	// If it's already an absolute URL, return as-is
	if (ogImage.startsWith("http")) {
		return ogImage;
	}

	// Otherwise, prepend site URL
	return `${siteUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
}

/**
 * Server-side site configuration
 * Use this in server components and API routes
 */
export const siteConfig: SiteConfigType = {
	// Site info
	name: process.env.SITE_NAME || "Synos Medical",
	description:
		process.env.SITE_DESCRIPTION ||
		"Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.",
	url: getSiteUrl(),
	ogImage: getOgImage(),

	// Social links
	links: {
		facebook:
			process.env.SOCIAL_FACEBOOK || "https://www.facebook.com/synosmedical",
		instagram:
			process.env.SOCIAL_INSTAGRAM ||
			"https://www.instagram.com/synosmedical",
		linkedin:
			process.env.SOCIAL_LINKEDIN ||
			"https://www.linkedin.com/company/synos-medical",
	},

	// Company info
	company: {
		name: process.env.COMPANY_NAME || "Synos Medical AB",
		orgNumber: process.env.COMPANY_ORG_NUMBER || "556871-8075",
		email: process.env.COMPANY_EMAIL || "info@synos.se",
		phone: process.env.COMPANY_PHONE || "010-205 15 01",
		noreplyEmail: process.env.NOREPLY_EMAIL || "noreply@synos.se",
		addresses: parseAddresses(),
	},
};

// Legacy export for backwards compatibility
export type SiteConfig = SiteConfigType;
export type CompanyAddressType = CompanyAddress;
