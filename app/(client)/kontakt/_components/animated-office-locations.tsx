"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import type { IKontaktOfficeSection } from "@/models/kontakt-page.model";
import type { IOffice } from "@/models/site-settings.model";

interface AnimatedOfficeLocationsProps {
	data: IKontaktOfficeSection;
	addresses: IOffice[];
}

export function AnimatedOfficeLocations({
	data,
	addresses,
}: AnimatedOfficeLocationsProps) {
	const [activeTab, setActiveTab] = useState(0);

	// Guard against empty addresses
	if (!addresses || addresses.length === 0) {
		return null;
	}

	// Extract coordinates from embed URL if available
	const extractCoordsFromEmbedUrl = (
		embedUrl?: string
	): { lat: number; lng: number } | null => {
		if (!embedUrl) return null;
		// Try to extract coordinates from embed URL patterns
		// Example: https://www.google.com/maps/embed?pb=!1m18!...!2d17.9368!3d59.4392!...
		const latMatch = embedUrl.match(/!3d([-\d.]+)/);
		const lngMatch = embedUrl.match(/!2d([-\d.]+)/);
		if (latMatch && lngMatch) {
			return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
		}
		return null;
	};

	const activeAddress = addresses[activeTab];

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				{data.badge && (
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
						<MapPin className="h-4 w-4 text-secondary" />
						<span className="text-sm font-semibold text-secondary">
							{data.badge}
						</span>
					</div>
				)}
				<h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
					{data.title}
				</h2>
				<p className="text-lg text-slate-600">{data.subtitle}</p>
			</div>

			{/* Tabs */}
			{addresses.length > 1 && (
				<div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1.5">
					{addresses.map((address, index) => (
						<button
							key={address.name}
							onClick={() => setActiveTab(index)}
							className={`flex-1 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
								activeTab === index
									? "bg-white text-secondary shadow-md"
									: "text-slate-600 hover:text-secondary"
							}`}
						>
							{address.city}
						</button>
					))}
				</div>
			)}

			{/* Map with Floating Card - Desktop: Side by Side, Mobile: Stacked */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Map Section - Show embed or placeholder */}
				<div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
					<div className="h-[400px] w-full">
						{addresses.map((address, index) => (
							<motion.div
								key={address.name}
								initial={false}
								animate={{
									opacity: activeTab === index ? 1 : 0,
									scale: activeTab === index ? 1 : 0.95,
								}}
								transition={{ duration: 0.3 }}
								className="absolute inset-0"
								style={{
									pointerEvents: activeTab === index ? "auto" : "none",
									zIndex: activeTab === index ? 1 : 0,
								}}
							>
								{address.mapEmbedUrl ? (
									<iframe
										src={address.mapEmbedUrl}
										width="100%"
										height="100%"
										style={{ border: 0 }}
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										title={`Map of ${address.name}`}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-slate-100">
										<div className="text-center">
											<MapPin className="mx-auto h-12 w-12 text-slate-400" />
											<p className="mt-2 text-slate-500">
												{address.street}, {address.city}
											</p>
										</div>
									</div>
								)}
							</motion.div>
						))}
					</div>
				</div>

				{/* Info Card */}
				<motion.div
					className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
					layout
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<div className="mb-6 flex items-start justify-between">
								<div>
									<h3 className="mb-2 text-2xl font-bold text-secondary">
										{activeAddress.name}
									</h3>
									<div className="flex items-center gap-2 text-sm text-slate-600">
										<MapPin className="h-4 w-4 text-secondary" />
										<span className="font-medium">{activeAddress.city}</span>
									</div>
								</div>
								<div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
									<MapPin className="h-7 w-7 text-secondary" />
								</div>
							</div>

							<div className="space-y-4 border-t border-slate-200 pt-6">
								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
										<MapPin className="h-5 w-5 text-slate-600" />
									</div>
									<div className="flex-1">
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
											Adress
										</p>
										<p className="font-medium text-secondary">
											{activeAddress.street}
										</p>
										<p className="text-sm text-slate-600">
											{activeAddress.postalCode} {activeAddress.city}
										</p>
										<p className="text-sm text-slate-600">
											{activeAddress.country}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
										<Clock className="h-5 w-5 text-slate-600" />
									</div>
									<div className="flex-1">
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
											Öppettider
										</p>
										{data.openingHours && (
											<p className="font-medium text-secondary">
												{data.openingHours}
											</p>
										)}
										{data.closedText && (
											<p className="text-sm text-slate-600">{data.closedText}</p>
										)}
									</div>
								</div>
							</div>

							{/* Google Maps link */}
							{(() => {
								const coords = extractCoordsFromEmbedUrl(activeAddress.mapEmbedUrl);
								const searchQuery = encodeURIComponent(
									`${activeAddress.street}, ${activeAddress.postalCode} ${activeAddress.city}, ${activeAddress.country}`
								);
								const href = coords
									? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
									: `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
								return (
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary hover:shadow-lg"
									>
										<MapPin className="h-4 w-4" />
										Öppna i Google Maps
									</a>
								);
							})()}
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</div>
		</motion.div>
	);
}
