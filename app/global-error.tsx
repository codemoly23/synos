"use client";

import { useEffect } from "react";
import { Home, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";

/**
 * Global Error Boundary Page
 *
 * Fallback error page for errors in the root layout.
 * This wraps the entire application and is used when the root layout itself fails.
 * Must include its own <html> and <body> tags.
 *
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error object
 * @param {() => void} props.reset - Function to reset the error boundary
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Global application error:", error);
	}, [error]);

	return (
		<html lang="sv">
			<body>
				<main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12 overflow-hidden relative">
					{/* Decorative background elements */}
					<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
					<div
						className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"
						style={{ backgroundColor: "#0C2C46" }}
					/>

					<div className="max-w-3xl mx-auto text-center relative z-10">
						<div className="space-y-8">
							{/* Icon */}
							<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
								<XCircle className="h-12 w-12 text-teal-600" />
							</div>

							{/* Error Code */}
							<div>
								<h1 className="text-8xl md:text-9xl font-black text-gray-900/20 select-none tracking-tight mb-4">
									500
								</h1>
							</div>

							{/* Glass Card with Content */}
							<div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl">
								<h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
									Kritiskt fel
								</h2>
								<p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium mb-8">
									Ett allvarligt fel har inträffat. Vi arbetar på att
									lösa problemet. Försök ladda om sidan.
								</p>

								{/* Error Details (Development only) */}
								{process.env.NODE_ENV === "development" &&
									error.message && (
										<div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg text-left">
											<p className="text-sm font-bold text-red-800 mb-2">
												Error Details (Development):
											</p>
											<p className="text-xs text-red-700 font-mono break-all">
												{error.message}
											</p>
											{error.digest && (
												<p className="text-xs text-red-600 font-mono mt-2">
													Digest: {error.digest}
												</p>
											)}
										</div>
									)}

								{/* Action Buttons */}
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<button
										onClick={reset}
										className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
										aria-label="Try again"
									>
										<RefreshCw className="h-5 w-5" />
										Försök igen
									</button>
									<Link
										href="/"
										className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 hover:bg-white text-gray-900 border-2 border-gray-900/20 hover:border-gray-900/40 font-bold rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
									>
										<Home className="h-5 w-5" />
										Tillbaka till startsidan
									</Link>
								</div>
							</div>

							{/* Support Information */}
							<div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
								<p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
									Behöver du hjälp?
								</p>
								<p className="text-sm text-gray-700 font-medium mb-4">
									Om problemet kvarstår, kontakta vår support så
									hjälper vi dig.
								</p>
								<a
									href="/kontakt"
									className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
								>
									Kontakta support →
								</a>
							</div>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
