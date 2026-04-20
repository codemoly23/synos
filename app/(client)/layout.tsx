import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BrightcallScript } from "@/components/callback/BrightcallScript";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { CookieConsentProvider } from "@/lib/context/cookie-consent-context";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
import {
	getLegacySiteConfig,
	getBrandingSettings,
	getFooterSettings,
	getSiteSettings,
} from "@/lib/services/site-settings.service";

/**
 * Client Layout - Public pages with Navbar and Footer
 * This wraps all public-facing pages
 * Now fetches dynamic settings from database
 */
export default async function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Fetch site settings from database in parallel
	const [siteConfig, brandingSettings, footerSettings, siteSettings] =
		await Promise.all([
			getLegacySiteConfig(),
			getBrandingSettings(),
			getFooterSettings(),
			getSiteSettings(),
		]);

	const logoUrl = brandingSettings?.logoUrl;
	const brightcallActive = Boolean(
		siteSettings.brightcall?.enabled && siteSettings.brightcall?.widgetKey
	);

	return (
		<CookieConsentProvider>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen overflow-x-clip">
					<Navbar config={siteConfig} logoUrl={logoUrl} />
					<main className="flex-1 w-full">{children}</main>
					<Footer
						config={siteConfig}
						footerSettings={footerSettings}
						logoUrl={logoUrl}
					/>
					<MobileBottomNav />
					{brightcallActive && (
						<BrightcallScript
							widgetKey={siteSettings.brightcall!.widgetKey!}
							apiBaseUrl={siteSettings.brightcall?.apiBaseUrl}
						/>
					)}
					<CookieConsent />
				</div>
			</NavbarVariantProvider>
		</CookieConsentProvider>
	);
}
