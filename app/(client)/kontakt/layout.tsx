import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Kontakta oss",
	description:
		"Kontakta Synos Medical för frågor om våra produkter, utbildningar eller starta eget-paket. Vi finns i Stockholm och Linköping.",
	openGraph: {
		title: "Kontakta oss - Synos Medical",
		description:
			"Kontakta Synos Medical för frågor om våra produkter, utbildningar eller starta eget-paket.",
	},
};

export default function KontaktLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

