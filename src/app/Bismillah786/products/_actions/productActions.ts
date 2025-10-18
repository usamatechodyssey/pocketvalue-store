// /app/admin/products/_actions/productActions.ts - FINAL COMPLETE & CORRECTED CODE

"use server";

import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/writeClient';
import { revalidatePath } from 'next/cache';
import groq from 'groq';


// Helper function (Ismein koi tabdeeli nahi)
function convertTiptapJsonToPortableText(tiptapJson: any) {
    if (!tiptapJson || !tiptapJson.content) return [];
    return tiptapJson.content.map((node: any, index: number) => {
        if (node.type === 'paragraph') {
            return {
                _type: 'block',
                style: 'normal',
                _key: `desc_${Date.now()}_${index}`,
                children: node.content ? node.content.map((child: any, childIndex: number) => ({
                    _type: 'span',
                    text: child.text || '',
                    _key: `span_${Date.now()}_${index}_${childIndex}`,
                    marks: child.marks ? child.marks.map((mark: any) => mark.type) : [],
                })) : [],
            };
        }
        return null;
    }).filter(Boolean);
}

// === ACTION #1: GET ALL PRODUCTS (UPDATED QUERY) ===
export async function getAllAdminProducts(searchTerm: string = '') {
    try {
        const productFieldsForAdminList = groq`
          _id, title, "slug": slug.current,
          "price": variants[0].price,
          "inStock": variants[0].inStock,
          "mainImage": variants[0].images[0],
          "variantsCount": count(variants),
          brand->{name},
          "variants": variants[]{ _key, name, sku, price, inStock }
        `;
        
        const params: { [key: string]: any } = {};
        let filter = '*[_type == "product"';
        
        if (searchTerm) {
            filter += ` && (
                title match $wildcardSearchTerm || 
                _id == $exactSearchTerm ||
                variants[].sku match $wildcardSearchTerm
            )`;
            params.wildcardSearchTerm = `*${searchTerm}*`; 
            params.exactSearchTerm = searchTerm;
        }
        
        const query = groq`${filter}] | order(_createdAt desc) { ${productFieldsForAdminList} }`;
        return await client.fetch(query, params);
    } catch (error) {
        console.error("Failed to fetch admin products:", error);
        return [];
    }
}

// === ACTION #2: GET ALL CATEGORIES (No Change) ===
export async function getAllCategoriesForForm() {
    try {
        const query = groq`*[_type == "category"] | order(name asc) { _id, name }`;
        return await client.fetch(query);
    } catch (error) {
        console.error("Failed to fetch categories for form:", error);
        return [];
    }
}

// === ACTION #3: GET SINGLE PRODUCT FOR EDIT (UPDATED QUERY) ===
export async function getSingleProductForEdit(slug: string) {
    try {
        const query = groq`
            *[_type == "product" && slug.current == $slug][0] {
                _id, title, "slug": slug.current, description, "brand": brand->_ref,
                isBestSeller, isNewArrival, isFeatured, rating,
                "categoryIds": coalesce(categories[]->_ref, []), 
                variants,
                "allImageAssets": variants[].images[].asset
            }
        `;
        return await client.fetch(query, { slug });
    } catch (error) {
        console.error("Failed to fetch single product for edit:", error);
        return null;
    }
}

// === ACTION #4: CREATE A NEW PRODUCT (SIMPLIFIED & UNIFIED LOGIC) ===
export async function createProduct(productData: any) {
  try {
    const portableTextDescription = convertTiptapJsonToPortableText(productData.description);
    
    const newProduct: any = {
      _type: 'product',
      title: productData.title,
      slug: { _type: 'slug', current: productData.slug },
      description: portableTextDescription,
      brand: productData.brand ? { _type: 'reference', _ref: productData.brand } : undefined,
      isBestSeller: productData.isBestSeller,
      isNewArrival: productData.isNewArrival,
      isFeatured: productData.isFeatured,
      rating: productData.rating,
      categories: productData.categories.map((catId: string) => ({ _key: `cat_${Date.now()}_${Math.random()}`, _type: 'reference', _ref: catId })),
      variants: productData.variants,
    };

    await writeClient.create(newProduct);
    revalidatePath('/Bismillah786/products');
    return { success: true, message: 'Product created successfully!' };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    const message = error.message.includes('slug') ? 'This slug is already in use.' : 'Failed to create product.';
    return { success: false, message };
  }
}

