// app/product/[slug]/page.tsx (CORRECTED CODE)

import { getSingleProduct, getRelatedProducts } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import SanityProduct from "@/sanity/types/product_types";
import ProductSectionWithBanner from "@/app/components/home/ProductCarousel";
import ProductClientManager from "@/app/components/product/ProductClientManager";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  // FIX: Await params before destructuring
  const { slug } = await params;
  const product: SanityProduct = await getSingleProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return { title: `${product.title} | PocketValue` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // FIX: Await params before destructuring
  const { slug } = await params;
  const product: SanityProduct = await getSingleProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product._id,
    product.categoryIds || []
  );

  return (
    <main className="w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProductClientManager product={product} />

        {/* Related Products Section */}
        <div className="mt-20">
          {relatedProducts && relatedProducts.length > 0 && (
            <ProductSectionWithBanner
              products={relatedProducts}
              title="You Might Also Like"
            />
          )}
        </div>
      </div>
    </main>
  );
}
