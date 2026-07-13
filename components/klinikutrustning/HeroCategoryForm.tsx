"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { pushEvent } from "@/lib/analytics/gtm";

interface HeroCategoryFormProps {
	categoryName: string;
}

interface FormState {
	firstName: string;
	lastName: string;
	companyName: string;
	email: string;
	message: string;
}

interface FormErrors {
	firstName?: string;
	lastName?: string;
	companyName?: string;
	email?: string;
}

const EMPTY: FormState = {
	firstName: "",
	lastName: "",
	companyName: "",
	email: "",
	message: "",
};

function validate(data: FormState): FormErrors {
	const errors: FormErrors = {};
	if (!data.firstName.trim()) errors.firstName = "Obligatoriskt";
	if (!data.lastName.trim()) errors.lastName = "Obligatoriskt";
	if (!data.companyName.trim()) errors.companyName = "Obligatoriskt";
	if (!data.email.trim()) {
		errors.email = "Obligatoriskt";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		errors.email = "Ogiltig e-postadress";
	}
	return errors;
}

const base =
	"w-full bg-transparent border border-white/20 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/50 transition-colors";
const err =
	"w-full bg-transparent border border-red-400/60 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-red-400 transition-colors";

export function HeroCategoryForm({ categoryName }: HeroCategoryFormProps) {
	const router = useRouter();
	const [form, setForm] = useState<FormState>(EMPTY);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	function onChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		const { name, value } = e.target;
		setForm((p) => ({ ...p, [name]: value }));
		if (errors[name as keyof FormErrors])
			setErrors((p) => ({ ...p, [name]: undefined }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setServerError(null);
		const validationErrors = validate(form);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "hero_inquiry",
					fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
					email: form.email.trim(),
					companyName: form.companyName.trim() || undefined,
					message: form.message.trim() || undefined,
					categoryName,
					pageUrl: window.location.href,
				}),
			});
			const result = await res.json();
			if (result.success) {
				setForm(EMPTY);
				setErrors({});
				pushEvent("generate_lead", { form_type: "hero_inquiry", category: categoryName });
				router.push("/tack");
			} else {
				setServerError(result.message || "Något gick fel. Försök igen.");
			}
		} catch {
			setServerError("Något gick fel. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={onSubmit} noValidate className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-xs text-white/80 mb-1.5">
						Förnamn <span className="text-primary">*</span>
					</label>
					<input
						type="text"
						name="firstName"
						value={form.firstName}
						onChange={onChange}
						placeholder="Ditt förnamn"
						className={errors.firstName ? err : base}
						disabled={isSubmitting}
					/>
					{errors.firstName && (
						<p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
					)}
				</div>
				<div>
					<label className="block text-xs text-white/80 mb-1.5">
						Efternamn <span className="text-primary">*</span>
					</label>
					<input
						type="text"
						name="lastName"
						value={form.lastName}
						onChange={onChange}
						placeholder="Ditt efternamn"
						className={errors.lastName ? err : base}
						disabled={isSubmitting}
					/>
					{errors.lastName && (
						<p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-xs text-white/80 mb-1.5">
						Företag <span className="text-primary">*</span>
					</label>
					<input
						type="text"
						name="companyName"
						value={form.companyName}
						onChange={onChange}
						placeholder="Ditt företagsnamn"
						className={errors.companyName ? err : base}
						disabled={isSubmitting}
					/>
					{errors.companyName && (
						<p className="mt-1 text-xs text-red-400">{errors.companyName}</p>
					)}
				</div>
				<div>
					<label className="block text-xs text-white/80 mb-1.5">
						E-post <span className="text-primary">*</span>
					</label>
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={onChange}
						placeholder="din.email@exempel.se"
						className={errors.email ? err : base}
						disabled={isSubmitting}
					/>
					{errors.email && (
						<p className="mt-1 text-xs text-red-400">{errors.email}</p>
					)}
				</div>
			</div>

			<div>
				<label className="block text-xs text-white/80 mb-1.5">
					När är du intresserad av att ta nästa steg?
				</label>
				<textarea
					name="message"
					value={form.message}
					onChange={onChange}
					rows={4}
					placeholder="Beskriv när det passar er bäst eller andra detaljer..."
					className={`${base} resize-none`}
					disabled={isSubmitting}
				/>
			</div>

			{serverError && (
				<p className="text-sm text-red-400 text-center">{serverError}</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full py-3 rounded-md btn-copper-gradient font-medium text-base disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Skickar...
					</>
				) : (
					"Skicka förfrågan"
				)}
			</button>

			<p className="text-center text-xs text-white/40">
				Vi behandlar dina uppgifter konfidentiellt och delar dem inte med tredje part.
			</p>
		</form>
	);
}
