// === THE FINAL, 100% SCHEMA-ACCURATE & LOGICALLY CORRECT CSV TEMPLATE ===

const CSV_TEMPLATE_HEADERS = [
  // Parent Product Columns (Columns A-M)
  "title", "slug", "videoUrl", "description", "brand", "categories", "specifications", "shippingAndReturns", "rating", "isBestSeller", "isNewArrival", "isFeatured", "isOnDeal",
  
  // Variant Columns (Columns N onwards)
  "variant_name", "variant_sku", "variant_price", "variant_salePrice", "variant_stock", "variant_inStock", "variant_images", "variant_weight", "variant_height", "variant_width", "variant_depth",
  "attribute1_name", "attribute1_value", "attribute2_name", "attribute2_value", "attribute3_name", "attribute3_value",
].join(",");

// --- EXAMPLE 1: A SIMPLE PRODUCT (COFFEE MUG) ---
// Row 1: Parent product details. Variant columns are completely empty.
const P1_PARENT = `"Mughal Art Coffee Mug","mughal-art-mug",,,"Home Decor Pakistan","Home & Living,Kitchen","Material:Ceramic|Capacity:325ml",,4.9,FALSE,TRUE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,`;
// Row 2: Its single variant. Parent columns are empty. The variant name is meaningful.
const P1_VARIANT = `,,,,,,,,,,,,,"Standard Mug","MUG-001",799,,50,TRUE,"https://example.com/mug1.jpg,https://example.com/mug2.jpg",0.2,10,8,8,,,,,,`;

// --- EXAMPLE 2: A VARIABLE PRODUCT (POLO SHIRT) ---
// Row 1: Parent product details. Variant columns are empty.
const P2_PARENT = `"Men's Premium Polo","mens-pima-polo","https://cloudinary.com/my-video.mp4","Soft Pima Cotton Polo.","Zindagi Basics","Men,T-Shirts","Fabric:100% Pima Cotton",,4.8,TRUE,TRUE,TRUE,TRUE,,,,,,,,,,,,,,,,,,,`;
// Row 2-4: The different variants. Parent columns are empty.
const P2_V1 = `,,,,,,,,,,,,,"Navy Blue / M","POLO-N-M",2499,1999,100,TRUE,"https://example.com/navy1.jpg",0.3,30,20,5,"Color","Navy Blue","Size","M"`;
const P2_V2 = `,,,,,,,,,,,,,"Navy Blue / L","POLO-N-L",2499,1999,75,TRUE,"https://example.com/navy2.jpg",0.3,30,20,5,"Color","Navy Blue","Size","L"`;
const P2_V3 = `,,,,,,,,,,,,,"Charcoal Grey / M","POLO-G-M",2499,,0,FALSE,"https://example.com/grey1.jpg",0.3,30,20,5,"Color","Charcoal Grey","Size","M"`;

// The final template string
export const CSV_TEMPLATE = [
  CSV_TEMPLATE_HEADERS,
  "",
  "// --- INSTRUCTIONS ---",
  "// 1. The FIRST row for any new product MUST contain the main product details (title, slug, etc.). Variant columns for this row should be empty.",
  "// 2. ALL subsequent rows for that same product define its variants. Parent columns for these rows MUST be empty.",
  "// 3. A simple product is just a product with one variant.",
  "",
  "// --- EXAMPLE 1: A SIMPLE PRODUCT ---",
  P1_PARENT,
  P1_VARIANT,
  "",
  "// --- EXAMPLE 2: A VARIABLE PRODUCT ---",
  P2_PARENT,
  P2_V1,
  P2_V2,
  P2_V3,
  "",
].join("\n");