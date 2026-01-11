// // /src/app/components/product/pdp-sections/ProductVariantSelector.tsx

// "use client";

// import { useMemo, useEffect, useState, useCallback } from "react";
// import { ProductVariant } from "@/sanity/types/product_types";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { FreeMode, Mousewheel } from "swiper/modules";
// import { XCircle } from "lucide-react";
// import "swiper/css";

// type SelectedOptions = Record<string, string>;

// interface ProductVariantSelectorProps {
//   variants: ProductVariant[];
//   defaultVariant: ProductVariant;
//   selectedVariant: ProductVariant | null;
//   onVariantChange: (variant: ProductVariant | null) => void;
// }

// export default function ProductVariantSelector({
//   variants,
//   defaultVariant,
//   selectedVariant,
//   onVariantChange,
// }: ProductVariantSelectorProps) {
//   const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

//   // When the selectedVariant prop changes, update the local selectedOptions state
//   useEffect(() => {
//     if (selectedVariant) {
//       const newSelectedOptions = selectedVariant.attributes.reduce(
//         (acc, attr) => {
//           acc[attr.name] = attr.value;
//           return acc;
//         },
//         {} as SelectedOptions
//       );
//       setSelectedOptions(newSelectedOptions);
//     } else {
//       setSelectedOptions({});
//     }
//   }, [selectedVariant]);

//   // Memoize the calculation of available options to prevent re-running on every render
//   const options = useMemo(() => {
//     const opts: Record<string, Set<string>> = {};
//     variants.forEach((variant) => {
//       variant.attributes.forEach((attr) => {
//         if (!opts[attr.name]) opts[attr.name] = new Set();
//         opts[attr.name].add(attr.value);
//       });
//     });
//     // Convert the Set to a sorted array for consistent rendering
//     return Object.fromEntries(
//       Object.entries(opts).map(([key, valueSet]) => [
//         key,
//         Array.from(valueSet).sort(),
//       ])
//     );
//   }, [variants]);

//   const handleOptionSelect = (optionName: string, optionValue: string) => {
//     const currentSelection = { ...selectedOptions, [optionName]: optionValue };

//     // Find a variant that perfectly matches the new full selection
//     let bestMatch = variants.find((v) =>
//       Object.entries(currentSelection).every(([key, value]) =>
//         v.attributes.some((attr) => attr.name === key && attr.value === value)
//       )
//     );

//     // If no perfect match, find a variant that is in stock and matches at least the option just clicked
//     if (!bestMatch) {
//       bestMatch = variants.find(
//         (v) =>
//           (v.stock ? v.stock > 0 : v.inStock) &&
//           v.attributes.some(
//             (a) => a.name === optionName && a.value === optionValue
//           )
//       );
//     }

//     onVariantChange(bestMatch || null);
//   };

//   // Memoize this function as it can be computationally expensive
//   const isOptionAvailable = useCallback(
//     (optionName: string, optionValue: string): boolean => {
//       // Get all other selected options, excluding the one we are currently checking
//       const otherSelectedOptions = Object.entries(selectedOptions).filter(
//         ([key]) => key !== optionName
//       );

//       // Check if there is ANY variant in the product that satisfies the combination of the current option AND all other selected options.
//       return variants.some((variant) => {
//         const matchesThisOption = variant.attributes.some(
//           (attr) => attr.name === optionName && attr.value === optionValue
//         );
//         if (!matchesThisOption) return false;

//         // Check if this variant also matches all the *other* selected options
//         return otherSelectedOptions.every(([key, value]) =>
//           variant.attributes.some(
//             (attr) => attr.name === key && attr.value === value
//           )
//         );
//       });
//     },
//     [variants, selectedOptions]
//   );

//   const handleClearSelection = () => onVariantChange(defaultVariant);

//   const hasOptions = Object.keys(options).length > 0;
//   if (!hasOptions) return null; // If the product has no variants with options, render nothing

//   return (
//     <div className="space-y-5 mb-6">
//       {Object.entries(options).map(([name, values]) => (
//         <div key={name}>
//           <h4 className="text-sm font-medium text-text-secondary mb-2">
//             {name}:{" "}
//             <span className="text-text-primary dark:text-gray-200 font-semibold">
//               {selectedOptions[name] || "Not Selected"}
//             </span>
//           </h4>
//           <Swiper
//             modules={[FreeMode, Mousewheel]}
//             freeMode={true}
//             mousewheel={true}
//             spaceBetween={10}
//             slidesPerView={"auto"}
//             className="variant-swiper"
//           >
//             {values.map((value) => {
//               const isSelected = selectedOptions[name] === value;
//               const isAvailable = isOptionAvailable(name, value);
//               return (
//                 <SwiperSlide key={value} style={{ width: "auto" }}>
//                   <button
//                     onClick={() => handleOptionSelect(name, value)}
//                     disabled={!isAvailable}
//                     className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200
//                       ${isSelected ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "border-gray-300 bg-white hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500"}
//                       disabled:opacity-40 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-700`}
//                   >
//                     {value}
//                   </button>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </div>
//       ))}
//       {selectedVariant && selectedVariant !== defaultVariant && (
//         <button
//           onClick={handleClearSelection}
//           className="flex items-center gap-1 text-xs text-text-secondary hover:text-brand-danger transition-colors"
//         >
//           <XCircle size={12} /> Clear Selection
//         </button>
//       )}
//     </div>
//   );
// }
// "use client";

