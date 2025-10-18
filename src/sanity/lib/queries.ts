// src/sanity/lib/queries.ts
import SanityProduct from '../types/product_types';
import { client } from './client'
import groq from 'groq'



// === Product Fields Fragment (No Changes) ===
const productFields = groq`
  _id,
  title,
  _createdAt,
  "slug": slug.current,
  videoUrl,
  isBestSeller,
  isNewArrival,
   isOnDeal, // Naya field yahan add hua
  isFeatured,
  brand->{ _id, name, "slug": slug.current, logo },
  description,
  specifications,
  shippingAndReturns,
  "categoryIds": categories[]->_id,
  "variants": variants[]{
    _key, name, sku, price, salePrice, stock, inStock, images, weight, dimensions,
    attributes[]{ _key, name, value }
  },
  "defaultVariant": variants[0], 
  "rating": coalesce(math::avg(*[_type == "review" && product._ref == ^._id && isApproved == true].rating), rating, 0),
  "reviewCount": count(*[_type == "review" && product._ref == ^._id && isApproved == true])
`;


// === FINAL, GUARANTEED WORKING "SUPER QUERY" FOR CATEGORY PLP ===
export const GET_CATEGORY_PLP_DATA = groq`
  *[_type == "category" && slug.current == $slug][0] {
    "currentCategory": { 
      _id, name, "slug": slug.current, desktopBanner, mobileBanner, description 
    },
    "grandparentRef": parent->parent._ref,
    "parentTree": parent->{
      _id, name, "slug": slug.current,
      "subCategories": *[_type=="category" && parent._ref == ^._id] | order(name asc) {
        _id, name, "slug": slug.current
      }
    },
    "selfTree": {
      _id, name, "slug": slug.current,
      "subCategories": *[_type=="category" && parent._ref == ^._id] | order(name asc) {
        _id, name, "slug": slug.current
      }
    },
    
    // --- PRODUCTS & FILTERS (PAGINATION YAHAN ADD HUI HAI) ---
    "initialProducts": *[
      _type == "product" && (
        $slug in categories[]->slug.current ||
        $slug in categories[]->parent->slug.current ||
        $slug in categories[]->parent->parent->slug.current
      )
    ] | order(_createdAt desc) [0...12] { // <-- FIX: Sirf pehle 12 products
      ${productFields}
    },

    // Naya: Total count bhi shuru mein hi le lein
    "totalCount": count(*[
      _type == "product" && (
        $slug in categories[]->slug.current ||
        $slug in categories[]->parent->slug.current ||
        $slug in categories[]->parent->parent->slug.current
      )
    ]),

    "filterData": {
      "brands": array::unique(*[
        _type == "product" && (
          $slug in categories[]->slug.current ||
          $slug in categories[]->parent->slug.current ||
          $slug in categories[]->parent->parent->slug.current
        )
      ].brand->{
        _id, name, "slug": slug.current
      }),
      "attributes": *[
        _type == "product" && (
          $slug in categories[]->slug.current ||
          $slug in categories[]->parent->slug.current ||
          $slug in categories[]->parent->parent->slug.current
        )
      ].variants[].attributes[]{
        name,
        value
      },
      "priceRange": {
        "min": math::min(*[
          _type == "product" && (
            $slug in categories[]->slug.current ||
            $slug in categories[]->parent->slug.current ||
            $slug in categories[]->parent->parent->slug.current
          )
        ].variants[].price),
        "max": math::max(*[
          _type == "product" && (
            $slug in categories[]->slug.current ||
            $slug in categories[]->parent->slug.current ||
            $slug in categories[]->parent->parent->slug.current
          )
        ].variants[].price)
      }
    }
  }
`;



// === NAYI "SUPER QUERY" FOR SEARCH PLP ===
export const GET_SEARCH_PLP_DATA = async (searchTerm: string) => {
    const trimmed = searchTerm?.trim();
    if (!trimmed) return { initialProducts: [], filterData: null, categoryTree: null };

    const query = groq`{
      "productIds": *[_type == "product" && (title match $term || brand->name match $term || categories[]->name match $term)]._id,
      "filterData": {
        "brands": array::unique(*[_type == "product" && (title match $term)].brand->{
           _id, name, "slug": slug.current
        }),
        "attributes": *[_type == "product" && (title match $term)].variants[].attributes[]{
          name, value
        },
        "priceRange": {
          "min": math::min(*[_type == "product" && (title match $term)].variants[].price),
          "max": math::max(*[_type == "product" && (title match $term)].variants[].price)
        }
      }
    }`;
    const { productIds, filterData } = await client.fetch(query, { term: `*${trimmed}*` });
    
    const initialProducts = await getProductsByIds(productIds);
    // Search page ke liye categoryTree null rahega
    return { initialProducts, filterData, categoryTree: null }; 
}

