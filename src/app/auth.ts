// // /src/auth.ts (COMPLETE CODE WITH LIVE DEBUG LOGS)

// import NextAuth from "next-auth";
// import type { NextAuthConfig, User as NextAuthUser } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import bcrypt from "bcryptjs";
// import { Types } from "mongoose";

// import connectMongoose from "@/app/lib/mongoose";
// import User, { IUser } from "@/models/User";

// // Type for a plain user object from Mongoose's .lean() method
// type LeanUser = Omit<IUser, keyof Document | '_v'> & {
//   _id: Types.ObjectId;
// };

// // Refactored helper function to get a full user object with the correct type
// async function getFullUser(email: string): Promise<LeanUser | null> {
//     await connectMongoose();
//     return User.findOne({ email }).lean<LeanUser>();
// }

// export const authOptions: NextAuthConfig = {
//   // trustHost Vercel jese platforms ke liye behtareen hai. Isko ON rakhein.
//   trustHost: true,

//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
    
//     Facebook({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),

//    Credentials({
//       async authorize(credentials): Promise<NextAuthUser | null> {
//         console.log("--- LIVE DEBUG: Credentials authorize() triggered ---");
//         const { email, password, isSocialVerification } = credentials;
//         try {
//             const userDoc = await getFullUser(email as string);
//             if (!userDoc) {
//               console.log("DEBUG: Credentials - User not found in DB.");
//               return null;
//             }

//             if (isSocialVerification === "true") {
//                 console.log("DEBUG: Credentials - Social verification path.");
//                 return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
//             }
            
//             if (!password) {
//               console.log("DEBUG: Credentials - No password provided.");
//               return null;
//             }
//             if (!userDoc.emailVerified) throw new Error("EmailNotVerified");
//             if (!userDoc.phoneVerified) throw new Error("PhoneNotVerified");
//             if (!userDoc.password) {
//               console.log("DEBUG: Credentials - User has no password set (likely a social account).");
//               return null;
//             }
            
//             const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
//             if (passwordsMatch) {
//               console.log("DEBUG: Credentials - Password matched. Authorizing user.");
//               return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
//             }
//             console.log("DEBUG: Credentials - Password did not match.");
//         } catch (error) { 
//             console.error("DEBUG: Authorize error:", error);
//             if (error instanceof Error) throw error;
//             return null; 
//         }
//         return null;
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: "/login", error: '/login' },
//   callbacks: {
//     async signIn({ user, account }) {
//         console.log("--- LIVE DEBUG: signIn Callback Triggered ---");
//         console.log("User:", JSON.stringify(user, null, 2));
//         console.log("Account:", JSON.stringify(account, null, 2));

//         if (account?.provider === 'google' || account?.provider === 'facebook') {
//             const { name, email, image } = user;
//             if (!email) {
//               console.error("DEBUG: Social login failed - no email provided.");
//               return false;
//             }
//             try {
//                 await connectMongoose();
//                 let existingUser = await User.findOne({ email });
//                 if (existingUser) {
//                     console.log("DEBUG: Social user already exists in DB.");
//                     if (!existingUser.phoneVerified) {
//                       console.log("DEBUG: Social user phone not verified. Redirecting to /verify-phone.");
//                       return `/verify-phone?email=${email}`;
//                     }
//                     user.id = existingUser._id.toString();
//                     user.role = existingUser.role;
//                     if (image && existingUser.image !== image) {
//                        existingUser.image = image;
//                        await existingUser.save();
//                     }
//                 } else {
//                     console.log("DEBUG: New social user. Creating entry in DB.");
//                     const newUser = new User({ name, email, image, emailVerified: new Date() });
//                     const savedUser = await newUser.save();
//                     user.id = savedUser._id.toString();
//                     user.role = savedUser.role;
//                     console.log("DEBUG: New social user created. Redirecting to /verify-phone.");
//                     return `/verify-phone?email=${email}`;
//                 }
//                 console.log("DEBUG: Social signIn successful.");
//                 return true; 
//             } catch (error) {
//                 console.error("DEBUG: Social Sign In DB Error:", error);
//                 return false;
//             }
//         }
//         console.log("DEBUG: signIn successful (Credentials or other).");
//         return true;
//     },

