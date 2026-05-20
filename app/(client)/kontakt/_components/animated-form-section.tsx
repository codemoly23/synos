"use client";

import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import type { IKontaktFormSection } from "@/models/kontakt-page.model";

interface AnimatedFormSectionProps {
	data: IKontaktFormSection;
	contactPhone?: string;
	contactEmail?: string;
}

export function AnimatedFormSection({
	data,
	contactPhone,
	contactEmail,
}: AnimatedFormSectionProps) {
	return (
		<ProductInquiryForm
			pillLabel={data.badge || "SYNOS MEDICAL"}
			purchaseTitle={data.title || "Kontakta oss"}
			purchaseDescription={
				data.subtitle
					? `<p>${data.subtitle}</p>`
					: "<p>Fyll i formuläret så återkommer vi inom 24 timmar.</p>"
			}
			contactPhone={contactPhone}
			contactEmail={contactEmail}
		/>
	);
}
