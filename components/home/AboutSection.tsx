import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { ImageComponent } from "../common/image-component";

{
	/* About / Why Choose Us Section */
}
const AboutSection = () => {
	return (
		<section className="section-padding bg-white relative overflow-hidden">
			<div className="_container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
					<ImageComponent
						src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
						alt="Modern Hospital Interior"
						height={0}
						width={0}
						sizes="100vw"
						wrapperClasses="w-full h-full"
						className="object-cover w-full h-full"
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
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 w-fit border border-primary/20">
						<span className="text-xs font-bold text-primary uppercase tracking-wider">
							Why Choose Synos
						</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
						Empowering Healthcare with{" "}
						<span className="text-primary">Precision Technology</span>
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
								<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
									<CheckCircle2 className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
								</div>
								<span className="font-medium text-secondary group-hover:text-primary transition-colors">
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
	);
};

export default AboutSection;
