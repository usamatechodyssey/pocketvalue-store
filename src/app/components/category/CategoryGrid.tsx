// // app/components/home/CategoryGrid.tsx (NEW "FLOATING GLASS" DESIGN)

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";

// interface Props {
//   categories: SanityCategory[];
// }

// export default function CategoryGrid({ categories }: Props) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   return (
//     // Section ke background ko thora sa interesting banaya gaya hai taake glass effect nazar aaye
//     <section className="w-full py-8 brand-gradient-bg dark:bg-gray-900">
//       <div className="max-w-full mx-auto px-4 sm:px-6">
//         {/* Grid for Mobile: 4 columns, 2 rows */}
//         <div className="grid grid-cols-4 gap-4 md:gap-6">
//           {categories.map((category) => (
//             <Link
//               key={category._id}
//               href={`/category/${category.slug}`}
//               className="group text-center flex flex-col items-center"
//             >
//               {/* === THE GLASSMORPHISM CONTAINER === */}
//               {/* 'soft-ui-card' class hum globals.css mein define karenge */}
//               <div
//                 className="
//                   relative aspect-square w-full rounded-2xl 
//                   overflow-hidden transition-all duration-300
//                   group-hover:shadow-xl group-hover:-translate-y-1.5
//                   border border-white/20
//                   bg-white/60 dark:bg-white/10
//                   backdrop-blur-lg
//                 "
//               >
//                 {/* Image Container */}
//                 <div className="flex items-center justify-center h-full">
//                   {category.image ? (
//                     <Image
//                       src={urlFor(category.image).width(128).height(128).url()}
//                       alt={category.name}
//                       width={80} // Explicit width for better performance
//                       height={80} // Explicit height
//                       className="object-contain transition-transform duration-300 group-hover:scale-110"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full">
//                       <span className="text-xs text-text-subtle p-2">
//                         {category.name}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Category Name */}
//               <h3 className="mt-2 text-xs font-semibold text-text-primary dark:text-gray-300 group-hover:text-brand-primary transition-colors leading-tight px-1">
//                 {category.name}
//               </h3>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
