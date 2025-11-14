// types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

// Hum NextAuth ke default Session aur User types ko extend kar rahe hain
declare module 'next-auth' {
  /**
   * Session interface ko extend karein taake hamari custom properties 
   * `useSession` aur `auth()` se aane wale object mein shamil hon.
   */
  interface Session {
    user: {
      id: string; // MongoDB se aane wala user ID
      role: string; // 'customer', 'Store Manager', etc.
      phone?: string | null;
    } & DefaultSession['user']; // Default properties (name, email, image) ko barqarar rakhein
  }

  /**
   * User interface ko extend karein taake `authorize` callback se 
   * return hone wale object mein hamari custom properties shamil hon.
   */
  interface User {
    id: string;
    role: string;
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT interface ko extend karein taake token mein hamari custom properties shamil hon.
   */
  interface JWT {
    id: string;
    role: string;
    phone?: string | null;
  }
}

// --- SUMMARY OF CHANGES ---
// - **Architectural Improvement (Rule #2, #5):** Hum ne session type ko apne mustanad `IUser` model ke sath align kar diya hai.
// - **Type Safety:** Ab poori application mein `session.user.id`, `session.user.role`, aur `session.user.phone` ko access karte waqt TypeScript koi error nahi dega, aur `as any` ki zaroorat khatam ho jayegi.
// - **Security:** `password` field ko session se mukammal taur par hata diya gaya hai taake client-side par koi hassas (sensitive) maloomat na jaye.
// - **Best Practice:** `User`, `Session`, aur `JWT` teeno interfaces ko extend kiya gaya hai taake JWT strategy ke sath hamara custom data sahi tareeqe se manage ho.