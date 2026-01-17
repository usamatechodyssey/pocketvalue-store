
// import {
//   getSingleProduct,
//   getRelatedProducts,
//   GET_PRODUCT_METADATA,
//   getBreadcrumbs,
// } from "@/sanity/lib/queries";
// import { notFound } from "next/navigation";
// import ProductSectionWithBanner from "@/app/components/home/ProductCarousel";
// import ProductClientManager from "@/app/components/product/ProductClientManager";
// import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
// import { portableTextToString } from "@/utils/portableTextToString";
// import { urlFor } from "@/sanity/lib/image";
// import { generateBaseMetadata } from "@/utils/metadata";
// import { client } from "@/sanity/lib/client";

// type ProductDetailPageProps = {
//   params: Promise<{ slug: string }>;
// };

// export async function generateMetadata({
//   params: paramsPromise,
// }: ProductDetailPageProps) {
//   const { slug } = await paramsPromise;
//   const product = await client.fetch<any>(GET_PRODUCT_METADATA, { slug });

//   if (!product) {
//     return {};
//   }

//   return generateBaseMetadata({
//     title: product.seo?.metaTitle || product.title,
//     description:
//       product.seo?.metaDescription || product.description?.substring(0, 160),
//     image: product.seo?.ogImage || product.image,
//     path: `/product/${product.slug}`,
//   });
// }

// export default async function ProductDetailPage({
//   params: paramsPromise,
// }: ProductDetailPageProps) {
//   const { slug } = await paramsPromise;

//   const [product, relatedProducts, breadcrumbs] = await Promise.all([
//     getSingleProduct(slug),
//     getRelatedProducts(
//       (await getSingleProduct(slug))?._id || "",
//       (await getSingleProduct(slug))?.categoryIds || []
//     ),
//     getBreadcrumbs("product", slug),
//   ]);

//   if (!product) {
//     notFound();
//   }

//   const jsonLd = {
//     "@context": "https://schema.org/",
//     "@type": "Product",
//     name: product.title,
//     description: portableTextToString(product.description),
//     image: product.defaultVariant?.images?.[0]
//       ? urlFor(product.defaultVariant.images[0]).url()
//       : "",
//     sku: product.defaultVariant?.sku || product._id,
//     brand: {
//       "@type": "Brand",
//       name: product.brand?.name || "PocketValue",
//     },
//     ...(product.reviewCount &&
//       product.reviewCount > 0 && {
//         aggregateRating: {
//           "@type": "AggregateRating",
//           ratingValue: product.rating?.toFixed(1) || "5",
//           reviewCount: product.reviewCount,
//         },
//       }),
//     offers: {
//       "@type": "Offer",
//       priceCurrency: "PKR",
//       price: product.defaultVariant?.salePrice || product.defaultVariant?.price,
//       availability: product.defaultVariant?.inStock
//         ? "https://schema.org/InStock"
//         : "https://schema.org/OutOfStock",
//       url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
//     },
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       {/* 
//         CHANGE 1: Main wrapper se padding hata di. 
//         Ab ye sirf background color aur vertical flow manage karega.
//       */}
//       <main className="w-full bg-gray-50 dark:bg-gray-950 pb-20">
        
//         {/* 
//            SECTION 1: Product Details (Breadcrumbs + Gallery + Info)
//            Is div ko humne padding aur max-width di hai taake content center rahe.
//         */}
//         <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 md:py-12">
//           <div className="mb-6 md:mb-8">
//             <Breadcrumbs crumbs={breadcrumbs} />
//           </div>

//           <ProductClientManager product={product} />
//         </div>

