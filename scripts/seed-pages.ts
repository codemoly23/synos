/**
 * Unified Seed script for all CMS pages
 * Run with: npx tsx scripts/seed-pages.ts
 *
 * Options:
 *   --about      Seed About page only
 *   --training   Seed Training page only
 *   --starta     Seed Starta Eget page only
 *   --careers    Seed Careers page only
 *   --legal      Seed Legal page only
 *   --all        Seed all pages (default)
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env file manually (since we're outside Next.js)
function loadEnvFile() {
	const envFiles = [".env.local", ".env"];

	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
			console.log(`Loading environment from ${envFile}...`);
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined in environment variables");
	process.exit(1);
}

// ============================================================================
// ABOUT PAGE DATA (Om Oss)
// Based on redesigned page with dark hero, mission, stats, gallery, FAQ, testimonials, partners, CTA
// ============================================================================
const aboutPageData = {
	sectionVisibility: {
		hero: true,
		mission: true,
		stats: true,
		imageGallery: true,
		faq: true,
		testimonials: true,
		partners: true,
		cta: true,
	},

	hero: {
		badge: "Om Synos Medical",
		title: "Om Oss",
		subtitle: "Sveriges ledande leverantör av professionell klinikutrustning och lasermaskiner. Vi kombinerar kvalitetsprodukter med utbildning och support i världsklass.",
	},

	mission: {
		badge: "Vår Mission",
		title: "Vi levererar kvalitet och trygghet",
		description: "Synos Medical erbjuder professionella lasermaskiner och medicinsk utrustning till kliniker och salonger i Skandinavien. Alla våra produkter är noggrant testade och tillverkade enligt den senaste forskningen. Vi vet hur viktigt det är för dig att kunna erbjuda bästa kvalitet till dina patienter - med Synos som partner kan du vara säker på att du har rätt utrustning.",
		image: "",
		features: [
			{
				icon: "Target",
				title: "Kvalitetsfokus",
				description: "Noggrant testade produkter från ledande tillverkare med fokus på kvalitet och säkerhet",
				image: "/images/kvalitetsfokus-bg.jpg",
				buttonText: "Upptäck mer →",
				buttonLink: "/produkter",
			},
			{
				icon: "Award",
				title: "Certifierad utbildning",
				description: "Fullständig utbildning ingår vid varje köp för att säkerställa optimal användning",
				image: "/images/certifierad-utbildning-bg.jpg",
				buttonText: "Upptäck mer →",
				buttonLink: "/utbildningar",
			},
			{
				icon: "Users",
				title: "Personlig kontakt",
				description: "Dedikerade experter som guidar dig genom processen från start till mål",
				image: "/images/personlig-kontakt-bg.jpg",
				buttonText: "Upptäck mer →",
				buttonLink: "/kontakt",
			},
			{
				icon: "Sparkles",
				title: "Trygg service",
				description: "2 års garanti och livstidssupport för trygghet och säkerhet",
				image: "/images/trygg-service-bg.jpg",
				buttonText: "Upptäck mer →",
				buttonLink: "/kontakt",
			},
		],
	},

	stats: [
		{ value: "500", suffix: "+", label: "Nöjda kunder" },
		{ value: "15", suffix: "+", label: "Års erfarenhet" },
		{ value: "48", suffix: "h", label: "Snabb service" },
		{ value: "100", suffix: "%", label: "Svenskt bolag" },
	],

	imageGallery: {
		title: "Våra lokaler",
		subtitle: "Besök oss i Stockholm eller Linköping",
		images: [],
	},

	faq: {
		title: "Vanliga frågor",
		subtitle: "Svar på de vanligaste frågorna om Synos Medical",
		items: [
			{
				question: "Var finns Synos Medical?",
				answer: "Vi har kontor och showroom i både Stockholm (Gävlegatan 12A) och Linköping (Brigadgatan 16). Du är alltid välkommen att besöka oss för demonstration av våra produkter.",
			},
			{
				question: "Ingår utbildning vid köp av utrustning?",
				answer: "Ja, fullständig utbildning för 2 personer ingår alltid vid köp av utrustning. Utbildningen genomförs av våra certifierade experter och anpassas efter dina behov.",
			},
			{
				question: "Vilken garanti erbjuder ni?",
				answer: "Vi erbjuder 2 års garanti på all utrustning samt 2 års fullservice på plats hos er. Dessutom har ni livstidssupport via telefon och e-post.",
			},
			{
				question: "Kan man hyra eller leasa utrustning?",
				answer: "Absolut! Vi erbjuder flexibla lösningar - köp, leasing eller hyra. Kontakta oss så hjälper vi dig hitta den bästa lösningen för din verksamhet.",
			},
			{
				question: "Hur snabbt kan ni fixa en trasig maskin?",
				answer: "Vi lagar din maskin inom 48 arbetstimmar. Vid akuta fall prioriterar vi alltid så att din verksamhet kan fortsätta så snabbt som möjligt.",
			},
		],
	},

	testimonials: {
		title: "Vad våra kunder säger",
		subtitle: "Läs om andras erfarenheter med Synos Medical",
		testimonials: [
			{
				quote: "Synos Medical har varit en fantastisk partner sedan vi startade vår klinik. Utbildningen var professionell och supporten är alltid snabb och hjälpsam.",
				author: "Maria Andersson",
				role: "Klinikägare",
				company: "Skönhetskliniken Stockholm",
				rating: 5,
			},
			{
				quote: "Kvaliteten på utrustningen är överlägsen och servicen är i världsklass. Jag rekommenderar Synos till alla kollegor i branschen.",
				author: "Johan Eriksson",
				role: "Hudterapeut",
				company: "Skin Care Clinic",
				rating: 5,
			},
			{
				quote: "Att starta egen klinik kändes överväldigande, men Synos guidade mig genom hela processen. Från val av utrustning till finansiering och utbildning.",
				author: "Sara Lindqvist",
				role: "Grundare",
				company: "Beauty Lab Göteborg",
				rating: 5,
			},
		],
	},

	partners: {
		title: "Våra partners",
		subtitle: "Vi samarbetar med ledande varumärken inom branschen",
		partners: [],
	},

	cta: {
		title: "Redo att komma igång?",
		description: "Kontakta oss idag för en kostnadsfri konsultation. Vi hjälper dig hitta rätt utrustning för din verksamhet.",
		primaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
		},
		secondaryCta: {
			text: "Se produkter",
			href: "/produkter",
		},
	},

	seo: {
		title: "Om oss - Synos Medical | Sveriges ledande leverantör av klinikutrustning",
		description: "Lär känna Synos Medical - Sveriges främsta leverantör av professionella lasermaskiner och klinikutrustning. 15+ års erfarenhet, 500+ nöjda kunder.",
		ogImage: "",
	},
};

// ============================================================================
// TRAINING PAGE DATA (Utbildningar)
// Based on redesigned page with dark hero, benefits, process steps, support, resources
// ============================================================================
const trainingPageData = {
	sectionVisibility: {
		hero: true,
		mainContent: true,
		benefits: true,
		process: true,
		support: true,
		inquiryForm: true,
		resources: true,
		richContent: false,
	},

	hero: {
		title: "Vi ser till att du kan använda vår utrustning",
		titleHighlight: "på rätt sätt",
		subtitle: "Professionell utbildning ingår alltid vid köp av utrustning från Synos Medical. Våra certifierade experter säkerställer att du får all kunskap du behöver för att erbjuda säkra och effektiva behandlingar.",
	},

	mainContent: {
		title: "Utbildning i världsklass",
		paragraphs: [
			"När du investerar i utrustning från Synos Medical får du mycket mer än bara en maskin. Du får en komplett utbildning som ger dig självförtroende och kunskap att använda din utrustning på bästa sätt.",
			"Våra utbildningar genomförs av erfarna experter som har många års praktisk erfarenhet inom branschen. De anpassar utbildningen efter dina förkunskaper och specifika behov.",
			"Efter genomgången utbildning får du certifikat och möjlighet att teckna maskin- och patientansvarsförsäkring.",
		],
	},

	benefits: [
		{
			icon: "BookOpen",
			title: "Teoretisk & Praktisk Utbildning",
			description: "Omfattande utbildning som täcker både teori och praktisk tillämpning. Du lär dig allt från grundläggande principer till avancerade tekniker.",
		},
		{
			icon: "CheckSquare",
			title: "Certifiering",
			description: "Efter genomgången utbildning får du officiellt certifikat som bekräftar din kompetens att använda utrustningen.",
		},
		{
			icon: "HeartPlus",
			title: "Patientansvarsförsäkring",
			description: "Med certifikatet kan du teckna patientansvarsförsäkring för extra trygghet i din verksamhet.",
		},
		{
			icon: "GraduationCap",
			title: "Synos Academy",
			description: "Fortsätt utvecklas med våra fördjupande kurser på Synos Academy - din portal för kontinuerlig utbildning.",
		},
	],

	processSection: {
		title: "Utbildningsprocessen",
		subtitle: "En strukturerad utbildning som ger dig all kunskap du behöver",
		steps: [
			{
				number: "1",
				title: "Initial utbildning",
				description: "2-5 dagars intensiv utbildning beroende på utrustningstyp. Kombinerar teori med praktiska övningar.",
			},
			{
				number: "2",
				title: "Praktisk träning",
				description: "Handledda behandlingar på riktiga kunder under övervakning av våra experter.",
			},
			{
				number: "3",
				title: "Certifiering",
				description: "Kunskapsprov och praktisk examination. Vid godkänt resultat utfärdas officiellt certifikat.",
			},
			{
				number: "4",
				title: "Uppföljning",
				description: "Kontinuerlig support och möjlighet till vidareutbildning genom Synos Academy.",
			},
		],
	},

	supportSection: {
		title: "Support när du behöver det",
		paragraphs: [
			"Efter utbildningen är du aldrig ensam. Vårt supportteam finns alltid tillgängligt för att svara på frågor och ge vägledning.",
			"Vi erbjuder support via telefon, e-post och på plats. Vid akuta frågor prioriterar vi alltid att hjälpa dig snabbt.",
		],
		phone: "010-205 15 01",
		email: "info@synos.se",
	},

	inquirySection: {
		badge: "Utbildningsförfrågan",
		title: "Intresserad av våra utbildningar?",
		subtitle: "Fyll i formuläret så kontaktar vi dig för att diskutera dina behov och svara på eventuella frågor.",
	},

	resourcesSection: {
		title: "Relaterade resurser",
		subtitle: "Utforska mer om hur vi kan hjälpa dig lyckas",
		resources: [
			{
				title: "Synos Academy",
				description: "Vår digitala plattform för fördjupande kurser och certifieringar. Fortsätt utvecklas i din egen takt.",
				href: "https://synos.academy/",
				buttonText: "Besök Academy",
			},
			{
				title: "Miniutbildning",
				description: "En kortare introduktion som ger dig grundläggande kunskap om laserbehandlingar och utrustning.",
				href: "/starta-eget/miniutbildning",
				buttonText: "Läs mer",
			},
			{
				title: "Starta eget",
				description: "Drömmer du om att öppna egen klinik? Vi guidar dig genom hela processen från start till mål.",
				href: "/starta-eget",
				buttonText: "Kom igång",
			},
		],
	},

	seo: {
		title: "Utbildningar - Synos Medical | Certifierad laserterapeut-utbildning",
		description: "Professionell utbildning ingår vid köp av utrustning från Synos Medical. Bli certifierad laserterapeut med vår omfattande teoretiska och praktiska utbildning.",
		ogImage: "",
	},
};

// ============================================================================
// STARTA EGET PAGE DATA
// Based on redesigned page with dark hero, benefits, features, FAQ, resources, contact form
// ============================================================================
const startaEgetPageData = {
	sectionVisibility: {
		hero: true,
		mainContent: true,
		benefits: true,
		features: true,
		contactForm: true,
		resources: true,
		richContent: false,
	},

	hero: {
		title: "Drömmer du om frihet och framgång?",
		titleHighlight: "Starta klinik med Synos!",
		subtitle: "Att starta och driva en egen hudvårdsklinik måste inte vara svårt och tidskrävande. Med Synos som partner får du all hjälp du behöver - från val av utrustning och finansiering till utbildning och marknadsföring.",
		callout: "I så fall är Synos Medical rätt samarbetspartner för dig!",
	},

	mainContent: {
		title: "Vi hjälper dig förverkliga din dröm",
		subtitle: "Din partner genom hela resan",
		paragraphs: [
			"Är du hudterapeut och funderar på att starta eget? Då har du kommit rätt! Synos Medical har hjälpt hundratals entreprenörer att starta sina egna framgångsrika kliniker.",
			"Vi vet att steget från anställd till egen företagare kan kännas stort. Därför erbjuder vi ett komplett paket som täcker allt från uppstart till långsiktig tillväxt. Du får personlig vägledning av våra experter som har lång erfarenhet av att hjälpa nya klinikägare.",
			"Med Synos får du inte bara tillgång till marknadens bästa utrustning - du får en partner som finns med dig hela vägen. Vi tror på långsiktiga relationer byggda på förtroende och ömsesidig framgång.",
		],
	},

	benefits: [
		{
			icon: "GraduationCap",
			title: "Personlig utbildning",
			description: "Fullständig utbildning för dig och din personal. Lär dig använda utrustningen på rätt sätt och bli certifierad laserterapeut.",
		},
		{
			icon: "Shield",
			title: "Finansieringslösningar",
			description: "Flexibla finansieringsalternativ som passar din situation. Köp, leasa eller hyr utrustning efter dina behov.",
		},
		{
			icon: "Settings",
			title: "Service & support",
			description: "2 års fullservice på plats, 2 års garanti och livstidssupport. Vi finns alltid tillgängliga när du behöver hjälp.",
		},
		{
			icon: "Award",
			title: "Försäkringar",
			description: "Efter genomgången utbildning kan du teckna maskin- och patientansvarsförsäkring för trygg verksamhet.",
		},
		{
			icon: "Users",
			title: "Marknadsföring",
			description: "Vi hjälper dig med marknadsföringsmaterial och tips för att attrahera och behålla kunder.",
		},
		{
			icon: "Star",
			title: "Nätverk",
			description: "Bli del av vårt nätverk med hundratals klinikägare. Utbyt erfarenheter och lär av varandra.",
		},
	],

	featuresSection: {
		title: "Allt du behöver för att lyckas",
		intro: "När du väljer Synos Medical som partner får du mycket mer än bara utrustning. Du får ett komplett stöd som ger dig de bästa förutsättningarna att lyckas.",
		features: [
			{
				title: "Val av utrustning",
				description: "Vi hjälper dig välja rätt utrustning baserat på din målgrupp, budget och verksamhetsplan.",
			},
			{
				title: "Affärsplanering",
				description: "Få hjälp att ta fram en realistisk affärsplan med intäktsprognoser och marknadsanalys.",
			},
			{
				title: "Lokalsökning",
				description: "Tips och råd kring val av lokal, inredning och praktiska krav för en klinik.",
			},
			{
				title: "Juridisk vägledning",
				description: "Information om tillstånd, registreringar och regelverk som gäller för din verksamhet.",
			},
			{
				title: "Finansiering",
				description: "Kontakt med banker och finansbolag samt hjälp att ta fram underlag för lånansökan.",
			},
			{
				title: "Kontinuerlig utveckling",
				description: "Löpande vidareutbildning och tillgång till nya behandlingsmetoder genom Synos Academy.",
			},
		],
	},

	resourcesSection: {
		title: "Resurser för dig som vill starta eget",
		subtitle: "Användbara guider och verktyg för din resa mot egen klinik",
		resources: [
			{
				title: "Köpguide",
				description: "En omfattande guide som hjälper dig välja rätt utrustning för din kommande klinik.",
				href: "/starta-eget/kopguide",
				buttonText: "Läs guiden",
			},
			{
				title: "Miniutbildning",
				description: "Få grundläggande kunskap om laserbehandlingar innan du investerar i utrustning.",
				href: "/starta-eget/miniutbildning",
				buttonText: "Anmäl dig",
			},
			{
				title: "Utbildningar",
				description: "Läs mer om våra certifierade utbildningar som ingår vid köp av utrustning.",
				href: "/utbildningar",
				buttonText: "Se utbildningar",
			},
		],
	},

	seo: {
		title: "Starta eget - Synos Medical | Öppna egen hudvårdsklinik",
		description: "Drömmer du om att starta egen klinik? Synos Medical hjälper dig med allt du behöver - utrustning, finansiering, utbildning och support. Kontakta oss idag!",
		ogImage: "",
	},
};

// ============================================================================
// CAREERS PAGE DATA (Lediga Tjänster)
// Based on redesigned page with dark hero, job listings, contact sidebar
// ============================================================================
const careersPageData = {
	sectionVisibility: {
		hero: true,
		benefits: true,
		jobOpenings: true,
		values: true,
		applicationForm: true,
	},

	hero: {
		badge: "Karriär hos Synos",
		title: "Driving Traders Toward",
		titleHighlight: "Daily Wins",
		subtitle: "Bli en del av Synos Medical-teamet. Vi söker engagerade medarbetare som vill växa tillsammans med oss och göra skillnad i branschen.",
	},

	benefitsSection: {
		title: "Varför jobba hos oss?",
		subtitle: "Vi erbjuder en stimulerande arbetsmiljö med stora möjligheter",
		benefits: [
			{
				icon: "Briefcase",
				title: "Flexibla arbetstider",
				description: "Vi tror på balans mellan arbete och privatliv. Flexibla arbetstider gör det möjligt att planera din dag.",
			},
			{
				icon: "TrendingUp",
				title: "Karriärutveckling",
				description: "Möjlighet till kontinuerlig kompetensutveckling och karriärmöjligheter inom företaget.",
			},
			{
				icon: "Users",
				title: "Fantastiskt team",
				description: "Jobba tillsammans med engagerade kollegor som brinner för att hjälpa kunder lyckas.",
			},
			{
				icon: "Heart",
				title: "Hälsoförmåner",
				description: "Friskvårdsbidrag, sjukvårdsförsäkring och andra förmåner för din hälsa och välbefinnande.",
			},
		],
	},

	jobOpeningsSection: {
		title: "Success Journey",
		subtitle: "Utforska våra lediga tjänster och ta nästa steg i din karriär.",
		noJobsMessage: "Vi har för närvarande inga öppna positioner, men vi tar alltid emot spontanansökningar! Skicka din ansökan till karriar@synos.se",
		jobOpenings: [
			{
				slug: "account-manager-stockholm",
				title: "Account Manager",
				location: "Stockholm, Sverige",
				workType: "On-site",
				employmentType: "Heltid",
				shortDescription: "Vi söker en driven Account Manager som vill vara med och utveckla våra kundrelationer och driva försäljning av medicinsk utrustning.",
				featuredImage: "",
				description: "<p>Som Account Manager hos Synos Medical blir du en nyckelperson i vårt säljteam. Du kommer att arbeta med att utveckla långsiktiga kundrelationer och hjälpa kliniker att hitta rätt utrustning för deras behov.</p><p>Du kommer att arbeta både med befintliga kunder och nykundsbearbetning. Vi erbjuder en stimulerande arbetsmiljö med goda utvecklingsmöjligheter.</p>",
				requirements: [
					"Minst 3 års erfarenhet av B2B-försäljning",
					"Erfarenhet av medicinsk/estetisk bransch är meriterande",
					"Utmärkta kommunikationsförmågor på svenska och engelska",
					"B-körkort",
					"Resultatorienterad med förmåga att arbeta självständigt",
				],
				responsibilities: [
					"Utveckla och underhålla kundrelationer",
					"Identifiera och bearbeta nya affärsmöjligheter",
					"Genomföra produktdemonstrationer hos kunder",
					"Uppnå och överträffa försäljningsmål",
					"Samarbeta med marketing och support för bästa kundupplevelse",
				],
				applyLink: "mailto:karriar@synos.se?subject=Ansökan: Account Manager Stockholm",
				isActive: true,
				publishedAt: new Date(),
			},
			{
				slug: "teknisk-support-linkoping",
				title: "Teknisk Supportspecialist",
				location: "Linköping, Sverige",
				workType: "Hybrid",
				employmentType: "Heltid",
				shortDescription: "Vi söker en tekniskt kunnig person som kan ge support till våra kunder och hjälpa till med installation och service av medicinsk utrustning.",
				featuredImage: "",
				description: "<p>Som Teknisk Supportspecialist hos Synos Medical är du den som hjälper våra kunder när de behöver teknisk assistans. Du kommer att arbeta med både support på distans och servicebesök hos kunder.</p><p>Rollen passar dig som är tekniskt intresserad och gillar att lösa problem. Du får arbeta med avancerad medicinsk utrustning och blir en viktig del av vårt serviceteam.</p>",
				requirements: [
					"Teknisk utbildning eller motsvarande erfarenhet",
					"Erfarenhet av kundservice/support",
					"God problemlösningsförmåga",
					"B-körkort (servicebesök hos kunder)",
					"Flytande svenska, god engelska",
				],
				responsibilities: [
					"Ge teknisk support via telefon och e-post",
					"Genomföra servicebesök och installationer hos kunder",
					"Dokumentera supportärenden och lösningar",
					"Utbilda kunder i användning av utrustning",
					"Bidra till förbättring av supportprocesser",
				],
				applyLink: "mailto:karriar@synos.se?subject=Ansökan: Teknisk Support Linköping",
				isActive: true,
				publishedAt: new Date(),
			},
			{
				slug: "utbildare-laserteknik",
				title: "Utbildare - Laserteknik",
				location: "Stockholm / Linköping",
				workType: "On-site",
				employmentType: "Heltid",
				shortDescription: "Vill du dela med dig av din kunskap? Vi söker en erfaren utbildare inom laserteknik som kan utbilda våra kunder i säker och effektiv användning av laserbehandlingar.",
				featuredImage: "",
				description: "<p>Som Utbildare hos Synos Medical kommer du att ansvara för utbildning av kunder som köpt utrustning av oss. Du kommer att planera och genomföra både teoretiska och praktiska utbildningsmoment.</p><p>Rollen passar dig som har gedigen erfarenhet av laserbehandlingar och brinner för att lära ut. Du blir en ambassadör för Synos och spelar en viktig roll i våra kunders framgång.</p>",
				requirements: [
					"Certifierad laserterapeut med minst 5 års erfarenhet",
					"Erfarenhet av att utbilda/handleda andra",
					"Utmärkta pedagogiska förmågor",
					"God kunskap om säkerhetsföreskrifter",
					"Flytande svenska och engelska",
				],
				responsibilities: [
					"Planera och genomföra kundutbildningar",
					"Utveckla utbildningsmaterial och kurser",
					"Säkerställa att kunder får certifiering efter genomförd utbildning",
					"Hålla dig uppdaterad om nya behandlingsmetoder",
					"Bidra till utveckling av Synos Academy",
				],
				applyLink: "mailto:karriar@synos.se?subject=Ansökan: Utbildare Laserteknik",
				isActive: true,
				publishedAt: new Date(),
			},
		],
	},

	valuesSection: {
		title: "Våra värderingar",
		subtitle: "Det här är vad som driver oss framåt",
		values: [
			"Kundframgång först - vi lyckas när våra kunder lyckas",
			"Kvalitet utan kompromiss - vi levererar alltid det bästa",
			"Kontinuerlig utveckling - vi lär och växer tillsammans",
			"Teamwork - vi stöttar varandra och firar framgångar",
		],
	},

	contactSidebar: {
		title: "Alltid nära dig",
		address: "Gävlegatan 12A, 113 30 Stockholm",
		email: "karriar@synos.se",
		phone: "010-205 15 01",
		secondaryPhone: "",
		formTitle: "Säg hej!",
	},

	expertCta: {
		badge: "Vi stöttar dig",
		title: "Prata med vårt HR-team",
		subtitle: "Har du frågor om att jobba hos oss? Tveka inte att höra av dig - vi berättar gärna mer om hur det är att vara en del av Synos-teamet.",
	},

	seo: {
		title: "Lediga Tjänster - Synos Medical | Karriär inom medicinsk utrustning",
		description: "Se våra lediga tjänster och bli en del av Synos Medical-teamet. Vi söker engagerade medarbetare som vill växa med oss. Ansök idag!",
		ogImage: "",
	},
};

// ============================================================================
// LEGAL PAGE DATA (Juridisk Information)
// Based on redesigned page with dark hero, legal cards, company info, terms, GDPR rights
// ============================================================================
const legalPageData = {
	sectionVisibility: {
		hero: true,
		legalCards: true,
		companyInfo: true,
		terms: true,
		gdprRights: true,
		cta: true,
	},

	hero: {
		badge: "Juridisk Information",
		title: "Juridisk Information",
		subtitle: "Här hittar du viktig information om våra villkor, integritetspolicy och dina rättigheter som kund hos Synos Medical.",
	},

	legalCards: [
		{
			icon: "Shield",
			title: "Integritetspolicy",
			description: "Läs om hur vi samlar in, använder och skyddar dina personuppgifter enligt GDPR.",
			href: "/integritetspolicy",
			highlights: [
				"GDPR-kompatibel",
				"Transparent datahantering",
				"Dina rättigheter",
			],
		},
		{
			icon: "FileText",
			title: "Allmänna villkor",
			description: "Våra allmänna villkor för köp, garanti och service av produkter och tjänster.",
			href: "#allmanna-villkor",
			highlights: [
				"Köpvillkor",
				"Garantivillkor",
				"Servicevillkor",
			],
		},
		{
			icon: "Scale",
			title: "Köpvillkor",
			description: "Detaljerad information om betalning, leverans, ångerrätt och reklamation.",
			href: "#kopvillkor",
			highlights: [
				"Betalningsalternativ",
				"Leveransinformation",
				"Ångerrätt",
			],
		},
		{
			icon: "Cookie",
			title: "Cookies",
			description: "Information om hur vi använder cookies på vår webbplats för att förbättra din upplevelse.",
			href: "/cookies",
			highlights: [
				"Nödvändiga cookies",
				"Analyscookies",
				"Marknadsföringscookies",
			],
		},
	],

	companyInfo: {
		companyName: "Synos Medical AB",
		organizationNumber: "559350-5765",
		vatNumber: "SE559350576501",
		registeredSeat: "Stockholm",
		offices: [
			{
				name: "Huvudkontor Stockholm",
				address: "Gävlegatan 12A, 113 30 Stockholm",
			},
			{
				name: "Kontor Linköping",
				address: "Brigadgatan 16, 587 58 Linköping",
			},
		],
		email: "info@synos.se",
		phone: "010-205 15 01",
	},

	termsSection: {
		title: "Allmänna villkor",
		terms: [
			{
				title: "1. Beställning och avtal",
				content: "Avtal om köp ingås när vi bekräftat din beställning via e-post. Vi förbehåller oss rätten att neka beställningar om det finns felaktigheter i prissättning eller lagerstatus.",
			},
			{
				title: "2. Priser och betalning",
				content: "Alla priser anges i SEK exklusive moms om inget annat anges. Vi erbjuder olika betalningsalternativ inklusive faktura, kortbetalning och finansiering via våra samarbetspartners.",
			},
			{
				title: "3. Leverans",
				content: "Leveranstid varierar beroende på produkt och lagerstatus. Vi meddelar alltid förväntad leveranstid vid orderbekräftelse. Leverans sker med försäkrad frakt.",
			},
			{
				title: "4. Garanti",
				content: "Vi erbjuder 2 års garanti på all utrustning. Garantin omfattar material- och tillverkningsfel. Garantin gäller inte för förslitning vid normal användning.",
			},
			{
				title: "5. Service och underhåll",
				content: "Vi erbjuder serviceavtal för regelbundet underhåll av utrustning. Vid akut service prioriterar vi ärenden och strävar efter att lösa problem inom 48 timmar.",
			},
			{
				title: "6. Ångerrätt",
				content: "För konsumenter gäller 14 dagars ångerrätt enligt distansavtalslagen. Ångerrätten gäller inte för specialbeställda produkter eller tjänster som påbörjats.",
			},
			{
				title: "7. Reklamation",
				content: "Reklamation ska göras skriftligen inom skälig tid efter att fel upptäckts. Kontakta oss via e-post eller telefon för att inleda reklamationsärende.",
			},
		],
	},

	gdprSection: {
		title: "Dina GDPR-rättigheter",
		rights: [
			{
				title: "Rätt till tillgång",
				description: "Du har rätt att få veta vilka personuppgifter vi behandlar om dig.",
			},
			{
				title: "Rätt till rättelse",
				description: "Du har rätt att få felaktiga uppgifter rättade.",
			},
			{
				title: "Rätt till radering",
				description: "Under vissa förutsättningar har du rätt att få dina uppgifter raderade.",
			},
			{
				title: "Rätt till begränsning",
				description: "Du har rätt att begränsa behandlingen av dina uppgifter.",
			},
			{
				title: "Rätt till dataportabilitet",
				description: "Du har rätt att få ut dina uppgifter i ett maskinläsbart format.",
			},
			{
				title: "Rätt att invända",
				description: "Du har rätt att invända mot behandling för direktmarknadsföring.",
			},
		],
		primaryCta: {
			text: "Läs integritetspolicyn",
			href: "/integritetspolicy",
		},
		secondaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
		},
	},

	ctaSection: {
		text: "Har du frågor om våra villkor eller behöver hjälp med något juridiskt? Tveka inte att kontakta oss - vi hjälper dig gärna.",
		primaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
		},
		secondaryCta: {
			text: "Ring oss: 010-205 15 01",
			href: "tel:0102051501",
		},
	},

	seo: {
		title: "Juridisk Information - Synos Medical | Villkor och integritetspolicy",
		description: "Läs om Synos Medicals allmänna villkor, integritetspolicy, GDPR-rättigheter och företagsinformation. Transparent och pålitligt.",
		ogImage: "",
	},
};

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedAboutPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding About Page ---");
	const collection = db.collection("about_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("About page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...aboutPageData, updatedAt: new Date() } }
		);
		console.log("✓ About page updated successfully!");
	} else {
		console.log("Creating new about page document...");
		await collection.insertOne({
			...aboutPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ About page created successfully!");
	}
}

async function seedTrainingPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Training Page ---");
	const collection = db.collection("training_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Training page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...trainingPageData, updatedAt: new Date() } }
		);
		console.log("✓ Training page updated successfully!");
	} else {
		console.log("Creating new training page document...");
		await collection.insertOne({
			...trainingPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Training page created successfully!");
	}
}

async function seedStartaEgetPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Starta Eget Page ---");
	const collection = db.collection("starta_eget_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Starta Eget page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...startaEgetPageData, updatedAt: new Date() } }
		);
		console.log("✓ Starta Eget page updated successfully!");
	} else {
		console.log("Creating new Starta Eget page document...");
		await collection.insertOne({
			...startaEgetPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Starta Eget page created successfully!");
	}
}

async function seedCareersPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Careers Page ---");
	const collection = db.collection("careers_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Careers page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...careersPageData, updatedAt: new Date() } }
		);
		console.log("✓ Careers page updated successfully!");
	} else {
		console.log("Creating new Careers page document...");
		await collection.insertOne({
			...careersPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Careers page created successfully!");
	}
}

async function seedLegalPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Legal Page ---");
	const collection = db.collection("legal_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Legal page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...legalPageData, updatedAt: new Date() } }
		);
		console.log("✓ Legal page updated successfully!");
	} else {
		console.log("Creating new Legal page document...");
		await collection.insertOne({
			...legalPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Legal page created successfully!");
	}
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
	const args = process.argv.slice(2);
	const seedAbout = args.includes("--about") || args.includes("--all") || args.length === 0;
	const seedTraining = args.includes("--training") || args.includes("--all") || args.length === 0;
	const seedStarta = args.includes("--starta") || args.includes("--all") || args.length === 0;
	const seedCareers = args.includes("--careers") || args.includes("--all") || args.length === 0;
	const seedLegal = args.includes("--legal") || args.includes("--all") || args.length === 0;

	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		if (seedAbout) await seedAboutPage(db);
		if (seedTraining) await seedTrainingPage(db);
		if (seedStarta) await seedStartaEgetPage(db);
		if (seedCareers) await seedCareersPage(db);
		if (seedLegal) await seedLegalPage(db);

		console.log("\n========================================");
		console.log("PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================");
		console.log("\nSeeded pages:");
		if (seedAbout) console.log("  ✓ About Page (Om Oss)");
		if (seedTraining) console.log("  ✓ Training Page (Utbildningar)");
		if (seedStarta) console.log("  ✓ Starta Eget Page");
		if (seedCareers) console.log("  ✓ Careers Page (Lediga Tjänster)");
		if (seedLegal) console.log("  ✓ Legal Page (Juridisk Information)");
		console.log("\nYou can now view these pages:");
		if (seedAbout) console.log("  - /om-oss");
		if (seedTraining) console.log("  - /utbildningar");
		if (seedStarta) console.log("  - /starta-eget");
		if (seedCareers) console.log("  - /om-oss/lediga-tjanster");
		if (seedLegal) console.log("  - /om-oss/juridisk-information");
		console.log("\nManage content in the dashboard:");
		if (seedAbout) console.log("  - /dashboard/webbplats/om-oss");
		if (seedTraining) console.log("  - /dashboard/webbplats/utbildningar");
		if (seedStarta) console.log("  - /dashboard/webbplats/starta-eget");
		if (seedCareers) console.log("  - /dashboard/webbplats/lediga-tjanster");
		if (seedLegal) console.log("  - /dashboard/webbplats/juridisk-information");
		console.log("\n========================================\n");
	} catch (error) {
		console.error("Error seeding pages:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

main();