// import { useMemo, useEffect, useState, useCallback } from "react";
// import { ProductVariant } from "@/sanity/types/product_types";
// import { XCircle, Check } from "lucide-react";

// type SelectedOptions = Record<string, string>;

// interface ProductVariantSelectorProps {
//   variants: ProductVariant[];
//   defaultVariant: ProductVariant;
//   selectedVariant: ProductVariant | null;
//   onVariantChange: (variant: ProductVariant | null) => void;
// }

// export default function ProductVariantSelector({
//   variants,
//   defaultVariant,
//   selectedVariant,
//   onVariantChange,
// }: ProductVariantSelectorProps) {
//   const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

//   useEffect(() => {
//     if (selectedVariant) {
//       const newSelectedOptions = selectedVariant.attributes.reduce(
//         (acc, attr) => {
//           acc[attr.name] = attr.value;
//           return acc;
//         },
//         {} as SelectedOptions
//       );
//       setSelectedOptions(newSelectedOptions);
//     } else {
//       setSelectedOptions({});
//     }
//   }, [selectedVariant]);

//   const options = useMemo(() => {
//     const opts: Record<string, Set<string>> = {};
//     variants.forEach((variant) => {
//       variant.attributes.forEach((attr) => {
//         if (!opts[attr.name]) opts[attr.name] = new Set();
//         opts[attr.name].add(attr.value);
//       });
//     });
//     return Object.fromEntries(
//       Object.entries(opts).map(([key, valueSet]) => [
//         key,
//         Array.from(valueSet).sort(),
//       ])
//     );
//   }, [variants]);

//   const handleOptionSelect = (optionName: string, optionValue: string) => {
//     const currentSelection = { ...selectedOptions, [optionName]: optionValue };
//     let bestMatch = variants.find((v) =>
//       Object.entries(currentSelection).every(([key, value]) =>
//         v.attributes.some((attr) => attr.name === key && attr.value === value)
//       )
//     );
//     if (!bestMatch) {
//       bestMatch = variants.find(
//         (v) =>
//           (v.stock ? v.stock > 0 : v.inStock) &&
//           v.attributes.some(
//             (a) => a.name === optionName && a.value === optionValue
//           )
//       );
//     }
//     onVariantChange(bestMatch || null);
//   };

//   const isOptionAvailable = useCallback(
//     (optionName: string, optionValue: string): boolean => {
//       const otherSelectedOptions = Object.entries(selectedOptions).filter(
//         ([key]) => key !== optionName
//       );
//       return variants.some((variant) => {
//         const matchesThisOption = variant.attributes.some(
//           (attr) => attr.name === optionName && attr.value === optionValue
//         );
//         if (!matchesThisOption) return false;
//         return otherSelectedOptions.every(([key, value]) =>
//           variant.attributes.some(
//             (attr) => attr.name === key && attr.value === value
//           )
//         );
//       });
//     },
//     [variants, selectedOptions]
//   );

//   const handleClearSelection = () => onVariantChange(defaultVariant);
//   const hasOptions = Object.keys(options).length > 0;

//   if (!hasOptions) return null;

//   return (
//     <div className="space-y-6 mb-8">
//       {Object.entries(options).map(([name, values]) => {
//         // Check if this option is a "Color"
//         const isColor = name.toLowerCase() === "color" || name.toLowerCase() === "colour";

//         return (
//           <div key={name}>
//             <div className="flex justify-between items-center mb-3">
//                 <h4 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
//                     Select {name}
//                 </h4>
//                 <span className="text-sm text-brand-primary font-medium">
//                     {selectedOptions[name]}
//                 </span>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               {values.map((value) => {
//                 const isSelected = selectedOptions[name] === value;
//                 const isAvailable = isOptionAvailable(name, value);

//                 // === COLOR SWATCH RENDERER ===
//                 if (isColor) {
//                     return (
//                         <button
//                             key={value}
//                             onClick={() => handleOptionSelect(name, value)}
//                             disabled={!isAvailable}
//                             title={value}
//                             className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 relative
//                                 ${isSelected ? "ring-2 ring-offset-2 ring-brand-primary border-transparent" : "border-gray-300 hover:border-gray-400"}
//                                 ${!isAvailable ? "opacity-40 cursor-not-allowed overflow-hidden" : ""}
//                             `}
//                             style={{ backgroundColor: value.toLowerCase() }}
//                         >
//                             {/* Cross line for unavailable colors */}
//                             {!isAvailable && <div className="absolute w-full h-px bg-gray-500 rotate-45" />}
                            
