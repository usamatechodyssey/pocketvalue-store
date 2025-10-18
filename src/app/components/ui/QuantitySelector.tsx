// app/components/QuantitySelector.tsx - UPDATED

"use client";
import { FiMinus, FiPlus } from "react-icons/fi";

interface Props {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
}: Props) {
  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <div className="flex items-center text-text-secondary">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="p-2 border border-surface-border-darker rounded-l-md hover:bg-surface-input"
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>
      <span className="px-5 py-1.5 border-t border-b border-surface-border-darker text-center w-16 font-semibold text-text-primary">
        {quantity}
      </span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="p-2 border border-surface-border-darker rounded-r-md hover:bg-surface-input"
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  );
}
