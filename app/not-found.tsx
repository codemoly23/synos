import Link from "next/link";
import { custom404PageService } from "@/lib/services/custom-404-page.service";
import { NotFoundLogger } from "@/components/not-found-logger";

/**
 * 404 Not Found Page
 *
 * Dynamic server component that loads CMS content from the database.
 * Falls back to hardcoded defaults if the DB fetch fails.
 * Keeps inline styles so the page renders even if CSS bundle fails.
 */
interface NotFoundData {
	hero: {
		title: string;
		subtitle: string;
		description: string;
		backgroundStyle: "gradient" | "solid" | "image";
		backgroundImage?: string;
		backgroundColor?: string;
	};
	cta: {
		primaryButtonText: string;
		primaryButtonHref: string;
		secondaryButtonText: string;
		secondaryButtonHref: string;
	};
	suggestedPages: Array<{
		label?: string;
		href?: string;
		description?: string;
	}>;
	sectionVisibility: {
		hero: boolean;
		suggestedPages: boolean;
		cta: boolean;
	};
}

export default async function NotFound() {
	const defaults: NotFoundData = {
		hero: {
			title: "404",
			subtitle: "Sidan kunde inte hittas",
			description: "Tyvärr kunde vi inte hitta sidan du letar efter.",
			backgroundStyle: "gradient",
		},
		cta: {
			primaryButtonText: "Tillbaka till startsidan",
			primaryButtonHref: "/",
			secondaryButtonText: "Kontakta oss",
			secondaryButtonHref: "/kontakt",
		},
		suggestedPages: [],
		sectionVisibility: {
			hero: true,
			suggestedPages: true,
			cta: true,
		},
	};

	let data: NotFoundData = defaults;
	try {
		const page = await custom404PageService.getCustom404Page();
		if (page) {
			data = {
				hero: {
					...defaults.hero,
					...page.hero,
					backgroundStyle:
						(page.hero?.backgroundStyle as NotFoundData["hero"]["backgroundStyle"]) ||
						"gradient",
				},
				cta: { ...defaults.cta, ...page.cta },
				suggestedPages: page.suggestedPages || [],
				sectionVisibility: {
					...defaults.sectionVisibility,
					...page.sectionVisibility,
				},
			};
		}
	} catch {
		// Use defaults if DB is unavailable
	}

	const { hero, cta, suggestedPages, sectionVisibility } = data;

	// Determine background style
	let backgroundStyle: string;
	if (hero.backgroundStyle === "image" && hero.backgroundImage) {
		backgroundStyle = `url(${hero.backgroundImage}) center/cover no-repeat`;
	} else if (hero.backgroundStyle === "solid" && hero.backgroundColor) {
		backgroundStyle = hero.backgroundColor;
	} else {
		backgroundStyle =
			"linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ccfbf1 100%)";
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "48px 16px",
				background: backgroundStyle,
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<NotFoundLogger />
			<div style={{ maxWidth: "600px", textAlign: "center" }}>
				{sectionVisibility.hero && (
					<>
						<h1
							style={{
								fontSize: "144px",
								fontWeight: 900,
								background:
									"linear-gradient(135deg, rgba(12, 44, 70, 0.15) 0%, rgba(0, 148, 158, 0.15) 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
								margin: "0 0 16px 0",
								lineHeight: 1,
							}}
						>
							{hero.title}
						</h1>

						<div
							style={{
								background: "rgba(255, 255, 255, 0.8)",
								borderRadius: "24px",
								padding: "48px",
								boxShadow:
									"0 20px 60px rgba(0, 148, 158, 0.1)",
							}}
						>
							<h2
								style={{
									fontSize: "32px",
									fontWeight: 800,
									color: "#0C2C46",
									margin: "0 0 16px 0",
								}}
							>
								{hero.subtitle}
							</h2>

							{hero.description && (
								<p
									style={{
										fontSize: "18px",
										color: "rgba(12, 44, 70, 0.75)",
										margin: "0 0 32px 0",
										lineHeight: 1.6,
									}}
								>
									{hero.description}
								</p>
							)}

							{/* Suggested Pages */}
							{sectionVisibility.suggestedPages &&
								suggestedPages.length > 0 && (
									<div
										style={{
											margin: "0 0 32px 0",
											textAlign: "left",
										}}
									>
										<p
											style={{
												fontSize: "14px",
												fontWeight: 600,
												color: "#0C2C46",
												margin: "0 0 12px 0",
												textTransform: "uppercase",
												letterSpacing: "0.05em",
											}}
										>
											Föreslagna sidor
										</p>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "8px",
											}}
										>
											{suggestedPages.map(
												(page, index) => (
													<Link
														key={index}
														href={
															page.href || "/"
														}
														style={{
															display: "block",
															padding: "12px 16px",
															background:
																"rgba(0, 148, 158, 0.05)",
															borderRadius:
																"12px",
															textDecoration:
																"none",
															color: "#00949E",
															fontWeight: 600,
															fontSize: "14px",
														}}
													>
														{page.label}
														{page.description && (
															<span
																style={{
																	display:
																		"block",
																	color: "rgba(12, 44, 70, 0.6)",
																	fontWeight: 400,
																	fontSize:
																		"13px",
																	marginTop:
																		"2px",
																}}
															>
																{
																	page.description
																}
															</span>
														)}
													</Link>
												)
											)}
										</div>
									</div>
								)}

							{/* CTA Buttons */}
							{sectionVisibility.cta && (
								<div
									style={{
										display: "flex",
										gap: "16px",
										justifyContent: "center",
										flexWrap: "wrap",
									}}
								>
									{cta.primaryButtonText &&
										cta.primaryButtonHref && (
											<Link
												href={cta.primaryButtonHref}
												style={{
													padding: "16px 32px",
													background:
														"linear-gradient(135deg, #00949E 0%, #007A82 100%)",
													color: "white",
													borderRadius: "9999px",
													fontWeight: 700,
													fontSize: "16px",
													textDecoration: "none",
												}}
											>
												{cta.primaryButtonText}
											</Link>
										)}
									{cta.secondaryButtonText &&
										cta.secondaryButtonHref && (
											<Link
												href={cta.secondaryButtonHref}
												style={{
													padding: "16px 32px",
													background: "white",
													color: "#0C2C46",
													border: "2px solid rgba(12, 44, 70, 0.2)",
													borderRadius: "9999px",
													fontWeight: 700,
													fontSize: "16px",
													textDecoration: "none",
												}}
											>
												{cta.secondaryButtonText}
											</Link>
										)}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
