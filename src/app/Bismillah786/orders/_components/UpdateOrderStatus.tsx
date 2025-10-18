// /app/admin/orders/_components/UpdateOrderStatus.tsx - ERROR FIX KE SAATH

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateOrderStatus } from "../_actions/orderActions";

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus);

      // === YAHAN PAR HAI ASLI, SAHI FIX ===
      // Pehle check karo ke result mojood hai
      if (result && result.success) {
        toast.success(result.message);
        router.refresh(); // Page ko refresh karega taake naya status nazar aaye
      } else if (result) {
        // Agar result hai lekin success nahi, to server se aya hua error dikhao
        toast.error(result.message || "An unknown error occurred.");
      } else {
        // Agar result undefined hai, to aek aam error dikhao
        toast.error("Failed to get a response from the server.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-base p-6 rounded-lg shadow-md border border-surface-border">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">
        Update Order Status
      </h2>
      <p className="text-sm text-text-secondary mb-1">
        Current Status:{" "}
        <span className="font-bold text-text-primary ml-2">
          {currentStatus}
        </span>
      </p>
      <p className="text-sm text-text-secondary mb-4">
        Select a new status for this order.
      </p>
      <div className="flex gap-4">
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="flex-grow p-2 border border-surface-border-darker rounded-md bg-surface-base shadow-sm focus:ring-brand-primary focus:border-brand-primary"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleUpdate}
          disabled={isLoading || newStatus === currentStatus}
          className="bg-brand-primary text-on-primary font-semibold px-6 py-2 rounded-md hover:bg-brand-primary-hover transition-colors disabled:bg-surface-border-darker disabled:text-text-subtle disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
