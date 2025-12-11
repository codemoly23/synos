import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

/**
 * Auth Layout - Login/Register pages with Navbar and Footer
 */
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar config={siteConfig} />
			<main className="flex-1 w-full">{children}</main>
			<Footer config={siteConfig} />
		</div>
	);
}
