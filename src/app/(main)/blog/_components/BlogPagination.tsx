// // /src/app/blog/_components/BlogPagination.tsx

// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import PaginationControls from "@/app/components/ui/PaginationControls";

// interface BlogPaginationProps {
//   totalPages: number;
// }

// export default function BlogPagination({ totalPages }: BlogPaginationProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const currentPage = Number(searchParams.get("page") || "1");

//   const handlePageChange = (page: number) => {
//     // Create a new URLSearchParams object to preserve existing query params
//     const params = new URLSearchParams(searchParams);
//     params.set("page", page.toString());
//     router.push(`/blog?${params.toString()}`);
//   };

//   return (
//     <PaginationControls
//       // currentPage={currentPage}
//       totalPages={totalPages}
//       // onPageChange={handlePageChange}
//     />
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - Created a new client component `BlogPagination` specifically for the blog page.
// // - It uses the `useRouter` and `useSearchParams` hooks to manage the current page and navigation.
// // - It wraps the generic `PaginationControls` component and provides the required `onPageChange` function, which correctly navigates to the new page URL.

"use client";

import PaginationControls from "@/app/components/ui/PaginationControls";

interface BlogPaginationProps {
  totalPages: number;
}

export default function BlogPagination({ totalPages }: BlogPaginationProps) {
  // Ab hamein yahan router ya searchParams ki zaroorat nahi 
  // kyunki PaginationControls khud URL handle kar raha hai.
  
  return (
    <PaginationControls totalPages={totalPages} />
  );
}