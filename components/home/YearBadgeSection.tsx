"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
const BADGE_SIZE = 90;
const GAP = 24;
const STEP = BADGE_SIZE + GAP;
const TOTAL_WIDTH = 8 * BADGE_SIZE + 7 * GAP;
const CENTER_X = TOTAL_WIDTH / 2 - BADGE_SIZE / 2;

// Year badges — white outer ring design
function YearBadgeSVG({ year }: { year: number }) {
	const uid = year;
	return (
		<svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<path id={`arc-${uid}`} d="M 8,60 A 52,52 0 0,1 112,60" />
				<clipPath id={`clip-${uid}`}>
					<circle cx="60" cy="60" r="27" />
				</clipPath>
			</defs>

			{/* White outer ring */}
			<circle cx="60" cy="60" r="58" fill="white" />
			<circle cx="60" cy="60" r="57.5" fill="none" stroke="#e0e0e0" strokeWidth="0.8" />

			{/* 3 colored segments (R=44, r=28) */}
			<path d="M 21.9,82 A 44,44 0 0,1 60,16 L 60,32 A 28,28 0 0,0 35.75,74 Z" fill="#e91e8c" />
			<path d="M 60,16 A 44,44 0 0,1 98.1,82 L 84.25,74 A 28,28 0 0,0 60,32 Z" fill="#f5c518" />
			<path d="M 98.1,82 A 44,44 0 0,1 21.9,82 L 35.75,74 A 28,28 0 0,0 84.25,74 Z" fill="#00bcd4" />

			{/* Inner dark circle */}
			<circle cx="60" cy="60" r="27" fill="#0d1117" />

			{/* synos bar bottom */}
			<rect x="28" y="76" width="64" height="14" fill="#1a1a3e" clipPath={`url(#clip-${uid})`} />

			{/* Curved dark text on white ring */}
			<text fill="#1a1a1a" fontSize="6.5" fontWeight="700" letterSpacing="1.8" fontFamily="Arial, sans-serif">
				<textPath href={`#arc-${uid}`} startOffset="50%" textAnchor="middle">
					SYNOS MEDICAL
				</textPath>
			</text>

			{/* Stars left & right */}
			<text x="38" y="68" textAnchor="middle" fontSize="7" fill="#ffd700" fontFamily="sans-serif">★</text>
			<text x="82" y="68" textAnchor="middle" fontSize="7" fill="#ffd700" fontFamily="sans-serif">★</text>

			{/* Year number */}
			<text x="60" y="68" textAnchor="middle" fontSize="15" fontWeight="900" fill="white" fontFamily="Arial Black, Arial, sans-serif">
				{year}
			</text>

			{/* synos label */}
			<text x="60" y="86" textAnchor="middle" fontSize="8" fill="white" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">
				synos
			</text>
		</svg>
	);
}

