import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { Address } from "@/app/actions/addressActions";
import AddressClient from "./_components/AddressClient";

const DB_NAME = process.env.MONGODB_DB_NAME!;
// Naya database function jo direct 'users' collection se addresses layega
async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user || !user.addresses) {
      return [];
    }
    
    // --- FINAL FIX IS HERE ---
    // MongoDB ke BSON data ko plain JSON mein convert karna zaroori hai
    return JSON.parse(JSON.stringify(user.addresses));

  } catch (error) {
    console.error("Failed to fetch user addresses:", error);
    return [];
  }
}

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?redirect=/account/addresses");
  }

  const addresses = await getUserAddresses(session.user.id);

  return (
    <div>
      <AddressClient initialAddresses={addresses} />
    </div>
  );
}