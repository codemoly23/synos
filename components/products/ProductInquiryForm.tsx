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
import { z } from "zod";
import { ImageComponent } from "@/components/common/image-component";
import { pushEvent } from "@/lib/analytics/gtm";
import { trackLead, trackContact } from "@/lib/analytics/facebook-pixel";

interface ProductInquiryFormProps {
	productName?: string;
	productId?: string;
	productSlug?: string;
	categoryName?: string;
	purchaseTitle?: string;
	purchaseDescription?: string;
	formSubtitle?: string;
	buttonText?: string;
	productImage?: string;
	contactPhone?: string;
	contactEmail?: string;
	pillLabel?: string;
	bgMobile?: string;
	bgDesktop?: string;
}

const desktopSchema = z.object({
	firstName: z.string().min(1, "Förnamn är obligatoriskt").max(50),
	lastName: z.string().min(1, "Efternamn är obligatoriskt").max(50),
	email: z.string().email("Ange en giltig e-postadress"),
	phone: z.string().min(6, "Telefonnummer måste vara minst 6 siffror").max(20),
	corporationNumber: z.string().min(1, "Org. nummer är obligatoriskt"),
	message: z.string().max(2000).optional(),
	gdprConsent: z.boolean({ message: "Du måste godkänna integritetspolicyn" }).refine((val) => val === true, { message: "Du måste godkänna integritetspolicyn" }),
	productId: z.string().optional(),
	productName: z.string().optional(),
	productSlug: z.string().optional(),
});

const mobileSchema = z.object({
	firstName: z.string().min(1, "Förnamn är obligatoriskt").max(50),
	lastName: z.string().min(1, "Efternamn är obligatoriskt").max(50),
	email: z.string().email("Ange en giltig e-postadress"),
	companyName: z.string().min(1, "Företag är obligatoriskt"),
	message: z.string().max(2000).optional(),
	gdprConsent: z.boolean({ message: "Du måste godkänna integritetspolicyn" }).refine((val) => val === true, { message: "Du måste godkänna integritetspolicyn" }),
	productId: z.string().optional(),
	productName: z.string().optional(),
	productSlug: z.string().optional(),
});

type DesktopData = z.infer<typeof desktopSchema>;
type MobileData = z.infer<typeof mobileSchema>;

const BRAND = "#dba784";
const BRAND_RGB = "219,167,132";

async function submitInquiry(
	data: DesktopData | MobileData,
	extras: { isGeneric: boolean; categoryName?: string }
) {
	const d = data as DesktopData & MobileData;
	const response = await fetch("/api/form-submissions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			type: extras.isGeneric ? "contact" : "product_inquiry",
			...d,
			fullName: `${d.firstName} ${d.lastName}`.trim(),
			subject: extras.isGeneric
				? extras.categoryName
					? `Förfrågan: ${extras.categoryName}`
					: "Allmän förfrågan"
				: undefined,
			pageUrl: window.location.href,
		}),
	});
	return response.json();
}

function SuccessCard({ context, onReset }: { context: string; onReset: () => void }) {
	return (
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
				Vi har mottagit {context} och återkommer till dig inom 24 timmar.
			</p>
			<Button
				variant="outline"
				onClick={onReset}
				className="mt-4 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
			>
				Skicka ny förfrågan
			</Button>
		</div>
	);
}

// ─── Desktop Form ────────────────────────────────────────────────────────────

