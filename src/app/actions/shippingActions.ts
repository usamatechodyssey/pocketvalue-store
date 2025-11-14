// /src/app/actions/shippingActions.ts

"use server";

import { client } from "@/sanity/lib/client";
import { ShippingRule } from "@/types";
import groq from "groq";

// This query now fetches Sanity's internal _key and renames it to _id.
// This gives us a guaranteed unique ID for each rule in the array.
const GET_SHIPPING_RULES_QUERY = groq`
  *[_type == "settings" && _id == "settings"][0] {
    "shippingRules": shippingRules[]{
      "_id": _key, 
      name,
      minAmount,
      cost
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
        
        // Sort rules by minAmount in descending order. This is crucial for the logic 
        // to work correctly, as it checks the highest minimum amount first.
        const sortedRules = result.shippingRules.sort(
            (a: ShippingRule, b: ShippingRule) => b.minAmount - a.minAmount
        );
        return sortedRules;

    } catch (error) {
        console.error("Error in getShippingRulesAction:", error);
        // If the action fails, return an empty array.
        // The client-side logic will handle this gracefully.
        return [];
    }
}