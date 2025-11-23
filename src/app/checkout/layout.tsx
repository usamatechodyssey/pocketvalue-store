
// // /src/app/checkout/layout.tsx (UPGRADED & CLEANED)

// import React from "react";
// import { auth } from "@/app/auth";
// import { redirect } from "next/navigation";
// import { CheckoutProvider } from "./CheckoutContext";
// import OrderSummary from "./_components/OrderSummary";
// import StepIndicator from "./_components/StepIndicator";
// import type { Metadata } from "next";
// import connectMongoose from "@/app/lib/mongoose";
// import User, { IAddress } from "@/models/User";
// import { ClientAddress } from "@/app/actions/addressActions";

// export const metadata: Metadata = {
//   title: "Checkout | PocketValue",
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

// // This server-side function fetches user addresses and converts them to plain objects.
// async function getUserAddresses(userId: string): Promise<ClientAddress[]> {
//   try {
//     await connectMongoose();

//     const user = await User.findById(userId)
//       .select("addresses")
//       .lean<{ addresses?: IAddress[] }>(); // Use lean for performance

//     if (!user || !user.addresses) {
//       return [];
//     }

//     // Convert Mongoose subdocuments to clean, serializable ClientAddress objects
//     const plainAddresses: ClientAddress[] = user.addresses.map((addr) => ({
//       _id: addr._id.toString(),
//       fullName: addr.fullName,
//       phone: addr.phone,
//       province: addr.province,
//       city: addr.city,
//       area: addr.area,
//       address: addr.address,
//       isDefault: addr.isDefault,
//       lat: addr.lat || null,
//       lng: addr.lng || null,
//     }));

//     return plainAddresses;
//   } catch (error) {
//     console.error("Failed to fetch user addresses for checkout:", error);
//     return []; // Return an empty array on error to prevent crashes
//   }
// }

// export default async function CheckoutLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth(); // Get the session using our new database strategy
  
//   // If no session, redirect to login, preserving the checkout URL as the callback
//   if (!session?.user?.id) {
//     redirect("/login?callbackUrl=/checkout");
//   }

//   // Fetch the user's saved addresses
//   const addresses = await getUserAddresses(session.user.id);

//   return (
//     // Provide the fetched addresses to all client components within this layout
//     <CheckoutProvider savedAddresses={addresses}>
//       <main className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
//         <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
//           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//             <StepIndicator />
//           </div>
//         </div>
//         <div className="max-w-none mx-auto lg:px-8 xl:px-16 2xl:px-24">
//           {/* Main grid for checkout form and order summary */}
//           <div className="bg-white dark:bg-gray-800 lg:grid lg:grid-cols-2 lg:divide-x lg:divide-gray-200 dark:lg:divide-gray-700 lg:shadow-lg lg:rounded-xl lg:my-12">
            
//             {/* Left side: The page content (Shipping or Payment form) */}
//             <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{children}</div>
            
//             {/* Right side: Order Summary */}
//             <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12 bg-gray-50/50 dark:bg-gray-800/50 lg:bg-transparent dark:lg:bg-transparent border-t lg:border-t-0 border-gray-200 dark:border-gray-700">
//               <div className="lg:sticky lg:top-24">
//                 <OrderSummary />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </CheckoutProvider>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Simplified Auth Check:** The `auth()` function is now the single source of truth for getting the session, making the code cleaner and aligned with our new architecture.
// // - **Robust Data Fetching:** The `getUserAddresses` function now includes a `try...catch` block to prevent the entire page from crashing if there's a database error. It will simply return an empty array.
// // - **Code Clarity:** Added comments to explain the purpose of each section, improving maintainability. The core logic of fetching data and providing it via context was already excellent and remains unchanged.
import React from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { CheckoutProvider } from "./CheckoutContext";
import OrderSummary from "./_components/OrderSummary";
import StepIndicator from "./_components/StepIndicator";
import type { Metadata } from "next";
import connectMongoose from "@/app/lib/mongoose";
import User, { IAddress } from "@/models/User";
import { ClientAddress } from "@/app/actions/addressActions";

export const metadata: Metadata = {
  title: "Checkout | PocketValue",
  robots: {
    index: false,
    follow: false,
  },
};

// This server-side function fetches user addresses and converts them to plain objects.
async function getUserAddresses(userId: string): Promise<ClientAddress[]> {
  try {
    await connectMongoose();

    const user = await User.findById(userId)
      .select("addresses")
      .lean<{ addresses?: IAddress[] }>();

    if (!user || !user.addresses) {
      return [];
    }

    // Convert Mongoose subdocuments to clean, serializable ClientAddress objects
    const plainAddresses: ClientAddress[] = user.addresses.map((addr) => ({
      _id: addr._id.toString(),
      fullName: addr.fullName,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      area: addr.area,
      address: addr.address,
      isDefault: addr.isDefault,
      lat: addr.lat || null,
      lng: addr.lng || null,
    }));

    return plainAddresses;
  } catch (error) {
    console.error("Failed to fetch user addresses for checkout:", error);
    return []; 
  }
}

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); 
  
  // If no session, redirect to login
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  // Fetch the user's saved addresses
  const addresses = await getUserAddresses(session.user.id);

  // EXTRACTED: Get phone data from the session (populated in auth.ts)
  const userPhone = session.user.phone || null;
  
  // Check if verification date exists and is valid
  const isUserPhoneVerified = !!session.user.phoneVerified;

  return (
    // PROVIDE: Pass the phone data to the Context Provider
    <CheckoutProvider 
      savedAddresses={addresses}
      userPhone={userPhone}
      isUserPhoneVerified={isUserPhoneVerified}
    >
      <main className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <StepIndicator />
          </div>
        </div>
        <div className="max-w-none mx-auto lg:px-8 xl:px-16 2xl:px-24">
          <div className="bg-white dark:bg-gray-800 lg:grid lg:grid-cols-2 lg:divide-x lg:divide-gray-200 dark:lg:divide-gray-700 lg:shadow-lg lg:rounded-xl lg:my-12">
            
            <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{children}</div>
            
            <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12 bg-gray-50/50 dark:bg-gray-800/50 lg:bg-transparent dark:lg:bg-transparent border-t lg:border-t-0 border-gray-200 dark:border-gray-700">
              <div className="lg:sticky lg:top-24">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
    </CheckoutProvider>
  );
}