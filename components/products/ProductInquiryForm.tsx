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
	/** Product context — when omitted, the form runs in generic "contact" mode */
	productName?: string;
	productId?: string;
	productSlug?: string;
	categoryName?: string;
	/** Heading shown above the form (left column). Falls back per mode. */
	purchaseTitle?: string;
	/** Rich-HTML description shown under the heading. */
	purchaseDescription?: string;
	/** Image rendered below the contact details (left column). */
	productImage?: string;
	contactPhone?: string;
	contactEmail?: string;
	/** Override the small pill label above the form (e.g. "SYNOS MEDICAL"). */
	pillLabel?: string;
}

const clientFormSchema = z.object({
	firstName: z
		.string()
		.min(1, "Förnamn är obligatoriskt")
		.max(50, "Förnamn får inte överstiga 50 tecken"),
	lastName: z
		.string()
		.min(1, "Efternamn är obligatoriskt")
		.max(50, "Efternamn får inte överstiga 50 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
	companyName: z.string().min(1, "Org. nummer är obligatoriskt"),
	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional(),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
	productId: z.string().optional(),
	productName: z.string().optional(),
	productSlug: z.string().optional(),
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
	pillLabel,
}: ProductInquiryFormProps) {
	// "generic" = no product context (used on listing/category pages)
	const isGeneric = !productId;
	const resolvedPillLabel =
		pillLabel ?? (productName ? `${productName.toUpperCase()} DEMO` : "SYNOS MEDICAL");
	const resolvedTitle =
		purchaseTitle ||
		(productName ? `Intresserad av ${productName}?` : "Kontakta oss");
	const successContext = productName || "din förfrågan";
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
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			companyName: "",
			message: "",
			gdprConsent: undefined as unknown as true,
			productId: productId ?? "",
			productName: productName ?? "",
			productSlug: productSlug ?? "",
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
					type: isGeneric ? "contact" : "product_inquiry",
					...data,
					fullName: `${data.firstName} ${data.lastName}`.trim(),
					subject: isGeneric
						? categoryName
							? `Förfrågan: ${categoryName}`
							: "Allmän förfrågan"
						: undefined,
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
							Vi har mottagit {successContext} och
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
								{resolvedTitle}
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
									alt={productName ?? "Synos Medical"}
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

	{/* ───────────────── REFINED CINEMATIC LIGHT SYSTEM ───────────────── */}
	<div className="absolute inset-0 rounded-[24px] pointer-events-none">

		{/* BASE LIGHT FIELD */}
		<div
			className="absolute inset-0 rounded-[24px]"
			style={{
				background: `
					linear-gradient(
						135deg,
						rgba(${BRAND_RGB},0.10) 0%,
						rgba(${BRAND_RGB},0.04) 30%,
						rgba(${BRAND_RGB},0.01) 65%,
						transparent 100%
					)
				`,
			}}
		/>

		{/* TOP-LEFT CORNER WARM GLOW BLOOM */}
		<div
			className="absolute left-0 top-0 w-[120px] h-[60%]"
			style={{
				background: `
					radial-gradient(
						ellipse 52% 95% at 0% 25%,
						rgba(${BRAND_RGB},0.95) 0%,
						rgba(${BRAND_RGB},0.85) 12%,
						rgba(${BRAND_RGB},0.65) 28%,
						rgba(${BRAND_RGB},0.40) 48%,
						rgba(${BRAND_RGB},0.18) 70%,
						rgba(${BRAND_RGB},0.04) 88%,
						transparent 100%
					)
				`,
				transform: "translate(-20%, 0)",
				filter: `
					blur(28px)
					drop-shadow(0 0 48px rgba(${BRAND_RGB},0.70))
					drop-shadow(0 0 100px rgba(${BRAND_RGB},0.35))
					drop-shadow(0 0 160px rgba(${BRAND_RGB},0.15))
				`,
			}}
		/>

		{/* TIGHT TOP-LEFT CORE ACCENT */}
		<div
			className="absolute left-0 top-0 w-[50px] h-[28%]"
			style={{
				background: `
					radial-gradient(
						ellipse 38% 98% at 0% 6%,
						rgba(${BRAND_RGB},0.98) 0%,
						rgba(${BRAND_RGB},0.88) 20%,
						rgba(${BRAND_RGB},0.50) 48%,
						rgba(${BRAND_RGB},0.18) 76%,
						transparent 100%
					)
				`,
				transform: "translate(-10%, 0)",
				filter: `
					blur(14px)
					drop-shadow(0 0 32px rgba(${BRAND_RGB},0.80))
					drop-shadow(0 0 64px rgba(${BRAND_RGB},0.40))
				`,
			}}
		/>

		{/* LEFT BORDER — WARM REFINED LINE */}
		<div
			className="absolute left-0 top-0 h-full w-[12px]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						rgba(${BRAND_RGB},0.95) 0%,
						rgba(${BRAND_RGB},0.92) 10%,
						rgba(${BRAND_RGB},0.85) 22%,
						rgba(${BRAND_RGB},0.72) 36%,
						rgba(${BRAND_RGB},0.55) 50%,
						rgba(${BRAND_RGB},0.38) 64%,
						rgba(${BRAND_RGB},0.22) 76%,
						rgba(${BRAND_RGB},0.10) 86%,
						rgba(${BRAND_RGB},0.03) 94%,
						transparent 100%
					)
				`,
				filter: `
					blur(9px)
					drop-shadow(0 0 28px rgba(${BRAND_RGB},0.65))
					drop-shadow(0 0 65px rgba(${BRAND_RGB},0.32))
					drop-shadow(0 0 110px rgba(${BRAND_RGB},0.15))
				`,
				opacity: 1,
				pointerEvents: "none",
			}}
		/>

		{/* SOFT LEFT HAZE */}
		<div
			className="absolute left-0 top-0 h-[85%] w-[26px]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						rgba(${BRAND_RGB},0.28) 0%,
						rgba(${BRAND_RGB},0.22) 20%,
						rgba(${BRAND_RGB},0.15) 40%,
						rgba(${BRAND_RGB},0.08) 60%,
						rgba(${BRAND_RGB},0.03) 80%,
						transparent 100%
					)
				`,
				filter: "blur(20px)",
				opacity: 0.70,
			}}
		/>

		{/* TOP RIGHT ACCENT GLOW */}
		<div
			className="absolute right-0 w-[140px] h-[75%]"
			style={{
				top: "55%",
				transform: "translate(20%, -50%)",
				background: `
					radial-gradient(
						ellipse at right center,
						rgba(${BRAND_RGB},0.45) 0%,
						rgba(${BRAND_RGB},0.28) 20%,
						rgba(${BRAND_RGB},0.15) 42%,
						rgba(${BRAND_RGB},0.04) 65%,
						transparent 100%
					)
				`,
				filter: `
					blur(38px)
					drop-shadow(0 0 28px rgba(${BRAND_RGB},0.18))
				`,
			}}
		/>

		{/* RIGHT BORDER — SUBTLE WARM LINE */}
		<div
			className="absolute right-0 top-0 h-full w-[2.5px]"
			style={{
				background: `
					linear-gradient(
						to bottom,
						transparent 0%,
						rgba(${BRAND_RGB},0.06) 8%,
						rgba(${BRAND_RGB},0.20) 18%,
						rgba(${BRAND_RGB},0.48) 28%,
						rgba(${BRAND_RGB},0.78) 38%,
						rgba(${BRAND_RGB},0.95) 45%,
						rgba(${BRAND_RGB},1) 50%,
						rgba(${BRAND_RGB},0.95) 55%,
						rgba(${BRAND_RGB},0.78) 62%,
						rgba(${BRAND_RGB},0.48) 72%,
						rgba(${BRAND_RGB},0.20) 82%,
						rgba(${BRAND_RGB},0.06) 92%,
						transparent 100%
					)
				`,
				filter: `
					blur(2px)
					drop-shadow(0 0 16px rgba(${BRAND_RGB},0.48))
					drop-shadow(0 0 42px rgba(${BRAND_RGB},0.22))
					drop-shadow(0 0 80px rgba(${BRAND_RGB},0.10))
				`,
				opacity: 1,
				pointerEvents: "none",
			}}
		/>

		{/* SOFT RIGHT HAZE */}
		<div
			className="absolute right-0 w-[30px] h-[86%]"
			style={{
				top: "50%",
				transform: "translateY(-50%)",
				background: `
					linear-gradient(
						to bottom,
						transparent 0%,
						rgba(${BRAND_RGB},0.07) 10%,
						rgba(${BRAND_RGB},0.16) 25%,
						rgba(${BRAND_RGB},0.24) 40%,
						rgba(${BRAND_RGB},0.27) 50%,
						rgba(${BRAND_RGB},0.24) 60%,
						rgba(${BRAND_RGB},0.16) 75%,
						rgba(${BRAND_RGB},0.07) 90%,
						transparent 100%
					)
				`,
				filter: "blur(20px)",
				opacity: 0.72,
			}}
		/>

		{/* OUTER WARM GLOW FIELD */}
		<div
			className="absolute -left-12 -top-12 w-44 h-44 rounded-full"
			style={{
				background: `rgba(${BRAND_RGB},0.15)`,
				filter: `
					blur(56px)
					drop-shadow(0 0 80px rgba(${BRAND_RGB},0.12))
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
					{resolvedPillLabel}
				</span>
			</div>

			<p className="text-white font-semibold text-base">
				Fyll i dina uppgifter så kontaktar vi dig
			</p>
		</div>

		{/* BODY */}
		<div className="p-6 space-y-4">

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label className="text-sm font-semibold text-zinc-200">
						Förnamn <span className="text-red-400">*</span>
					</Label>
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
						<Input
							{...register("firstName")}
							className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white"
						/>
					</div>
					{errors.firstName && (
						<p className="text-xs text-red-400">
							{errors.firstName.message}
						</p>
					)}
				</div>
				<div className="space-y-1.5">
					<Label className="text-sm font-semibold text-zinc-200">
						<span className="notranslate">
							<span className="lang-sv">Efternamn</span>
							<span className="lang-en">Last name</span>
						</span>{" "}
						<span className="text-red-400">*</span>
					</Label>
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
						<Input
							{...register("lastName")}
							className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white"
						/>
					</div>
					{errors.lastName && (
						<p className="text-xs text-red-400">
							{errors.lastName.message}
						</p>
					)}
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
				<Label className="text-sm font-semibold text-zinc-200">
					Org. nummer <span className="text-red-400">*</span>
				</Label>
				<div className="relative">
					<Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
					<Input
						{...register("companyName")}
						placeholder="t.ex. 556789-1234"
						className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-sm font-semibold text-zinc-200">Meddelande</Label>
				<Textarea {...register("message")} className="min-h-[90px] bg-zinc-950 border-zinc-800 text-white" />
			</div>

			{/* GDPR consent */}
			<div className="flex items-start gap-3 pt-1">
				<Checkbox
					id="gdpr-consent"
					checked={gdprChecked}
					onCheckedChange={(checked) =>
						handleGdprChange(checked === true)
					}
					className="mt-0.5 border-zinc-700 data-[state=checked]:bg-[#dba784] data-[state=checked]:border-[#dba784] data-[state=checked]:text-black"
				/>
				<label
					htmlFor="gdpr-consent"
					className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none"
				>
					Jag godkänner Synos Medical AB:s{" "}
					<Link
						href="/integritetspolicy"
						className="underline"
						style={{ color: BRAND }}
						target="_blank"
						rel="noopener noreferrer"
					>
						integritetspolicy
					</Link>{" "}
					och samtycker till att mina uppgifter behandlas enligt GDPR.{" "}
					<span className="text-red-400">*</span>
				</label>
			</div>
			{errors.gdprConsent && (
				<p className="text-xs text-red-400 -mt-2">
					{errors.gdprConsent.message}
				</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full h-12 rounded-md font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
				style={{
					background: BRAND,
					boxShadow: `0 0 26px rgba(${BRAND_RGB},0.25)`,
				}}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Skickar...
					</>
				) : (
					<>
						<Send className="h-4 w-4" />
						Skicka förfrågan
					</>
				)}
			</button>

			<p className="text-center text-xs text-zinc-500">
				<span className="text-red-400">*</span> Obligatoriska fält
			</p>

		</div>
	</form>
</div>

				</div>
			</div>
		</section>
	);
}
