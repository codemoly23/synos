"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { technologyMap } from "@/config/technology-map";

export const staticCategories = [
	{ name: "Permanent Hårborttagning", href: "/klinikutrustning/harborttagning" },
	{ name: "Tatueringsborttagning", href: "/klinikutrustning/tatueringsborttagning" },
	{ name: "Hudföryngring", href: "/klinikutrustning/hudforyngring" },
	{ name: "Skin Resurfacing", href: "/klinikutrustning/co2laser" },
	{ name: "Huduppstramning", href: "/klinikutrustning/hudforyngring" },
	{ name: "Pigmentbehandling", href: "/klinikutrustning/pigmentflackar" },
	{ name: "Kärlbehandling", href: "/klinikutrustning/ytliga-blodkarl-angiom" },
	{ name: "Akne & Ärrbehandling", href: "/klinikutrustning/akne-arr-och-hudbristningar" },
	{ name: "Hudbristningar", href: "/klinikutrustning/akne-arr-och-hudbristningar" },
	{ name: "Kroppsformning & Fettbehandling", href: "/klinikutrustning/kropp-muskler-fett" },
	{ name: "Muskeltoning", href: "/klinikutrustning/kropp-muskler-fett" },
	{ name: "Cellulitbehandling", href: "/klinikutrustning/kropp-muskler-fett" },
];

const MOBILE_VISIBLE_COUNT = 4;

const pillBase =
	"flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200 whitespace-nowrap cursor-pointer";
const pillIdle =
	"bg-white text-secondary border-slate-200 hover:border-primary hover:bg-primary/5";
const pillActive = "bg-primary text-white border-primary hover:bg-primary/90";

interface Props {
	selectedCategoryHref: string | null;
	selectedTech: string | null;
	onSelectCategory: (href: string | null) => void;
	onSelectTech: (name: string | null) => void;
}

export function CategoryFilterBar({
	selectedCategoryHref,
	selectedTech,
	onSelectCategory,
	onSelectTech,
}: Props) {
	const [showAllCat, setShowAllCat] = useState(false);
	const [showAllTech, setShowAllTech] = useState(false);

	const catsMobile = showAllCat
		? staticCategories
		: staticCategories.slice(0, MOBILE_VISIBLE_COUNT);
	const techsMobile = showAllTech
		? technologyMap
		: technologyMap.slice(0, MOBILE_VISIBLE_COUNT);
	const catHasMore = staticCategories.length > MOBILE_VISIBLE_COUNT;
	const techHasMore = technologyMap.length > MOBILE_VISIBLE_COUNT;

	const renderCategoryPill = (cat: (typeof staticCategories)[number]) => {
		const isActive = selectedCategoryHref === cat.href;
		return (
			<button
				key={cat.name}
				type="button"
				onClick={() => onSelectCategory(isActive ? null : cat.href)}
				className={cn(pillBase, isActive ? pillActive : pillIdle)}
			>
				{cat.name}
			</button>
		);
	};

	const renderTechPill = (tech: (typeof technologyMap)[number]) => {
		const isActive = selectedTech === tech.name;
		return (
			<button
				key={tech.name}
				type="button"
				onClick={() => onSelectTech(isActive ? null : tech.name)}
				className={cn(pillBase, isActive ? pillActive : pillIdle)}
			>
				{tech.name}
			</button>
		);
	};

	const renderAllCategoryPill = () => (
		<button
			type="button"
			onClick={() => onSelectCategory(null)}
			className={cn(
				pillBase,
				selectedCategoryHref === null ? pillActive : pillIdle
			)}
		>
			Alla produkter
		</button>
	);

	const renderAllTechPill = () => (
		<button
			type="button"
			onClick={() => onSelectTech(null)}
			className={cn(
				pillBase,
				selectedTech === null ? pillActive : pillIdle
			)}
		>
			Alla Teknologier
		</button>
	);

	const renderShowAllToggle = (
		show: boolean,
		toggle: () => void,
		total: number
	) => (
		<button
			type="button"
			onClick={toggle}
			className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full border border-primary text-primary bg-primary/5 whitespace-nowrap transition-all duration-200"
		>
			{show ? "Visa färre" : `Se alla (${total})`}
			<ChevronDown
				className={cn(
					"h-3.5 w-3.5 transition-transform duration-200",
					show && "rotate-180"
				)}
			/>
		</button>
	);

	return (
		<div className="mb-6 space-y-5">
			{/* Behandlingskategorier */}
			<div>
				<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
					Behandlingskategorier
				</h3>
				<div className="hidden sm:flex flex-wrap gap-3">
					{renderAllCategoryPill()}
					{staticCategories.map(renderCategoryPill)}
				</div>
				<div className="flex sm:hidden flex-wrap gap-3">
					{renderAllCategoryPill()}
					{catsMobile.map(renderCategoryPill)}
					{catHasMore &&
						renderShowAllToggle(
							showAllCat,
							() => setShowAllCat((p) => !p),
							staticCategories.length
						)}
				</div>
			</div>

			{/* Technology Category */}
			<div>
				<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
					Technology Category
				</h3>
				<div className="hidden sm:flex flex-wrap gap-3">
					{renderAllTechPill()}
					{technologyMap.map(renderTechPill)}
				</div>
				<div className="flex sm:hidden flex-wrap gap-3">
					{renderAllTechPill()}
					{techsMobile.map(renderTechPill)}
					{techHasMore &&
						renderShowAllToggle(
							showAllTech,
							() => setShowAllTech((p) => !p),
							technologyMap.length
						)}
				</div>
			</div>
		</div>
	);
}
