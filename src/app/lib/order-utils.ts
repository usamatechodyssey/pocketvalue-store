// /src/app/lib/order-utils.ts

import connectMongoose from "./mongoose";
import OrderSequence from "@/models/OrderSequence";

const ORDER_ID_PREFIX = "PV";
const COUNTER_ID = "order_id_counter";

/**
 * Generates the next human-readable and sequential Order ID.
 * This function uses an atomic `findOneAndUpdate` operation on a dedicated
 * counter document in MongoDB, making it safe from race conditions even
 * under high traffic.
 * 
 * @returns {Promise<string>} A promise that resolves to the next formatted Order ID (e.g., "PV-1001").
 */
export async function generateNextOrderId(): Promise<string> {
  await connectMongoose();

  // Atomically find the counter document and increment its sequence_value by 1.
  // - `findOneAndUpdate` ensures this is a single, indivisible operation.
  // - `$inc` is the atomic increment operator.
  // - `upsert: true` creates the document if it doesn't exist on the very first run.
  // - `new: true` ensures the method returns the *new*, incremented document.
  const counter = await OrderSequence.findByIdAndUpdate(
    COUNTER_ID,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    // This case should theoretically never happen with upsert:true, but it's good practice.
    throw new Error("Could not find or create the order sequence counter.");
  }

  // Format the new sequence value with the prefix.
  const nextId = `${ORDER_ID_PREFIX}-${counter.sequence_value}`;
  
  return nextId;
}

// --- SUMMARY OF CHANGES ---
// - Created a new, dedicated utility file `order-utils.ts` to house order-related helper functions.
// - Implemented the `generateNextOrderId` function.
// - The function connects to Mongoose and uses the `OrderSequence` model.
// - It leverages the atomic `findOneAndUpdate` with `$inc` to guarantee a unique, sequential number, making the entire process race-condition-safe and enterprise-grade.
// - The function formats the number with the "PV-" prefix to produce the final, human-readable ID.