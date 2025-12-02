"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { GoogleMap } from "@/components/shared/google-map";

interface Address {
	readonly name: string;
	readonly street: string;
	readonly postalCode: string;
	readonly city: string;
	readonly country: string;
	readonly lat: number;
	readonly lng: number;
}

interface AnimatedOfficeLocationsProps {
	addresses: readonly Address[];
}

export function AnimatedOfficeLocations({
	addresses,
}: AnimatedOfficeLocationsProps) {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
					<MapPin className="h-4 w-4 text-secondary" />
					<span className="text-sm font-semibold text-secondary">
						Våra kontor
					</span>
				</div>
				<h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
					Besök oss
				</h2>
				<p className="text-lg text-slate-600">
					Vi har kontor i Stockholm och Linköping. Välkommen att besöka
					oss!
				</p>
			</div>

			{/* Tabs */}
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

			{/* Map with Floating Card - Desktop: Side by Side, Mobile: Stacked */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Map Section - Preload all maps, show/hide based on active tab */}
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
								<GoogleMap
									lat={address.lat}
									lng={address.lng}
									title={address.name}
									address={`${address.street}, ${address.postalCode} ${address.city}`}
								/>
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
										{addresses[activeTab].name}
									</h3>
									<div className="flex items-center gap-2 text-sm text-slate-600">
										<MapPin className="h-4 w-4 text-secondary" />
										<span className="font-medium">
											{addresses[activeTab].city}
										</span>
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
											{addresses[activeTab].street}
										</p>
										<p className="text-sm text-slate-600">
											{addresses[activeTab].postalCode}{" "}
											{addresses[activeTab].city}
										</p>
										<p className="text-sm text-slate-600">
											{addresses[activeTab].country}
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
										<p className="font-medium text-secondary">
											Mån-Fre 09:00-17:00
										</p>
										<p className="text-sm text-slate-600">
											Helger stängt
										</p>
									</div>
								</div>
							</div>

							<a
								href={`https://www.google.com/maps/search/?api=1&query=${addresses[activeTab].lat},${addresses[activeTab].lng}`}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary hover:shadow-lg"
							>
								<MapPin className="h-4 w-4" />
								Öppna i Google Maps
							</a>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</div>
		</motion.div>
	);
}
