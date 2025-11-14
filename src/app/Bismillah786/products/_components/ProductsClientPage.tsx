// // /app/admin/products/_components/ProductsClientPage.tsx

// "use client";

// import React, { useState, useEffect, useTransition } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { urlFor } from "@/sanity/lib/image";
// import { ChevronDown, ChevronRight, Search, Loader2 } from "lucide-react";
// import DeleteProductButton from "./DeleteProductButton";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import CopyButton from "../../_components/CopyButton";
// import Pagination from "../_components/Pagination"; // Reusable component import kiya

// // --- Type Definitions ---
// interface Variant {
//   _key: string;
//   name: string;
//   sku?: string;
//   price?: number;
//   inStock: boolean;
//   stock?: number;
// }
// interface AdminProductListItem {
//   _id: string;
//   title: string;
//   slug: string;
//   price?: number;
//   stock?: number;
//   inStock?: boolean;
//   mainImage?: any;
//   variantsCount: number;
//   variants: Variant[];
// }

// // --- Debounce Hook (isko alag file mein bhi rakh sakte hain) ---
// function useDebounce(value: string, delay: number) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// // === Main Component ===
// export default function ProductsClientPage({
//   initialProducts,
//   initialTotalPages,
// }: {
//   initialProducts: AdminProductListItem[];
//   initialTotalPages: number;
// }) {
//   const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();

//   const currentPage = Number(searchParams.get("page")) || 1;
//   const currentSearch = searchParams.get("search") || "";

//   const [searchTerm, setSearchTerm] = useState(currentSearch);
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   // Effect to update URL when debounced search term changes
//   useEffect(() => {
//     if (debouncedSearchTerm !== currentSearch) {
//       const params = new URLSearchParams(window.location.search);
//       params.set("page", "1");
//       if (debouncedSearchTerm) {
//         params.set("search", debouncedSearchTerm);
//       } else {
//         params.delete("search");
//       }
//       startTransition(() => {
//         router.push(`${pathname}?${params.toString()}`);
//       });
//     }
//   }, [debouncedSearchTerm, currentSearch, pathname, router]);

//   const handlePageChange = (page: number) => {
//     const params = new URLSearchParams(window.location.search);
//     params.set("page", page.toString());
//     startTransition(() => {
//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     const params = new URLSearchParams(window.location.search);
//     params.delete("search");
//     params.set("page", "1");
//     startTransition(() => {
//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   const toggleRow = (id: string) =>
//     setExpandedRowId(expandedRowId === id ? null : id);
//   const formatPrice = (price?: number) =>
//     price != null ? `Rs. ${price.toLocaleString()}` : "N/A";

//   const hasProducts = initialProducts.length > 0;

//   return (
//     <div className="relative">
//       {/* --- IMPROVEMENT: LOADING OVERLAY --- */}
//       {isPending && (
//         <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex justify-center items-center z-10 rounded-lg">
//           <Loader2 className="animate-spin text-brand-primary" size={48} />
//         </div>
//       )}
//       <div
//         className={`transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}
//       >
//         <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border dark:border-gray-700">
//           <div className="mb-6 relative">
//             <Search
//               className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by Product Name, SKU..."
//               className="w-full p-2.5 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-brand-primary focus:border-brand-primary"
//             />
//           </div>

