// // /app/checkout/CheckoutContext.tsx (FINAL & CORRECTED)

// "use client";

// import { createContext, useContext, ReactNode } from "react";
// // --- THE ARCHITECTURAL FIX IS HERE ---
// // Import the plain, serializable ClientAddress type from the server action
// import { ClientAddress } from "@/app/actions/addressActions";


// interface CheckoutContextType {
//   savedAddresses: ClientAddress[]; // <-- Use the ClientAddress type
// }

// const CheckoutContext = createContext<CheckoutContextType>({
//   savedAddresses: [],
// });

// export const CheckoutProvider = ({
//   children,
//   savedAddresses,
// }: {
//   children: ReactNode;
//   savedAddresses: ClientAddress[]; // <-- Use the ClientAddress type
// }) => {
//   return (
//     <CheckoutContext.Provider value={{ savedAddresses }}>
//       {children}
//     </CheckoutContext.Provider>
//   );
// };

// export const useCheckoutContext = () => {
//   const context = useContext(CheckoutContext);
//   if (context === undefined) {
//     throw new Error(
//       "useCheckoutContext must be used within a CheckoutProvider"
//     );
//   }
//   return context;
// };
// /app/checkout/CheckoutContext.tsx (VERIFIED - NO CHANGES NEEDED)

"use client";

import { createContext, useContext, ReactNode } from "react";
import { ClientAddress } from "@/app/actions/addressActions"; // Imports the plain, serializable DTO type

// Defines the shape of the data that this context will provide.
interface CheckoutContextType {
  savedAddresses: ClientAddress[];
}

// Create the context with a default value.
const CheckoutContext = createContext<CheckoutContextType>({
  savedAddresses: [],
});

// The provider component that will wrap our checkout pages.
// It receives server-fetched data as props and makes it available to its children.
export const CheckoutProvider = ({
  children,
  savedAddresses,
}: {
  children: ReactNode;
  savedAddresses: ClientAddress[];
}) => {
  return (
    <CheckoutContext.Provider value={{ savedAddresses }}>
      {children}
    </CheckoutContext.Provider>
  );
};

// A custom hook to easily access the context's value in client components.
export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutProvider"
    );
  }
  return context;
};

// --- SUMMARY OF CHANGES ---
// - No changes were required. This file correctly sets up a React Context to provide server-fetched `savedAddresses` to client components within the checkout layout, which is an excellent and performant pattern.