
import { auth } from "@/app/auth";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { SanityImageObject } from "@/sanity/types/product_types";
import OrderList from "./_components/OrderList";

// Types (No change)
interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: SanityImageObject;
  slug: string;
  variant?: { key: string; name: string };
}
export interface Order { // Exported so OrderList can use it
  _id: ObjectId;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  orderDate: Date;
  products: OrderProduct[];
}
const DB_NAME = process.env.MONGODB_DB_NAME!;

// Database function (No change)
async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const orders = await db
      .collection("orders")
      .find({ userId: userId })
      .sort({ orderDate: -1 })
      .toArray();
    return JSON.parse(JSON.stringify(orders)) as Order[];
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return [];
  }
}

// Main Page Component
export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?redirect=/account/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
        My Orders
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            You haven't placed any orders yet.
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            When you place an order, it will appear here.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 bg-brand-primary text-text-on-primary text-sm font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-transform transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <OrderList initialOrders={orders} />
      )}
    </div>
  );
}