import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error("Missing MONGODB_URI environment variable");
}
const uri = process.env.MONGODB_URI;

// Optional MongoClient options (tweak poolSize etc in prod)
const options = {
	// keep defaults, add e.g. maxPoolSize if needed
};

declare global {
	// allow caching across module reloads in dev
	var __mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
	// In dev: reuse global promise to avoid many connections during HMR
	if (!global.__mongoClientPromise) {
		client = new MongoClient(uri, options);
		global.__mongoClientPromise = client.connect();
	}
	clientPromise = global.__mongoClientPromise;
} else {
	// In production, create a client instance (hosted envs usually reuse process)
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
	return clientPromise;
}
