// app/blog/page.tsx - SIRF STYLING UPDATE

import { getAllPosts } from "@/sanity/lib/queries";
import { Post } from "@/sanity/types/product_types";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// Helper function mein koi change nahi
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// === PostCard Component (Updated) ===
const PostCard = ({ post }: { post: Post }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block bg-surface-base border border-surface-border rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >
    <div className="relative w-full h-48">
      <Image
        src={urlFor(post.mainImage).url()}
        alt={post.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-6">
      <h2 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-2 h-14">
        {post.title}
      </h2>
      <p className="text-text-secondary mt-2 text-sm line-clamp-3 h-[60px]">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-input">
        {post.authorImage && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={urlFor(post.authorImage).url()}
              alt={post.authorName || "Author"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="font-semibold text-sm text-text-primary">
            {post.authorName}
          </p>
          <p className="text-xs text-text-subtle">
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

// === BlogPage Component (Updated) ===
export default async function BlogPage() {
  const posts: Post[] = await getAllPosts();

  return (
    <main className="bg-surface-ground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
            The PocketValue Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
            Insights, tips, and stories from our team to help you get the best
            value.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary py-20 bg-surface-base rounded-lg">
            No blog posts found. Check back soon!
          </p>
        )}
      </div>
    </main>
  );
}
