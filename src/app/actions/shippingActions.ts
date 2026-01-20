"use server";

import { client } from "@/sanity/lib/client";
import { ShippingRule } from "@/types";
import groq from "groq";

// ✅ FIX: Is query mein 'isOnCall' add karna zaroori tha
const GET_SHIPPING_RULES_QUERY = groq`
  *[_type == "settings" && _id == "settings"][0] {
    "shippingRules": shippingRules[]{
      "_id": _key, 
      name,
      minAmount,
      cost,
      isOnCall  // <--- YE MISSING THA! Ab data aayega.
    }
  }
`;

/**
 * A Server Action that can be safely called from the StateContext on initial load
 * to fetch all available shipping rules from the CMS.
 * @returns An array of ShippingRule objects.
 */
export async function getShippingRulesAction(): Promise<ShippingRule[]> {
    try {
        const result = await client.fetch(GET_SHIPPING_RULES_QUERY);
        if (!result || !result.shippingRules) {
            console.warn("No shipping rules found in Sanity settings.");
            return [];
        }
        
        const sortedRules = result.shippingRules.sort(
            (a: ShippingRule, b: ShippingRule) => b.minAmount - a.minAmount
        );
        return sortedRules;

    } catch (error) {
        console.error("Error in getShippingRulesAction:", error);
        return [];
    }
}