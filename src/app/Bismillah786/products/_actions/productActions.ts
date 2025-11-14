// /app/Bismillah786/products/_actions/productActions.ts (ABSOLUTE FINAL & FUTURE-PROOF)

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/auth";
import { client, writeClient } from "@/sanity/lib/client";
import {
  GET_PAGINATED_ADMIN_PRODUCTS_QUERY,
  GET_TOTAL_ADMIN_PRODUCTS_COUNT_QUERY,
  GET_FORM_DATA_QUERY,
  GET_SINGLE_PRODUCT_FOR_EDIT_QUERY,
} from "@/sanity/lib/queries";
import { z } from "zod";
import { ProductPayloadSchema, DeleteProductSchema, ProductGroupSchema } from "@/app/lib/zodSchemas";
import { VariantAttribute } from "@/sanity/types/product_types";

type ProductPayload = z.infer<typeof ProductPayloadSchema>;

// --- Helper Functions ---

async function verifyAdmin(allowedRoles: string[]): Promise<string> {
    const session = await auth();
    const userRole = session?.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
        throw new Error("Permission Denied.");
    }
    return userRole;
}

function convertTiptapJsonToPortableText(tiptapJson: any) {
    if (!tiptapJson || !tiptapJson.content) return [];
    
    const convertNode = (node: any, index: number): any => {
        const key = `node_${Date.now()}_${index}_${Math.random()}`;
        
        switch (node.type) {
            case 'paragraph':
                return { _type: 'block', style: 'normal', _key: key, children: node.content ? node.content.map((child: any, childIndex: number) => ({ _type: 'span', text: child.text || '', _key: `${key}_span_${childIndex}`, marks: child.marks ? child.marks.map((mark: any) => mark.type) : [] })) : [] };
            case 'heading':
                return { _type: 'block', style: `h${node.attrs.level}`, _key: key, children: node.content ? node.content.map((child: any, childIndex: number) => ({ _type: 'span', text: child.text || '', _key: `${key}_span_${childIndex}` })) : [] };
            case 'bulletList':
                return { _type: 'block', _key: key, listItem: 'bullet', level: 1, children: node.content ? node.content.flatMap((listItem: any, liIndex: number) => convertNode(listItem, liIndex)?.children || []) : [] };
            case 'orderedList':
                 return { _type: 'block', _key: key, listItem: 'number', level: 1, children: node.content ? node.content.flatMap((listItem: any, liIndex: number) => convertNode(listItem, liIndex)?.children || []) : [] };
            case 'listItem':
                return { _type: 'block', style: 'normal', _key: key, children: node.content ? node.content.flatMap((pNode:any, pIndex:number) => convertNode(pNode, pIndex)?.children || []) : [] };
            default:
                return null;
        }
    }
    return tiptapJson.content.map(convertNode).filter(Boolean);
}

function parseAttributesString(attrString?: string): VariantAttribute[] {
    if (!attrString || typeof attrString !== 'string') return [];
    return attrString.split(',')
        .map(pair => {
            const parts = pair.split(':');
            if (parts.length !== 2) return null;
            const name = parts[0].trim();
            const value = parts[1].trim();
            if (!name || !value) return null;
            return { _key: `attr_${Date.now()}_${Math.random()}`, name, value };
        })
        .filter((item): item is VariantAttribute => item !== null);
}


// === ACTION #1: GET PAGINATED ADMIN PRODUCTS (REFACTORED) ===
export async function getPaginatedAdminProducts({ page = 1, limit = 15, searchTerm = '' }) {
    try {
        const start = (page - 1) * limit;
        const end = start + limit;
        
        const params = { 
            searchTerm: searchTerm ? `*${searchTerm.trim()}*` : '*',
            exactSearchTerm: searchTerm.trim(),
            start, 
            end 
        };

        // For the count query, if there's no search term, we match all products.
        const countParams = {
            searchTerm: params.searchTerm,
            exactSearchTerm: params.exactSearchTerm
        };
        
        const [products, totalCount] = await Promise.all([
            client.fetch(GET_PAGINATED_ADMIN_PRODUCTS_QUERY, params),
            client.fetch(GET_TOTAL_ADMIN_PRODUCTS_COUNT_QUERY, countParams)
        ]);

        return {
            products,
            totalPages: Math.ceil(totalCount / limit)
        };
    } catch (error) {
        console.error("Failed to fetch paginated admin products:", error);
        return { products: [], totalPages: 0 };
    }
}

