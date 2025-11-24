import { Phone } from "lucide-react";
import { ContactForm } from "@/components/home/ContactForm";

const CtaSection = () => {
	return (
		<section className="py-32 bg-slate-400/80 relative overflow-hidden">
			<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
			{/* Abstract shapes */}
			<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

			<div className="container-width relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div className="max-w-2xl">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-secondary">
							Ready to Upgrade Your Facility?
						</h2>
						<p className="text-slate-600 text-xl mb-8 leading-relaxed">
							Get in touch with our specialists today for a custom quote
							and discover how Synos Medical can transform your practice
							with state-of-the-art technology.
						</p>

						<div className="space-y-6">
							<div className="flex items-start gap-4 text-secondary">
								<div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
									<Phone className="h-6 w-6" />
								</div>
								<div>
									<h4 className="text-lg font-bold">
										Call Us Directly
									</h4>
									<p className="text-slate-500">
										Available 24/7 for emergency support
									</p>
									<a
										href="tel:+18005550123"
										className="text-primary font-semibold hover:underline mt-1 block"
									>
										(800) 555-0123
									</a>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-full bg-white text-slate-600 shadow-sm flex items-center justify-center shrink-0">
									<div className="h-6 w-6 rounded-full border-2 border-current" />
								</div>
								<div>
									<h4 className="text-lg font-bold text-secondary">
										Visit Our Showroom
									</h4>
									<p className="text-slate-500">
										Experience our equipment firsthand
									</p>
									<p className="text-primary font-medium mt-1">
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
	);
};

export default CtaSection;
