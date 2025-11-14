// /src/app/checkout/_components/StepIndicator.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

// --- Component Data (for easy management and future scalability) ---
const STEPS = [
  { name: "Shipping", href: "/checkout" },
  { name: "Payment", href: "/checkout/payment" },
];

// === Main Component (POLISHED & FINAL) ===
export default function StepIndicator() {
  const pathname = usePathname();

  let currentStepIndex = STEPS.findIndex((step) =>
    pathname.startsWith(step.href)
  );
  if (pathname.startsWith("/order-success")) {
    currentStepIndex = STEPS.length;
  }

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {STEPS.map((step, stepIdx) => {
          const isCompleted = stepIdx < currentStepIndex;
          const isCurrent = stepIdx === currentStepIndex;

          return (
            <li
              key={step.name}
              className={`relative ${stepIdx !== STEPS.length - 1 ? "flex-1" : ""}`}
            >
              {/* Connecting Line between steps */}
              {stepIdx < STEPS.length - 1 ? (
                <div
                  className="absolute inset-0 top-4 left-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                >
                  {/* Highlighted portion of the line for completed steps */}
                  {isCompleted && (
                    <div className="h-0.5 w-full bg-brand-primary" />
                  )}
                </div>
              ) : null}

              {/* Step Circle and Name */}
              <div className="relative flex flex-col items-center group">
                {/* --- THE FIX IS HERE --- */}
                {/* The main circle is now a Link only if the step is completed, otherwise it's a span */}
                <ConditionalWrapper
                  condition={isCompleted}
                  wrapper={(children) => (
                    <Link href={step.href}>{children}</Link>
                  )}
                >
                  <span
                    className={`
                    relative flex h-8 w-8 items-center justify-center rounded-full 
                    transition-colors duration-300
                    ${
                      isCompleted
                        ? "bg-brand-primary hover:bg-brand-primary-hover cursor-pointer" // Completed step style
                        : isCurrent
                          ? "border-2 border-brand-primary bg-white dark:bg-gray-800" // Current step style
                          : "border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600" // Upcoming step style
                    }
                  `}
                  >
                    {isCompleted ? (
                      // For completed steps, show a clear checkmark. No pencil/edit icon needed.
                      <Check
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    ) : isCurrent ? (
                      // For the current step, show a filled dot
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-brand-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      // For upcoming steps, the circle is empty
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-transparent"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </ConditionalWrapper>

                {/* Step Name Text */}
                <p
                  className={`
                  mt-2 text-xs font-semibold whitespace-nowrap
                  ${
                    isCurrent || isCompleted
                      ? "text-brand-primary"
                      : "text-gray-500 dark:text-gray-400"
                  }
                `}
                >
                  {step.name}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// --- Helper component to conditionally wrap another component (e.g., with a Link) ---
const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}) => (condition ? wrapper(children) : children);