// Helper function to fetch products by IDs
export const getProductsByIds = async (productIds: string[]) => {
  if (!productIds || productIds.length === 0) return [];
  const query = groq`*[_type == "product" && _id in $productIds] { ${productFields} }`;
  return await client.fetch(query, { productIds });
}

// --- AAPKE TAMAM PURANE, BEHTAREEN FUNCTIONS WESE HI RAHENGE ---
// Hum inhein bilkul nahi chherenge taake aapki baaqi site chalti rahe.

export const getAllProducts = async () => {
  const query = groq`*[_type == "product"]{ ${productFields} }`
  return await client.fetch(query)
}



export const getTopBrands = async () => {
  const query = groq`*[_type == "brand"][0...8]{
    _id,
    name,
    "slug": slug.current,
    logo
  }`;
  return await client.fetch(query);
};

// === WISHLIST KE LIYE NAYI, POWERFUL QUERY ===
// Yeh query na sirf rating, balke live price aur stock bhi layegi
export const getLiveProductDataForCards = async (productIds: string[]): Promise<SanityProduct[]> => {
    if (!productIds || productIds.length === 0) {
        return [];
    }
    const query = groq`
      *[_type == "product" && _id in $productIds] {
        _id,
        title,
        "slug": slug.current,
        // Nayi, calculated rating
        "rating": coalesce(math::avg(*[_type == "review" && product._ref == ^._id && isApproved == true].rating), rating, 0),
        "reviewCount": count(*[_type == "review" && product._ref == ^._id && isApproved == true]),
        // Live variant data
        "defaultVariant": variants[0]{
          _key, name, price, salePrice, inStock, images
        }
      }
    `;
    return await client.fetch(query, { productIds });
};


export async function getSingleProduct(slug: string) {
  const query = groq`*[_type == "product" && slug.current == $slug][0] { 
    ${productFields},
    "categories": categories[]->{ _id, name, "slug": slug.current },
    // Reviews hamesha is query mein alag se, order ke saath fetch honge
    "reviews": *[_type == "review" && product._ref == ^._id && isApproved == true] | order(_createdAt desc)
  }`;
  return await client.fetch(query, { slug });
}



// === NAYA FUNCTION: RELATED PRODUCTS KE LIYE ===
export const getRelatedProducts = async (currentProductId: string, categoryIds: string[]) => {
  if (!categoryIds || categoryIds.length === 0) return [];

  // Yeh query ussi category ke baaki products layegi, lekin current product ko chhor kar
  const query = groq`
    *[_type == "product" && count((categories[]->_id)[@ in $categoryIds]) > 0 && _id != $currentProductId][0...10] {
      ${productFields}
    }
  `;
  return await client.fetch(query, { categoryIds, currentProductId });
};

export const HOMEPAGE_DATA_QUERY = groq`{
    "featuredProductsTitle": "Featured Products",
    "featuredProducts": *[_type == "product" && isFeatured == true] | order(_createdAt desc)[0...12] { ${productFields} },
    
    "bestSellersTitle": "Best Sellers",
    "bestSellers": *[_type == "product" && isBestSeller == true] | order(rating desc, reviewCount desc)[0...12]{ ${productFields} },
    
    "newArrivalsTitle": "New Arrivals",
    "newArrivals": *[_type == "product"] | order(_createdAt desc)[0...12]{ ${productFields} },

    // === YAHAN NAYA CODE ADD HUA HAI ===
    "sectionBanners": *[_type == "homepage" && _id == "homepage"][0].sectionBanners,
    // ===================================

    "featuredCategoriesData": *[_type == "homepage" && _id == "homepage"][0] {
        featuredCategoriesTitle,
        "featuredCategories": featuredCategories[]->{ _id, name, "slug": slug.current, "image": image.asset->url },
        categoryGridTitle,
        "categoryGrid": categoryGrid[]{
          _key,
          discountText,
          category->{
            _id,
            name,
            "slug": slug.current,
            image
          }
        }
    }
}`;


// === YAHAN ASAL TABDEELI HAI ===
// Humne har level ki sub-category ke saath uski image fetch karne ka code add kar diya hai.
export const getNavigationCategories = async () => {
  const query = groq`
    *[_type == "category" && !defined(parent)] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->url, // Main category ki image (agar zaroorat pade)
      "subCategories": *[_type == "category" && parent._ref == ^._id] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url, // Level 2 ki image
        "subCategories": *[_type == "category" && parent._ref == ^._id] | order(name asc) {
          _id,
          name,
          "slug": slug.current,
          "image": image.asset->url // Level 3 ki image
        }
      }
    }
  `;
  return await client.fetch(query);
}

