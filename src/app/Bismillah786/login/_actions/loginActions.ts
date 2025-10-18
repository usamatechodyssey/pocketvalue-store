// src/app/admin/login/_actions/loginActions.ts
"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/app/lib/session";

// ZAROORI CHANGE: Hum ab Nodemailer istemal karenge
import nodemailer from "nodemailer";

// Action 1: Credentials check karna aur OTP bhejna
export async function handleAdminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { success: false, message: "Invalid email or password." };
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otp_expires_at = Date.now() + 10 * 60 * 1000;

  try {
    // Nodemailer transporter banayein (aapke .env variables ke saath)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email bhejein
    await transporter.sendMail({
      from: '"PocketValue Security" <support@pocketvalue.pk>', // Yahan aapka from email
      to: process.env.ADMIN_EMAIL!, // Admin ka email
      subject: "Your Admin Login OTP",
      html: `<h3>Your One-Time Password to login is:</h3><h1>${otp}</h1><p>This OTP will expire in 10 minutes.</p>`,
    });

  } catch (err) {
    console.error("Nodemailer Error:", err);
    return { success: false, message: "Failed to send OTP. Please check server logs." };
  }
  
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  session.otp = otp;
  session.otp_expires_at = otp_expires_at;
  await session.save();

  return { success: true, message: "OTP has been sent to your email." };
}

// Action 2: OTP verify karna aur login complete karna (Ismein koi change nahi)
export async function verifyAdminOtp(formData: FormData) {
  const otp = formData.get("otp") as string;
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.otp || !session.otp_expires_at || Date.now() > session.otp_expires_at) {
    session.destroy();
    return { success: false, message: "OTP has expired. Please try again." };
  }

  if (Number(otp) !== session.otp) {
    return { success: false, message: "Invalid OTP." };
  }

  session.otp = undefined;
  session.otp_expires_at = undefined;
  session.isLoggedIn = true;
  await session.save();

  return { success: true, message: "Login successful!" };
}