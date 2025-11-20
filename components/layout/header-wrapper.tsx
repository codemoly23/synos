"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import {
	FacebookIcon,
	InstagramIcon,
	LinkedinIcon,
	MessageSquare,
	Phone,
} from "lucide-react";

export function HeaderWrapper() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		let ticking = false;

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setIsScrolled(window.scrollY > 50);
					ticking = false;
				});
				ticking = true;
			}
		};

		// Check initial scroll position
		onScroll();

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3">
			<motion.nav
				className={cn(
					"rounded-sm transition-all duration-500 ease-out max-w-[1440px] mx-auto bg-accent!",
					"header-glass border-none",
					isScrolled && "header-glass-scrolled"
				)}
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{
					duration: 0.6,
					ease: [0.16, 1, 0.3, 1],
					opacity: { duration: 0.4 },
				}}
			>
				{/* Top Info Bar */}
				<div
					className={cn(
						"info-bar-glass transition-all duration-500 ease-out overflow-hidden rounded-t-sm"
					)}
					style={{
						transform: isScrolled ? "translateY(-100%)" : "translateY(0)",
						opacity: isScrolled ? 0 : 1,
						height: isScrolled ? "0px" : "auto",
						willChange: "transform, opacity",
					}}
				>
					<div className="section-container flex h-10 sm:h-11 items-center justify-between text-xs sm:text-sm text-primary">
						{/* Contact Info - Hidden on mobile */}
						<div className="hidden md:flex items-center gap-4 lg:gap-6">
							<a
								href={`tel:${siteConfig.company.phone.replace(
									/\s/g,
									""
								)}`}
								className="flex items-center gap-2 text-white hover:bg-white hover:text-black px-3 py-1.5 rounded-md transition-all duration-300"
							>
								<Phone size={14} className="text-primary" />
								<span>{siteConfig.company.phone}</span>
							</a>
							<a
								href={`mailto:${siteConfig.company.email}`}
								className="flex items-center gap-2 text-white hover:bg-white hover:text-black px-3 py-1.5 rounded-md transition-all duration-300"
							>
								<MessageSquare size={14} className="text-primary" />
								<span>{siteConfig.company.email}</span>
							</a>
						</div>

						{/* Social Icons */}
						<div className="flex items-center gap-3 sm:gap-4 ml-auto">
							<a
								href={siteConfig.links.facebook}
								target="_blank"
								rel="noopener noreferrer"
								className="social-icon-hover text-white hover:bg-white hover:text-black rounded-full p-2 transition-all duration-300"
								aria-label="Facebook"
							>
								<FacebookIcon size={16} />
							</a>
							<a
								href={siteConfig.links.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="social-icon-hover text-white hover:bg-white hover:text-black rounded-full p-2 transition-all duration-300"
								aria-label="Instagram"
							>
								<InstagramIcon size={16} />
							</a>
							<a
								href={siteConfig.links.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="social-icon-hover text-white hover:bg-white hover:text-black rounded-full p-2 transition-all duration-300"
								aria-label="LinkedIn"
							>
								<LinkedinIcon size={16} />
							</a>
						</div>
					</div>
				</div>

				{/* Main Header */}
				<div
					className={cn(
						"section-container flex items-center justify-between transition-all duration-300 ease-out relative z-30",
						isScrolled
							? "h-16 sm:h-18 lg:h-20 py-3 sm:py-4"
							: "h-20 sm:h-22 lg:h-24 py-4 sm:py-5"
					)}
				>
					{/* Logo */}
					<Link href="/" className="flex items-center group z-20">
						<motion.span
							className={cn(
								"font-bold text-white transition-all duration-300 relative",
								isScrolled
									? "text-2xl sm:text-2xl lg:text-3xl"
									: "text-2xl sm:text-3xl lg:text-4xl"
							)}
							whileHover={{
								scale: 1.05,
								textShadow: "0 0 20px rgba(0, 148, 158, 0.5)",
							}}
							transition={{ duration: 0.2 }}
							style={{
								textShadow: "0 0 30px rgba(0, 148, 158, 0.3)",
							}}
						>
							{siteConfig.name}
						</motion.span>
					</Link>

					{/* Desktop Navigation */}
					<Navigation />

					{/* Mobile Menu */}
					<MobileMenu />
				</div>
			</motion.nav>
		</header>
	);
}
