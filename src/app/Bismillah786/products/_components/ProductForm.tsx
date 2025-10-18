// /app/admin/products/_components/ProductForm.tsx
"use client";

import { useState } from "react";
import TiptapEditor from "./RichTextEditor";
import { toast } from "react-hot-toast";
import { createProduct, updateProduct } from "../_actions/productActions";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader"; // NAYA: ImageUploader import karein

// --- Type Definitions ---
interface SanityAsset {
  _type: "reference";
  _ref: string;
}
interface Category {
  _id: string;
  name: string;
}
interface Attribute {
  id: number;
  name: string;
  values: string[];
}
interface Variant {
  _key: string;
  name: string;
  sku: string;
  price: number;
  inStock: boolean;
  attributes: { name: string; value: string }[];
}
interface ProductData {
  _id?: string;
  title?: string;
  slug?: string;
  description?: any;
  price?: number;
  salePrice?: number;
  brand?: string;
  inStock?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  categories?: string[];
  variants?: Variant[];
  images?: SanityAsset[];
}
interface ProductFormProps {
  categories: Category[];
  initialData?: ProductData;
}

// === The Main Component ===
export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const isEditMode = !!initialData?._id;
  const router = useRouter();

  // === State Hooks ===
  const [productType, setProductType] = useState<"simple" | "variable">(
    initialData?.variants && initialData.variants.length > 0
      ? "variable"
      : "simple"
  );
  const [description, setDescription] = useState(
    initialData?.description || null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: Date.now(), name: "", values: [] },
  ]);
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants || []
  );
  const [uploadedImages, setUploadedImages] = useState<SanityAsset[]>(
    initialData?.images || []
  );

  // --- All Handler Functions ---
  const handleAddAttribute = () =>
    setAttributes([...attributes, { id: Date.now(), name: "", values: [] }]);
  const handleRemoveAttribute = (id: number) =>
    setAttributes(attributes.filter((attr) => attr.id !== id));
  const handleAttributeNameChange = (id: number, newName: string) =>
    setAttributes(
      attributes.map((attr) =>
        attr.id === id ? { ...attr, name: newName } : attr
      )
    );
  const handleAttributeValueChange = (id: number, newValues: string[]) =>
    setAttributes(
      attributes.map((attr) =>
        attr.id === id ? { ...attr, values: newValues } : attr
      )
    );
  const handleGenerateVariants = () => {
    const validAttributes = attributes.filter(
      (attr) => attr.name && attr.values.length > 0
    );
    if (validAttributes.length === 0) {
      toast.error("Please define at least one attribute with values.");
      return;
    }
    const combinations = validAttributes.reduce(
      (acc, attr) =>
        acc.flatMap((d) =>
          attr.values.map((v) => [...d, { name: attr.name, value: v }])
        ),
      [[]] as { name: string; value: string }[][]
    );
    const newVariants: Variant[] = combinations.map((combo) => {
      const name = combo.map((c) => c.value).join(" / ");
      const existingVariant = variants.find((v) => v.name === name);
      return {
        _key: existingVariant?._key || `v_${Date.now()}_${Math.random()}`,
        name,
        sku: existingVariant?.sku || "",
        price: existingVariant?.price || 0,
        inStock: existingVariant?.inStock ?? true,
        attributes: combo,
      };
    });
    setVariants(newVariants);
    toast.success(`${newVariants.length} variants generated!`);
  };
  const handleVariantChange = (key: string, field: keyof Variant, value: any) =>
    setVariants(
      variants.map((v) => (v._key === key ? { ...v, [field]: value } : v))
    );
  const handleCategoryChange = (categoryId: string) => {
    if (typeof categoryId !== "string" || !categoryId) return;
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      return newSelection.filter((id) => id);
    });
  };

  // --- FINAL SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }
    if (productType === "variable" && variants.length === 0) {
      toast.error("Please generate variants for a variable product.");
      return;
    }

    setIsSubmitting(true);
    toast.loading(isEditMode ? "Updating product..." : "Saving product...");

    const formData = new FormData(e.currentTarget);

    const commonData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      brand: formData.get("brand"),
      description: description,
      categories: selectedCategories,
      isBestSeller: formData.get("isBestSeller") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      productType: productType,
      images: uploadedImages.map((img) => ({
        _type: "image",
        asset: { _type: "reference", _ref: img._ref },
      })),
    };

    let finalData;
    if (productType === "simple") {
      finalData = {
        ...commonData,
        price: Number(formData.get("price")),
        salePrice: Number(formData.get("salePrice")) || 0,
        inStock: formData.get("inStock") === "on",
        variants: [],
      };
    } else {
      finalData = {
        ...commonData,
        price: 0,
        salePrice: 0,
        inStock: variants.some((v) => v.inStock),
        variants: variants,
      };
    }

    try {
      let result;
      if (isEditMode) {
        result = await updateProduct(initialData!._id!, finalData);
      } else {
        result = await createProduct(finalData);
      }

      toast.dismiss();
      if (result?.success) {
        toast.success(result.message);
        router.push("/Bismillah786/products");
      } else {
        toast.error(result?.message || "An unknown error occurred.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected client-side error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white rounded-lg shadow-md border space-y-8"
    >
      {/* Section 1: Basic Info */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={initialData?.title}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={initialData?.slug}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* Section 2: Product Images Uploader */}
      <div className="border-t pt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <ImageUploader
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      </div>

      {/* Section 3: Description */}
      <div className="border-t pt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <TiptapEditor value={description} onChange={setDescription} />
      </div>

      {/* Section 4: Product Type Selector */}
      <div className="border-t pt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="simple"
              checked={productType === "simple"}
              onChange={() => setProductType("simple")}
              className="h-4 w-4 text-teal-600"
            />
            <span>Simple Product</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="variable"
              checked={productType === "variable"}
              onChange={() => setProductType("variable")}
              className="h-4 w-4 text-teal-600"
            />
            <span>Variable Product</span>
          </label>
        </div>
      </div>

      {/* Section 5: Conditional UI (Pricing or Variants) */}
      {productType === "simple" ? (
        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (Rs.)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              defaultValue={initialData?.price}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              step="0.01"
            />
          </div>
          <div>
            <label
              htmlFor="salePrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sale Price (Rs.)
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              defaultValue={initialData?.salePrice}
              className="w-full p-2 border border-gray-300 rounded-md"
              step="0.01"
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              defaultValue={initialData?.brand}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      ) : (
        <div className="border-t pt-8 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Product Attributes
            </h3>
            <p className="text-sm text-gray-500">
              Define attributes like Color, Size, etc. Press Enter to add a
              value.
            </p>
          </div>
          <div className="space-y-4">
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="p-4 border rounded-md bg-gray-50 flex items-start gap-4"
              >
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Attribute Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Color"
                      value={attr.name}
                      onChange={(e) =>
                        handleAttributeNameChange(attr.id, e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Values
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2 p-2 border rounded-md bg-white min-h-[42px]">
                      {attr.values.map((val) => (
                        <span
                          key={val}
                          className="flex items-center gap-1 bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full"
                        >
                          {val}
                          <button
                            type="button"
                            onClick={() =>
                              handleAttributeValueChange(
                                attr.id,
                                attr.values.filter((v) => v !== val)
                              )
                            }
                            className="text-teal-600 hover:text-teal-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value) {
                            e.preventDefault();
                            handleAttributeValueChange(attr.id, [
                              ...attr.values,
                              e.currentTarget.value,
                            ]);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="flex-grow outline-none bg-transparent"
                        placeholder="Add value and press Enter"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(attr.id)}
                  className="mt-7 p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddAttribute}
            className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-800"
          >
            <PlusCircle size={16} />
            Add another attribute
          </button>
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Generated Variants
            </h3>
            {variants.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg border text-center">
                <button
                  type="button"
                  onClick={handleGenerateVariants}
                  className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
                >
                  Generate Variants
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  (Click after defining all attributes)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left font-medium">Variant</th>
                        <th className="p-2 text-left font-medium">Price</th>
                        <th className="p-2 text-left font-medium">SKU</th>
                        <th className="p-2 text-left font-medium">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => (
                        <tr key={variant._key} className="border-b">
                          <td className="p-2 font-semibold text-gray-700">
                            {variant.name}
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant._key,
                                  "price",
                                  Number(e.target.value)
                                )
                              }
                              className="w-24 p-1 border rounded-md"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant._key,
                                  "sku",
                                  e.target.value
                                )
                              }
                              className="w-32 p-1 border rounded-md"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={variant.inStock}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant._key,
                                  "inStock",
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-teal-600 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateVariants}
                  className="text-sm font-medium text-teal-600 hover:text-teal-800"
                >
                  Re-generate Variants
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 6: Categories */}
      <div className="border-t pt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="p-4 border rounded-md max-h-60 overflow-y-auto">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category._id}>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  <span className="text-sm text-gray-800">{category.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 7: Toggles */}
      <div className="border-t pt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={initialData?.inStock ?? true}
            className="h-4 w-4 text-teal-600 rounded"
          />
          <span>In Stock</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="isBestSeller"
            defaultChecked={initialData?.isBestSeller}
            className="h-4 w-4 text-teal-600 rounded"
          />
          <span>Best Seller</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="isNewArrival"
            defaultChecked={initialData?.isNewArrival}
            className="h-4 w-4 text-teal-600 rounded"
          />
          <span>New Arrival</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initialData?.isFeatured}
            className="h-4 w-4 text-teal-600 rounded"
          />
          <span>Featured</span>
        </label>
      </div>

      {/* Section 8: Submit Button */}
      <div className="flex justify-end pt-8 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-400"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}
