// /src/types/index.ts

/**
 * @description Represents a single shipping rule fetched from Sanity CMS.
 * This is used to calculate shipping costs across the application.
 */
export interface ShippingRule {
  _id: string;      // The unique key from Sanity
  name: string;     // e.g., "Standard Delivery", "Free Shipping"
  minAmount: number; // The minimum cart subtotal for this rule to apply
  cost: number;     // The shipping cost for this rule
}