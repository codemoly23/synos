import { Hero } from "@/components/home/Hero";
import { SearchSection } from "@/components/home/SearchSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ImageGallery } from "@/components/home/ImageGallery";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactForm } from "@/components/home/ContactForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<Hero />
			<SearchSection />
			<FeatureHighlights />
			<ProductShowcase />
			<ImageGallery />

			{/* About / Why Choose Us Section */}
			<section className="section-padding bg-white relative overflow-hidden">
				<div className="container-width grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
						<Image
							src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
							alt="Modern Hospital Interior"
							fill
							className="object-cover"
						/>
						{/* Decorative elements */}
						<div className="absolute inset-0 bg-linear-to-t from-secondary/60 via-transparent to-transparent" />
						<div className="absolute bottom-8 left-8 right-8 text-white bg-secondary/30 p-8 rounded-3xl">
							<div className="flex items-center gap-3 mb-2">
								<div className="bg-success rounded-full p-1">
									<CheckCircle2 className="h-4 w-4 text-white" />
								</div>
								<span className="font-bol text-lg tracking-wide uppercase ">
									ISO 13485 Certified
								</span>
							</div>
							<p className="text-sm text-slate-200">{`"Setting the gold standard in medical technology distribution."`}</p>
						</div>
					</div>

					<div className="space-y-8">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 w-fit border border-accent/20">
							<span className="text-xs font-bold text-accent uppercase tracking-wider">
								Why Choose Synos
							</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-[#0C2C46] leading-tight">
							Empowering Healthcare with{" "}
							<span className="text-accent">Precision Technology</span>
						</h2>
						<p className="text-slate-600 text-lg leading-relaxed">
							{`At Synos Medical, we bridge the gap between innovation and
							patient care. Our curated selection of medical equipment
							ensures that your facility operates at the highest
							standards of safety and efficiency. We don't just supply
							equipment; we provide complete medical solutions.`}
						</p>

						<ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
							{[
								"MDR Certified Equipment",
								"24/7 Technical Support",
								"Comprehensive Warranty",
								"Expert Installation",
								"Flexible Financing",
								"Staff Training Included",
							].map((item, i) => (
								<li key={i} className="flex items-center gap-3 group">
									<div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
										<CheckCircle2 className="h-5 w-5 text-accent group-hover:text-white transition-colors duration-300" />
									</div>
									<span className="font-medium text-[#0C2C46] group-hover:text-accent transition-colors">
										{item}
									</span>
								</li>
							))}
						</ul>

						<div className="pt-6 flex flex-wrap gap-4">
							<Button
								size="lg"
								className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-12 shadow-lg shadow-secondary/20"
							>
								Learn More About Us
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="rounded-full px-8 h-12 border-secondary/20 hover:bg-secondary/5 text-secondary hover:text-secondary gap-2"
							>
								View Certifications <ArrowRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</section>

			<ProcessSteps />
			<Testimonials />

			{/* CTA Section - Lighter Theme */}
			<section className="py-32 bg-secondary/30 relative overflow-hidden">
				<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
				{/* Abstract shapes */}
				<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

				<div className="container-width relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div className="max-w-2xl">
							<h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
								Ready to Upgrade Your Facility?
							</h2>
							<p className="text-muted-foreground text-xl mb-8 leading-relaxed">
								Get in touch with our specialists today for a custom
								quote and discover how Synos Medical can transform your
								practice with state-of-the-art technology.
							</p>

							<div className="space-y-6">
								<div className="flex items-start gap-4">
									<div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-accent">
										<Phone className="h-6 w-6" />
									</div>
									<div>
										<h4 className="text-lg font-bold text-slate-50">
											Call Us Directly
										</h4>
										<p className="text-muted-foreground">
											Available 24/7 for emergency support
										</p>
										<a
											href="tel:+18005550123"
											className="text-accent font-semibold hover:underline mt-1 block"
										>
											(800) 555-0123
										</a>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-accent">
										<div className="h-6 w-6 rounded-full border-2 border-current" />
									</div>
									<div>
										<h4 className="text-lg font-bold text-slate-50">
											Visit Our Showroom
										</h4>
										<p className="text-muted-foreground">
											Experience our equipment firsthand
										</p>
										<p className="text-slate-50 font-medium mt-1">
											123 Medical Plaza, Tech City, CA
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="w-full">
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
