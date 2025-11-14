
// /src/app/actions/addressActions.ts (REFACTORED WITH ZOD)

"use server";

import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectMongoose from "@/app/lib/mongoose";
import User, { IAddress } from "@/models/User";
// === THE FIX IS HERE: Import Zod and our new AddressSchema ===
import { z } from "zod";
import { AddressSchema } from "@/app/lib/zodSchemas";

// This is our DTO, which is now derived from the Zod schema
export type ClientAddress = z.infer<typeof AddressSchema> & {
  _id: string;
  isDefault: boolean;
  lat?: number | null;
  lng?: number | null;
};
// =======================================================

interface ServerResponse {
  success: boolean;
  message: string;
}

// === ACTION #1: SAVE A NEW ADDRESS (Refactored with Zod) ===
export async function saveAddress(
  addressData: Omit<ClientAddress, '_id' | 'isDefault' | 'lat' | 'lng'>,
  isDefault: boolean
): Promise<ServerResponse & { newAddress?: ClientAddress }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }

  // --- Step 1: Validate with Zod ---
  const validatedFields = AddressSchema.safeParse(addressData);
  if (!validatedFields.success) {
      return {
          success: false,
          message: validatedFields.error.issues[0].message,
      };
  }
  // From here, we use the clean, validated data
  const { fullName, phone, province, city, area, address } = validatedFields.data;
  
  try {
    await connectMongoose();
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, message: "User not found." };

    if (isDefault) {
      user.addresses.forEach((addr: IAddress) => { addr.isDefault = false; });
    }

    // Use the validated data to create the new address
    const newAddress = { fullName, phone, province, city, area, address, isDefault } as IAddress;
    user.addresses.push(newAddress);

    await user.save();

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    
    const savedAddress = user.addresses[user.addresses.length - 1];
    const newClientAddress: ClientAddress = {
        _id: savedAddress._id.toString(),
        fullName: savedAddress.fullName,
        phone: savedAddress.phone,
        province: savedAddress.province,
        city: savedAddress.city,
        area: savedAddress.area,
        address: savedAddress.address,
        isDefault: savedAddress.isDefault,
        lat: savedAddress.lat,
        lng: savedAddress.lng,
    };

    return { success: true, message: "Address saved successfully!", newAddress: newClientAddress };

  } catch (error) {
    console.error("Error in saveAddress:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

// === ACTION #2: UPDATE AN EXISTING ADDRESS (Refactored with Zod) ===
export async function updateAddress(
  addressId: string, 
  addressData: Omit<ClientAddress, '_id' | 'isDefault' | 'lat' | 'lng'>, 
  isDefault: boolean
): Promise<ServerResponse & { updatedAddress?: ClientAddress }> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Authentication required." };

    // --- Step 1: Validate with Zod ---
    const validatedFields = AddressSchema.safeParse(addressData);
    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.issues[0].message,
        };
    }
    const { fullName, phone, province, city, area, address } = validatedFields.data;

    try {
        await connectMongoose();
        const user = await User.findById(session.user.id);
        if (!user) return { success: false, message: "User not found." };

        const addressToUpdate = user.addresses.id(addressId);
        if (!addressToUpdate) return { success: false, message: "Address not found." };

        if (isDefault) {
            user.addresses.forEach((addr: IAddress) => { addr.isDefault = false; });
        }

        // Use the validated data to update the address
        Object.assign(addressToUpdate, { fullName, phone, province, city, area, address, isDefault });
        
        await user.save();

        revalidatePath("/account/addresses");
        revalidatePath("/checkout");

        const updatedClientAddress: ClientAddress = {
            _id: addressToUpdate._id.toString(),
            fullName: addressToUpdate.fullName,
            phone: addressToUpdate.phone,
            province: addressToUpdate.province,
            city: addressToUpdate.city,
            area: addressToUpdate.area,
            address: addressToUpdate.address,
            isDefault: addressToUpdate.isDefault,
            lat: addressToUpdate.lat,
            lng: addressToUpdate.lng,
        };

        return { success: true, message: "Address updated successfully.", updatedAddress: updatedClientAddress };

    } catch (error) {
        console.error("Error in updateAddress:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}
// === ACTION #3: DELETE AN ADDRESS ===
export async function deleteAddress(addressId: string): Promise<ServerResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }

  try {
    await connectMongoose();
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, message: "User not found." };

    const addressToDelete = user.addresses.id(addressId);
    if (!addressToDelete) return { success: false, message: "Address not found." };

    const wasDefault = addressToDelete.isDefault;
    addressToDelete.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true, message: "Address deleted successfully." };

  } catch (error) {
    console.error("Error in deleteAddress:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

// === ACTION #4: SET A DEFAULT ADDRESS ===
export async function setDefaultAddress(addressId: string): Promise<ServerResponse> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Authentication required." };
    
    try {
        await connectMongoose();
        const user = await User.findById(session.user.id);
        if (!user) return { success: false, message: "User not found." };

        // --- FIX IS HERE: Explicitly type the 'addr' parameter ---
        user.addresses.forEach((addr: IAddress) => { addr.isDefault = false; });

        const newDefault = user.addresses.id(addressId);
        if (newDefault) {
            newDefault.isDefault = true;
        } else {
            return { success: false, message: "Address not found." };
        }

        await user.save();
        
        revalidatePath("/account/addresses");
        revalidatePath("/checkout");
        return { success: true, message: "Default address has been set." };
    } catch (error) {
        console.error("Error setting default address:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}