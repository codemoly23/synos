import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { siteConfig } from "@/config/site";

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
		<div className="flex flex-col min-h-screen">
			<Navbar config={siteConfig} />
			<main className="flex-1 w-full">{children}</main>
			<Footer config={siteConfig} />
			<MobileBottomNav />
		</div>
	);
}
