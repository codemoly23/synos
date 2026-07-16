import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * Form submission types
 */
export const formSubmissionTypes = [
	"product_inquiry",
	"training_inquiry",
	"contact",
	"demo_request",
	"quote_request",
	"callback_request",
	"tour_request",
	"job_application",
	"hero_inquiry",
	"brochure_request",
	"training_application",
	"newsletter_subscription",
] as const;

/**
 * Form submission status
 */
export const formSubmissionStatuses = ["new", "read", "archived"] as const;

/**
 * Help type options for product inquiry
 */
export const helpTypes = [
	"clinic_buy",
	"start_business",
	"just_interested",
	"buy_contact",
] as const;

/**
 * Help type labels (Swedish)
 */
export const helpTypeLabels: Record<(typeof helpTypes)[number], string> = {
	clinic_buy: "Jag driver en klinik/salong och vill köpa denna produkt",
	start_business: "Jag vill starta eget och vill veta mer om produkten",
	just_interested: "Jag är bara intresserad och vill veta mer",
	buy_contact: "Jag vill köpa denna produkt och komma i kontakt med er",
};

/**
 * Training interest type options for training inquiry
 */
export const trainingInterestTypes = [
	"machine_purchase",
	"already_customer",
	"certification_info",
	"general_info",
] as const;

/**
 * Training interest type labels (Swedish)
 */
export const trainingInterestTypeLabels: Record<
	(typeof trainingInterestTypes)[number],
	string
> = {
	machine_purchase:
		"Jag planerar att köpa maskin och vill veta mer om utbildningen",
	already_customer: "Jag är redan kund och vill boka utbildning",
	certification_info: "Jag vill veta mer om certifiering som Synos terapeut",
	general_info: "Jag vill ha allmän information om era utbildningar",
};

/**
 * Base form fields shared across all form types
 */
const baseFormFields = {
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	countryCode: z
		.string()
		.min(2, "Landskod krävs")
		.max(10, "Ogiltig landskod")
		.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

	countryName: z
		.string()
		.min(2, "Land krävs")
		.max(100, "Landets namn får inte överstiga 100 tecken")
		.trim(),

	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(25, "Telefonnummer får inte överstiga 25 siffror")
		.regex(
			/^[+]?[0-9\s\-()+]+$/,
			"Ogiltigt telefonnummer"
		)
		.trim(),

	corporationNumber: z
		.string()
		.max(30, "Organisationsnummer får inte överstiga 30 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	gdprConsent: z
		.boolean()
		.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),

	marketingConsent: z.boolean().optional(),
};

/**
 * Product Inquiry Form Schema
 * phone/countryCode/countryName/helpType are optional for mobile compatibility.
 * Desktop enforces them via its own frontend schema.
 */
