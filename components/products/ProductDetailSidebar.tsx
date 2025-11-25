import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Video, Phone, Mail } from "lucide-react";

interface ProductDetailSidebarProps {
	brochureUrl?: string;
	videoUrl?: string;
}

export function ProductDetailSidebar({
	brochureUrl,
	videoUrl,
}: ProductDetailSidebarProps) {
	return (
		<aside className="space-y-6">
			{/* Quick Actions */}
			<Card className="border-border/50 bg-linear-to-br from-primary to-secondary text-primary-foreground">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg font-semibold">
						Intresserad av denna produkt?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-primary-foreground/90">
						Kontakta oss för mer information, demo eller offert.
					</p>
					<div className="space-y-2">
						<Button
							asChild
							className="w-full bg-background text-foreground hover:bg-muted"
						>
							<Link href="/kontakt">
								<Mail className="mr-2 h-4 w-4" />
								Begär offert
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="w-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
						>
							<Link href="tel:+46123456789">
								<Phone className="mr-2 h-4 w-4" />
								Ring oss
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Resources */}
			{(brochureUrl || videoUrl) && (
				<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-base font-semibold text-foreground">
							Resurser
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{brochureUrl && (
							<a
								href={brochureUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 rounded-lg border border-border/50 bg-background p-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted"
							>
								<Download className="h-4 w-4 text-primary" />
								Ladda ner broschyr
							</a>
						)}
						{videoUrl && (
							<a
								href={videoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 rounded-lg border border-border/50 bg-background p-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted"
							>
								<Video className="h-4 w-4 text-primary" />
								Se produktvideo
							</a>
						)}
					</CardContent>
				</Card>
			)}

			{/* Key Features Summary */}
			<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">
						Varför välja Synos?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/20">
							<svg
								className="h-4 w-4 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								MDR-certifierad
							</h4>
							<p className="text-xs text-muted-foreground">
								Certifierad enligt EU-förordningar
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/20">
							<svg
								className="h-4 w-4 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								Utbildning ingår
							</h4>
							<p className="text-xs text-muted-foreground">
								Komplett utbildning vid köp
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/20">
							<svg
								className="h-4 w-4 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">
								Snabb service
							</h4>
							<p className="text-xs text-muted-foreground">
								Reparation inom 48 timmar
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</aside>
	);
}
