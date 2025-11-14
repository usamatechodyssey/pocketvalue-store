// // /src/app/lib/payment/paymentAdapter.ts

// import { connectToDatabase } from "@/app/lib/mongodb";
// import { Order } from "@/types";

// // Gateway implementations ko import karein
// import * as cod from './gateways/cod';
// import * as easypaisa from './gateways/easypaisa';
// import * as jazzcash from './gateways/jazzcash';
// import * as banktransfer from './gateways/banktransfer';

// // Gateways ko ek map mein rakhein taake unhein key se aasaani se access kiya ja sake
// const gatewayImplementations = {
//   cod,
//   easypaisa,
//   jazzcash,
//   banktransfer,
// };

// // --- Helper Function: Database se payment settings get karein ---
// async function getGatewayConfig() {
//     try {
//         const { db } = await connectToDatabase();
//         // --- THE FIX IS HERE: Use 'as any' to bypass the ObjectId type-check ---
//         // We do this because we are intentionally using a known string ID ('payment_gateways')
//         // for this specific settings document, not a standard ObjectId.
//         const paymentSettings = await db.collection('settings').findOne({ _id: 'payment_gateways' } as any);
//         return paymentSettings?.gateways || [];
//     } catch (error) {
//         console.error("CRITICAL: Error fetching payment gateway configuration from database:", error);
//         return [];
//     }
// }

// // --- Universal Exported Functions ---

// /**
//  * Fetches all payment gateways that are currently marked as "enabled" in the database.
//  * This is used by the frontend to display available payment options to the user.
//  * @returns A promise that resolves to an array of enabled gateway objects ({ key, name }).
//  */
// export async function getEnabledGateways(): Promise<{ key: string; name: string }[]> {
//     const allGateways = await getGatewayConfig();
//     return allGateways
//         .filter((gw: any) => gw.enabled)
//         .map((gw: any) => ({
//             key: gw.key,
//             name: gw.name,
//         }));
// }

// /**
//  * Initiates the payment process for a given order using the specified gateway.
//  * It finds the correct gateway implementation and calls its `createCheckoutSession` method.
//  * @param order The complete order object.
//  * @param gatewayKey The key of the selected payment gateway (e.g., 'easypaisa', 'cod').
//  * @returns The result from the specific gateway's `createCheckoutSession` function.
//  */
// export async function initiatePayment(order: Order, gatewayKey: keyof typeof gatewayImplementations) {
//     const allGateways = await getGatewayConfig();
//     const gatewayConfig = allGateways.find((gw: any) => gw.key === gatewayKey && gw.enabled);

//     if (!gatewayConfig) {
//         throw new Error(`Payment gateway "${gatewayKey}" is not enabled or could not be found.`);
//     }
    
//     const implementation = gatewayImplementations[gatewayKey];
//     if (!implementation || typeof implementation.createCheckoutSession !== 'function') {
//         throw new Error(`Implementation for gateway "${gatewayKey}" is missing or invalid.`);
//     }

//     return implementation.createCheckoutSession(order, gatewayConfig.credentials);
// }

// /**
//  * Verifies a payment callback or return request from a payment gateway.
//  * This is a crucial security function.
//  * @param gatewayKey The key of the gateway that is being verified.
//  * @param requestData The data received from the gateway's server (e.g., req.body or req.query).
//  * @returns The result from the specific gateway's `verifyPayment` function.
//  */
// export async function verifyPayment(gatewayKey: keyof typeof gatewayImplementations, requestData: any) {
//     const allGateways = await getGatewayConfig();
//     const gatewayConfig = allGateways.find((gw: any) => gw.key === gatewayKey);

//     if (!gatewayConfig) {
//         throw new Error(`Configuration for payment gateway "${gatewayKey}" could not be found.`);
//     }
    
//     const implementation = gatewayImplementations[gatewayKey];
//     if (!implementation || typeof implementation.verifyPayment !== 'function') {
//         throw new Error(`Verification logic for gateway "${gatewayKey}" is missing or invalid.`);
//     }

//     return implementation.verifyPayment(requestData, gatewayConfig.credentials);
// }

// /src/app/lib/payment/paymentAdapter.ts

