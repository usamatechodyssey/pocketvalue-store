
"use client"; // This should be "use client"

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChevronRight, ChevronDown, Search, Package } from "lucide-react";
import { Order } from "../page"; // We'll import the type from the parent page

// Status Color Function
const getStatusClasses = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    case "Processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "Shipped":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// OrderCard Component
const OrderCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div
        className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Order ID:{" "}
            <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
              #{order._id.toString().slice(-6).toUpperCase()}
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Date:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {new Date(order.orderDate).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Rs. {order.totalPrice.toLocaleString()}
          </p>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(order.status)}`}>
            {order.status}
          </span>
          <div className="text-gray-400 dark:text-gray-500">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="space-y-4">
            {order.products.map((product) => (
              <div
                key={product.productId + (product.variant?.key || "")}
                className="flex items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Image
                    src={urlFor(product.image).url()}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/product/${product.slug}`} className="font-semibold text-sm text-gray-800 dark:text-gray-200 hover:text-brand-primary hover:underline line-clamp-2">
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {product.quantity} &times; Rs. {product.price.toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex-shrink-0">
                  Rs. {(product.price * product.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link href={`/account/orders/${order._id.toString()}`} className="text-sm text-brand-primary hover:underline font-bold">
              View Full Order Details &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Main List Component
export default function OrderList({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const cleanSearchTerm = searchTerm.replace("#", "").toUpperCase();
      const orderIdSuffix = order._id.toString().slice(-6).toUpperCase();
      const matchesSearch = cleanSearchTerm === "" || orderIdSuffix.includes(cleanSearchTerm);
      const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  return (
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 w-full sm:w-auto focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {paginatedOrders.length > 0 ? (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <OrderCard key={order._id.toString()} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">No Orders Found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No orders match your search or filter criteria.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-brand-primary text-on-primary shadow"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}