// /src/auth.ts (COMPLETE CODE WITH LIVE DEBUG LOGS)

import NextAuth from "next-auth";
import type { NextAuthConfig, User as NextAuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import connectMongoose from "@/app/lib/mongoose";
import User, { IUser } from "@/models/User";

// Type for a plain user object from Mongoose's .lean() method
type LeanUser = Omit<IUser, keyof Document | '_v'> & {
  _id: Types.ObjectId;
};

// Refactored helper function to get a full user object with the correct type
async function getFullUser(email: string): Promise<LeanUser | null> {
    await connectMongoose();
    return User.findOne({ email }).lean<LeanUser>();
}

export const authOptions: NextAuthConfig = {
  // trustHost Vercel jese platforms ke liye behtareen hai. Isko ON rakhein.
  trustHost: true,

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
        console.log("--- LIVE DEBUG: Credentials authorize() triggered ---");
        const { email, password, isSocialVerification } = credentials;
        try {
            const userDoc = await getFullUser(email as string);
            if (!userDoc) {
              console.log("DEBUG: Credentials - User not found in DB.");
              return null;
            }

            if (isSocialVerification === "true") {
                console.log("DEBUG: Credentials - Social verification path.");
                return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
            }
            
            if (!password) {
              console.log("DEBUG: Credentials - No password provided.");
              return null;
            }
            if (!userDoc.emailVerified) throw new Error("EmailNotVerified");
            if (!userDoc.phoneVerified) throw new Error("PhoneNotVerified");
            if (!userDoc.password) {
              console.log("DEBUG: Credentials - User has no password set (likely a social account).");
              return null;
            }
            
            const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
            if (passwordsMatch) {
              console.log("DEBUG: Credentials - Password matched. Authorizing user.");
              return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
            }
            console.log("DEBUG: Credentials - Password did not match.");
        } catch (error) { 
            console.error("DEBUG: Authorize error:", error);
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
        console.log("--- LIVE DEBUG: signIn Callback Triggered ---");
        console.log("User:", JSON.stringify(user, null, 2));
        console.log("Account:", JSON.stringify(account, null, 2));

        if (account?.provider === 'google' || account?.provider === 'facebook') {
            const { name, email, image } = user;
            if (!email) {
              console.error("DEBUG: Social login failed - no email provided.");
              return false;
            }
            try {
                await connectMongoose();
                let existingUser = await User.findOne({ email });
                if (existingUser) {
                    console.log("DEBUG: Social user already exists in DB.");
                    if (!existingUser.phoneVerified) {
                      console.log("DEBUG: Social user phone not verified. Redirecting to /verify-phone.");
                      return `/verify-phone?email=${email}`;
                    }
                    user.id = existingUser._id.toString();
                    user.role = existingUser.role;
                    if (image && existingUser.image !== image) {
                       existingUser.image = image;
                       await existingUser.save();
                    }
                } else {
                    console.log("DEBUG: New social user. Creating entry in DB.");
                    const newUser = new User({ name, email, image, emailVerified: new Date() });
                    const savedUser = await newUser.save();
                    user.id = savedUser._id.toString();
                    user.role = savedUser.role;
                    console.log("DEBUG: New social user created. Redirecting to /verify-phone.");
                    return `/verify-phone?email=${email}`;
                }
                console.log("DEBUG: Social signIn successful.");
                return true; 
            } catch (error) {
                console.error("DEBUG: Social Sign In DB Error:", error);
                return false;
            }
        }
        console.log("DEBUG: signIn successful (Credentials or other).");
        return true;
    },

    async jwt({ token, user, trigger, session: _session }) {
      console.log("--- LIVE DEBUG: JWT Callback Triggered ---");
      console.log("Trigger:", trigger);
      console.log("Initial User object (only on login):", user ? JSON.stringify(user, null, 2) : "N/A");
      console.log("Existing Token:", JSON.stringify(token, null, 2));

      await connectMongoose();
      if (user) { // Ye sirf login ke waqt chalta hai
        token.id = user.id;
        token.role = user.role;
        
        const dbUser = await User.findById(user.id).lean<LeanUser>();
        if (dbUser) {
            token.phone = dbUser.phone;
            console.log("DEBUG: JWT - Added phone number to token.");
        }
      }
      if (trigger === "update") { // Jab session update hota hai
        console.log("DEBUG: JWT - Session update triggered.");
        const freshUser = await User.findById(token.id as string).lean<LeanUser>();
        if (freshUser) {
            token.name = freshUser.name;
            token.picture = freshUser.image;
            console.log("DEBUG: JWT - Token updated with fresh user data.");
        }
      }
      console.log("DEBUG: Final token being returned from JWT callback:", JSON.stringify(token, null, 2));
      return token;
    },
    
    async session({ session, token }) {
      console.log("--- LIVE DEBUG: Session Callback Triggered ---");
      console.log("Token received in session callback:", JSON.stringify(token, null, 2));

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string | null;
      }
      console.log("DEBUG: Final session object being returned:", JSON.stringify(session, null, 2));
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);