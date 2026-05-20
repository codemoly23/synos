import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IKlinikFaq {
	_id?: mongoose.Types.ObjectId | string;
	question: string;
	answer: string;
	visible: boolean;
	order: number;
}

export interface IKlinikFaqSection {
	title: string;
	faqs: IKlinikFaq[];
}

export interface IKlinikHeroSection {
	title: string;
	subtitle: string;
	bulletPoints: string[];
	bgMobile: string;
	bgDesktop: string;
}

export interface IKlinikutrustningPage extends Document {
	_id: mongoose.Types.ObjectId;
	faqSection: IKlinikFaqSection;
	heroSection: IKlinikHeroSection;
	updatedAt: Date;
	createdAt: Date;
}

const KlinikFaqSchema = new Schema<IKlinikFaq>(
	{
		question: { type: String, required: true, trim: true },
		answer: { type: String, required: true },
		visible: { type: Boolean, default: true },
		order: { type: Number, default: 0 },
	},
	{ _id: true }
);

const KlinikFaqSectionSchema = new Schema<IKlinikFaqSection>(
	{
		title: {
			type: String,
			trim: true,
			default: "Vanliga frågor om klinikutrustning",
		},
		faqs: { type: [KlinikFaqSchema], default: [] },
	},
	{ _id: false }
);

const DEFAULT_FAQS: Omit<IKlinikFaq, "_id">[] = [
	{
		question: "Vilken laser passar bäst för min klinik?",
		answer:
			"<p>Valet av laser beror på vilka behandlingar du vill erbjuda och din målgrupp. För hårborttagning passar alexandrit- och Nd:YAG-lasrar bäst, medan tatueringsborttagning kräver Q-switched-teknik. Kontakta oss för en kostnadsfri behovsanalys där vi hjälper dig att hitta rätt utrustning.</p>",
		visible: true,
		order: 0,
	},
	{
		question: "Är det säkert att använda laserutrustning på alla hudtyper?",
		answer:
			"<p>Ja, men det kräver rätt utrustning och rätt inställningar. Våra maskiner är utvecklade för att kunna anpassas till samtliga hudtyper enligt Fitzpatrick-skalan. Vid operatörsutbildningen får ni komplett kunskap om hur ni säkert behandlar olika hudtyper.</p>",
		visible: true,
		order: 1,
	},
	{
		question: "Hur lång är leveranstiden på en ny maskin?",
		answer:
			"<p>Leveranstiden varierar mellan 2–6 veckor beroende på modell och tillgänglighet i lager. Vid akut behov kan vi i många fall ordna ersättningsmaskin under tiden. Kontakta oss för aktuella leveranstider.</p>",
		visible: true,
		order: 2,
	},
	{
		question: "Erbjuder ni service och reparationer?",
		answer:
			"<p>Ja, vi har egen serviceavdelning med certifierade tekniker. Vi erbjuder både planerat underhåll och akuta reparationer, med en garanterad responstid på 48 arbetstimmar. Under serviceperioder kan ni få tillgång till en ersättningsmaskin.</p>",
		visible: true,
		order: 3,
	},
	{
		question: "Kan jag se en maskin innan jag köper?",
		answer:
			"<p>Absolut. Vi erbjuder kostnadsfria demonstrationer både hos er klinik och på vårt huvudkontor. Vid demonstrationen får ni testa maskinen, ställa frågor till våra experter och få en personlig ROI-beräkning för din verksamhet.</p>",
		visible: true,
		order: 4,
	},
];

const KlinikHeroSectionSchema = new Schema<IKlinikHeroSection>(
	{
		title: { type: String, trim: true, default: "" },
		subtitle: { type: String, trim: true, default: "" },
		bulletPoints: { type: [String], default: [] },
		bgMobile: { type: String, default: "" },
		bgDesktop: { type: String, default: "" },
	},
	{ _id: false }
);

const KlinikutrustningPageSchema = new Schema<IKlinikutrustningPage>(
	{
		faqSection: {
			type: KlinikFaqSectionSchema,
			required: true,
			default: {
				title: "Vanliga frågor om klinikutrustning",
				faqs: DEFAULT_FAQS,
			},
		},
		heroSection: {
			type: KlinikHeroSectionSchema,
			default: {
				title: "",
				subtitle: "",
				bulletPoints: [],
				bgMobile: "",
				bgDesktop: "",
			},
		},
	},
	{
		timestamps: true,
		collection: "klinikutrustning_page",
	}
);

KlinikutrustningPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

KlinikutrustningPageSchema.set("toObject", { virtuals: true });

function buildKlinikutrustningPageModel(): Model<IKlinikutrustningPage> {
	const cached = mongoose.models.KlinikutrustningPage as Model<IKlinikutrustningPage> | undefined;
	if (cached) {
		// Recompile if heroSection field is missing (stale HMR cache)
		if (cached.schema.path("heroSection")) return cached;
		delete mongoose.models.KlinikutrustningPage;
		delete (mongoose as unknown as { modelSchemas?: Record<string, unknown> }).modelSchemas?.KlinikutrustningPage;
	}
	return mongoose.model<IKlinikutrustningPage>("KlinikutrustningPage", KlinikutrustningPageSchema);
}

export const getKlinikutrustningPageModel = async (): Promise<
	Model<IKlinikutrustningPage>
> => {
	await connectMongoose();
	return buildKlinikutrustningPageModel();
};

export function getKlinikutrustningPageModelSync(): Model<IKlinikutrustningPage> {
	return buildKlinikutrustningPageModel();
}
