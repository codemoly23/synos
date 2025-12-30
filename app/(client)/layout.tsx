import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CallbackPopup } from "@/components/callback/CallbackPopup";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { CookieConsentProvider } from "@/lib/context/cookie-consent-context";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
import {
	getLegacySiteConfig,
	getBrandingSettings,
	getFooterSettings,
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
	const [siteConfig, brandingSettings, footerSettings] = await Promise.all([
		getLegacySiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
	]);

	const logoUrl = brandingSettings?.logoUrl;

	return (
		<CookieConsentProvider>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen">
					<Navbar config={siteConfig} logoUrl={logoUrl} />
					<main className="flex-1 w-full">{children}</main>
					<Footer
						config={siteConfig}
						footerSettings={footerSettings}
						logoUrl={logoUrl}
					/>
					<MobileBottomNav />
					<CallbackPopup />
					<CookieConsent />
				</div>
			</NavbarVariantProvider>
		</CookieConsentProvider>
	);
}
