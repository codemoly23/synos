import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CallbackPopup } from "@/components/callback/CallbackPopup";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { CookieConsentProvider } from "@/lib/context/cookie-consent-context";
import { siteConfig } from "@/config/site";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";

/**
 * Client Layout - Public pages with Navbar and Footer
 * This wraps all public-facing pages
 */
export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<CookieConsentProvider>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen">
					<Navbar config={siteConfig} />
					<main className="flex-1 w-full">{children}</main>
					<Footer config={siteConfig} />
					<MobileBottomNav />
					<CallbackPopup />
					<CookieConsent />
				</div>
			</NavbarVariantProvider>
		</CookieConsentProvider>
	);
}