//     async jwt({ token, user, trigger, session: _session }) {
//       console.log("--- LIVE DEBUG: JWT Callback Triggered ---");
//       console.log("Trigger:", trigger);
//       console.log("Initial User object (only on login):", user ? JSON.stringify(user, null, 2) : "N/A");
//       console.log("Existing Token:", JSON.stringify(token, null, 2));

//       await connectMongoose();
//       if (user) { // Ye sirf login ke waqt chalta hai
//         token.id = user.id;
//         token.role = user.role;
        
//         const dbUser = await User.findById(user.id).lean<LeanUser>();
//         if (dbUser) {
//             token.phone = dbUser.phone;
//             console.log("DEBUG: JWT - Added phone number to token.");
//         }
//       }
//       if (trigger === "update") { // Jab session update hota hai
//         console.log("DEBUG: JWT - Session update triggered.");
//         const freshUser = await User.findById(token.id as string).lean<LeanUser>();
//         if (freshUser) {
//             token.name = freshUser.name;
//             token.picture = freshUser.image;
//             console.log("DEBUG: JWT - Token updated with fresh user data.");
//         }
//       }
//       console.log("DEBUG: Final token being returned from JWT callback:", JSON.stringify(token, null, 2));
//       return token;
//     },
    
//     async session({ session, token }) {
//       console.log("--- LIVE DEBUG: Session Callback Triggered ---");
//       console.log("Token received in session callback:", JSON.stringify(token, null, 2));

//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//         session.user.phone = token.phone as string | null;
//       }
//       console.log("DEBUG: Final session object being returned:", JSON.stringify(session, null, 2));
//       return session;
//     },
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
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

