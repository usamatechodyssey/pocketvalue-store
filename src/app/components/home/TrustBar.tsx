// src/components/home/TrustBar.tsx - FINAL TOUCH-UP

import {
  ShieldCheck,
  Rocket,
  BadgePercent,
  MessagesSquare,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: <ShieldCheck size={32} className="text-brand-primary" />,
    title: "Quality Inspected",
    description:
      "Every product is hand-checked by our team to ensure you get the best. No compromises.",
  },
  {
    icon: <Rocket size={32} className="text-brand-primary" />,
    title: "Fast Shipping",
    description:
      "We partner with the best couriers to get your order to your doorstep as quickly as possible.",
  },
  {
    icon: <BadgePercent size={32} className="text-brand-primary" />,
    title: "Honest Prices",
    description:
      "By cutting out the middlemen, we bring you premium products at pocket-friendly prices.",
  },
  {
    icon: <MessagesSquare size={32} className="text-brand-primary" />,
    title: "Real Support",
    description:
      "Our team is always here to help. Your happiness is our top priority, 24/7.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-surface-ground py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* === YAHAN CLASSES UPDATE HUIN HAIN === */}
        <div className="text-center mb-10">
          {/* font-bold aur color ab base se aayega */}
          <h2 className="text-3xl tracking-tight">Why Choose PocketValue?</h2>
          <p className="mt-2 text-lg text-text-secondary">
            We're more than just a store. We're a promise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-surface-base rounded-lg shadow-md border border-surface-border"
            >
              {/* bg-teal-100 ko brand-primary/10 se badla hai */}
              <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-brand-primary/10 rounded-full">
                {feature.icon}
              </div>
              {/* h3 ab base styles se color aur font-weight le lega */}
              <h3 className="text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
