// /src/models/OrderSequence.ts

import { Schema, model, models } from 'mongoose';

// Interface for type safety
export interface IOrderSequence {
  _id: string;
  sequence_value: number;
}

const OrderSequenceSchema = new Schema<IOrderSequence>({
  _id: { 
    type: String, 
    required: true 
  },
  sequence_value: { 
    type: Number, 
    default: 1000 // Start order numbers from 1001
  },
});

// Using models.OrderSequence to prevent recompiling the model on hot reloads
const OrderSequence = models.OrderSequence || model<IOrderSequence>('OrderSequence', OrderSequenceSchema);

export default OrderSequence;

// --- SUMMARY OF CHANGES ---
// - Created a new Mongoose schema and model named `OrderSequence`.
// - The schema is designed to hold a single document that acts as our atomic counter.
// - `_id` is a string to hold a constant identifier (e.g., "order_id_counter").
// - `sequence_value` is the number that will be incremented for each new order, starting from 1000.