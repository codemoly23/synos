import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Download,
	Video,
	Phone,
	Mail,
	Check,
	BookOpen,
	Ligature,
	Zap,
} from "lucide-react";

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
			<Card className="border-primary/50 bg-linear-to-br from-primary to-secondary text-primary-foreground">
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
							className="w-full bg-background text-foreground flex items-center justify-center hover:bg-slate-50 gap-5 border hover:border-primary border-transparent hover:text-primary"
						>
							<Link href="/kontakt">
								<Mail className="h-4 w-4" />
								Begär offert
							</Link>
						</Button>
						<Link href="tel:+46123456789">
							<Button
								variant="outline"
								className="w-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground gap-5 flex flex-rowitems-center justify-center hover:bg-primary/20"
							>
								<Phone className="h-4 w-4" />
								Ring oss
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>

			{/* Resources */}
			{(brochureUrl || videoUrl) && (
				<Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
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
								className="flex items-center gap-3 rounded-lg border border-primary/50 bg-background p-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted"
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
								className="flex items-center gap-3 rounded-lg border border-primary/50 bg-background p-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted"
							>
								<Video className="h-4 w-4 text-primary" />
								Se produktvideo
							</a>
						)}
					</CardContent>
				</Card>
			)}

			{/* Key Features Summary */}
			<Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold text-foreground">
						Varför välja Synos?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
							<Check className="h-4 w-4 text-white" />
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
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
							<BookOpen className="h-4 w-4 text-white" />
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
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
							<Zap className="h-4 w-4 text-white" />
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
