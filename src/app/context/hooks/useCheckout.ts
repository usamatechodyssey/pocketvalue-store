// // // /src/app/context/hooks/useCheckout.ts

// // "use client";

// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import { getShippingRulesAction } from '@/app/actions/shippingActions';
// // import { calculateShipping, ShippingCalculation } from '@/app/lib/shipping-calculator';
// // import { ShippingRule } from '@/types';
// // import { CleanCartItem } from '@/sanity/types/product_types';
// // import { toastSuccess, toastError } from '@/app/_components/shared/CustomToasts';

// // // --- Type Definitions ---
// // interface ShippingAddress {
// //   fullName: string;
// //   email: string;
// //   phone: string;
// //   province: string;
// //   city: string;
// //   area: string;
// //   address: string;
// //   lat: number | null;
// //   lng: number | null;
// // }
// // interface AppliedCoupon {
// //   code: string;
// //   amount: number;
// //   type: 'percentage' | 'fixed' | 'freeShipping';
// //   value?: number;
// //   maximumDiscount?: number;
// // }

// // // --- Helper for discount calculation ---
// // const calculateOptimisticDiscount = (subtotal: number, coupon: AppliedCoupon): number => {
// //     // For free shipping, the monetary discount is 0. This is handled separately.
// //     if (coupon.type === 'freeShipping') return 0;

// //     let discountAmount = 0;
// //     if (coupon.type === 'percentage' && coupon.value) {
// //         discountAmount = (subtotal * coupon.value) / 100;
// //         if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
// //             discountAmount = coupon.maximumDiscount;
// //         }
// //     } else if (coupon.type === 'fixed') {
// //         discountAmount = Math.min(coupon.value || 0, subtotal);
// //     }
// //     return Math.round(discountAmount);
// // };


// // // --- The Main Hook ---
// // export function useCheckout(subtotal: number, cartItems: CleanCartItem[]) {
// //   const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null);
// //   const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
// //   const [shippingDetails, setShippingDetails] = useState<ShippingCalculation | null>(null);
// //   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
// //   const [discountAmount, setDiscountAmount] = useState(0);
// //   const [grandTotal, setGrandTotal] = useState(0);
// //   const isInitialMount = useRef(true);

// //   // --- Data Loading Effects ---
// //   useEffect(() => {
// //     async function loadShippingRules() {
// //       const rules = await getShippingRulesAction();
// //       setShippingRules(rules);
// //     }
// //     loadShippingRules();
// //   }, []);

// //   useEffect(() => {
// //     try {
// //       const addressData = localStorage.getItem("PocketValue_shippingAddress");
// //       if (addressData) setShippingAddressState(JSON.parse(addressData));
      
// //       const couponData = localStorage.getItem("PocketValue_coupon");
// //       if (couponData) setAppliedCoupon(JSON.parse(couponData));
// //     } catch (error) {
// //       console.error("Failed to parse checkout data from localStorage", error);
// //     }
// //   }, []);

// //   // --- Data Persistence Effects ---
// //   useEffect(() => {
// //     if (shippingAddress) {
// //       localStorage.setItem("PocketValue_shippingAddress", JSON.stringify(shippingAddress));
// //     } else {
// //       localStorage.removeItem("PocketValue_shippingAddress");
// //     }
// //   }, [shippingAddress]);

// //   useEffect(() => {
// //     if (appliedCoupon) {
// //       localStorage.setItem("PocketValue_coupon", JSON.stringify(appliedCoupon));
// //     } else {
// //       localStorage.removeItem("PocketValue_coupon");
// //     }
// //   }, [appliedCoupon]);

// //   // --- The Final, Correct Recalculation Logic ---
// //   const recalculateTotals = useCallback(() => {
// //     if (shippingRules.length === 0 && subtotal > 0) {
// //         setShippingDetails({ cost: -1, displayText: "Calculating...", isFree: false });
// //         return;
// //     }

// //     // 1. Calculate BASE shipping cost first, based on original subtotal.
// //     const baseShipping = (subtotal > 0)
// //         ? calculateShipping(subtotal, shippingRules)
// //         : { cost: 0, displayText: "FREE", isFree: true, ruleName: 'empty_cart' };

