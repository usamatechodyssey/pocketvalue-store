// /app/admin/orders/page.tsx - SIRF STYLING UPDATE

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Search } from "lucide-react";

// Debounce hook bilkul wesa hi rahega
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Type Definition bilkul wesi hi rahegi
interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  orderDate: string;
  customerName: string;
  itemCount: number;
}

// === Helper Function (Updated) ===
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-brand-success/10 text-brand-success";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-indigo-100 text-indigo-800";
    case "cancelled":
      return "bg-brand-danger/10 text-brand-danger";
    default:
      return "bg-amber-100 text-amber-800"; // Pending ke liye
  }
};

// === OrdersContent Component (Updated) ===
function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const status = searchParams.get("status") || "All";
  const searchTermFromUrl = searchParams.get("search") || "";

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTermFromUrl);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  const fetchOrders = useCallback(
    async (currentStatus: string, currentSearch: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/Bismillah786/orders?status=${currentStatus}&search=${currentSearch}`
        );
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", debouncedSearchTerm);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, router, pathname, searchParams]);

  useEffect(() => {
    fetchOrders(status, searchTermFromUrl);
  }, [status, searchTermFromUrl, fetchOrders]);

  const handleFilterChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", newStatus === "All" ? "" : newStatus);
    router.push(`${pathname}?${params.toString()}`);
  };

  const TABS = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div>
      <h1 className="text-3xl">Manage Orders</h1>{" "}
      {/* font-bold aur color base se aayega */}
      <div className="bg-surface-base p-4 mt-6 rounded-lg shadow-sm border border-surface-border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
              size={20}
            />
            <input
              type="text"
              name="search"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search by Order ID, Customer Name or Phone..."
              className="w-full p-2 pl-10 border border-surface-border-darker rounded-md bg-surface-base focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  status === tab
                    ? "bg-brand-primary text-on-primary shadow"
                    : "bg-surface-input hover:bg-surface-border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color="#0D9488" size={40} />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-surface-border text-sm">
              <thead className="bg-surface-ground">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-text-primary">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-text-primary">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-text-primary">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-text-primary">
                    Items
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-text-primary">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-text-primary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface-base divide-y divide-surface-border">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 font-mono text-text-subtle">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-text-primary">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center text-text-secondary">
                        {order.itemCount}
                      </td>
                      <td className="px-6 py-4 text-right text-text-primary font-semibold">
                        Rs. {order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {/* `a` tag ab base styles se color le lega */}
                        <Link
                          href={`/Bismillah786/orders/${order._id}`}
                          className="hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-text-secondary"
                    >
                      No orders found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Suspense Wrapper ---
export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#0D9488" size={50} />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
