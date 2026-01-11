// // /app/Bismillah786/products/_components/form-tabs/ProductVariantsForm.tsx

// "use client";

// import { Dispatch, SetStateAction } from 'react';
// import Image from 'next/image';
// import { useDropzone } from 'react-dropzone';
// import { toast } from 'react-hot-toast';
// import { X, PlusCircle, Trash2 } from 'lucide-react';
// import { urlFor } from '@/sanity/lib/image';
// import { client } from '@/sanity/lib/client';

// // Re-exporting types for clarity
// interface ImageAsset { _key: string; _type: "image"; asset: { _type: "reference"; _ref: string }; }
// export interface ProductVariant { _key: string; name: string; sku: string; price?: number; salePrice?: number; stock?: number; inStock: boolean; weight?: number; dimensions?: { _type?: "dimensions"; height?: number; width?: number; depth?: number; }; images: ImageAsset[]; attributes: { _key: string; name: string; value: string }[]; }

// const inputStyles = "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";

// // --- Props for this component ---
// interface ProductVariantsFormProps {
//   variants: ProductVariant[];
//   setVariants: Dispatch<SetStateAction<ProductVariant[]>>;
//   productTitle: string;
//   generateSku: (productTitle: string, variantName: string) => string;
//   createNewVariant: () => ProductVariant;
// }

// // --- Reusable Image Uploader ---
// const VariantImageUploader = ({ images, onImageUpload, onImageRemove }: { images: ImageAsset[]; onImageUpload: (files: File[]) => void; onImageRemove: (ref: string) => void; }) => {
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onImageUpload, accept: { 'image/*': [] } });
//   return (
//     <div>
//       <div {...getRootProps()} className={`mt-1 flex justify-center rounded-lg border border-dashed ${isDragActive ? 'border-brand-primary' : 'border-gray-300 dark:border-gray-600'} px-6 py-4 transition-colors cursor-pointer`}>
//         <div className="text-center"><p className="text-xs text-gray-500 dark:text-gray-400">Drop, paste, or click to upload</p></div>
//         <input {...getInputProps()} className="sr-only" />
//       </div>
//       {images.length > 0 && (
//         <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
//           {images.map((image) => (
//             <div key={image.asset._ref} className="relative aspect-square">
//               <Image src={urlFor(image).width(200).height(200).url()} alt="Variant" fill sizes="100px" className="rounded-md object-cover" />
//               <button type="button" onClick={() => onImageRemove(image.asset._ref)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md"><X size={12} /></button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function ProductVariantsForm({
//   variants,
//   setVariants,
//   productTitle,
//   generateSku,
//   createNewVariant,
// }: ProductVariantsFormProps) {

//   const handleAddVariant = () => setVariants((prev) => [...prev, { ...createNewVariant(), name: `Variant ${prev.length + 1}`, sku: generateSku(productTitle, `Variant ${prev.length + 1}`) }]);
//   const handleRemoveVariant = (key: string) => {
//     if (variants.length <= 1) return toast.error("A product must have at least one variant.");
//     setVariants(variants.filter((v) => v._key !== key));
//   };

//   const handleVariantChange = (key: string, field: string, value: any) => {
//     setVariants((prevVariants) =>
//       prevVariants.map((v) => {
//         if (v._key !== key) return v;
//         let updatedVariant = { ...v, [field]: value };
//         if (field === "name") updatedVariant.sku = generateSku(productTitle, value);
//         if (field === "stock") updatedVariant.inStock = Number(value) > 0;
//         if (field.startsWith("dimensions.")) {
//           const dimKey = field.split('.')[1] as keyof ProductVariant['dimensions'];
//           updatedVariant.dimensions = { ...updatedVariant.dimensions, _type: "dimensions", [dimKey]: value ? Number(value) : undefined };
//         }
//         return updatedVariant;
//       })
//     );
//   };

//   const handleVariantImageUpload = async (key: string, files: File[]) => {
//     toast.loading(`Uploading ${files.length} image(s)...`);
//     try {
//       const assets = await Promise.all(files.map((file) => client.assets.upload("image", file)));
//       const newImages = assets.map((asset) => ({ _key: `img_${Date.now()}_${Math.random()}`, _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } }));
//       setVariants((prev) => prev.map((v) => v._key === key ? { ...v, images: [...v.images, ...newImages] } : v));
//       toast.dismiss();
//       toast.success("Images uploaded!");
//     } catch (error) { toast.dismiss(); toast.error("Image upload failed."); }
//   };

//   const handleRemoveVariantImage = (key: string, ref: string) => setVariants((prev) => prev.map((v) => v._key === key ? { ...v, images: v.images.filter((img) => img.asset._ref !== ref) } : v));

