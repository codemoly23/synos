"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Send,
	Mail,
	Phone,
	User,
	Loader2,
	CheckCircle2,
	Building,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageComponent } from "@/components/common/image-component";
import { cn } from "@/lib/utils/cn";
import { z } from "zod";

interface ProductInquiryFormProps {
	productName: string;
	productId: string;
	productSlug: string;
	categoryName?: string;
	purchaseTitle?: string;
	purchaseDescription?: string;
	productImage?: string;
	contactPhone?: string;
	contactEmail?: string;
}

const clientFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
	companyName: z.string().min(1, "Klinik / företag är obligatoriskt"),
	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional(),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
	productId: z.string(),
	productName: z.string(),
	productSlug: z.string(),
});

type FormData = z.infer<typeof clientFormSchema>;

const BRAND = "#dba784";
const BRAND_RGB = "219,167,132";

export function ProductInquiryForm({
	productName,
	productId,
	productSlug,
	categoryName,
	purchaseTitle,
	purchaseDescription,
	productImage,
	contactPhone,
	contactEmail,
}: ProductInquiryFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [gdprChecked, setGdprChecked] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(clientFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			companyName: "",
			message: "",
			gdprConsent: undefined as unknown as true,
			productId,
			productName,
			productSlug,
		},
	});

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "product_inquiry",
					...data,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				toast.success("Tack för din förfrågan! Vi återkommer inom 24 timmar.");
				setTimeout(() => setIsSuccess(false), 10000);
			} else {
				if (result.errors && Array.isArray(result.errors)) {
					const fieldErrors = result.errors
						.filter(
							(err: { path?: string[]; message?: string }) =>
								err.path && err.message
						)
						.map((err: { path?: string[]; message?: string }) => err.message)
						.join(", ");
					toast.error(
						fieldErrors || result.message || "Något gick fel. Försök igen."
					);
				} else {
					toast.error(result.message || "Något gick fel. Försök igen.");
				}
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("Något gick fel. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<section
				className="py-16 md:py-24 relative overflow-hidden"
				style={{
					backgroundImage: "url('/images/Product detail breadcrumbs background.jpeg')",
					backgroundSize: "cover",
					backgroundPosition: "left bottom",
				}}
			>
				<div className="_container relative z-10">
					<div
						className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-2xl"
						style={{
							background: "rgb(24,24,27)",
							boxShadow: `0 0 0 2px rgba(${BRAND_RGB},0.4), 0 0 60px rgba(${BRAND_RGB},0.12)`,
						}}
					>
						<div
							className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
							style={{ background: `rgba(${BRAND_RGB},0.1)` }}
						>
							<CheckCircle2 className="h-10 w-10" style={{ color: BRAND }} />
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
							Tack för din förfrågan!
						</h2>
						<p className="text-lg text-zinc-400 mb-6">
							Vi har mottagit din förfrågan gällande {productName} och
							återkommer till dig inom 24 timmar.
						</p>
						<Button
							variant="outline"
							onClick={() => setIsSuccess(false)}
							className="mt-4 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
						>
							Skicka ny förfrågan
						</Button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className="py-16 md:py-24 relative overflow-hidden"
			style={{
				backgroundImage: "url('/images/Product detail breadcrumbs background.jpeg')",
				backgroundSize: "cover",
				backgroundPosition: "left bottom",
			}}
		>
			<div className="_container relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

					{/* Left — Info */}
					<div className="space-y-8">
						<div className="space-y-4">
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
								{purchaseTitle || `Intresserad av ${productName}?`}
							</h2>
							<div className="w-10 h-0.5" style={{ background: BRAND }} />
							{purchaseDescription ? (
								<div
									className="text-zinc-400 text-lg leading-relaxed [&_p]:mb-2 [&_strong]:text-zinc-200"
									dangerouslySetInnerHTML={{ __html: purchaseDescription }}
								/>
							) : (
								<p className="text-zinc-400 text-lg leading-relaxed">
									Kontakta oss idag för en kostnadsfri konsultation och
									upptäck hur vi kan hjälpa dig att nå dina mål.
								</p>
							)}
						</div>

						<div className="space-y-6">
							{(contactPhone || categoryName) && (
								<a
									href={`tel:${(contactPhone || "").replace(/[\s-]/g, "")}`}
									className="flex items-start gap-4 group"
								>
									<div
										className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
										style={{
											border: `1.5px solid rgba(${BRAND_RGB},0.45)`,
											color: BRAND,
										}}
									>
										<Phone className="h-5 w-5" />
									</div>
									<div>
										<h4 className="text-base font-bold text-white">Ring oss</h4>
										<p className="text-zinc-400 text-sm">
											Vi finns tillgängliga för att hjälpa dig
										</p>
										{contactPhone && (
											<span
												className="font-semibold mt-1 block group-hover:underline"
												style={{ color: BRAND }}
											>
												{contactPhone}
											</span>
										)}
									</div>
								</a>
							)}

							{contactEmail && (
								<a
									href={`mailto:${contactEmail}`}
									className="flex items-start gap-4 group"
								>
									<div
										className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
										style={{
											border: `1.5px solid rgba(${BRAND_RGB},0.45)`,
											color: BRAND,
										}}
									>
										<Mail className="h-5 w-5" />
									</div>
									<div>
										<h4 className="text-base font-bold text-white">Maila oss</h4>
										<p className="text-zinc-400 text-sm">
											Skicka oss ett meddelande
										</p>
										<span
											className="font-medium mt-1 block group-hover:underline"
											style={{ color: BRAND }}
										>
											{contactEmail}
										</span>
									</div>
								</a>
							)}
						</div>

						{productImage && (
							<div className="relative mt-4 hidden lg:block">
								<div
									className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[40%] rounded-[50%] pointer-events-none z-0"
									style={{ boxShadow: `0 0 100px 40px rgba(${BRAND_RGB},0.28)` }}
								/>
								<ImageComponent
									src={productImage}
									alt={productName}
									width={0}
									height={0}
									sizes="(max-width: 1024px) 0vw, 45vw"
									className="w-full h-auto object-contain max-h-[380px] mix-blend-multiply"
									wrapperClasses="w-full relative z-10"
								/>
							</div>
						)}
					</div>

					{/* Right — Form Card */}
<div className="relative min-w-0 rounded-[24px] p-[2px] overflow-hidden">

	{/* ───────────────── CINEMATIC LIGHT SYSTEM ───────────────── */}
	<div className="absolute inset-0 rounded-[24px] pointer-events-none">

		{/* BASE LIGHT FIELD */}
		<div
			className="absolute inset-0 rounded-[24px]"
			style={{
				background: `
					linear-gradient(
						135deg,
						rgba(${BRAND_RGB},0.14) 0%,
						rgba(${BRAND_RGB},0.06) 30%,
						rgba(${BRAND_RGB},0.02) 65%,
						transparent 100%
					)
				`,
			}}
		/>

		{/* LEFT LIGHT SOURCE */}
		<div
			className="absolute left-0 top-0 w-[200px] h-[60%]"
			style={{
				background: `
					radial-gradient(
						ellipse at top left,
						rgba(${BRAND_RGB},0.92) 0%,
						rgba(${BRAND_RGB},0.48) 20%,
						rgba(${BRAND_RGB},0.20) 45%,
						rgba(${BRAND_RGB},0.06) 70%,
						transparent 100%
					)
				`,
				transform: "translate(-38%, -5%)",
				filter: `
					blur(44px)
					drop-shadow(0 0 40px rgba(${BRAND_RGB},0.30))
					drop-shadow(0 0 90px rgba(${BRAND_RGB},0.14))
				`,
			}}
		/>

		{/* LEFT BORDER — TOP ORIGIN ENERGY STRIP */}
<div
	className="absolute left-0 top-0 h-full w-[10px]"
	style={{
		background: `
			linear-gradient(
				to bottom,

				rgba(${BRAND_RGB},1)    0%,
				rgba(${BRAND_RGB},0.82) 8%,
				rgba(${BRAND_RGB},0.55) 20%,
				rgba(${BRAND_RGB},0.30) 38%,
				rgba(${BRAND_RGB},0.12) 58%,
				rgba(${BRAND_RGB},0.04) 78%,

				transparent 100%
			)
		`,

		filter: `
			blur(20px)
			drop-shadow(0 0 80px rgba(${BRAND_RGB},0.65))
			drop-shadow(0 0 160px rgba(${BRAND_RGB},0.30))
		`,

		opacity: 0.95,
		pointerEvents: "none",
	}}
/>

		{/* SOFT LEFT HAZE */}
		<div
			className="absolute left-0 top-0 h-[65%] w-[28px]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						rgba(${BRAND_RGB},0.35) 0%,
						rgba(${BRAND_RGB},0.22) 30%,
						rgba(${BRAND_RGB},0.08) 65%,
						transparent 100%
					)
				`,
				filter: "blur(18px)",
				opacity: 0.75,
			}}
		/>

		{/* INNER WHITE SPECULAR */}
		<div
			className="absolute left-[1px] top-0 h-[55%] w-[1px]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						rgba(255,255,255,0.75) 0%,
						rgba(255,255,255,0.40) 20%,
						rgba(255,255,255,0.12) 55%,
						transparent 100%
					)
				`,
				opacity: 0.70,
				filter: "blur(0.3px)",
			}}
		/>

		{/* TOP FADE (NOW CONNECTED TO MID LIGHT) */}
		<div
			className="absolute top-0 right-0 w-[3px] h-[45%]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						rgba(${BRAND_RGB},0.12) 0%,
						rgba(${BRAND_RGB},0.35) 40%,
						rgba(${BRAND_RGB},0.75) 70%,
						rgba(${BRAND_RGB},0.95) 100%
					)
				`,
				filter: "blur(1.2px)",
			}}
		/>

		
{/* RIGHT BORDER — TRUE MID-ORIGIN ENERGY STRIP */}
<div
	className="absolute right-0 top-0 h-full w-[10px]"
	style={{
		background: `
			linear-gradient(
				to bottom,

				transparent 0%,

				rgba(${BRAND_RGB},0.15) 20%,
				rgba(${BRAND_RGB},0.45) 35%,

				rgba(${BRAND_RGB},1) 50%,

				rgba(${BRAND_RGB},0.45) 65%,
				rgba(${BRAND_RGB},0.15) 80%,

				transparent 100%
			)
		`,

		filter: `
			blur(22px)
			drop-shadow(0 0 80px rgba(${BRAND_RGB},0.75))
			drop-shadow(0 0 160px rgba(${BRAND_RGB},0.35))
		`,

		opacity: 0.95,
		pointerEvents: "none",
	}}
/>

		{/* BOTTOM FADE (SOFT CONTINUATION, NOT SEPARATE) */}
		<div
			className="absolute bottom-0 right-0 w-[3px] h-[45%]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						rgba(${BRAND_RGB},0.35) 0%,
						rgba(${BRAND_RGB},0.15) 50%,
						transparent 100%
					)
				`,
				filter: "blur(1.4px)",
			}}
		/>

		{/* GLOBAL RIGHT EDGE GLOW FIELD (CONNECTS EVERYTHING) */}
		<div
			className="absolute right-0 top-0 w-[40px] h-full"
			style={{
				background: `
					linear-gradient(
						to left,
						rgba(${BRAND_RGB},0.25),
						rgba(${BRAND_RGB},0.10),
						transparent
					)
				`,
				filter: "blur(24px)",
				opacity: 0.8,
			}}
		/>

		{/* OUTER GLOW FIELD */}
		<div
			className="absolute -left-12 -top-12 w-44 h-44 rounded-full"
			style={{
				background: `rgba(${BRAND_RGB},0.20)`,
				filter: `
					blur(60px)
					drop-shadow(0 0 90px rgba(${BRAND_RGB},0.18))
				`,
			}}
		/>
	</div>

	{/* ───────────────── FORM ───────────────── */}
	<form
		onSubmit={handleSubmit(onSubmit)}
		className="relative rounded-[22.5px] overflow-hidden border border-white/[0.04] bg-zinc-950/96 backdrop-blur-xl"
		style={{
			transform: "translateZ(0)",
			boxShadow: `
				inset 0 1px 0 rgba(255,255,255,0.03),
				0 16px 55px rgba(0,0,0,0.55)
			`,
		}}
	>

		{/* HEADER */}
		<div className="px-6 py-5">
			<div className="flex items-center gap-2 mb-1.5">
				<span
					className="w-2 h-2 rounded-full"
					style={{
						background: BRAND,
						boxShadow: `0 0 14px rgba(${BRAND_RGB},0.6)`,
					}}
				/>
				<span
					className="text-xs font-medium uppercase tracking-widest"
					style={{
						color: BRAND,
						textShadow: `0 0 16px rgba(${BRAND_RGB},0.25)`,
					}}
				>
					{productName.toUpperCase()} DEMO
				</span>
			</div>

			<p className="text-white font-semibold text-base">
				Fyll i dina uppgifter så kontaktar vi dig
			</p>
		</div>

		{/* BODY */}
		<div className="p-6 space-y-4">

			<div className="space-y-1.5">
				<Label className="text-sm font-semibold text-zinc-200">
					Namn <span className="text-red-400">*</span>
				</Label>
				<div className="relative">
					<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
					<Input {...register("fullName")} className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-sm font-semibold text-zinc-200">E-post *</Label>
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
					<Input {...register("email")} className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-sm font-semibold text-zinc-200">Telefon *</Label>
				<div className="relative">
					<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
					<Input {...register("phone")} className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-sm font-semibold text-zinc-200">Klinik / företag *</Label>
				<div className="relative">
					<Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
					<Input {...register("companyName")} className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-sm font-semibold text-zinc-200">Meddelande</Label>
				<Textarea {...register("message")} className="min-h-[90px] bg-zinc-950 border-zinc-800 text-white" />
			</div>

			<button
				type="submit"
				className="w-full h-12 rounded-md font-semibold text-black"
				style={{
					background: BRAND,
					boxShadow: `0 0 26px rgba(${BRAND_RGB},0.25)`,
				}}
			>
				Skicka förfrågan
			</button>

		</div>
	</form>
</div>

				</div>
			</div>
		</section>
	);
}
