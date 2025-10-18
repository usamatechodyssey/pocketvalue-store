"use server";

import { auth } from "@/app/auth";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

// Address ka structure define karein
export interface Address {
  _id?: ObjectId | string; // Allow string for client-side objects
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  address: string;
  isDefault: boolean;
}

const DB_NAME = process.env.MONGODB_DB_NAME!;
// Action #1: Naya Address Add Karna
export async function addAddress(addressData: Omit<Address, '_id'>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated." };
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const newAddress = {
      _id: new ObjectId(),
      ...addressData,
    };

    // Agar user isay default set kar raha hai, to pehle baaki sab ko non-default karein
    if (newAddress.isDefault) {
      await usersCollection.updateOne(
        { _id: new ObjectId(session.user.id) },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }
    
    // Naya address user ke addresses array mein push karne ki koshish karein
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(session.user.id) },
        { $push: { addresses: newAddress } }
    );
        
    // Agar 'addresses' array mojood nahi tha aur update fail hua (modifiedCount === 0)
    if (result.modifiedCount === 0) {
        // To naya 'addresses' array bana kar usmein pehla address daal do
        await usersCollection.updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { addresses: [newAddress] } },
            // upsert: true yeh yaqeeni banata hai ke agar user ka document hi na ho to ban jaye
            { upsert: true }
        );
    }

    revalidatePath("/account/addresses");
    // Client ko plain object bhejein
    return { 
        success: true, 
        message: "Address added successfully.", 
        address: JSON.parse(JSON.stringify(newAddress)) as Address 
    };

  } catch (error) {
    console.error("Error adding address:", error);
    return { success: false, message: "Failed to add address." };
  }
}

// Action #2: Mojooda Address Update Karna
export async function updateAddress(addressId: string, addressData: Partial<Omit<Address, '_id'>>) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");
        
        if (addressData.isDefault) {
            await usersCollection.updateOne(
                { _id: new ObjectId(session.user.id) },
                { $set: { "addresses.$[].isDefault": false } }
            );
        }

        const updateFields: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(addressData)) {
            updateFields[`addresses.$.${key}`] = value;
        }

        await usersCollection.updateOne(
            { _id: new ObjectId(session.user.id), "addresses._id": new ObjectId(addressId) },
            { $set: updateFields }
        );

        revalidatePath("/account/addresses");
        return { success: true, message: "Address updated successfully." };

    } catch (error) {
        console.error("Error updating address:", error);
        return { success: false, message: "Failed to update address." };
    }
}

// Action #3: Address Delete Karna
export async function deleteAddress(addressId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        
        await db.collection("users").updateOne(
            { _id: new ObjectId(session.user.id) },
            { $pull: { addresses: { _id: new ObjectId(addressId) } } }
        );

        revalidatePath("/account/addresses");
        return { success: true, message: "Address deleted successfully." };

    } catch (error) {
        console.error("Error deleting address:", error);
        return { success: false, message: "Failed to delete address." };
    }
}


// Action #4: Default Address Set Karna
export async function setDefaultAddress(addressId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");
        
        await usersCollection.updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { "addresses.$[].isDefault": false } }
        );

        await usersCollection.updateOne(
            { _id: new ObjectId(session.user.id), "addresses._id": new ObjectId(addressId) },
            { $set: { "addresses.$.isDefault": true } }
        );

        revalidatePath("/account/addresses");
        return { success: true, message: "Default address updated." };

    } catch (error) {
        console.error("Error setting default address:", error);
        return { success: false, message: "Failed to set default address." };
    }
}