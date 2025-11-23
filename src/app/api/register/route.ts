
// /src/app/api/auth/register/route.ts (UPGRADED FOR NEW "PROGRESSIVE VERIFICATION" FLOW)

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import { createVerificationEmailHtml } from '@/email_templates/emailVerificationEmail';
import connectMongoose from '@/app/lib/mongoose';
import User from '@/models/User';
import { RegisterSchema } from '@/app/lib/zodSchemas';

const EMAIL_FROM = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Step 1: Validate with Zod. The schema now only expects name, email, and password.
        const validation = RegisterSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 });
        }
        const { name, email, password } = validation.data;
        
        await connectMongoose();
        
        // Check if a user already exists with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create the new user WITHOUT a phone number
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone: null, // Phone number is now optional and will be collected at checkout
            phoneVerified: null,
            emailVerified: null,
            verificationOtp: otp,
            verificationOtpExpires: otpExpires,
        });

        await newUser.save();

        // Send verification email (logic remains the same)
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST!, 
                port: Number(process.env.SMTP_PORT!),
                auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
            });
            const emailHtml = createVerificationEmailHtml({ customerName: name, otp });
            await transporter.sendMail({
                from: EMAIL_FROM,
                to: email,
                subject: `Your PocketValue Verification Code: ${otp}`, 
                html: emailHtml,
            });
        } catch (emailError) {
            console.error(`CRITICAL: User ${email} created, but failed to send OTP:`, emailError);
            await User.deleteOne({ email }); 
            return NextResponse.json({ message: 'Could not send verification email. Please try again.' }, { status: 500 });
        }
        
        return NextResponse.json({ message: 'Account created! A verification code has been sent to your email.' }, { status: 201 });

    } catch (error) {
        console.error("Registration API Error: ", error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}

// --- SUMMARY OF CHANGES ---
// - **Implemented "Progressive Verification":** The logic has been updated to align with our new user flow.
// - **Removed Phone Number:** The endpoint no longer expects or requires a `phone` number in the request body. The `RegisterSchema` in Zod will also need to be updated to reflect this.
// - **Simplified User Creation:** The new `User` document is created with `phone` and `phoneVerified` set to `null`. This data will now be collected and verified during the user's first checkout.
// - **Reduced Friction:** This change makes the registration process significantly faster and simpler for new users, which should increase conversion rates.