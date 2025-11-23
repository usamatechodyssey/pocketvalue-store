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
    // ADDED: To track verification status from DB -> Session
    phoneVerified?: Date | boolean | null; 
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
      // ADDED: Available in the frontend via useSession()
      phoneVerified?: Date | boolean | null;
    } & DefaultSession['user']; // Keep the default properties like name, email, image
  }
}

// Extend the JWT type to carry the phone verification status
declare module 'next-auth/jwt' {
  /**
   * The JWT token is what's stored in the JWT cookie.
   * We persist the phone verification status here so it survives page reloads.
   */
  interface JWT {
    id: string;
    role: 'customer' | 'Store Manager' | 'Super Admin' | 'Content Editor';
    phone?: string | null;
    // ADDED: Stored in the encrypted token
    phoneVerified?: Date | boolean | null;
  }
}