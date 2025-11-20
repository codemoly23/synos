import { Hero } from "@/features/home-v2/hero";
import { Features } from "@/features/home-v2/features";
import { Stats } from "@/features/home-v2/stats";
import { Testimonials } from "@/features/home-v2/testimonials";
import { FAQ } from "@/features/home-v2/faq";
import { Contact } from "@/features/home-v2/contact";

/**
 * Homepage - Bullish-inspired Premium Redesign
 *
 * Features:
 * - Light, clean, professional design for medical equipment company
 * - Medical teal branding (#00949e)
 * - Subtle animations with Framer Motion
 * - Responsive design for all breakpoints
 * - Accessibility-first approach
 * - Optimized for performance (LCP, CLS)
 */
export default function Home() {
	return (
		<div className="relative pt-6 sm:pt-0">
			<Hero />
			<Features />
			<Stats />
			<Testimonials />
			<FAQ />
			<Contact />
		</div>
	);
}
