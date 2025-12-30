/**
 * Site Configuration - Database-Driven
 *
 * All site configuration is now fetched from the database.
 * This file provides type definitions and helper functions for
 * backwards compatibility with existing code.
 */

import { getLegacySiteConfig } from "@/lib/services/site-settings.service";

// Type for company address (legacy format)
export interface CompanyAddress {
	name: string;
	street: string;
	postalCode: string;
	city: string;
	country: string;
	lat: number;
	lng: number;
}

// Site config type definition (legacy format)
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

/**
 * Get site URL - the only value that still comes from environment
 * This is required for Next.js auth and absolute URLs
 */
export function getSiteUrl(): string {
	const url =
		process.env.SITE_URL ||
		process.env.BETTER_AUTH_URL ||
		"http://localhost:3000";

	// Remove trailing slash if present
	return url.replace(/\/$/, "");
}

/**
 * Get site configuration from database
 * This is the primary way to fetch site config - all values come from DB
 */
export async function getSiteConfig(): Promise<SiteConfigType> {
	const config = await getLegacySiteConfig();

	return {
		name: config.name,
		description: config.description,
		url: getSiteUrl(),
		ogImage: config.ogImage.startsWith("http")
			? config.ogImage
			: `${getSiteUrl()}${config.ogImage.startsWith("/") ? "" : "/"}${config.ogImage}`,
		links: config.links,
		company: {
			name: config.company.name,
			orgNumber: config.company.orgNumber,
			email: config.company.email,
			phone: config.company.phone,
			noreplyEmail: config.company.noreplyEmail,
			addresses: config.company.addresses,
		},
	};
}

/**
 * @deprecated Use getSiteConfig() instead
 * This synchronous export is kept for backwards compatibility during migration
 * but will eventually be removed. All new code should use getSiteConfig().
 */
export const siteConfig: SiteConfigType = {
	// Fallback values - these will be overwritten at runtime
	name: "Synos Medical",
	description:
		"Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.",
	url: getSiteUrl(),
	ogImage: `${getSiteUrl()}/og-image.jpg`,
	links: {
		facebook: "https://www.facebook.com/synosmedical",
		instagram: "https://www.instagram.com/synosmedical",
		linkedin: "https://www.linkedin.com/company/synos-medical",
	},
	company: {
		name: "Synos Medical AB",
		orgNumber: "556871-8075",
		email: "info@synos.se",
		phone: "010-205 15 01",
		noreplyEmail: "noreply@synos.se",
		addresses: [
			{
				name: "Stockholm",
				street: "Turebergsvägen 5",
				postalCode: "19147",
				city: "Stockholm",
				country: "Sverige",
				lat: 59.4196154,
				lng: 17.9620161,
			},
		],
	},
};

// Legacy type exports for backwards compatibility
export type SiteConfig = SiteConfigType;
export type CompanyAddressType = CompanyAddress;
