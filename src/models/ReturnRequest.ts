// /src/models/ReturnRequest.ts (CORRECTED AND FINAL)

import { Schema, model, models, Document, Types } from 'mongoose'; // <-- Import Types

// Interface jo hamare document ki structure batayegi
export interface IReturnRequest extends Document {
  orderId: string;
  orderNumber: string;
  userId: Types.ObjectId; // <-- Changed from string to Types.ObjectId
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
  createdAt: Date;
  updatedAt: Date;
}

const ReturnRequestSchema = new Schema<IReturnRequest>({
  orderId: {
    type: String,
    ref: 'Order',
    required: true,
  },
  orderNumber: { 
    type: String,
    required: true,
  },
  // === THE CRITICAL FIX IS HERE ===
  userId: {
    type: Schema.Types.ObjectId, // 1. Correct data type for a reference
    ref: 'User',                 // 2. Explicit reference to the 'User' model
    required: true,
    index: true,
  },
  // ===============================
  items: [{
    productId: { type: String, required: true },
    variantKey: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    _id: false 
  }],
  customerComments: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Processing', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  resolution: {
    type: String,
    enum: ['Refund', 'StoreCredit', 'Replacement'],
  },
  adminComments: {
    type: String,
  },
}, { 
  timestamps: true 
});

const ReturnRequest = models.ReturnRequest || model<IReturnRequest>('ReturnRequest', ReturnRequestSchema);

export default ReturnRequest;