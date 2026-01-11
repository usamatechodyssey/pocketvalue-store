// // /src/app/components/ui/Breadcrumbs.tsx

// import Link from "next/link";
// import { ChevronRight } from "lucide-react";
// import { BreadcrumbItem } from "@/sanity/types/product_types";

// interface BreadcrumbsProps {
//   crumbs: BreadcrumbItem[];
// }

// export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
//   if (!crumbs || crumbs.length === 0) {
//     return null;
//   }

//   // --- BreadcrumbList JSON-LD Schema Generation ---
//   const breadcrumbSchema = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     itemListElement: crumbs.map((crumb, index) => ({
//       "@type": "ListItem",
//       position: index + 1,
//       name: crumb.name,
//       // The last item in a breadcrumb trail should not have a URL.
//       item:
//         index < crumbs.length - 1
//           ? `${process.env.NEXT_PUBLIC_BASE_URL}${crumb.href}`
//           : undefined,
//     })),
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
//       />
//       <nav aria-label="Breadcrumb">
//         <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//           {crumbs.map((crumb, index) => {
//             const isLast = index === crumbs.length - 1;
//             return (
//               <li key={index} className="flex items-center">
//                 {isLast ? (
//                   <span
//                     className="font-semibold text-gray-700 dark:text-gray-200 truncate"
//                     aria-current="page"
//                   >
//                     {crumb.name}
//                   </span>
//                 ) : (
//                   <Link
//                     href={crumb.href}
//                     className="hover:text-brand-primary hover:underline truncate"
//                   >
//                     {crumb.name}
//                   </Link>
//                 )}
//                 {!isLast && (
//                   <ChevronRight
//                     size={16}
//                     className="mx-1 sm:mx-2 shrink-0 text-gray-400"
//                   />
//                 )}
//               </li>
//             );
//           })}
//         </ol>
//       </nav>
//     </>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - Created a new, reusable `Breadcrumbs` server component.
// // - The component accepts a `crumbs` prop (an array of `BreadcrumbItem`).
// // - It dynamically generates and injects a `BreadcrumbList` JSON-LD schema, which is critical for SEO.
// // - It renders the visual breadcrumb trail, ensuring the last item is not a link, which is a best practice.
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
      <nav aria-label="Breadcrumb" className="w-full">
        {/* 
           FIX 1: 'flex-wrap' 
           Isse agar categories zyada hongi to wo screen se bahar jaane ke bajaye 
           next line par aa jayengi.
        */}
        <ol className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            
            return (
              // FIX 2: 'min-w-0'
              // Ye flex child ko force karta hai ke wo shrink ho sake.
              <li key={index} className="flex items-center min-w-0">
                {isLast ? (
                  // FIX 3: Handling Long Text (Truncate + Max Width)
                  // Mobile par max-width 150px rakhi hai, Tablet/Desktop par badha di hai.
                  // 'truncate' text ko '...' kar dega agar wo width se zyada hoga.
                  <span
                    className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[150px] sm:max-w-[300px] md:max-w-[450px]"
                    aria-current="page"
                    title={crumb.name} // Mouse hover par pura naam dikhega
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    // Links ko bhi thoda limit kia hai taki wo mobile par puri screen na le lein
                    className="hover:text-brand-primary hover:underline truncate max-w-[100px] sm:max-w-none"
                  >
                    {crumb.name}
                  </Link>
                )}
                
                {!isLast && (
                  <ChevronRight
                    size={14} // Icon size thoda chota kiya for better alignment
                    className="shrink-0 text-gray-400"
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