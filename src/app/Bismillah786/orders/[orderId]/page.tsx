// /app/admin/orders/[orderId]/page.tsx - SIRF STYLING UPDATE

import { auth } from "@/app/auth";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SanityImageObject } from "@/sanity/types/product_types";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { urlFor } from "@/sanity/lib/image";
import CopyButton from "../../_components/CopyButton";
import { getProductsStockStatus } from "@/sanity/lib/queries";
import UpdateOrderStatus from "../_components/UpdateOrderStatus";
import SendEmailModal from "../_components/SendEmailModal";

// Interfaces bilkul wesi hi rahengi
interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: SanityImageObject;
  slug?: string;
  variant?: { key: string; name: string };
}
interface FullOrder {
  _id: ObjectId;
  userId: string;
  totalPrice: number;
  status: string;
  orderDate: Date;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    fullName: string;
    address: string;
    area: string;
    city: string;
    province: string;
    phone: string;
  };
  products: OrderProduct[];
  userDetails?: { name: string; email: string };
}
const DB_NAME = process.env.MONGODB_DB_NAME!;
// Database function bilkul wesa hi rahega
async function getSingleOrder(orderId: string): Promise<FullOrder | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    if (!ObjectId.isValid(orderId)) return null;
    const results = await db
      .collection("orders")
      .aggregate([
        { $match: { _id: new ObjectId(orderId) } },
        {
          $lookup: {
            from: "users",
            let: { userIdAsString: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$userIdAsString"] },
                },
              },
            ],
            as: "userDetails",
          },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();
    return results[0] as FullOrder | null;
  } catch (error) {
    console.error("Failed to fetch single order:", error);
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const order = await getSingleOrder(orderId);
  if (!order) {
    notFound();
  }

  const productIdsInOrder = order.products.map((p) => p.productId);
  const stockStatuses = await getProductsStockStatus(productIdsInOrder);
  const stockMap = new Map(stockStatuses.map((s) => [s._id, s]));
  const customerName = order.userDetails?.name || "Guest User";
  const customerEmail = order.userDetails?.email || "N/A";

  return (
    <div className="space-y-8">
      {/* === YAHAN CLASSES UPDATE HUIN HAIN === */}
      <div>
        <h1 className="text-3xl">Order Details</h1>{" "}
        {/* font-bold aur color base se aayega */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-mono text-text-subtle">
            MongoDB ID: {order._id.toString()}
          </p>
          <CopyButton textToCopy={order._id.toString()} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-base p-6 rounded-lg shadow-md border border-surface-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                Products in this Order
              </h2>
              <span className="text-xs font-medium text-text-secondary bg-surface-input px-2 py-1 rounded-md">
                Live Stock Status
              </span>
            </div>
            <div className="space-y-4">
              {order.products.map((product) => {
                const liveStockInfo = stockMap.get(product.productId);
                let isProductInStock = false;
                if (liveStockInfo) {
                  if (product.variant) {
                    const variantStock = liveStockInfo.variants?.find(
                      (v) => v._key === product.variant!.key
                    );
                    isProductInStock = variantStock?.inStock ?? false;
                  } else {
                    isProductInStock = liveStockInfo.inStock;
                  }
                }
                return (
                  <div
                    key={product.productId + (product.variant?.key || "")}
                    className="border-b border-surface-border pb-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-surface-ground flex-shrink-0">
                        <Image
                          src={urlFor(product.image).url()}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-text-primary">
                          {product.name}
                        </p>
                        {product.variant?.name && (
                          <p className="text-xs text-text-secondary bg-surface-input inline-block px-2 py-0.5 rounded mt-1 font-medium">
                            {product.variant.name}
                          </p>
                        )}
                        <p className="text-sm text-text-secondary mt-1">
                          Qty: {product.quantity}
                        </p>
                      </div>
                      <div className="text-center flex-shrink-0 w-40">
                        {liveStockInfo ? (
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${isProductInStock ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"}`}
                          >
                            {isProductInStock
                              ? "Currently In Stock"
                              : "Currently Out of Stock"}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-surface-input text-text-secondary">
                            Product Deleted
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">
                          Rs.{" "}
                          {(product.price * product.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Rs. {product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-text-secondary bg-surface-ground p-2 rounded-md">
                      <span className="font-medium">Sanity Product ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{product.productId}</span>
                        <CopyButton textToCopy={product.productId} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <UpdateOrderStatus
            orderId={order._id.toString()}
            currentStatus={order.status}
          />
        </div>
        <div className="space-y-8">
          <div className="bg-surface-base p-6 rounded-lg shadow-md border border-surface-border">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              Customer Details
            </h2>
            <p className="font-bold text-text-primary">{customerName}</p>
            {/* `a` tag ab base styles se color le lega, lekin mailto: ke liye hum alag se de sakte hain */}
            <a
              href={`mailto:${customerEmail}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {customerEmail}
            </a>
            <address className="text-sm text-text-secondary mt-2 not-italic">
              {order.shippingAddress.address}, {order.shippingAddress.area}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.province}
              <br />
              Phone: {order.shippingAddress.phone}
            </address>
            <div className="mt-6 border-t border-surface-border pt-4">
              <SendEmailModal
                customerId={order.userId}
                customerName={customerName}
              />
            </div>
          </div>
          <div className="bg-surface-base p-6 rounded-lg shadow-md border border-surface-border">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              Payment Summary
            </h2>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Payment Method:</span>{" "}
                <span className="font-medium text-text-primary">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>{" "}
                <span className="font-medium text-text-primary">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="border-t border-surface-border mt-4 pt-4 flex justify-between font-bold text-base text-text-primary">
                <span>Total Amount:</span>{" "}
                <span>Rs. {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
