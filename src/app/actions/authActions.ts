
// /src/app/actions/authActions.ts (REFACTORED WITH ZOD)

"use server";

import crypto from 'crypto';
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import connectMongoose from "@/app/lib/mongoose";
import User from "@/models/User";
import { RequestPasswordResetSchema, ResetPasswordSchema, VerifyEmailSchema, UpdatePhoneSchema } from "@/app/lib/zodSchemas";

// Email template imports
import { createVerificationEmailHtml } from '@/email_templates/emailVerificationEmail';
import { createPasswordResetHtml } from '@/email_templates/passwordResetEmail';
import { createWelcomeEmailHtml } from '@/email_templates/welcomeEmail';

const EMAIL_FROM = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;

// === requestPasswordReset (With Debugging Logs) ===
export async function requestPasswordReset(email: string) {
    console.log(`\n--- [DEBUG] Starting password reset request for: ${email} ---`);

    const validatedFields = RequestPasswordResetSchema.safeParse({ email });
    if (!validatedFields.success) {
        console.error("[DEBUG] Validation failed:", validatedFields.error.issues[0].message);
        return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { email: validatedEmail } = validatedFields.data;
    console.log(`[DEBUG] Email validated successfully.`);

    try {
        await connectMongoose();
        console.log("[DEBUG] Connected to database.");

        const user = await User.findOne({ email: validatedEmail });

        if (!user) {
            console.warn(`[DEBUG] No user found with email: ${validatedEmail}. Exiting gracefully.`);
            // This is a security feature to prevent user enumeration.
            return { success: true, message: "If an account with that email exists, a reset link has been sent." };
        }
        
        console.log(`[DEBUG] User found: ${user.name} (${user._id}). Proceeding to generate token.`);

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        console.log("[DEBUG] Reset token saved to database.");

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
        
        try {
            const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!), auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } });
            const emailHtml = createPasswordResetHtml({ customerName: user.name, resetLink: resetUrl });
            
            console.log(`[DEBUG] Attempting to send email to: ${user.email}`);
            await transporter.sendMail({ from: EMAIL_FROM, to: user.email, subject: 'Reset Your PocketValue Password', html: emailHtml });
            console.log("[DEBUG] Email sent successfully via nodemailer!");

        } catch (emailError) {
            console.error("--- [DEBUG] CRITICAL: FAILED to send password reset email ---", emailError);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            return { success: false, message: "Could not send the reset email." };
        }

        console.log("--- [DEBUG] Process finished successfully. ---");
        return { success: true, message: "If an account with that email exists, a reset link has been sent." };

    } catch (error) {
        console.error("--- [DEBUG] CRITICAL ERROR in requestPasswordReset function ---", error);
        return { success: false, message: "An internal server error occurred." };
    }
}
// === resetPassword (Refactored with Zod) ===
export async function resetPassword(token: string, newPassword: string) {
    const validatedFields = ResetPasswordSchema.safeParse({ token, newPassword });
    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { token: validatedToken, newPassword: validatedPassword } = validatedFields.data;

    try {
        const hashedToken = crypto.createHash("sha256").update(validatedToken).digest("hex");
        await connectMongoose();
        
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        });
        
        if (!user) { 
            return { success: false, message: "This token is invalid or has expired." }; 
        }
        
        user.password = await bcrypt.hash(validatedPassword, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save();
        
        return { success: true, message: "Your password has been reset successfully!" };
    } catch (error) {
        console.error("Reset Password Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}

// === getEmailFromToken (WITH FIX) ===
export async function getEmailFromToken(token: string): Promise<string | null> {
    if (!token) return null;
    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        await connectMongoose();
        
        // --- BUG FIX IS HERE ---
        // TypeScript ko wazeh taur par batayein ke .lean() se kya expect karna hai
        const user = await User.findOne({ passwordResetToken: hashedToken })
            .select("email")
            .lean<{ email: string }>();

        return user ? user.email : null;
    } catch {
        return null;
    }
}
// === verifyUserEmail (Refactored with Zod) ===
export async function verifyUserEmail(email: string, otp: string) {
    const validatedFields = VerifyEmailSchema.safeParse({ email, otp });
    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { email: validatedEmail, otp: validatedOtp } = validatedFields.data;

    try {
        await connectMongoose();
        const user = await User.findOne({ 
            email: validatedEmail,
            verificationOtp: validatedOtp,
            verificationOtpExpires: { $gt: new Date() }
        });
        if (!user) {
            return { success: false, message: "The OTP is invalid or has expired." };
        }
        user.emailVerified = new Date();
        user.verificationOtp = undefined;
        user.verificationOtpExpires = undefined;
        await user.save();
        await sendWelcomeEmail(user.name, user.email);
        return { success: true, message: "Email verified successfully! Welcome aboard." };
    } catch (error) {
        console.error("Email Verification Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}

// === sendWelcomeEmail (Helper Function) ===
async function sendWelcomeEmail(name: string, email: string) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!),
            auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
        });
        const emailHtml = createWelcomeEmailHtml({ customerName: name });
        await transporter.sendMail({
            from: EMAIL_FROM, // .env variable istemal karein
            to: email,
            subject: `Welcome to the PocketValue Family, ${name}!`,
            html: emailHtml,
        });
        console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
        console.error(`Failed to send welcome email to ${email}:`, emailError);
    }
}


// === updateUserPhone (Refactored with Zod) ===
export async function updateUserPhone(email: string, phone: string) {
    const validatedFields = UpdatePhoneSchema.safeParse({ email, phone });
    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { email: validatedEmail, phone: validatedPhone } = validatedFields.data;

    try {
        await connectMongoose();

        const existingPhoneUser = await User.findOne({ phone: validatedPhone });
        if (existingPhoneUser && existingPhoneUser.email !== validatedEmail) {
            return { success: false, message: "This phone number is already associated with another account." };
        }

        const user = await User.findOne({ email: validatedEmail });
        if (!user) {
            return { success: false, message: "Could not find a user with that email to update." };
        }

        user.phone = validatedPhone;
        user.phoneVerified = new Date();
        await user.save();

        return { success: true, message: "Phone number verified and added to your account!" };
    } catch (error) {
        console.error("Update User Phone Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}

// === resendVerificationEmail (Refactored with Zod) ===
export async function resendVerificationEmail(email: string) {
    const validatedFields = RequestPasswordResetSchema.safeParse({ email }); // Can reuse this schema
    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { email: validatedEmail } = validatedFields.data;
    
    try {
        await connectMongoose();
        const user = await User.findOne({ email: validatedEmail });
        if (!user) return { success: false, message: "Could not find a user with that email." };
        if (user.emailVerified) return { success: false, message: "This email is already verified." };

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOtp = newOtp;
        user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!), auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } });
            const emailHtml = createVerificationEmailHtml({ customerName: user.name, otp: newOtp });
            await transporter.sendMail({ from: EMAIL_FROM, to: validatedEmail, subject: `Your New PocketValue Verification Code: ${newOtp}`, html: emailHtml });
             return { success: true, message: "A new verification code has been sent to your email." };
        } catch (emailError) {
            console.error(`Failed to resend OTP to ${validatedEmail}:`, emailError);
            return { success: false, message: "Could not send a new verification email." };
        }
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}