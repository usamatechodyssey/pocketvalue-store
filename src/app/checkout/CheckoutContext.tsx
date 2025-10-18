"use client";

import { createContext, useContext, ReactNode } from 'react';
import { Address } from '@/app/actions/addressActions';

// Context ka structure define karein
interface CheckoutContextType {
  savedAddresses: Address[];
}

// Context banayen
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Provider component banayen
export const CheckoutProvider = ({
  children,
  savedAddresses,
}: {
  children: ReactNode;
  savedAddresses: Address[];
}) => {
  return (
    <CheckoutContext.Provider value={{ savedAddresses }}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook banayen taake data hasil karna asan ho
export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  return context;
};