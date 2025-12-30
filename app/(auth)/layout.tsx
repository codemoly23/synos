import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteConfig } from "@/config/site";
import {
	getBrandingSettings,
	getFooterSettings,
} from "@/lib/services/site-settings.service";

/**
 * Auth Layout - Login/Register pages with Navbar and Footer
 */
export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [siteConfig, brandingSettings, footerSettings] = await Promise.all([
		getSiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
	]);

	const logoUrl = brandingSettings?.logoUrl || undefined;

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar config={siteConfig} logoUrl={logoUrl} />
			<main className="flex-1 w-full">{children}</main>
			<Footer
				config={siteConfig}
				logoUrl={logoUrl}
				footerSettings={footerSettings}
			/>
		</div>
	);
}
