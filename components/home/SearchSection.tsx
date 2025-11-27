"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchSection() {
	return (
		<section className="py-12 bg-white sm:border-b sm:border-slate-100">
			<div className="_container ">
				<div className="max-w-4xl mx-auto">
					<div className="flex flex-col sm:flex-row gap-4 items-center sm:bg-slate-50 p-2 rounded-full sm:border sm:border-slate-200 sm:shadow-sm sm:focus-within:ring-2 sm:focus-within:ring-primary/20 transition-all">
						<div className="pl-4 text-slate-500 hidden sm:block">
							<Search className="h-5 w-5" />
						</div>
						<Input
							type="text"
							placeholder="Search for medical equipment, categories, or services..."
							className="border border-slate-200 sm:border-none sm:border-0 text-wrap bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 text-[#0C2C46] placeholder:text-slate-500"
						/>
						<Button className="w-full sm:w-auto rounded-full px-8 h-12 bg-primary hover:bg-primary-hover text-white font-medium">
							Search
						</Button>
					</div>
					<div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-slate-600">
						<span className="font-medium">Popular:</span>
						{[
							"MRI Scanners",
							"Ultrasound",
							"Surgical Robots",
							"Patient Monitors",
						].map((tag) => (
							<button
								key={tag}
								className="text-slate-600 hover:text-primary transition-colors underline decoration-dotted underline-offset-2"
							>
								{tag}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
