import { auth } from "../auth";
import { redirect } from "next/navigation";
import AccountSidebar from "./_components/AccountSidebar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?redirect=/account");
  }

  return (
    // Main full-width background
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      {/* Centered content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs for better navigation */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-brand-primary hover:underline">
            Home
          </Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-medium text-gray-700 dark:text-gray-200">My Account</span>
        </div>
        
        {/* Main two-column layout */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Sidebar */}
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <AccountSidebar />
            </div>
          </aside>
          
          {/* Main Content Area in a card */}
          <main className="flex-1 w-full bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}