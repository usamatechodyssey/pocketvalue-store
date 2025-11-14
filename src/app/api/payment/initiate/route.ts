// /src/app/api/payment/initiate/route.ts (FINAL & REFACTORED WITH ZOD)

import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { initiatePayment } from '@/app/lib/payment/paymentAdapter';
import connectMongoose from '@/app/lib/mongoose';
import Order, { IOrder } from '@/models/Order';
import { InitiatePaymentSchema } from "@/app/lib/zodSchemas";

async function getOrderForPayment(orderId: string, userId: string): Promise<IOrder | null> {
    try {
        await connectMongoose();
        const order = await Order.findOne({ 
            _id: orderId,
            userId: userId 
        }).lean<IOrder>();
        
        return order;

    } catch (error) {
        console.error("Failed to fetch order for payment:", error);
        return null;
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    try {
        const body = await req.json();

        // --- Step 1: Validate with Zod ---
        const validation = InitiatePaymentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 });
        }
        const { orderId, gatewayKey } = validation.data;

        // The old manual 'if' check is now gone.

        const order = await getOrderForPayment(orderId, session.user.id);
        if (!order) {
            return NextResponse.json({ message: "Order not found or access denied." }, { status: 404 });
        }
        
        // This check is business logic, so it stays.
        if (order.status !== 'Pending' && order.status !== 'On Hold') {
            return NextResponse.json({ message: "This order can no longer be paid for." }, { status: 400 });
        }

        const result = await initiatePayment(order, gatewayKey as any);

        if (result.success) {
            return NextResponse.json({ 
                success: true,
                redirectUrl: result.redirectUrl, 
                data: result.data,
                message: result.message
            });
        } else {
            throw new Error(result.message || "Failed to initiate payment session.");
        }

    } catch (error: any) {
        console.error("Payment Initiation API Error: ", error);
        return NextResponse.json({ message: error.message || "An internal server error occurred." }, { status: 500 });
    }
}