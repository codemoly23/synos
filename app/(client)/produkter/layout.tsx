import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Produkter - Synos Medical",
	description:
		"Upptäck vårt sortiment av professionella lasermaskiner och medicinsk utrustning för kliniker och salonger. MDR-certifierade produkter av högsta kvalitet.",
	openGraph: {
		title: "Produkter - Synos Medical",
		description:
			"Professionella lasermaskiner och medicinsk utrustning för hårborttagning, tatueringsborttagning, hudföryngring och mer.",
	},
};

export default function ProdukterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

