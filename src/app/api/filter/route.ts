
import { searchProducts } from "@/sanity/lib/queries";
import { NextRequest, NextResponse } from "next/server";

// Request body ka structure
interface FilterRequestBody {
  page?: number;
  sortOrder?: string;
  filters?: {
    brands?: string[];
    categories?: string[];
    isFeatured?: boolean; // Naya filter
    [key: string]: any;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  context: {
    type: 'category' | 'search' | 'deals';
    value?: string;
    // Context mein sort aur filter bhi receive karein taake initial load handle ho
    sort?: string;
    filter?: string;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FilterRequestBody = await request.json();
    
    // Initial sort order ko context se ya body se lein
    const sortOrder = body.sortOrder || body.context.sort || 'best-match';

    // Context filter ko bhi apply karein
    const filters = body.filters || {};
    if (body.context.filter === 'isFeatured') {
      filters.isFeatured = true;
    }

    const options = {
      searchTerm: body.context.type === 'search' ? body.context.value : undefined,
      categorySlug: body.context.type === 'category' ? body.context.value : undefined,
      filters: filters,
      minPrice: body.priceRange?.min,
      maxPrice: body.priceRange?.max,
      sortOrder: sortOrder,
      page: body.page || 1,
    };

    const results = await searchProducts(options);
    return NextResponse.json(results);

  } catch (error) {
    console.error("API Filter Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error processing filter request.", error: errorMessage }),
      { status: 500 }
    );
  }
}