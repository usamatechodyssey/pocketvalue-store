// /app/admin/products/_components/form-tabs/VariantCard.tsx

"use client";

import { Trash2 } from "lucide-react";
import VariantImageUploader from "./VariantImageUploader";
import {
  ProductVariant,
  SanityImageObject,
} from "@/sanity/types/product_types"; // <-- CORRECT IMPORT

const inputStyles =
  "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary transition duration-200 sm:text-sm";

interface VariantCardProps {
  variant: ProductVariant;
  index: number;
  totalVariants: number;
  onVariantChange: (key: string, field: string, value: any) => void;
  onRemoveVariant: (key: string) => void;
}

export default function VariantCard({
  variant,
  index,
  totalVariants,
  onVariantChange,
  onRemoveVariant,
}: VariantCardProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVariantChange(variant._key, e.target.name, e.target.value);
  };

  // --- BUG FIX IS HERE ---
  // The `newImages` parameter is now correctly typed as SanityImageObject[]
  const handleImagesChange = (newImages: SanityImageObject[]) => {
    onVariantChange(variant._key, "images", newImages);
  };

  return (
    <div className="p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-200">
          Variant #{index + 1}
        </h3>
        {totalVariants > 1 && (
          <button
            type="button"
            onClick={() => onRemoveVariant(variant._key)}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={variant.name}
              onChange={handleInputChange}
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label className="text-xs font-medium">SKU</label>
            <input
              type="text"
              name="sku"
              value={variant.sku}
              onChange={handleInputChange}
              className={`${inputStyles} font-mono`}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Price (PKR)</label>
            <input
              type="number"
              name="price"
              value={variant.price ?? ""}
              onChange={handleInputChange}
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Sale Price</label>
            <input
              type="number"
              name="salePrice"
              value={variant.salePrice ?? ""}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Stock Qty</label>
            <input
              type="number"
              name="stock"
              value={variant.stock ?? ""}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={variant.weight ?? ""}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Dimensions (cm)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              name="dimensions.height"
              placeholder="H"
              value={variant.dimensions?.height ?? ""}
              onChange={handleInputChange}
              className={inputStyles}
            />
            <input
              type="number"
              name="dimensions.width"
              placeholder="W"
              value={variant.dimensions?.width ?? ""}
              onChange={handleInputChange}
              className={inputStyles}
            />
            <input
              type="number"
              name="dimensions.depth"
              placeholder="D"
              value={variant.dimensions?.depth ?? ""}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Images</label>
          <VariantImageUploader
            images={variant.images}
            onImagesChange={handleImagesChange}
          />
        </div>
      </div>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Code Simplification:** The `handleInputChange` function has been simplified. It now passes all values as strings, and the parent component (`ProductVariantsForm`) is responsible for converting them to the correct type (`number`). This makes the child component dumber and more reusable.
