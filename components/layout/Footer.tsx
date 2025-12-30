"use client";

import Link from "next/link";
import {
	Facebook,
	Linkedin,
	Instagram,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "../common/logo";
import type { SiteConfigType } from "@/config/site";
import type { IFooterSettings, IFooterLink } from "@/models/site-settings.model";

// Default footer settings
const DEFAULT_FOOTER_SETTINGS: IFooterSettings = {
	quickLinksTitle: "Snabblänkar",
	contactTitle: "Kontakta oss",
	newsletterTitle: "Håll dig uppdaterad",
	quickLinks: [
		{ label: "Om oss", href: "/om-oss" },
		{ label: "Produkter", href: "/produkter" },
		{ label: "Tjänster", href: "/service" },
		{ label: "Utbildningar", href: "/utbildningar" },
		{ label: "Nyheter", href: "/nyheter" },
		{ label: "Kontakt", href: "/kontakt" },
	],
	newsletterDescription:
		"Prenumerera på vårt nyhetsbrev för de senaste produktuppdateringarna och branschnyheter.",
	newsletterPlaceholder: "Din e-postadress",
	newsletterButtonText: "Prenumerera",
	bottomLinks: [
		{ label: "Integritetspolicy", href: "/integritetspolicy" },
		{ label: "Villkor", href: "/villkor" },
		{ label: "Sitemap", href: "/sitemap.xml" },
	],
};

interface FooterProps {
	config: SiteConfigType;
	footerSettings?: IFooterSettings;
	logoUrl?: string;
}

export function Footer({
	config,
	footerSettings,
	logoUrl,
}: FooterProps) {
	const currentYear = new Date().getFullYear();
	const primaryAddress = config.company.addresses[0];

	// Merge provided settings with defaults
	const settings = {
		quickLinksTitle:
			footerSettings?.quickLinksTitle || DEFAULT_FOOTER_SETTINGS.quickLinksTitle,
		contactTitle:
			footerSettings?.contactTitle || DEFAULT_FOOTER_SETTINGS.contactTitle,
		newsletterTitle:
			footerSettings?.newsletterTitle || DEFAULT_FOOTER_SETTINGS.newsletterTitle,
		quickLinks:
			footerSettings?.quickLinks?.length
				? footerSettings.quickLinks
				: DEFAULT_FOOTER_SETTINGS.quickLinks,
		newsletterDescription:
			footerSettings?.newsletterDescription ||
			DEFAULT_FOOTER_SETTINGS.newsletterDescription,
		newsletterPlaceholder:
			footerSettings?.newsletterPlaceholder ||
			DEFAULT_FOOTER_SETTINGS.newsletterPlaceholder,
		newsletterButtonText:
			footerSettings?.newsletterButtonText ||
			DEFAULT_FOOTER_SETTINGS.newsletterButtonText,
		bottomLinks:
			footerSettings?.bottomLinks?.length
				? footerSettings.bottomLinks
				: DEFAULT_FOOTER_SETTINGS.bottomLinks,
	};

	// Social media icons mapping
	const socialIcons = [
		{ Icon: Facebook, href: config.links.facebook, label: "Facebook" },
		{ Icon: Instagram, href: config.links.instagram, label: "Instagram" },
		{ Icon: Linkedin, href: config.links.linkedin, label: "LinkedIn" },
	];

	const renderLink = (link: IFooterLink) => {
		if (link.isExternal) {
			return (
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-primary transition-colors"
				>
					{link.label}
				</a>
			);
		}
		return (
			<Link href={link.href} className="hover:text-primary transition-colors">
				{link.label}
			</Link>
		);
	};

	return (
		<footer className="bg-secondary text-primary-foreground pt-16 pb-24 md:pb-8">
			<div className="_container">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
					{/* Brand Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-4">
							<Logo logoUrl={logoUrl} />
						</div>
						<p className="text-primary-foreground/70 text-sm leading-relaxed">
							{config.description}
						</p>
						<div className="flex gap-4 pt-2">
							{socialIcons.map(({ Icon, href, label }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={label}
									className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
								>
									<Icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-bold text-lg mb-6">{settings.quickLinksTitle}</h4>
						<ul className="space-y-3 text-sm text-primary-foreground/70">
							{settings.quickLinks.map((item) => (
								<li key={item.href}>{renderLink(item)}</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="font-bold text-lg mb-6">{settings.contactTitle}</h4>
						<ul className="space-y-4 text-sm text-primary-foreground/70">
							{primaryAddress && (
								<li className="flex items-start gap-3">
									<MapPin className="h-5 w-5 text-primary shrink-0" />
									<span>
										{primaryAddress.street}
										<br />
										{primaryAddress.postalCode} {primaryAddress.city}
									</span>
								</li>
							)}
							<li className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-primary shrink-0" />
								<a
									href={`tel:${config.company.phone.replace(/\s/g, "")}`}
									className="hover:text-primary transition-colors"
								>
									{config.company.phone}
								</a>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-primary shrink-0" />
								<a
									href={`mailto:${config.company.email}`}
									className="hover:text-primary transition-colors"
								>
									{config.company.email}
								</a>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h4 className="font-bold text-lg mb-6">{settings.newsletterTitle}</h4>
						<p className="text-sm text-primary-foreground/70 mb-4">
							{settings.newsletterDescription}
						</p>
						<div className="flex flex-col gap-3">
							<Input
								placeholder={settings.newsletterPlaceholder}
								className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
							/>
							<Button className="bg-primary hover:bg-primary-hover text-white w-full">
								{settings.newsletterButtonText}
							</Button>
						</div>
					</div>
				</div>

				<div className="h-px w-full bg-white/10 my-8" />

				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
					<p>
						© {currentYear} {config.company.name}. Alla rättigheter
						förbehållna.
					</p>
					<div className="flex gap-6">
						{settings.bottomLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="hover:text-white"
								{...(link.isExternal && {
									target: "_blank",
									rel: "noopener noreferrer",
								})}
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
