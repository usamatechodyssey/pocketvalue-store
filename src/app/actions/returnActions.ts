// app/actions/returnAction
"use server";

import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import connectMongoose from "@/app/lib/mongoose";
import Order from "@/models/Order";
import ReturnRequest, { IReturnRequest } from "@/models/ReturnRequest";
import { createReturnRequestReceivedEmail } from "@/email_templates/returnRequestReceivedEmail";
import { createReturnRequestAdminNotificationEmail } from "@/email_templates/returnRequestAdminNotificationEmail";
import SanityProduct from "@/sanity/types/product_types";
import { getProductsByIds } from "@/sanity/lib/queries";
import { Types } from "mongoose";
// === THE FIX IS HERE: Import Zod and our new schema ===
import { z } from "zod";
import { CreateReturnRequestSchema } from "@/app/lib/zodSchemas"
// --- Type Definitions ---

// Client-side ke liye saada (plain) object types
export type UserReturnRequest = {
  _id: string;
  orderNumber: string;
  status: IReturnRequest['status'];
  createdAt: string;
};

export type FullUserReturnRequest = {
  _id: string;
  orderNumber: string;
  status: IReturnRequest['status'];
  resolution?: IReturnRequest['resolution'];
  adminComments?: string;
  customerComments?: string;
  createdAt: string;
  items: Array<{
    productId: string;
    variantKey: string;
    quantity: number;
    reason: string;
    productDetails: SanityProduct | null;
  }>;
};

interface CreateReturnRequestResult {
  success: boolean;
  message: string;
}


export async function createReturnRequestAction(formData: FormData): Promise<CreateReturnRequestResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.name || !session.user.email) {
    return { success: false, message: "You must be logged in to request a return." };
  }

  // --- Step 1: Validate with Zod ---
  // Convert FormData to a plain object for Zod
  const formObject = Object.fromEntries(formData.entries());
  const validatedFields = CreateReturnRequestSchema.safeParse(formObject);

  if (!validatedFields.success) {
      return {
          success: false,
          message: validatedFields.error.issues[0].message,
      };
  }
  // Use the clean, validated, and parsed data from here
  const { orderId, orderNumber, items, customerComments } = validatedFields.data;

  try {
    await connectMongoose();
    
    // The old manual 'if' checks are no longer needed.
    
    const order = await Order.findOne({ 
      _id: orderId,
      userId: session.user.id 
    });

    if (!order) {
      return { success: false, message: "Order not found or you do not have permission." };
    }
    
    const newReturnRequest = new ReturnRequest({
      orderId: order._id,
      orderNumber,
      userId: session.user.id,
      items, // Pass the validated and parsed items array directly
      customerComments,
    });

    await newReturnRequest.save();

    // --- CODE HARDENING FIX IS HERE ---
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!),
            auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
        });

        // Email #1: Send to the user
        const customerEmailHtml = createReturnRequestReceivedEmail({
            customerName: session.user.name,
            orderNumber: orderNumber,
            requestId: newReturnRequest._id.toString(),
        });
        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: session.user.email,
            subject: `Return Request Received for Order ${orderNumber}`,
            html: customerEmailHtml,
        });

        // Email #2: Send to the admin (with a safety check)
        if (process.env.ADMIN_EMAIL) {
            const adminEmailHtml = createReturnRequestAdminNotificationEmail({
                customerName: session.user.name,
                orderNumber: orderNumber,
                requestId: newReturnRequest._id.toString(),
                itemCount: items.length,
            });
            await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `[New Return Request] Order ${orderNumber}`,
                html: adminEmailHtml,
            });
        } else {
            console.warn(`WARNING: ADMIN_EMAIL environment variable is not set. Could not send new return request notification for ${newReturnRequest._id}.`);
        }

    } catch (emailError) {
        console.error(`CRITICAL: Return request ${newReturnRequest._id} created, but FAILED to send notification emails:`, emailError);
    }

    revalidatePath(`/account/orders/${orderId}`);
    revalidatePath('/Bismillah786/returns');

    return { success: true, message: "Your return request has been submitted successfully." };

  } catch (error) {
    console.error("Error creating return request:", error);
    const message = error instanceof Error ? error.message : "An unknown server error occurred.";
    return { success: false, message };
  }
}

// === NAYA ACTION #1: GET USER'S RETURN REQUESTS (REFACTORED WITH FIX) ===
export async function getUserReturnRequests(): Promise<UserReturnRequest[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    await connectMongoose();
    
    type ReturnRequestLean = Omit<IReturnRequest, '_id'> & { 
        _id: Types.ObjectId; 
        createdAt: Date; 
    };
    
    const requests = await ReturnRequest.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean<ReturnRequestLean[]>();

    return requests.map(req => ({
      _id: req._id.toString(),
      orderNumber: req.orderNumber,
      status: req.status,
      createdAt: req.createdAt.toISOString(),
    }));

  } catch (error) {
    console.error("Error fetching user's return requests:", error);
    return [];
  }
}



// === NAYA ACTION #2: GET SINGLE USER RETURN REQUEST (DETAIL PAGE KE LIYE) ===
export async function getSingleUserReturnRequest(returnId: string): Promise<FullUserReturnRequest | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    await connectMongoose();

    type ReturnRequestLean = Omit<IReturnRequest, '_id'> & { _id: Types.ObjectId; createdAt: Date; };
    
    const request = await ReturnRequest.findOne({
      _id: returnId,
      userId: session.user.id
    }).lean<ReturnRequestLean>();

    if (!request) {
      return null;
    }

    const productIdsInRequest = request.items.map(item => item.productId);
    const sanityProducts = await getProductsByIds(productIdsInRequest);
    const productsMap = new Map<string, SanityProduct>(sanityProducts.map((p: { _id: any; }) => [p._id, p]));

    const finalResult: FullUserReturnRequest = {
      _id: request._id.toString(),
      orderNumber: request.orderNumber,
      status: request.status,
      resolution: request.resolution,
      adminComments: request.adminComments,
      customerComments: request.customerComments,
      createdAt: request.createdAt.toISOString(),
      items: request.items.map(item => ({
        ...item,
        productDetails: productsMap.get(item.productId) || null,
      })),
    };

    return finalResult;
  } catch (error) {
    console.error("Error fetching single user return request:", error);
    return null;
  }
}