// === ACTION #2: GET FORM DATA (REFACTORED) ===
export async function getFormData() {
    try {
        return await client.fetch(GET_FORM_DATA_QUERY);
    } catch (error) {
        console.error("Failed to fetch form data (categories/brands):", error);
        return { categories: [], brands: [] };
    }
}

// === ACTION #3: GET SINGLE PRODUCT FOR EDIT (REFACTORED) ===
export async function getSingleProductForEdit(slug: string) {
    try {
        return await client.fetch(GET_SINGLE_PRODUCT_FOR_EDIT_QUERY, { slug });
    } catch (error) {
        console.error(`Failed to fetch product with slug "${slug}":`, error);
        return null;
    }
}

// === ACTION #4: CREATE A NEW PRODUCT (Refactored with Zod) ===
export async function createProduct(productData: ProductPayload) {
  const validation = ProductPayloadSchema.safeParse(productData);
  if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
  }
  const data = validation.data;

  try {
    await verifyAdmin(['Super Admin', 'Content Editor']);
    const portableTextDescription = convertTiptapJsonToPortableText(data.description);
    
    const newProduct = {
      _type: 'product',
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      videoUrl: data.videoUrl || undefined,
      description: portableTextDescription,
      brand: data.brandId ? { _type: 'reference', _ref: data.brandId } : undefined,
      isBestSeller: data.isBestSeller,
      isNewArrival: data.isNewArrival,
      isFeatured: data.isFeatured,
      isOnDeal: data.isOnDeal,
      rating: data.rating,
      categories: (data.categoryIds || []).map((catId: string) => ({ _key: `cat_${Date.now()}_${Math.random()}`, _type: 'reference', _ref: catId })),
      variants: data.variants,
    };

    await writeClient.create(newProduct);

    revalidatePath('/Bismillah786/products');
    revalidatePath('/');
    return { success: true, message: 'Product created successfully!' };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    const message = error.message?.includes('slug') 
      ? 'This slug is already in use. Please choose a different one.' 
      : 'An unexpected error occurred.';
    return { success: false, message };
  }
}

// === ACTION #5: UPDATE AN EXISTING PRODUCT (Refactored with Zod) ===
export async function updateProduct(productId: string, productData: ProductPayload) {
  const validation = ProductPayloadSchema.safeParse(productData);
  if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
  }
  const data = validation.data;

  try {
    await verifyAdmin(['Super Admin', 'Content Editor']);
    const portableTextDescription = convertTiptapJsonToPortableText(data.description);
    
    const patch = writeClient.patch(productId).set({
      title: data.title, 'slug.current': data.slug, videoUrl: data.videoUrl || undefined,
      description: portableTextDescription,
      brand: data.brandId ? { _type: 'reference', _ref: data.brandId } : undefined,
      isBestSeller: data.isBestSeller, isNewArrival: data.isNewArrival, isFeatured: data.isFeatured, isOnDeal: data.isOnDeal,
      rating: data.rating,
      categories: [], 
    }).unset(['categories']).set({
      categories: (data.categoryIds || []).map((catId: string) => ({_key: `cat_${Date.now()}_${Math.random()}`,_type: 'reference',_ref: catId})),
      variants: data.variants,
    });

    await patch.commit({ autoGenerateArrayKeys: true });

    revalidatePath('/Bismillah786/products');
    revalidatePath(`/product/${data.slug}`);
    revalidatePath('/');
    return { success: true, message: 'Product updated successfully!' };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    const message = (error as any).response?.body?.error?.description || 'Failed to update product. Please check your inputs.';
    return { success: false, message };
  }
}

// === ACTION #6: DELETE A PRODUCT (Refactored with Zod) ===
export async function deleteProduct(productId: string) {
    const validation = DeleteProductSchema.safeParse({ productId });
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message };
    }
    const { productId: validatedId } = validation.data;

    try {
        await verifyAdmin(['Super Admin']);
        await writeClient.delete(validatedId);
        revalidatePath('/Bismillah786/products');
        revalidatePath('/');
        return { success: true, message: 'Product deleted successfully!' };
    } catch (error: any) {
        console.error("Failed to delete product:", error);
        return { success: false, message: error.message || 'Failed to delete product.' };
    }
}

