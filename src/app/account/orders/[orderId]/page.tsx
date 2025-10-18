
import { auth } from "@/app/auth";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SanityImageObject } from "@/sanity/types/product_types";
import { ArrowLeft, MapPin, CreditCard, Check, X, Package } from "lucide-react";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import OrderActions from "../_components/OrderActions";
import { urlFor } from "@/sanity/lib/image";

const DB_NAME = process.env.MONGODB_DB_NAME!;
// Interfaces (No change)
interface OrderProduct {
  name: string; price: number; quantity: number; image: SanityImageObject; slug: string; variant?: { key: string; name: string };
}
interface OrderDetails {
  _id: ObjectId; orderDate: Date; products: OrderProduct[];
  shippingAddress: { fullName: string; address: string; area: string; city: string; province: string; phone: string; };
  status: string; totalPrice: number; paymentMethod: string; paymentStatus: string;
}

// StatusTimeline Component
const StatusTimeline = ({ status }: { status: string }) => {
  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStatusIndex = statuses.indexOf(status);

  if (status === "Cancelled") {
    return (
      <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-center font-semibold flex items-center justify-center gap-2">
        <X size={18} /> This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="relative pt-2 pb-8">
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700" />
      <div className="relative flex justify-between">
        {statuses.map((s, index) => (
          <div key={s} className="relative flex flex-col items-center text-center w-1/4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${
                index <= currentStatusIndex
                  ? "bg-brand-primary border-brand-primary"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              }`}
            >
              {index <= currentStatusIndex && <Check className="h-5 w-5 text-white" />}
            </div>
            <p className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                index <= currentStatusIndex
                  ? "text-brand-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Database function (No change)
async function getSingleUserOrderFromDB(orderId: string, userId: string): Promise<OrderDetails | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    if (!ObjectId.isValid(orderId)) return null;
    const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId), userId: userId });
    if (!order) return null;
    return JSON.parse(JSON.stringify(order)) as OrderDetails;
  } catch (error) {
    console.error("Failed to fetch single user order from DB:", error);
    return null;
  }
}

// Main Page Component
export default async function UserOrderDetailPage({ params }: { params: { orderId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?redirect=/account/orders");
  }

  const { orderId } = params;
  const order = await getSingleUserOrderFromDB(orderId, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Order Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order ID:{" "}
            <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
              #{order._id.toString().slice(-6).toUpperCase()}
            </span>
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <span>
              {new Date(order.orderDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </p>
        </div>
        <Link href="/account/orders" className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-200">Order Status</h2>
        <StatusTimeline status={order.status} />
      </div>

      <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Package size={20} /> Items Ordered ({order.products.length})
        </h2>
        <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
          {order.products.map((product, index) => (
            <div key={product.slug + index} className="flex items-start sm:items-center gap-4 pt-4 first:pt-0 flex-col sm:flex-row">
              <div className="relative w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <Image src={urlFor(product.image).url()} alt={product.name} fill className="object-contain p-1" />
              </div>
              <div className="flex-grow">
                <Link href={`/product/${product.slug}`} className="font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-primary hover:underline line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {product.quantity}</p>
              </div>
              <p className="font-bold text-gray-800 dark:text-gray-200 self-end sm:self-center">
                Rs. {(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <OrderActions orderId={order._id.toString()} currentStatus={order.status} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <MapPin size={20} /> Shipping Address
          </h2>
          <address className="not-italic text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.area}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </address>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <CreditCard size={20} /> Payment Details
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Payment Method:</span> <span className="font-semibold text-gray-800 dark:text-gray-200">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span> <span className="font-semibold text-gray-800 dark:text-gray-200">{order.paymentStatus}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between font-bold text-base text-gray-800 dark:text-gray-100">
              <span>Total Amount:</span> <span>Rs. {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}