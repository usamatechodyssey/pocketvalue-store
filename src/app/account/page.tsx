import React from "react";
import Link from "next/link";
import { auth } from "../auth";
import { ShoppingBag, User, MapPin, ArrowRight } from "lucide-react";

const AccountDashboardPage = async () => {
  const session = await auth();
  const userName = session?.user?.name?.split(' ')[0] || "Customer"; // Sirf pehla naam istemal karein

  const dashboardLinks = [
    {
      title: "My Orders",
      description: "Check the status of your recent orders and view your order history.",
      href: "/account/orders",
      icon: ShoppingBag,
    },
    {
      title: "My Profile",
      description: "Edit your personal information and change your password.",
      href: "/account/profile",
      icon: User,
    },
    {
      title: "My Addresses",
      description: "Manage your saved shipping and billing addresses.",
      href: "/account/addresses",
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          From your account dashboard, you can manage all your activities on PocketValue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group block p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-brand-primary/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
                <div className="bg-brand-primary/10 p-3 rounded-lg">
                    <link.icon className="text-brand-primary" size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {link.title}
                </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 h-16">
              {link.description}
            </p>
            <div className="mt-4 flex items-center gap-1 font-semibold text-sm text-brand-primary group-hover:underline">
              <span>Go to {link.title}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountDashboardPage;