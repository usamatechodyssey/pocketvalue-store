
// // "use client";

// // import { createContext, useContext, ReactNode, useState } from "react";

// // // Import existing hooks
// // import { useCart } from "./hooks/useCart";
// // import { useWishlist } from "./hooks/useWishlist";
// // import { useCheckout } from "./hooks/useCheckout";

// // // --- Step 1: Define Interface including UI State ---
// // type StateContextType = ReturnType<typeof useCart> &
// //   ReturnType<typeof useWishlist> &
// //   ReturnType<typeof useCheckout> & {
// //     // New UI State for Mobile Profile Sidebar
// //     isProfileSidebarOpen: boolean;
// //     openProfileSidebar: () => void;
// //     closeProfileSidebar: () => void;
// //     toggleProfileSidebar: () => void;
// //   };

// // const StateContext = createContext<StateContextType | null>(null);

// // export const AppStateProvider = ({ children }: { children: ReactNode }) => {
// //   const cart = useCart();
// //   const wishlist = useWishlist();
// //   const checkout = useCheckout(cart.subtotal, cart.cartItems);

// //   // --- Step 2: Manage Profile Sidebar State Locally ---
// //   const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

// //   const openProfileSidebar = () => setIsProfileSidebarOpen(true);
// //   const closeProfileSidebar = () => setIsProfileSidebarOpen(false);
// //   const toggleProfileSidebar = () => setIsProfileSidebarOpen((prev) => !prev);

// //   const clearCartAndCheckout = () => {
// //     cart.clearCart();
// //     checkout.clearCheckoutState();
// //   };

// //   const contextValue: StateContextType = {
// //     ...cart,
// //     ...wishlist,
// //     ...checkout,
// //     clearCart: clearCartAndCheckout,
// //     // Add UI State to Context
// //     isProfileSidebarOpen,
// //     openProfileSidebar,
// //     closeProfileSidebar,
// //     toggleProfileSidebar,
// //   };

// //   return (
// //     <StateContext.Provider value={contextValue}>
// //       {children}
// //     </StateContext.Provider>
// //   );
// // };

// // export const useStateContext = () => {
// //   const context = useContext(StateContext);
// //   if (context === null) {
// //     throw new Error("useStateContext must be used within an AppStateProvider");
// //   }
// //   return context;
// // };
// // /src/app/context/StateContext.tsx (FIXED & OPTIMIZED)

// "use client";

// import { createContext, useContext, ReactNode, useState, useMemo, useCallback } from "react";

// // Import existing hooks
// import { useCart } from "./hooks/useCart";
// import { useWishlist } from "./hooks/useWishlist";
// import { useCheckout } from "./hooks/useCheckout";

// // --- Step 1: Define Interface including UI State ---
// type StateContextType = ReturnType<typeof useCart> &
//   ReturnType<typeof useWishlist> &
//   ReturnType<typeof useCheckout> & {
//     // New UI State for Mobile Profile Sidebar
//     isProfileSidebarOpen: boolean;
//     openProfileSidebar: () => void;
//     closeProfileSidebar: () => void;
//     toggleProfileSidebar: () => void;
//   };

// const StateContext = createContext<StateContextType | null>(null);

// export const AppStateProvider = ({ children }: { children: ReactNode }) => {
//   const cart = useCart();
//   const wishlist = useWishlist();
//   // Pass cart dependencies to checkout hook
//   const checkout = useCheckout(cart.subtotal, cart.cartItems);

//   // --- Step 2: Manage Profile Sidebar State Locally ---
//   const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

//   // Optimize functions to prevent unnecessary re-renders
//   const openProfileSidebar = useCallback(() => setIsProfileSidebarOpen(true), []);
//   const closeProfileSidebar = useCallback(() => setIsProfileSidebarOpen(false), []);
//   const toggleProfileSidebar = useCallback(() => setIsProfileSidebarOpen((prev) => !prev), []);

//   const clearCartAndCheckout = useCallback(() => {
//     cart.clearCart();
//     checkout.clearCheckoutState();
//   }, [cart, checkout]); // Dependencies ensure fresh functions are called

//   // --- Step 3: Memoize the Context Value (Critical for Performance) ---
//   const contextValue = useMemo<StateContextType>(() => ({
//     ...cart,
//     ...wishlist,
//     ...checkout,
//     clearCart: clearCartAndCheckout,
//     // Add UI State to Context
//     isProfileSidebarOpen,
//     openProfileSidebar,
//     closeProfileSidebar,
//     toggleProfileSidebar,
//   }), [
//     cart, 
//     wishlist, 
//     checkout, 
//     clearCartAndCheckout, 
//     isProfileSidebarOpen, 
//     openProfileSidebar, 
//     closeProfileSidebar, 
//     toggleProfileSidebar
//   ]);

//   return (
//     <StateContext.Provider value={contextValue}>
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => {
//   const context = useContext(StateContext);
//   if (context === null) {
//     throw new Error("useStateContext must be used within an AppStateProvider");
//   }
//   return context;
// };
"use client";

import { createContext, useContext, ReactNode, useState, useMemo, useCallback } from "react";
import { useCart } from "./hooks/useCart";
import { useWishlist } from "./hooks/useWishlist";
import { useCheckout } from "./hooks/useCheckout";

type StateContextType = ReturnType<typeof useCart> &
  ReturnType<typeof useWishlist> &
  ReturnType<typeof useCheckout> & {
    isProfileSidebarOpen: boolean;
    openProfileSidebar: () => void;
    closeProfileSidebar: () => void;
    toggleProfileSidebar: () => void;
  };

const StateContext = createContext<StateContextType | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCart();
  const wishlist = useWishlist();
  
  // Checkout hook uses active cart logic from useCart
  const checkout = useCheckout(cart.subtotal, cart.cartItems);

  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const openProfileSidebar = useCallback(() => setIsProfileSidebarOpen(true), []);
  const closeProfileSidebar = useCallback(() => setIsProfileSidebarOpen(false), []);
  const toggleProfileSidebar = useCallback(() => setIsProfileSidebarOpen((prev) => !prev), []);

  const clearCartAndCheckout = useCallback(() => {
    // Step 1: Cart clear karo (Smart logic inside useCart handles 'BuyNow' vs 'MainCart')
    cart.clearCart(); 
    // Step 2: Checkout form reset karo
    checkout.clearCheckoutState();
  }, [cart, checkout]); 

  const contextValue = useMemo<StateContextType>(() => ({
    ...cart,
    ...wishlist,
    ...checkout,
    clearCart: clearCartAndCheckout, // Overwritten with combined wrapper
    isProfileSidebarOpen,
    openProfileSidebar,
    closeProfileSidebar,
    toggleProfileSidebar,
  }), [
    cart, 
    wishlist, 
    checkout, 
    clearCartAndCheckout, 
    isProfileSidebarOpen, 
    openProfileSidebar, 
    closeProfileSidebar, 
    toggleProfileSidebar
  ]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === null) {
    throw new Error("useStateContext must be used within an AppStateProvider");
  }
  return context;
};