// === ACTION #5: UPDATE AN EXISTING PRODUCT (SIMPLIFIED & UNIFIED LOGIC) ===
export async function updateProduct(productId: string, productData: any) {
  try {
    const portableTextDescription = convertTiptapJsonToPortableText(productData.description);
    const patch = writeClient.patch(productId);

    patch.set({
      title: productData.title,
      'slug.current': productData.slug,
      description: portableTextDescription,
      brand: productData.brand ? { _type: 'reference', _ref: productData.brand } : undefined,
      isBestSeller: productData.isBestSeller,
      isNewArrival: productData.isNewArrival,
      isFeatured: productData.isFeatured,
      rating: productData.rating,
      categories: (productData.categories || []).filter(Boolean).map((catId: string) => ({_key: `cat_${Date.now()}_${Math.random()}`,_type: 'reference',_ref: catId})),
      variants: productData.variants,
    });

    patch.unset(['price', 'salePrice', 'inStock', 'images']);

    await patch.commit();
    revalidatePath('/Bismillah786/products');
    revalidatePath(`/Bismillah786/products/${productData.slug}/edit`);
    return { success: true, message: 'Product updated successfully!' };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    const message = error.response?.body?.error?.description || 'Failed to update product.';
    return { success: false, message };
  }
}

// === ACTION #6: DELETE A PRODUCT (No Change) ===
export async function deleteProduct(productId: string) {
    try {
        await writeClient.delete(productId);
        revalidatePath('/Bismillah786/products');
        return { success: true, message: 'Product deleted successfully!' };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, message: 'Failed to delete product.' };
    }
}