export const productInquirySchema = z
	.object({
		// Required base fields
		fullName: baseFormFields.fullName,
		email: baseFormFields.email,
		corporationNumber: baseFormFields.corporationNumber,
		message: baseFormFields.message,
		gdprConsent: baseFormFields.gdprConsent,
		marketingConsent: baseFormFields.marketingConsent,

		// Optional for mobile (desktop provides via CountryCodeSelect)
		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod")
			.optional()
			.or(z.literal("")),
		countryName: z
			.string()
			.min(2, "Land krävs")
			.max(100, "Landets namn får inte överstiga 100 tecken")
			.trim()
			.optional()
			.or(z.literal("")),
		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(25, "Telefonnummer får inte överstiga 25 siffror")
			.regex(/^[+]?[0-9\s\-()+]+$/, "Ogiltigt telefonnummer")
			.trim()
			.optional()
			.or(z.literal("")),
		helpType: z
			.enum(helpTypes, { message: "Välj hur vi kan hjälpa dig" })
			.optional(),

		// Required product fields
		productId: z.string().min(1, "Produkt-ID krävs"),
		productName: z.string().min(1, "Produktnamn krävs"),
		productSlug: z.string().min(1, "Produkt-slug krävs"),
		productCategorySlug: z.string().max(200).trim().optional().or(z.literal("")),
	})
	.refine(
		(data) => {
			if (!data.countryCode || !data.phone) return true;
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Contact Inquiry Form Schema
 * Simpler schema — no country code picker, accepts full phone numbers.
 */
export const contactInquirySchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(25, "Telefonnummer får inte överstiga 25 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	subject: z
		.string()
		.min(3, "Ämne måste vara minst 3 tecken")
		.max(200, "Ämne får inte överstiga 200 tecken")
		.trim(),

	corporationNumber: z
		.string()
		.max(30, "Organisationsnummer får inte överstiga 30 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	companyName: z
		.string()
		.max(200, "Företagsnamnet får inte överstiga 200 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	gdprConsent: z
		.boolean()
		.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),

	marketingConsent: z.boolean().optional(),
});

/**
 * Training Inquiry Form Schema
 */
export const trainingInquirySchema = z
	.object({
		...baseFormFields,

		// Training inquiry specific fields
		trainingInterestType: z.enum(trainingInterestTypes, {
			message: "Välj vad du är intresserad av",
		}),
	})
	.refine(
		(data) => {
			// Validate phone number with country code
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Callback Request Form Schema
 * Simplified schema - only phone and preferred callback time
 */
export const callbackRequestSchema = z
	.object({
		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		preferredDate: z.string().min(1, "Välj ett datum"),
		preferredTime: z.string().min(1, "Välj en tid"),

		gdprConsent: z
			.boolean()
			.refine(
				(val) => val === true,
				"Du måste godkänna att samtalet kan spelas in"
			),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Form submission list query params
 */
export const formSubmissionListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	type: z.enum(formSubmissionTypes).optional(),
	status: z.enum(formSubmissionStatuses).optional(),
	search: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	productId: z.string().optional(),
	sort: z
		.enum(["createdAt", "-createdAt", "fullName", "-fullName"])
		.default("-createdAt"),
});

/**
 * Update status schema
 */
export const updateStatusSchema = z.object({
	status: z.enum(["read", "archived"]),
});

/**
 * Bulk export schema
 */
export const bulkExportSchema = z.object({
	ids: z.array(z.string()).optional(),
	type: z.enum(formSubmissionTypes).optional(),
	status: z.enum(formSubmissionStatuses).optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	format: z.enum(["csv", "xlsx"]).default("csv"),
});

/**
 * Tour Request Form Schema
 * For scheduling virtual tours of facilities and equipment
 */
export const tourRequestSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Namnet måste vara minst 2 tecken")
			.max(100, "Namnet får inte överstiga 100 tecken")
			.trim(),

		email: z
			.string()
			.email("Ange en giltig e-postadress")
			.max(255, "E-postadressen får inte överstiga 255 tecken")
			.trim()
			.toLowerCase(),

		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		message: z
			.string()
			.max(1000, "Meddelandet får inte överstiga 1000 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		gdprConsent: z
			.boolean()
			.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Quote Request Form Schema
 * For requesting quotes/offers for products or services
 */
export const quoteRequestSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Namnet måste vara minst 2 tecken")
			.max(100, "Namnet får inte överstiga 100 tecken")
			.trim(),

		email: z
			.string()
			.email("Ange en giltig e-postadress")
			.max(255, "E-postadressen får inte överstiga 255 tecken")
			.trim()
			.toLowerCase(),

		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		companyName: z
			.string()
			.max(200, "Företagsnamnet får inte överstiga 200 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		message: z
			.string()
			.max(2000, "Meddelandet får inte överstiga 2000 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		gdprConsent: z
			.boolean()
			.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Job Application Form Schema
 * For job applications on careers page
 */
export const jobApplicationSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror")
		.trim(),

	careerType: z
		.string()
		.min(1, "Välj en karriärtyp")
		.max(100, "Karriärtyp får inte överstiga 100 tecken")
		.trim(),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	resumeUrl: z
		.string()
		.max(500, "Resume URL får inte överstiga 500 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	jobTitle: z
		.string()
		.max(200, "Jobbtitel får inte överstiga 200 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	subject: z
		.string()
		.max(200, "Ämne får inte överstiga 200 tecken")
		.trim()
		.optional()
		.or(z.literal("")),
});

/**
 * Training Application Form Schema
 * For the application form on the training/utbildningar page
 */
export const trainingApplicationSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror")
		.trim(),

	category: z
		.string()
		.min(1, "Välj en kategori")
		.max(100, "Kategori får inte överstiga 100 tecken")
		.trim(),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	attachmentUrl: z
		.string()
		.max(500, "Bilaga-URL får inte överstiga 500 tecken")
		.trim()
		.optional()
		.or(z.literal("")),
});

/**
 * Hero Inquiry Form Schema
 * Minimal schema for the category hero section contact form.
 * No phone required — name, company, email, optional message.
 */
export const heroInquirySchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	companyName: z
		.string()
		.max(200, "Företagsnamnet får inte överstiga 200 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	categoryName: z
		.string()
		.max(200)
		.trim()
		.optional()
		.or(z.literal("")),
});

/**
 * Newsletter Subscription Form Schema
 * Minimal schema for the footer newsletter subscription — email only.
 */
export const newsletterSubscriptionSchema = z.object({
	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),
});

/**
 * Brochure Request Form Schema
 */
export const brochureRequestSchema = z.object({
	companyName: z
		.string()
		.min(1, "Företagsnamn krävs")
		.max(200, "Företagsnamnet får inte överstiga 200 tecken")
		.trim(),

	firstName: z
		.string()
		.min(1, "Förnamn krävs")
		.max(100, "Förnamnet får inte överstiga 100 tecken")
		.trim(),

	lastName: z
		.string()
		.min(1, "Efternamn krävs")
		.max(100, "Efternamnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	productName: z.string().max(200).trim().optional().or(z.literal("")),
	productSlug: z.string().max(200).trim().optional().or(z.literal("")),
	documentTitle: z.string().max(200).trim().optional().or(z.literal("")),
});

// Type exports
export type ProductInquiryInput = z.infer<typeof productInquirySchema>;
export type TrainingInquiryInput = z.infer<typeof trainingInquirySchema>;
export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
export type TourRequestInput = z.infer<typeof tourRequestSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type TrainingApplicationInput = z.infer<
	typeof trainingApplicationSchema
>;
export type FormSubmissionListQuery = z.infer<
	typeof formSubmissionListQuerySchema
>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type BulkExportInput = z.infer<typeof bulkExportSchema>;
export type HeroInquiryInput = z.infer<typeof heroInquirySchema>;
export type BrochureRequestInput = z.infer<typeof brochureRequestSchema>;
export type NewsletterSubscriptionInput = z.infer<
	typeof newsletterSubscriptionSchema
>;
