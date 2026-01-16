// updateCategories.cjs - FINAL, SUPER-INTELLIGENT SCRIPT WITH BETTER MAPPING & FALLBACK

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

// === YAHAN ASAL JAADU HAI: BEHTAR AUR TAFSEELI IMAGE MAP ===
const categoryImageMap = {
    'men': 'men fashion', 'women': 'women fashion', 'kids': 'kids fashion', 'home-living': 'living room', 'beauty': 'beauty products',
    'topwear-men': 'shirt', 'bottomwear-men': 'trousers', 'footwear-men': 'shoes', 'sports-active-wear-men': 'sports clothing',
    'fashion-accessories-men': 'watch', 'indian-festive-wear-men': 'kurta', 'innerwear-sleepwear-men': 'underwear',
    't-shirts-men': 't-shirt', 'casual-shirts-men': 'casual shirt', 'formal-shirts-men': 'formal shirt', 'sweatshirts-men': 'sweatshirt',
    'sweaters-men': 'sweater', 'jackets-men': 'jacket', 'blazers-coats-men': 'blazer', 'suits-men': 'suit',
    'jeans-men': 'jeans', 'casual-trousers-men': 'chinos', 'formal-trousers-men': 'formal trousers', 'shorts-men': 'shorts',
    'track-pants-joggers-men': 'joggers', 'casual-shoes-men': 'casual shoes', 'sports-shoes-men': 'sports shoes',
    'formal-shoes-men': 'formal shoes', 'sneakers-men': 'sneakers', 'sandals-floaters-men': 'sandals', 'flip-flops-men': 'flip flops',
    'wallets-men': 'wallet', 'belts-men': 'belt', 'perfumes-body-mists-men': 'perfume', 'trimmers-men': 'trimmer', 'caps-hats-men': 'cap',
    'bags-backpacks-men': 'backpack', 'kurtas-kurta-sets-men': 'kurta', 'sherwanis': 'sherwani',
    'indian-fusion-wear-women': 'ethnic dress', 'western-wear-women': 'western dress', 'lingerie-sleepwear': 'lingerie',
    'footwear-women': 'heels', 'sports-active-wear-women': 'sports bra', 'gadgets-women': 'gadgets', 'jewellery-women': 'jewellery',
    'handbags-bags-wallets': 'handbag', 'kurtas-suits-women': 'kurta suit', 'sarees': 'saree', 'dresses-women': 'dress',
    'tops-women': 'top', 'tshirts-women': 't-shirt women', 'jeans-women': 'jeans women', 'heels': 'heels', 'boots-women': 'boots',
    'smart-wearables': 'smartwatch', 'headphones-earphones-women': 'headphones', 'speakers-women': 'speaker',
    'boys-clothing': 'boys clothes', 'girls-clothing': 'girls dress', 'footwear-kids': 'kids shoes', 'infants': 'infant clothing',
    'bed-linen-furnishing': 'bedding', 'flooring': 'carpet', 'bath': 'towel', 'lamps-lighting': 'lamp', 'home-decor': 'home decor',
    'cushions-cushion-covers': 'cushion', 'curtains': 'curtains', 'kitchen-table': 'kitchenware', 'storage': 'storage box',
    'bedsheets': 'bedsheet', 'blankets-quilts-dohars': 'blanket', 'carpets': 'carpet', 'bath-towels': 'towel',
    'table-lamps': 'table lamp', 'plants-planters': 'plant pot', 'clocks': 'wall clock', 'makeup': 'makeup kit', 'skincare': 'skincare cream',
    'lipsticks': 'lipstick', 'fragrances': 'perfume bottle', 'haircare': 'shampoo', 'mens-grooming': 'shaving kit'
};

async function updateCategoriesWithImages() {
  try {
    console.log('STEP 1: Fetching all existing categories from your Sanity dataset...');
    const allCategories = await sanityClient.fetch(`*[_type == "category"]{_id, "slug": slug.current, name, "hasImage": defined(image)}`);
    const categoriesToUpdate = allCategories.filter(c => !c.hasImage);

    if (categoriesToUpdate.length === 0) {
      console.log('✅ All your categories already have images. Nothing to do!');
      return;
    }
    console.log(`- Found ${categoriesToUpdate.length} categories that need an image.`);

    console.log('\nSTEP 2: Fetching dummy products from dummyjson.com to find relevant images...');
    const response = await fetch('https://dummyjson.com/products?limit=100&select=title,category,thumbnail');
    if (!response.ok) throw new Error('Failed to fetch dummy products');
    const data = await response.json();
    const dummyProducts = data.products;
    
    const imageUrlMap = new Map();

    for(const category of categoriesToUpdate) {
        let searchTerm = categoryImageMap[category.slug];
        
        // === FALLBACK LOGIC (PLAN B) ===
        if (!searchTerm) {
            searchTerm = category.name.replace(/\(.*\)/, '').split(',')[0].split('&')[0].trim().toLowerCase();
        }

        const foundProduct = dummyProducts.find(p => p.title.toLowerCase().includes(searchTerm) || p.category.toLowerCase().replace('-', ' ').includes(searchTerm));
        if(foundProduct && foundProduct.thumbnail) {
            imageUrlMap.set(category.slug, foundProduct.thumbnail);
        }
    }
    console.log(`- Successfully mapped ${imageUrlMap.size} categories to a relevant product thumbnail.`);
    
    if (imageUrlMap.size === 0) {
        console.log("Could not map any categories to images. Exiting.");
        return;
    }

    const transaction = sanityClient.transaction();
    let updatedCount = 0;

    console.log('\nSTEP 3: Uploading and patching images...');
    for (const category of categoriesToUpdate) {
      const imageUrl = imageUrlMap.get(category.slug);
      if (!imageUrl) {
        console.warn(`  - Could not find a matching image for "${category.name}". Skipping.`);
        continue;
      }

      try {
        console.log(`  - For category "${category.name}", fetching image: ${imageUrl}`);
        const imageResponse = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });

        if (!imageResponse.ok) {
          console.warn(`    - Fetch failed for "${category.name}". Status: ${imageResponse.status}. Skipping.`);
          continue;
        }
        
        const asset = await sanityClient.assets.upload('image', imageResponse.body, { filename: `${category.slug}.jpg` });
        transaction.patch(category._id, { set: { image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } } });
        updatedCount++;

        if (updatedCount % 10 === 0) {
          console.log(`    ...processed ${updatedCount} images, taking a short break.`);
          await sleep(1000);
        }

      } catch (error) {
        console.error(`  - Failed to process category "${category.name}": ${error.message}`);
      }
    }

    if (updatedCount === 0) {
        console.log("\nNo categories were updated. All image fetches might have failed.");
        return;
    }

    console.log(`\nSTEP 4: Committing updates for ${updatedCount} categories...`);
    await transaction.commit();
    console.log(`\n✅ Success! Updated ${updatedCount} categories with new images.`);

  } catch (error) {
    console.error('❌ A critical error occurred:', error.message);
  }
}

// Run the script
updateCategoriesWithImages();