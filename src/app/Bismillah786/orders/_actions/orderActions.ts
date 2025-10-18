"use server";

import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { createCustomAdminEmailHtml } from '@/email_templates/CustomAdminEmail';
// Saare email templates import karein
import { createOrderShippedHtml } from "@/email_templates/orderStatusEmails";
import { createOrderProcessingHtml } from "@/email_templates/orderStatusEmails";
import { createOrderDeliveredHtml } from "@/email_templates/orderStatusEmails";
import { createOrderCancelledHtml } from "@/email_templates/orderStatusEmails";


const DB_NAME = process.env.MONGODB_DB_NAME!;
export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        if (!ObjectId.isValid(orderId)) throw new Error("Invalid Order ID format.");
        if (!newStatus) throw new Error("Invalid status provided.");

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const ordersCollection = db.collection("orders");

        const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
        if (!order) throw new Error("Order not found.");
        
        if (order.status === newStatus) {
            return { success: true, message: "Status is already the same." };
        }

        const result = await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: newStatus } }
        );

        if (result.modifiedCount === 0) {
            throw new Error("Failed to update the order status.");
        }

        // === NAYI, MUKAMMAL EMAIL LOGIC ===
        const user = await db.collection("users").findOne({ _id: new ObjectId(order.userId) });
        if (user && user.email) {
            let emailHtml = '';
            let subject = '';

            // Status ke hisaab se sahi template aur subject chuno
            if (newStatus === "Processing") {
                subject = `Your PocketValue Order is being processed! [#${orderId.slice(-6)}]`;
                emailHtml = createOrderProcessingHtml({ customerName: user.name, orderId });
            } else if (newStatus === "Shipped") {
                subject = `Your PocketValue Order has been Shipped! [#${orderId.slice(-6)}]`;
                emailHtml = createOrderShippedHtml({ customerName: user.name, orderId });
            } else if (newStatus === "Delivered") {
                subject = `Your PocketValue Order has been Delivered! [#${orderId.slice(-6)}]`;
                emailHtml = createOrderDeliveredHtml({ customerName: user.name, orderId });
            } else if (newStatus === "Cancelled") {
                subject = `Your PocketValue Order has been Cancelled [#${orderId.slice(-6)}]`;
                emailHtml = createOrderCancelledHtml({ customerName: user.name, orderId });
            }
            
            // Agar subject aur html ban gaya hai, to hi email bhejo
            if(subject && emailHtml) {
                try {
                    const transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number(process.env.SMTP_PORT),
                        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
                    });
                    
                    await transporter.sendMail({
                        from: '"PocketValue" <support@pocketvalue.pk>',
                        to: user.email,
                        subject: subject,
                        html: emailHtml,
                    });

                    console.log(`'${newStatus}' email sent for order ${orderId}`);
                } catch (emailError) {
                    console.error("Failed to send status update email:", emailError);
                }
            }
        }
        
        revalidatePath(`/Bismillah786/orders/${orderId}`);
        revalidatePath(`/Bismillah786/orders`);
        revalidatePath(`/Bismillah786/orders`);

        return { success: true, message: "Order status updated successfully!" };

    } catch (error) {
        // ... (error handling wesi hi rahegi)
    }
}
export async function sendCustomEmail(
    customerId: string, 
    subject: string, 
    message: string
) {
    "use server";

    if (!customerId || !subject || !message) {
        throw new Error("Customer ID, subject, and message are required.");
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        
        // User ko uski ID se dhoondne ke liye ObjectId use karein
        const user = await db.collection("users").findOne({ _id: new ObjectId(customerId) });
        
        if (!user || !user.email) {
            throw new Error("Customer email not found.");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        // Naye, simple template se HTML banayein
        const emailHtml = createCustomAdminEmailHtml({
            customerName: user.name,
            message: message,
        });

        await transporter.sendMail({
            from: '"PocketValue" <support@pocketvalue.pk>',
            to: user.email,
            subject: subject,
            html: emailHtml, // Khoobsurat HTML yahan pass karein
        });

        return { success: true, message: "Email sent successfully!" };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Send Custom Email Error:", errorMessage);
        throw new Error(errorMessage);
    }
}