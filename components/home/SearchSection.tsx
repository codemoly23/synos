"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularSearchTerms = [
	"MOTUS PRO",
	"Soprano",
	"Hårborttagning",
	"Laserbehandling",
];

export function SearchSection() {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = searchValue.trim();
		if (trimmed.length >= 2) {
			router.push(`/?s=${encodeURIComponent(trimmed)}`);
		}
	};

	return (
		<section className="py-12 bg-white sm:border-b sm:border-slate-100">
			<div className="_container ">
				<div className="max-w-4xl mx-auto">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col sm:flex-row gap-4 items-center sm:bg-slate-50 p-2 rounded-full sm:border sm:border-slate-200 sm:shadow-sm sm:focus-within:ring-2 sm:focus-within:ring-primary/20 transition-all"
					>
						<div className="pl-4 text-slate-500 hidden sm:block">
							<Search className="h-5 w-5" />
						</div>
						<Input
							type="text"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							placeholder="Sök produkter, kategorier, artiklar..."
							className="border border-slate-200 sm:border-none sm:border-0 text-wrap bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 text-secondary placeholder:text-slate-500"
						/>
						<Button
							type="submit"
							disabled={searchValue.trim().length < 2}
							className="w-full sm:w-auto rounded-full px-8 h-12 bg-primary hover:bg-primary-hover text-white font-medium"
						>
							Sök
						</Button>
					</form>
					<div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-slate-600">
						<span className="font-medium">Populärt:</span>
						{popularSearchTerms.map((tag) => (
							<Link
								key={tag}
								href={`/?s=${encodeURIComponent(tag)}`}
								className="text-slate-600 hover:text-primary transition-colors underline decoration-dotted underline-offset-2"
							>
								{tag}
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
