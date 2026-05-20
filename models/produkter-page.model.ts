import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IProdukterFaq {
	_id?: mongoose.Types.ObjectId | string;
	question: string;
	answer: string;
	visible: boolean;
	order: number;
}

export interface IProdukterFaqSection {
	title: string;
	faqs: IProdukterFaq[];
}

export interface IProdukterPage extends Document {
	_id: mongoose.Types.ObjectId;
	faqSection: IProdukterFaqSection;
	updatedAt: Date;
	createdAt: Date;
}

const ProdukterFaqSchema = new Schema<IProdukterFaq>(
	{
		question: { type: String, required: true, trim: true },
		answer: { type: String, required: true },
		visible: { type: Boolean, default: true },
		order: { type: Number, default: 0 },
	},
	{ _id: true }
);

const ProdukterFaqSectionSchema = new Schema<IProdukterFaqSection>(
	{
		title: {
			type: String,
			trim: true,
			default: "Vanliga frågor",
		},
		faqs: { type: [ProdukterFaqSchema], default: [] },
	},
	{ _id: false }
);

const DEFAULT_FAQS: Omit<IProdukterFaq, "_id">[] = [
	{
		question: "Är alla era produkter MDR-certifierade?",
		answer:
			"<p>Ja, samtliga produkter i vårt sortiment är certifierade enligt EU:s medicintekniska förordning (MDR). Detta garanterar att utrustningen uppfyller de högsta säkerhets- och kvalitetskraven inom medicinteknik.</p>",
		visible: true,
		order: 0,
	},
	{
		question: "Vilken garanti ingår vid köp av en maskin?",
		answer:
			"<p>Vi erbjuder 2 års full garanti på alla komponenter. Dessutom ingår teknisk support inom 48 timmar samt tillgång till ersättningsmaskin under serviceperioder för att minimera driftstopp i din verksamhet.</p>",
		visible: true,
		order: 1,
	},
	{
		question: "Kan jag leasa eller hyra utrustningen?",
		answer:
			"<p>Ja, vi erbjuder flexibla finansieringsalternativ – köp, leasing eller hyra. Vårt team hjälper dig att räkna fram den lösning som passar bäst för din ekonomi och dina långsiktiga mål.</p>",
		visible: true,
		order: 2,
	},
	{
		question: "Får jag utbildning när jag köper en maskin?",
		answer:
			"<p>Ja, komplett operatörsutbildning för upp till 2 personer ingår vid varje maskinköp. Utbildningen sker på plats hos er eller hos oss, och vi tillhandahåller även kontinuerliga uppdateringar och behandlingsprotokoll.</p>",
		visible: true,
		order: 3,
	},
	{
		question: "Hur snabbt får jag svar på en förfrågan?",
		answer:
			"<p>Vi återkommer alltid inom 24 timmar på alla förfrågningar. För akuta servicefrågor finns vår tekniska support tillgänglig dygnet runt och kan vara på plats inom 48 arbetstimmar.</p>",
		visible: true,
		order: 4,
	},
];

const ProdukterPageSchema = new Schema<IProdukterPage>(
	{
		faqSection: {
			type: ProdukterFaqSectionSchema,
			required: true,
			default: {
				title: "Vanliga frågor",
				faqs: DEFAULT_FAQS,
			},
		},
	},
	{
		timestamps: true,
		collection: "produkter_page",
	}
);

ProdukterPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

ProdukterPageSchema.set("toObject", { virtuals: true });

export const getProdukterPageModel = async (): Promise<
	Model<IProdukterPage>
> => {
	await connectMongoose();
	return (
		(mongoose.models.ProdukterPage as Model<IProdukterPage>) ||
		mongoose.model<IProdukterPage>("ProdukterPage", ProdukterPageSchema)
	);
};

export function getProdukterPageModelSync(): Model<IProdukterPage> {
	return (
		(mongoose.models.ProdukterPage as Model<IProdukterPage>) ||
		mongoose.model<IProdukterPage>("ProdukterPage", ProdukterPageSchema)
	);
}
