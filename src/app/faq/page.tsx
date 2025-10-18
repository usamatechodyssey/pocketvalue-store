import { client } from "@/sanity/lib/client";
import { GET_FAQ_QUERY } from "@/sanity/lib/queries";
import type { FaqPage } from "@/sanity/types/product_types";
import FaqAccordion from "@/app/faq/FaqAccordion";
import { HelpCircle } from "lucide-react";

export const metadata = {
  title: 'Help Center & FAQ | PocketValue',
  description: 'Find answers to frequently asked questions about orders, shipping, returns, and more.',
};

export default async function Faq() {
  const faqData = await client.fetch<FaqPage>(GET_FAQ_QUERY);

  if (!faqData || !faqData.faqList) {
    return (
      <main className="w-full bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <HelpCircle size={48} className="mx-auto text-gray-400" />
          <h1 className="mt-4 text-4xl font-bold">FAQs Not Found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">We couldn't load the questions right now. Please check back later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {faqData.title}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Have a question? We're here to help. Find answers to common questions below.
            </p>
          </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <FaqAccordion items={faqData.faqList} />
        </div>
      </div>
    </main>
  );
}