export const getCategoryPageData = async (slugPath: string[]) => {
  const currentSlug = slugPath[slugPath.length - 1];
  const query = groq`
    *[_type == "category" && slug.current == $currentSlug][0] {
      "currentCategory": {
        _id, // _id bhi fetch karein
        name,
        "slug": slug.current,
        // === NAYE FIELDS YAHAN FETCH KIYE GAYE HAIN ===
         "desktopBanner": desktopBanner,
        "mobileBanner": mobileBanner,
        "description": description,
        // ===========================================
        "products": *[_type == "product" && references(^._id)] { ${productFields} },
        "subCategories": *[_type == "category" && parent._ref == ^._id] | order(name asc) {
          _id, name, "slug": slug.current, "image": image.asset->url
        }
      },
      "categoryTree": coalesce(parent->parent->parent, parent->parent, parent, @) {
        _id, name, "slug": slug.current,
        "subCategories": *[_type == "category" && parent._ref == ^._id] | order(name asc) {
          _id, name, "slug": slug.current,
          "subCategories": *[_type == "category" && parent._ref == ^._id] | order(name asc) {
            _id, name, "slug": slug.current,
            "subCategories": *[_type == "category" && parent._ref == ^._id] | order(name asc) {
              _id, name, "slug": slug.current
            }
          }
        }
      }
    }
  `;
  const result = await client.fetch(query, { currentSlug });
  return result || { currentCategory: null, categoryTree: null };
}
const PRODUCTS_PER_PAGE = 12;

// export const searchProducts = async (
//   options: {
//     searchTerm?: string;
//     categorySlug?: string;
//     contextType?: 'search' | 'category' | 'deals';
//     filters?: { [key:string]: any };
//     minPrice?: number;
//     maxPrice?: number;
//     sortOrder?: string;
//     page?: number;
//   } = {}
// ) => {
//   const {
//     searchTerm,
//     categorySlug,
//     contextType,
//     filters = {},
//     minPrice,
//     maxPrice,
//     sortOrder = 'best-match',
//     page = 1,
//   } = options;
  
//   const params: { [key: string]: any } = {};
//   let conditions: string[] = [`_type == "product"`, `count(variants) > 0`];
//   let variantConditions: string[] = [];


  
//   // === ASAL FIX YAHAN SE SHURU HOTA HAI ===
//   // Hum search term ko alag se handle karenge, context se bahar
//   if (searchTerm?.trim()) {
//     conditions.push(`(title match $searchTerm || brand->name match $searchTerm)`);
//     // Sab se zaroori line jo miss ho gayi thi
//     params.searchTerm = `*${searchTerm.trim()}*`;
//   }

//   // Ab context ki conditions ko check karein
//   if (contextType === 'category' && categorySlug) {
//     conditions.push(`($categorySlug in categories[]->slug.current || $categorySlug in categories[]->parent->slug.current || $categorySlug in categories[]->parent->parent->slug.current)`);
//     params.categorySlug = categorySlug;
//   } else if (contextType === 'deals') {
//     conditions.push(`isOnDeal == true`);
//   }
//   // === YAHAN TAK FIX MUKAMMAL HUA ===

//   // Baaqi poora function wesa hi rahega...
//   if (filters.brands && filters.brands.length > 0) {
//     conditions.push(`brand->slug.current in $brands`);
//     params.brands = filters.brands;
//   }
  
//   if (filters.categories && filters.categories.length > 0) {
//     conditions.push(`count((categories[]->slug.current)[@ in $categories]) > 0`);
//     params.categories = filters.categories;
//   }
  
//   if (typeof minPrice === 'number') {
//     variantConditions.push(`coalesce(salePrice, price) >= $minPrice`);
//     params.minPrice = minPrice;
//   }

//   if (typeof maxPrice === 'number' && maxPrice !== Infinity && maxPrice > 0) {
//     variantConditions.push(`coalesce(salePrice, price) <= $maxPrice`);
//     params.maxPrice = maxPrice;
//   }

//   const attributeFilters = Object.entries(filters).filter(
//     ([key, values]) => !['brands', 'categories'].includes(key) && Array.isArray(values) && values.length > 0
//   );

