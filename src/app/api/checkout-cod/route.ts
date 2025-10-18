// app/api/checkout-cod/route.ts

import { auth } from "@/app/auth";
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { CleanCartItem } from "@/sanity/types/product_types";
import nodemailer from "nodemailer";
import { createOrderConfirmationHtml } from "@/email_templates/orderConfirmationEmail";
import { cookies } from 'next/headers'; // NAYA: Cookies parhne ke liye import

// --- Interfaces (koi change nahi) ---
interface ShippingAddress { fullName: string; phone: string; province: string; city: string; area: string; address: string; }
interface RequestBody { shippingAddress: ShippingAddress; cartItems: CleanCartItem[]; totalPrice: number; }
const DB_NAME = process.env.MONGODB_DB_NAME!;
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
  }

  try {
    const body: RequestBody = await req.json();
    const { shippingAddress, cartItems, totalPrice } = body;
    
    if (!shippingAddress || !cartItems || cartItems.length === 0 || !totalPrice) {
      return NextResponse.json({ message: "Missing required order information." }, { status: 400 });
    }

    // === UPDATED: ADVANCED TRAFFIC SOURCE LOGIC ===
    const cookieStore = await cookies();
    const trafficSource = {
      source: cookieStore.get('utm_source')?.value || 'direct',
      medium: cookieStore.get('utm_medium')?.value || 'none',
      campaign: cookieStore.get('utm_campaign')?.value || 'none',
    };
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const orderDocument = {
      userId: session.user.id,
      products: cartItems.map((item) => ({
        productId: item._id, name: item.name, price: item.price, quantity: item.quantity, 
        image: item.image, slug: item.slug,
        variant: item.variant ? { key: item.variant._key, name: item.variant.name } : null,
      })),
      shippingAddress, 
      totalPrice,
      status: "Pending", 
      paymentMethod: "Cash on Delivery", 
      paymentStatus: "Unpaid",
      orderDate: new Date(),
      trafficSource: trafficSource, // NAYI FIELD: Traffic source ko order ke sath save karo
    };
    
    const result = await db.collection("orders").insertOne(orderDocument);
    const newOrderId = result.insertedId.toString();

    // --- Email Bhejne ka Logic (koi change nahi) ---
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const emailHtml = createOrderConfirmationHtml({
        orderId: newOrderId, customerName: shippingAddress.fullName,
        products: cartItems, totalPrice: totalPrice, shippingAddress: shippingAddress
      });

      await transporter.sendMail({
        from: '"PocketValue" <support@pocketvalue.pk>', // Yahan apna professional email daalein
        to: session.user.email,
        bcc: process.env.ADMIN_EMAIL,
        subject: `Your PocketValue Order Confirmation [#${newOrderId.slice(-6)}]`,
        html: emailHtml,
      });

      console.log(`Confirmation emails sent for order ${newOrderId}`);
    } catch (emailError) {
      console.error(`CRITICAL: Order ${newOrderId} was created, but failed to send email:`, emailError);
    }

    // === NAYA: UTM Cookies ko Clear Karo ===
    // Order place hone ke baad, in cookies ki zaroorat nahi rehti.
    // Is se user ke agle order mein ghalat data nahi jayega.
    const response = NextResponse.json({ message: "Order placed successfully!", orderId: newOrderId }, { status: 201 });
    response.cookies.delete('utm_source');
    response.cookies.delete('utm_medium');
    response.cookies.delete('utm_campaign');
    
    return response;
    // =======================================

  } catch (error) {
    console.error("COD Checkout API Error: ", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}