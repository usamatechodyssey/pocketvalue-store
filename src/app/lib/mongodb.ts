// /src/app/lib/mongodb.ts (RECREATED FOR AUTH.JS ADAPTER)

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow global `var` declarations
   
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// --- SUMMARY OF CHANGES ---
// - This file has been recreated from the version you previously provided.
// - It correctly sets up a cached, reusable MongoClient connection promise.
// - This is the exact format required by the `@auth/mongodb-adapter` to manage sessions, users, and accounts in your database.
// - The `connectToDatabase` and `findOneWithId` helpers have been removed as they are no longer needed for the auth system.