// // /app/admin/products/new/page.tsx

// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import ProductForm from "../_components/ProductForm";
// import { getFormData } from "../_actions/productActions";

// // Yeh ek Server Component hai, jiska kaam initial data fetch karna hai.
// export default async function NewProductPage() {
//   // Page render hone se pehle server par hi categories aur brands fetch ho jayengi.
//   // Is se page tezi se load hota hai aur user ko loading state nahi dikhti.
//   const { categories, brands } = await getFormData();

//   return (
//     <div className="space-y-6">
//       {/* === IMPROVEMENT: Page Header with better UX === */}
//       <div className="flex items-center gap-4">
//         <Link
//           href="/Bismillah786/products"
//           className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//           aria-label="Back to products list" // Accessibility ke liye
//         >
//           <ArrowLeft size={20} />
//         </Link>
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">
//             Add a New Product
//           </h1>
//           <p className="text-sm text-gray-500">
//             Fill in the details below to create a new product.
//           </p>
//         </div>
//       </div>

//       {/*
//         ProductForm ek Client Component hai jo tamam interactivity (state, forms, clicks) handle karta hai.
//         Hum server par fetch kiya hua data isay initial props ke taur par pass kar rahe hain.
//       */}
//       <ProductForm
//         categories={categories || []}
//         brands={brands || []}
//       />
//     </div>
//   );
// }
// /app/admin/products/new/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../_components/ProductForm";
import { getFormData } from "../_actions/productActions";

// This is a Server Component that fetches initial data for the form.
export default async function NewProductPage() {
  // Data for categories and brands is fetched on the server before the page loads.
  // This improves performance and avoids loading spinners on the client.
  const { categories, brands } = await getFormData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/Bismillah786/products"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Back to products list"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Add a New Product
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to create a new product.
          </p>
        </div>
      </div>

      {/* 
        The ProductForm is a Client Component that handles all interactivity.
        We pass the server-fetched data as initial props.
      */}
      <ProductForm categories={categories || []} brands={brands || []} />
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - **No Changes:** After a thorough review, this file was found to be fully compliant with our architectural patterns (Server Component fetching data for a Client Component) and required no modifications.
