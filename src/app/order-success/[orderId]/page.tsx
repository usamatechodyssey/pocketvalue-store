// app/order-success/[orderId]/page.tsx - SIRF STYLING UPDATE

import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClearCartOnSuccess from "../_components/ClearCartOnSuccess";


const DB_NAME = process.env.MONGODB_DB_NAME!;
// Interface aur getOrder function bilkul wese hi rahenge
interface Order {
  _id: ObjectId;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    area: string;
    city: string;
    province: string;
  };
}
async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    if (!ObjectId.isValid(orderId)) return null;
    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });
    return order as Order | null;
  } catch (error) {
    console.error("Failed to fetch order for success page:", error);
    return null;
  }
}

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  // Logic bilkul wesa hi rahega
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  return (
    // === SIRF YAHAN CLASSES UPDATE HUIN HAIN ===
    <div className="bg-surface-ground min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-surface-base p-8 sm:p-10 rounded-2xl shadow-lg border border-surface-border max-w-2xl w-full text-center">
        <ClearCartOnSuccess />

        <div className="mx-auto w-20 h-20 flex items-center justify-center bg-brand-success/10 rounded-full mb-6">
          <CheckCircle2
            className="text-brand-success"
            size={50}
            strokeWidth={2}
          />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Thank You For Your Order!
        </h1>
        <p className="text-text-secondary mb-6">
          Your order has been placed successfully. A confirmation email has been
          sent to you.
        </p>

        <div className="bg-surface-ground border-dashed border-2 border-surface-border-darker rounded-lg p-4 my-8">
          <p className="text-sm text-text-subtle uppercase tracking-wider">
            Your Order ID
          </p>
          <p className="text-2xl font-mono font-bold text-brand-primary mt-1 tracking-wider">
            {order._id.toString()}
          </p>
        </div>

        <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-surface-border pt-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Shipping to:
            </h3>
            <p className="text-text-primary font-bold mt-2">
              {order.shippingAddress.fullName}
            </p>
            <address className="text-text-secondary text-sm not-italic mt-1">
              {order.shippingAddress.address}, {order.shippingAddress.area},
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.province}
            </address>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Payment Summary:
            </h3>
            <p className="text-text-primary font-bold mt-2">
              Rs. {order.totalPrice.toLocaleString()}
            </p>
            <p className="text-text-secondary text-sm mt-1">
              Paid via {order.paymentMethod}.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-on-primary font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors text-amber-50"
          >
            <ShoppingBag size={18} className="text-amber-50" />
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-input text-text-primary font-semibold rounded-lg shadow-sm hover:bg-surface-border transition-colors"
          >
            View My Orders
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
