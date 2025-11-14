// /src/app/lib/shipping-calculator.ts

import { ShippingRule } from '@/types';
import { getShippingRules } from '@/sanity/lib/queries';

export interface ShippingCalculation {
  cost: number;
  displayText: string;
  isFree: boolean;
  ruleName?: string;
}

/**
 * (CLIENT-SIDE & SERVER-SIDE) - A ROBUST, UNIFIED FUNCTION
 * Calculates shipping cost by finding the best matching rule.
 * The best match is the rule with the highest minimum amount that is still
 * less than or equal to the subtotal. This is not dependent on array sort order.
 */
export function calculateShipping(subtotal: number, rules: ShippingRule[]): ShippingCalculation {
    if (!rules || rules.length === 0) {
        return { cost: 0, displayText: "FREE", isFree: true, ruleName: 'fallback_free' };
    }

    let bestMatch: ShippingRule | null = null;

    for (const rule of rules) {
        // Check if this rule is applicable
        if (subtotal >= rule.minAmount) {
            // Check if this rule is a "better" match than our current best match
            if (!bestMatch || rule.minAmount > bestMatch.minAmount) {
                bestMatch = rule;
            }
        }
    }

    if (bestMatch) {
        const { cost, name } = bestMatch;
        return { cost: cost, displayText: cost > 0 ? `Rs. ${cost.toLocaleString()}` : "FREE", isFree: cost === 0, ruleName: name };
    }

    // Fallback if no rules apply (should be rare if a 0-cost rule exists)
    return { cost: 0, displayText: "FREE", isFree: true, ruleName: 'fallback_no_rule_found' };
}


/**
 * (SERVER-SIDE ONLY)
 * Fetches the latest rules from Sanity and calculates the shipping cost.
 */
export async function calculateShippingCostServer(subtotal: number): Promise<ShippingCalculation> {
    try {
        const rules = await getShippingRules();
        // Uses the same robust client-side logic with freshly fetched rules
        return calculateShipping(subtotal, rules);
    } catch (error) {
        console.error("Error in calculateShippingCostServer:", error);
        return { cost: 0, displayText: "FREE", isFree: true, ruleName: 'server_fallback_error' };
    }
}