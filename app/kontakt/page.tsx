import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { GoogleMap } from "@/components/shared/google-map";
import { siteConfig } from "@/config/site";

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

export default function ContactPage() {
	return (
		<div className="container mx-auto px-4 py-12">
			{/* Header */}
			<div className="mb-12 text-center">
				<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
					Kontakta oss
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Har du frågor om våra produkter, utbildningar eller vill veta mer
					om hur du startar din egen klinik? Vi hjälper dig gärna!
				</p>
			</div>

			{/* Contact Info Cards */}
			<div className="mb-12 grid gap-6 md:grid-cols-3">
				{/* Phone */}
				<div className="rounded-lg border border-border bg-background p-6 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
							<svg
								className="h-6 w-6 text-secondary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
					</div>
					<h3 className="mb-2 font-semibold">Telefon</h3>
					<a
						href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`}
						className="text-secondary hover:underline"
					>
						{siteConfig.company.phone}
					</a>
					<p className="mt-2 text-sm text-muted-foreground">
						Mån-Fre 09:00-17:00
					</p>
				</div>

				{/* Email */}
				<div className="rounded-lg border border-border bg-background p-6 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
							<svg
								className="h-6 w-6 text-secondary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>
					<h3 className="mb-2 font-semibold">E-post</h3>
					<a
						href={`mailto:${siteConfig.company.email}`}
						className="text-secondary hover:underline"
					>
						{siteConfig.company.email}
					</a>
					<p className="mt-2 text-sm text-muted-foreground">
						Vi svarar inom 24 timmar
					</p>
				</div>

				{/* Social */}
				<div className="rounded-lg border border-border bg-background p-6 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
							<svg
								className="h-6 w-6 text-secondary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
								/>
							</svg>
						</div>
					</div>
					<h3 className="mb-2 font-semibold">Sociala medier</h3>
					<div className="flex justify-center gap-3">
						<a
							href={siteConfig.links.facebook}
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-secondary-hover"
							aria-label="Facebook"
						>
							<svg
								className="h-6 w-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
						</a>
						<a
							href={siteConfig.links.instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-secondary-hover"
							aria-label="Instagram"
						>
							<svg
								className="h-6 w-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
							</svg>
						</a>
						<a
							href={siteConfig.links.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-secondary-hover"
							aria-label="LinkedIn"
						>
							<svg
								className="h-6 w-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
						</a>
					</div>
					<p className="mt-2 text-sm text-muted-foreground">
						Följ oss för nyheter
					</p>
				</div>
			</div>

			{/* Main Content: Form + Map */}
			<div className="grid gap-12 lg:grid-cols-2">
				{/* Contact Form */}
				<div>
					<h2 className="mb-6 text-2xl font-bold">
						Skicka ett meddelande
					</h2>
					<ContactForm />
				</div>

				{/* Office Locations */}
				<div>
					<h2 className="mb-6 text-2xl font-bold">Våra kontor</h2>
					<div className="space-y-6">
						{siteConfig.company.addresses.map((address) => (
							<div key={address.name} className="space-y-4">
								<div className="rounded-lg border border-border bg-background p-6">
									<h3 className="mb-3 text-xl font-semibold text-secondary">
										{address.name}
									</h3>
									<div className="space-y-2 text-muted-foreground">
										<p>{address.street}</p>
										<p>
											{address.postalCode} {address.city}
										</p>
										<p>{address.country}</p>
									</div>
								</div>
								<div className="h-64 overflow-hidden rounded-lg">
									<GoogleMap
										lat={address.lat}
										lng={address.lng}
										title={address.name}
										address={`${address.street}, ${address.postalCode} ${address.city}`}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="mt-16 rounded-lg bg-muted/50 p-8">
				<h2 className="mb-6 text-2xl font-bold">Vanliga frågor</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<h3 className="mb-2 font-semibold">
							Hur snabbt får jag svar?
						</h3>
						<p className="text-sm text-muted-foreground">
							Vi strävar efter att svara på alla förfrågningar inom 24
							timmar under vardagar.
						</p>
					</div>
					<div>
						<h3 className="mb-2 font-semibold">Kan jag boka ett möte?</h3>
						<p className="text-sm text-muted-foreground">
							Absolut! Ange i meddelandet att du vill boka ett möte så
							återkommer vi med förslag på tider.
						</p>
					</div>
					<div>
						<h3 className="mb-2 font-semibold">
							Erbjuder ni demonstrationer?
						</h3>
						<p className="text-sm text-muted-foreground">
							Ja, vi erbjuder kostnadsfria produktdemonstrationer på våra
							kontor eller hos er.
						</p>
					</div>
					<div>
						<h3 className="mb-2 font-semibold">Finns ni på plats?</h3>
						<p className="text-sm text-muted-foreground">
							Vi rekommenderar att boka tid innan besök för att
							säkerställa att rätt person finns tillgänglig.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
