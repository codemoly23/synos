"use client";

import { useState } from "react";

interface GoogleMapProps {
	lat: number;
	lng: number;
	title: string;
	address: string;
}

export function GoogleMap({ lat, lng, title, address }: GoogleMapProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	// Create Google Maps URL
	const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${
		process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "YOUR_API_KEY"
	}&q=${lat},${lng}&zoom=15`;

	// Fallback to static map if API key is not available
	const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x400&markers=color:red%7C${lat},${lng}&key=${
		process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""
	}`;

	// Google Maps link for opening in new tab
	const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

	return (
		<div className="relative h-full w-full overflow-hidden rounded-lg">
			{/* Loading placeholder */}
			{!isLoaded && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted">
					<div className="text-center">
						<div className="mb-2 text-lg font-medium">{title}</div>
						<div className="text-sm text-muted-foreground">{address}</div>
						<a
							href={googleMapsLink}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 inline-block text-secondary hover:underline"
						>
							Öppna i Google Maps →
						</a>
					</div>
				</div>
			)}

			{/* Embedded map */}
			{process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
				<iframe
					src={mapUrl}
					width="100%"
					height="100%"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					onLoad={() => setIsLoaded(true)}
					title={`Karta till ${title}`}
				/>
			) : (
				<div className="flex h-full items-center justify-center bg-muted p-8 text-center">
					<div>
						<div className="mb-4 text-lg font-medium">{title}</div>
						<div className="mb-4 text-sm text-muted-foreground">
							{address}
						</div>
						<a
							href={googleMapsLink}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-white hover:bg-secondary-hover"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Öppna i Google Maps
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