// //     // 2. Determine monetary discount AND free shipping discount separately.
// //     let monetaryDiscount = 0;
// //     let shippingDiscount = 0;

// //     if (appliedCoupon) {
// //       if (appliedCoupon.type === 'freeShipping') {
// //         // The value of the discount IS the base shipping cost that is being waived.
// //         shippingDiscount = baseShipping.cost;
// //       } else {
// //         // Otherwise, it's a standard monetary discount.
// //         monetaryDiscount = calculateOptimisticDiscount(subtotal, appliedCoupon);
// //       }
// //     }
    
// //     // Set the total discount amount to be displayed in the UI.
// //     // For a FREESHIP coupon, this will now correctly show the value of shipping (e.g., 200).
// //     setDiscountAmount(monetaryDiscount + shippingDiscount);

// //     // 3. Determine the final shipping cost to be paid by the customer.
// //     const finalShippingCost = baseShipping.cost - shippingDiscount;
// //     setShippingDetails({ 
// //         ...baseShipping, 
// //         cost: finalShippingCost, 
// //         displayText: finalShippingCost > 0 ? `Rs. ${finalShippingCost.toLocaleString()}` : "FREE",
// //         isFree: finalShippingCost === 0,
// //     });

// //     // 4. Calculate the Final Grand Total.
// //     const finalGrandTotal = subtotal - monetaryDiscount + finalShippingCost;
// //     setGrandTotal(finalGrandTotal > 0 ? Math.round(finalGrandTotal) : 0);

// //   }, [subtotal, appliedCoupon, shippingRules]);

// //   useEffect(() => {
// //     recalculateTotals();
// //   }, [recalculateTotals]);

// //   // --- Coupon Management & Re-validation ---
// //   const applyCoupon = async (code: string) => {
// //     const response = await fetch("/api/verify-coupon", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ code, cart: { items: cartItems, subtotal } }),
// //     });
// //     const result = await response.json();
// //     if (result.success) {
// //       setAppliedCoupon(result.finalDiscount);
// //       toastSuccess(result.message);
// //     } else {
// //       setAppliedCoupon(null);
// //       setDiscountAmount(0);
// //       toastError(result.message);
// //     }
// //     return result;
// //   };

// //   const removeCoupon = () => {
// //     setAppliedCoupon(null);
// //     setDiscountAmount(0);
// //     toastError("Your coupon has been removed.", "Coupon Removed");
// //   };
  
// //   useEffect(() => {
// //     if (isInitialMount.current) {
// //       isInitialMount.current = false;
// //       return;
// //     }
// //     const revalidate = async () => {
// //       if (!appliedCoupon) return;
// //       const result = await applyCoupon(appliedCoupon.code);
// //       if(!result.success) {
// //         toastError(result.message, `Coupon "${appliedCoupon.code}" Removed`);
// //       }
// //     };
// //     const handler = setTimeout(revalidate, 1000);
// //     return () => clearTimeout(handler);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [subtotal, cartItems]);

// //   const clearCheckoutState = () => {
// //     setShippingAddressState(null);
// //     setAppliedCoupon(null);
// //     setDiscountAmount(0);
// //   };

// //   return {
// //     shippingAddress,
// //     setShippingAddress: setShippingAddressState,
// //     shippingDetails,
// //     appliedCoupon,
// //     discountAmount,
// //     grandTotal,
// //     applyCoupon,
// //     removeCoupon,
// //     clearCheckoutState,
// //   };
// // }
// // /src/app/context/hooks/useCheckout.ts (FIXED & OPTIMIZED)

// "use client";

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { getShippingRulesAction } from '@/app/actions/shippingActions';
// import { calculateShipping, ShippingCalculation } from '@/app/lib/shipping-calculator';
// import { ShippingRule } from '@/types';
// import { CleanCartItem } from '@/sanity/types/product_types';
// import { toastSuccess, toastError } from '@/app/_components/shared/CustomToasts';

