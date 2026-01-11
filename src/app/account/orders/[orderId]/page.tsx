// // /src/app/account/orders/[orderId]/page.tsx

// import { auth } from "@/app/auth";
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { findOneWithId } from "@/app/lib/mongodb";
// import { Order } from "@/types";

// // Import the new, smaller components
// import StatusTimeline from "./_components/StatusTimeline";
// import OrderItemsList from "./_components/OrderItemsList";
// import {
//   ShippingAddressCard,
//   PaymentDetailsCard,
// } from "./_components/OrderInfoCards";
// import OrderActions from "./_components/OrderActions";

// // --- Server-side function to fetch a single, specific order for a user ---
// async function getSingleUserOrder(
//   orderId: string,
//   userId: string
// ): Promise<Order | null> {
//   try {
//     const order = await findOneWithId("orders", orderId);

//     // Security Check: Ensure the fetched order belongs to the logged-in user
//     if (!order || order.userId !== userId) {
//       return null;
//     }

//     // Serialize the BSON data to be client-component friendly
//     return JSON.parse(JSON.stringify(order));
//   } catch (error) {
//     console.error("Failed to fetch single user order:", error);
//     return null;
//   }
// }

// // === Main Page Component (Server Component, Refactored) ===
// type UserOrderDetailPageProps = {
//   params: Promise<{ orderId: string }>;
// };

// export default async function UserOrderDetailPage(
//   props: UserOrderDetailPageProps
// ) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login?callbackUrl=/account/orders");
//   }

//   const { orderId } = await props.params;
//   const order = await getSingleUserOrder(orderId, session.user.id);

//   if (!order) {
//     notFound();
//   }
//   // === NAYI LINE: Order Number Banana ===
//   // Hum Option B (Quick Fix) use kar rahe hain abhi ke liye
//   const orderNumber = `PV-${order._id.toString().slice(-6).toUpperCase()}`;

//   return (
//     <div className="space-y-8">
//       {/* --- Page Header --- */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
//             Order Details
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//             Order ID:{" "}
//             <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
//               #{order._id.toString().slice(-6).toUpperCase()}
//             </span>
//             <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
//             <span>
//               {new Date(order.orderDate).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//           </p>
//         </div>
//         <Link
//           href="/account/orders"
//           className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
//         >
//           <ArrowLeft size={16} /> Back to My Orders
//         </Link>
//       </div>

//       {/* --- Main Content --- */}
//       {/* Each section is now its own self-contained component */}

//       <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
//         <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
//           Order Status
//         </h2>
//         <StatusTimeline status={order.status} />
//       </div>

//       <OrderItemsList products={order.products} />

//       {/* === YAHAN CHANGE HAI === */}
//       <OrderActions
//         orderId={order._id.toString()}
//         orderNumber={orderNumber} // Pass the new order number
//         currentStatus={order.status}
//         products={order.products} // Pass the products array
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <ShippingAddressCard shippingAddress={order.shippingAddress} />
//         {/* --- THE FIX IS HERE: Pass ALL required price details --- */}
//         <PaymentDetailsCard
//           paymentDetails={{
//             paymentMethod: order.paymentMethod,
//             paymentStatus: order.paymentStatus,
//             subtotal: order.subtotal, // Pass subtotal
//             shippingCost: order.shippingCost, // Pass shippingCost
//             totalPrice: order.totalPrice, // This is the grandTotal
//           }}
//         />
//       </div>
//     </div>
//   );
// }
// /src/app/account/orders/[orderId]/page.tsx (UPDATED TO USE DTO)

// import { auth } from "@/app/auth";
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import connectMongoose from "@/app/lib/mongoose";
// import Order, { IOrder } from "@/models/Order";
// // --- THE FIX IS HERE: Import the new DTO type ---
// import { ClientOrder } from "@/app/actions/orderActions";

// import StatusTimeline from "./_components/StatusTimeline";
// import OrderItemsList from "./_components/OrderItemsList";
// import {
//   ShippingAddressCard,
//   PaymentDetailsCard,
// } from "./_components/OrderInfoCards";
// import OrderActions from "./_components/OrderActions";

// // This function now returns a plain, safe ClientOrder object
// async function getSingleUserOrder(
//   orderId: string,
//   userId: string
// ): Promise<ClientOrder | null> {
//   try {
//     await connectMongoose();
    
