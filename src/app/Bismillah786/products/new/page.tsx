// /app/admin/products/new/page.tsx
import ProductForm from "../_components/ProductForm";
import { getAllCategoriesForForm } from "../_actions/productActions";

export default async function NewProductPage() {
  // Server par categories fetch karein
  const categories = await getAllCategoriesForForm();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Add a New Product
      </h1>
      {/* Categories ko form mein prop ke zariye pass karein */}
      <ProductForm categories={categories} />
    </div>
  );
}
