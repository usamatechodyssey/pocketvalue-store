import React from 'react';
import { auth } from "@/app/auth";
import { redirect } from 'next/navigation';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Address } from '@/app/actions/addressActions';
import { CheckoutProvider } from './CheckoutContext'; // <-- NAYA IMPORT
import OrderSummary from './_components/OrderSummary';
import StepIndicator from './_components/StepIndicator';


const DB_NAME = process.env.MONGODB_DB_NAME!;
async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user || !user.addresses) return [];
    return JSON.parse(JSON.stringify(user.addresses));
  } catch (error) {
    console.error("Failed to fetch user addresses for checkout:", error);
    return [];
  }
}

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?redirect=/checkout");
  }

  const addresses = await getUserAddresses(session.user.id);

  return (
    // Yahan ab CheckoutProvider istemal hoga
    <CheckoutProvider savedAddresses={addresses}>
      <main className="w-full bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="pb-12 mb-8 border-b border-gray-200 dark:border-gray-700 flex justify-center">
            <StepIndicator />
          </div>
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-start">
            <div className="w-full lg:w-[400px] lg:sticky lg:top-24 flex-shrink-0">
              <OrderSummary />
            </div>
            <div className="w-full lg:flex-1">
              {children}
            </div>
          </div>
        </div>
      </main>
    </CheckoutProvider>
  );
}