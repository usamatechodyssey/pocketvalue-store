// /src/app/lib/mongodb.ts
import { MongoClient, ObjectId } from 'mongodb'; // ObjectId ko import karein

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

const DB_NAME = process.env.MONGODB_DB_NAME;
if (!DB_NAME) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DB_NAME"');
}

export async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return { client, db };
}

// === YEH NAYA HELPER FUNCTION ADD HUA HAI ===
// Yeh _id wali ghalti ko har jagah theek kar dega
export async function findOneWithId(collectionName: string, id: string) {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const { db } = await connectToDatabase();
    return db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}