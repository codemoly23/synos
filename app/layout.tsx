import type { Metadata } from "next";
import { Montserrat, Noto_Sans } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { TrackingScripts } from "@/components/analytics/tracking-scripts";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	style: ["normal", "italic"],
});

const notoSans = Noto_Sans({
	variable: "--font-noto-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	style: ["normal", "italic"],
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
				className={`${montserrat.variable} ${notoSans.variable} antialiased bg-slate-100`}
			>
				{gtmId && (
					<>
						{/*
						  Consent Mode v2 default + GTM container bootstrap.
						  strategy="beforeInteractive" makes Next.js inject this into the
						  initial server-rendered HTML before hydration/any other script —
						  this is Next.js's own documented pattern for exactly this case
						  (App Router does not support a literal manual <head> element
						  alongside generateMetadata — that combination crashes the render,
						  confirmed while building this). Consent defaults to denied until
						  TrackingScripts (below) calls gtag('consent', 'update', ...) once
						  Cookiebot reports the user's real choice. NOTE: the GTM container
						  itself still needs each tag's "Consent Settings" configured in
						  the GTM UI to actually respect this signal — that's on whoever
						  manages the container, not this repo.
						*/}
						<Script id="gtm-consent-init" strategy="beforeInteractive">
							{`
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('consent', 'default', {
									ad_storage: 'denied',
									analytics_storage: 'denied',
									ad_user_data: 'denied',
									ad_personalization: 'denied',
									wait_for_update: 500
								});
								(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','${gtmId}');
							`}
						</Script>
						<noscript>
							<iframe
								src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
								height="0"
								width="0"
								style={{ display: "none", visibility: "hidden" }}
							/>
						</noscript>
					</>
				)}
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
				  - If GTM is configured (already loaded in <head> above): pushes
				    gtag('consent', 'update', ...) once Cookiebot reports the user's
				    real consent choice — GTM itself is never blocked from loading.
				  - If GTM is NOT configured: falls back to loading GA4/Ads/Pixel
				    directly, gated on Cookiebot marketing consent as before.
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
