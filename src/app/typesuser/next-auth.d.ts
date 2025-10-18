// File Location: types/next-auth.d.ts

import type { User as DefaultUser } from 'next-auth';

// Hum NextAuth ke default User type ko extend kar rahe hain
declare module 'next-auth' {
  interface User extends DefaultUser {
    password?: string; // Hum bata rahe hain ki hamare User ke paas password bhi ho sakta hai
  }
}