//   attributeFilters.forEach(([key, values]) => {
//     const paramName = `${key.toLowerCase()}Values`;
//     variantConditions.push(`count(attributes[lower(name) == "${key.toLowerCase()}" && lower(value) in $${paramName}]) > 0`);
//     params[paramName] = (values as string[]).map(v => v.toLowerCase());
//   });
  
//   if (variantConditions.length > 0) {
//     conditions.push(`count(variants[${variantConditions.join(' && ')}]) > 0`);
//   }

//   const queryFilter = `*[${conditions.join(' && ')}]`;

//   let ordering = '';
//   switch (sortOrder) {
//     case 'price-low-to-high': ordering = '| order(coalesce(variants[0].salePrice, variants[0].price) asc)'; break;
//     case 'price-high-to-low': ordering = '| order(coalesce(variants[0].salePrice, variants[0].price) desc)'; break;
//     case 'newest': ordering = '| order(_createdAt desc)'; break;
//     case 'best-selling': ordering = '| order(isBestSeller desc, rating desc, reviewCount desc)'; break;
//     case 'best-match':
//     default:
//       if (searchTerm?.trim()) {
//         ordering = '| score(boost(title match $searchTerm, 10)) | order(_score desc)';
//       } else {
//         ordering = '| order(isBestSeller desc, rating desc, reviewCount desc)';
//       }
//       break;
//   }
  
//   const start = (page - 1) * PRODUCTS_PER_PAGE;
//   const end = page * PRODUCTS_PER_PAGE;
//   const pagination = `[${start}...${end}]`;
  
//   const finalQuery = groq`{
//     "products": ${queryFilter} ${ordering} ${pagination} { ${productFields} },
//     "totalCount": count(${queryFilter})
//   }`;

//   // console.log("--- Executing Sanity Filter Query ---");
//   // console.log("Query:", finalQuery.replace(/\s+/g, ' ').trim()); // Query ko saaf karke dikhayein
//   // console.log("Params:", JSON.stringify(params, null, 2));
//   // console.log("------------------------------------");

//   return await client.fetch(finalQuery, params);
// };
// src/sanity/lib/queries.ts


// export const searchProducts = async (
//   options: {
//     searchTerm?: string;
//     categorySlug?: string;
//     filters?: { [key:string]: any };
//     minPrice?: number;
//     maxPrice?: number;
//     sortOrder?: string;
//     page?: number;
//   } = {}
// ) => {
//   console.log("\n--- [DEBUG] searchProducts ACTION STARTED ---");
  
//   const {
//     searchTerm,
//     categorySlug,
//     filters = {},
//     minPrice,
//     maxPrice,
//     sortOrder = 'best-match',
//     page = 1,
//   } = options;
  
//   console.log("[DEBUG] Received Options:", JSON.stringify(options, null, 2));

//   const params: { [key: string]: any } = {};
//   let conditions: string[] = [`_type == "product"`, `count(variants) > 0`];
//   let variantConditions: string[] = [];

//   // --- NAYI, BEHTAR LOGIC YAHAN HAI ---
//   if (sortOrder === 'newest') {
//       conditions.push(`isNewArrival == true`);
//       console.log("[DEBUG] Condition Added: isNewArrival == true");
//   }
//   if (sortOrder === 'best-selling') {
//       conditions.push(`isBestSeller == true`);
//       console.log("[DEBUG] Condition Added: isBestSeller == true");
//   }
//   if (filters?.isFeatured === true) {
//       conditions.push(`isFeatured == true`);
//       console.log("[DEBUG] Condition Added: isFeatured == true");
//   }
  
//   if (categorySlug) {
//     conditions.push(`($categorySlug in categories[]->slug.current || $categorySlug in categories[]->parent->slug.current || $categorySlug in categories[]->parent->parent->slug.current)`);
//     params.categorySlug = categorySlug;
//     console.log("[DEBUG] Condition Added: categorySlug filter");
//   }
//   if (searchTerm?.trim()) {
//     conditions.push(`(title match $searchTerm || brand->name match $searchTerm)`);
//     params.searchTerm = `*${searchTerm.trim()}*`;
//     console.log("[DEBUG] Condition Added: searchTerm filter");
//   }
//   if (filters.brands && filters.brands.length > 0) {
//     conditions.push(`brand->slug.current in $brands`);
//     params.brands = filters.brands;
//     console.log("[DEBUG] Condition Added: brands filter");
//   }
  
//   if (typeof minPrice === 'number') {
//     variantConditions.push(`coalesce(salePrice, price) >= $minPrice`);
//     params.minPrice = minPrice;
//     console.log("[DEBUG] Variant Condition Added: minPrice");
//   }
//   if (typeof maxPrice === 'number' && maxPrice !== Infinity && maxPrice > 0) {
//     variantConditions.push(`coalesce(salePrice, price) <= $maxPrice`);
//     params.maxPrice = maxPrice;
//     console.log("[DEBUG] Variant Condition Added: maxPrice");
//   }

