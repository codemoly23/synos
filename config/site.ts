export const siteConfig = {
  name: "Synos Medical",
  description:
    "Sveriges ledande leverantör av MDR-certifierad klinikutrustning för laser, hårborttagning, tatueringsborttagning och hudföryngring.",
  url: "https://www.synos.se",
  ogImage: "https://www.synos.se/og-image.jpg",
  links: {
    facebook: "https://www.facebook.com/synosmedical",
    instagram: "https://www.instagram.com/synosmedical",
    linkedin: "https://www.linkedin.com/company/synos-medical",
  },
  company: {
    name: "Synos Medical AB",
    orgNumber: "556871-8075",
    email: "info@synos.se",
    phone: "010-205 15 01",
    addresses: [
      {
        name: "Stockholm",
        street: "Turebergsvägen 5",
        postalCode: "19147",
        city: "Stockholm",
        country: "Sverige",
        lat: 59.4196154,
        lng: 17.9620161,
      },
      {
        name: "Linköping",
        street: "Datalinjen 5",
        postalCode: "58330",
        city: "Linköping",
        country: "Sverige",
        lat: 58.4196154,
        lng: 15.6620161,
      },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;

