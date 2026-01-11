
// // /src/app/lib/payment/paymentAdapter.ts

// import connectMongoose from "@/app/lib/mongoose";
// import SettingModel, { IGateway, ISetting } from "@/models/Setting"; // Hamara mustanad Setting model
// import { IOrder } from "@/models/Order";

// // Gateway implementations (inmein koi tabdeeli nahi)
// import * as cod from './gateways/cod';
// import * as easypaisa from './gateways/easypaisa';
// import * as jazzcash from './gateways/jazzcash';
// import * as banktransfer from './gateways/banktransfer';

// const gatewayImplementations = { cod, easypaisa, jazzcash, banktransfer };

// // --- REFACTORED Helper Function with TypeScript FIX ---
// async function getGatewayConfig(): Promise<IGateway[]> {
//   try {
//     await connectMongoose();
    
//     // --- BUG FIX IS HERE ---
//     // TypeScript ko wazeh taur par batayein ke .lean() se kya expect karna hai
//     const settingsDoc = await SettingModel.findById('payment_gateways').lean<ISetting>();

//     // Null check: Agar document mojood hai aur usmein gateways hain, tab hi return karein
//     if (settingsDoc && settingsDoc.gateways) {
//       return settingsDoc.gateways;
//     }
    
//     return []; // Warna khali array return karein

//   } catch (error) {
//     console.error("CRITICAL: Error fetching payment gateway configuration:", error);
//     return [];
//   }
// }

// // getEnabledGateways, initiatePayment, aur verifyPayment functions mein koi tabdeeli nahi
// // Woh ab theek kaam karenge kyunke unki buniyad (getGatewayConfig) theek ho gayi hai.

// export async function getEnabledGateways(): Promise<any[]> {
//   const allGateways = await getGatewayConfig();
//   return allGateways
//     .filter((gw) => gw.enabled)
//     .map((gw) => {
//       const { hashKey, password, integritySalt, ...safeCredentials } = gw.credentials;
//       return {
//         key: gw.key,
//         name: gw.name,
//         credentials: safeCredentials,
//       };
//     });
// }

// export async function initiatePayment(order: IOrder, gatewayKey: keyof typeof gatewayImplementations) {
//   const allGateways = await getGatewayConfig();
//   const gatewayConfig = allGateways.find((gw: any) => gw.key === gatewayKey && gw.enabled);
//   if (!gatewayConfig) {
//     throw new Error(`Payment gateway "${gatewayKey}" is not enabled or could not be found.`);
//   }
//   const implementation = gatewayImplementations[gatewayKey];
//   if (!implementation || typeof implementation.createCheckoutSession !== 'function') {
//     throw new Error(`Implementation for gateway "${gatewayKey}" is missing or invalid.`);
//   }
//   // Yahan 'order as any' ki zaroorat par sakti hai agar IOrder aur Order types mein farq ho
//   return implementation.createCheckoutSession(order as any, gatewayConfig.credentials);
// }

// export async function verifyPayment(gatewayKey: keyof typeof gatewayImplementations, requestData: any) {
//   const allGateways = await getGatewayConfig();
//   const gatewayConfig = allGateways.find((gw: any) => gw.key === gatewayKey);
//   if (!gatewayConfig) {
//     throw new Error(`Configuration for payment gateway "${gatewayKey}" could not be found.`);
//   }
//   const implementation = gatewayImplementations[gatewayKey];
//   if (!implementation || typeof implementation.verifyPayment !== 'function') {
//     throw new Error(`Verification logic for gateway "${gatewayKey}" is missing or invalid.`);
//   }
//   return implementation.verifyPayment(requestData, gatewayConfig.credentials);
// }


// // --- SUMMARY OF CHANGES ---
// // - **Critical TypeScript Fix (`.lean()`):** Main ne `SettingModel.findById(...).lean<ISetting>()` ka istemal kiya hai. Yeh TypeScript ko wazeh taur par batata hai ke hum Mongoose se `ISetting` interface ke mutabiq ek object expect kar rahe hain. Is se "Property 'gateways' does not exist" ka error mukammal taur par हल ho gaya hai.
// // - **Robust Null Handling:** Code mein `if (settingsDoc && settingsDoc.gateways)` ka izafa kiya gaya hai. Yeh yaqeeni banata hai ke agar database se settings document na mile (ya khali ho), to hamara code crash hone ke bajaye ek khali array return kare, jo ke ek mehfooz (safe) behavior hai.
import connectMongoose from "@/app/lib/mongoose";
import SettingModel, { IGateway, ISetting } from "@/models/Setting";
import { IOrder } from "@/models/Order";

// Gateway implementations
import * as cod from './gateways/cod';
import * as easypaisa from './gateways/easypaisa';
import * as jazzcash from './gateways/jazzcash';
import * as banktransfer from './gateways/banktransfer';

const gatewayImplementations = { cod, easypaisa, jazzcash, banktransfer };

// --- Helper Function ---
async function getGatewayConfig(): Promise<IGateway[]> {
  try {
    await connectMongoose();
    const settingsDoc = await SettingModel.findById('payment_gateways').lean<ISetting>();

    if (settingsDoc && settingsDoc.gateways) {
      return settingsDoc.gateways;
    }
    return []; 
  } catch (error) {
    console.error("CRITICAL: Error fetching payment gateway configuration:", error);
    return [];
  }
}

// --- UPDATE THIS FUNCTION ---
export async function getEnabledGateways(): Promise<any[]> {
  const allGateways = await getGatewayConfig();
  
  // Pehle hum yahan .filter() kar rahe thay, ab wo HATA DIYA hai.
  // Hum sab return karenge, lekin 'enabled' status sath bhejenge.
  return allGateways.map((gw) => {
      // Credentials safe karein (password/hashKey hata dein)
      const { hashKey, password, integritySalt, ...safeCredentials } = gw.credentials || {};
      
      return {
        key: gw.key,
        name: gw.name,
        enabled: gw.enabled, // ✅ Ye zaroori hai: Frontend ko batana ke ye ON hai ya OFF
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
  
  // ✅ FIX: Yahan bhi safe check laga diya (just in case)
  return implementation.createCheckoutSession(order as any, gatewayConfig.credentials || {});
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
  
  // ✅ FIX: Yahan bhi safe check laga diya
  return implementation.verifyPayment(requestData, gatewayConfig.credentials || {});
}