// Helper function to get a full user object with the correct type
async function getFullUser(email: string): Promise<LeanUser | null> {
    await connectMongoose();
    return User.findOne({ email }).lean<LeanUser>();
}

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthConfig = {
  // Use JWT for session management
  session: { strategy: "jwt" },

  // These settings are crucial for Vercel's serverless environment
  trustHost: true,
  useSecureCookies: isProduction,

  // === CRITICAL FIX FOR PRODUCTION ===
  // Cookies configuration to handle domain mismatch (www vs non-www)
  cookies: {
    sessionToken: {
      name: isProduction ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        // Production me root domain use karein, Localhost me undefined rakhein
        domain: isProduction ? '.pocketvalue.pk' : undefined, 
      },
    },
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

   Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
            const userDoc = await getFullUser(email as string);
            
            // 1. Check: Kya user exist karta hai?
            if (!userDoc) return null;
            
            // 2. Check: Kya user ka password hai? (Social login walo ka nahi hota)
            if (!userDoc.password) return null;
            
            // 3. Check: Kya Email Verified hai? (YE LINE AB ACTIVE HAI)
            // Agar verify nahi hai, to error throw karega aur frontend pe toast dikhayega
            if (!userDoc.emailVerified) throw new Error("EmailNotVerified");
            
            // 4. Check: Password match kar raha hai?
            const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
            if (passwordsMatch) {
              return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
            }
        } catch (error) { 
            if (error instanceof Error) throw error;
            return null; 
        }
        return null;
      },
    }),
  ],
  
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login", error: '/login' },

  callbacks: {
    async signIn({ user, account }) {
        // Social Login Logic
        if (account?.provider === 'google' || account?.provider === 'facebook') {
            const { name, email, image } = user;
            if (!email) return false;
            
            try {
                await connectMongoose();
                let existingUser = await User.findOne({ email });

                if (existingUser) {
                    // Update image if changed
                    if (image && existingUser.image !== image) {
                       existingUser.image = image;
                       await existingUser.save();
                    }
                    user.id = existingUser._id.toString();
                    user.role = existingUser.role;
                } else {
                    // Create new user (Auto-Verified because Google/FB is trusted)
                    const newUser = new User({ 
                        name, 
                        email, 
                        image, 
                        emailVerified: new Date(), 
                        role: 'customer'
                    });
                    const savedUser = await newUser.save();
                    user.id = savedUser._id.toString();
                    user.role = savedUser.role;
                }
                return true; 
            } catch (error) {
                console.error("Social Sign In DB Error:", error);
                return false;
            }
        }
        // Credentials Login ko allow karein (verification upar authorize me check ho chuki hai)
        return true;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
// // /src/auth.ts (THE FINAL, DEFINITIVE JWT STRATEGY WITH MANUAL DB SYNC)

// import NextAuth from "next-auth";
// import type { NextAuthConfig } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import bcrypt from "bcryptjs";
// import { Types } from "mongoose";

// import connectMongoose from "@/app/lib/mongoose";
// import User, { IUser } from "@/models/User";

// // Type for a plain user object from Mongoose's .lean() method
// type LeanUser = Omit<IUser, keyof Document | '_v'> & {
//   _id: Types.ObjectId;
// };

// // Helper function to get a full user object with the correct type
// async function getFullUser(email: string): Promise<LeanUser | null> {
//     await connectMongoose();
//     return User.findOne({ email }).lean<LeanUser>();
// }

// // Check if the environment is production
// const isProduction = process.env.NODE_ENV === 'production';

// export const authOptions: NextAuthConfig = {
//   // Use JWT for session management
//   session: { strategy: "jwt" },

//   // These settings are crucial for Vercel's serverless environment
//   trustHost: true,
//   useSecureCookies: isProduction,

//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
    
//     Facebook({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),

//    Credentials({
//       async authorize(credentials) {
//         const { email, password } = credentials;
//         try {
//             const userDoc = await getFullUser(email as string);
//             if (!userDoc) return null;
//             if (!userDoc.password) return null;
//             if (!userDoc.emailVerified) throw new Error("EmailNotVerified");
            
//             const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
//             if (passwordsMatch) {
//               return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
//             }
//         } catch (error) { 
//             if (error instanceof Error) throw error;
//             return null; 
//         }
//         return null;
//       },
//     }),
//   ],
  
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: "/login", error: '/login' },

//   callbacks: {
//     // --- THIS IS THE CRITICAL LOGIC FROM YOUR ORIGINAL FILE, NOW UPGRADED ---
//     async signIn({ user, account }) {
//         if (account?.provider === 'google' || account?.provider === 'facebook') {
//             const { name, email, image } = user;
//             if (!email) {
//               // Social accounts must have an email
//               return false;
//             }
//             try {
//                 await connectMongoose();
//                 let existingUser = await User.findOne({ email });

//                 if (existingUser) {
//                     // User already exists, just update their image if it has changed
//                     if (image && existingUser.image !== image) {
//                        existingUser.image = image;
//                        await existingUser.save();
//                     }
//                     // Pass the existing user's ID and role to the user object
//                     // so it can be passed to the JWT
//                     user.id = existingUser._id.toString();
//                     user.role = existingUser.role;
//                 } else {
//                     // User does not exist, create a new one in the database
//                     const newUser = new User({ 
//                         name, 
//                         email, 
//                         image, 
//                         emailVerified: new Date() // Social emails are considered verified
//                     });
//                     const savedUser = await newUser.save();
//                     // Pass the new user's ID and role to the JWT
//                     user.id = savedUser._id.toString();
//                     user.role = savedUser.role;
//                 }
//                 // Allow the sign-in to proceed
//                 return true; 
//             } catch (error) {
//                 console.error("Social Sign In DB Error:", error);
//                 return false;
//             }
//         }
//         // Allow credentials sign-in to proceed
//         return true;
//     },
    
//     // This callback puts your custom data into the token.
//     async jwt({ token, user }) {
//       if (user) {
//         // On initial sign-in, `user` object is available from `signIn` or `authorize`
//         token.id = user.id;
//         token.role = user.role as 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
//       }
//       return token;
//     },
    
//     // This callback puts data from the token into the session object.
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
//       }
//       return session;
//     },
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// --- SUMMARY OF CHANGES ---
// - **Restored JWT Strategy:** Hum wapis `session: { strategy: "jwt" }` par aa gaye hain. `adapter` ko mukammal tor par hata diya gaya hai.
// - **Restored Manual DB Sync for Social Logins:** `signIn` callback ke andar ab hum manually social users ko database me create aur update kar rahe hain, bilkul waisa hi jaisa aapki purani, kaam karne wali file me tha. Yeh social login ke "database me save na hone" wale masle ko 100% hal kar dega.
// - **Removed Phone Verification Redirect:** `signIn` callback me se `/verify-phone` wala redirect hata diya gaya hai, taake hamara naya "Progressive Verification" flow kaam kar sake.
// - **Kept Vercel Production Fixes:** Humne `trustHost: true` aur `useSecureCookies: isProduction` ko barqarar (retained) rakha hai. Yeh Vercel par "session loss" ke masle ko hal karne ke liye laazmi hain.
// // /src/auth.ts (THE FINAL, BULLETPROOF JWT STRATEGY - CORRECTED)

// import NextAuth from "next-auth";
// import type { NextAuthConfig } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import bcrypt from "bcryptjs";
// import { Types } from "mongoose";

// import connectMongoose from "@/app/lib/mongoose";
// import User, { IUser } from "@/models/User";

// // Type for a plain user object from Mongoose's .lean() method
// type LeanUser = Omit<IUser, keyof Document | '_v'> & {
//   _id: Types.ObjectId;
// };

// // Helper function to get a full user object with the correct type
// async function getFullUser(email: string): Promise<LeanUser | null> {
//     await connectMongoose();
//     return User.findOne({ email }).lean<LeanUser>();
// }

// // Check if the environment is production
// const isProduction = process.env.NODE_ENV === 'production';

// export const authOptions: NextAuthConfig = {
//   // Use JWT for session management
//   session: { strategy: "jwt" },

//   // This setting is crucial for Vercel's serverless environment
//   trustHost: true,

//   // Use secure cookies only in production
//   useSecureCookies: isProduction,

//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
    
//     Facebook({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),

//    Credentials({
//       async authorize(credentials) {
//         console.log("--- [DEBUG] Credentials authorize() triggered ---");
//         const { email, password } = credentials;
//         try {
//             const userDoc = await getFullUser(email as string);
//             if (!userDoc) {
//               console.log("[DEBUG] Credentials - User not found.");
//               return null;
//             }
//             if (!userDoc.password) {
//               console.log("[DEBUG] Credentials - User is a social account (no password).");
//               return null;
//             }
//             if (!userDoc.emailVerified) {
//               console.log("[DEBUG] Credentials - Email not verified.");
//               throw new Error("EmailNotVerified");
//             }
            
//             const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
//             if (passwordsMatch) {
//               console.log("[DEBUG] Credentials - Password matched. Success.");
//               return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
//             }
//             console.log("[DEBUG] Credentials - Password mismatch.");
//         } catch (error) { 
//             console.error("[DEBUG] Authorize error:", error);
//             if (error instanceof Error) throw error;
//             return null; 
//         }
//         return null;
//       },
//     }),
//   ],
  
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: "/login", error: '/login' },

