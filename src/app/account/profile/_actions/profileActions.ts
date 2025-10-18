// app/account/profile/_actions/profileActions.ts
"use server";

import { auth } from "@/app/auth"; // signOut yahan se hata dein
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// Types
interface UpdateProfileData { name: string; }
interface UpdatePasswordData { currentPassword_1: string; newPassword_1: string; }
const DB_NAME = process.env.MONGODB_DB_NAME!;
// Naam update karne ka action
export async function updateProfile(data: UpdateProfileData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Not authenticated." };

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        await db.collection("users").updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { name: data.name } }
        );

        // Ab hum sirf success message bhejenge. Logout ka kaam client karega.
        return { success: true, message: "Profile updated successfully! Please log in again to see the changes." };

    } catch (error) {
        return { success: false, message: "Failed to update profile." };
    }
}

// Password update karne ka action (yeh pehle se theek hai)
export async function updatePassword(data: UpdatePasswordData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Not authenticated." };

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });

        if (!user) return { success: false, message: "User not found." };

        const passwordsMatch = await bcrypt.compare(data.currentPassword_1, user.password);
        if (!passwordsMatch) {
            return { success: false, message: "Incorrect current password." };
        }

        const hashedNewPassword = await bcrypt.hash(data.newPassword_1, 10);
        await db.collection("users").updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { password: hashedNewPassword } }
        );

        return { success: true, message: "Password updated successfully! Please log in again." };

    } catch (error) {
        return { success: false, message: "Failed to update password." };
    }
}