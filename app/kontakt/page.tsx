import { siteConfig } from "@/config/site";
import { AnimatedHero } from "./_components/animated-hero";
import { AnimatedContactCards } from "./_components/animated-contact-cards";
import { AnimatedFormSection } from "./_components/animated-form-section";
import { AnimatedOfficeLocations } from "./_components/animated-office-locations";
import { AnimatedFAQ } from "./_components/animated-faq";

export default function ContactPage() {
	return (
		<div className="bg-slate-100 w-full">
			{/* Hero Section */}
			<AnimatedHero
				phone={siteConfig.company.phone}
				email={siteConfig.company.email}
			/>

			{/* Contact Methods Section */}
			<AnimatedContactCards
				phone={siteConfig.company.phone}
				email={siteConfig.company.email}
				facebookUrl={siteConfig.links.facebook}
				instagramUrl={siteConfig.links.instagram}
				linkedinUrl={siteConfig.links.linkedin}
			/>

			{/* Contact Form Section */}
			<section className="section-padding bg-white">
				<div className="_container">
					<div className="mx-auto max-w-3xl">
						<AnimatedFormSection />
					</div>
				</div>
			</section>

			{/* Office Locations Section */}
			<section className="section-padding bg-slate-50">
				<div className="_container overflow-hidden">
					<AnimatedOfficeLocations
						addresses={siteConfig.company.addresses}
					/>
				</div>
			</section>

			{/* FAQ Section */}
			<AnimatedFAQ />
		</div>
	);
}
