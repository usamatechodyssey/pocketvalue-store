
// // // app/components/product/ProductDetailsTabs.tsx (THE FINAL "TOP CLASS" VERSION)

// // "use client";

// // import { useState } from "react";
// // import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// // import { PortableText } from "@portabletext/react";
// // import { FileText, List, Truck, ChevronDown } from "lucide-react";

// // interface ProductDetailsTabsProps {
// //   product: SanityProduct;
// //   selectedVariant: ProductVariant | null;
// // }

// // // Reusable Tab Button Component
// // const TabButton = ({
// //   id,
// //   label,
// //   icon: Icon,
// //   isActive,
// //   onClick,
// // }: {
// //   id: string;
// //   label: string;
// //   icon: React.ElementType;
// //   isActive: boolean;
// //   onClick: (id: string) => void;
// // }) => (
// //   <button
// //     onClick={() => onClick(id)}
// //     className={`grow sm:grow-0 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2
// //     ${
// //       isActive
// //         ? "border-brand-primary text-text-primary dark:text-gray-100"
// //         : "border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary dark:hover:border-gray-600"
// //     }`}
// //   >
// //     <Icon size={16} />
// //     <span className="hidden sm:inline">{label}</span>
// //   </button>
// // );

// // export default function ProductDetailsTabs({
// //   product,
// //   selectedVariant,
// // }: ProductDetailsTabsProps) {
// //   const [activeTab, setActiveTab] = useState("description");
// //   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

// //   const tabs = [
// //     { id: "description", label: "Description", icon: FileText },
// //     { id: "specifications", label: "Specifications", icon: List },
// //     { id: "shipping", label: "Shipping & Returns", icon: Truck },
// //   ];

// //   const hasLongDescription =
// //     product.description && product.description.length > 3; // 3 blocks se zyada lamba ho

// //   return (
// //     <div className="w-full mt-12 md:mt-16 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
// //       {/* Tabs Header */}
// //       <div className="flex border-b border-gray-200 dark:border-gray-700">
// //         {tabs.map((tab) => (
// //           <TabButton
// //             key={tab.id}
// //             {...tab}
// //             isActive={activeTab === tab.id}
// //             onClick={setActiveTab}
// //           />
// //         ))}
// //       </div>

// //       {/* Tabs Content */}
// //       <div className="p-6 md:p-8">
// //         {activeTab === "description" && (
// //           <div className="relative">
// //             <div
// //               className={`prose prose-sm max-w-none text-text-secondary dark:text-gray-300 transition-all duration-500 ease-in-out overflow-hidden
// //               ${isDescriptionExpanded ? "max-h-[2000px]" : "max-h-40"}`} // Fixed height
// //             >
// //               {product.description ? (
// //                 <PortableText value={product.description} />
// //               ) : (
// //                 <p>No description available for this product.</p>
// //               )}
// //             </div>
// //             {hasLongDescription && !isDescriptionExpanded && (
// //               <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-white dark:from-gray-800/50 to-transparent pointer-events-none" />
// //             )}
// //             {hasLongDescription && (
// //               <div className="pt-4 text-center">
// //                 <button
// //                   onClick={() =>
// //                     setIsDescriptionExpanded(!isDescriptionExpanded)
// //                   }
// //                   className="flex items-center gap-2 mx-auto px-4 py-2 text-sm font-semibold text-brand-primary rounded-md hover:bg-brand-primary/10 transition-colors"
// //                 >
// //                   <span>
// //                     {isDescriptionExpanded ? "Show Less" : "View More Details"}
// //                   </span>
// //                   <ChevronDown
// //                     className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? "rotate-180" : ""}`}
// //                   />
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {activeTab === "specifications" && (
// //           <div>
// //             <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
// //               {product.specifications?.map((spec) => (
// //                 <div
// //                   key={spec._key}
// //                   className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
// //                 >
// //                   <dt className="text-sm text-text-secondary">{spec.label}</dt>
// //                   <dd className="text-sm font-semibold text-text-primary dark:text-gray-200">
// //                     {spec.value}
// //                   </dd>
// //                 </div>
// //               ))}
// //               {selectedVariant?.weight && (
// //                 <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
// //                   <dt className="text-sm text-text-secondary">Weight</dt>
// //                   <dd className="text-sm font-semibold text-text-primary dark:text-gray-200">
// //                     {selectedVariant.weight} kg
// //                   </dd>
// //                 </div>
// //               )}
// //               {selectedVariant?.dimensions && (
// //                 <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
// //                   <dt className="text-sm text-text-secondary">Dimensions</dt>
// //                   <dd className="text-sm font-semibold text-text-primary dark:text-gray-200">{`${selectedVariant.dimensions.height} x ${selectedVariant.dimensions.width} x ${selectedVariant.dimensions.depth} cm`}</dd>
// //                 </div>
// //               )}
// //             </dl>
// //           </div>
// //         )}

// //         {activeTab === "shipping" && (
// //           <div className="prose prose-sm max-w-none text-text-secondary dark:text-gray-300">
// //             {product.shippingAndReturns ? (
// //               <PortableText value={product.shippingAndReturns} />
// //             ) : (
// //               <div>
// //                 <h3 className="font-bold text-base text-text-primary dark:text-gray-200">
// //                   Standard Delivery
// //                 </h3>
// //                 <p>
// //                   Delivery within 3-5 business days across Pakistan. An
// //                   additional shipping charge may apply based on your location.
// //                 </p>
// //                 <h3 className="font-bold text-base mt-4 text-text-primary dark:text-gray-200">
// //                   Return Policy
// //                 </h3>
// //                 <p>
// //                   This item is eligible for a 7-day return, provided it is
// //                   unused and in its original packaging. Please read our full
// //                   return policy for more details.
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import { PortableText } from "@portabletext/react";
// import { FileText, List, Truck, ChevronDown, ChevronUp } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// interface ProductDetailsTabsProps {
//   product: SanityProduct;
//   selectedVariant: ProductVariant | null;
// }

// // === ACCORDION ITEM COMPONENT (FOR MOBILE) ===
// const AccordionItem = ({
//   title,
//   icon: Icon,
//   isOpen,
//   onClick,
//   children,
// }: {
//   title: string;
//   icon: React.ElementType;
//   isOpen: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) => (
//   <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
//     <button
//       onClick={onClick}
//       className="flex items-center justify-between w-full py-4 text-left group"
//     >
//       <div className="flex items-center gap-3 text-gray-900 dark:text-white font-semibold">
//         <Icon size={20} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
//         {title}
//       </div>
//       {isOpen ? <ChevronUp size={20} className="text-brand-primary" /> : <ChevronDown size={20} className="text-gray-400" />}
//     </button>
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ height: 0, opacity: 0 }}
//           animate={{ height: "auto", opacity: 1 }}
//           exit={{ height: 0, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="overflow-hidden"
//         >
//           <div className="pb-6 pt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//             {children}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   </div>
// );