//   const attributeFilters = Object.entries(filters).filter(([key, values]) => !['brands', 'isFeatured'].includes(key) && Array.isArray(values) && values.length > 0);
//   attributeFilters.forEach(([key, values]) => {
//     const paramName = `${key.toLowerCase()}Values`;
//     variantConditions.push(`count(attributes[lower(name) == "${key.toLowerCase()}" && lower(value) in $${paramName}]) > 0`);
//     params[paramName] = (values as string[]).map(v => v.toLowerCase());
//     console.log(`[DEBUG] Variant Condition Added: attribute filter for ${key}`);
//   });

//   if (variantConditions.length > 0) {
//     conditions.push(`count(variants[${variantConditions.join(' && ')}]) > 0`);
//   }

//   const queryFilter = `*[${conditions.join(' && ')}]`;
  
//   let ordering = '';
//   switch (sortOrder) {
//     case 'price-low-to-high': ordering = '| order(coalesce(variants[0].salePrice, variants[0].price) asc)'; break;
//     case 'price-high-to-low': ordering = '| order(coalesce(variants[0].salePrice, variants[0].price) desc)'; break;
//     case 'newest': ordering = '| order(_createdAt desc)'; break;
//     case 'best-selling': ordering = '| order(rating desc, reviewCount desc)'; break;
//     case 'best-match':
//     default:
//       if (searchTerm?.trim()) {
//         ordering = '| score(boost(title match $searchTerm, 10)) | order(_score desc)';
//       } else {
//         // Default sort for non-search pages (like category, deals etc.)
//         ordering = '| order(popularity desc, _createdAt desc)'; 
//       }
//       break;
//   }
  
//   const start = (page - 1) * PRODUCTS_PER_PAGE;
//   const end = page * PRODUCTS_PER_PAGE;
//   const pagination = `[${start}...${end}]`;
  
//   const finalQuery = groq`{
//     "products": ${queryFilter} ${ordering} ${pagination} { ${productFields} },
//     "totalCount": count(${queryFilter})
//   }`;

//   console.log("\n--- [DEBUG] FINAL GROQ QUERY ---");
//   console.log(finalQuery.replace(/\s\s+/g, ' '));
//   console.log("--- [DEBUG] PARAMS ---");
//   console.log(JSON.stringify(params, null, 2));
//   console.log("----------------------------\n");
  
//   const result = await client.fetch(finalQuery, params);
  
//   console.log(`[DEBUG] Sanity returned ${result?.products?.length || 0} products with a total count of ${result?.totalCount || 0}.`);
//   console.log("--- [DEBUG] searchProducts ACTION FINISHED ---\n");
  
//   return result || { products: [], totalCount: 0 };
// };

