// /src/app/actions/contactActions.ts (REFACTORED FOR CENTRAL SCHEMA)

"use server";

import nodemailer from "nodemailer";
// === THE FIX IS HERE: Import Zod and our new central schema ===
import { z } from "zod";
import { ContactFormSchema } from "@/app/lib/zodSchemas";
import { createContactFormAdminEmail } from "@/email_templates/contactFormAdminEmail";

// The local schema definition has been removed from here.

const EMAIL_FROM = `"${process.env.EMAIL_FROM_NAME} Contact" <${process.env.EMAIL_FROM_ADDRESS}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Infer the type from the central schema
type ContactFormData = z.infer<typeof ContactFormSchema>;

export async function sendContactEmail(formData: ContactFormData) {
    const validatedFields = ContactFormSchema.safeParse(formData);
    
    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.issues[0].message,
        };
    }
    const { name, email, subject, message } = validatedFields.data;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT!),
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    });

    const emailHtml = createContactFormAdminEmail({ name, email, subject, message });

    try {
        await transporter.sendMail({
            from: EMAIL_FROM,
            to: ADMIN_EMAIL,
            replyTo: email,
            subject: `[Contact Form] New Message from ${name}: ${subject}`,
            html: emailHtml,
        });

        return { success: true, message: "Thank you! Your message has been sent successfully." };

    } catch (error) {
        console.error("Email Send Error [Contact Form]:", error);
        return { success: false, message: "Sorry, we couldn't send your message right now." };
    }
}