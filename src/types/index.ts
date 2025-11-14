// /types/index.ts

import { ObjectId } from "mongodb";
import { CleanCartItem } from "@/sanity/types/product_types";

// The complete and final type definition for an Order object in our system (UPDATED)
export interface Order {
  _id: string; // _id is now always a string (our human-readable ID)
  orderId: string; // The new dedicated, indexed field for the human-readable ID
  userId: string;

  // --- PRICING ---
  subtotal: number;
  shippingCost: number;
  totalPrice: number;

  // --- STATUS ---
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'On Hold';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  transactionId?: string;

  // --- TIMESTAMPS ---
  createdAt: Date | string; // from Mongoose timestamps
  updatedAt: Date | string; // from Mongoose timestamps
  orderDate?: Date | string; // Kept for backward compatibility with old records if needed

  // --- CUSTOMER & SHIPPING ---
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    province: string;
    city: string;
    area: string;
    address: string;
    lat?: number | null;
    lng?: number | null;
  };
  
  // --- ITEMS & TRACKING ---
  products: CleanCartItem[];
  trafficSource?: {
      source?: string;
      medium?: string;
      campaign?: string;
  };
}

// === NEW TYPE FOR RETURN/REFUND SYSTEM ===
// ... (ReturnRequest interface remains unchanged) ...
export interface ReturnRequest {
  _id: ObjectId | string;
  orderId: ObjectId | string;
  orderNumber: string;
  userId: string;
  items: {
    productId: string;
    variantKey: string;
    quantity: number;
    reason: string;
  }[];
  customerComments?: string;
  status: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
  resolution?: 'Refund' | 'StoreCredit' | 'Replacement';
  adminComments?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}


// === NEW INTERFACE FOR THE UPGRADED SHIPPING SYSTEM ===
// ... (ShippingRule interface remains unchanged) ...
export interface ShippingRule {
  _id: string;
  name: string;
  minAmount: number;
  cost: number;
}



export type { CleanCartItem };
// ... (All other interfaces like CleanCartItem, SanityProduct, etc., remain unchanged) ...


// --- SUMMARY OF CHANGES ---
// - **`Order` Interface Updated:**
//   - Changed `_id` from `ObjectId | string` to just `string` to reflect our new "Smart Adapter" architecture.
//   - Added the new `orderId: string;` field.
//   - Made `subtotal` and `shippingCost` required (`number` instead of `number?`) to match our new robust `Order` model.
//   - Added strict string literal types for `status` and `paymentStatus` to match the Mongoose schema's `enum`.
//   - Added `createdAt` and `updatedAt` fields to reflect the Mongoose `timestamps` option.