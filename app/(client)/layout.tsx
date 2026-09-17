import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { BrightcallScript } from "@/components/callback/BrightcallScript";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
import {
	getLegacySiteConfig,
	getBrandingSettings,
	getFooterSettings,
	getSiteSettings,
	type LegacySiteConfig,
} from "@/lib/services/site-settings.service";

const DEFAULT_SITE_CONFIG: LegacySiteConfig = {
	name: "Synos Medical",
	description: "Sveriges ledande leverantör av MDR-certifierad klinikutrustning.",
	url: process.env.SITE_URL || "http://localhost:3000",
	ogImage: "/og-image.jpg",
	links: { facebook: "", instagram: "", linkedin: "" },
	company: {
		name: "Synos Medical",
		orgNumber: "",
		email: "",
		phone: "",
		noreplyEmail: "noreply@synos.se",
		addresses: [],
	},
};

export default async function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [siteConfigResult, brandingResult, footerResult, siteSettingsResult] =
		await Promise.allSettled([
			getLegacySiteConfig(),
			getBrandingSettings(),
			getFooterSettings(),
			getSiteSettings(),
		]);

	const siteConfig =
		siteConfigResult.status === "fulfilled"
			? siteConfigResult.value
			: DEFAULT_SITE_CONFIG;
	const brandingSettings =
		brandingResult.status === "fulfilled" ? brandingResult.value : null;
	const footerSettings =
		footerResult.status === "fulfilled" ? footerResult.value : null;
	const siteSettings =
		siteSettingsResult.status === "fulfilled" ? siteSettingsResult.value : null;

	const logoUrl = brandingSettings?.logoUrl;
	const brightcallActive = Boolean(
		siteSettings?.brightcall?.enabled && siteSettings?.brightcall?.widgetKey
	);

	return (
		<NavbarVariantProvider>
			<div className="flex flex-col min-h-screen overflow-x-clip">
				<ScrollToTop />
				<Navbar config={siteConfig} logoUrl={logoUrl} />
				<main className="flex-1 w-full">{children}</main>
				<Footer
					config={siteConfig}
					footerSettings={footerSettings ?? undefined}
					logoUrl={logoUrl}
				/>
				<MobileBottomNav />
				{brightcallActive && (
					<BrightcallScript
						widgetKey={siteSettings!.brightcall!.widgetKey!}
						apiBaseUrl={siteSettings!.brightcall?.apiBaseUrl}
					/>
				)}
			</div>
		</NavbarVariantProvider>
	);
}
