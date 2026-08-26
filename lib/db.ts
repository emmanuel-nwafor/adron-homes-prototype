import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{
  isConnected: boolean;
  dbName?: string;
  error?: string;
}> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    return {
      isConnected: false,
      error: "MONGODB_URI is not defined in environment variables. Operating in Fallback Mode.",
    };
  }

  if (cached.conn) {
    return { isConnected: true, dbName: cached.conn.connection.name };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true, dbName: cached.conn.connection.name };
  } catch (e: any) {
    cached.promise = null;
    return { isConnected: false, error: e.message };
  }
}
