// /app/account/returns/page.tsx

import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { getUserReturnRequests } from "@/app/actions/returnActions"; // Hamara naya action
import ReturnsListClient from "./_components/ReturnsListClient"; // Yeh component hum agle step mein banayenge

export default async function MyReturnsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/returns");
  }

  // --- SERVER-SIDE DATA FETCHING ---
  const returnRequests = await getUserReturnRequests();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <Undo2 size={24} className="text-gray-700 dark:text-gray-200" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Returns
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View the history and status of your return requests.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        {returnRequests.length === 0 ? (
          // Agar koi return request hi na ho to yeh UI dikhayein
          <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Undo2
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              You haven't requested any returns yet.
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You can request a return from your completed orders.
            </p>
            <div className="mt-6">
              <Link
                href="/account/orders"
                className="inline-flex items-center px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-lg shadow-md hover:bg-brand-primary-hover"
              >
                View My Orders
              </Link>
            </div>
          </div>
        ) : (
          // Server se fetch kiya hua data client component ko pass karein
          <ReturnsListClient initialRequests={returnRequests} />
        )}
      </div>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Naya Feature:** Ek naya, aala-mayari Server Component (`/app/account/returns/page.tsx`) banaya gaya hai.
// - **Framework Best Practices (Rule #7):** Yeh page server par data fetch karne ke liye hamare naye `getUserReturnRequests` action ka istemal karta hai.
// - **Componentization (Rule #5):** Data display karne ki zimmedari ek alag Client Component (`ReturnsListClient`) ko di gayi hai, jo hamare architecture ke mutabiq hai.
// - **User Experience:** User ke liye ek saaf suthra "empty state" UI banaya gaya hai agar usne abhi tak koi return request nahi ki ho.