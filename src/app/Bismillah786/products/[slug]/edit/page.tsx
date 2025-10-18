// /app/admin/products/[slug]/edit/page.tsx
import { notFound } from "next/navigation";
import ProductForm from "../../_components/ProductForm";
import {
  getAllCategoriesForForm,
  getSingleProductForEdit,
} from "../../_actions/productActions";

// Sanity se aane wale Portable Text ko Tiptap ke JSON mein convert karna hoga
// Hum iske liye aek helper function banayenge
import { portableTextToTiptapJson } from "@/utils/portableTextToTiptap";

interface EditProductPageProps {
  params: {
    slug: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // Product aur Categories dono ko ek saath fetch karein
  const [product, categories] = await Promise.all([
    getSingleProductForEdit(params.slug),
    getAllCategoriesForForm(),
  ]);

  // Agar product na mile, to 404 page dikhayein
  if (!product) {
    notFound();
  }

  // Sanity ke description ko Tiptap ke format mein convert karein
  const tiptapDescription = portableTextToTiptapJson(product.description);

  // Form ke liye initial data tayyar karein
  const initialData = {
    ...product,
    description: tiptapDescription, // Converted description
    categories: product.categoryIds || [], // Form ko sirf IDs chahiye
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>
      <ProductForm
        categories={categories}
        initialData={initialData} // Form ko initial data pass karein
      />
    </div>
  );
}
