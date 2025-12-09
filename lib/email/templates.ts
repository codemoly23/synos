import { ContactFormData } from "@/lib/validations/contact";
import { siteConfig } from "@/config/site";

// Helper to format addresses for email templates
function formatAddressesHtml(): string {
	return siteConfig.company.addresses
		.map(
			(addr) =>
				`<strong>${addr.name}:</strong> ${addr.street}, ${addr.postalCode} ${addr.city}`
		)
		.join("<br>\n              ");
}

function formatAddressesText(): string {
	return siteConfig.company.addresses
		.map(
			(addr) => `${addr.name}: ${addr.street}, ${addr.postalCode} ${addr.city}`
		)
		.join("\n");
}

export function getContactEmailTemplate(data: ContactFormData) {
	return {
		subject: `Ny kontaktförfrågan: ${data.subject}`,
		html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #00949e;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
            }
            .field {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #00949e;
            }
            .value {
              margin-top: 5px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Ny Kontaktförfrågan</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Namn:</div>
                <div class="value">${data.name}</div>
              </div>

              <div class="field">
                <div class="label">E-post:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>

              <div class="field">
                <div class="label">Telefon:</div>
                <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
              </div>

              ${
								data.company
									? `
              <div class="field">
                <div class="label">Företag:</div>
                <div class="value">${data.company}</div>
              </div>
              `
									: ""
							}

              <div class="field">
                <div class="label">Ämne:</div>
                <div class="value">${data.subject}</div>
              </div>

              <div class="field">
                <div class="label">Meddelande:</div>
                <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
              </div>

              <div class="field">
                <div class="label">GDPR-samtycke:</div>
                <div class="value">${data.gdprConsent ? "✓ Ja" : "✗ Nej"}</div>
              </div>

              <div class="field">
                <div class="label">Marknadsföring:</div>
                <div class="value">${data.marketingConsent ? "✓ Ja" : "✗ Nej"}</div>
              </div>
            </div>
            <div class="footer">
              <p>Detta meddelande skickades från kontaktformuläret på ${siteConfig.url.replace("https://", "").replace("http://", "")}</p>
              <p>Mottaget: ${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}</p>
            </div>
          </div>
        </body>
      </html>
    `,
		text: `
Ny Kontaktförfrågan

Namn: ${data.name}
E-post: ${data.email}
Telefon: ${data.phone}
${data.company ? `Företag: ${data.company}` : ""}
Ämne: ${data.subject}

Meddelande:
${data.message}

GDPR-samtycke: ${data.gdprConsent ? "Ja" : "Nej"}
Marknadsföring: ${data.marketingConsent ? "Ja" : "Nej"}

---
Detta meddelande skickades från kontaktformuläret på ${siteConfig.url.replace("https://", "").replace("http://", "")}
Mottaget: ${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}
    `,
	};
}

export function getAutoReplyTemplate(name: string) {
	return {
		subject: `Tack för din förfrågan - ${siteConfig.name}`,
		html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #00949e;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #00949e;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${siteConfig.name}</h1>
            </div>
            <div class="content">
              <h2>Hej ${name}!</h2>

              <p>Tack för att du kontaktar oss. Vi har tagit emot din förfrågan och återkommer till dig så snart som möjligt.</p>

              <p>Våra öppettider är:</p>
              <ul>
                <li>Måndag - Fredag: 09:00 - 17:00</li>
              </ul>

              <p>Om du har brådskande frågor är du välkommen att ringa oss på <strong>${siteConfig.company.phone}</strong>.</p>

              <p>
                <a href="${siteConfig.url}" class="button">Besök vår webbplats</a>
              </p>

              <p>Med vänliga hälsningar,<br>
              <strong>${siteConfig.company.name}</strong></p>
            </div>
            <div class="footer">
              <p><strong>${siteConfig.company.name}</strong><br>
              Org.nr: ${siteConfig.company.orgNumber}<br>
              E-post: ${siteConfig.company.email}<br>
              Telefon: ${siteConfig.company.phone}</p>

              <p>${formatAddressesHtml()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
		text: `
Hej ${name}!

Tack för att du kontaktar oss. Vi har tagit emot din förfrågan och återkommer till dig så snart som möjligt.

Våra öppettider är:
- Måndag - Fredag: 09:00 - 17:00

Om du har brådskande frågor är du välkommen att ringa oss på ${siteConfig.company.phone}.

Med vänliga hälsningar,
${siteConfig.company.name}

---
${siteConfig.company.name}
Org.nr: ${siteConfig.company.orgNumber}
E-post: ${siteConfig.company.email}
Telefon: ${siteConfig.company.phone}

${formatAddressesText()}
    `,
	};
}
