// // /src/app/lib/payment/gateways/cod.ts

// import { Order } from "@/types";

// /**
//  * Initiates a "checkout session" for Cash on Delivery.
//  * This is a synchronous process that signals immediate success.
//  * @param order The order object.
//  * @param _credentials Ignored for COD, but included for adapter compatibility.
//  * @returns An object indicating success without a redirect URL.
//  */
// export async function createCheckoutSession(order: Order, _credentials: any) {
//   console.log(`[COD] Initializing order ${order._id} as Cash on Delivery.`);
  
//   return { 
//     success: true, 
//     redirectUrl: null, // No external redirection needed
//     data: null,        // No form data needed
//     message: "Order will be processed as Cash on Delivery."
//   };
// }

// /**
//  * "Verifies" a payment for Cash on Delivery.
//  * This step confirms the order status should be updated in the database.
//  * @param requestData Data from our own system (contains orderId).
//  * @param _credentials Ignored for COD.
//  * @returns An object with the new statuses for the order.
//  */
// export async function verifyPayment(requestData: any, _credentials: any) {
//   const { orderId } = requestData;
//   if (!orderId) throw new Error("[COD] Order ID is missing for verification.");
  
//   console.log(`[COD] Finalizing status for order: ${orderId}`);

//   return { 
//       success: true, 
//       orderId: orderId,
//       paymentStatus: 'Unpaid',   // Payment is collected upon delivery
//       orderStatus: 'Processing', // Order is ready to be prepared and shipped
//       transactionId: null,       // No external transaction ID for COD
//       message: "COD order confirmed and is now processing."
//   };
// }
// /src/app/lib/payment/gateways/cod.ts

import { IOrder } from "@/models/Order"; // <-- YAHAN TABDEELI HAI

/**
 * Initiates a "checkout session" for Cash on Delivery.
 */
export async function createCheckoutSession(order: IOrder, _credentials: any) { // <-- YAHAN TABDEELI HAI
  console.log(`[COD] Initializing order ${order._id} as Cash on Delivery.`);
  
  return { 
    success: true, 
    redirectUrl: null,
    data: null,
    message: "Order will be processed as Cash on Delivery."
  };
}

/**
 * "Verifies" a payment for Cash on Delivery.
 * (Is function mein 'order' object nahi aata, isliye ismein koi tabdeeli nahi)
 */
export async function verifyPayment(requestData: any, _credentials: any) {
  const { orderId } = requestData;
  if (!orderId) throw new Error("[COD] Order ID is missing for verification.");
  
  console.log(`[COD] Finalizing status for order: ${orderId}`);

  return { 
      success: true, 
      orderId: orderId,
      paymentStatus: 'Unpaid',
      orderStatus: 'Processing',
      transactionId: null,
      message: "COD order confirmed and is now processing."
  };
}