// // --- Type Definitions ---
// interface ShippingAddress {
//   fullName: string;
//   email: string;
//   phone: string;
//   province: string;
//   city: string;
//   area: string;
//   address: string;
//   lat: number | null;
//   lng: number | null;
// }
// interface AppliedCoupon {
//   code: string;
//   amount: number;
//   type: 'percentage' | 'fixed' | 'freeShipping';
//   value?: number;
//   maximumDiscount?: number;
// }

// // --- Helper for discount calculation ---
// const calculateOptimisticDiscount = (subtotal: number, coupon: AppliedCoupon): number => {
//     if (coupon.type === 'freeShipping') return 0;

//     let discountAmount = 0;
//     if (coupon.type === 'percentage' && coupon.value) {
//         discountAmount = (subtotal * coupon.value) / 100;
//         if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
//             discountAmount = coupon.maximumDiscount;
//         }
//     } else if (coupon.type === 'fixed') {
//         discountAmount = Math.min(coupon.value || 0, subtotal);
//     }
//     return Math.round(discountAmount);
// };

// // --- The Main Hook ---
// export function useCheckout(subtotal: number, cartItems: CleanCartItem[]) {
//   const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null);
//   const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  
//   // Ref for revalidation logic
//   const isInitialMount = useRef(true);

//   // --- 1. Load Initial Data (Rules & LocalStorage) ---
//   useEffect(() => {
//     async function loadData() {
//         // Load Rules
//         const rules = await getShippingRulesAction();
//         setShippingRules(rules);

//         // Load LocalStorage (Client Side Only)
//         if (typeof window !== "undefined") {
//             try {
//                 const addressData = localStorage.getItem("PocketValue_shippingAddress");
//                 if (addressData) setShippingAddressState(JSON.parse(addressData));
                
//                 const couponData = localStorage.getItem("PocketValue_coupon");
//                 if (couponData) setAppliedCoupon(JSON.parse(couponData));
//             } catch (error) {
//                 console.error("Failed to parse checkout data", error);
//             }
//         }
//     }
//     loadData();
//   }, []);

//   // --- 2. Data Persistence Effects ---
//   useEffect(() => {
//     if (shippingAddress) {
//       localStorage.setItem("PocketValue_shippingAddress", JSON.stringify(shippingAddress));
//     } else {
//       localStorage.removeItem("PocketValue_shippingAddress");
//     }
//   }, [shippingAddress]);

//   useEffect(() => {
//     if (appliedCoupon) {
//       localStorage.setItem("PocketValue_coupon", JSON.stringify(appliedCoupon));
//     } else {
//       localStorage.removeItem("PocketValue_coupon");
//     }
//   }, [appliedCoupon]);

//   // --- 3. OPTIMIZED: Derived State using useMemo (No extra renders) ---
//   const { shippingDetails, discountAmount, grandTotal } = useMemo(() => {
//     // Default State
//     let details: ShippingCalculation = { cost: 0, displayText: "Calculating...", isFree: false };
//     let finalDiscount = 0;
//     let finalTotal = 0;

//     // Handle Loading/Empty State
//     if (shippingRules.length === 0 && subtotal > 0) {
//         return { shippingDetails: { cost: -1, displayText: "...", isFree: false }, discountAmount: 0, grandTotal: subtotal };
//     }

//     // A. Base Shipping Calculation
//     const baseShipping = (subtotal > 0)
//         ? calculateShipping(subtotal, shippingRules)
//         : { cost: 0, displayText: "FREE", isFree: true, ruleName: 'empty_cart' };

//     // B. Calculate Discount Logic
//     let monetaryDiscount = 0;
//     let shippingDiscount = 0;

//     if (appliedCoupon) {
//       if (appliedCoupon.type === 'freeShipping') {
//         shippingDiscount = baseShipping.cost; // Waive shipping cost
//       } else {
//         monetaryDiscount = calculateOptimisticDiscount(subtotal, appliedCoupon);
//       }
//     }
    
//     finalDiscount = monetaryDiscount + shippingDiscount;

//     // C. Final Shipping Cost
//     const finalShippingCost = baseShipping.cost - shippingDiscount;
    
