
// app/components/product/ProductDetailsTabs.tsx (THE FINAL "TOP CLASS" VERSION)

"use client";

import { useState } from "react";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import { PortableText } from "@portabletext/react";
import { FileText, List, Truck, ChevronDown } from "lucide-react";

interface ProductDetailsTabsProps {
  product: SanityProduct;
  selectedVariant: ProductVariant | null;
}

// Reusable Tab Button Component
const TabButton = ({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: (id: string) => void;
}) => (
  <button
    onClick={() => onClick(id)}
    className={`grow sm:grow-0 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2
    ${
      isActive
        ? "border-brand-primary text-text-primary dark:text-gray-100"
        : "border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary dark:hover:border-gray-600"
    }`}
  >
    <Icon size={16} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default function ProductDetailsTabs({
  product,
  selectedVariant,
}: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "specifications", label: "Specifications", icon: List },
    { id: "shipping", label: "Shipping & Returns", icon: Truck },
  ];

  const hasLongDescription =
    product.description && product.description.length > 3; // 3 blocks se zyada lamba ho

  return (
    <div className="w-full mt-12 md:mt-16 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            {...tab}
            isActive={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-8">
        {activeTab === "description" && (
          <div className="relative">
            <div
              className={`prose prose-sm max-w-none text-text-secondary dark:text-gray-300 transition-all duration-500 ease-in-out overflow-hidden
              ${isDescriptionExpanded ? "max-h-[2000px]" : "max-h-40"}`} // Fixed height
            >
              {product.description ? (
                <PortableText value={product.description} />
              ) : (
                <p>No description available for this product.</p>
              )}
            </div>
            {hasLongDescription && !isDescriptionExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-white dark:from-gray-800/50 to-transparent pointer-events-none" />
            )}
            {hasLongDescription && (
              <div className="pt-4 text-center">
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="flex items-center gap-2 mx-auto px-4 py-2 text-sm font-semibold text-brand-primary rounded-md hover:bg-brand-primary/10 transition-colors"
                >
                  <span>
                    {isDescriptionExpanded ? "Show Less" : "View More Details"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {product.specifications?.map((spec) => (
                <div
                  key={spec._key}
                  className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  <dt className="text-sm text-text-secondary">{spec.label}</dt>
                  <dd className="text-sm font-semibold text-text-primary dark:text-gray-200">
                    {spec.value}
                  </dd>
                </div>
              ))}
              {selectedVariant?.weight && (
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <dt className="text-sm text-text-secondary">Weight</dt>
                  <dd className="text-sm font-semibold text-text-primary dark:text-gray-200">
                    {selectedVariant.weight} kg
                  </dd>
                </div>
              )}
              {selectedVariant?.dimensions && (
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <dt className="text-sm text-text-secondary">Dimensions</dt>
                  <dd className="text-sm font-semibold text-text-primary dark:text-gray-200">{`${selectedVariant.dimensions.height} x ${selectedVariant.dimensions.width} x ${selectedVariant.dimensions.depth} cm`}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="prose prose-sm max-w-none text-text-secondary dark:text-gray-300">
            {product.shippingAndReturns ? (
              <PortableText value={product.shippingAndReturns} />
            ) : (
              <div>
                <h3 className="font-bold text-base text-text-primary dark:text-gray-200">
                  Standard Delivery
                </h3>
                <p>
                  Delivery within 3-5 business days across Pakistan. An
                  additional shipping charge may apply based on your location.
                </p>
                <h3 className="font-bold text-base mt-4 text-text-primary dark:text-gray-200">
                  Return Policy
                </h3>
                <p>
                  This item is eligible for a 7-day return, provided it is
                  unused and in its original packaging. Please read our full
                  return policy for more details.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
