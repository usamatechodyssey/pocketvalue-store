"use client";
import { FiMinus, FiPlus } from "react-icons/fi";

interface Props {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  className?: string; // Optional custom class support
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  className = "",
}: Props) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Container Box */}
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        
        {/* Decrease Button */}
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-r border-gray-300 dark:border-gray-600 active:bg-gray-200"
          aria-label="Decrease quantity"
        >
          <FiMinus size={16} />
        </button>

        {/* Number Display */}
        <div className="w-12 h-10 flex items-center justify-center font-bold text-gray-900 dark:text-white text-base">
          {quantity}
        </div>

        {/* Increase Button */}
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-l border-gray-300 dark:border-gray-600 active:bg-gray-200"
          aria-label="Increase quantity"
        >
          <FiPlus size={16} />
        </button>
        
      </div>
    </div>
  );
}