// // === TAB BUTTON (FOR DESKTOP) ===
// const TabButton = ({
//   id,
//   label,
//   icon: Icon,
//   isActive,
//   onClick,
// }: {
//   id: string;
//   label: string;
//   icon: React.ElementType;
//   isActive: boolean;
//   onClick: (id: string) => void;
// }) => (
//   <button
//     onClick={() => onClick(id)}
//     className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2
//     ${isActive
//       ? "border-brand-primary text-brand-primary"
//       : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
//   >
//     <Icon size={18} />
//     {label}
//   </button>
// );

// export default function ProductDetailsTabs({
//   product,
//   selectedVariant,
// }: ProductDetailsTabsProps) {
//   const [activeTab, setActiveTab] = useState("description");
  
//   // Mobile State: Konsa accordion khula hai?
//   const [openAccordion, setOpenAccordion] = useState<string | null>("description");

//   const toggleAccordion = (id: string) => {
//     setOpenAccordion(openAccordion === id ? null : id);
//   };

//   const sections = [
//     {
//       id: "description",
//       label: "Description",
//       icon: FileText,
//       content: product.description ? <PortableText value={product.description} /> : <p>No description available.</p>
//     },
//     {
//       id: "specifications",
//       label: "Specifications",
//       icon: List,
//       content: (
//         <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
//           {product.specifications?.map((spec) => (
//             <div key={spec._key} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
//               <dt className="font-medium text-gray-500">{spec.label}</dt>
//               <dd className="font-semibold text-gray-900 dark:text-white">{spec.value}</dd>
//             </div>
//           ))}
//           {selectedVariant?.weight && (
//              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
//                 <dt className="font-medium text-gray-500">Weight</dt>
//                 <dd className="font-semibold">{selectedVariant.weight} kg</dd>
//              </div>
//           )}
//         </dl>
//       )
//     },
//     {
//       id: "shipping",
//       label: "Shipping & Returns",
//       icon: Truck,
//       content: product.shippingAndReturns ? (
//         <PortableText value={product.shippingAndReturns} />
//       ) : (
//         <div className="space-y-4">
//             <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-1">Fast Delivery</h4>
//                 <p>Delivery within 3-5 business days across Pakistan.</p>
//             </div>
//             <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-1">Easy Returns</h4>
//                 <p>7-day hassle-free return policy if product is damaged.</p>
//             </div>
//         </div>
//       )
//     },
//   ];

//   return (
//     <div className="w-full mt-8 md:mt-16 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      
//       {/* === MOBILE VIEW: ACCORDIONS === */}
//       <div className="md:hidden px-5 py-2">
//         {sections.map((section) => (
//             <AccordionItem
//                 key={section.id}
//                 title={section.label}
//                 icon={section.icon}
//                 isOpen={openAccordion === section.id}
//                 onClick={() => toggleAccordion(section.id)}
//             >
//                 {section.content}
//             </AccordionItem>
//         ))}
//       </div>

