import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Namnet måste vara minst 2 tecken")
    .max(100, "Namnet får inte vara längre än 100 tecken"),
  email: z
    .string()
    .email("Vänligen ange en giltig e-postadress")
    .min(1, "E-postadress krävs"),
  phone: z
    .string()
    .min(10, "Telefonnummer måste vara minst 10 siffror")
    .max(20, "Telefonnummer får inte vara längre än 20 tecken")
    .regex(/^[0-9\s\-\+\(\)]+$/, "Vänligen ange ett giltigt telefonnummer"),
  company: z
    .string()
    .max(100, "Företagsnamnet får inte vara längre än 100 tecken")
    .optional(),
  subject: z
    .string()
    .min(3, "Ämnet måste vara minst 3 tecken")
    .max(200, "Ämnet får inte vara längre än 200 tecken"),
  message: z
    .string()
    .min(10, "Meddelandet måste vara minst 10 tecken")
    .max(2000, "Meddelandet får inte vara längre än 2000 tecken"),
  gdprConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "Du måste godkänna behandling av personuppgifter",
    }),
  marketingConsent: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