//   callbacks: {
//     // This callback runs for all sign-in attempts
//     async signIn(/*{ user, account }*/) {
//       console.log("--- [DEBUG] signIn Callback Triggered ---");
//       // For social logins, the user object is already created by NextAuth.
//       // For credentials, the 'authorize' function has already done the work.
//       // We just need to allow the process to continue.
//       return true;
//     },
    
//     // This callback is ESSENTIAL for JWT strategy. It puts your custom data into the token.
//     async jwt({ token, user }) {
//       console.log("--- [DEBUG] JWT Callback Triggered ---");
//       // This is only called on initial sign-in when the `user` object is available.
//       if (user) {
//         console.log("[DEBUG] JWT - New login. Enriching token from user object.");
//         token.id = user.id;
        
//         // --- THE CRITICAL TYPESCRIPT FIX IS HERE ---
//         // We assert the type of `user.role` to match our custom defined roles.
//         token.role = user.role as 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
//       }
//       console.log("[DEBUG] JWT - Final token:", token);
//       return token;
//     },
    
//     // This callback takes data from the token and puts it into the session object for the client.
//     async session({ session, token }) {
//       console.log("--- [DEBUG] Session Callback Triggered ---");
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
//         console.log("[DEBUG] Session - Enriched session.user with id and role from token.");
//       }
//       console.log("[DEBUG] Session - Final session object:", session);
//       return session;
//     },
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);


