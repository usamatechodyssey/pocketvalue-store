// // app/components/home/CategoryShowcase.tsx (THE NEW MASTER COMPONENT)

// import { SanityCategory } from "@/sanity/types/product_types";
// import CategoryGrid from "@/app/components/category/CategoryGrid";
// import CategoryCarousel from "./CategoryCarousel";

// interface Props {
//   title: string;
//   categories: SanityCategory[]; // Sirf ek list chahiye hogi
// }

// export default function CategoryShowcase({ title, categories }: Props) {
//   return (
//     <>
//       {/* === MOBILE VIEW (Using the new Grid component) === */}
//       {/* 'md:hidden' means: This will be visible on small screens and hidden on medium screens (768px) and larger. */}
//       <div className="md:hidden">
//         {/* Mobile ke liye title ko hum grid ke andar hi manage kar sakte hain ya yahan dikha sakte hain */}
//         <h2 className="text-2xl font-bold text-center text-text-primary mb-6">
//           {title}
//         </h2>
//         <CategoryGrid categories={categories} />
//       </div>

//       {/* === TABLET & DESKTOP VIEW (Using your old Carousel component) === */}
//       {/* 'hidden md:block' means: This will be hidden on small screens and visible from medium screens and up. */}
//       <div className="hidden md:block">
//         <h2 className="text-3xl font-bold text-center text-text-primary mb-8">
//           {title}
//         </h2>
//         <CategoryCarousel categories={categories} title={""} />
//       </div>
//     </>
//   );
// }
// import { SanityCategory } from "@/sanity/types/product_types";
// import CategoryCarousel from "./CategoryCarousel";
// // Naya Component Import karein
// import MobileCategoryList from "./MobileCategoryList";

// interface Props {
//   title: string;
//   categories: SanityCategory[];
// }

// export default function CategoryShowcase({ title, categories }: Props) {
//   return (
//     <>
//       {/* === MOBILE VIEW (Instagram Style Scroll) === */}
//       <div className="block md:hidden">
//         <MobileCategoryList categories={categories} />
//       </div>

//       {/* === TABLET & DESKTOP VIEW (Your Existing Premium Carousel) === */}
//       <div className="hidden md:block">
//         <CategoryCarousel categories={categories} title={title} />
//       </div>
//     </>
//   );
// }
import { SanityCategory } from "@/sanity/types/product_types";
import CategoryCarousel from "./CategoryCarousel"; 
import MobileCategoryList from "./MobileCategoryList"; 

interface Props {
  title: string;
  categories: SanityCategory[];
}

export default function CategoryShowcase({ title, categories }: Props) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-4 md:py-8">
      
      {/* === MOBILE VIEW (No Changes) === */}
      <div className="md:hidden pt-2">
        <MobileCategoryList categories={categories} />
      </div>

      {/* === DESKTOP VIEW (YAHAN CHANGE HAI) === */}
      <div className="hidden md:block px-8">
        
        {/* 🔥 FIX: Is div ko center karne ke liye 'text-center' class add ki gayi hai */}
        <div className="mb-8 text-center">
            
            {/* 🔥 FIX: Isko thoda aur bold karne ke liye 'font-extrabold' kiya gaya hai */}
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {title || "Shop by Category"}
            </h2>

        </div>

        {/* Is component ko nahi chherna hai, yeh sirf circles dikhata hai */}
        <CategoryCarousel categories={categories} title="" />
      </div>

    </section>
  );
}