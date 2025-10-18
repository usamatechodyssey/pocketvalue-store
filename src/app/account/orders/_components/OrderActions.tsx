// app/account/orders/[orderId]/_components/OrderActions.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { XCircle } from "lucide-react";
// Yahan hum aek server action banayenge order cancel karne ke liye
// import { cancelOrderAction } from '@/app/actions/orderActions';

export default function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  // Order cancel karne ka function
  const handleCancelOrder = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsCancelling(true);
    toast.loading("Cancelling order...");

    // Yahan aap apna server action call karenge
    try {
      // const result = await cancelOrderAction(orderId);
      // toast.dismiss();
      // toast.success(result.message);
      // Abhi ke liye dummy success
      setTimeout(() => {
        toast.dismiss();
        toast.success("Order cancelled successfully (dummy action).");
        setIsCancelling(false);
        // Page ko refresh karein taake status update ho jaye
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to cancel order.");
      setIsCancelling(false);
    }
  };

  // Sirf 'Pending' status mein hi cancel ka button dikhayein
  const canCancel = currentStatus === "Pending";

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Order Actions</h2>
      <div className="flex gap-4">
        {canCancel ? (
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            <XCircle size={16} />
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            No actions available for this order's current status.
          </p>
        )}
        {/* Yahan aap future mein 'Download Invoice' jaisa button bhi daal sakte hain */}
      </div>
    </div>
  );
}