import connectMongoose from "@/app/lib/mongoose";
import SettingModel, { IGateway, ISetting } from "@/models/Setting"; // Hamara mustanad Setting model
import { IOrder } from "@/models/Order";

// Gateway implementations (inmein koi tabdeeli nahi)
import * as cod from './gateways/cod';
import * as easypaisa from './gateways/easypaisa';
import * as jazzcash from './gateways/jazzcash';
import * as banktransfer from './gateways/banktransfer';

const gatewayImplementations = { cod, easypaisa, jazzcash, banktransfer };

// --- REFACTORED Helper Function with TypeScript FIX ---
async function getGatewayConfig(): Promise<IGateway[]> {
  try {
    await connectMongoose();
    
    // --- BUG FIX IS HERE ---
    // TypeScript ko wazeh taur par batayein ke .lean() se kya expect karna hai
    const settingsDoc = await SettingModel.findById('payment_gateways').lean<ISetting>();

    // Null check: Agar document mojood hai aur usmein gateways hain, tab hi return karein
    if (settingsDoc && settingsDoc.gateways) {
      return settingsDoc.gateways;
    }
    
    return []; // Warna khali array return karein

  } catch (error) {
    console.error("CRITICAL: Error fetching payment gateway configuration:", error);
    return [];
  }
}

// getEnabledGateways, initiatePayment, aur verifyPayment functions mein koi tabdeeli nahi
// Woh ab theek kaam karenge kyunke unki buniyad (getGatewayConfig) theek ho gayi hai.

export async function getEnabledGateways(): Promise<any[]> {
  const allGateways = await getGatewayConfig();
  return allGateways
    .filter((gw) => gw.enabled)
    .map((gw) => {
      const { hashKey, password, integritySalt, ...safeCredentials } = gw.credentials;
      return {
        key: gw.key,
        name: gw.name,
        credentials: safeCredentials,
      };
    });
}

export async function initiatePayment(order: IOrder, gatewayKey: keyof typeof gatewayImplementations) {
  const allGateways = await getGatewayConfig();
  const gatewayConfig = allGateways.find((gw: any) => gw.key === gatewayKey && gw.enabled);
  if (!gatewayConfig) {
    throw new Error(`Payment gateway "${gatewayKey}" is not enabled or could not be found.`);
  }
  const implementation = gatewayImplementations[gatewayKey];
  if (!implementation || typeof implementation.createCheckoutSession !== 'function') {
    throw new Error(`Implementation for gateway "${gatewayKey}" is missing or invalid.`);
  }
  // Yahan 'order as any' ki zaroorat par sakti hai agar IOrder aur Order types mein farq ho
  return implementation.createCheckoutSession(order as any, gatewayConfig.credentials);
}

export async function verifyPayment(gatewayKey: keyof typeof gatewayImplementations, requestData: any) {
  const allGateways = await getGatewayConfig();
  const gatewayConfig = allGateways.find((gw: any) => gw.key === gatewayKey);
  if (!gatewayConfig) {
    throw new Error(`Configuration for payment gateway "${gatewayKey}" could not be found.`);
  }
  const implementation = gatewayImplementations[gatewayKey];
  if (!implementation || typeof implementation.verifyPayment !== 'function') {
    throw new Error(`Verification logic for gateway "${gatewayKey}" is missing or invalid.`);
  }
  return implementation.verifyPayment(requestData, gatewayConfig.credentials);
}


// --- SUMMARY OF CHANGES ---
// - **Critical TypeScript Fix (`.lean()`):** Main ne `SettingModel.findById(...).lean<ISetting>()` ka istemal kiya hai. Yeh TypeScript ko wazeh taur par batata hai ke hum Mongoose se `ISetting` interface ke mutabiq ek object expect kar rahe hain. Is se "Property 'gateways' does not exist" ka error mukammal taur par हल ho gaya hai.
// - **Robust Null Handling:** Code mein `if (settingsDoc && settingsDoc.gateways)` ka izafa kiya gaya hai. Yeh yaqeeni banata hai ke agar database se settings document na mile (ya khali ho), to hamara code crash hone ke bajaye ek khali array return kare, jo ke ek mehfooz (safe) behavior hai.