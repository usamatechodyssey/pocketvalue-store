// /app/admin/products/_components/ProductsClientPage.tsx - FINAL SUPERCHARGED CODE

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CopyButton from "../../_components/CopyButton";

// Nayi, aasan type jo sirf is page ke liye hai.
// Yeh getAllAdminProducts ke return type se match karti hai.
interface AdminProductListItem {
  _id: string;
  title: string;
  slug: string;
  price?: number;
  inStock?: boolean;
  mainImage?: any; // SanityImageObject
  variantsCount: number;
  // Iske alawa full product data bhi ho sakta hai jab details expand hon.
  variants?: {
    _key: string;
    name: string;
    sku?: string;
    price?: number;
    inStock: boolean;
  }[];
  brand?: { name: string };
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ProductsClientPage({
  initialProducts,
}: {
  initialProducts: AdminProductListItem[];
}) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, router, pathname, searchParams]);

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const formatPrice = (price?: number) =>
    price != null ? `Rs. ${price.toLocaleString()}` : "N/A";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="mb-4 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Product Name, Slug, SKU or full Sanity ID..."
          className="w-full p-2 pl-10 border rounded-md"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              <th className="w-20 px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Product Name & ID
              </th>
              <th className="w-40 px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Price
              </th>
              <th className="w-40 px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Stock / Variants
              </th>
              <th className="w-28 px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialProducts.length > 0 ? (
              initialProducts.map((product) => {
                const isVariable = product.variantsCount > 1;
                const isExpanded = expandedRowId === product._id;

                return (
                  <React.Fragment key={product._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-center">
                        {/* Expand button ab sirf tab dikhega jab 1 se zyada variant honge */}
                        <button
                          onClick={() => toggleRow(product._id)}
                          disabled={!product.variants}
                          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-25"
                        >
                          {product.variants &&
                            (isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            ))}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative h-12 w-12">
                          {/* Image ab product.mainImage se aayegi */}
                          {product.mainImage ? (
                            <Image
                              src={urlFor(product.mainImage).url()}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              No Img
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-medium text-gray-900 break-words">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span className="font-medium">ID:</span>
                          <span className="font-mono text-gray-600">
                            ...{product._id.slice(-8)}
                          </span>
                          <CopyButton textToCopy={product._id} />
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-sm font-semibold">
                        {/* Price ab direct product.price se aayegi */}
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 align-top">
                        {/* Stock logic ab product.variantsCount aur product.inStock par chalegi */}
                        {isVariable ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.variantsCount} Variants
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top text-right text-sm">
                        <div className="flex items-center justify-end space-x-4">
                          <Link
                            href={`/Bismillah786/products/${product.slug}/edit`}
                            className="font-medium text-teal-600 hover:text-teal-900"
                          >
                            Edit
                          </Link>
                          <DeleteProductButton
                            productId={product._id}
                            productTitle={product.title}
                          />
                        </div>
                      </td>
                    </tr>
                    {/* Expanded view ki logic ab behtar hai */}
                    {isExpanded && product.variants && (
                      <tr key={`${product._id}-details`}>
                        <td colSpan={6} className="p-0">
                          <div className="bg-gray-100 p-4 m-2 md:m-4 rounded-lg border">
                            <h4 className="font-bold mb-2 text-sm">
                              Variants for: {product.title}
                            </h4>
                            <table className="w-full text-sm">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="p-2 text-left font-medium">
                                    Name
                                  </th>
                                  <th className="p-2 text-left font-medium">
                                    SKU
                                  </th>
                                  <th className="p-2 text-left font-medium">
                                    Price
                                  </th>
                                  <th className="p-2 text-left font-medium">
                                    Stock
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants.map((variant) => (
                                  <tr
                                    key={variant._key}
                                    className="border-b last:border-0"
                                  >
                                    <td className="p-2">{variant.name}</td>
                                    <td className="p-2 font-mono text-xs">
                                      {variant.sku || "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {formatPrice(variant.price)}
                                    </td>
                                    <td className="p-2">
                                      <span
                                        className={`font-semibold ${variant.inStock ? "text-green-700" : "text-red-700"}`}
                                      >
                                        {variant.inStock
                                          ? "In Stock"
                                          : "Out of Stock"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-500">
                  No products found for your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
