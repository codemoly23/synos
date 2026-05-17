"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Phone,
	FileText,
	Check,
	Shield,
} from "lucide-react";
import { motion } from "framer-motion";

interface ProductDetailSidebarProps {
	certifications?: string[] | null;
	onScrollToForm?: () => void;
}

export function ProductDetailSidebar({
	certifications,
	onScrollToForm,
}: ProductDetailSidebarProps) {
	return (
		<aside className="space-y-4">
			{/* Quick Actions - Primary CTA */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<Card className="border-0 bg-linear-to-br from-primary via-primary to-secondary text-primary-foreground shadow-lg shadow-primary/15 overflow-hidden relative">
					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

					<CardHeader className="pb-1.5 pt-4 px-4 relative">
						<CardTitle className="text-base font-bold">
							Intresserad av denna produkt?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 px-4 pb-4 relative">
						<p className="text-xs text-primary-foreground/85">
							Kontakta oss för mer information, demo eller offert.
						</p>
						<div className="space-y-2">
							<Button
								size="sm"
								onClick={onScrollToForm}
								className="w-full bg-zinc-950 border border-primary/70 text-primary font-semibold flex items-center justify-center hover:bg-zinc-900 hover:text-primary hover:border-primary gap-2 rounded-full h-11 text-sm transition-all duration-200"
							>
								<FileText className="h-4 w-4" />
								Begär offert
							</Button>
							<Button
								asChild
								variant="outline"
								size="sm"
								className="w-full border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 gap-2 flex items-center justify-center transition-all duration-200 h-9 text-sm"
							>
								<Link href="tel:+46102051501">
									<Phone className="h-4 w-4" />
									Ring oss
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Certifications */}
			{certifications && certifications.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					<Card className="border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
						<CardHeader className="pb-2 pt-3 px-4">
							<CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
								<div className="h-6 w-6 rounded-md bg-emerald-100 flex items-center justify-center">
									<Shield className="h-3.5 w-3.5 text-emerald-600" />
								</div>
								Certifieringar
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0 px-4 pb-3">
							<div className="flex flex-wrap gap-1.5">
								{certifications.map((cert, index) => (
									<div
										key={index}
										className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-linear-to-r from-emerald-50 to-emerald-100/80 border border-emerald-200/60 text-emerald-700 text-xs font-medium"
									>
										<Check className="h-3 w-3" />
										{cert}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</aside>
	);
}