//           {/* --- Mobile View: Cards --- */}
//           <div className="lg:hidden space-y-4">
//             {hasProducts
//               ? initialProducts.map((product) => {
//                   const isExpanded = expandedRowId === product._id;
//                   return (
//                     <div
//                       key={product._id}
//                       className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600"
//                     >
//                       {/* Card Header */}
//                       <div className="flex gap-4 items-center">
//                         <div className="relative h-16 w-16 shrink-0 bg-white dark:bg-gray-800 rounded-md p-1">
//                           {product.mainImage ? (
//                             <Image
//                               src={urlFor(product.mainImage).url()}
//                               alt={product.title}
//                               fill
//                               sizes="64px"
//                               className="object-contain"
//                             />
//                           ) : (
//                             <span className="text-xs text-gray-400 flex h-full items-center justify-center">
//                               No Img
//                             </span>
//                           )}
//                         </div>
//                         <div className="grow">
//                           <p className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
//                             {product.title}
//                           </p>
//                           <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                             ID:{" "}
//                             <span className="font-mono">
//                               ...{product._id.slice(-8)}
//                             </span>
//                             <CopyButton textToCopy={product._id} />
//                           </div>
//                         </div>
//                       </div>
//                       {/* Card Body */}
//                       <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <p className="text-xs text-gray-500">Price</p>
//                           <p className="font-semibold">
//                             {formatPrice(product.price)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Stock</p>
//                           {product.variantsCount > 1 ? (
//                             <span className="font-semibold">
//                               {product.variantsCount} Variants
//                             </span>
//                           ) : (
//                             <span
//                               className={`font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}
//                             >
//                               {product.inStock ? "In Stock" : "Out of Stock"}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       {/* Card Footer */}
//                       <div className="mt-4 border-t dark:border-gray-600 pt-3 flex justify-between items-center">
//                         <button
//                           onClick={() => toggleRow(product._id)}
//                           disabled={!product.variants}
//                           className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:underline disabled:opacity-50 flex items-center gap-1"
//                         >
//                           {product.variantsCount > 1 &&
//                             (isExpanded ? "Hide Variants" : "Show Variants")}
//                           {product.variantsCount > 1 &&
//                             (isExpanded ? (
//                               <ChevronDown size={14} />
//                             ) : (
//                               <ChevronRight size={14} />
//                             ))}
//                         </button>
//                         <div className="flex items-center gap-2">
//                           <Link
//                             href={`/Bismillah786/products/${product.slug}/edit`}
//                             className="text-sm font-medium text-brand-primary hover:underline"
//                           >
//                             Edit
//                           </Link>
//                           <DeleteProductButton
//                             productId={product._id}
//                             productTitle={product.title}
//                           />
//                         </div>
//                       </div>
//                       {/* Expanded Variants View */}
//                       {isExpanded && product.variants && (
//                         <div className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
//                           {/* --- IMPROVEMENT: MOBILE VARIANT TABLE --- */}
//                           <table className="w-full">
//                             <thead>
//                               <tr className="border-b dark:border-gray-700">
//                                 <th className="pb-1 text-left font-semibold">
//                                   Variant
//                                 </th>
//                                 <th className="pb-1 text-right font-semibold">
//                                   Stock
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {product.variants.map((v) => (
//                                 <tr key={v._key}>
//                                   <td className="py-1">{v.name}</td>
//                                   <td
//                                     className={`py-1 text-right font-mono ${v.inStock ? "text-green-600" : "text-red-600"}`}
//                                   >
//                                     {v.stock !== undefined
//                                       ? `${v.stock}`
//                                       : v.inStock
//                                         ? "In"
//                                         : "Out"}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               : null}
//           </div>

//           {/* --- Desktop View: Table --- */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full table-auto border-collapse text-sm">
//               <thead className="bg-gray-50 dark:bg-gray-700/50">
//                 <tr>
//                   <th className="w-12 px-4 py-3"></th>
//                   <th className="w-20 px-6 py-3 text-left font-semibold uppercase text-gray-500 dark:text-gray-400">
//                     Image
//                   </th>
//                   <th className="px-6 py-3 text-left font-semibold uppercase text-gray-500 dark:text-gray-400">
//                     Product Name & ID
//                   </th>
//                   <th className="w-40 px-6 py-3 text-left font-semibold uppercase text-gray-500 dark:text-gray-400">
//                     Price
//                   </th>
//                   <th className="w-40 px-6 py-3 text-left font-semibold uppercase text-gray-500 dark:text-gray-400">
//                     Stock / Variants
//                   </th>
//                   <th className="w-28 px-6 py-3 text-right font-semibold uppercase text-gray-500 dark:text-gray-400">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                 {hasProducts
//                   ? initialProducts.map((product) => {
//                       const isExpanded = expandedRowId === product._id;
//                       return (
//                         <React.Fragment key={product._id}>
//                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                             <td className="px-4 py-4 text-center">
//                               <button
//                                 onClick={() => toggleRow(product._id)}
//                                 disabled={product.variantsCount <= 1}
//                                 className="p-1 disabled:opacity-25 disabled:cursor-default"
//                               >
//                                 {product.variantsCount > 1 &&
//                                   (isExpanded ? (
//                                     <ChevronDown size={16} />
//                                   ) : (
//                                     <ChevronRight size={16} />
//                                   ))}
//                               </button>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="relative h-12 w-12 bg-gray-100 dark:bg-gray-900 rounded-md p-1">
//                                 {product.mainImage ? (
//                                   <Image
//                                     src={urlFor(product.mainImage).url()}
//                                     alt={product.title}
//                                     fill
//                                     sizes="48px"
//                                     className="object-contain"
//                                   />
//                                 ) : (
//                                   <span className="text-xs text-gray-400 flex h-full items-center justify-center">
//                                     No Img
//                                   </span>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 align-top">
//                               <div className="font-medium text-gray-900 dark:text-gray-100">
//                                 {product.title}
//                               </div>
//                               <div className="text-xs mt-1">
//                                 ID:{" "}
//                                 <span className="font-mono">
//                                   ...{product._id.slice(-8)}
//                                 </span>
//                                 <CopyButton textToCopy={product._id} />
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 align-top font-semibold">
//                               {formatPrice(product.price)}
//                             </td>
//                             <td className="px-6 py-4 align-top">
//                               {product.variantsCount > 1 ? (
//                                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                                   {product.variantsCount} Variants
//                                 </span>
//                               ) : (
//                                 <span
//                                   className={`px-2 py-1 text-xs rounded-full ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                                 >
//                                   {product.inStock
//                                     ? `${product.variants[0]?.stock || 0} in stock`
//                                     : "Out of Stock"}
//                                 </span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 align-top text-right">
//                               <div className="flex items-center justify-end space-x-4">
//                                 <Link
//                                   href={`/Bismillah786/products/${product.slug}/edit`}
//                                   className="font-medium text-brand-primary hover:underline"
//                                 >
//                                   Edit
//                                 </Link>
//                                 <DeleteProductButton
//                                   productId={product._id}
//                                   productTitle={product.title}
//                                 />
//                               </div>
//                             </td>
//                           </tr>
//                           {isExpanded && product.variants && (
//                             <tr>
//                               <td colSpan={6} className="p-0">
//                                 <div className="bg-gray-100 dark:bg-gray-900 p-4 m-2 md:mx-4 rounded-lg border dark:border-gray-700">
//                                   <h4 className="font-bold mb-2 text-sm">
//                                     Variants:
//                                   </h4>
//                                   <table className="w-full text-xs">
//                                     <thead className="bg-gray-200 dark:bg-gray-800">
//                                       <tr>
//                                         <th className="p-2 text-left font-medium">
//                                           Name
//                                         </th>
//                                         <th className="p-2 text-left font-medium">
//                                           SKU
//                                         </th>
//                                         <th className="p-2 text-left font-medium">
//                                           Price
//                                         </th>
//                                         <th className="p-2 text-left font-medium">
//                                           Stock
//                                         </th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {product.variants.map((variant) => (
//                                         <tr
//                                           key={variant._key}
//                                           className="border-b dark:border-gray-700 last:border-0"
//                                         >
//                                           <td className="p-2">
//                                             {variant.name}
//                                           </td>
//                                           <td className="p-2 font-mono">
//                                             {variant.sku || "N/A"}
//                                           </td>
//                                           <td className="p-2">
//                                             {formatPrice(variant.price)}
//                                           </td>
//                                           <td className="p-2">
//                                             <span
//                                               className={`font-semibold ${variant.inStock ? "text-green-700" : "text-red-700"}`}
//                                             >
//                                               {variant.stock !== undefined
//                                                 ? `${variant.stock} units`
//                                                 : variant.inStock
//                                                   ? "In Stock"
//                                                   : "Out"}
//                                             </span>
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })
//                   : null}
//               </tbody>
//             </table>
//           </div>

//           {/* --- IMPROVEMENT: EMPTY STATE --- */}
//           {!hasProducts && (
//             <div className="text-center py-16 text-gray-500">
//               <p className="font-semibold">No products found</p>
//               {currentSearch && (
//                 <p className="text-sm mt-2">
//                   Try adjusting your search or{" "}
//                   <button
//                     onClick={handleClearSearch}
//                     className="text-brand-primary font-semibold hover:underline"
//                   >
//                     clear the search
//                   </button>
//                   .
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         <Pagination
//           totalPages={initialTotalPages}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//           isPending={isPending}
//         />
//       </div>
//     </div>
//   );
// }
// /app/admin/products/_components/ProductsClientPage.tsx

"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Pagination from "./Pagination";
import ProductSearchFilter from "./ProductSearchFilter";
import ProductsTable from "./ProductsTable";
import ProductsMobileList from "./ProductsMobileList";
// --- BUG FIX IS HERE: Correct import syntax for types ---
import { type AdminProductListItem } from "./ProductsTable";

interface ProductsClientPageProps {
  initialProducts: AdminProductListItem[];
  initialTotalPages: number;
}

export default function ProductsClientPage({
  initialProducts,
  initialTotalPages,
}: ProductsClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending] = useTransition();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("search") || "";

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasProducts = initialProducts.length > 0;

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex justify-center items-center z-10 rounded-lg">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
      )}
      <div
        className={`transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}
      >
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border dark:border-gray-700 space-y-6">
          <ProductSearchFilter />

          {hasProducts ? (
            <>
              <ProductsTable products={initialProducts} />
              <ProductsMobileList products={initialProducts} />
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="font-semibold">No products found</p>
              {currentSearch && (
                <p className="text-sm mt-2">
                  Try adjusting your search or{" "}
                  <button
                    onClick={handleClearSearch}
                    className="text-brand-primary font-semibold hover:underline"
                  >
                    clear the search
                  </button>
                  .
                </p>
              )}
            </div>
          )}
        </div>

        {initialTotalPages > 1 && (
          <Pagination
            totalPages={initialTotalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Type Import Fix:** The import statement for `AdminProductListItem` has been corrected to `import { type AdminProductListItem } from "./ProductsTable";`. This uses the standard syntax for importing a named export (the interface) and resolves the TypeScript error.
