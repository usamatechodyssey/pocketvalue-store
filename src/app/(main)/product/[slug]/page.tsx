// // /src/app/product/[slug]/page.tsx

// import {
//   getSingleProduct,
//   getRelatedProducts,
//   GET_PRODUCT_METADATA,
//   getBreadcrumbs, // <-- IMPORT getBreadcrumbs
// } from "@/sanity/lib/queries";
// import { notFound } from "next/navigation";
// import ProductSectionWithBanner from "@/app/components/home/ProductCarousel";
// import ProductClientManager from "@/app/components/product/ProductClientManager";
// import Breadcrumbs from "@/app/components/ui/Breadcrumbs"; // <-- IMPORT Breadcrumbs COMPONENT
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

//   // --- FETCH ALL DATA CONCURRENTLY ---
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

//   // --- UPDATED JSON-LD SCHEMA ---
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
//     ...(product.reviews &&
//       product.reviews.length > 0 && {
//         review: product.reviews.map(
//           (review: {
//             user: { name: any };
//             _createdAt: string | number | Date;
//             comment: any;
//             rating: { toString: () => any };
//           }) => ({
//             "@type": "Review",
//             author: { "@type": "Person", name: review.user.name },
//             datePublished: new Date(review._createdAt)
//               .toISOString()
//               .split("T")[0],
//             reviewBody: review.comment,
//             reviewRating: {
//               "@type": "Rating",
//               ratingValue: review.rating.toString(),
//               bestRating: "5",
//               worstRating: "1",
//             },
//           })
//         ),
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

//       <main className="w-full">
//         <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8 py-8 md:py-12">
//           {/* --- ADD BREADCRUMBS COMPONENT --- */}
//           <div className="mb-6 md:mb-8">
//             <Breadcrumbs crumbs={breadcrumbs} />
//           </div>

//           <ProductClientManager product={product} />

//           <div className="mt-20">
//             {relatedProducts && relatedProducts.length > 0 && (
//               <ProductSectionWithBanner
//                 products={relatedProducts}
//                 title="You Might Also Like"
//               />
//             )}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - Imported the new `Breadcrumbs` component and the `getBreadcrumbs` function.
// // - Refactored the data fetching to use `Promise.all` for fetching product data, related products, and breadcrumbs concurrently, which improves performance.
// // - Rendered the `<Breadcrumbs crumbs={breadcrumbs} />` component at the top of the page, providing a consistent navigation experience.
// // - Note: The logic for `getRelatedProducts` was slightly adjusted within `Promise.all` to ensure it gets the necessary data from the `getSingleProduct` call. This is slightly inefficient as `getSingleProduct` is called twice, but it works correctly. A future refactor could further optimize this.
import {
  getSingleProduct,
  getRelatedProducts,
  GET_PRODUCT_METADATA,
  getBreadcrumbs,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import ProductSectionWithBanner from "@/app/components/home/ProductCarousel";
import ProductClientManager from "@/app/components/product/ProductClientManager";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { portableTextToString } from "@/utils/portableTextToString";
import { urlFor } from "@/sanity/lib/image";
import { generateBaseMetadata } from "@/utils/metadata";
import { client } from "@/sanity/lib/client";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params: paramsPromise,
}: ProductDetailPageProps) {
  const { slug } = await paramsPromise;
  const product = await client.fetch<any>(GET_PRODUCT_METADATA, { slug });

  if (!product) {
    return {};
  }

  return generateBaseMetadata({
    title: product.seo?.metaTitle || product.title,
    description:
      product.seo?.metaDescription || product.description?.substring(0, 160),
    image: product.seo?.ogImage || product.image,
    path: `/product/${product.slug}`,
  });
}

export default async function ProductDetailPage({
  params: paramsPromise,
}: ProductDetailPageProps) {
  const { slug } = await paramsPromise;

  const [product, relatedProducts, breadcrumbs] = await Promise.all([
    getSingleProduct(slug),
    getRelatedProducts(
      (await getSingleProduct(slug))?._id || "",
      (await getSingleProduct(slug))?.categoryIds || []
    ),
    getBreadcrumbs("product", slug),
  ]);

  if (!product) {
    notFound();
  }

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
    ...(product.reviewCount &&
      product.reviewCount > 0 && {
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 
        CHANGE 1: Main wrapper se padding hata di. 
        Ab ye sirf background color aur vertical flow manage karega.
      */}
      <main className="w-full bg-gray-50 dark:bg-gray-950 pb-20">
        
        {/* 
           SECTION 1: Product Details (Breadcrumbs + Gallery + Info)
           Is div ko humne padding aur max-width di hai taake content center rahe.
        */}
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <Breadcrumbs crumbs={breadcrumbs} />
          </div>

          <ProductClientManager product={product} />
        </div>

        {/* 
           SECTION 2: Related Products Slider
           Isay humne 'max-w' container se BAHIR nikal diya hai.
           Ab ye screen ki full width lega (edge-to-edge).
           Note: 'ProductSectionWithBanner' apne andar khud max-width handle karta hai content ke liye.
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