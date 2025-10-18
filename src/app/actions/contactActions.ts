"use server";

import nodemailer from "nodemailer";
import { z } from "zod";
// --- NAYA IMPORT ---
import { createContactFormAdminEmail } from "@/email_templates/contactFormAdminEmail";

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function sendContactEmail(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    const validatedFields = ContactFormSchema.safeParse(formData);
    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.errors[0].message,
        };
    }
    const { name, email, subject, message } = validatedFields.data;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // --- TEMPLATE YAHAN ISTEMAL HO RAHA HAI ---
    const emailHtml = createContactFormAdminEmail({ name, email, subject, message });

    try {
        await transporter.sendMail({
            from: `"PocketValue Contact" <support@pocketvalue.pk>`, 
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: `[Contact Form] New Message from ${name}: ${subject}`,
            html: emailHtml, // Naya, khoobsurat HTML yahan pass karein
        });

        return { success: true, message: "Thank you! Your message has been sent successfully." };

    } catch (error) {
        console.error("Mailjet Send Error [Contact Form]:", error);
        return { success: false, message: "Sorry, we couldn't send your message right now." };
    }
}