"use server";

import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/writeClient';
import { revalidatePath } from 'next/cache';
import groq from 'groq';

// --- TYPE DEFINITION (NO CHANGE) ---
export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  parent?: { _id: string; name: string };
  subCategoryCount: number;
}

// === ACTION #1: GET ALL CATEGORIES (NO CHANGE) ===
export async function getAllCategories(): Promise<Category[]> {
  try {
    const query = groq`
      *[_type == "category"] | order(name asc) {
        _id,
        name,
        slug,
        "parent": parent->{ _id, name },
        "subCategoryCount": count(*[_type == "category" && parent._ref == ^._id])
      }
    `;
    return await client.fetch(query);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// === ACTION #2: CREATE/UPDATE A CATEGORY (NO CHANGE) ===
export async function upsertCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const parentId = formData.get('parentId') as string | null;

    const data: any = {
      _type: 'category',
      name,
      slug: { _type: 'slug', current: slug },
    };
    
    if (id) {
      const patch = writeClient.patch(id).set(data);
      if (parentId) {
        patch.set({ parent: { _type: 'reference', _ref: parentId } });
      } else {
        patch.unset(['parent']);
      }
      await patch.commit();
    } else {
      if(parentId) {
        data.parent = { _type: 'reference', _ref: parentId };
      }
      await writeClient.create(data);
    }

    revalidatePath('/Bismillah786/categories');
    return { success: true, message: `Category ${id ? 'updated' : 'created'} successfully!` };
  } catch (error) {
    console.error("Failed to upsert category:", error);
    return { success: false, message: 'Operation failed.' };
  }
}

// === ACTION #3: DELETE A CATEGORY (NO CHANGE) ===
export async function deleteCategory(categoryId: string) {
  try {
    const subCategoryCountQuery = groq`count(*[_type == "category" && parent._ref == $categoryId])`;
    const subCategoryCount = await client.fetch(subCategoryCountQuery, { categoryId });
    if (subCategoryCount > 0) return { success: false, message: 'Cannot delete. This category has sub-categories.' };

    await writeClient.delete(categoryId);
    revalidatePath('/Bismillah786/categories');
    return { success: true, message: 'Category deleted successfully!' };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, message: 'Deletion failed.' };
  }
}

// === ACTION #4: BATCH CREATE CATEGORIES (UPGRADED WITH IMAGE UPLOAD) ===
export async function batchCreateCategories(categories: { name: string, slug: string, parent_slug: string, image_url: string }[]) {
  let successfulCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  const transaction = writeClient.transaction();

  // PASS 1: Saari categories ko aek-aek karke banayein aur image upload karein
  for (const cat of categories) {
    try {
      let imageAssetRef = null;

      // Agar image_url maujood hai to usay process karein
      if (cat.image_url && cat.image_url.startsWith('http')) {
        const imageResponse = await fetch(cat.image_url);
        if (!imageResponse.ok) throw new Error(`Failed to download image from ${cat.image_url}`);
        const imageBuffer = await imageResponse.arrayBuffer();
        const asset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), { filename: cat.slug || 'category-image' });
        imageAssetRef = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        };
      }

      // Nayi category ka data tayyar karein
      const newCategory = {
        _id: cat.slug, // Hum slug ko document ID ke taur par istemal kar rahe hain taake linking asaan ho
        _type: 'category',
        name: cat.name,
        slug: { _type: 'slug', current: cat.slug },
        image: imageAssetRef || undefined, // Agar image hai to link karein, warna undefined
      };

      transaction.createIfNotExists(newCategory);

    } catch (error: any) {
      failedCount++;
      errors.push(`Category "${cat.name}": ${error.message}`);
    }
  }
  
  try {
    await transaction.commit({ autoGenerateArrayKeys: true });
  } catch (error: any) {
    return { success: false, message: `Initial category creation failed: ${error.message}`, errors };
  }

  // PASS 2: Ab parent relationships set karein
  const patchTransaction = writeClient.transaction();
  const allCreatedCategories = await client.fetch(groq`*[_type == "category"]{_id, "slug": slug.current}`);
  
  for (const cat of categories) {
    if (cat.parent_slug) {
      const child = allCreatedCategories.find((c: any) => c.slug === cat.slug);
      const parent = allCreatedCategories.find((p: any) => p.slug === cat.parent_slug);

      if (child && parent) {
        patchTransaction.patch(child._id, {
          set: { parent: { _type: 'reference', _ref: parent._id } }
        });
      } else {
        // Yeh error ab sirf tab aayega agar parent slug ghalat ho
        if (!errors.some(e => e.includes(cat.name))) {
          failedCount++;
          errors.push(`Could not link "${cat.name}" to parent "${cat.parent_slug}". Parent slug might be missing or incorrect.`);
        }
      }
    }
  }

  try {
    await patchTransaction.commit({ autoGenerateArrayKeys: true });
    successfulCount = categories.length - failedCount;
  } catch (error: any) {
    return { success: false, message: 'Setting parent relationships failed.', errors: [...errors, error.message] };
  }

  if (successfulCount > 0) {
    revalidatePath('/Bismillah786/categories');
    revalidatePath('/'); // Homepage/navigation ko bhi update karein
  }

  return {
    success: failedCount === 0,
    message: `Processed: ${categories.length}, Successful: ${successfulCount}, Failed: ${failedCount}`,
    errors,
  };
}