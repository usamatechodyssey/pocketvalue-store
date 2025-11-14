// /src/app/actions/orderActions.ts (REFACTORED WITH ZOD)

"use server";

import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectMongoose from "@/app/lib/mongoose";
import Order, { IOrder } from "@/models/Order";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { UpdateOrderStatusSchema, SendCustomEmailSchema, CancelOrderSchema } from "@/app/lib/zodSchemas";

import { createCustomAdminEmailHtml } from '@/email_templates/CustomAdminEmail';
import { createOrderShippedHtml, createOrderProcessingHtml, createOrderDeliveredHtml, createOrderCancelledHtml } from '@/email_templates/orderStatusEmails';
// === THE DTO (Data Transfer Object) PATTERN IS HERE ===

// This is a plain, serializable type for a single product within an order.
export type ClientOrderProduct = {
  _id: string;
  cartItemId: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  image: any; // Sanity image object is serializable
  variant?: {
    _key: string;
    name: string;
  }
};

// This is a plain, serializable type for an entire order, SAFE for client components.
export type ClientOrder = {
  _id: string; // The MongoDB ObjectId as a string
  orderId: string; // The human-readable ID like "PV-1001"
  userId: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'On Hold';
  createdAt: string; // Date converted to ISO string
  products: ClientOrderProduct[];
  shippingAddress: IOrder['shippingAddress']; // Shipping address is already a plain object
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  subtotal: number;
  shippingCost: number;
};

// =======================================================

interface ServerResponse {
  success: boolean;
  message: string;
}

interface GetPaginatedOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
  userId?: string | null;
}

async function verifyAdmin(allowedRoles: string[]): Promise<string> {
    const session = await auth();
    const userRole = session?.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
        throw new Error("Permission Denied: You do not have access to perform this action.");
    }
    return userRole;
}


// --- Helper for generating email content ---
function getEmailDetailsForStatus(status: string, customerName: string, orderId: string) {
    switch (status) {
        case "Processing": return { subject: `Your PocketValue Order is being processed! [#${orderId}]`, html: createOrderProcessingHtml({ customerName, orderId }) };
        case "Shipped": return { subject: `Your PocketValue Order has been Shipped! [#${orderId}]`, html: createOrderShippedHtml({ customerName, orderId }) };
        case "Delivered": return { subject: `Your PocketValue Order has been Delivered! [#${orderId}]`, html: createOrderDeliveredHtml({ customerName, orderId }) };
        case "Cancelled": return { subject: `Your PocketValue Order has been Cancelled [#${orderId}]`, html: createOrderCancelledHtml({ customerName, orderId }) };
        default: return { subject: null, html: null };
    }
}

// === ACTION #1: GET PAGINATED ORDERS (Updated to return ClientOrder[]) ===
export async function getPaginatedOrders({ 
    page = 1, limit = 10, status = 'all', searchTerm = '', userId = null
}: GetPaginatedOrdersParams): Promise<{ orders: ClientOrder[], totalPages: number }> {
  try {
    await connectMongoose();
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (userId) query.userId = userId;

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm.trim(), 'i');
      query.$or = [
          { orderId: searchRegex },
          { "shippingAddress.fullName": searchRegex },
          { "shippingAddress.phone": searchRegex },
      ];
    }
    
    const [ordersData, totalOrders] = await Promise.all([
        Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IOrder[]>(), // Get Mongoose objects
        Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);
    
    // Manually convert Mongoose objects to plain ClientOrder objects
    const clientOrders: ClientOrder[] = ordersData.map(order => ({
        _id: order._id.toString(),
        orderId: order.orderId,
        userId: order.userId,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: new Date(order.createdAt).toISOString(),
        products: order.products.map(p => ({
            _id: p._id,
            cartItemId: p.cartItemId,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            slug: p.slug,
            image: p.image,
            variant: p.variant
        })),
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
    }));

    return { orders: clientOrders, totalPages };

  } catch (error) {
    console.error("Failed to fetch paginated orders:", error);
    return { orders: [], totalPages: 0 };
  }
}

