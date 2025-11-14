// /app/checkout/CheckoutContext.tsx (FINAL & CORRECTED)

"use client";

import { createContext, useContext, ReactNode } from "react";
// --- THE ARCHITECTURAL FIX IS HERE ---
// Import the plain, serializable ClientAddress type from the server action
import { ClientAddress } from "@/app/actions/addressActions";


interface CheckoutContextType {
  savedAddresses: ClientAddress[]; // <-- Use the ClientAddress type
}

const CheckoutContext = createContext<CheckoutContextType>({
  savedAddresses: [],
});

export const CheckoutProvider = ({
  children,
  savedAddresses,
}: {
  children: ReactNode;
  savedAddresses: ClientAddress[]; // <-- Use the ClientAddress type
}) => {
  return (
    <CheckoutContext.Provider value={{ savedAddresses }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutProvider"
    );
  }
  return context;
};
