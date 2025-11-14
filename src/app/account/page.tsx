// /src/app/account/page.tsx

import Link from "next/link";
import { auth } from "../auth";
import { ShoppingBag, User, MapPin, ArrowRight, Package } from "lucide-react";

// --- NAYE IMPORTS ---
import connectMongoose from "@/app/lib/mongoose"; // Mongoose connection helper
import Order, { IOrder } from "@/models/Order"; // Hamara naya Order model aur IOrder interface

// --- REFACTORED server-side function to use Mongoose ---
async function getRecentOrder(userId: string): Promise<IOrder | null> {
  try {
    await connectMongoose();

    // Mongoose Order model ka istemal karke sab se naya order dhoondein
    const recentOrder = await Order.findOne({ userId: userId })
      .sort({ createdAt: -1 }) // Naye timestamp field par sort karein
      .lean(); // .lean() plain JS object return karta hai

    if (!recentOrder) return null;

    // .lean() istemal karne se JSON.parse ki zaroorat nahi rehti
    return JSON.parse(JSON.stringify(recentOrder));
  } catch (error) {
    console.error("Failed to fetch recent order:", error);
    return null;
  }
}

const AccountDashboardPage = async () => {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] || "Customer";

  const recentOrder = session?.user?.id
    ? await getRecentOrder(session.user.id)
    : null;

  const dashboardLinks = [
    {
      title: "My Orders",
      description: "Check status and track your orders.",
      href: "/account/orders",
      icon: ShoppingBag,
    },
    {
      title: "My Profile",
      description: "Edit your name, email, and password.",
      href: "/account/profile",
      icon: User,
    },
    {
      title: "Address Book",
      description: "Manage your saved shipping addresses.",
      href: "/account/addresses",
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's a quick overview of your account.
        </p>
      </div>

      {recentOrder ? (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h2 className="font-semibold text-blue-800 dark:text-blue-300">
            Latest Order Status
          </h2>
          <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {/* --- YAHAN BEHTARI KI GAYI HAI --- */}
                Order {recentOrder.orderId}{" "}
                {/* Ab poora, human-readable ID dikhega */}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: <span className="font-bold">{recentOrder.status}</span>
              </p>
            </div>
            <Link
              href={`/account/orders/${recentOrder._id.toString()}`}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-bold rounded-lg shadow-sm hover:bg-white/80 dark:hover:bg-blue-900"
            >
              Track Order <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
          <Package size={32} className="mx-auto text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-semibold text-brand-primary hover:underline"
          >
            Start Shopping Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group block p-6 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-brand-primary/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                <link.icon
                  className="text-gray-700 dark:text-gray-200"
                  size={24}
                />
              </div>
              <ArrowRight
                size={20}
                className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-primary"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {link.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {link.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountDashboardPage;

// --- SUMMARY OF CHANGES ---
// - **Architectural Consistency (Rule #5):** `getRecentOrder` function ab `mongodb` native driver ke bajaye Mongoose `Order` model ka istemal kar raha hai. Yeh hamare project ke naye standard ke mutabiq hai.
// - **Consistent Typing (Rule #5):** Purani `Order` type ke bajaye ab Mongoose se aane wali `IOrder` interface istemal ho rahi hai.
// - **Improved UI & Data:** Dashboard par ab order ID ka aakhri hissa nahi, balke mukammal, human-readable ID (jaise "PV-1001") dikhaya ja raha hai, jo user ke liye zyada behtar hai.
// - **Code Quality:** Sorting ab `orderDate` ke bajaye `createdAt` (jo Mongoose khud manage karta hai) par ho rahi hai. `.lean()` ke istemal se data fetching thori tez ho sakti hai.