// =============================================================
export const searchProducts = async (
  options: {
    searchTerm?: string;
    categorySlug?: string;
    filters?: { [key:string]: any };
    minPrice?: number;
    maxPrice?: number;
    sortOrder?: string;
    page?: number;
  } = {}
) => {
  const {
    searchTerm,
    categorySlug,
    filters = {},
    minPrice,
    maxPrice,
    sortOrder = 'best-match',
    page = 1,
  } = options;
  
  const params: { [key: string]: any } = {};
  let conditions: string[] = [`_type == "product"`, `count(variants) > 0`];
  let variantConditions: string[] = [];

  // --- LOGIC FOR SPECIAL PAGES (New Arrivals, etc.) ---
  if (sortOrder === 'newest' && !searchTerm) {
      conditions.push(`isNewArrival == true`);
  }
  if (sortOrder === 'best-selling' && !searchTerm) {
      conditions.push(`isBestSeller == true`);
  }
  if (filters?.isFeatured === true && !searchTerm) {
      conditions.push(`isFeatured == true`);
  }
  
  // --- Standard Filters ---
  if (categorySlug) {
    conditions.push(`($categorySlug in categories[]->slug.current || $categorySlug in categories[]->parent->slug.current || $categorySlug in categories[]->parent->parent->slug.current)`);
    params.categorySlug = categorySlug;
  }
  if (searchTerm?.trim()) {
    conditions.push(`(title match $searchTerm || brand->name match $searchTerm)`);
    params.searchTerm = `*${searchTerm.trim()}*`;
  }
  if (filters.brands && filters.brands.length > 0) {
    conditions.push(`brand->slug.current in $brands`);
    params.brands = filters.brands;
  }
  
  if (typeof minPrice === 'number') {
    variantConditions.push(`coalesce(salePrice, price) >= $minPrice`);
    params.minPrice = minPrice;
  }
  if (typeof maxPrice === 'number' && maxPrice !== Infinity && maxPrice > 0) {
    variantConditions.push(`coalesce(salePrice, price) <= $maxPrice`);
    params.maxPrice = maxPrice;
  }

  const attributeFilters = Object.entries(filters).filter(([key, values]) => !['brands', 'isFeatured', 'categories'].includes(key) && Array.isArray(values) && values.length > 0);
  attributeFilters.forEach(([key, values]) => {
    const paramName = `${key.toLowerCase()}Values`;
    variantConditions.push(`count(attributes[lower(name) == "${key.toLowerCase()}" && lower(value) in $${paramName}]) > 0`);
    params[paramName] = (values as string[]).map(v => v.toLowerCase());
  });

  if (variantConditions.length > 0) {
    conditions.push(`count(variants[${variantConditions.join(' && ')}]) > 0`);
  }

  const queryFilter = `*[${conditions.join(' && ')}]`;
  
  let ordering = '';
  switch (sortOrder) {
    case 'price-low-to-high': ordering = '| order(coalesce(variants[0].salePrice, variants[0].price) asc)'; break;
    case 'price-high-to-low': ordering = '| order(coalesce(variants[0].salePrice, variants[0].price) desc)'; break;
    case 'newest': ordering = '| order(_createdAt desc)'; break;
    case 'best-selling': ordering = '| order(isBestSeller desc, rating desc, reviewCount desc)'; break;
    case 'best-match':
    default:
      if (searchTerm?.trim()) {
        ordering = '| score(boost(title match $searchTerm, 10)) | order(_score desc)';
      } else {
        ordering = '| order(_createdAt desc)'; 
      }
      break;
  }
  
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = page * PRODUCTS_PER_PAGE;
  const pagination = `[${start}...${end}]`;
  
  const finalQuery = groq`{
    "products": ${queryFilter} ${ordering} ${pagination} { ${productFields} },
    "totalCount": count(${queryFilter}),
    "filterData": {
      "brands": array::unique(${queryFilter}.brand->{
        _id, name, "slug": slug.current
      }),
      "attributes": ${queryFilter}.variants[].attributes[]{
        name,
        value
      },
      "priceRange": {
        "min": math::min(${queryFilter}.variants[].price),
        "max": math::max(${queryFilter}.variants[].price)
      }
    }
  }`;
  
  return await client.fetch(finalQuery, params);
};

export const HERO_CAROUSEL_QUERY = groq`
  *[_type == "heroCarousel"] | order(_createdAt asc) {
    _id, title, subtitle, buttonText, link,
    "desktopImage": desktopImage.asset->url,
    "mobileImage": mobileImage.asset->url
  }
`;
// === YEH FUNCTION AB BILKUL THEEK HAI ===
// Is mein ab MongoDB ya ObjectId ka koi zikr nahi hai
export const getSingleUserOrder = async (orderId: string, userId: string) => {
  // Sanity ko 'ObjectId' ki zaroorat nahi hoti, woh _id ko string maanta hai.
  // Hum ObjectId.isValid() check bhi hata rahe hain kyunke woh MongoDB ke liye tha.
  if (!orderId || !userId) return null;

  const query = groq`
    *[_type == "orders" && _id == $orderId && userId == $userId][0] {
      _id,
      orderDate,
      products,
      shippingAddress,
      status,
      totalPrice,
      paymentMethod,
      paymentStatus
    }
  `;
  // Sanity ko direct string 'orderId' pass karein
  return await client.fetch(query, { orderId, userId });
}

// ===============================================
// === NAYI BLOG QUERIES START HERE ===
// ===============================================

// Query #1: Saare blog posts fetch karne ke liye (Blog Homepage ke liye)
export const getAllPosts = async () => {
    const query = groq`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        mainImage,
        excerpt,
        publishedAt,
        "authorName": author->name,
        "authorImage": author->image
      }
    `;
    return await client.fetch(query);
}

// Query #2: Aek single blog post uske slug se fetch karne ke liye
export const getSinglePost = async (slug: string) => {
    const query = groq`
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        mainImage,
        body,
        publishedAt,
        "author": author->{ name, image, bio },
        "categories": categories[]->{ name, "slug": slug.current }
      }
    `;
    return await client.fetch(query, { slug });
}

