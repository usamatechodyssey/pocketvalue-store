// /src/app/account/orders/_components/OrderList.tsx (FINAL & CORRECTED)

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package } from "lucide-react";
// --- THE ARCHITECTURAL FIX IS HERE ---
import { ClientOrder } from "@/app/actions/orderActions"; // <-- Import the new, SAFE ClientOrder type

import PaginationControls from "@/app/components/ui/PaginationControls";
import OrderCard from "./OrderCard";
import OrderFilters from "./OrderFilters";

interface OrderListProps {
  initialOrders: ClientOrder[]; // <-- Use the ClientOrder type for props
  totalPages: number;
}

export default function OrderList({
  initialOrders,
  totalPages,
}: OrderListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/account/orders?${params.toString()}`);
  };

  const handleToggle = (orderId: string) => {
    setOpenOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="space-y-6">
      <OrderFilters />

      {initialOrders.length > 0 ? (
        <div className="space-y-4">
          {initialOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order} // <-- Pass the ClientOrder object to the child
              isOpen={openOrderId === order._id}
              onToggle={() => handleToggle(order._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <Package
            className="mx-auto h-12 w-12 text-gray-400"
            strokeWidth={1.5}
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            No Orders Found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No orders match your search or filter criteria.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <PaginationControls
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
