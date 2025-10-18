// src/lib/session.ts

// ZAROORI CHANGE: IronSessionOptions ko curly braces ke andar import karein
import { type SessionOptions } from "iron-session";

// Session ka data kaisa dikhega, uska structure (type)
export interface SessionData {
  otp?: number;
  otp_expires_at?: number;
  isLoggedIn?: boolean;
}

// Session ki settings (Ismein koi change nahi)
export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET!,
  cookieName: "admin-auth-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};