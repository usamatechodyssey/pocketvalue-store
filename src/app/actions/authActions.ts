// app/actions/authActions.ts
"use server";

import clientPromise from "@/app/lib/mongodb";
import crypto from 'crypto';
import nodemailer from "nodemailer";
import { createVerificationEmailHtml } from '@/email_templates/emailVerificationEmail'; // Import zaroori hai
import { createPasswordResetHtml } from '@/email_templates/passwordResetEmail';
import bcrypt from "bcryptjs";
import { createWelcomeEmailHtml } from '@/email_templates/welcomeEmail'; // Welcome email import karein


const DB_NAME = process.env.MONGODB_DB_NAME!;
export async function requestPasswordReset(email: string) {
    if (!email) {
        return { success: false, message: "Email is required." };
    }
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });

        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return { success: true, message: "If an account exists, a reset link has been sent." };
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { passwordResetToken, passwordResetExpires } }
        );

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
        
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT),
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            const emailHtml = createPasswordResetHtml({ customerName: user.name, resetLink: resetUrl });
            await transporter.sendMail({
                from: '"PocketValue Support" <support@pocketvalue.pk>',
                to: user.email, subject: 'Reset Your PocketValue Password', html: emailHtml,
            });
        } catch (emailError) {
            console.error("Failed to send password reset email:", emailError);
            await usersCollection.updateOne({ _id: user._id }, { $unset: { passwordResetToken: "", passwordResetExpires: "" } });
            return { success: false, message: "Could not send reset email." };
        }
        return { success: true, message: "If an account exists, a reset link has been sent." };
    } catch (error) {
        console.error("Request Password Reset Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) { return { success: false, message: "Invalid data provided." }; }
    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        });
        if (!user) { return { success: false, message: "Token is invalid or has expired." }; }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { password: hashedNewPassword }, $unset: { passwordResetToken: "", passwordResetExpires: "" } }
        );
        return { success: true, message: "Password has been reset successfully!" };
    } catch (error) {
        console.error("Reset Password Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}

// NAYA FUNCTION: Token se email nikalne ke liye
export async function getEmailFromToken(token: string): Promise<string | null> {
    if (!token) return null;
    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const user = await db.collection("users").findOne({ passwordResetToken: hashedToken });
        return user ? user.email : null;
    } catch {
        return null;
    }
}

// =================================================================
// === NAYA FUNCTION #1: USER KO VERIFY KARNE KE LIYE            ===
// =================================================================
export async function verifyUserEmail(email: string, otp: string) {
    if (!email || !otp) {
        return { success: false, message: "Email and OTP are required." };
    }
    
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ 
            email: email,
            verificationOtp: otp,
            verificationOtpExpires: { $gt: new Date() } // Check karein ke OTP expire to nahi hua
        });

        if (!user) {
            return { success: false, message: "Invalid OTP or it has expired. Please try again." };
        }

        // OTP theek hai, ab user ko verify mark karo aur OTP fields हटा do
        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { emailVerified: new Date() }, // emailVerified mein date daal do
                $unset: { verificationOtp: "", verificationOtpExpires: "" } 
            }
        );

        // User ko aek welcome email bhejo
        await sendWelcomeEmail(user.name, user.email);

        return { success: true, message: "Email verified successfully! Welcome aboard." };

    } catch (error) {
        console.error("Email Verification Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}

// =================================================================
// === NAYA FUNCTION #2: WELCOME EMAIL BHEJNE KE LIYE            ===
// =================================================================
async function sendWelcomeEmail(name: string, email: string) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const emailHtml = createWelcomeEmailHtml({ customerName: name });

        await transporter.sendMail({
            from: '"PocketValue" <support@pocketvalue.pk>',
            to: email,
            subject: `Welcome to the PocketValue Family, ${name}!`,
            html: emailHtml,
        });
        console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
        console.error(`Failed to send welcome email to ${email}:`, emailError);
        // Is error ko publicly show nahi karna, sirf log karna hai
    }
}

// === NAYA FUNCTION: SOCIAL LOGIN KE BAAD PHONE UPDATE KARNE KE LIYE ===
export async function updateUserPhone(email: string, phone: string) {
    if (!email || !phone) {
        return { success: false, message: "Email and phone number are required." };
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");

        const existingPhoneUser = await usersCollection.findOne({ phone: phone });
        if (existingPhoneUser && existingPhoneUser.email !== email) {
            return { success: false, message: "This phone number is already associated with another account." };
        }

        const result = await usersCollection.updateOne(
            { email: email },
            {
                $set: {
                    phone: phone,
                    phoneVerified: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return { success: false, message: "Could not find a user with that email to update." };
        }

        return { success: true, message: "Phone number verified and added to your account!" };

    } catch (error) {
        console.error("Update User Phone Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}
// === NAYA FUNCTION: RESEND OTP KE LIYE ===
export async function resendVerificationEmail(email: string) {
    if (!email) {
        return { success: false, message: "Email address is required." };
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email: email });

        if (!user) {
            // Security: Aam tor per hum yeh nahi batate ke email exist karti hai ya nahi
            return { success: false, message: "Could not find a user with that email." };
        }
        
        if (user.emailVerified) {
             return { success: false, message: "This email is already verified." };
        }

        // Naya OTP generate karein
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute

        // Naye OTP aur expiry ko database mein update karein
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { verificationOtp: otp, verificationOtpExpires: otpExpires } }
        );

        // User ko dobara email bhejein
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            const emailHtml = createVerificationEmailHtml({ customerName: user.name, otp });
            await transporter.sendMail({
                from: '"PocketValue" <support@pocketvalue.pk>',
                to: email,
                subject: `Your New PocketValue Verification Code: ${otp}`,
                html: emailHtml,
            });

             return { success: true, message: "A new verification code has been sent to your email." };

        } catch (emailError) {
            console.error(`Failed to resend OTP to ${email}:`, emailError);
            return { success: false, message: "Could not send a new verification email. Please try again later." };
        }
        
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return { success: false, message: "An internal server error occurred." };
    }
}
