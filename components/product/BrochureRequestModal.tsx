"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { FileText, CheckCircle, Loader2 } from "lucide-react";

interface BrochureRequestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	productName: string;
	productSlug: string;
	documentTitle?: string;
}

export function BrochureRequestModal({
	open,
	onOpenChange,
	productName,
	productSlug,
	documentTitle,
}: BrochureRequestModalProps) {
	const [form, setForm] = useState({
		companyName: "",
		firstName: "",
		lastName: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/brochure-request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...form,
					productName,
					productSlug,
					documentTitle,
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Something went wrong");
			}

			setSuccess(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not send request");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = (val: boolean) => {
		if (!val) {
			setSuccess(false);
			setForm({ companyName: "", firstName: "", lastName: "", email: "" });
			setError("");
		}
		onOpenChange(val);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-1">
						<FileText className="h-5 w-5 text-primary" />
						<DialogTitle className="text-lg font-semibold">
							Begär broschyr
						</DialogTitle>
					</div>
					<DialogDescription className="text-sm text-muted-foreground">
						Fyll i dina uppgifter så kontaktar vi dig med broschyren för{" "}
						<span className="font-medium text-foreground">{productName}</span>.
					</DialogDescription>
				</DialogHeader>

				{success ? (
					<div className="flex flex-col items-center gap-3 py-6 text-center">
						<CheckCircle className="h-12 w-12 text-green-500" />
						<h3 className="text-base font-semibold text-foreground">
							Tack för din förfrågan!
						</h3>
						<p className="text-sm text-muted-foreground max-w-xs">
							Vi har mottagit din förfrågan och återkommer till dig med broschyren via e-post.
						</p>
						<Button variant="outline" size="sm" onClick={() => handleClose(false)}>
							Stäng
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-3 pt-1">
						<div>
							<label className="block text-sm font-medium text-foreground mb-1">
								Företag *
							</label>
							<input
								name="companyName"
								value={form.companyName}
								onChange={handleChange}
								required
								placeholder="Ditt företagsnamn"
								className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Förnamn *
								</label>
								<input
									name="firstName"
									value={form.firstName}
									onChange={handleChange}
									required
									placeholder="Förnamn"
									className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-1">
									Efternamn *
								</label>
								<input
									name="lastName"
									value={form.lastName}
									onChange={handleChange}
									required
									placeholder="Efternamn"
									className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-1">
								E-post *
							</label>
							<input
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								required
								placeholder="din@email.se"
								className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>

						{error && (
							<p className="text-sm text-red-500">{error}</p>
						)}

						<div className="flex gap-2 pt-1">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={() => handleClose(false)}
								disabled={loading}
							>
								Avbryt
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-primary text-primary-foreground"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Skickar...
									</>
								) : (
									"Skicka förfrågan"
								)}
							</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
