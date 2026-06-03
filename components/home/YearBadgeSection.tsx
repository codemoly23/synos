"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Script from "next/script";

const YEARS = [2021, 2022, 2023, 2024, 2025];
const BADGE_W = 110;
const BADGE_H = 103;
const GAP = 20;
const STEP = BADGE_W + GAP;
const TOTAL_WIDTH = 6 * BADGE_W + 5 * GAP;
const CENTER_X = TOTAL_WIDTH / 2 - BADGE_W / 2;

type Phase = "idle" | "open" | "main-closing" | "badges-closing";

const MAIN_SETTLE_MS = 850;
const BADGES_CLOSE_MS = (YEARS.length - 1) * 120 + 300 + 80;

export default function YearBadgeSection() {
	const [phase, setPhase] = useState<Phase>("idle");
	const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const clearTimers = useCallback(() => {
		timersRef.current.forEach((t) => clearTimeout(t));
		timersRef.current = [];
	}, []);

	const handleMouseEnter = useCallback(() => {
		clearTimers();
		setPhase("open");
	}, [clearTimers]);

	const handleMouseLeave = useCallback(() => {
		clearTimers();
		setPhase("main-closing");

		const t1 = setTimeout(() => {
			setPhase("badges-closing");

			const t2 = setTimeout(() => {
				setPhase("idle");
			}, BADGES_CLOSE_MS);

			timersRef.current.push(t2);
		}, MAIN_SETTLE_MS);

		timersRef.current.push(t1);
	}, [clearTimers]);

	useEffect(() => () => clearTimers(), [clearTimers]);

	return (
		<section
			className="w-full py-14 md:py-20 overflow-x-auto"
			style={{ backgroundColor: "#222222" }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className="flex items-center justify-center px-6">
				<div
					className="relative flex-shrink-0"
					style={{ width: TOTAL_WIDTH, height: BADGE_H }}
				>
					{/* Year badges 2021–2025 */}
					{YEARS.map((year, index) => {
						let opacityTarget: number;
						let yTarget: number;
						let delay: number;

						if (phase === "open") {
							opacityTarget = 1;
							yTarget = 0;
							delay = index * 0.12 + 0.05;
						} else if (phase === "main-closing") {
							opacityTarget = 1;
							yTarget = 0;
							delay = 0;
						} else if (phase === "badges-closing") {
							opacityTarget = 0;
							yTarget = 8;
							delay = (YEARS.length - 1 - index) * 0.12;
						} else {
							opacityTarget = 0;
							yTarget = 8;
							delay = 0;
						}

						return (
							<motion.div
								key={year}
								className="absolute top-0"
								style={{ width: BADGE_W, height: BADGE_H, left: index * STEP }}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: opacityTarget, y: yTarget }}
								transition={{
									duration: 0.35,
									delay,
									ease: [0.25, 0.46, 0.45, 0.94],
								}}
							>
								<div id={`reco--badge-${year}`} />
							</motion.div>
						);
					})}

					{/* Main years-in-row badge */}
					<motion.div
						className="absolute top-0 z-20"
						style={{ width: BADGE_W, height: BADGE_H, left: 0 }}
						initial={false}
						animate={{ x: phase === "open" ? YEARS.length * STEP : CENTER_X }}
						transition={{
							type: "spring",
							stiffness: 55,
							damping: 18,
						}}
					>
						{/* Breathing ring */}
						<motion.span
							className="absolute rounded-full pointer-events-none"
							style={{
								width: BADGE_W,
								height: BADGE_W,
								position: "absolute",
								top: "50%",
								left: "50%",
								marginTop: -BADGE_W / 2,
								marginLeft: -BADGE_W / 2,
								border: "1px solid rgba(180, 180, 210, 0.35)",
								zIndex: -1,
							}}
							animate={{ scale: [1, 1.18, 1] }}
							transition={{
								duration: 0.45,
								repeat: Infinity,
								repeatDelay: 0.7,
								ease: "easeInOut",
							}}
						/>
						<div id="reco--badge-yearsInRowBadge" />
					</motion.div>
				</div>
			</div>

			{YEARS.map((year) => (
				<Script
					key={year}
					src={`https://widget.reco.se/badge/${year}/4026137.js`}
					strategy="lazyOnload"
				/>
			))}
			<Script
				src="https://widget.reco.se/yearsInRowBadge/4026137.js"
				strategy="lazyOnload"
			/>
		</section>
	);
}
