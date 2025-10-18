
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import { createVerificationEmailHtml } from '@/email_templates/emailVerificationEmail';

// --- Whitelist of allowed email providers ---
const ALLOWED_EMAIL_DOMAINS = new Set([
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
]);
const DB_NAME = process.env.MONGODB_DB_NAME!;

export async function POST(req: Request) {
    try {
        const { name, email, password, phone } = await req.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        // --- Whitelist Validation Security Check ---
        const emailDomain = email.split('@')[1];
        if (!emailDomain || !ALLOWED_EMAIL_DOMAINS.has(emailDomain.toLowerCase())) {
            return NextResponse.json({
                message: 'Please use a valid email provider (e.g., Gmail, Outlook). Disposable emails are not allowed.'
            }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');

        // Upgraded duplicate check (for both email AND phone)
        const existingUser = await usersCollection.findOne({ 
            $or: [{ email }, { phone }] 
        });
        if (existingUser) {
             if (existingUser.email === email) return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
             if (existingUser.phone === phone) return NextResponse.json({ message: 'This phone number is already in use.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            phone,
            phoneVerified: new Date(), // Mark phone as verified now
            emailVerified: null, // Email still needs to be verified
            image: null,
            createdAt: new Date(),
            verificationOtp: otp,
            verificationOtpExpires: otpExpires,
        });

        // Send EMAIL verification (logic remains the same)
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            const emailHtml = createVerificationEmailHtml({ customerName: name, otp });
            await transporter.sendMail({
                from: '"PocketValue" <support@pocketvalue.pk>',
                to: email,
                subject: `Your PocketValue Verification Code: ${otp}`,
                html: emailHtml,
            });
        } catch (emailError) {
            console.error(`CRITICAL: User ${email} was created, but failed to send verification OTP:`, emailError);
            await usersCollection.deleteOne({ email });
            return NextResponse.json({ message: 'Could not send verification email. Please try again.' }, { status: 500 });
        }
        
        return NextResponse.json({ message: 'Phone verified! Now, please check your email for the final verification step.' }, { status: 201 });

    } catch (error) {
        console.error("Registration API Error: ", error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}