//     details = { 
//         ...baseShipping, 
//         cost: finalShippingCost, 
//         displayText: finalShippingCost > 0 ? `Rs. ${finalShippingCost.toLocaleString()}` : "FREE",
//         isFree: finalShippingCost === 0,
//     };

//     // D. Final Grand Total
//     const totalCalc = subtotal - monetaryDiscount + finalShippingCost;
//     finalTotal = totalCalc > 0 ? Math.round(totalCalc) : 0;

//     return { shippingDetails: details, discountAmount: finalDiscount, grandTotal: finalTotal };

//   }, [subtotal, appliedCoupon, shippingRules]);


//   // --- 4. Coupon Management & Re-validation ---
//   const applyCoupon = async (code: string) => {
//     const response = await fetch("/api/verify-coupon", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ code, cart: { items: cartItems, subtotal } }),
//     });
//     const result = await response.json();
//     if (result.success) {
//       setAppliedCoupon(result.finalDiscount);
//       toastSuccess(result.message);
//     } else {
//       setAppliedCoupon(null);
//       // discountAmount resets automatically via useMemo
//       toastError(result.message);
//     }
//     return result;
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     toastError("Your coupon has been removed.", "Coupon Removed");
//   };
  
//   // Revalidate coupon on cart change
//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }
//     const revalidate = async () => {
//       if (!appliedCoupon) return;
//       // We don't want to show toasts on auto-revalidation unless it fails/removed
//       const result = await fetch("/api/verify-coupon", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: appliedCoupon.code, cart: { items: cartItems, subtotal } }),
//       });
//       const data = await result.json();
      
//       if(!data.success) {
//         setAppliedCoupon(null);
//         toastError(data.message, `Coupon "${appliedCoupon.code}" Removed`);
//       }
//     };

//     const handler = setTimeout(revalidate, 1000); // Debounce server calls
//     return () => clearTimeout(handler);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [subtotal, cartItems]); // Intentionally omitting appliedCoupon to prevent loop

//   const clearCheckoutState = () => {
//     setShippingAddressState(null);
//     setAppliedCoupon(null);
//   };

//   return {
//     shippingAddress,
//     setShippingAddress: setShippingAddressState,
//     shippingDetails,
//     appliedCoupon,
//     discountAmount,
//     grandTotal,
//     applyCoupon,
//     removeCoupon,
//     clearCheckoutState,
//   };
// }
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { getShippingRulesAction } from '@/app/actions/shippingActions';
import { calculateShipping, ShippingCalculation } from '@/app/lib/shipping-calculator';
import { ShippingRule } from '@/types';
import { CleanCartItem } from '@/sanity/types/product_types';
import { toastSuccess, toastError } from '@/app/_components/shared/CustomToasts';

// --- Type Definitions ---
interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  address: string;
  lat: number | null;
  lng: number | null;
}
interface AppliedCoupon {
  code: string;
  amount: number;
  type: 'percentage' | 'fixed' | 'freeShipping';
  value?: number;
  maximumDiscount?: number;
}

const calculateOptimisticDiscount = (subtotal: number, coupon: AppliedCoupon): number => {
    if (coupon.type === 'freeShipping') return 0;

    let discountAmount = 0;
    if (coupon.type === 'percentage' && coupon.value) {
        discountAmount = (subtotal * coupon.value) / 100;
        if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
            discountAmount = coupon.maximumDiscount;
        }
    } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.value || 0, subtotal);
    }
    return Math.round(discountAmount);
};

