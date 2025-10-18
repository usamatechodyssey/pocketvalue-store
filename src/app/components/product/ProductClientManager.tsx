"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import SanityProduct, {
  ProductReview,
  ProductVariant,
  SanityImageObject,
} from "@/sanity/types/product_types";

import ProductInfo from "@/app/components/product/ProductInfo";
import ReviewsSection from "@/app/components/reviews/ReviewsSection";
import ProductDetailsTabs from "@/app/components/product/ProductDetailsTabs";
import ProductGallery from "@/app/components/product/ProductGallery";

interface Props {
  product: SanityProduct;
}

const REVIEWS_PER_PAGE = 5;

export default function ProductClientManager({
  product: initialProduct,
}: Props) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.defaultVariant || null
  );
  // Hum ab 'reviews' aur 'initialProduct.reviews' ko alag rakhenge
  const [reviews, setReviews] = useState<ProductReview[]>(
    initialProduct.reviews || []
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setProduct(initialProduct);
    setSelectedVariant(initialProduct.defaultVariant || null);
    // Jab bhi initialProduct badle, reviews ko us se sync karein
    setReviews(initialProduct.reviews || []);
    setCurrentPage(1);
  }, [initialProduct]);

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  };

  const imagesToShow: SanityImageObject[] = useMemo(() => {
    if (!product) return [];
    if (selectedVariant?.images && selectedVariant.images.length > 0)
      return selectedVariant.images;
    const colorAttribute = selectedVariant?.attributes.find(
      (attr) => attr.name.toLowerCase() === "color"
    );
    if (colorAttribute) {
      const variantWithImages = product.variants.find(
        (v) =>
          v.images &&
          v.images.length > 0 &&
          v.attributes.some(
            (a) =>
              a.name.toLowerCase() === "color" &&
              a.value === colorAttribute.value
          )
      );
      if (variantWithImages?.images) return variantWithImages.images;
    }
    return product.defaultVariant?.images || [];
  }, [selectedVariant, product]);
  const handleNewReview = (newReviewFromAction: ProductReview) => {
    // Step 1: Ek "Consistent Shape" wala object banayein
    const consistentNewReview: ProductReview = {
      ...newReviewFromAction,
      _id: newReviewFromAction._id || `temp-${Date.now()}`, // Temporary ID for optimistic update
      _createdAt: newReviewFromAction._createdAt || new Date().toISOString(),
      // Sab se ahem: 'reviewImage' ko hamesha 'null' set karein agar woh maujood na ho
      reviewImage: newReviewFromAction.reviewImage || undefined,
      // User object ko bhi hamesha consistent rakhein
      user: {
        name: newReviewFromAction.user?.name || "You",
        image: newReviewFromAction.user?.image || undefined,
      },
    };

    // Step 2: Optimistic UI Update (ab hamesha consistent data ke saath)
    const updatedReviews = [consistentNewReview, ...reviews];
    setReviews(updatedReviews);

    // Step 3: Baaqi sab kuch waisa hi rahega
    const newTotal = updatedReviews.length;
    const newSum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
    const newAverage = newSum / newTotal;
    setProduct((prev) => ({
      ...prev,
      rating: newAverage,
      reviewCount: newTotal,
    }));
    setCurrentPage(1);

    // Step 4: Server se refresh karein
    setTimeout(() => {
      router.refresh();
      console.log("Page data refreshed to sync with the server.");
    }, 500);
  };
  // === === === END OF FIX === === ===

  const averageRating = product.rating || 0;
  const totalReviews = product.reviewCount || reviews.length;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [reviews, currentPage]);

  return (
    <>
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery
          images={imagesToShow}
          videoUrl={product.videoUrl}
          productTitle={product.title}
        />
        <ProductInfo
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={handleVariantChange}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </div>

      {/* Lower Sections */}
      <ProductDetailsTabs product={product} selectedVariant={selectedVariant} />
      <ReviewsSection
        productId={product._id}
        allReviews={reviews}
        paginatedReviews={paginatedReviews}
        onNewReview={handleNewReview}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