// === ACTION #7: BATCH CREATE FROM CSV (FULLY REFACTORED & FUTURE-PROOF) ===
export async function batchCreateProductsFromGroups(productGroups: unknown[][]) {
    await verifyAdmin(['Super Admin', 'Content Editor']);
    
    let successfulCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    const allCategories = await client.fetch(`*[_type == "category"]{_id, "slug": slug.current, name}`);
    const allBrands = await client.fetch(`*[_type == "brand"]{_id, name}`);
  
    for (const group of productGroups) {
        const groupValidation = ProductGroupSchema.safeParse(group);
        if (!groupValidation.success) {
          failedCount++;
          const groupIdentifier = (group[0] as any)?.title || `Group at row ${(group[0] as any)?.originalIndex || 'N/A'}`;
          errors.push(`Product "${groupIdentifier}": ${groupValidation.error.issues[0].message}`);
          continue;
        }

        // We know from the .refine() that the first item is a parent and the rest are variants.
        const [parentData, ...variantRows] = groupValidation.data;
        const title = parentData.title!;

        try {
            const description = parentData.description ? convertTiptapJsonToPortableText({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: parentData.description }] }] }) : [];

            const newProduct: any = {
                _type: 'product',
                title: title,
                slug: { _type: 'slug', current: parentData.slug! },
                videoUrl: parentData.videoUrl,
                description: description,
                isBestSeller: parentData.isBestSeller,
                isNewArrival: parentData.isNewArrival,
                isFeatured: parentData.isFeatured,
                isOnDeal: parentData.isOnDeal,
                rating: parentData.rating,
            };

            if (parentData.brand) {
                const brandRef = allBrands.find((b: any) => b.name.toLowerCase() === parentData.brand!.trim().toLowerCase());
                if (brandRef) newProduct.brand = { _type: 'reference', _ref: brandRef._id };
            }
      
            newProduct.categories = (parentData.categories || '').split(',').map((catId: string) => {
                const found = allCategories.find((c: any) => c.slug === catId.trim() || c.name.toLowerCase() === catId.trim().toLowerCase());
                return found ? { _key: `cat_${Date.now()}_${Math.random()}`, _type: 'reference', _ref: found._id } : null;
            }).filter(Boolean);

            newProduct.variants = await Promise.all(variantRows.map(async (v) => {
                // This is a type guard to ensure `v` is a variant row.
                if ('variant_name' in v) {
                    const variantImageUrls = (v.variant_images || '').split(',').map((url: string) => url.trim()).filter(Boolean);
                    const variantImageAssets = await Promise.all(variantImageUrls.map(async (url: string) => {
                        try {
                            const imageResponse = await fetch(url);
                            if (!imageResponse.ok) throw new Error(`Failed to download image: ${url}`);
                            const asset = await writeClient.assets.upload('image', imageResponse.body as any, { filename: v.variant_sku || 'variant-img' });
                            return { _key: `vimg_${Date.now()}_${Math.random()}`, _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
                        } catch (imgError: any) {
                            errors.push(`Product "${title}": Skipped image ${url} due to error: ${imgError.message}`);
                            return null;
                        }
                    })).then(results => results.filter(Boolean));
                
                    return {
                        _key: `v_${Date.now()}_${Math.random()}`,
                        name: v.variant_name,
                        price: v.variant_price,
                        salePrice: v.variant_salePrice,
                        sku: v.variant_sku,
                        stock: v.variant_stock,
                        inStock: v.variant_inStock,
                        images: variantImageAssets,
                        weight: v.variant_weight,
                        dimensions: (v.variant_height && v.variant_width && v.variant_depth) ? {
                            _type: 'dimensions', height: v.variant_height, width: v.variant_width, depth: v.variant_depth,
                        } : undefined,
                        attributes: parseAttributesString(v.variant_attributes),
                    };
                }
                return null;
            })).then(results => results.filter(Boolean));
          
            await writeClient.create(newProduct);
            successfulCount++;
        } catch (error: any) {
            failedCount++;
            errors.push(`Product "${title}": ${error.message}`);
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