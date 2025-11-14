import Link from "next/link";
import Image from "next/image";
import {
  getPaginatedPosts,
  getBreadcrumbs,
  GET_TOTAL_POST_COUNT,
} from "@/sanity/lib/queries";
import { Post } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import { generateBaseMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import BlogPagination from "./_components/BlogPagination"; // <-- IMPORT NEW CLIENT WRAPPER
import { Calendar, UserCircle } from "lucide-react";
import { client } from "@/sanity/lib/client";
export async function generateMetadata(): Promise<Metadata> {
  return generateBaseMetadata({
    title: "The PocketValue Blog",
    description:
      "Insights, tips, and stories from our team to help you get the best value.",
    path: "/blog",
  });
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- NEW: Featured Post Card ---
const FeaturedPostCard = ({ post }: { post: Post }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-brand-primary/50 transition-all duration-300"
  >
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <Image
        src={urlFor(post.mainImage).url()}
        alt={post.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col h-full">
      <p className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
        Latest Post
      </p>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors line-clamp-3">
        {post.title}
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-base line-clamp-3 grow">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {post.authorImage ? (
          <Image
            src={urlFor(post.authorImage).url()}
            alt={post.authorName || "Author"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <UserCircle size={40} className="text-gray-400" />
        )}
        <div>
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
            {post.authorName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

// --- REDESIGNED: Standard Post Card ---
const PostCard = ({ post }: { post: Post }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
  >
    <div className="relative w-full aspect-video">
      <Image
        src={urlFor(post.mainImage).url()}
        alt={post.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-5 flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors line-clamp-2 grow">
        {post.title}
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 h-[60px]">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {post.authorImage ? (
          <Image
            src={urlFor(post.authorImage).url()}
            alt={post.authorName || "Author"}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <UserCircle size={32} className="text-gray-400" />
        )}
        <div>
          <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">
            {post.authorName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

const POSTS_PER_PAGE = 9;
// --- FIX: The page now correctly awaits the searchParams promise ---
export default async function BlogPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams?.page || "1");

  const [posts, totalPosts, breadcrumbs] = await Promise.all([
    getPaginatedPosts(page),
    client.fetch(GET_TOTAL_POST_COUNT),
    getBreadcrumbs("blog"),
  ]);

  const featuredPost = page === 1 ? posts?.[0] : undefined;
  const otherPosts = page === 1 ? posts?.slice(1) : posts;

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <main className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-screen-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <Breadcrumbs crumbs={breadcrumbs} />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            The PocketValue Blog
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Insights, tips, and stories from our team to help you get the best
            value.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-12">
            {featuredPost && (
              <section>
                <FeaturedPostCard post={featuredPost} />
              </section>
            )}

            {otherPosts && otherPosts.length > 0 && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post: Post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {totalPages > 1 && (
              <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
                <BlogPagination totalPages={totalPages} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No blog posts found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Critical Bug Fix:** Corrected the function signature to properly handle the `searchParams` promise, renaming it to `searchParamsPromise` for clarity.
// - **Await Promise:** Added `const searchParams = await searchParamsPromise;` at the beginning of the component to correctly unwrap the promise before accessing its `page` property. This resolves the crash.
// - **No Change to Imports:** The imports for `Breadcrumbs` and `getBreadcrumbs` were already correct from the previous step.```
