// app/actions/reviewActions.ts - FINAL CODE

"use server";

import { auth } from "@/app/auth";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { ProductReview } from "@/sanity/types/product_types"; // Type import karna zaroori hai

interface ReviewData {
  productId: string;
  rating: number;
  comment: string;
  reviewImageUrl?: string;
}

// Function ki return type ko update kiya gaya hai
export async function submitReview(data: ReviewData): Promise<{
    success: boolean;
    message: string;
    review?: ProductReview; // Yeh naya review object bhi wapis bhejega
}> {
  const session = await auth();
  if (!session?.user?.id || !session.user.name) {
    return { success: false, message: "You must be logged in to post a review." };
  }

  try {
    let reviewImagePayload;
    if (data.reviewImageUrl) {
      const imageAsset = await client.assets.upload('image', await fetch(data.reviewImageUrl).then(res => res.blob()));
      reviewImagePayload = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAsset._id }
      };
    }

    const newReview = {
      _type: 'review',
      user: {
        _type: 'object',
        id: session.user.id,
        name: session.user.name,
        image: session.user.image || undefined,
      },
      product: {
        _type: 'reference',
        _ref: data.productId,
      },
      rating: data.rating,
      comment: data.comment,
      ...(reviewImagePayload && { reviewImage: reviewImagePayload }),
      isApproved: true,
    };

    // 'create' function naya document wapis bhejta hai, usay 'createdReview' mein save karein
    const createdReview = await client.create(newReview);

    // Path ko revalidate karein taake agle visitors ko naya data mile
    const product = await client.getDocument(data.productId);
    if (product && 'slug' in product && typeof (product as any).slug.current === 'string') {
      revalidatePath(`/product/${(product as any).slug.current}`);
    }

    // Kamyabi ke response ke saath poora review object bhi wapis bhejein
    return {
      success: true,
      message: "Thank you! Your review has been submitted.",
      review: createdReview as ProductReview,
    };

  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, message: "Failed to submit review. Please try again." };
  }
}