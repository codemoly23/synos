"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Quote } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
	{
		quote: "Synos Medical provided us with top-tier imaging equipment that has significantly improved our diagnostic capabilities. Their support team is unmatched.",
		author: "Dr. Sarah Chen",
		role: "Chief of Radiology",
		hospital: "St. Mary's General Hospital",
	},
	{
		quote: "The procurement process was seamless. From quote to installation, everything was handled with extreme professionalism. Highly recommended.",
		author: "James Wilson",
		role: "Procurement Director",
		hospital: "City Health Network",
	},
	{
		quote: "We appreciate the ongoing training and maintenance support. It gives us peace of mind knowing our equipment is always in perfect condition.",
		author: "Dr. Michael Ross",
		role: "Head of Surgery",
		hospital: "Westside Medical Center",
	},
	{
		quote: "Exceptional quality and reliability. The surgical robots we purchased have performed flawlessly for over two years now.",
		author: "Elena Rodriguez",
		role: "Operations Manager",
		hospital: "Pacific Care Institute",
	},
];

export function Testimonials() {
	return (
		<section className="section-padding bg-secondary text-white overflow-hidden">
			<div className="container-width">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
					{/* Header */}
					<div className="lg:col-span-1">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Trusted by Leading Healthcare Providers
						</h2>
						<p className="text-slate-100/80 text-lg mb-8">
							See why hospitals and clinics across the country choose
							Synos Medical for their equipment needs.
						</p>
						<div className="flex gap-2">
							<div className="h-2 w-12 bg-primary rounded-full" />
							<div className="h-2 w-2 bg-primary/50 rounded-full" />
							<div className="h-2 w-2 bg-primary/50 rounded-full" />
						</div>
					</div>

					{/* Carousel */}
					<div className="lg:col-span-2">
						<Swiper
							modules={[Pagination, Autoplay]}
							spaceBetween={30}
							slidesPerView={1}
							breakpoints={{
								768: {
									slidesPerView: 2,
								},
							}}
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							pagination={{
								clickable: true,
								bulletActiveClass: "bg-primary opacity-100",
								bulletClass:
									"inline-block h-2 w-2 rounded-full bg-white/30 mx-1 cursor-pointer transition-all",
							}}
							className="pb-12"
						>
							{testimonials.map((item, index) => (
								<SwiperSlide key={index}>
									<div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl h-full min-h-[280px] flex flex-col">
										<Quote className="h-8 w-8 text-slate-200 mb-6 opacity-80" />
										<p className="text-lg leading-relaxed mb-6 grow">
											{`"${item.quote}"`}
										</p>
										<div className="flex items-center gap-4 mt-auto">
											<div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
												{item.author.charAt(0)}
											</div>
											<div>
												<div className="font-bold">
													{item.author}
												</div>
												<div className="text-sm text-slate-200/70">
													{item.role}, {item.hospital}
												</div>
											</div>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>
		</section>
	);
}
