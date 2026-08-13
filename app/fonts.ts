import localFont from "next/font/local";

// Self-hosted fonts (woff2 in ./fonts/*). Previously loaded via next/font/google,
// which downloads font files from Google at BUILD time — a transient network/SSL
// failure on the CI runner would fail the whole build. Self-hosting removes that
// build-time network dependency entirely. Weights/styles/subsets and the CSS
// variable names match the former next/font/google config exactly.

export const montserrat = localFont({
	variable: "--font-montserrat",
	display: "swap",
	src: [
		{ path: "./fonts/montserrat/montserrat-v31-latin-300.woff2", weight: "300", style: "normal" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-300italic.woff2", weight: "300", style: "italic" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-regular.woff2", weight: "400", style: "normal" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-italic.woff2", weight: "400", style: "italic" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-500.woff2", weight: "500", style: "normal" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-500italic.woff2", weight: "500", style: "italic" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-600.woff2", weight: "600", style: "normal" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-600italic.woff2", weight: "600", style: "italic" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-700.woff2", weight: "700", style: "normal" },
		{ path: "./fonts/montserrat/montserrat-v31-latin-700italic.woff2", weight: "700", style: "italic" },
	],
});

export const notoSans = localFont({
	variable: "--font-noto-sans",
	display: "swap",
	src: [
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-300.woff2", weight: "300", style: "normal" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-300italic.woff2", weight: "300", style: "italic" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-regular.woff2", weight: "400", style: "normal" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-italic.woff2", weight: "400", style: "italic" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-500.woff2", weight: "500", style: "normal" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-500italic.woff2", weight: "500", style: "italic" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-600.woff2", weight: "600", style: "normal" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-600italic.woff2", weight: "600", style: "italic" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-700.woff2", weight: "700", style: "normal" },
		{ path: "./fonts/noto-sans/noto-sans-v42-latin-700italic.woff2", weight: "700", style: "italic" },
	],
});