//   return (
//     <div className="space-y-6">
//       {variants.map((variant, index) => (
//         <div key={variant._key} className="p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 relative">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-bold text-gray-800 dark:text-gray-200">Variant #{index + 1}</h3>
//             {variants.length > 1 && <button type="button" onClick={() => handleRemoveVariant(variant._key)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div><label className="text-xs">Name</label><input type="text" value={variant.name} onChange={(e) => handleVariantChange(variant._key, "name", e.target.value)} required className={inputStyles} /></div>
//             <div><label className="text-xs">SKU</label><input type="text" value={variant.sku} onChange={(e) => handleVariantChange(variant._key, "sku", e.target.value)} className={`${inputStyles} font-mono`} /></div>
//             <div><label className="text-xs">Price (PKR)</label><input type="number" value={variant.price} onChange={(e) => handleVariantChange(variant._key, "price", Number(e.target.value))} required className={inputStyles} /></div>
//             <div><label className="text-xs">Sale Price</label><input type="number" value={variant.salePrice} onChange={(e) => handleVariantChange(variant._key, "salePrice", Number(e.target.value))} className={inputStyles} /></div>
//             <div><label className="text-xs">Stock Qty</label><input type="number" value={variant.stock} onChange={(e) => handleVariantChange(variant._key, "stock", parseInt(e.target.value) || 0)} className={inputStyles} /></div>
//             <div><label className="text-xs">Weight (kg)</label><input type="number" step="0.1" value={variant.weight} onChange={(e) => handleVariantChange(variant._key, "weight", e.target.value)} className={inputStyles} /></div>
//           </div>
//           <div className="mt-4">
//             <label className="text-xs">Dimensions (cm)</label>
//             <div className="flex gap-2">
//               <input type="number" placeholder="H" value={variant.dimensions?.height} onChange={(e) => handleVariantChange(variant._key, "dimensions.height", e.target.value)} className={inputStyles} />
//               <input type="number" placeholder="W" value={variant.dimensions?.width} onChange={(e) => handleVariantChange(variant._key, "dimensions.width", e.target.value)} className={inputStyles} />
//               <input type="number" placeholder="D" value={variant.dimensions?.depth} onChange={(e) => handleVariantChange(variant._key, "dimensions.depth", e.target.value)} className={inputStyles} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <label className="text-xs">Images</label>
//             <VariantImageUploader images={variant.images} onImageUpload={(files) => handleVariantImageUpload(variant._key, files)} onImageRemove={(ref) => handleRemoveVariantImage(variant._key, ref)} />
//           </div>
//         </div>
//       ))}
//       <button type="button" onClick={handleAddVariant} className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline"><PlusCircle size={16} /> Add Another Variant</button>
//     </div>
//   );
// }

// /app/admin/products/_components/form-tabs/ProductVariantsForm.tsx

"use client";

import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import VariantCard from './VariantCard';
// --- BUG FIX IS HERE: Import the single source of truth for types ---
import { ProductVariant } from '@/sanity/types/product_types';

interface ProductVariantsFormProps {
  variants: ProductVariant[];
  setVariants: Dispatch<SetStateAction<ProductVariant[]>>;
  productTitle: string;
  generateSku: (productTitle: string, variantName: string) => string;
  createNewVariant: () => ProductVariant;
}

export default function ProductVariantsForm({
  variants,
  setVariants,
  productTitle,
  generateSku,
  createNewVariant,
}: ProductVariantsFormProps)  {
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        ...createNewVariant(),
        name: `Variant ${prev.length + 1}`,
        sku: generateSku(productTitle, `Variant ${prev.length + 1}`),
      },
    ]);
  };

  const handleRemoveVariant = (key: string) => {
    if (variants.length <= 1) {
      return toast.error("A product must have at least one variant.");
    }
    setVariants(variants.filter((v) => v._key !== key));
  };

  // --- BUG FIX IS HERE ---
  const handleVariantChange = (key: string, field: string, value: any) => {
    setVariants((prevVariants) =>
      prevVariants.map((v) => {
        if (v._key !== key) return v;

        const updatedVariant = { ...v };
        const isNumericField = [
          "price",
          "salePrice",
          "stock",
          "weight",
        ].includes(field);
        const isDimensionField = field.startsWith("dimensions.");

        if (isNumericField) {
          (updatedVariant as any)[field] =
            value === "" ? undefined : Number(value);
        } else if (isDimensionField) {
          const dimKey = field.split(".")[1] as "height" | "width" | "depth";
          updatedVariant.dimensions = {
            ...updatedVariant.dimensions,
            // Do NOT add _type here. Sanity handles it.
            [dimKey]: value === "" ? undefined : Number(value),
          };
        } else {
          (updatedVariant as any)[field] = value;
        }

        if (field === "name") {
          updatedVariant.sku = generateSku(productTitle, value);
        }
        if (field === "stock") {
          updatedVariant.inStock = Number(value) > 0;
        }

        return updatedVariant;
      })
    );
  };

  return (
    <div className="space-y-6">
      {variants.map((variant, index) => (
        <VariantCard
          key={variant._key}
          variant={variant}
          index={index}
          totalVariants={variants.length}
          onVariantChange={handleVariantChange}
          onRemoveVariant={handleRemoveVariant}
        />
      ))}
      <button
        type="button"
        onClick={handleAddVariant}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline"
      >
        <PlusCircle size={16} /> Add Another Variant
      </button>
    </div>
  );
}

// Re-export the one true type for the parent form
export { type ProductVariant };

// --- SUMMARY OF CHANGES (FOR ALL 3 FILES) ---
// - **Unified Types:** Eliminated all local, duplicate definitions of `ProductVariant` and `ImageAsset`.
// - **Single Source of Truth:** All three components (`VariantImageUploader`, `VariantCard`, `ProductVariantsForm`) now import `ProductVariant` and `SanityImageObject` directly from `/sanity/types/product_types.ts`.
// - **Error Resolution:** This cascading fix resolves all related TypeScript errors by ensuring that the data types are consistent from the parent form all the way down to the image uploader.
