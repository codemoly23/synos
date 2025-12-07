import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
	var __mongoose:
		| {
				conn: typeof mongoose | null;
				promise: Promise<typeof mongoose> | null;
		  }
		| undefined;
}

export async function connectMongoose() {
	if (global.__mongoose?.conn) {
		return global.__mongoose.conn;
	}
	if (!global.__mongoose) global.__mongoose = { conn: null, promise: null };

	if (!global.__mongoose.promise) {
		const opts = {
			// useUnifiedTopology, useNewUrlParser are handled by mongoose defaults now
			// you can set poolSize, serverSelectionTimeoutMS etc here for production tuning
			bufferCommands: false,
		};

		// console.log("🔌 [MongoDB] Connecting to:", MONGODB_URI);

		global.__mongoose.promise = mongoose
			.connect(MONGODB_URI!, opts)
			.then((mongooseInstance) => {
				// console.log("✅ [MongoDB] Connected successfully!");
				// console.log(
				// 	"✅ [MongoDB] Database name:",
				// 	mongooseInstance.connection.db?.databaseName || "unknown"
				// );
				// console.log("✅ [MongoDB] Host:", mongooseInstance.connection.host);
				return mongooseInstance;
			})
			.catch((error) => {
				console.error("❌ [MongoDB] Connection failed:", error);
				throw error;
			});
	}
	global.__mongoose.conn = await global.__mongoose.promise;
	return global.__mongoose.conn;
}
