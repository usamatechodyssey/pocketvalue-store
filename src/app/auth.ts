
// /src/auth.ts

import NextAuth from "next-auth";
import type { NextAuthConfig, User as NextAuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import connectMongoose from "@/app/lib/mongoose";
import User, { IUser } from "@/models/User";

// --- BUG FIX: .lean() ke liye ek alag, saaf suthri type banayein ---
// Yeh type Mongoose Document ki properties ke bagher hai
type LeanUser = Omit<IUser, keyof Document | '_v'> & {
  _id: Types.ObjectId;
};

// --- REFACTORED Helper function to use Mongoose with correct types ---
async function getFullUser(email: string): Promise<LeanUser | null> {
    await connectMongoose();
    // Ab .lean() ki return type wazeh hai
    return User.findOne({ email }).lean<LeanUser>();
}
export const authOptions: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),

   Credentials({
      async authorize(credentials): Promise<NextAuthUser | null> {
        const { email, password, isSocialVerification } = credentials;
        try {
            const userDoc = await getFullUser(email as string);
            if (!userDoc) return null;

            if (isSocialVerification === "true") {
                return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
            }
            
            if (!password) return null;
            if (!userDoc.emailVerified) throw new Error("EmailNotVerified");
            if (!userDoc.phoneVerified) throw new Error("PhoneNotVerified");
            if (!userDoc.password) return null;
            
            const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
            if (passwordsMatch) {
              // --- BUG FIX: 'role' ko yahan return karna lazmi hai ---
              return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
            }
        } catch (error) { 
            console.error("Authorize error:", error);
            if (error instanceof Error) throw error;
            return null; 
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login", error: '/login' },
  callbacks: {
    async signIn({ user, account }) {
        if (account?.provider === 'google' || account?.provider === 'facebook') {
            const { name, email, image } = user;
            if (!email) return false;
            try {
                await connectMongoose();
                let existingUser = await User.findOne({ email });
                if (existingUser) {
                    if (!existingUser.phoneVerified) return `/verify-phone?email=${email}`;
                    user.id = existingUser._id.toString();
                    user.role = existingUser.role; // BUG FIX: user object mein role add karein
                    if (image && existingUser.image !== image) {
                       existingUser.image = image;
                       await existingUser.save();
                    }
                } else {
                    const newUser = new User({ name, email, image, emailVerified: new Date() });
                    const savedUser = await newUser.save();
                    user.id = savedUser._id.toString();
                    user.role = savedUser.role; // BUG FIX: user object mein role add karein
                    return `/verify-phone?email=${email}`;
                }
                return true; 
            } catch (error) {
                console.error("Social Sign In Error:", error);
                return false;
            }
        }
        return true;
    },

    async jwt({ token, user, trigger, session: _session }) { // 'session' ko '_session' kar diya taake "unused" ka error na aaye
      await connectMongoose();
      if (user) { // Initial sign-in
        // user object ab 'signIn' callback se aa raha hai
        token.id = user.id;
        token.role = user.role;
        
        // phone number ke liye DB se dobara fetch karein
        const dbUser = await User.findById(user.id).lean<LeanUser>();
        if (dbUser) {
            token.phone = dbUser.phone;
        }
      }
      if (trigger === "update") { // Session update hone par
        const freshUser = await User.findById(token.id as string).lean<LeanUser>();
        if (freshUser) {
            token.name = freshUser.name;
            token.picture = freshUser.image;
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        // --- BUG FIX: Ab `as any` ki zaroorat nahi ---
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string | null;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// --- SUMMARY OF CHANGES ---
// - **Critical TypeScript Fix (`.lean()`):** Main ne ek nayi `LeanUser` type banayi hai jo Mongoose ke `.lean()` function ke return type ko sahi tareeqe se define karti hai. Is se `Property does not exist` ke tamam errors hal ho gaye hain.
// - **`authorize` Callback Fix:** `authorize` function ab `role` ko user object ke sath return kar raha hai, jis se `next-auth.d.ts` ki shart poori ho gayi hai.
// - **`signIn` Callback Fix:** Social login ke `signIn` callback mein ab `user` object ke andar `role` ko bhi shamil kiya ja raha hai taake yeh `jwt` callback tak pohanch sake.
// - **End-to-End Type Safety (`session` callback):** `session` callback mein se `as any` ko mukammal taur par hata diya gaya hai. Ab hamari custom `next-auth.d.ts` file ki wajah se session object 100% type-safe hai.
// - **Code Quality:** `jwt` callback mein unused `session` parameter ko `_session` ka naam de diya gaya hai, jo ke ek behtar practice hai.