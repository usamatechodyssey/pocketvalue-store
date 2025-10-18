// /app/admin/products/page.tsx
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getAllAdminProducts } from "./_actions/productActions";
import ProductsClientPage from "./_components/ProductsClientPage";
import { Suspense } from "react";
import { ClipLoader } from "react-spinners";

// Naya component jo data fetch karega
async function ProductList({ searchTerm }: { searchTerm: string }) {
  // Yeh function server par data fetch karta hai
  const products = await getAllAdminProducts(searchTerm);
  return <ProductsClientPage initialProducts={products} />;
}

// Main Page Component
export default async function AdminProductsPage({
  searchParams,
}: {
  // searchParams ab aek Promise hai
  searchParams: { search?: string };
}) {
  // === THE FINAL, CORRECT FIX IS HERE ===
  // Hum 'searchParams' ko istemal karne se pehle 'await' karenge
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams?.search || "";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/Bismillah786/products/import"
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            Import from CSV
          </Link>
          <Link
            href="/Bismillah786/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700"
          >
            <PlusCircle size={20} /> Add New Product
          </Link>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#14b8a6" size={40} />
          </div>
        }
      >
        <ProductList searchTerm={searchTerm} />
      </Suspense>
    </div>
  );
}
