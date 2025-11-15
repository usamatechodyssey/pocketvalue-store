// /src/app/api/orders/create/route.ts (WITH DEBUGGING CONSOLE LOGS)

import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import connectMongoose from "@/app/lib/mongoose";
import Order from "@/models/Order";
import { generateNextOrderId } from "@/app/lib/order-utils";
import { getProductsStockStatus } from "@/sanity/lib/queries";
import { calculateShippingCostServer } from "@/app/lib/shipping-calculator";
import { verifyAndApplyCoupon } from "@/app/actions/couponActions";
import { redis } from "@/app/lib/rate-limiter";
import { CreateOrderSchema } from "@/app/lib/zodSchemas";
import { CleanCartItem } from "@/sanity/types/product_types";

export async function POST(req: NextRequest) {

  const session = await auth();
  if (!session?.user?.id) {
    console.error("DEBUG: Authentication failed. Session or user ID is missing.");
    return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
  }
  console.log("DEBUG: User authenticated. User ID:", session.user.id, "User Email:", session.user.email);

  try {
    const body = await req.json();
    
   

    // --- Step 1: Validate the entire request body with Zod ---
    const validation = CreateOrderSchema.safeParse(body);
    if (!validation.success) {
      // --- DEBUG 3: Log the Zod validation error ---
      return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 });
    }
    const { shippingAddress, cartItems, totalPrice: clientGrandTotal, couponCode } = validation.data;
    
    
    
    await connectMongoose();

    // --- Step 2: Verify Prices & Stock (Logic remains the same) ---
    const productIdsInCart = cartItems.map(item => item._id);
    const liveProductsData = await getProductsStockStatus(productIdsInCart);
    const productMap = new Map(liveProductsData.map(p => [p._id, p]));
    let serverSubtotal = 0;
    for (const item of cartItems as CleanCartItem[]) {
        if (!item.variant) throw new Error(`Product "${item.name}" is missing variant info.`);
        const liveProduct = productMap.get(item._id);
        if (!liveProduct) throw new Error(`Product "${item.name}" is no longer available.`);
        const liveVariant = liveProduct.variants?.find(v => v._key === item.variant!._key);
        if (!liveVariant) throw new Error(`Selected option for "${item.name}" is no longer available.`);
        if (!liveVariant.inStock || (liveVariant.stock !== undefined && liveVariant.stock < item.quantity)) {
            throw new Error(`Sorry, "${item.name}" is out of stock.`);
        }
        const effectivePrice = liveVariant.salePrice ?? liveVariant.price;
        serverSubtotal += effectivePrice * item.quantity;
    }

    // --- Steps 3-7: Calculations, Order Creation, etc. (Logic remains the same) ---
    const serverShipping = await calculateShippingCostServer(serverSubtotal);
    let monetaryDiscount = 0;
    let shippingDiscount = 0;
    let finalCoupon = null;
    if (couponCode) {
      const couponResult = await verifyAndApplyCoupon(couponCode, { items: cartItems as CleanCartItem[], subtotal: serverSubtotal }, req);
      if (couponResult.success && couponResult.finalDiscount) {
        if (couponResult.finalDiscount.type === 'freeShipping') shippingDiscount = serverShipping.cost;
        else monetaryDiscount = couponResult.finalDiscount.amount;
        finalCoupon = { code: couponResult.finalDiscount.code, amount: couponResult.finalDiscount.amount };
      } else {
        throw new Error(`Coupon "${couponCode}" is no longer valid. Please remove it and try again.`);
      }
    }
    const finalServerShippingCost = serverShipping.cost - shippingDiscount;
    const serverGrandTotal = serverSubtotal - monetaryDiscount + finalServerShippingCost;
    if (Math.abs(serverGrandTotal - clientGrandTotal) > 1) { 
      throw new Error(`Price mismatch detected. Server total: ${serverGrandTotal}, Client total: ${clientGrandTotal}. Please refresh your cart.`);
    }
    const cookieStore = await cookies();
    const trafficSource = {
        source: cookieStore.get('utm_source')?.value, medium: cookieStore.get('utm_medium')?.value, campaign: cookieStore.get('utm_campaign')?.value
    };
    const newOrderId = await generateNextOrderId();
    
    // --- FINAL FIX & DEBUG 5: Constructing the new order object ---
    const orderDataToSave = {
      _id: newOrderId,
      orderId: newOrderId,
      userId: session.user.id,
      products: cartItems.map((item: any) => ({ ...item, productId: item._id })),
      shippingAddress: {
        ...shippingAddress,
        email: session.user.email, // <-- THE FIX: Add email from the secure session
      },
      subtotal: serverSubtotal,
      shippingCost: finalServerShippingCost,
      coupon: finalCoupon,
      totalPrice: serverGrandTotal,
      trafficSource,
    };
    
    

    const newOrder = new Order(orderDataToSave);
    await newOrder.save();

    if (finalCoupon) {
      await redis.incr(`coupon:usage:${finalCoupon.code}`);
    }

    console.log("--- Order Creation Successful ---");
    return NextResponse.json({ message: "Order created successfully!", orderId: newOrderId }, { status: 201 });

  } catch (error: any) {
    // --- DEBUG 6: Log the exact error that is being caught ---
    console.error("Order Creation API Error: ", error);
    return NextResponse.json({ message: error.message || "An internal server error occurred." }, { status: 500 });
  }
}