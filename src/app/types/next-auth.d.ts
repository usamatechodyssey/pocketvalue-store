// // types/next-auth.d.ts

// import 'next-auth';
// import 'next-auth/jwt';

// // Hum NextAuth ke default Session aur User types ko extend kar rahe hain
// declare module 'next-auth' {
//   /**
//    * Session interface ko extend karein taake hamari custom properties 
//    * `useSession` aur `auth()` se aane wale object mein shamil hon.
//    */
//   interface Session {
//     user: {
//       id: string; // MongoDB se aane wala user ID
//       role: string; // 'customer', 'Store Manager', etc.
//       phone?: string | null;
//     } & DefaultSession['user']; // Default properties (name, email, image) ko barqarar rakhein
//   }

//   /**
//    * User interface ko extend karein taake `authorize` callback se 
//    * return hone wale object mein hamari custom properties shamil hon.
//    */
//   interface User {
//     id: string;
//     role: string;
//     phone?: string | null;
//   }
// }

// declare module 'next-auth/jwt' {
//   /**
//    * JWT interface ko extend karein taake token mein hamari custom properties shamil hon.
//    */
//   interface JWT {
//     id: string;
//     role: string;
//     phone?: string | null;
//   }
// }

// // --- SUMMARY OF CHANGES ---
// // - **Architectural Improvement (Rule #2, #5):** Hum ne session type ko apne mustanad `IUser` model ke sath align kar diya hai.
// // - **Type Safety:** Ab poori application mein `session.user.id`, `session.user.role`, aur `session.user.phone` ko access karte waqt TypeScript koi error nahi dega, aur `as any` ki zaroorat khatam ho jayegi.
// // - **Security:** `password` field ko session se mukammal taur par hata diya gaya hai taake client-side par koi hassas (sensitive) maloomat na jaye.
// // - **Best Practice:** `User`, `Session`, aur `JWT` teeno interfaces ko extend kiya gaya hai taake JWT strategy ke sath hamara custom data sahi tareeqe se manage ho.
// types/next-auth.d.ts (UPDATED FOR DATABASE STRATEGY)

import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import 'next-auth/jwt';

// Extend the built-in `User` type from NextAuth
declare module 'next-auth' {
  /**
   * The `User` object is available in the `authorize` callback and the `session` callback's second argument.
   * We are adding our custom fields to it.
   */
  interface User extends DefaultUser {
    id: string;
    role: 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
    phone?: string | null;
  }

  /**
   * The `Session` object is what is returned by `auth()` or `useSession()`.
   * We are adding our custom user properties to the `session.user` object.
   */
  interface Session {
    user: {
      id: string;
      role: 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
      phone?: string | null;
    } & DefaultSession['user']; // Keep the default properties like name, email, image
  }
}

// The JWT interface is not actively used in the database strategy,
// but it's good practice to keep it aligned in case we ever need it.
declare module 'next-auth/jwt' {
  /**
   * The JWT token is what's stored in the JWT cookie.
   * In a database strategy, this is less important, but we keep it for consistency.
   */
  interface JWT {
    id: string;
    role: 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
    phone?: string | null;
  }
}


// --- SUMMARY OF CHANGES ---
// - **Clarity & Best Practice:** The interfaces are now correctly extending the `DefaultSession` and `DefaultUser` types imported from `next-auth`. This is the modern, recommended way to augment the types.
// - **Role Enum:** The `role` property now uses the exact string literal union type from our `User.ts` model, providing perfect type safety and autocompletion across the app.
// - **JWT Alignment:** Although the JWT callback is no longer used, the `JWT` interface is kept and updated for architectural consistency. This prevents potential issues if a part of the app still relies on `getToken`.