//     const order = await Order.findOne({
//       $or: [{ _id: orderId }, { orderId: orderId }],
//       userId: userId
//     }).lean<IOrder>();

//     if (!order) {
//       return null;
//     }

//     // Manually convert the Mongoose object to a plain ClientOrder object
//     const clientOrder: ClientOrder = {
//         _id: order._id.toString(),
//         orderId: order.orderId,
//         userId: order.userId,
//         totalPrice: order.totalPrice,
//         status: order.status,
//         createdAt: new Date(order.createdAt).toISOString(),
//         products: order.products.map(p => ({
//             _id: p._id,
//             cartItemId: p.cartItemId,
//             name: p.name,
//             price: p.price,
//             quantity: p.quantity,
//             slug: p.slug,
//             image: p.image,
//             variant: p.variant
//         })),
//         shippingAddress: order.shippingAddress,
//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,
//         subtotal: order.subtotal,
//         shippingCost: order.shippingCost,
//     };

//     return clientOrder;

//   } catch (error) {
//     console.error("Failed to fetch single user order:", error);
//     return null;
//   }
// }

// type UserOrderDetailPageProps = {
//   params: { orderId: string }; // params is a direct object here, not a promise
// };

// export default async function UserOrderDetailPage({ params }: UserOrderDetailPageProps) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login?callbackUrl=/account/orders");
//   }

//   const { orderId } = params;
//   // The 'order' variable is now a clean ClientOrder object
//   const order = await getSingleUserOrder(orderId, session.user.id);

//   if (!order) {
//     notFound();
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
//             Order Details
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//             Order ID:{" "}
//             <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
//               {order.orderId}
//             </span>
//             <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
//             <span>
//               {new Date(order.createdAt).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//           </p>
//         </div>
//         <Link
//           href="/account/orders"
//           className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
//         >
//           <ArrowLeft size={16} /> Back to My Orders
//         </Link>
//       </div>

//       {/* All child components will now receive clean, plain data */}
//       <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
//         <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
//           Order Status
//         </h2>
//         <StatusTimeline status={order.status} />
//       </div>

//       <OrderItemsList products={order.products} />

//       <OrderActions
//         orderId={order._id} // _id is now a string
//         orderNumber={order.orderId}
//         currentStatus={order.status}
//         products={order.products} // Pass the clean products array
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <ShippingAddressCard shippingAddress={order.shippingAddress} />
//         <PaymentDetailsCard
//           paymentDetails={{
//             paymentMethod: order.paymentMethod,
//             paymentStatus: order.paymentStatus,
//             subtotal: order.subtotal,
//             shippingCost: order.shippingCost,
//             totalPrice: order.totalPrice,
//           }}
//         />
//       </div>
//     </div>
//   );
// }
// /src/app/account/orders/[orderId]/page.tsx (UPDATED TO USE DTO & NEXT.JS 16 PARAMS)

import { auth } from "@/app/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import connectMongoose from "@/app/lib/mongoose";
import Order, { IOrder } from "@/models/Order";
import { ClientOrder } from "@/app/actions/orderActions";

import StatusTimeline from "./_components/StatusTimeline";
import OrderItemsList from "./_components/OrderItemsList";
import {
  ShippingAddressCard,
  PaymentDetailsCard,
} from "./_components/OrderInfoCards";
import OrderActions from "./_components/OrderActions";

// This function returns a plain, safe ClientOrder object
async function getSingleUserOrder(
  orderId: string,
  userId: string
): Promise<ClientOrder | null> {
  try {
    await connectMongoose();
    
    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId: orderId }],
      userId: userId
    }).lean<IOrder>();

    if (!order) {
      return null;
    }

    // Manually convert the Mongoose object to a plain ClientOrder object
    const clientOrder: ClientOrder = {
        _id: order._id.toString(),
        orderId: order.orderId,
        userId: order.userId,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: new Date(order.createdAt).toISOString(),
        products: order.products.map(p => ({
            _id: p._id,
            cartItemId: p.cartItemId,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            slug: p.slug,
            image: p.image,
            variant: p.variant
        })),
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
    };

    return clientOrder;

  } catch (error) {
    console.error("Failed to fetch single user order:", error);
    return null;
  }
}

