import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
	title: "Tack för din förfrågan | Synos Medical",
	description: "Vi har mottagit din förfrågan och återkommer till dig inom 24 timmar.",
	robots: { index: false, follow: false },
};

const BRAND = "#e0bca6";
const BRAND_RGB = "224,188,166";

export default function TackPage() {
	return (
		<section
			className="min-h-[80vh] flex items-center justify-center px-4 py-24"
			style={{ background: "linear-gradient(135deg, #0f0f11 0%, #18181b 60%, #1c1a1f 100%)" }}
		>
			<div className="max-w-lg w-full text-center space-y-7">
				{/* Icon */}
				<div className="flex justify-center">
					<div
						className="h-20 w-20 rounded-full flex items-center justify-center"
						style={{
							background: `rgba(${BRAND_RGB},0.1)`,
							boxShadow: `0 0 0 1px rgba(${BRAND_RGB},0.25), 0 0 40px rgba(${BRAND_RGB},0.12)`,
						}}
					>
						<CheckCircle2 className="h-10 w-10" style={{ color: BRAND }} />
					</div>
				</div>

				{/* Heading */}
				<div className="space-y-3">
					<p
						className="text-xs font-semibold uppercase tracking-widest"
						style={{ color: BRAND }}
					>
						Synos Medical
					</p>
					<h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
						Tack för din förfrågan!
					</h1>
				</div>

				{/* Divider */}
				<div
					className="w-12 h-0.5 mx-auto"
					style={{ background: `rgba(${BRAND_RGB},0.5)` }}
				/>

				{/* Body */}
				<p className="text-zinc-400 text-lg leading-relaxed">
					Vi har mottagit din förfrågan och återkommer till dig inom{" "}
					<span className="text-zinc-200 font-medium">24 timmar</span>.
				</p>

				{/* CTA */}
				<div className="pt-2">
					<Link
						href="/"
						className="inline-flex items-center justify-center h-11 px-8 rounded-md font-semibold text-white btn-copper-gradient"
						style={{ boxShadow: `0 0 24px rgba(${BRAND_RGB},0.2)` }}
					>
						Tillbaka till startsidan
					</Link>
				</div>
			</div>
		</section>
	);
}
