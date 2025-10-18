"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

export default function StepIndicator() {
  const pathname = usePathname();
  const steps = [
    { name: "Shipping", href: "/checkout" },
    { name: "Payment", href: "/checkout/payment" },
  ];
  
  let currentStepIndex = steps.findIndex((step) => pathname === step.href);
  if (currentStepIndex === -1) {
    currentStepIndex = steps.findIndex((step) => pathname.startsWith(step.href));
  }
  
  if (pathname.startsWith('/order-success')) {
    currentStepIndex = steps.length;
  }

  return (
    <nav aria-label="Progress" className="w-full max-w-sm">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? "flex-1" : ""}`}>
            {stepIdx < steps.length - 1 ? (
              <div className="absolute inset-0 top-4 left-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-200 dark:bg-gray-700" aria-hidden="true">
                {stepIdx < currentStepIndex && <div className="h-0.5 w-full bg-brand-primary" />}
              </div>
            ) : null}

            <div className="relative flex flex-col items-center">
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${ stepIdx < currentStepIndex ? "bg-brand-primary hover:bg-brand-primary-hover" : stepIdx === currentStepIndex ? "border-2 border-brand-primary bg-white dark:bg-gray-800" : "border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"}`}>
                    {stepIdx < currentStepIndex ? (
                        // --- CHECKMARK ALIGNMENT FIX ---
                        <Link href={step.href} className="flex items-center justify-center w-full h-full">
                            <Check className="h-5 w-5 text-white" aria-hidden="true" />
                        </Link>
                    ) : stepIdx === currentStepIndex ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" aria-hidden="true" />
                    ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                    )}
                </div>
                <p className={`mt-2 text-xs font-semibold whitespace-nowrap ${stepIdx <= currentStepIndex ? 'text-brand-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.name}
                </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};