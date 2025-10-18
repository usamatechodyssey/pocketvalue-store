// =============================================================================
// # POCKETVALUE - SANITY SURGEON V2.3 (JAVASCRIPT HIERARCHY-AWARE)
// # Deletes products from a parent category AND its children.
// # FIX: Removed undefined 'groq' tag from query string.
// =============================================================================
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@sanity/client');
const readline = require('readline');

// --- Configuration ---
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const CHUNK_SIZE = 50; // Number of products to delete per transaction

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// --- Initial Validation ---
if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
    console.error("❌ ERROR: Sanity credentials not found in .env.local file.");
    console.error("Please ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN are set.");
    process.exit(1);
}

// --- Sanity Client Initialization ---
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2022-03-07',
  useCdn: false
});

// --- Core Functions ---

async function findAndRemoveReferences(productId) {
    const query = `*[references($productId)]`;
    const referencingDocs = await client.fetch(query, { productId });

    if (!referencingDocs || referencingDocs.length === 0) {
        return;
    }

    console.log(`  -> Found ${referencingDocs.length} reference(s) to product ${productId}. Removing...`);
    const transaction = client.transaction();
    for (const doc of referencingDocs) {
        for (const [key, value] of Object.entries(doc)) {
            if (Array.isArray(value)) {
                const newArray = value.filter(item => item?._ref !== productId);
                if (newArray.length < value.length) {
                    transaction.patch(doc._id, { set: { [key]: newArray } });
                }
            } else if (value?._ref === productId) {
                transaction.patch(doc._id, { unset: [key] });
            }
        }
    }
    
    try { 
        await transaction.commit({ returnDocuments: false, autoGenerateArrayKeys: true });
        console.log(`  -> Successfully removed references for ${productId}.`); 
    } catch (e) { 
        console.error(`  -> ❌ ERROR removing references for ${productId}:`, e.message); 
        throw e;
    }
}

async function deleteProductsInChunk(productIds) {
    console.log(`\n--- Deleting chunk of ${productIds.length} products... ---`);
    const transaction = client.transaction();
    productIds.forEach(pid => transaction.delete(pid));
    
    try { 
        await transaction.commit({ returnDocuments: false }); 
        console.log(`--- ✅ Chunk deleted successfully. ---`); 
    } catch (e) { 
        console.error(`--- ❌ ERROR deleting chunk:`, e.message); 
    }
}

// --- Main Execution Logic ---
async function main() {
    console.log("\n==============================================");
    console.log("🔥 POCKETVALUE - HIERARCHICAL DELETION TOOL 🔥");
    console.log("==============================================");
    
    const categoryIdentifier = await askQuestion("\nEnter the EXACT name OR slug of the PARENT category to clear (e.g., 'Home & Living' or 'home-decor'): ");
    if (!categoryIdentifier) { console.log("No input provided. Exiting."); rl.close(); return; }

    console.log(`\n1. Finding parent category '${categoryIdentifier}' and its children...`);
    
    // === THE FIX IS HERE: 'groq' tag is removed ===
    const categoryQuery = `
      *[_type == 'category' && (name == $identifier || slug.current == $identifier)][0] {
        "allIds": [
          _id, 
          ...*[_type == 'category' && parent._ref == ^._id]._id,
          ...*[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id
        ]
      }.allIds
    `;
    let allCategoryIds = await client.fetch(categoryQuery, { identifier: categoryIdentifier });

    if (!allCategoryIds || allCategoryIds.length === 0) {
        console.log(`❌ Category '${categoryIdentifier}' not found. Please check the name/slug.`);
        rl.close();
        return;
    }
    
    allCategoryIds = [...new Set(allCategoryIds.filter(Boolean))];
    console.log(`✅ Found ${allCategoryIds.length} total categories (parent + children/grandchildren).`);
    
    console.log("\n2. Finding all products across these categories...");
    const prodQuery = `*[_type == "product" && count((categories[]->_id)[@ in $allCategoryIds]) > 0]{_id}`;
    const productDocs = await client.fetch(prodQuery, { allCategoryIds });
    const productIds = productDocs.map(doc => doc._id);

    if (productIds.length === 0) {
        console.log("✅ No products found in this category hierarchy. Nothing to do.");
        rl.close();
        return;
    }
    
    console.log(`Found ${productIds.length} products to delete.`);
    
    const confirm = await askQuestion(`\n🚨 WARNING: You are about to PERMANENTLY DELETE ${productIds.length} products and their references. This cannot be undone.\nType 'YES' to continue: `);
    
    if (confirm !== 'YES') { console.log("Confirmation not received. Exiting."); rl.close(); return; }
    
    console.log("\n🚀 Starting deletion process...");
    
    let totalDeleted = 0;
    for (let i = 0; i < productIds.length; i += CHUNK_SIZE) {
        const chunk = productIds.slice(i, i + CHUNK_SIZE);
        console.log(`\nProcessing chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(productIds.length / CHUNK_SIZE)}...`);
        
        const safeToDelete = [];
        for (const productId of chunk) {
            try {
                await findAndRemoveReferences(productId);
                safeToDelete.push(productId);
            } catch (error) {
                console.log(`Skipping deletion of ${productId} due to an error during reference removal.`);
            }
        }

        if (safeToDelete.length > 0) {
            await deleteProductsInChunk(safeToDelete);
            totalDeleted += safeToDelete.length;
        }

        if (productIds.length > i + CHUNK_SIZE) {
            console.log("Waiting 2 seconds before next chunk to avoid rate limiting...");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log(`\n\nAlhamdulillah! Mission accomplished. Total products deleted: ${totalDeleted}.`);
    rl.close();
}

main().catch(err => {
    console.error("An unexpected error occurred:", err);
    rl.close();
});