//       {/* === DESKTOP VIEW: TABS === */}
//       <div className="hidden md:block">
//         <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4">
//             {sections.map((section) => (
//                 <TabButton
//                     key={section.id}
//                     id={section.id}
//                     label={section.label}
//                     icon={section.icon}
//                     isActive={activeTab === section.id}
//                     onClick={setActiveTab}
//                 />
//             ))}
//         </div>
//         <div className="p-8 prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
//             {sections.find(s => s.id === activeTab)?.content}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import { PortableText } from "@portabletext/react";
import { FileText, List, Truck, ChevronDown, Package } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ProductDetailsTabsProps {
  product: SanityProduct;
  selectedVariant: ProductVariant | null;
}

// === ACCORDION ITEM (MOBILE) ===
const AccordionItem = ({
  title,
  icon: Icon,
  isOpen,
  onClick,
  children,
}: {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full py-4 text-left group transition-colors duration-200
        ${isOpen ? "text-brand-primary" : "text-gray-900 dark:text-white"}
      `}
    >
      <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-wide">
        <Icon 
            size={18} 
            className={`transition-colors duration-200 ${isOpen ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600"}`} 
        />
        {title}
      </div>
      <ChevronDown 
        size={18} 
        className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-primary" : ""}`} 
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pb-6 pt-1 text-gray-600 dark:text-gray-300 text-sm leading-relaxed prose-sm dark:prose-invert">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// === TAB BUTTON (DESKTOP) ===
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
    className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors duration-300 z-10
    ${isActive ? "text-brand-primary" : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"}`}
  >
    <Icon size={18} />
    {label}

    {isActive && (
      <motion.div
        layoutId="activeTabIndicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);

export default function ProductDetailsTabs({
  product,
  selectedVariant,
}: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const sections = [
    {
      id: "description",
      label: "Description",
      icon: FileText,
      content: product.description ? (
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
           <PortableText value={product.description} />
        </div>
      ) : (
        <p className="text-gray-500 italic">No description available.</p>
      )
    },
    {
      id: "specifications",
      label: "Specifications",
      icon: List,
      content: (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <dl className="divide-y divide-gray-100 dark:divide-gray-800">
            {product.specifications?.map((spec, idx) => (
                <div key={spec._key} className={`flex flex-col sm:flex-row p-3 sm:px-6 sm:py-4 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                    <dt className="text-sm font-medium text-gray-500 sm:w-1/3 mb-1 sm:mb-0">{spec.label}</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:w-2/3">{spec.value}</dd>
                </div>
            ))}
            {selectedVariant?.weight && (
                <div className="flex flex-col sm:flex-row p-3 sm:px-6 sm:py-4 bg-white dark:bg-gray-900">
                    <dt className="text-sm font-medium text-gray-500 sm:w-1/3 mb-1 sm:mb-0">Weight</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:w-2/3">{selectedVariant.weight} kg</dd>
                </div>
            )}
            {!product.specifications?.length && !selectedVariant?.weight && (
                 <div className="p-6 text-center text-gray-500">No specifications listed.</div>
            )}
            </dl>
        </div>
      )
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      icon: Truck,
      content: product.shippingAndReturns ? (
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <PortableText value={product.shippingAndReturns} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <Truck className="text-blue-500 shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Fast Delivery</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivery within 3-5 business days across Pakistan. Tracking ID provided.</p>
                </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                <Package className="text-orange-500 shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Easy Returns</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">7-day hassle-free return policy if product is damaged or incorrect.</p>
                </div>
            </div>
        </div>
      )
    },
  ];

  return (
    <div className="w-full mt-10 md:mt-16 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      
      {/* === MOBILE VIEW: ACCORDIONS === */}
      <div className="md:hidden px-6 py-2">
        {sections.map((section) => (
            <AccordionItem
                key={section.id}
                title={section.label}
                icon={section.icon}
                isOpen={openAccordion === section.id}
                onClick={() => toggleAccordion(section.id)}
            >
                {section.content}
            </AccordionItem>
        ))}
      </div>

      {/* === DESKTOP VIEW: TABS === */}
      <div className="hidden md:block">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6">
            {sections.map((section) => (
                <TabButton
                    key={section.id}
                    id={section.id}
                    label={section.label}
                    icon={section.icon}
                    isActive={activeTab === section.id}
                    onClick={setActiveTab}
                />
            ))}
        </div>

        {/* 
            🔥 KEY CHANGE: 
            - Removed 'min-h-[200px]' 
            - Added 'h-fit' (Height fit to content)
        */}
        <div className="p-8 h-fit">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {sections.find(s => s.id === activeTab)?.content}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}