// === ACTION #2: UPDATE ORDER STATUS (Refactored with Zod) ===
export async function updateOrderStatus(orderId: string, newStatus: string): Promise<ServerResponse> {
    const validation = UpdateOrderStatusSchema.safeParse({ orderId, newStatus });
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message };
    }
    // Use validated data from here
    const { orderId: validatedOrderId, newStatus: validatedNewStatus } = validation.data;

    try {
        await verifyAdmin(['Super Admin', 'Store Manager']);
        await connectMongoose();

        const order = await Order.findById(validatedOrderId);
        if (!order) throw new Error("Order not found.");
        if (order.status === validatedNewStatus) return { success: true, message: "Status is already the same." };

        order.status = validatedNewStatus;
        await order.save();
        
        const user = await User.findById(order.userId);
        if (user && user.email) {
            const { subject, html } = getEmailDetailsForStatus(validatedNewStatus, user.name, order.orderId);
            if (subject && html) {
                try {
                    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!), auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } });
                    const fromEmail = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;
                    await transporter.sendMail({ from: fromEmail, to: user.email, subject, html });
                } catch (emailError) {
                    console.error(`CRITICAL: DB status for order ${validatedOrderId} updated, but FAILED to send email:`, emailError);
                }
            }
        }
        
        revalidatePath(`/Bismillah786/orders`);
        revalidatePath(`/Bismillah786/orders/${validatedOrderId}`);
        revalidatePath(`/account/orders`);
        revalidatePath(`/account/orders/${validatedOrderId}`);
        revalidatePath(`/Bismillah786/users/${order.userId}`);
        
        return { success: true, message: "Order status updated successfully!" };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message };
    }
}

// === ACTION #3: SEND CUSTOM EMAIL (Refactored with Zod) ===
export async function sendCustomEmail(customerId: string, subject: string, message: string): Promise<ServerResponse> {
    const validation = SendCustomEmailSchema.safeParse({ customerId, subject, message });
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message };
    }
    const { customerId: validatedCustomerId, subject: validatedSubject, message: validatedMessage } = validation.data;

    try {
        await verifyAdmin(['Super Admin', 'Store Manager']);
        await connectMongoose();

        const user = await User.findById(validatedCustomerId);
        if (!user || !user.email) return { success: false, message: "Customer email not found." };

        const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST!, port: Number(process.env.SMTP_PORT!), auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } });
        const emailHtml = createCustomAdminEmailHtml({ customerName: user.name, message: validatedMessage });
        const fromEmail = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;
        await transporter.sendMail({ from: fromEmail, to: user.email, subject: validatedSubject, html: emailHtml });
        
        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Send Custom Email Error:", errorMessage);
        return { success: false, message: "Failed to send email due to a server error." };
    }
}

// === ACTION #4: CANCEL AN ORDER (Refactored with Zod) ===
export async function cancelOrderAction(orderId: string): Promise<ServerResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  
  const validation = CancelOrderSchema.safeParse({ orderId });
  if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
  }
  const { orderId: validatedOrderId } = validation.data;

  try {
    await connectMongoose();
    
    const order = await Order.findOne({
        _id: validatedOrderId,
        userId: session.user.id
    });

    if (!order) {
        return { success: false, message: "Order not found or you do not have permission to cancel it." };
    }
    if (order.status !== "Pending" && order.status !== "On Hold") {
        return { success: false, message: `This order cannot be cancelled as its status is "${order.status}".` };
    }

    order.status = "Cancelled";
    await order.save();
    
    revalidatePath(`/account/orders/${validatedOrderId}`);
    revalidatePath(`/account/orders`);

    return { success: true, message: "Your order has been successfully cancelled." };

  } catch (error) {
    console.error("Error in cancelOrderAction:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}