// --- SUMMARY OF CHANGES ---
// - **Corrected TypeScript Error:** The `jwt` callback now uses type assertion (`as 'customer' | ...`) on `user.role` to resolve the type mismatch error. The `session` callback has also been updated for consistency.
// - **Back to JWT Strategy:** The configuration is now fully based on the JWT session strategy, which is simpler and the default for NextAuth.
// - **Vercel-Ready Configuration:** Includes `trustHost: true` and `useSecureCookies: isProduction` which are the community-recommended, robust settings for deploying on Vercel.
// - **Simplified Callbacks:** The callbacks are now clean, focused, and designed specifically for the JWT flow.

// /src/auth.ts (FINAL UPGRADE - DATABASE STRATEGY + PROGRESSIVE VERIFICATION + DEBUG LOGS)

// import NextAuth from "next-auth";
// import type { NextAuthConfig } from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "@/app/lib/mongodb";
// import type { Adapter } from "next-auth/adapters";

// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import bcrypt from "bcryptjs";
// import { Types } from "mongoose";

// import connectMongoose from "@/app/lib/mongoose";
// import User, { IUser } from "@/models/User";

// // Type for a plain user object from Mongoose's .lean() method
// type LeanUser = Omit<IUser, keyof Document | '_v'> & {
//   _id: Types.ObjectId;
// };

// // Helper function to get a full user object with the correct type
// async function getFullUser(email: string): Promise<LeanUser | null> {
//     await connectMongoose();
//     return User.findOne({ email }).lean<LeanUser>();
// }

// export const authOptions: NextAuthConfig = {
//   adapter: MongoDBAdapter(clientPromise) as Adapter,
//   session: { strategy: "database" },

//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
    
//     Facebook({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),

//    Credentials({
//       async authorize(credentials) {
//         console.log("--- [DEBUG] Credentials authorize() triggered ---");
//         const { email, password } = credentials;
//         try {
//             const userDoc = await getFullUser(email as string);
//             if (!userDoc) {
//               console.log("[DEBUG] Credentials - User not found.");
//               return null;
//             }
//             if (!userDoc.password) {
//               console.log("[DEBUG] Credentials - User is a social account (no password).");
//               return null;
//             }
//             if (!userDoc.emailVerified) {
//               console.log("[DEBUG] Credentials - Email not verified.");
//               throw new Error("EmailNotVerified");
//             }
            
//             const passwordsMatch = await bcrypt.compare(password as string, userDoc.password);
//             if (passwordsMatch) {
//               console.log("[DEBUG] Credentials - Password matched. Success.");
//               return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, image: userDoc.image, role: userDoc.role };
//             }
//             console.log("[DEBUG] Credentials - Password mismatch.");
//         } catch (error) { 
//             console.error("[DEBUG] Authorize error:", error);
//             if (error instanceof Error) throw error;
//             return null; 
//         }
//         return null;
//       },
//     }),
//   ],
  