// UPDATE: params is now a Promise (Next.js 15/16 requirement)
type UserOrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function UserOrderDetailPage({ params }: UserOrderDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/orders");
  }

  // UPDATE: Await the params before accessing properties
  const { orderId } = await params;

  // The 'order' variable is a clean ClientOrder object
  const order = await getSingleUserOrder(orderId, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order ID:{" "}
            <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
              {order.orderId}
            </span>
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <span>
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
        <Link
          href="/account/orders"
          className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
          Order Status
        </h2>
        <StatusTimeline status={order.status} />
      </div>

      <OrderItemsList products={order.products} />

      <OrderActions
        orderId={order._id}
        orderNumber={order.orderId}
        currentStatus={order.status}
        products={order.products}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ShippingAddressCard shippingAddress={order.shippingAddress} />
        <PaymentDetailsCard
          paymentDetails={{
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            subtotal: order.subtotal,
            shippingCost: order.shippingCost,
            totalPrice: order.totalPrice,
          }}
        />
      </div>
    </div>
  );
}

// // /src/app/account/orders/[orderId]/page.tsx

// import { auth } from "@/app/auth";
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import connectMongoose from "@/app/lib/mongoose";
// import Order, { IOrder } from "@/models/Order";

// import StatusTimeline from "./_components/StatusTimeline";
// import OrderItemsList from "./_components/OrderItemsList";
// import {
//   ShippingAddressCard,
//   PaymentDetailsCard,
// } from "./_components/OrderInfoCards";
// import OrderActions from "./_components/OrderActions";

// async function getSingleUserOrder(
//   orderId: string,
//   userId: string
// ): Promise<IOrder | null> {
//   try {
//     await connectMongoose();
    
//     const order = await Order.findOne({
//       $or: [{ _id: orderId }, { orderId: orderId }],
//       userId: userId
//     }).lean();

//     if (!order) {
//       return null;
//     }

//     return JSON.parse(JSON.stringify(order));
//   } catch (error) {
//     console.error("Failed to fetch single user order:", error);
//     return null;
//   }
// }

// // --- BUG FIX IS HERE ---
// // Type for the page props, updated for Next.js 16+
// type UserOrderDetailPageProps = {
//   params: Promise<{ orderId: string }>;
// };

// export default async function UserOrderDetailPage(
//   props: UserOrderDetailPageProps
// ) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login?callbackUrl=/account/orders");
//   }

//   // --- BUG FIX IS HERE: Correctly await the params promise ---
//   const { orderId } = await props.params;
//   const order = await getSingleUserOrder(orderId, session.user.id);

//   if (!order) {
//     notFound();
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
//             Order Details
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//             Order ID:{" "}
//             <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
//               {order.orderId}
//             </span>
//             <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
//             <span>
//               {new Date(order.createdAt).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//           </p>
//         </div>
//         <Link
//           href="/account/orders"
//           className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
//         >
//           <ArrowLeft size={16} /> Back to My Orders
//         </Link>
//       </div>

//       <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
//         <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
//           Order Status
//         </h2>
//         <StatusTimeline status={order.status} />
//       </div>

//       <OrderItemsList products={order.products} />

//       <OrderActions
//         orderId={order._id.toString()}
//         orderNumber={order.orderId}
//         currentStatus={order.status}
//         products={order.products}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <ShippingAddressCard shippingAddress={order.shippingAddress} />
//         <PaymentDetailsCard
//           paymentDetails={{
//             paymentMethod: order.paymentMethod,
//             paymentStatus: order.paymentStatus,
//             subtotal: order.subtotal,
//             shippingCost: order.shippingCost,
//             totalPrice: order.totalPrice,
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Next.js 16+ Compliance:** Corrected the component to adhere to Rule #8. The `params` prop is now correctly typed as a `Promise` and is handled with `await` before being used, ensuring forward-compatibility.
// // - **Mongoose Refactor:** The `getSingleUserOrder` function has been refactored to use the centralized `Order` Mongoose model.
// // - **Backward Compatible Query:** The query `Order.findOne({ $or: [{ _id: orderId }, { orderId: orderId }]... })` ensures both old and new ID formats work in the URL.
// // - **`orderId` Integration:** The page now displays the correct `orderId` and passes it down to child components.