function DesktopInquiryForm({
	productName,
	productId,
	productSlug,
	categoryName,
	pillLabel,
	formSubtitle,
	buttonText,
	isGeneric,
	successContext,
}: {
	productName?: string;
	productId?: string;
	productSlug?: string;
	categoryName?: string;
	pillLabel: string;
	formSubtitle?: string;
	buttonText?: string;
	isGeneric: boolean;
	successContext: string;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [gdprChecked, setGdprChecked] = useState(false);

	const { register, handleSubmit, setValue, reset, formState: { errors } } =
		useForm<DesktopData>({
			resolver: zodResolver(desktopSchema),
			defaultValues: {
				firstName: "", lastName: "", email: "",
				phone: "",
				corporationNumber: "",
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

	const onSubmit = async (data: DesktopData) => {
		setIsSubmitting(true);
		try {
			const result = await submitInquiry(data, { isGeneric, categoryName });
			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				toast.success("Tack för din förfrågan! Vi återkommer inom 24 timmar.");
				setTimeout(() => setIsSuccess(false), 10000);

				// Analytics conversion events
				const eventData = {
					form_type: isGeneric ? "contact" : "product_inquiry",
					...(productName && { product_name: productName }),
					...(categoryName && { category: categoryName }),
				};
				pushEvent(isGeneric ? "generate_contact" : "generate_lead", eventData);
				if (isGeneric) trackContact(eventData);
				else trackLead(eventData);
			} else {
				if (result.errors && Array.isArray(result.errors)) {
					const msg = result.errors
						.filter((e: { path?: string[]; message?: string }) => e.path && e.message)
						.map((e: { path?: string[]; message?: string }) => e.message)
						.join(", ");
					toast.error(msg || result.message || "Något gick fel. Försök igen.");
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
		return <SuccessCard context={successContext} onReset={() => setIsSuccess(false)} />;
	}

	return (
		<div className="relative min-w-0 rounded-[24px] p-[2px] overflow-hidden">

			{/* ── GLOW SYSTEM ── */}
			<div className="absolute inset-0 rounded-[24px] pointer-events-none">
				<div className="absolute inset-0 rounded-[24px]" style={{ background: `linear-gradient(135deg,rgba(${BRAND_RGB},0.10) 0%,rgba(${BRAND_RGB},0.04) 30%,rgba(${BRAND_RGB},0.01) 65%,transparent 100%)` }} />
				<div className="absolute left-0 top-0 w-[120px] h-[60%]" style={{ background: `radial-gradient(ellipse 52% 95% at 0% 25%,rgba(${BRAND_RGB},0.95) 0%,rgba(${BRAND_RGB},0.65) 28%,rgba(${BRAND_RGB},0.18) 70%,transparent 100%)`, transform: "translate(-20%,0)", filter: `blur(28px) drop-shadow(0 0 48px rgba(${BRAND_RGB},0.70))` }} />
				<div className="absolute left-0 top-0 w-[50px] h-[28%]" style={{ background: `radial-gradient(ellipse 38% 98% at 0% 6%,rgba(${BRAND_RGB},0.98) 0%,rgba(${BRAND_RGB},0.50) 48%,transparent 100%)`, transform: "translate(-10%,0)", filter: `blur(14px) drop-shadow(0 0 32px rgba(${BRAND_RGB},0.80))` }} />
				<div className="absolute left-0 top-0 h-full w-[12px]" style={{ background: `linear-gradient(to bottom,rgba(${BRAND_RGB},0.95) 0%,rgba(${BRAND_RGB},0.55) 50%,rgba(${BRAND_RGB},0.03) 94%,transparent 100%)`, filter: `blur(9px) drop-shadow(0 0 28px rgba(${BRAND_RGB},0.65))`, pointerEvents: "none" }} />
				<div className="absolute left-0 top-0 h-[85%] w-[26px]" style={{ background: `linear-gradient(to bottom,rgba(${BRAND_RGB},0.28) 0%,rgba(${BRAND_RGB},0.08) 60%,transparent 100%)`, filter: "blur(20px)", opacity: 0.70 }} />
				<div className="absolute right-0 w-[140px] h-[75%]" style={{ top: "55%", transform: "translate(20%,-50%)", background: `radial-gradient(ellipse at right center,rgba(${BRAND_RGB},0.45) 0%,rgba(${BRAND_RGB},0.04) 65%,transparent 100%)`, filter: `blur(38px) drop-shadow(0 0 28px rgba(${BRAND_RGB},0.18))` }} />
				<div className="absolute right-0 top-0 h-full w-[2.5px]" style={{ background: `linear-gradient(to bottom,transparent 0%,rgba(${BRAND_RGB},0.48) 28%,rgba(${BRAND_RGB},1) 50%,rgba(${BRAND_RGB},0.48) 72%,transparent 100%)`, filter: `blur(2px) drop-shadow(0 0 16px rgba(${BRAND_RGB},0.48))`, pointerEvents: "none" }} />
				<div className="absolute right-0 w-[30px] h-[86%]" style={{ top: "50%", transform: "translateY(-50%)", background: `linear-gradient(to bottom,transparent 0%,rgba(${BRAND_RGB},0.27) 50%,transparent 100%)`, filter: "blur(20px)", opacity: 0.72 }} />
				<div className="absolute -left-12 -top-12 w-44 h-44 rounded-full" style={{ background: `rgba(${BRAND_RGB},0.15)`, filter: `blur(56px)` }} />
			</div>

			{/* ── FORM ── */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="relative rounded-[22.5px] overflow-hidden border border-white/[0.04] bg-zinc-950/96 backdrop-blur-xl"
				style={{ transform: "translateZ(0)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03),0 16px 55px rgba(0,0,0,0.55)` }}
			>
				{/* HEADER */}
				<div className="px-6 py-5">
					<div className="flex items-center gap-2 mb-1.5">
						<span className="w-2 h-2 rounded-full" style={{ background: BRAND, boxShadow: `0 0 14px rgba(${BRAND_RGB},0.6)` }} />
						<span className="text-xs font-medium uppercase tracking-widest" style={{ color: BRAND }}>{pillLabel}</span>
					</div>
					<p className="text-white font-semibold text-base">{formSubtitle || "Fyll i dina uppgifter så kontaktar vi dig"}</p>
				</div>

				{/* BODY */}
				<div className="p-6 space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-sm font-semibold text-zinc-200">Förnamn <span className="text-red-400">*</span></Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
								<Input {...register("firstName")} className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
							</div>
							{errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
						</div>
						<div className="space-y-1.5">
							<Label className="text-sm font-semibold text-zinc-200">Efternamn <span className="text-red-400">*</span></Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
								<Input {...register("lastName")} className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
							</div>
							{errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
						</div>
					</div>

					<div className="space-y-1.5">
						<Label className="text-sm font-semibold text-zinc-200">E-post <span className="text-red-400">*</span></Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
							<Input {...register("email")} type="email" className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
						</div>
						{errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
					</div>

					<div className="space-y-1.5">
						<Label className="text-sm font-semibold text-zinc-200">Telefon <span className="text-red-400">*</span></Label>
						<div className="relative">
							<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
							<Input {...register("phone")} type="tel" className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
						</div>
						{errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
					</div>

					<div className="space-y-1.5">
						<Label className="text-sm font-semibold text-zinc-200">Org. nummer <span className="text-red-400">*</span></Label>
						<div className="relative">
							<Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
							<Input {...register("corporationNumber")} placeholder="t.ex. 556789-1234" className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-white" />
						</div>
						{errors.corporationNumber && <p className="text-xs text-red-400">{errors.corporationNumber.message}</p>}
					</div>

<div className="space-y-1.5">
						<Label className="text-sm font-semibold text-zinc-200">Meddelande</Label>
						<Textarea {...register("message")} className="min-h-[90px] bg-zinc-950 border-zinc-800 text-white" />
					</div>

					<div className="flex items-start gap-3 pt-1">
						<Checkbox
							id="desktop-gdpr"
							checked={gdprChecked}
							onCheckedChange={(checked) => handleGdprChange(checked === true)}
							className="mt-0.5 border-zinc-700 data-[state=checked]:bg-[#dba784] data-[state=checked]:border-[#dba784] data-[state=checked]:text-black"
						/>
						<label htmlFor="desktop-gdpr" className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none">
							Jag godkänner Synos Medical AB:s{" "}
							<Link href="/integritetspolicy" className="underline" style={{ color: BRAND }} target="_blank" rel="noopener noreferrer">integritetspolicy</Link>{" "}
							och samtycker till att mina uppgifter behandlas enligt GDPR.{" "}
							<span className="text-red-400">*</span>
						</label>
					</div>
					{errors.gdprConsent && <p className="text-xs text-red-400 -mt-2">{errors.gdprConsent.message}</p>}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full h-12 rounded-md font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
						style={{ background: BRAND, boxShadow: `0 0 26px rgba(${BRAND_RGB},0.25)` }}
					>
						{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Skickar...</> : <><Send className="h-4 w-4" />{buttonText || "Skicka förfrågan"}</>}
					</button>

					<p className="text-center text-xs text-zinc-500">
						<span className="text-red-400">*</span> Obligatoriska fält
					</p>
				</div>
			</form>
		</div>
	);
}

// ─── Mobile Form ─────────────────────────────────────────────────────────────

function MobileInquiryForm({
	productName,
	productId,
	productSlug,
	categoryName,
	purchaseTitle,
	purchaseDescription,
	buttonText,
	contactPhone,
	contactEmail,
	isGeneric,
	successContext,
}: {
	productName?: string;
	productId?: string;
	productSlug?: string;
	categoryName?: string;
	purchaseTitle?: string;
	purchaseDescription?: string;
	buttonText?: string;
	contactPhone?: string;
	contactEmail?: string;
	isGeneric: boolean;
	successContext: string;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [gdprChecked, setGdprChecked] = useState(false);

	const { register, handleSubmit, setValue, reset, formState: { errors } } =
		useForm<MobileData>({
			resolver: zodResolver(mobileSchema),
			defaultValues: {
				firstName: "", lastName: "", email: "",
				companyName: "", message: "",
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

	const onSubmit = async (data: MobileData) => {
		setIsSubmitting(true);
		try {
			const result = await submitInquiry(data, { isGeneric, categoryName });
			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				toast.success("Tack för din förfrågan! Vi återkommer inom 24 timmar.");
				setTimeout(() => setIsSuccess(false), 10000);

				// Analytics conversion events
				const eventData = {
					form_type: isGeneric ? "contact" : "product_inquiry",
					...(productName && { product_name: productName }),
					...(categoryName && { category: categoryName }),
				};
				pushEvent(isGeneric ? "generate_contact" : "generate_lead", eventData);
				if (isGeneric) trackContact(eventData);
				else trackLead(eventData);
			} else {
				toast.error(result.message || "Något gick fel. Försök igen.");
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("Något gick fel. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return <SuccessCard context={successContext} onReset={() => setIsSuccess(false)} />;
	}

	const inputCls = "w-full bg-transparent border border-white/30 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/50 transition-colors";
	const labelCls = "block text-xs text-white/60 mb-1.5";

	return (
		<div className="space-y-8">

			{/* Title */}
			<div className="space-y-3">
				{productName ? (
					<>
						<h2 className="text-4xl font-light text-white leading-tight">Intresserad av</h2>
						<h2 className="text-4xl font-bold leading-tight" style={{ color: BRAND }}>{productName.toUpperCase()}?</h2>
					</>
				) : purchaseTitle ? (
					<h2 className="text-4xl font-bold text-white leading-tight">{purchaseTitle}</h2>
				) : null}
				{purchaseDescription ? (
					<div className="text-zinc-400 text-sm leading-relaxed [&_p]:mb-2" dangerouslySetInnerHTML={{ __html: purchaseDescription }} />
				) : (
					<p className="text-zinc-400 text-sm leading-relaxed">
						Kontakta oss idag för en kostnadsfri konsultation och upptäck hur vi kan hjälpa dig att nå dina mål.
					</p>
				)}
			</div>

			{/* Contact info */}
			{(contactPhone || contactEmail) && (
				<div className="space-y-4">
					{contactPhone && (
						<a href={`tel:${contactPhone.replace(/[\s-]/g, "")}`} className="flex items-start gap-3">
							<div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ border: `1.5px solid rgba(${BRAND_RGB},0.45)`, color: BRAND }}>
								<Phone className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-bold text-white">Ring oss</p>
								<p className="text-xs text-zinc-500">Vi finns tillgängliga för att hjälpa dig</p>
								<span className="text-sm font-semibold block" style={{ color: BRAND }}>{contactPhone}</span>
							</div>
						</a>
					)}
					{contactEmail && (
						<a href={`mailto:${contactEmail}`} className="flex items-start gap-3">
							<div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ border: `1.5px solid rgba(${BRAND_RGB},0.45)`, color: BRAND }}>
								<Mail className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-bold text-white">Maila oss</p>
								<p className="text-xs text-zinc-500">Skicka oss ett meddelande</p>
								<span className="text-sm font-medium block" style={{ color: BRAND }}>{contactEmail}</span>
							</div>
						</a>
					)}
				</div>
			)}

			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-black px-4 sm:px-6 py-6 -mx-4 sm:-mx-6">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className={labelCls}>Förnamn <span className="text-red-400">*</span></label>
						<input {...register("firstName")} placeholder="Ditt förnamn" className={inputCls} />
						{errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
					</div>
					<div>
						<label className={labelCls}>Efternamn <span className="text-red-400">*</span></label>
						<input {...register("lastName")} placeholder="Ditt efternamn" className={inputCls} />
						{errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
					</div>
				</div>

				<div>
					<label className={labelCls}>Företag <span className="text-red-400">*</span></label>
					<input {...register("companyName")} placeholder="Ditt företagsnamn" className={inputCls} />
					{errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName.message}</p>}
				</div>

				<div>
					<label className={labelCls}>E-post <span className="text-red-400">*</span></label>
					<input {...register("email")} type="email" placeholder="din.email@exempel.se" className={inputCls} />
					{errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
				</div>

				<div>
					<label className={labelCls}>När är du intresserad av att ta nästa steg?</label>
					<textarea {...register("message")} rows={4} placeholder="Beskriv när det passar er bäst eller andra detaljer..." className={`${inputCls} resize-none`} />
				</div>

				<div className="flex items-start gap-3">
					<Checkbox
						id="mobile-gdpr"
						checked={gdprChecked}
						onCheckedChange={(checked) => handleGdprChange(checked === true)}
						className="mt-0.5 border-zinc-700 data-[state=checked]:bg-[#dba784] data-[state=checked]:border-[#dba784] data-[state=checked]:text-black"
					/>
					<label htmlFor="mobile-gdpr" className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none">
						Jag godkänner Synos Medical AB:s{" "}
						<Link href="/integritetspolicy" className="underline" style={{ color: BRAND }} target="_blank" rel="noopener noreferrer">integritetspolicy</Link>{" "}
						och samtycker till att mina uppgifter behandlas enligt GDPR.{" "}
						<span className="text-red-400">*</span>
					</label>
				</div>
				{errors.gdprConsent && <p className="text-xs text-red-400 -mt-2">{errors.gdprConsent.message}</p>}

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full h-12 rounded-md font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
					style={{ background: BRAND }}
				>
					{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Skickar...</> : <><Send className="h-4 w-4" />{buttonText || "Skicka förfrågan"}</>}
				</button>

				<p className="text-center text-xs text-zinc-500">
					<span className="text-red-400">*</span> Obligatoriska fält
				</p>
			</form>
		</div>
	);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function ProductInquiryForm({
	productName,
	productId,
	productSlug,
	categoryName,
	purchaseTitle,
	purchaseDescription,
	formSubtitle,
	buttonText,
	productImage,
	contactPhone,
	contactEmail,
	pillLabel,
	bgMobile,
	bgDesktop,
}: ProductInquiryFormProps) {
	const isGeneric = !productId;
	const resolvedPillLabel = pillLabel ?? (productName ? `${productName.toUpperCase()} DEMO` : "SYNOS MEDICAL");
	const resolvedTitle = purchaseTitle || (productName ? `Intresserad av ${productName}?` : "Kontakta oss");
	const successContext = productName || "din förfrågan";

	const defaultBg = "/images/Product detail breadcrumbs background.jpeg";

	return (
		<section className="py-16 md:py-24 relative overflow-hidden">
			{/* Mobile background */}
			<div className="absolute inset-0 lg:hidden">
				<ImageComponent
					src={bgMobile || bgDesktop || defaultBg}
					alt=""
					fill
					className="object-cover object-[left_bottom]"
					sizes="100vw"
				/>
			</div>
			{/* Desktop background */}
			<div className="absolute inset-0 hidden lg:block">
				<ImageComponent
					src={bgDesktop || bgMobile || defaultBg}
					alt=""
					fill
					className="object-cover object-[left_bottom]"
					sizes="100vw"
				/>
			</div>
			<div className="_container relative z-10">

				{/* ── MOBILE (< lg) ── */}
				<div className="block lg:hidden">
					<MobileInquiryForm
						productName={productName}
						productId={productId}
						productSlug={productSlug}
						categoryName={categoryName}
						purchaseTitle={purchaseTitle}
						purchaseDescription={purchaseDescription}
						buttonText={buttonText}
						contactPhone={contactPhone}
						contactEmail={contactEmail}
						isGeneric={isGeneric}
						successContext={successContext}
					/>
				</div>

				{/* ── DESKTOP (≥ lg) ── */}
				<div className="hidden lg:grid grid-cols-2 gap-12 items-start">

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
									Kontakta oss idag för en kostnadsfri konsultation och upptäck hur vi kan hjälpa dig att nå dina mål.
								</p>
							)}
						</div>

						<div className="space-y-6">
							{(contactPhone || categoryName) && (
								<a href={`tel:${(contactPhone || "").replace(/[\s-]/g, "")}`} className="flex items-start gap-4 group">
									<div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0" style={{ border: `1.5px solid rgba(${BRAND_RGB},0.45)`, color: BRAND }}>
										<Phone className="h-5 w-5" />
									</div>
									<div>
										<h4 className="text-base font-bold text-white">Ring oss</h4>
										<p className="text-zinc-400 text-sm">Vi finns tillgängliga för att hjälpa dig</p>
										{contactPhone && <span className="font-semibold mt-1 block group-hover:underline" style={{ color: BRAND }}>{contactPhone}</span>}
									</div>
								</a>
							)}
							{contactEmail && (
								<a href={`mailto:${contactEmail}`} className="flex items-start gap-4 group">
									<div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0" style={{ border: `1.5px solid rgba(${BRAND_RGB},0.45)`, color: BRAND }}>
										<Mail className="h-5 w-5" />
									</div>
									<div>
										<h4 className="text-base font-bold text-white">Maila oss</h4>
										<p className="text-zinc-400 text-sm">Skicka oss ett meddelande</p>
										<span className="font-medium mt-1 block group-hover:underline" style={{ color: BRAND }}>{contactEmail}</span>
									</div>
								</a>
							)}
						</div>
					</div>

					{/* Right — Desktop Form Card */}
					<DesktopInquiryForm
						productName={productName}
						productId={productId}
						productSlug={productSlug}
						categoryName={categoryName}
						pillLabel={resolvedPillLabel}
						formSubtitle={formSubtitle}
						buttonText={buttonText}
						isGeneric={isGeneric}
						successContext={successContext}
					/>
				</div>
			</div>
		</section>
	);
}
