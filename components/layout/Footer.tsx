import Link from "next/link";
import {
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // Assuming Separator exists or I'll use div
import Logo from "../common/logo";

export function Footer() {
	return (
		<footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
			<div className="container-width">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
					{/* Brand Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-4">
							{/* <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
								S
							</div>
							<span className="font-bold text-xl tracking-tight">
								Synos<span className="text-accent">Medical</span>
							</span> */}
							<Logo />
						</div>
						<p className="text-secondary-foreground/70 text-sm leading-relaxed">
							Your trusted partner for advanced medical equipment and
							healthcare solutions. Certified quality, global standards.
						</p>
						<div className="flex gap-4 pt-2">
							{[Facebook, Twitter, Linkedin, Instagram].map(
								(Icon, i) => (
									<a
										key={i}
										href="#"
										className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
									>
										<Icon className="h-4 w-4" />
									</a>
								)
							)}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-bold text-lg mb-6">Quick Links</h4>
						<ul className="space-y-3 text-sm text-secondary-foreground/70">
							{[
								"About Us",
								"Our Products",
								"Services",
								"Case Studies",
								"News & Insights",
								"Careers",
							].map((item) => (
								<li key={item}>
									<Link
										href="#"
										className="hover:text-accent transition-colors"
									>
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="font-bold text-lg mb-6">Contact Us</h4>
						<ul className="space-y-4 text-sm text-secondary-foreground/70">
							<li className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-accent shrink-0" />
								<span>
									123 Medical Center Dr,
									<br />
									Innovation Park, CA 90210
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-accent shrink-0" />
								<span>+1 (800) 555-0123</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-accent shrink-0" />
								<span>support@synosmedical.com</span>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h4 className="font-bold text-lg mb-6">Stay Updated</h4>
						<p className="text-sm text-secondary-foreground/70 mb-4">
							Subscribe to our newsletter for the latest product updates
							and medical insights.
						</p>
						<div className="flex flex-col gap-3">
							<Input
								placeholder="Enter your email"
								className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-accent"
							/>
							<Button className="bg-accent hover:bg-accent-hover text-white w-full">
								Subscribe
							</Button>
						</div>
					</div>
				</div>

				<div className="h-px w-full bg-white/10 my-8" />

				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/50">
					<p>© 2024 Synos Medical. All rights reserved.</p>
					<div className="flex gap-6">
						<Link href="#" className="hover:text-white">
							Privacy Policy
						</Link>
						<Link href="#" className="hover:text-white">
							Terms of Service
						</Link>
						<Link href="#" className="hover:text-white">
							Sitemap
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
