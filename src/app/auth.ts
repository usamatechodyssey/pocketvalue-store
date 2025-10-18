
// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
import NextAuth, { User } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { WithId, Document, ObjectId } from "mongodb";

// --- NAYI, BEHTAR PRACTICE ---
const DB_NAME = process.env.MONGODB_DB_NAME!;

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
      async authorize(credentials): Promise<User | null> {
        const { email, password, isSocialVerification } = credentials;

        // --- NAYI LOGIC: Social login ke baad wali verification ke liye ---
        if (isSocialVerification === "true" && email) {
            try {
                const client = await clientPromise;
                const db = client.db(DB_NAME);
                const userDoc = await db.collection("users").findOne({ email: email as string });

                if(userDoc){
                    // User mil gaya, session bana do
                    return { 
                        id: userDoc._id.toString(), 
                        name: userDoc.name, 
                        email: userDoc.email,
                        image: userDoc.image, 
                    };
                }
            } catch (error) {
                console.error("Social Verification Login Error:", error);
                return null;
            }
            return null; // Agar user na mile
        }
        
        // --- Purani, normal credentials (email/password) login ki logic ---
        if (!email || !password) return null;
        
        try {
            const client = await clientPromise;
            const db = client.db(DB_NAME);
            const userDoc: WithId<Document> | null = await db.collection("users").findOne({ email: email as string });

            if (!userDoc) return null;
            
            if (!userDoc.emailVerified) throw new Error("EmailNotVerified");
            if (!userDoc.phoneVerified) throw new Error("PhoneNotVerified");
            
            const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
            if (passwordsMatch) {
              const user: User = { 
                id: userDoc._id.toString(), 
                name: userDoc.name, 
                email: userDoc.email,
                image: userDoc.image, 
              };
              return user;
            }
        } catch (error) { 
            console.error("Authorize error:", error);
            if (error instanceof Error && (error.message === "EmailNotVerified" || error.message === "PhoneNotVerified")) {
                throw error;
            }
            return null; 
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { 
    signIn: "/login",
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
        if (account?.provider === 'google' || account?.provider === 'facebook') {
            const { name, email, image } = user;
            if (!email) return false;

            try {
                const client = await clientPromise;
                const db = client.db(DB_NAME);
                const usersCollection = db.collection("users");
                let existingUser = await usersCollection.findOne({ email });

                if (existingUser) {
                    if (!existingUser.phoneVerified) {
                        return `/verify-phone?email=${email}`;
                    }
                    user.id = existingUser._id.toString();
                    if (image && existingUser.image !== image) {
                       await usersCollection.updateOne({ _id: existingUser._id }, { $set: { image: image } });
                    }
                } else {
                    const result = await usersCollection.insertOne({
                        name, email, image,
                        emailVerified: new Date(), 
                        phone: null,
                        phoneVerified: null,
                        createdAt: new Date(),
                    });
                    user.id = result.insertedId.toString();
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

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image; 
      }
      if (trigger === "update" && session) {
        try {
            const client = await clientPromise;
            const db = client.db(DB_NAME);
            const freshUser = await db.collection("users").findOne({ _id: new ObjectId(token.id as string) });
            if (freshUser) {
                token.name = freshUser.name;
                if (freshUser.image) {
                    token.picture = freshUser.image;
                }
            }
        } catch (error) {
            console.error("Error refreshing JWT:", error);
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);