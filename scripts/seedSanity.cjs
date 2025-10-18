// seed.js - FINAL, MORE ROBUST SCRIPT WITH SAFETY CHECKS

require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-03-11',
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function toSlug(text) {
  if (!text) return '';
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '').slice(0, 95);
}

async function uploadImagesInBatches(urls, batchSize = 10, delay = 1000) {
    const allAssets = [];
    console.log(`\nFound ${urls.length} unique images to upload.`);
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        console.log(`- Uploading image batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(urls.length / batchSize)}...`);
        
        const assets = await Promise.all(
            batch.map(async (imageUrl) => {
                try {
                    const imageResponse = await fetch(imageUrl);
                    if (!imageResponse.ok) {
                        console.warn(`  - Could not fetch image: ${imageUrl} (status: ${imageResponse.status})`);
                        return null;
                    }
                    const asset = await sanityClient.assets.upload('image', imageResponse.body, { filename: imageUrl.split('/').pop().split('?')[0] || `image-${Date.now()}` });
                    return { originalUrl: imageUrl, asset };
                } catch (e) { console.error(`  - Failed to upload ${imageUrl}: ${e.message}`); return null; }
            })
        );
        allAssets.push(...assets.filter(Boolean));
        if (i + batchSize < urls.length) {
            console.log(`  ...waiting for ${delay / 1000}s before next batch.`);
            await sleep(delay);
        }
    }
    return allAssets;
}

async function seedData() {
  console.log('STEP 1: Fetching existing categories and brands from your Sanity dataset...');
  const existingCategories = await sanityClient.fetch(`*[_type == "category"]{_id, "slug": slug.current}`);
  const existingBrands = await sanityClient.fetch(`*[_type == "brand"]{_id, name}`);
  console.log(`- Found ${existingCategories.length} categories and ${existingBrands.length} brands.`);

  const categoryMap = {
    'mens-shirts': 't-shirts-men','mens-shoes': 'footwear-men','mens-watches': 'fashion-accessories-men','womens-dresses': 'dresses-women','womens-shoes': 'footwear-women','womens-watches': 'fashion-accessories-men','womens-bags': 'handbags-bags-wallets','womens-jewellery': 'jewellery-women','sunglasses': 'fashion-accessories-men','laptops': 'laptops','smartphones': 'smart-wearables','skincare': 'skincare','home-decoration': 'home-decor',
  };

  console.log('\nSTEP 2: Fetching dummy products from dummyjson.com...');
  const response = await fetch('https://dummyjson.com/products?limit=100');
  const data = await response.json();
  const allDummyProducts = data.products;

  const dummyProducts = allDummyProducts.filter(p => categoryMap[p.category]);
  console.log(`- Fetched ${allDummyProducts.length} products, filtered down to ${dummyProducts.length} relevant products.`);

  console.log('\nSTEP 3: Uploading all product images to Sanity in batches...');
  const allImageUrls = [...new Set(dummyProducts.flatMap(p => p.images || []))];
  const uploadedAssets = await uploadImagesInBatches(allImageUrls);
  console.log(`\n- Successfully uploaded ${uploadedAssets.length} unique images.`);
  const urlToAssetMap = new Map(uploadedAssets.map(({ originalUrl, asset }) => [originalUrl, asset]));

  console.log('\nSTEP 4: Preparing product documents according to your schema...');
  const transaction = sanityClient.transaction();

  dummyProducts.forEach(product => {
    const productSlug = toSlug(product.title) || `product-${product.id}`;

    const targetCategorySlug = categoryMap[product.category];
    const category = existingCategories.find(c => c.slug === targetCategorySlug);
    if (!category) {
        console.warn(`  - Skipping product "${product.title}" because its category slug "${targetCategorySlug}" was not found.`);
        return;
    }

    // === YAHAN ASAL FIX HAI: Brand ko handle karne se pehle check karein ===
    let brandRef;
    if (product.brand && product.brand.trim() !== "") {
        let brand = existingBrands.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
        if (!brand) {
            const brandSlug = toSlug(product.brand);
            const brandId = `dummy-brand-${brandSlug}`;
            const newBrand = { _id: brandId, _type: 'brand', name: product.brand, slug: { _type: 'slug', current: brandSlug } };
            transaction.createOrReplace(newBrand);
            existingBrands.push(newBrand);
            brand = newBrand;
        }
        brandRef = { _type: 'reference', _ref: brand._id };
    }
    // ======================================================================

    const imageAssets = (product.images || []).map(url => urlToAssetMap.get(url)).filter(Boolean).map(asset => ({ _type: 'image', asset: { _type: 'reference', _ref: asset._id } }));

    const defaultVariant = {
      _key: `var-${product.id}-default`, name: 'Default', sku: `SKU-${product.id}`,
      price: product.price,
      salePrice: product.discountPercentage > 15 ? Math.round(product.price * (1 - product.discountPercentage / 100)) : undefined,
      inStock: product.stock > 0,
      images: imageAssets,
      attributes: [],
      weight: product.weight || Math.round(Math.random() * 2 * 10) / 10,
      dimensions: product.dimensions ? { height: product.dimensions.height, width: product.dimensions.width, depth: product.dimensions.depth } : null,
    };
    
    const specifications = [
        { _key: `spec-brand-${product.id}`, label: 'Brand', value: product.brand || 'Generic' },
        { _key: `spec-dim-${product.id}`, label: 'Dimensions', value: product.dimensions ? `${product.dimensions.width}W x ${product.dimensions.height}H x ${product.dimensions.depth}D cm` : 'N/A' },
        { _key: `spec-stock-${product.id}`, label: 'Initial Stock', value: `${product.stock} units` },
    ];

    const shippingAndReturns = [{ _type: 'block', _key: `shipping-${product.id}`, style: 'normal', children: [{ _type: 'span', _key: `span-${product.id}`, text: 'Enjoy our 7-day easy return policy. Standard delivery within 3-5 business days across Pakistan.' }] }];

    const newProduct = {
      _id: `dummy-${product.id}`, _type: 'product',
      title: product.title,
      slug: { _type: 'slug', current: productSlug },
      description: [{ _type: 'block', _key: `desc-${product.id}`, style: 'normal', children: [{ _type: 'span', _key: `span-desc-${product.id}`, text: product.description }] }],
      rating: product.rating,
      brand: brandRef, // Yahan ab safe `brandRef` istemal hoga
      categories: [{ _key: `cat-ref-${category._id}`, _type: 'reference', _ref: category._id }],
      specifications: specifications,
      shippingAndReturns: shippingAndReturns,
      isBestSeller: product.rating > 4.7,
      isNewArrival: true,
      isFeatured: product.rating > 4.5 && product.stock > 50,
      variants: [defaultVariant],
    };

    transaction.createOrReplace(newProduct);
  });

  console.log('\nSTEP 5: Committing all changes to Sanity...');
  try {
    await transaction.commit({ autoGenerateArrayKeys: true });
    console.log(`\n✅ Success! Seeded products into your existing categories.`);
  } catch (error) {
    console.error('❌ Error during Sanity transaction:', error.message);
  }
}

seedData();