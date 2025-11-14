// // /src/app/lib/payment/gateways/banktransfer.ts

// import { Order } from "@/types";

// /**
//  * Initiates a "checkout session" for Bank Transfer.
//  * It doesn't redirect but returns the necessary bank account details
//  * to be displayed to the user on the success page.
//  * @param order The order object from our database.
//  * @param credentials Must contain bankName, accountTitle, and accountNumber. IBAN is optional.
//  * @returns An object containing the bank details for the frontend.
//  */
// export async function createCheckoutSession(order: Order, credentials: any) {
//   console.log(`[Bank Transfer] Initializing order ${order._id} for Bank Transfer.`);

//   if (!credentials.bankName || !credentials.accountNumber || !credentials.accountTitle) {
//     throw new Error("Bank Transfer credentials (bankName, accountTitle, accountNumber) are not fully configured.");
//   }
  
//   return { 
//     success: true, 
//     redirectUrl: null, // No redirect is necessary
//     data: { // This data will be passed to the success page
//         bankName: credentials.bankName,
//         accountTitle: credentials.accountTitle,
//         accountNumber: credentials.accountNumber,
//         iban: credentials.iban || 'N/A' // Include IBAN if available
//     },
//     message: "Please transfer the amount to the provided bank account to complete your order."
//   };
// }

// /**
//  * "Verifies" a payment for Bank Transfer.
//  * This function's primary role is to set the order to an 'On Hold' status,
//  * signaling that it's awaiting manual confirmation of payment from an admin.
//  * @param requestData Data from our own system, containing the orderId.
//  * @param _credentials Ignored for Bank Transfer, but part of the adapter signature.
//  * @returns An object with the new 'On Hold' status for the order.
//  */
// export async function verifyPayment(requestData: any, _credentials: any) {
//   const { orderId } = requestData;
//   if (!orderId) throw new Error("[Bank Transfer] Order ID is missing for verification.");

//   console.log(`[Bank Transfer] Setting order to 'On Hold': ${orderId}`);

//   // For Bank Transfer, the payment remains 'Unpaid' and the order is put 'On Hold'
//   // until an admin manually verifies the transaction and updates the status.
//   return { 
//       success: true, 
//       orderId: orderId,
//       paymentStatus: 'Unpaid',
//       orderStatus: 'On Hold', 
//       transactionId: null, // No automatic transaction ID
//       message: "Order is now On Hold, awaiting payment confirmation from the admin."
//   };
// }
// /src/app/lib/payment/gateways/banktransfer.ts

import { IOrder } from "@/models/Order"; // <-- YAHAN TABDEELI HAI

/**
 * Initiates a "checkout session" for Bank Transfer.
 */
export async function createCheckoutSession(order: IOrder, credentials: any) { // <-- YAHAN TABDEELI HAI
  console.log(`[Bank Transfer] Initializing order ${order._id} for Bank Transfer.`);

  if (!credentials.bankName || !credentials.accountNumber || !credentials.accountTitle) {
    throw new Error("Bank Transfer credentials are not fully configured.");
  }
  
  return { 
    success: true, 
    redirectUrl: null,
    data: {
        bankName: credentials.bankName,
        accountTitle: credentials.accountTitle,
        accountNumber: credentials.accountNumber,
        iban: credentials.iban || 'N/A'
    },
    message: "Please use the provided bank account to complete your order."
  };
}

/**
 * "Verifies" a payment for Bank Transfer.
 * (Is function mein 'order' object nahi aata, isliye ismein koi tabdeeli nahi)
 */
export async function verifyPayment(requestData: any, _credentials: any) {
  const { orderId } = requestData;
  if (!orderId) throw new Error("[Bank Transfer] Order ID is missing for verification.");

  console.log(`[Bank Transfer] Setting order to 'On Hold': ${orderId}`);

  return { 
      success: true, 
      orderId: orderId,
      paymentStatus: 'Unpaid',
      orderStatus: 'On Hold', 
      transactionId: null,
      message: "Order is now On Hold, awaiting payment confirmation."
  };
}