//   secret: process.env.AUTH_SECRET,
//   pages: { signIn: "/login", error: '/login' },

//   callbacks: {
//     // --- SIMPLIFIED signIn CALLBACK ---
//     // The adapter handles linking. We just check for verification status.
//     async signIn({ user, account, profile }) {
//       console.log("--- [DEBUG] signIn Callback Triggered ---");
//       console.log("[DEBUG] signIn - User:", JSON.stringify(user, null, 2));
//       console.log("[DEBUG] signIn - Account:", JSON.stringify(account, null, 2));

//       if (account?.provider === 'google' || account?.provider === 'facebook') {
//         if (!user.email) {
//           console.error("[DEBUG] signIn - Social login failed: No email provided.");
//           return false;
//         }

//         // The adapter automatically handles user creation and linking.
//         // We just need to check if an existing user needs to verify their phone.
//         await connectMongoose();
//         const existingUser = await User.findOne({ email: user.email });

//         if (existingUser && !existingUser.phoneVerified) {
//           // If the user already exists (from any provider) but hasn't verified a phone number,
//           // we can redirect them. However, our new flow does this at checkout.
//           // For now, we allow the login to proceed.
//           console.log(`[DEBUG] signIn - User ${user.email} exists but phone is not verified. Allowing login as per new flow.`);
//         } else if (existingUser) {
//           console.log(`[DEBUG] signIn - Existing and verified user ${user.email} is logging in.`);
//         } else {
//           // This block will be hit for a brand new user. The adapter will create them.
//           console.log(`[DEBUG] signIn - Brand new social user ${user.email}. Adapter will handle creation.`);
//         }

//         return true; // Allow the sign-in
//       }
      
//       console.log("[DEBUG] signIn - Credentials login approved to proceed.");
//       return true; // Allow credentials sign-in
//     },
    
//     // The session callback adds custom data (id, role, phone) to the session object.
//     async session({ session, user }) {
//       console.log("--- [DEBUG] Session Callback Triggered ---");
//       console.log("[DEBUG] Session - Input session:", JSON.stringify(session, null, 2));
//       console.log("[DEBUG] Session - Input user (from adapter):", JSON.stringify(user, null, 2));

//       if (session.user && user) {
//         session.user.id = user.id;
        
//         // Fetch the full user document from DB to ensure `role` and `phone` are always fresh
//         await connectMongoose();
//         const dbUser = await User.findById(user.id).lean<LeanUser>();
//         if(dbUser) {
//             session.user.role = dbUser.role;
//             session.user.phone = dbUser.phone;
//             console.log("[DEBUG] Session - Enriched session with role and phone from DB.");
//         } else {
//             console.warn(`[DEBUG] Session - Could not find user with ID ${user.id} in DB to enrich session.`);
//         }
//       } else {
//         console.warn("[DEBUG] Session - session.user or user object was missing.");
//       }
      
//       console.log("[DEBUG] Session - Final session object being returned:", JSON.stringify(session, null, 2));
//       return session;
//     },
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);


// // --- SUMMARY OF CHANGES ---
// // - **Removed `trustHost`:** With a database adapter, this is often unnecessary and can sometimes cause conflicts. We are removing it to simplify the configuration.
// // - **Simplified `signIn` Callback:** The logic is now much cleaner. It no longer needs to manually create users or handle complex redirects. The adapter does the heavy lifting of creating users and linking social accounts automatically. We now only log the process for debugging.
// // - **Removed `PhoneNotVerified` Check:** In the `Credentials` provider's `authorize` function, the check for `phoneVerified` has been removed to align with our "Progressive Verification" flow. A user can now log in without a verified phone number.
// // - **Added Extensive Debug Logs:** `console.log` has been added to every step of the `authorize`, `signIn`, and `session` callbacks to give us a clear view of the entire authentication flow in Vercel's logs.