export function useCheckout(subtotal: number, cartItems: CleanCartItem[]) {
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  
  const isInitialMount = useRef(true);

  // 1. Load Data
  useEffect(() => {
    async function loadData() {
        const rules = await getShippingRulesAction();
        setShippingRules(rules);

        if (typeof window !== "undefined") {
            try {
                const addressData = localStorage.getItem("PocketValue_shippingAddress");
                if (addressData) setShippingAddressState(JSON.parse(addressData));
                
                const couponData = localStorage.getItem("PocketValue_coupon");
                if (couponData) setAppliedCoupon(JSON.parse(couponData));
            } catch (error) {
                console.error("Failed to parse checkout data", error);
            }
        }
    }
    loadData();
  }, []);

  // 2. Persistence
  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem("PocketValue_shippingAddress", JSON.stringify(shippingAddress));
    } else {
      localStorage.removeItem("PocketValue_shippingAddress");
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("PocketValue_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("PocketValue_coupon");
    }
  }, [appliedCoupon]);

  // 3. Derived State
  const { shippingDetails, discountAmount, grandTotal } = useMemo(() => {
    let details: ShippingCalculation = { cost: 0, displayText: "Calculating...", isFree: false };
    let finalDiscount = 0;
    let finalTotal = 0;

    if (shippingRules.length === 0 && subtotal > 0) {
        return { shippingDetails: { cost: -1, displayText: "...", isFree: false }, discountAmount: 0, grandTotal: subtotal };
    }

    // A. Base Calculation
    const baseShipping = (subtotal > 0)
        ? calculateShipping(subtotal, shippingRules)
        : { cost: 0, displayText: "FREE", isFree: true, ruleName: 'empty_cart' };

    // B. Discount Logic
    let monetaryDiscount = 0;
    let shippingDiscount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.type === 'freeShipping') {
        shippingDiscount = baseShipping.cost; 
      } else {
        monetaryDiscount = calculateOptimisticDiscount(subtotal, appliedCoupon);
      }
    }
    
    finalDiscount = monetaryDiscount + shippingDiscount;

    // C. Final Shipping Cost
    const finalShippingCost = baseShipping.cost - shippingDiscount;
    
    // === 🔥 FIX START: LOGIC FIXED HERE ===
    // Pehle hum check kar rahe thay "Agar cost > 0 hai to text dikhao, warna FREE".
    // Lekin 'On Call' ki cost 0 hoti hai, isliye wo 'FREE' ban jata tha.
    // Ab hum check karenge: "Agar baseShipping.isOnCall true hai, to uska text mat chhero".

    let finalDisplayText = "FREE";
    
    if (baseShipping.isOnCall) {
        // Agar On Call hai, to wahi text rehne do ("Calculated on Call")
        finalDisplayText = baseShipping.displayText;
    } else {
        // Normal Rules ke liye
        finalDisplayText = finalShippingCost > 0 ? `Rs. ${finalShippingCost.toLocaleString()}` : "FREE";
    }

    details = { 
        ...baseShipping, 
        cost: finalShippingCost, 
        displayText: finalDisplayText, // Use corrected text
        isFree: finalShippingCost === 0,
    };
    // === 🔥 FIX END ===

    // D. Grand Total
    const totalCalc = subtotal - monetaryDiscount + finalShippingCost;
    finalTotal = totalCalc > 0 ? Math.round(totalCalc) : 0;

    return { shippingDetails: details, discountAmount: finalDiscount, grandTotal: finalTotal };

  }, [subtotal, appliedCoupon, shippingRules]);


  // 4. Coupon Handlers
  const applyCoupon = async (code: string) => {
    const response = await fetch("/api/verify-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, cart: { items: cartItems, subtotal } }),
    });
    const result = await response.json();
    if (result.success) {
      setAppliedCoupon(result.finalDiscount);
      toastSuccess(result.message);
    } else {
      setAppliedCoupon(null);
      toastError(result.message);
    }
    return result;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toastError("Your coupon has been removed.", "Coupon Removed");
  };
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const revalidate = async () => {
      if (!appliedCoupon) return;
      const result = await fetch("/api/verify-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedCoupon.code, cart: { items: cartItems, subtotal } }),
      });
      const data = await result.json();
      
      if(!data.success) {
        setAppliedCoupon(null);
        toastError(data.message, `Coupon "${appliedCoupon.code}" Removed`);
      }
    };

    const handler = setTimeout(revalidate, 1000);
    return () => clearTimeout(handler);
  }, [subtotal, cartItems]); 

  const clearCheckoutState = () => {
    setShippingAddressState(null);
    setAppliedCoupon(null);
  };

  return {
    shippingAddress,
    setShippingAddress: setShippingAddressState,
    shippingDetails,
    appliedCoupon,
    discountAmount,
    grandTotal,
    applyCoupon,
    removeCoupon,
    clearCheckoutState,
  };
}