import { unstable_cache } from "next/cache";
import {
	siteSettingsRepository,
	type SiteSettingsData,
} from "@/lib/repositories/site-settings.repository";
import type {
	IOffice,
	ISocialMedia,
	ISeoSettings,
	IBrandingSettings,
	IFooterSettings,
} from "@/models/site-settings.model";

/**
 * Cache tag for site settings
 * Use this to revalidate when settings change
 */
export const SITE_SETTINGS_CACHE_TAG = "site-settings";

/**
 * Get site settings with caching
 * Cached for 1 hour, revalidated on-demand when settings are updated
 */
export const getSiteSettings = unstable_cache(
	async (): Promise<SiteSettingsData> => {
		return siteSettingsRepository.get().catch(() => ({} as SiteSettingsData));
	},
	["site-settings"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600, // 1 hour
	}
);

/**
 * Get contact information only
 */
export const getContactInfo = unstable_cache(
	async (): Promise<{
		phone: string;
		email: string;
		offices: IOffice[];
	}> => {
		return siteSettingsRepository.getContact().catch(() => ({ phone: "", email: "", offices: [] }));
	},
	["site-settings-contact"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get company information only
 */
export const getCompanyInfo = unstable_cache(
	async (): Promise<{
		companyName: string;
		orgNumber: string;
		vatNumber?: string;
	}> => {
		return siteSettingsRepository.getCompanyInfo().catch(() => ({ companyName: "Synos Medical AB", orgNumber: "" }));
	},
	["site-settings-company"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get social media links only
 */
export const getSocialMedia = unstable_cache(
	async (): Promise<ISocialMedia> => {
		return siteSettingsRepository.getSocialMedia().catch(() => ({} as ISocialMedia));
	},
	["site-settings-social"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get SEO settings only
 */
export const getSeoSettings = unstable_cache(
	async (): Promise<ISeoSettings> => {
		return siteSettingsRepository.getSeo().catch(() => ({} as ISeoSettings));
	},
	["site-settings-seo"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get headquarters office
 */
export const getHeadquarters = unstable_cache(
	async (): Promise<IOffice | undefined> => {
		return siteSettingsRepository.getHeadquarters().catch(() => undefined);
	},
	["site-settings-headquarters"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get branding settings only
 */
export const getBrandingSettings = unstable_cache(
	async (): Promise<IBrandingSettings> => {
		return siteSettingsRepository.getBranding().catch(() => ({ logoUrl: "" } as IBrandingSettings));
	},
	["site-settings-branding"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get footer settings only
 */
export const getFooterSettings = unstable_cache(
	async (): Promise<IFooterSettings> => {
		return siteSettingsRepository.getFooter().catch(() => ({} as IFooterSettings));
	},
	["site-settings-footer"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Helper type for legacy compatibility with siteConfig
 * Maps the new ISiteSettings to the old SiteConfigType format
 */
export interface LegacySiteConfig {
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
		addresses: Array<{
			name: string;
			street: string;
			postalCode: string;
			city: string;
			country: string;
			lat: number;
			lng: number;
		}>;
	};
}

/**
 * Get site settings in legacy siteConfig format
 * For backwards compatibility during migration
 */
const DEFAULT_LEGACY_SITE_CONFIG: LegacySiteConfig = {
	name: "Synos Medical",
	description: "Sveriges ledande leverantör av MDR-certifierad klinikutrustning.",
	url: process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
	ogImage: "/og-image.jpg",
	links: { facebook: "", instagram: "", linkedin: "" },
	company: {
		name: "Synos Medical AB",
		orgNumber: "",
		email: "",
		phone: "",
		noreplyEmail: "noreply@synos.se",
		addresses: [],
	},
};

export const getLegacySiteConfig = unstable_cache(
	async (): Promise<LegacySiteConfig> => {
		const settings = await siteSettingsRepository.get().catch(() => null);

		if (!settings) return DEFAULT_LEGACY_SITE_CONFIG;

		return {
			name: settings.seo?.siteName || "Synos Medical",
			description:
				settings.seo?.siteDescription ||
				"Sveriges ledande leverantör av MDR-certifierad klinikutrustning.",
			url: process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
			ogImage: settings.seo?.ogImage || "/og-image.jpg",
			links: {
				facebook: settings.socialMedia?.facebook || "",
				instagram: settings.socialMedia?.instagram || "",
				linkedin: settings.socialMedia?.linkedin || "",
			},
			company: {
				name: settings.companyName,
				orgNumber: settings.orgNumber,
				email: settings.email,
				phone: settings.phone,
				noreplyEmail: settings.noreplyEmail || "noreply@synos.se",
				addresses: (settings.offices || []).map((office) => ({
					name: office.name,
					street: office.street,
					postalCode: office.postalCode,
					city: office.city,
					country: office.country,
					lat: 0,
					lng: 0,
				})),
			},
		};
	},
	["site-settings-legacy"],
	{
		tags: [SITE_SETTINGS_CACHE_TAG],
		revalidate: 3600,
	}
);