//         {/* 
//            SECTION 2: Related Products Slider
//            Isay humne 'max-w' container se BAHIR nikal diya hai.
//            Ab ye screen ki full width lega (edge-to-edge).
//            Note: 'ProductSectionWithBanner' apne andar khud max-width handle karta hai content ke liye.
//         */}
//         {relatedProducts && relatedProducts.length > 0 && (
//           <div className="w-full mt-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
//             <ProductSectionWithBanner
//               products={relatedProducts}
//               title="You Might Also Like"
//             />
//           </div>
//         )}
//       </main>
//     </>
//   );
// }
import {
  getSingleProduct,
  getRelatedProducts,
  getBreadcrumbs,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import ProductSectionWithBanner from "@/app/components/home/ProductCarousel";
import ProductClientManager from "@/app/components/product/ProductClientManager";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { portableTextToString } from "@/utils/portableTextToString";
import { urlFor } from "@/sanity/lib/image";
import { generateBaseMetadata } from "@/utils/metadata";
import { Metadata } from "next";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// =====================================================
// 🔥 FIXED: Added 'await' to generateBaseMetadata
// =====================================================
export async function generateMetadata({
  params: paramsPromise,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await paramsPromise;
  
  // Product fetch karein
  const product = await getSingleProduct(slug);

  if (!product) {
    return {};
  }

  // 1. Data Extract karein
  const title = product.seo?.metaTitle || product.title;
  const description = product.seo?.metaDescription || product.description ? portableTextToString(product.description).substring(0, 160) : "";
  
  // Image URL
  const imageUrl = product.seo?.ogImage 
    ? urlFor(product.seo.ogImage).width(1200).height(630).url()
    : product.defaultVariant?.images?.[0]
      ? urlFor(product.defaultVariant.images[0]).width(1200).height(630).url()
      : "";

  const price = product.defaultVariant?.salePrice || product.defaultVariant?.price || 0;
  const brand = product.brand?.name || "PocketValue";

  // 2. Dynamic OG Image URL
  const ogEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pocketvalue.pk'}/api/og`;
  const ogUrl = new URL(ogEndpoint);
  
  ogUrl.searchParams.set('title', title);
  ogUrl.searchParams.set('price', price.toLocaleString());
  ogUrl.searchParams.set('brand', brand);
  if (imageUrl) ogUrl.searchParams.set('image', imageUrl);

  // 🔥 FIX: Added 'await' here
  const baseMetadata = await generateBaseMetadata({
    title,
    description,
    image: imageUrl,
    path: `/product/${product.slug}`,
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph, // Ab ye error nahi dega
      title: title,
      description: description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      card: 'summary_large_image',
      images: [ogUrl.toString()],
    },
  };
}

// =====================================================
// 🛒 PRODUCT PAGE COMPONENT
// =====================================================
export default async function ProductDetailPage({
  params: paramsPromise,
}: ProductDetailPageProps) {
  const { slug } = await paramsPromise;

  // 1. Pehle Product Fetch karein (Kyunke Related Products ko ID chahiye)
  const product = await getSingleProduct(slug);

  if (!product) {
    notFound();
  }

  // 2. Baaki Data Parallel Fetch karein (Faster Performance)
  const [relatedProducts, breadcrumbs] = await Promise.all([
    getRelatedProducts(product._id, product.categoryIds || []),
    getBreadcrumbs("product", slug),
  ]);

  // 3. JSON-LD Schema (Google SEO ke liye)
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: portableTextToString(product.description),
    image: product.defaultVariant?.images?.[0]
      ? urlFor(product.defaultVariant.images[0]).url()
      : "",
    sku: product.defaultVariant?.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "PocketValue",
    },
    ...(product.reviewCount && product.reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating?.toFixed(1) || "5",
          reviewCount: product.reviewCount,
        },
      }),
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.defaultVariant?.salePrice || product.defaultVariant?.price,
      availability: product.defaultVariant?.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pocketvalue.pk'}/product/${product.slug}`,
    },
  };

  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 
        MAIN WRAPPER:
        - Padding hata di gayi hai taake design clean rahe.
        - Background color handle kiya gaya hai.
      */}
      <main className="w-full bg-gray-50 dark:bg-gray-950 pb-20">
        
        {/* 
           SECTION 1: Product Details (Breadcrumbs + Gallery + Info)
           - Max Width 1920px (Ultra Wide Screens ke liye)
           - Centered Content
        */}
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <Breadcrumbs crumbs={breadcrumbs} />
          </div>

          <ProductClientManager product={product} />
        </div>

        {/* 
           SECTION 2: Related Products Slider
           - Full Width (Edge-to-Edge)
           - White Background for Separation
        */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="w-full mt-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <ProductSectionWithBanner
              products={relatedProducts}
              title="You Might Also Like"
            />
          </div>
        )}
      </main>
    </>
  );
}