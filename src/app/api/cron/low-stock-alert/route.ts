// /src/app/api/cron/low-stock-alert/route.ts

import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import groq from 'groq';
import nodemailer from 'nodemailer';
import { createLowStockAlertHtml } from '@/email_templates/lowStockAlertEmail'; // We will create this template next

// --- Type Definition for the data we fetch ---
interface LowStockVariant {
  _id: string; // Product ID
  title: string;
  slug: string;
  variant: {
    _key: string;
    name: string;
    sku?: string;
    stock: number;
  };
}

// // === GET Handler for the Cron Job ===
// // Vercel Cron Jobs send a GET request to this endpoint.
// export async function GET(request: Request) {
//   // --- Security: Protect the endpoint with a secret key ---
//   // This prevents anyone from randomly triggering your email alerts.
//   const authHeader = request.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new Response('Unauthorized', { status: 401 });
//   }

export async function GET(request: Request) {
  // --- TEMPORARY MODIFICATION FOR LOCAL TESTING ---
  const authHeader = request.headers.get('authorization');
  // Allow request if it's in development, OR if the cron secret matches in production
  if (process.env.NODE_ENV !== 'development' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // --- END OF MODIFICATION ---

  try {
    // 1. Fetch the low stock threshold and recipient email from Sanity settings
    const settingsQuery = groq`*[_type == "settings"][0] {
        "threshold": inventorySettings.lowStockThreshold,
        "recipient": inventorySettings.alertRecipientEmail
    }`;
    const settings = await client.fetch(settingsQuery);
    const threshold = settings?.threshold ?? 5; // Default to 5 if not set
    const recipientEmail = settings?.recipient;

    if (!recipientEmail) {
        throw new Error("Alert recipient email is not configured in Sanity settings.");
    }

 // --- THE FIX IS HERE: More Robust and Explicit GROQ Query ---
    const lowStockQuery = groq`
      *[_type == "product" && defined(variants) && count(variants[defined(stock) && stock <= $threshold]) > 0] {
        _id,
        title,
        "slug": slug.current,
        // Only project the variants that are actually low in stock
        "variants": variants[defined(stock) && stock <= $threshold] {
          _key,
          name,
          sku,
          stock
        }
      }
    `;
    const productsWithLowStock = await client.fetch(lowStockQuery, { threshold });

    // --- DEBUGGING STEP: Log what we found ---
    console.log(`[DEBUG] Cron Job: Found ${productsWithLowStock.length} products with low stock variants.`);
    
    if (productsWithLowStock.length === 0) {
      console.log("Cron Job: No low stock items found. No email will be sent.");
      return NextResponse.json({ success: true, message: "No low stock items found." });
    }

    const lowStockVariants: LowStockVariant[] = productsWithLowStock.flatMap((product: any) => 
        product.variants.map((variant: any) => ({
            _id: product._id,
            title: product.title,
            slug: product.slug,
            variant: variant
        }))
    );
    
    if (lowStockVariants.length === 0) {
      // This is a safety net, should not be reached if the above check works
      console.log("Cron Job: Flattened variant list is empty. No email sent.");
      return NextResponse.json({ success: true, message: "No low stock items." });
    }

    // 4. If low-stock items are found, send the email alert.
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!),
        auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });

    const emailHtml = createLowStockAlertHtml({ lowStockItems: lowStockVariants });
    const subject = `🔴 Low Stock Alert: ${lowStockVariants.length} item(s) need your attention!`;

    await transporter.sendMail({
        from: '"PocketValue Alerts" <support@pocketvalue.pk>',
        to: recipientEmail,
        subject: subject,
        html: emailHtml,
    });
    
    console.log(`Cron Job: Low stock alert sent to ${recipientEmail} for ${lowStockVariants.length} item(s).`);
    return NextResponse.json({ success: true, message: "Alert email sent." });

  } catch (error: any) {
    console.error("Cron Job Error (Low Stock Alert):", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}