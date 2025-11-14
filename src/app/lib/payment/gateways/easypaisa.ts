// /src/app/lib/payment/gateways/easypaisa.ts

import { IOrder } from "@/models/Order"; // <-- YAHAN TABDEELI HAI
import crypto from 'crypto';

/**
 * Initiates a checkout session for Easypaisa.
 */
export async function createCheckoutSession(order: IOrder, credentials: any) { // <-- YAHAN TABDEELI HAI
  console.log(`[Easypaisa] Creating checkout session for order ${order._id}...`);

  if (!credentials.storeId || !credentials.hashKey || !process.env.EASYPAISA_API_URL || !process.env.EASYPAISA_POST_BACK_URL) {
    throw new Error("Easypaisa credentials or URLs are not configured.");
  }

  const postData: { [key: string]: string } = {
    amount: order.totalPrice.toString(),
    storeId: credentials.storeId,
    orderId: order._id.toString(), // _id is already a string, .toString() is safe
    emailAddress: order.shippingAddress.email,
    postBackURL: process.env.EASYPAISA_POST_BACK_URL,
    mobileNum: order.shippingAddress.phone.replace(/[^0-9]/g, ''),
    merchantPaymentMethod: "",
  };

  const sortedKeys = Object.keys(postData).sort();
  let stringToHash = credentials.hashKey; // Start with the hash key
  for (const key of sortedKeys) {
      stringToHash += `${key}=${postData[key]}&`;
  }
  stringToHash = stringToHash.slice(0, -1);

  // Note: Easypaisa hash generation can vary. The below is a common pattern.
  // Always double-check with their latest official documentation.
  const hash = crypto.createHmac('sha256', credentials.hashKey)
                     .update(stringToHash)
                     .digest('hex');
  
  const paymentFormData = { ...postData, encryptedHash: hash };
  
  return { 
    success: true, 
    redirectUrl: process.env.EASYPAISA_API_URL,
    data: paymentFormData,
    message: "Redirecting to Easypaisa for payment..."
  };
}


/**
 * Verifies a payment callback from Easypaisa.
 * This is a critical security step to prevent fraud.
 * @param requestData The data received from Easypaisa's server (usually from URL query params).
 * @param _credentials Contains the hashKey needed for verification.
 * @returns An object with the final status of the order.
 */
export async function verifyPayment(requestData: any, _credentials: any) {
    console.log("[Easypaisa] Verifying payment callback...");
    
    // In a real scenario, Easypaisa redirects back with query parameters.
    // We would need to verify the hash sent back by them.
    // NOTE: Easypaisa's documentation on callback verification can be inconsistent.
    // This is a general representation. Always confirm with their latest official docs.
    
    const { auth_token, post_back_url, ...restOfData } = requestData;
    const orderId = restOfData.orderRefNumber; // Easypaisa might use a different name like 'orderRefNumber'
    const responseCode = restOfData.responseCode;
    const responseDesc = restOfData.desc;
    const transactionId = restOfData.transRefNumber;

    // A simple check based on response code. In production, you would also verify a hash/token.
    if (responseCode === '0000') {
        // --- TODO: CRITICAL SECURITY STEP ---
        // Implement any signature/token verification provided by Easypaisa here.
        // If the signature is invalid, return { success: false, ... }
        console.log(`[Easypaisa] Payment successful for order: ${orderId}`);
        return { 
            success: true, 
            orderId: orderId,
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            transactionId: transactionId,
            message: "Payment successful."
        };
    } else {
        console.error(`[Easypaisa] Payment failed for order ${orderId}: ${responseDesc}`);
        return {
            success: false,
            orderId: orderId,
            paymentStatus: 'Failed',
            orderStatus: 'Pending', // Keep it pending so user can try again
            transactionId: transactionId,
            message: responseDesc || "Payment failed or was cancelled."
        };
    }
}