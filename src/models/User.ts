// /src/models/User.ts

import { Schema, model, models, Document, Types } from 'mongoose';

// Address sub-document ke liye ek alag interface
export interface IAddress {
  _id: Types.ObjectId;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  address: string;
  isDefault: boolean;
  lat?: number | null; // <-- YAHAN IZAFA KIYA GAYA
  lng?: number | null; // <-- YAHAN IZAFA KIYA GAYA
}

// User document ke liye mukammal interface
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional kyunke social login mein password nahi hota
  image?: string;
 // --- YAHAN BEHTARI KI GAYI HAI ---
  role: 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor'; // 'Content Editor' shamil kiya gaya
  emailVerified?: Date | null;
  phone?: string;
  phoneVerified?: Date | null;
  addresses: IAddress[];
  // Password reset/verification ke liye fields
  verificationOtp?: string;
  verificationOtpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Address ka schema, jo User schema ke andar istemal hoga
const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
  lat: { type: Number, default: null }, // <-- YAHAN IZAFA KIYA GAYA
  lng: { type: Number, default: null }, // <-- YAHAN IZAFA KIYA GAYA
});

// User ka main schema
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  image: { type: String },
   role: {
    type: String,
    // --- YAHAN BEHTARI KI GAYI HAI ---
    enum: ['customer', 'Store Manager', 'Super Admin', 'Content Editor'], // 'Content Editor' yahan bhi shamil kiya gaya
    default: 'customer',
  },
  emailVerified: { type: Date, default: null },
  phone: { type: String },
  phoneVerified: { type: Date, default: null },
  addresses: [AddressSchema], // Addresses ko as an array of sub-documents save karein
  verificationOtp: { type: String },
  verificationOtpExpires: { type: Date },
}, {
  timestamps: true // createdAt aur updatedAt khud-ba-khud manage honge
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;

// --- SUMMARY OF CHANGES ---
// - **Architectural Improvement (Rule #2, #5):** Hum ne User data ke liye ek dedicated, mustanad Mongoose model banaya hai. Yeh hamare project mein data structure ko standardize karta hai aur native driver ke istemal ko khatam karke code ko yaksan (consistent) banata hai.
// - **Centralized Data:** Profile ki maloomat aur तमाम addresses ab ek hi User document ke andar manage honge. Is se data fetch karna bohot aasan aur tez ho jayega.
// - **Data Integrity:** `role` field par `enum` validation lagayi gayi hai taake sirf aijazat-shuda roles hi save ho sakein.
// - **Embedded Documents:** Addresses ko alag collection ke bajaye User document ke andar as an array of sub-documents rakha gaya hai. Yeh "one-to-few" relationship (ek user ke chand addresses) ke liye behtareen aur performance ke lihaz se sab se acha approach hai.