export const getProductsByCategoryName = async (categoryName: string) => {
  if (!categoryName) return [];

  // Yeh query pehle category ko uske naam se dhoondti hai (case-insensitive)
  // Phir us category ke saare products fetch karti hai.
  const query = groq`
    *[_type == "category" && lower(name) == lower($categoryName)][0] {
      "products": *[_type == "product" && references(^._id)] {
        ${productFields} // Hum wahi purana, behtareen fragment istemal kar rahe hain
      }
    }
  `;
  const result = await client.fetch(query, { categoryName });
  // Agar category mili to uske products wapis bhejo, warna khali array
  return result ? result.products : []; 
}


interface StockStatus {
  _id: string;
  inStock: boolean;
  variants: {
    _key: string;
    inStock: boolean;
  }[] | null;
}

export async function getProductsStockStatus(productIds: string[]): Promise<StockStatus[]> {
  if (!productIds || productIds.length === 0) {
    return [];
  }
  try {
    const query = groq`
      *[_type == "product" && _id in $productIds] {
        _id,
        inStock,
        "variants": variants[]{ _key, inStock }
      }
    `;
    const stockStatus = await client.fetch(query, { productIds });
    return stockStatus;
  } catch (error) {
    console.error("Failed to fetch product stock status:", error);
    return [];
  }
}

// 2. NAYI QUERY for Promo / Story Banners
export const PROMO_BANNERS_QUERY = groq`*[_type == "promoBanner"] {
  _id,
  title,
  image, // Poora image object fetch karein taake urlFor kaam kare
  link,
  buttonText
}`;

export const INSTAGRAM_QUERY = groq`*[_type == "instagramFeed" && _id == "instagramFeed"][0] {
  heading,
  subheading,
  instagramHandle,
  gallery[]{
    "alt": alt,
    "asset": asset->
  }
}`;


export const LIFESTYLE_BANNERS_QUERY = groq`
*[_type == "lifestyleBanner"] | order(_createdAt asc) {
  _id,
  title,
  subtitle,
  link,
  buttonText,
  mediaType,
  "desktopImage": desktopImage.asset->url,
  "mobileImage": mobileImage.asset->url,
  
  // === YAHAN ASAL TABDEELI HAI ===
  // Hum dono qisam ke video fields ko fetch kar rahe hain
  "desktopVideoFile": desktopVideoFile.asset->url,
  "mobileVideoFile": mobileVideoFile.asset->url,
  desktopVideoUrl,
  mobileVideoUrl
}`
// 2. Informational Page Query (For dynamic pages like /about-us)
export const GET_PAGE_QUERY = groq`
*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  body
}`;

// 3. FAQ Page Query
export const GET_FAQ_QUERY = groq`
*[_type == "faq" && _id == "faqPage"][0] {
  _id,
  title,
  faqList[]{
    _key,
    question,
    answer
  }
}`;

// === DEAL OF THE DAY QUERY UPDATE HOGI ===
export const DEAL_OF_THE_DAY_QUERY = groq`
*[_type == "dealOfTheDay" && _id == "dealOfTheDay"][0] {
  isEnabled,
  title,
  dealEndDate,
  // Product ki details ab uske default variant se aayengi
  "product": product->{
    _id,
    title,
    "slug": slug.current,
    description,
    "price": variants[0].price,
    "salePrice": variants[0].salePrice,
    // Hum pehle variant ki pehli 3 images fetch karenge
    "images": variants[0].images[0...3].asset->url
  }
}`;


export const COUPON_BANNER_QUERY = groq`
  *[_type == "couponBanner"]{
    _id,
    link->{ _type, slug },
    mediaType,
    mediaUrls {
      mobile { asset->{url} },
      tablet { asset->{url} },
      desktop { asset->{url} }
    },
    width,
    height,
    objectFit,
    altText
  }
`

// src/sanity/lib/queries.ts (UPDATE THIS FUNCTION)