// Main badge — dark navy + rainbow ring (reco-style)
function MainBadgeSVG() {
	return (
		<svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<path id="arc-main" d="M 8,60 A 52,52 0 0,1 112,60" />
				<clipPath id="clip-main">
					<circle cx="60" cy="60" r="27" />
				</clipPath>
				<radialGradient id="navyGrad" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#1e2f6e" />
					<stop offset="100%" stopColor="#0a0f2e" />
				</radialGradient>
			</defs>

			{/* Dark navy outer background */}
			<circle cx="60" cy="60" r="58" fill="url(#navyGrad)" />
			<circle cx="60" cy="60" r="57.5" fill="none" stroke="#2a3a7a" strokeWidth="0.8" />

			{/* 6 rainbow segments (R=38, r=28) */}
			{/* Points at 60° intervals: 270°,330°,30°,90°,150°,210° */}
			{/* Pink — upper-left (210°→270°) */}
			<path d="M 27.09,41 A 38,38 0 0,1 60,22 L 60,32 A 28,28 0 0,0 35.75,46 Z" fill="#e91e8c" />
			{/* Yellow — upper-right (270°→330°) */}
			<path d="M 60,22 A 38,38 0 0,1 92.91,41 L 84.25,46 A 28,28 0 0,0 60,32 Z" fill="#f5c518" />
			{/* Green — right (330°→30°) */}
			<path d="M 92.91,41 A 38,38 0 0,1 92.91,79 L 84.25,74 A 28,28 0 0,0 84.25,46 Z" fill="#22c55e" />
			{/* Teal — lower-right (30°→90°) */}
			<path d="M 92.91,79 A 38,38 0 0,1 60,98 L 60,88 A 28,28 0 0,0 84.25,74 Z" fill="#00bcd4" />
			{/* Blue — lower-left (90°→150°) */}
			<path d="M 60,98 A 38,38 0 0,1 27.09,79 L 35.75,74 A 28,28 0 0,0 60,88 Z" fill="#3b82f6" />
			{/* Purple — left (150°→210°) */}
			<path d="M 27.09,79 A 38,38 0 0,1 27.09,41 L 35.75,46 A 28,28 0 0,0 35.75,74 Z" fill="#a855f7" />

			{/* Inner dark circle */}
			<circle cx="60" cy="60" r="27" fill="#0a0f2e" />

			{/* synos bar bottom */}
			<rect x="28" y="76" width="64" height="14" fill="#0d1545" clipPath="url(#clip-main)" />

			{/* Curved gold text on dark outer ring */}
			<text fill="#ffd700" fontSize="6.5" fontWeight="700" letterSpacing="1.8" fontFamily="Arial, sans-serif">
				<textPath href="#arc-main" startOffset="50%" textAnchor="middle">
					SYNOS MEDICAL
				</textPath>
			</text>

			{/* Stars left & right */}
			<text x="38" y="65" textAnchor="middle" fontSize="7" fill="#ffd700" fontFamily="sans-serif">★</text>
			<text x="82" y="65" textAnchor="middle" fontSize="7" fill="#ffd700" fontFamily="sans-serif">★</text>

			{/* "7" center */}
			<text x="60" y="65" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="Arial Black, Arial, sans-serif">
				7
			</text>

			{/* ÅR I RAD */}
			<text x="60" y="74" textAnchor="middle" fontSize="5.8" fill="#aaaacc" fontFamily="sans-serif" letterSpacing="1.5">
				ÅR I RAD
			</text>

			{/* synos italic label */}
			<text x="60" y="86" textAnchor="middle" fontSize="8.5" fill="white" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">
				synos
			</text>
		</svg>
	);
}

export default function YearBadgeSection() {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<section
			className="w-full py-14 md:py-20 overflow-x-auto"
			style={{ backgroundColor: "#222222" }}
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			<div className="flex items-center justify-center px-6">
				<div className="relative flex-shrink-0" style={{ width: TOTAL_WIDTH, height: BADGE_SIZE }}>

					{/* Year badges 2019–2025 */}
					{YEARS.map((year, index) => (
						<motion.div
							key={year}
							className="absolute top-0"
							style={{ width: BADGE_SIZE, height: BADGE_SIZE, left: 0 }}
							initial={false}
							animate={{
								x: isExpanded ? index * STEP : CENTER_X,
								opacity: isExpanded ? 1 : 0,
								scale: isExpanded ? 1 : 0,
							}}
							transition={{
								type: "spring",
								stiffness: 35,
								damping: 16,
								delay: isExpanded ? index * 0.12 : (YEARS.length - 1 - index) * 0.08,
							}}
						>
							<YearBadgeSVG year={year} />
						</motion.div>
					))}

					{/* Main dark navy SYNOS badge */}
					<motion.div
						className="absolute top-0 z-20"
						style={{ width: BADGE_SIZE, height: BADGE_SIZE, left: 0 }}
						initial={false}
						animate={{ x: isExpanded ? YEARS.length * STEP : CENTER_X }}
						transition={{
							type: "spring",
							stiffness: 35,
							damping: 16,
							delay: isExpanded ? 0.14 : 0,
						}}
					>
						{/* Continuous breathing ring — behind badge */}
						<motion.span
							className="absolute inset-0 rounded-full pointer-events-none"
							style={{ border: "1px solid rgba(180, 180, 210, 0.35)", zIndex: -1 }}
							animate={{ scale: [1.05, 1.18, 1.05] }}
							transition={{
								duration: 2.3,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
						<MainBadgeSVG />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