// =================================================================
// === ACTION #7: BATCH CREATE FROM CSV (THE NEW, UPGRADED ENGINE) ===
// =================================================================
export async function batchCreateProductsFromGroups(productGroups: any[][]) {
  let successfulCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  // Fetch all categories and brands once to avoid repeated calls inside the loop
  const allCategories = await client.fetch(groq`*[_type == "category"]{_id, "slug": slug.current, name}`);
  const allBrands = await client.fetch(groq`*[_type == "brand"]{_id, name}`);
  
  for (const group of productGroups) {
    if (group.length < 2) {
      failedCount++;
      errors.push(`Invalid product group found with ${group.length} rows. Each product needs at least one parent and one variant row.`);
      continue;
    }

    const parentData = group[0];
    const variantRows = group.slice(1);
    const title = parentData.title;

    try {
      if (!title || !parentData.slug) {
        throw new Error("Parent row is missing 'title' or 'slug'.");
      }

      const transaction = writeClient.transaction();
      
      const specifications = (parentData.specifications || '').split('|').map((spec: string) => {
        const parts = spec.split(':');
        return parts.length === 2 ? { _key: `spec_${Date.now()}_${Math.random()}`, label: parts[0].trim(), value: parts[1].trim() } : null;
      }).filter(Boolean);

      const description = parentData.description ? [{ _key: `desc_${Date.now()}`, _type: 'block', style: 'normal', children: [{ _key: `span_${Date.now()}`, _type: 'span', text: parentData.description.trim() }] }] : [];

      const newProduct: any = {
        _type: 'product',
        title: title,
        slug: { _type: 'slug', current: parentData.slug },
        videoUrl: parentData.videoUrl || undefined,
        description: description,
        specifications: specifications,
        // === FIX YAHAN ADD HUA HAI ===
        shippingAndReturns: parentData.shippingAndReturns || undefined,
        // ============================
        isBestSeller: String(parentData.isBestSeller).toLowerCase() === 'true',
        isNewArrival: String(parentData.isNewArrival).toLowerCase() === 'true',
        isFeatured: String(parentData.isFeatured).toLowerCase() === 'true',
        isOnDeal: String(parentData.isOnDeal).toLowerCase() === 'true',
        rating: parentData.rating ? Number(parentData.rating) : undefined,
      };

      const brandRef = parentData.brand ? allBrands.find((b: any) => b.name.toLowerCase() === parentData.brand.trim().toLowerCase()) : null;
      if (brandRef) {
        newProduct.brand = { _type: 'reference', _ref: brandRef._id };
      }
      
      newProduct.categories = (parentData.categories || '').split(',').map((catIdentifier: string) => {
        const found = allCategories.find((c: any) => c.slug === catIdentifier.trim().toLowerCase() || c.name.toLowerCase() === catIdentifier.trim().toLowerCase());
        return found ? { _key: `cat_${Date.now()}_${Math.random()}`, _type: 'reference', _ref: found._id } : null;
      }).filter(Boolean);

      // --- Prepare Variant Data ---
      newProduct.variants = await Promise.all(variantRows.map(async (v: any) => {
          const variantImageUrls = (v.variant_images || '').split(',').map((url: string) => url.trim()).filter(Boolean);
          const variantImageAssets = await Promise.all(variantImageUrls.map(async (url: string) => {
              try {
                const imageResponse = await fetch(url);
                if (!imageResponse.ok) throw new Error(`Failed to download image: ${url}`);
                const asset = await writeClient.assets.upload('image', imageResponse.body as any, { filename: v.variant_sku || 'variant-img' });
                return { _key: `vimg_${Date.now()}_${Math.random()}`, _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
              } catch (imgError) {
                  console.error(`Skipping image ${url} for product ${title} due to error:`, imgError);
                  return null;
              }
          })).then(results => results.filter(Boolean));

          const attributes = [];
          if (v.attribute1_name && v.attribute1_value) attributes.push({ _key: `attr1_${Date.now()}${Math.random()}`, name: v.attribute1_name, value: v.attribute1_value });
          if (v.attribute2_name && v.attribute2_value) attributes.push({ _key: `attr2_${Date.now()}${Math.random()}`, name: v.attribute2_name, value: v.attribute2_value });
          if (v.attribute3_name && v.attribute3_value) attributes.push({ _key: `attr3_${Date.now()}${Math.random()}`, name: v.attribute3_name, value: v.attribute3_value });
          
          return {
              _key: `v_${Date.now()}_${Math.random()}`,
              name: v.variant_name,
              price: Number(v.variant_price),
              salePrice: v.variant_salePrice ? Number(v.variant_salePrice) : undefined,
              sku: v.variant_sku,
              stock: v.variant_stock ? parseInt(v.variant_stock, 10) : undefined,
              inStock: String(v.variant_inStock).toLowerCase() === 'true',
              images: variantImageAssets,
              attributes: attributes,
              weight: v.variant_weight ? Number(v.variant_weight) : undefined,
              dimensions: (v.variant_height && v.variant_width && v.variant_depth) ? {
                  _type: 'dimensions',
                  height: Number(v.variant_height),
                  width: Number(v.variant_width),
                  depth: Number(v.variant_depth),
              } : undefined,
          };
      }));
      
      transaction.create(newProduct);
      await transaction.commit({ returnDocuments: false });
      successfulCount++;

    } catch (error: any) {
      failedCount++;
      errors.push(`Product "${title || 'Unknown'}": ${error.message}`);
      console.error(`Failed to process product: ${title}`, error);
    }
  }
  
  if (successfulCount > 0) {
    revalidatePath('/Bismillah786/products');
    revalidatePath('/');
  }

  return {
    success: failedCount === 0,
    message: `Processed: ${productGroups.length}, Successful: ${successfulCount}, Failed: ${failedCount}`,
    errors,
  };
}
