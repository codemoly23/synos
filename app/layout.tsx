import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { TrackingScripts } from "@/components/analytics/tracking-scripts";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["300", "600"],
});

const DEFAULT_KEYWORDS = [
	"laser",
	"medicinsk utrustning",
	"hårborttagning",
	"tatueringsborttagning",
	"hudföryngring",
	"MDR-certifierad",
	"klinikutrustning",
	"Soprano",
	"Harmony XL PRO",
];

const DEFAULT_SITE_SETTINGS = {
	seo: {
		siteName: "Synos Medical",
		siteDescription:
			"Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.",
		ogImage: "/og-image.jpg",
		keywords: DEFAULT_KEYWORDS,
		twitterHandle: undefined as string | undefined,
	},
	companyName: "Synos Medical AB",
};

// Resolve tracking IDs: DB is authoritative once the tracking field has ever
// been saved. Before that (field is undefined), fall back to env vars so the
// live site keeps working during the migration period.
function resolveTrackingIds(settings: Awaited<ReturnType<typeof getSiteSettings>> | null) {
	const hasDbTracking = settings?.tracking !== undefined;
	return {
		cookiebotId: hasDbTracking
			? (settings?.tracking?.cookiebotId ?? "")
			: (process.env.NEXT_PUBLIC_COOKIEBOT_ID ?? ""),
		gtmId: hasDbTracking
			? (settings?.tracking?.gtmId ?? "")
			: (process.env.NEXT_PUBLIC_GTM_ID ?? ""),
		fbPixelId: hasDbTracking
			? (settings?.tracking?.facebookPixelId ?? "")
			: (process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? ""),
		ga4Id: settings?.tracking?.ga4Id ?? "",
		googleAdsId: settings?.tracking?.googleAdsId ?? "",
	};
}

export async function generateMetadata(): Promise<Metadata> {
	const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);

	const siteUrl =
		process.env.SITE_URL ||
		process.env.BETTER_AUTH_URL ||
		"http://localhost:3000";

	const siteName = settings.seo?.siteName || "Synos Medical";
	const siteDescription =
		settings.seo?.siteDescription ||
		"Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.";
	const ogImage = settings.seo?.ogImage || "/og-image.jpg";
	const keywords =
		settings.seo?.keywords && settings.seo.keywords.length > 0
			? settings.seo.keywords
			: DEFAULT_KEYWORDS;
	const companyName = settings.companyName || "Synos Medical AB";

	return {
		metadataBase: new URL(siteUrl),
		title: {
			default: `${siteName} - Sveriges ledande leverantör av MDR-certifierad klinikutrustning`,
			template: `%s | ${siteName}`,
		},
		description: siteDescription,
		keywords,
		authors: [{ name: companyName }],
		creator: companyName,
		openGraph: {
			type: "website",
			locale: "sv_SE",
			url: siteUrl,
			title: siteName,
			description: siteDescription,
			siteName: siteName,
			images: ogImage
				? [{ url: ogImage, width: 1200, height: 630, alt: siteName }]
				: [],
		},
		twitter: {
			card: "summary_large_image",
			title: siteName,
			description: siteDescription,
			images: ogImage ? [ogImage] : [],
			creator: settings.seo?.twitterHandle,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const settings = await getSiteSettings().catch(() => null);
	const { cookiebotId, gtmId, fbPixelId, ga4Id, googleAdsId } =
		resolveTrackingIds(settings);

	return (
		<html lang="sv" className="scroll-smooth">
			<body
				className={`${montserrat.variable} antialiased bg-slate-100`}
			>
				{cookiebotId && (
					<Script
						id="cookiebot"
						src="https://consent.cookiebot.com/uc.js"
						data-cbid={cookiebotId}
						data-blockingmode="auto"
						strategy="afterInteractive"
					/>
				)}
				<NuqsAdapter>{children}</NuqsAdapter>
				<ToasterProvider />

				{/*
				  TrackingScripts is a client component that:
				  - Waits for Cookiebot marketing consent before loading any scripts
				  - Loads GTM OR (GA4 + Pixel) — never both GTM and Pixel to avoid
				    double-firing PageView
				  - Pushes pageview events to dataLayer on every SPA route change
				*/}
				<TrackingScripts
					cookiebotId={cookiebotId}
					gtmId={gtmId}
					fbPixelId={fbPixelId}
					ga4Id={ga4Id}
					googleAdsId={googleAdsId}
				/>
			</body>
		</html>
	);
}
