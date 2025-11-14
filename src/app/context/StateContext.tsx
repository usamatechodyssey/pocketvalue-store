// /src/app/context/StateContext.tsx

"use client";

import { createContext, useContext, ReactNode } from "react";

// --- Step 1: Import all our new custom hooks ---
import { useCart } from "./hooks/useCart";
import { useWishlist } from "./hooks/useWishlist";
import { useCheckout } from "./hooks/useCheckout";

// --- Step 2: Define a comprehensive type for our global context ---
// This combines the return types of all our hooks into one interface.
type StateContextType = ReturnType<typeof useCart> &
  ReturnType<typeof useWishlist> &
  ReturnType<typeof useCheckout>;

// --- Step 3: Create the context with the new comprehensive type ---
const StateContext = createContext<StateContextType | null>(null);

// --- Step 4: Create the main provider component ---
// We rename this to AppStateProvider to be more descriptive
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  // Get all state and functions from our custom hooks
  const cart = useCart();
  const wishlist = useWishlist();
  // The useCheckout hook is passed subtotal and cartItems to be reactive
  const checkout = useCheckout(cart.subtotal, cart.cartItems);

  // The clearCart function from the original file cleared checkout state too.
  // We replicate that behavior by creating a wrapper function.
  const clearCartAndCheckout = () => {
    cart.clearCart();
    checkout.clearCheckoutState();
    // wishlist.clearWishlist(); // Optional: uncomment if you want to clear wishlist on logout/order
  };

  // Combine all values into a single object to pass to the provider
  const contextValue: StateContextType = {
    ...cart,
    ...wishlist,
    ...checkout,
    // We override the original clearCart with our combined function
    clearCart: clearCartAndCheckout,
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

// --- Step 5: Create the hook to easily access the context ---
export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === null) {
    throw new Error("useStateContext must be used within an AppStateProvider");
  }
  return context;
};
