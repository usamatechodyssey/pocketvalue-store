// /app/admin/products/_components/DeleteProductButton.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteProduct } from "../_actions/productActions";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
}

export default function DeleteProductButton({
  productId,
  productTitle,
}: DeleteProductButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    toast.loading("Deleting product...");

    try {
      const result = await deleteProduct(productId);
      toast.dismiss();
      if (result.success) {
        toast.success(result.message);
        // Page revalidation server action mein ho raha hai
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isSubmitting}
      className="text-red-600 hover:text-red-900 disabled:text-gray-400"
      aria-label={`Delete ${productTitle}`}
    >
      <Trash2 size={16} />
    </button>
  );
}
