"use client";

import { useEffect } from "react";
import { useStateContext } from "@/app/context/StateContext";

export default function ClearCartOnSuccess() {
  const { clearCart } = useStateContext();

  useEffect(() => {
    // Is component ke load hote hi, aek baar cart clear kar do
    // 'setTimeout' lagane se yeh yaqeen ho jayega ke redirect ke baad hi cart clear ho
    const timer = setTimeout(() => {
      clearCart();
    }, 100); // 100ms ka chota sa delay

    return () => clearTimeout(timer); // Cleanup function
  }, [clearCart]);

  // Yeh component UI mein kuch bhi nahi dikhayega
  return null;
}
