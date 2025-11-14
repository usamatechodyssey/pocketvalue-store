// /src/app/components/product/pdp-sections/ProductVariantSelector.tsx

"use client";

import { useMemo, useEffect, useState, useCallback } from 'react';
import { ProductVariant } from '@/sanity/types/product_types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { XCircle } from 'lucide-react';
import 'swiper/css';

type SelectedOptions = Record<string, string>;

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  defaultVariant: ProductVariant;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant | null) => void;
}

export default function ProductVariantSelector({
  variants,
  defaultVariant,
  selectedVariant,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  // When the selectedVariant prop changes, update the local selectedOptions state
  useEffect(() => {
    if (selectedVariant) {
      const newSelectedOptions = selectedVariant.attributes.reduce(
        (acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as SelectedOptions);
      setSelectedOptions(newSelectedOptions);
    } else {
      setSelectedOptions({});
    }
  }, [selectedVariant]);

  // Memoize the calculation of available options to prevent re-running on every render
  const options = useMemo(() => {
    const opts: Record<string, Set<string>> = {};
    variants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!opts[attr.name]) opts[attr.name] = new Set();
        opts[attr.name].add(attr.value);
      });
    });
    // Convert the Set to a sorted array for consistent rendering
    return Object.fromEntries(Object.entries(opts).map(([key, valueSet]) => [key, Array.from(valueSet).sort()]));
  }, [variants]);

  const handleOptionSelect = (optionName: string, optionValue: string) => {
    const currentSelection = { ...selectedOptions, [optionName]: optionValue };
    
    // Find a variant that perfectly matches the new full selection
    let bestMatch = variants.find((v) =>
      Object.entries(currentSelection).every(([key, value]) =>
        v.attributes.some((attr) => attr.name === key && attr.value === value)
      )
    );

    // If no perfect match, find a variant that is in stock and matches at least the option just clicked
    if (!bestMatch) {
      bestMatch = variants.find((v) =>
        (v.stock ? v.stock > 0 : v.inStock) &&
        v.attributes.some(a => a.name === optionName && a.value === optionValue)
      );
    }
    
    onVariantChange(bestMatch || null);
  };

  // Memoize this function as it can be computationally expensive
  const isOptionAvailable = useCallback((optionName: string, optionValue: string): boolean => {
    // Get all other selected options, excluding the one we are currently checking
    const otherSelectedOptions = Object.entries(selectedOptions).filter(([key]) => key !== optionName);
    
    // Check if there is ANY variant in the product that satisfies the combination of the current option AND all other selected options.
    return variants.some((variant) => {
      const matchesThisOption = variant.attributes.some(attr => attr.name === optionName && attr.value === optionValue);
      if (!matchesThisOption) return false;
      
      // Check if this variant also matches all the *other* selected options
      return otherSelectedOptions.every(([key, value]) =>
        variant.attributes.some(attr => attr.name === key && attr.value === value)
      );
    });
  }, [variants, selectedOptions]);

  const handleClearSelection = () => onVariantChange(defaultVariant);

  const hasOptions = Object.keys(options).length > 0;
  if (!hasOptions) return null; // If the product has no variants with options, render nothing

  return (
    <div className="space-y-5 mb-6">
      {Object.entries(options).map(([name, values]) => (
        <div key={name}>
          <h4 className="text-sm font-medium text-text-secondary mb-2">
            {name}:{' '}
            <span className="text-text-primary dark:text-gray-200 font-semibold">
              {selectedOptions[name] || 'Not Selected'}
            </span>
          </h4>
          <Swiper
            modules={[FreeMode, Mousewheel]}
            freeMode={true}
            mousewheel={true}
            spaceBetween={10}
            slidesPerView={"auto"}
            className="variant-swiper"
          >
            {values.map((value) => {
              const isSelected = selectedOptions[name] === value;
              const isAvailable = isOptionAvailable(name, value);
              return (
                <SwiperSlide key={value} style={{ width: "auto" }}>
                  <button
                    onClick={() => handleOptionSelect(name, value)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200
                      ${isSelected ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "border-gray-300 bg-white hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500"}
                      disabled:opacity-40 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-700`}
                  >
                    {value}
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ))}
      {selectedVariant && selectedVariant !== defaultVariant && (
        <button
          onClick={handleClearSelection}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-brand-danger transition-colors"
        >
          <XCircle size={12} /> Clear Selection
        </button>
      )}
    </div>
  );
}