// /src/auth.ts (COMPLETE, UPDATED & FINAL CODE)

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

const isProduction = process.env.NODE_ENV === 'production';

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
                    user.role = existingUser.role;
                    if (image && existingUser.image !== image) {
                       existingUser.image = image;
                       await existingUser.save();
                    }
                } else {
                    const newUser = new User({ name, email, image, emailVerified: new Date() });
                    const savedUser = await newUser.save();
                    user.id = savedUser._id.toString();
                    user.role = savedUser.role;
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

    async jwt({ token, user, trigger, session: _session }) {
      await connectMongoose();
      if (user) { // Initial sign-in
        token.id = user.id;
        token.role = user.role;
        
        const dbUser = await User.findById(user.id).lean<LeanUser>();
        if (dbUser) {
            token.phone = dbUser.phone;
        }
      }
      if (trigger === "update") { // On session update
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
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string | null;
      }
      return session;
    },
  },
  
  // ======================= THE FINAL, MOST ROBUST COOKIE CONFIGURATION =======================
  useSecureCookies: isProduction, // Use secure cookies in production, but not in development (http://localhost)
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`, // Removed __Secure prefix for simplicity and better cross-environment compatibility
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        // Domain is only set for production to handle subdomains (www)
        domain: isProduction ? '.pocketvalue.pk' : undefined,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        domain: isProduction ? '.pocketvalue.pk' : undefined,
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`, // Using a simpler name without __Host-
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        // Domain should NOT be set for the CSRF token on localhost
        domain: isProduction ? '.pocketvalue.pk' : undefined,
      }
    },
  },
  // ==============================================================================
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);