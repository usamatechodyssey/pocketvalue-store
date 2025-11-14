// /src/app/components/ui/Breadcrumbs.tsx

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "@/sanity/types/product_types";

interface BreadcrumbsProps {
  crumbs: BreadcrumbItem[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  // --- BreadcrumbList JSON-LD Schema Generation ---
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      // The last item in a breadcrumb trail should not have a URL.
      item:
        index < crumbs.length - 1
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${crumb.href}`
          : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={index} className="flex items-center">
                {isLast ? (
                  <span
                    className="font-semibold text-gray-700 dark:text-gray-200 truncate"
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-brand-primary hover:underline truncate"
                  >
                    {crumb.name}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight
                    size={16}
                    className="mx-1 sm:mx-2 shrink-0 text-gray-400"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// --- SUMMARY OF CHANGES ---
// - Created a new, reusable `Breadcrumbs` server component.
// - The component accepts a `crumbs` prop (an array of `BreadcrumbItem`).
// - It dynamically generates and injects a `BreadcrumbList` JSON-LD schema, which is critical for SEO.
// - It renders the visual breadcrumb trail, ensuring the last item is not a link, which is a best practice.
