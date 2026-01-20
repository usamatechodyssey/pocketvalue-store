// "use client";

// import { useEffect } from "react";
// import { useStateContext } from "@/app/context/StateContext";

// export default function ClearCartOnSuccess() {
//   const { clearCart } = useStateContext();

//   useEffect(() => {
//     // Is component ke load hote hi, aek baar cart clear kar do
//     // 'setTimeout' lagane se yeh yaqeen ho jayega ke redirect ke baad hi cart clear ho
//     const timer = setTimeout(() => {
//       clearCart();
//     }, 100); // 100ms ka chota sa delay

//     return () => clearTimeout(timer); // Cleanup function
//   }, [clearCart]);

//   // Yeh component UI mein kuch bhi nahi dikhayega
//   return null;
// }

"use client";

import { useEffect } from "react";
import { useStateContext } from "@/app/context/StateContext";

export default function ClearCartOnSuccess() {
  const { clearCart, isCartLoaded } = useStateContext();

  useEffect(() => {
    // SAFETY CHECK: 
    // Agar cart abhi load nahi hua (localStorage read nahi hua), to wait karo.
    // Agar hum wait nahi karenge, to 'buyNowItem' null hoga aur code samjhega
    // ke yeh normal checkout tha, aur main cart uda dega.
    if (!isCartLoaded) return;

    // Item load ho chuka hai, ab clear karo.
    // useCart ki nayi logic khud dekh legi ke BuyNow item hai ya nahi.
    const timer = setTimeout(() => {
      clearCart();
    }, 100);

    return () => clearTimeout(timer);
  }, [clearCart, isCartLoaded]);

  return null;
}