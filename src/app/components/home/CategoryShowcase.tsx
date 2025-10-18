// app/components/home/CategoryShowcase.tsx (THE NEW MASTER COMPONENT)

import { SanityCategory } from "@/sanity/types/product_types";
import CategoryGrid from "@/app/components/category/CategoryGrid";
import CategoryCarousel from "./CategoryCarousel";

interface Props {
  title: string;
  categories: SanityCategory[]; // Sirf ek list chahiye hogi
}

export default function CategoryShowcase({ title, categories }: Props) {
  return (
    <>
      {/* === MOBILE VIEW (Using the new Grid component) === */}
      {/* 'md:hidden' means: This will be visible on small screens and hidden on medium screens (768px) and larger. */}
      <div className="md:hidden">
        {/* Mobile ke liye title ko hum grid ke andar hi manage kar sakte hain ya yahan dikha sakte hain */}
        <h2 className="text-2xl font-bold text-center text-text-primary mb-6">
          {title}
        </h2>
        <CategoryGrid categories={categories} />
      </div>

      {/* === TABLET & DESKTOP VIEW (Using your old Carousel component) === */}
      {/* 'hidden md:block' means: This will be hidden on small screens and visible from medium screens and up. */}
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-center text-text-primary mb-8">
          {title}
        </h2>
        <CategoryCarousel categories={categories} />
      </div>
    </>
  );
}