//                             {/* Checkmark for selected white/light colors */}
//                             {isSelected && (
//                                 <Check size={16} className={`drop-shadow-md ${['white', 'yellow', 'cream', 'beige'].includes(value.toLowerCase()) ? 'text-black' : 'text-white'}`} />
//                             )}
//                         </button>
//                     );
//                 }

//                 // === STANDARD BUTTON RENDERER ===
//                 return (
//                   <button
//                     key={value}
//                     onClick={() => handleOptionSelect(name, value)}
//                     disabled={!isAvailable}
//                     className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 min-w-12
//                       ${
//                         isSelected
//                           ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
//                           : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-brand-primary/50"
//                       }
//                       disabled:opacity-40 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-100
//                     `}
//                   >
//                     {value}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}

//       {selectedVariant && selectedVariant !== defaultVariant && (
//         <button
//           onClick={handleClearSelection}
//           className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors mt-2"
//         >
//           <XCircle size={14} /> Clear Selection
//         </button>
//       )}
//     </div>
//   );
// }
"use client";

import { useMemo, useCallback } from "react";
import { ProductVariant } from "@/sanity/types/product_types";
import { XCircle, Check } from "lucide-react";

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
  
  // 🔥 FIX: useEffect & useState Removed
  // Instead of syncing state, we calculate options directly from props.
  // This removes the extra render cycle and speeds up interaction.
  const selectedOptions: SelectedOptions = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as SelectedOptions);
    }
    return {};
  }, [selectedVariant]);

  const options = useMemo(() => {
    const opts: Record<string, Set<string>> = {};
    variants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!opts[attr.name]) opts[attr.name] = new Set();
        opts[attr.name].add(attr.value);
      });
    });
    return Object.fromEntries(
      Object.entries(opts).map(([key, valueSet]) => [
        key,
        Array.from(valueSet).sort(),
      ])
    );
  }, [variants]);

  const handleOptionSelect = (optionName: string, optionValue: string) => {
    const currentSelection = { ...selectedOptions, [optionName]: optionValue };
    let bestMatch = variants.find((v) =>
      Object.entries(currentSelection).every(([key, value]) =>
        v.attributes.some((attr) => attr.name === key && attr.value === value)
      )
    );
    if (!bestMatch) {
      bestMatch = variants.find(
        (v) =>
          (v.stock ? v.stock > 0 : v.inStock) &&
          v.attributes.some(
            (a) => a.name === optionName && a.value === optionValue
          )
      );
    }
    onVariantChange(bestMatch || null);
  };

  const isOptionAvailable = useCallback(
    (optionName: string, optionValue: string): boolean => {
      const otherSelectedOptions = Object.entries(selectedOptions).filter(
        ([key]) => key !== optionName
      );
      return variants.some((variant) => {
        const matchesThisOption = variant.attributes.some(
          (attr) => attr.name === optionName && attr.value === optionValue
        );
        if (!matchesThisOption) return false;
        return otherSelectedOptions.every(([key, value]) =>
          variant.attributes.some(
            (attr) => attr.name === key && attr.value === value
          )
        );
      });
    },
    [variants, selectedOptions]
  );

  const handleClearSelection = () => onVariantChange(defaultVariant);
  const hasOptions = Object.keys(options).length > 0;

  if (!hasOptions) return null;

  return (
    <div className="space-y-6 mb-8">
      {Object.entries(options).map(([name, values]) => {
        const isColor = name.toLowerCase() === "color" || name.toLowerCase() === "colour";

        return (
          <div key={name}>
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    Select {name}
                </h4>
                <span className="text-sm text-brand-primary font-medium">
                    {selectedOptions[name]}
                </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {values.map((value) => {
                const isSelected = selectedOptions[name] === value;
                const isAvailable = isOptionAvailable(name, value);

                if (isColor) {
                    return (
                        <button
                            key={value}
                            onClick={() => handleOptionSelect(name, value)}
                            disabled={!isAvailable}
                            title={value}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 relative
                                ${isSelected ? "ring-2 ring-offset-2 ring-brand-primary border-transparent" : "border-gray-300 hover:border-gray-400"}
                                ${!isAvailable ? "opacity-40 cursor-not-allowed overflow-hidden" : ""}
                            `}
                            style={{ backgroundColor: value.toLowerCase() }}
                        >
                            {!isAvailable && <div className="absolute w-full h-px bg-gray-500 rotate-45" />}
                            
                            {isSelected && (
                                <Check size={16} className={`drop-shadow-md ${['white', 'yellow', 'cream', 'beige'].includes(value.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                            )}
                        </button>
                    );
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionSelect(name, value)}
                    disabled={!isAvailable}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 min-w-12
                      ${
                        isSelected
                          ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-brand-primary/50"
                      }
                      disabled:opacity-40 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-100
                    `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedVariant && selectedVariant !== defaultVariant && (
        <button
          onClick={handleClearSelection}
          className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors mt-2"
        >
          <XCircle size={14} /> Clear Selection
        </button>
      )}
    </div>
  );
}