export const getProductsBySlugs = async (slugs: string[]): Promise<SanityProduct[]> => {
    
    // === DEBUGGING KE LIYE NAYI LINE ===
    console.log("DEBUG 2: Sanity se in slugs ke products maange ja rahe hain:", slugs);
    // ==================================
    
    if (!slugs || slugs.length === 0) {
        return [];
    }
    const query = groq`
      *[_type == "product" && slug.current in $slugs] {
        ${productFields}
      }
    `;
    const products = await client.fetch(query, { slugs });

    // API se anay wale slugs ki tarteeb barqarar rakhna
    const sortedProducts = slugs.map(slug => products.find((p: SanityProduct) => p.slug === slug)).filter(Boolean) as SanityProduct[];
    return sortedProducts;
};
// === NEW FUNCTION FOR INFINITE SCROLL ===
export const getPaginatedProducts = async (page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = page * limit;

  // GROQ ki slicing [start...end] bohot powerful hai
  const query = groq`
    *[_type == "product"] | order(_createdAt desc) [${start}...${end}] {
      ${productFields} // Wahi purana, behtareen product fragment
    }
  `;
  return await client.fetch(query);
};
// === NEW QUERY FOR FLASH SALE ===
export const FLASH_SALE_QUERY = groq`
*[_type == "flashSale" && _id == "flashSale" && isEnabled == true][0] {
  title,
  endDate,
  // Hum product references ko expand karke unki poori details fetch karenge
  "products": products[]->{
    ${productFields} // Wahi purana, behtareen product fragment
  }
}`
export const getSearchSuggestions = async () => {
  const query = groq`
    *[_type == "settings" && _id == "settings"][0] {
      "trendingKeywords": searchSettings.trendingKeywords,
      "popularCategories": searchSettings.popularCategories[]->{
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url
      }
    }
  `;
  return await client.fetch(query);
};
// === NAYA FUNCTION: DEALS PAGE KE LIYE ===
export const GET_DEALS_PLP_DATA = groq`{
  // Pehle 12 products fetch karein jo deal per hain
  "initialProducts": *[_type == "product" && isOnDeal == true] | order(_createdAt desc) [0...${PRODUCTS_PER_PAGE}] {
    ${productFields}
  },
  // Deal products ki total tadaad
  "totalCount": count(*[_type == "product" && isOnDeal == true]),

  // Sirf deal products se filter data banayein
  "filterData": {
    "brands": array::unique(*[
      _type == "product" && isOnDeal == true
    ].brand->{
      _id, name, "slug": slug.current
    }),
    "attributes": *[
      _type == "product" && isOnDeal == true
    ].variants[].attributes[]{
      name,
      value
    },
    "priceRange": {
      "min": math::min(*[
        _type == "product" && isOnDeal == true
      ].variants[].price),
      "max": math::max(*[
        _type == "product" && isOnDeal == true
      ].variants[].price)
    }
  },

  // === NAYA DATA YAHAN ADD HUA HAI ===
  // Sirf un categories ko unique karke lao jinmein deals mojood hain
  "dealCategories": array::unique(
    *[_type == "product" && isOnDeal == true].categories[]->{
      _id,
      name,
      "slug": slug.current
    }
  )
}`;


// === NEW QUERY FOR COUPON VERIFICATION ===
export const GET_COUPON_BY_CODE_QUERY = groq`
  *[_type == "coupon" && code == $code][0] {
    ..., // Fetches all fields from the coupon document
    "applicableProductIds": applicableProducts[]->_id,
    "applicableCategoryIds": applicableCategories[]->_id
  }
`;



// --- NAYA, BEHTAR FUNCTION FILTER DATA KE LIYE ---
export const GET_FILTER_DATA_FOR_PLP = async (
  options: { 
    searchTerm?: string;
    categorySlug?: string;
    sortOrder?: string;
    isFeatured?: boolean;
  } = {}
) => {
    const { searchTerm, categorySlug, sortOrder, isFeatured } = options;

    const params: { [key: string]: any } = {};
    let conditions: string[] = [`_type == "product"`, `count(variants) > 0`];

    // Bilkul wahi conditions jo searchProducts mein hain
    if (sortOrder === 'newest') conditions.push(`isNewArrival == true`);
    if (sortOrder === 'best-selling') conditions.push(`isBestSeller == true`);
    if (isFeatured) conditions.push(`isFeatured == true`);
    
    if (categorySlug) {
      conditions.push(`($categorySlug in categories[]->slug.current || $categorySlug in categories[]->parent->slug.current || $categorySlug in categories[]->parent->parent->slug.current)`);
      params.categorySlug = categorySlug;
    }
    if (searchTerm?.trim()) {
      conditions.push(`(title match $searchTerm || brand->name match $searchTerm)`);
      params.searchTerm = `*${searchTerm.trim()}*`;
    }

    const queryFilter = `*[${conditions.join(' && ')}]`;

    const filterQuery = groq`{
      "brands": array::unique(${queryFilter}.brand->{
         _id, name, "slug": slug.current
      }),
      "attributes": ${queryFilter}.variants[].attributes[]{
        name, value
      },
      "priceRange": {
        "min": math::min(${queryFilter}.variants[].price),
        "max": math::max(${queryFilter}.variants[].price)
      }
    }`;
    
    return await client.fetch(filterQuery, params);
}


