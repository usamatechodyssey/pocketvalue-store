// app/components/QuickViewModal.tsx - FINAL SUPERCHARGED CODE

"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SanityProduct | null;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
}: QuickViewModalProps) {
  // === YAHAN ASAL, NAYI LOGIC SHURU HOTI HAI ===
  // Hum modal ke andar selected variant ki state manage karenge
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  // Jab bhi naya product aaye, selected variant ko uske default par reset karein
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.defaultVariant);
    }
  }, [product]);

  // Yeh function ProductInfo se variant change ko handle karega
  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  };

  // Gallery mein hamesha selected variant ki images dikhayein
  const imagesToShow = useMemo(() => {
    // Agar variant select hai aur uski apni images hain, to woh dikhayein
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    // Warna, product ke default variant ki images dikhayein
    if (product?.defaultVariant.images) {
      return product.defaultVariant.images;
    }
    // Agar kahin bhi image na mile to khaali array
    return [];
  }, [selectedVariant, product]);
  // ===============================================

  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-surface-base text-left align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface-base/80 hover:bg-surface-ground"
                >
                  <X size={24} className="text-text-primary" />
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-4">
                    {/* Gallery ko ab dynamic 'imagesToShow' mil rahi hain */}
                    <ProductGallery images={imagesToShow} productTitle={""} />
                  </div>
                  <div className="p-6">
                    {/* ProductInfo ko ab state aur usay update karne wala function mil raha hai */}
                    {/* Ahem Note: Iske liye ProductInfo.tsx ka update hona zaroori hai */}
                    <ProductInfo
                      key={product._id} // Key ab product ki ID hogi taake naye product par reset ho
                      product={product}
                      // Naye props jo state manage karenge
                      selectedVariant={selectedVariant}
                      onVariantChange={handleVariantChange}
                      averageRating={product.rating || 0}
                      totalReviews={product.reviewCount || 0}
                    />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
