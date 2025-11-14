// /src/app/lib/payment/gateways/jazzcash.ts

import { IOrder } from "@/models/Order"; // <-- YAHAN TABDEELI HAI
import crypto from 'crypto';

/**
 * Creates a secure hash for JazzCash requests using HMAC-SHA256.
 * @param data An object containing all the data to be hashed, sorted alphabetically by key.
 * @param integritySalt The secret Integrity Salt provided by JazzCash.
 * @returns A SHA256 hash string.
 */
function createSecureHash(data: { [key: string]: string }, integritySalt: string): string {
    const sortedKeys = Object.keys(data).sort();
    
    let stringToHash = "";
    for (let i = 0; i < sortedKeys.length; i++) {
        stringToHash += `${sortedKeys[i]}=${data[sortedKeys[i]]}`;
        if (i < sortedKeys.length - 1) {
            stringToHash += "&";
        }
    }

    const hash = crypto.createHmac('sha256', integritySalt)
                       .update(stringToHash)
                       .digest('hex');
    
    return hash;
}

/**
 * Initiates a checkout session for JazzCash.
 * It generates a secure hash and returns data for auto-submitting a form.
 * @param order The order object from our database.
 * @param credentials Must contain merchantId, password, and integritySalt.
 * @returns An object containing the URL and form data for redirection.
 */
/**
 * Initiates a checkout session for JazzCash.
 */
export async function createCheckoutSession(order: IOrder, credentials: any) { // <-- YAHAN TABDEELI HAI
  console.log(`[JazzCash] Creating checkout session for order ${order._id}...`);

  if (!credentials.merchantId || !credentials.password || !credentials.integritySalt || !process.env.JAZZCASH_API_URL || !process.env.JAZZCASH_RETURN_URL) {
    throw new Error("JazzCash credentials or URLs are not fully configured.");
  }
  
  const now = new Date();
  const transactionDate = now.toISOString().slice(0, 19).replace(/[-T:]/g, '');
  now.setHours(now.getHours() + 1);
  const expiryDate = now.toISOString().slice(0, 19).replace(/[-T:]/g, '');

  const postData: { [key: string]: string } = {
    pp_Version: "2.0",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: credentials.merchantId,
    pp_Password: credentials.password,
    pp_TxnRefNo: `PV${Date.now()}`,
    pp_Amount: (order.totalPrice * 100).toString(),
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: transactionDate,
    pp_BillReference: order._id.toString(), // _id is already a string, .toString() is safe
    pp_Description: `Payment for Order #${order.orderId}`, // Use the new orderId for display
    pp_TxnExpiryDateTime: expiryDate,
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
  };

  const secureHash = createSecureHash(postData, credentials.integritySalt);
  
  const paymentFormData = { ...postData, pp_SecureHash: secureHash };

  return { 
    success: true, 
    redirectUrl: process.env.JAZZCASH_API_URL,
    data: paymentFormData,
    message: "Redirecting to JazzCash for payment..."
  };
}

/**
 * Verifies a payment callback from JazzCash.
 * This is a critical security step.
 * @param requestData The data received from JazzCash's server (usually a POST request).
 * @param credentials Contains the integritySalt for verification.
 * @returns An object with the final status of the order.
 */
export async function verifyPayment(requestData: any, credentials: any) {
  console.log("[JazzCash] Verifying payment callback...");
  
  const { pp_ResponseCode, pp_ResponseMessage, pp_TxnRefNo, pp_BillReference, pp_SecureHash } = requestData;
  const receivedHash = pp_SecureHash;
  
  // --- CRITICAL SECURITY STEP: VERIFY HASH ---
  // To verify, we must remove pp_SecureHash from the received data and regenerate the hash.
  const dataToVerify: { [key: string]: string } = { ...requestData };
  delete dataToVerify.pp_SecureHash;

  const calculatedHash = createSecureHash(dataToVerify, credentials.integritySalt);

  if (calculatedHash.toLowerCase() !== receivedHash.toLowerCase()) {
    console.error(`[JazzCash] HASH MISMATCH for Order ID: ${pp_BillReference}. Calculated: ${calculatedHash}, Received: ${receivedHash}`);
    return { 
        success: false, 
        orderId: pp_BillReference, 
        message: "Invalid payment signature from JazzCash. Payment rejected for security reasons." 
    };
  }
  // --- End of Security Step ---

  if (pp_ResponseCode === '000') {
    console.log(`[JazzCash] Payment successful for order: ${pp_BillReference}`);
    return { 
        success: true, 
        orderId: pp_BillReference,
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        transactionId: pp_TxnRefNo,
        message: "Payment successful."
    };
  } else {
    console.error(`[JazzCash] Payment failed for order ${pp_BillReference}: ${pp_ResponseMessage}`);
    return {
        success: false,
        orderId: pp_BillReference,
        paymentStatus: 'Failed',
        orderStatus: 'Pending',
        transactionId: pp_TxnRefNo,
        message: pp_ResponseMessage || "JazzCash payment failed or was cancelled."
    };
  }
}